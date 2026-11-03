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

  // 1. Check Cookie Vault
  const cookieVault = req.cookies.get("viralpulse_vault")?.value;
  if (cookieVault) {
    try {
      const parsed = JSON.parse(decodeURIComponent(cookieVault));
      settings = { ...settings, ...parsed };
    } catch (e) {}
  }

  // 2. Check Header Vault
  const headerVault = req.headers.get("x-client-vault");
  if (headerVault) {
    try {
      const parsed = JSON.parse(headerVault);
      settings = { ...settings, ...parsed };
    } catch (e) {}
  }

  // 3. Check Request Body Vault
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

  // 4. Fallback to process.env if empty
  if (!settings.apifyToken && process.env.APIFY_TOKEN) {
    settings.apifyToken = process.env.APIFY_TOKEN;
  }

  if (!settings.apifyToken || settings.apifyToken.includes("••••")) {
    return NextResponse.json(
      {
        error:
          "Apify API Token not configured or invalid. Please open the Settings & APIs tab, paste your Apify token, and click 'Save & Sync to Backend'.",
      },
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
    console.log(`[Cron Job] Synthesized ${concepts.length} fresh video concepts with hooks.`);

    // Persist new concepts to calendar storage
    await db.saveCalendarConcepts(concepts);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      stats: {
        competitorsMonitored: competitors.length,
        postsAnalyzed: scrapedPosts.length,
        conceptsGenerated: concepts.length,
      },
      concepts,
    });
  } catch (err: any) {
    console.error("[Cron Job] Execution failed:", err);
    return NextResponse.json(
      {
        error: "Automation run failed: " + (err.response?.data?.error?.message || err.message),
      },
      { status: 500 }
    );
  }
}
