import { ApifyClient } from "apify-client";
import { CompetitorTarget, ScrapedPost } from "./types";

export class DualPlatformScraper {
  private client: ApifyClient;

  constructor(token: string) {
    if (!token) {
      throw new Error("Apify API Token is missing. Please configure it in Settings.");
    }
    this.client = new ApifyClient({ token });
  }

  /**
   * Scrapes Instagram competitors using Apify's Instagram Scraper Actor.
   */
  async scrapeInstagram(targets: CompetitorTarget[], maxPostsPerUser = 5): Promise<ScrapedPost[]> {
    const results: ScrapedPost[] = [];
    const usernames = targets
      .filter((t) => t.platform === "instagram" && t.active)
      .map((t) => t.handle.replace("@", "").trim())
      .filter(Boolean);

    if (usernames.length === 0) return results;

    console.log(`[Apify Scraper] Scraping Instagram for: ${usernames.join(", ")}`);

    try {
      // apify/instagram-post-scraper is optimized for speed, engagement metrics, and captions
      const run: any = await this.client.actor("apify/instagram-post-scraper").call({
        username: usernames,
        resultsLimit: maxPostsPerUser * usernames.length,
        dataDetailLevel: "basicData",
      });

      if (!run || !run.defaultDatasetId) return results;

      const { items } = await this.client.dataset(run.defaultDatasetId).listItems();

      for (const item of items as any[]) {
        if (!item || item.error) continue;

        const comments = (item.latestComments || [])
          .map((c: any) => (typeof c === "string" ? c : c.text))
          .filter(Boolean)
          .slice(0, 8);

        results.push({
          id: String(item.id || item.shortCode || Math.random()),
          platform: "instagram",
          url: item.url || `https://www.instagram.com/p/${item.shortCode}/`,
          authorHandle: item.ownerUsername || usernames[0],
          caption: item.caption || "",
          transcript: item.alt || item.caption || "",
          views: Number(item.videoViewCount || item.videoPlayCount || 0),
          likes: Number(item.likesCount || 0),
          commentsCount: Number(item.commentsCount || 0),
          sampleComments: comments,
          publishedAt: item.timestamp,
        });
      }
    } catch (err: any) {
      console.error("[Apify Scraper] Instagram scrape failed:", err.message);
      throw err;
    }

    return results;
  }

  /**
   * Scrapes TikTok competitors using Clockworks' TikTok Scraper Actor.
   */
  async scrapeTikTok(targets: CompetitorTarget[], maxVideosPerUser = 5): Promise<ScrapedPost[]> {
    const results: ScrapedPost[] = [];
    const profiles = targets
      .filter((t) => t.platform === "tiktok" && t.active)
      .map((t) => {
        const handle = t.handle.startsWith("@") ? t.handle : `@${t.handle}`;
        return `https://www.tiktok.com/${handle}`;
      });

    if (profiles.length === 0) return results;

    console.log(`[Apify Scraper] Scraping TikTok for: ${profiles.join(", ")}`);

    try {
      const run: any = await this.client.actor("clockworks/tiktok-scraper").call({
        profiles: profiles,
        resultsPerPage: maxVideosPerUser,
        shouldDownloadVideos: false,
        shouldDownloadCovers: false,
      });

      if (!run || !run.defaultDatasetId) return results;

      const { items } = await this.client.dataset(run.defaultDatasetId).listItems();

      for (const item of items as any[]) {
        if (!item) continue;

        results.push({
          id: String(item.id || item.videoId || Math.random()),
          platform: "tiktok",
          url: item.webVideoUrl || item.videoUrl || "",
          authorHandle: item.authorMeta?.name || item.author || "tiktok_creator",
          caption: item.text || item.desc || "",
          transcript: item.transcript || item.text || "",
          views: Number(item.playCount || 0),
          likes: Number(item.diggCount || item.likes || 0),
          commentsCount: Number(item.commentCount || 0),
          sampleComments: [],
          publishedAt: item.createTimeISO || new Date().toISOString(),
        });
      }
    } catch (err: any) {
      console.error("[Apify Scraper] TikTok scrape failed:", err.message);
      // Non-fatal if only one platform fails
    }

    return results;
  }

  /**
   * Runs the dual scraper across all configured active targets.
   */
  async runDualScrape(targets: CompetitorTarget[]): Promise<ScrapedPost[]> {
    const [igPosts, ttPosts] = await Promise.allSettled([
      this.scrapeInstagram(targets),
      this.scrapeTikTok(targets),
    ]);

    const allPosts: ScrapedPost[] = [];
    if (igPosts.status === "fulfilled") allPosts.push(...igPosts.value);
    if (ttPosts.status === "fulfilled") allPosts.push(...ttPosts.value);

    return allPosts;
  }
}
