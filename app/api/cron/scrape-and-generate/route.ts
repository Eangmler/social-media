import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/store";
import { DualPlatformScraper } from "@/lib/apify";
import { AiContentEngine } from "@/lib/ai";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  return handleScrapeAndGenerate(req);
}

export async function POST(req: NextRequest) {
  return handleScrapeAndGenerate(req);
}

async function handleScrapeAndGenerate(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    const url = new URL(req.url);
    const keyParam = url.searchParams.get("key");
    if (keyParam !== cronSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  let settings = await db.getSettings();

  // If client passed vault in body, merge it with priority
  if (req.method === "POST") {
    try {
      const body = await req.clone().json();
      if (body?.vault) {
        settings = { ...settings, ...body.vault };
      }
    } catch (e) {
      // Body may be empty on pure cron triggers
    }
  }

  if (!settings.apifyToken) {
    return NextResponse.json(
      { error: "Apify API Token not configured. Please add your token in the Admin Settings tab." },
      { status: 400 }
    );
  }

  const competitors = (await db.getCompetitors()).filter((c) => c.active);
  if (competitors.length === 0) {
    return NextResponse.json(
      { error: "No active competitor targets found to scrape. Please add targets in the Competitors tab." },
      { status: 400 }
    );
  }

  console.log(`[Cron Job] Starting automated weekly cycle for ${competitors.length} competitors...`);

  try {
    const scraper = new DualPlatformScraper(settings.apifyToken);
    const scrapedPosts = await scraper.runDualScrape(competitors);
    console.log(`[Cron Job] Scraped ${scrapedPosts.length} posts across Instagram and TikTok.`);

    const aiEngine = new AiContentEngine(settings);
    const concepts = await aiEngine.generateCalendarConcepts(scrapedPosts);
    console.log(`[Cron Job] Generated ${concepts.length} viral video concepts.`);

    await db.saveCalendarConcepts(concepts);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      stats: {
        competitorsTargeted: competitors.length,
        postsAnalyzed: scrapedPosts.length,
        conceptsGenerated: concepts.length,
      },
      concepts,
    });
  } catch (err: any) {
    console.error("[Cron Job] Workflow execution failed:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to execute automated scraping and generation.",
      },
      { status: 500 }
    );
  }
}
