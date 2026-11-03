import axios from "axios";
import { AppSettings, ContentConcept, ScrapedPost } from "./types";

export class AiContentEngine {
  private settings: AppSettings;

  constructor(settings: AppSettings) {
    this.settings = settings;
  }

  /**
   * Analyzes scraped posts from Instagram and TikTok, detects viral retention patterns,
   * and generates a 5-day content calendar with high-converting hooks.
   */
  async generateCalendarConcepts(scrapedPosts: ScrapedPost[]): Promise<ContentConcept[]> {
    const summaryData = scrapedPosts.map((p) => ({
      platform: p.platform,
      creator: p.authorHandle,
      views: p.views,
      likes: p.likes,
      comments: p.commentsCount,
      caption: p.caption.slice(0, 300),
      transcript: p.transcript?.slice(0, 300),
      sampleAudienceReactions: p.sampleComments.slice(0, 4),
    }));

    const systemPrompt = `You are a world-class viral short-form content director and strategist specializing in Instagram Reels and TikTok.
You study high-performing creators like Dan Martell, Alex Hormozi, and top digital founders.
Your job is to analyze scraped competitor data, identify viral hooks and psychological triggers (curiosity gaps, confrontational statements, hard truths, contrasting dualities), and generate a 5-day actionable content calendar for Monday through Friday.

Output MUST be a strict, valid JSON array of 5 objects matching this TypeScript structure:
[
  {
    "dayOfWeek": "Monday",
    "targetPlatform": "both",
    "angle": "Mindset / Hard Truths",
    "viralPattern": "Confrontational Question + Unseen Work",
    "hook": "The punchy 1-line opening hook (under 12 words) spoken in the first 2 seconds",
    "bodyOutline": "Bullet 1: Introduce the friction point\\nBullet 2: Contrast the amateur mistake with pro mindset\\nBullet 3: Provide tactical takeaway",
    "callToAction": "Drop the keyword 'LINK' in the comments to get our full blueprint.",
    "caption": "Full Instagram/TikTok caption including spacing and conversational tone.",
    "hashtags": ["#ThinkOutLoud", "#MindsetShift", "#Discipline", "#CreatorEconomy"],
    "recommendedPostTimeGMT": "17:30"
  }
]`;

    const userPrompt = `Here is the data from our recent competitor scrape (${scrapedPosts.length} posts):
${JSON.stringify(summaryData, null, 2)}

Analyze what made these top posts get views and comments. Then synthesize these insights into 5 brand-new, original, high-performing video concepts with unforgettable hooks. Ensure every concept has a direct Call-To-Action instructing viewers to comment the trigger word '${this.settings.dmTriggerKeyword}'.`;

    let rawJsonResponse = "";

    if (this.settings.aiProvider === "gemini" && this.settings.geminiApiKey) {
      rawJsonResponse = await this.callGemini(systemPrompt, userPrompt);
    } else if (this.settings.openaiApiKey) {
      rawJsonResponse = await this.callOpenAI(systemPrompt, userPrompt);
    } else if (this.settings.geminiApiKey) {
      rawJsonResponse = await this.callGemini(systemPrompt, userPrompt);
    } else {
      // Fallback generator if no AI keys are configured yet so the user can test immediately
      return this.generateFallbackConcepts();
    }

    try {
      // Clean potential markdown code blocks
      const cleaned = rawJsonResponse
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();
      const parsed = JSON.parse(cleaned) as any[];

      return parsed.map((item, idx) => ({
        id: `concept-${Date.now()}-${idx}`,
        dayOfWeek: item.dayOfWeek || `Day ${idx + 1}`,
        targetPlatform: item.targetPlatform || "both",
        angle: item.angle || "Viral Growth",
        viralPattern: item.viralPattern || "Pattern Interrupt",
        hook: item.hook || "Stop making this mistake if you want real results.",
        bodyOutline: item.bodyOutline || "3 key tactical points.",
        callToAction: item.callToAction || `Comment ${this.settings.dmTriggerKeyword} below!`,
        caption: item.caption || item.hook,
        hashtags: Array.isArray(item.hashtags) ? item.hashtags : ["#business", "#growth"],
        recommendedPostTimeGMT: item.recommendedPostTimeGMT || "17:00",
        status: "ready_to_record",
        createdAt: new Date().toISOString(),
      }));
    } catch (err: any) {
      console.error("[AI Engine] Failed to parse JSON from LLM:", err.message, rawJsonResponse);
      return this.generateFallbackConcepts();
    }
  }

