export type SocialPlatform = "instagram" | "tiktok";

export interface AppSettings {
  apifyToken: string;
  aiProvider: "openai" | "gemini";
  openaiApiKey?: string;
  geminiApiKey?: string;
  metaAppId?: string;
  metaAppSecret?: string;
  metaAccessToken?: string;
  metaPageId?: string;
  instagramAccountId?: string;
  metaWebhookVerifyToken?: string;
  tiktokAppId?: string;
  tiktokAppSecret?: string;
  tiktokAccessToken?: string;
  tiktokOpenId?: string;
  tiktokWebhookVerifyToken?: string;
  dmTriggerKeyword: string;
  dmResponseTemplate: string;
  dmTargetUrl: string;
}

export interface CompetitorTarget {
  id: string;
  platform: SocialPlatform;
  handle: string;
  profileUrl: string;
  category?: string;
  active: boolean;
  lastScrapedAt?: string;
}

export interface ScrapedPost {
  id: string;
  platform: SocialPlatform;
  url: string;
  authorHandle: string;
  caption: string;
  transcript?: string;
  views: number;
  likes: number;
  commentsCount: number;
  sampleComments: string[];
  publishedAt?: string;
}

export interface ContentConcept {
  id: string;
  dayOfWeek: string;
  targetPlatform: SocialPlatform | "both";
  angle: string;
  viralPattern: string;
  hook: string;
  bodyOutline: string;
  callToAction: string;
  caption: string;
  hashtags: string[];
  recommendedPostTimeGMT: string;
  status: "draft" | "ready_to_record" | "ready_to_publish" | "published";
  createdAt: string;
}

export interface PublishJob {
  id: string;
  platform: SocialPlatform;
  videoUrl: string;
  hook: string;
  caption: string;
  status: "queued" | "processing" | "published" | "failed";
  platformPostId?: string;
  errorMessage?: string;
  publishedAt?: string;
  createdAt: string;
}

export interface DmLog {
  id: string;
  platform: SocialPlatform;
  senderId: string;
  senderUsername?: string;
  commentText: string;
  matchedKeyword: string;
  sentMessage: string;
  timestamp: string;
  status: "sent" | "failed";
  error?: string;
}
