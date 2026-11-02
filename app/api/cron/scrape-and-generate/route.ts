import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/store";
import { DualPlatformScraper } from "@/lib/apify";
import { AiContentEngine } from "@/lib/ai";

export const maxDuration = 300; // Vercel 5-minute timeout for scraping and LLM processing
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

  // Protect route in production if CRON_SECRET is configured
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    const url = new URL(req.url);
    const keyParam = url.searchParams.get("key");
    if (keyParam !== cronSecret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const settings = db.getSettings();
  if (!settings.apifyToken) {
    return NextResponse.json(
      { error: "Apify API Token not configured. Please add your token in Settings." },
      { status: 400 }
    );
  }

  const competitors = db.getCompetitors().filter((c) => c.active);
  if (competitors.length === 0) {
    return NextResponse.json(
      { error: "No active competitor targets found to scrape. Please add targets in the Competitors tab." },
      { status: 400 }
    );
  }

  console.log(`[Cron Job] Starting automated weekly cycle for ${competitors.length} competitors...`);

  try {
    // 1. Dual-Platform Scraper Layer
    const scraper = new DualPlatformScraper(settings.apifyToken);
    const scrapedPosts = await scraper.runDualScrape(competitors);
    console.log(`[Cron Job] Scraped ${scrapedPosts.length} posts across Instagram and TikTok.`);

    // 2. AI Content Engine Layer
    const aiEngine = new AiContentEngine(settings);
    const concepts = await aiEngine.generateCalendarConcepts(scrapedPosts);
    console.log(`[Cron Job] Generated ${concepts.length} viral video concepts.`);

    // 3. Save to database
    db.saveCalendarConcepts(concepts);

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