  private async callOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt + "\nRespond with a root key 'concepts' containing the array." },
          { role: "user", content: userPrompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${this.settings.openaiApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = res.data.choices[0]?.message?.content || "";
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed.concepts)) {
        return JSON.stringify(parsed.concepts);
      }
      return content;
    } catch {
      return content;
    }
  }

  private async callGemini(systemPrompt: string, userPrompt: string): Promise<string> {
    const candidateModels = [
      "gemini-1.5-flash",
      "gemini-1.5-flash-latest",
      "gemini-2.0-flash",
      "gemini-1.5-pro",
      "gemini-1.5-pro-latest",
    ];

    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.settings.geminiApiKey}`;
        const res = await axios.post(
          url,
          {
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `${systemPrompt}\n\nTask:\n${userPrompt}\n\nRespond ONLY with the JSON array.`,
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.7,
            },
          },
          {
            headers: { "Content-Type": "application/json" },
            timeout: 30000,
          }
        );

        const text = res.data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          console.log(`[Gemini Engine] Successfully generated concepts using ${model}.`);
          return text;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[Gemini Engine] Model ${model} failed, trying next fallback:`, err.response?.data?.error?.message || err.message);
      }
    }

    throw lastError || new Error("All Gemini models failed to generate content.");
  }

  private generateFallbackConcepts(): ContentConcept[] {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const fallbackTemplates = [
      {
        angle: "Discipline & High Performance",
        viralPattern: "Axiom + Real-world proof (Dan Martell Style)",
        hook: "Discipline in one area of your life quietly spills over into everything else.",
        bodyOutline: "1. The 5k rule vs the 240km marathon mentality.\n2. Why the unseen work before the launch defines the stage.\n3. The reward is hidden inside the work you're currently avoiding.",
        recommendedPostTimeGMT: "17:30",
      },
      {
        angle: "Hard Truths vs Waiters",
        viralPattern: "Confrontational Dichotomy",
        hook: "You can't negotiate with success. Are you working or waiting for it to be easy?",
        bodyOutline: "1. Why 99% of people quit right before the inflection point.\n2. Being 'delusional' enough to put in the work.\n3. How doing the hard thing always compounds.",
        recommendedPostTimeGMT: "18:00",
      },
      {
        angle: "Cultural & Generational Shifts",
        viralPattern: "Contrasting Duality / Vulnerable Observation",
        hook: "Maybe our parents understood something about commitment that we've completely forgotten.",
        bodyOutline: "1. Friction vs convenience in modern creative partnerships.\n2. Enduring the uncomfortable phases.\n3. The secret behind long-term collaborative wins.",
        recommendedPostTimeGMT: "16:45",
      },
      {
        angle: "Behind The Scenes Execution",
        viralPattern: "Humor & High-Status Subversion",
        hook: "We missed the award this year, which means the committee missed out on a masterpiece.",
        bodyOutline: "1. Turning a near-miss into your strongest fuel.\n2. Unfiltered appreciation for the real builders in the room.\n3. Why public validation never beats internal mastery.",
        recommendedPostTimeGMT: "12:15",
      },
      {
        angle: "Product / Anthem Launch",
        viralPattern: "Direct Community Announcement + Local Pride",
        hook: "Accra We Dey: The official soundtrack to building without permission.",
        bodyOutline: "1. Celebrating the raw energy of urban creation.\n2. Collaborating with top artists.\n3. How culture drives global attention.",
        recommendedPostTimeGMT: "19:00",
      },
    ];

    return days.map((day, i) => {
      const template = fallbackTemplates[i];
      return {
        id: `concept-fallback-${i + 1}`,
        dayOfWeek: day,
        targetPlatform: "both",
        angle: template.angle,
        viralPattern: template.viralPattern,
        hook: template.hook,
        bodyOutline: template.bodyOutline,
        callToAction: `Comment '${this.settings.dmTriggerKeyword}' below and I'll DM you the private guide!`,
        caption: `${template.hook}\n\n${template.bodyOutline}\n\nBe honest with yourself... what are you holding back on?\n\nComment '${this.settings.dmTriggerKeyword}' and I'll send you the blueprint directly. 👇🏾`,
        hashtags: ["#ThinkOutLoud", "#MindsetShift", "#Discipline", "#CreatorEconomy", "#BuildInPublic"],
        recommendedPostTimeGMT: template.recommendedPostTimeGMT,
        status: "ready_to_record",
        createdAt: new Date().toISOString(),
      };
    });
  }
}
