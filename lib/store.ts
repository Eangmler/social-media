import fs from "fs";
import path from "path";
import axios from "axios";
import { AppSettings, CompetitorTarget, ContentConcept, PublishJob, DmLog } from "./types";

interface DBData {
  settings: AppSettings;
  competitors: CompetitorTarget[];
  calendar: ContentConcept[];
  publishJobs: PublishJob[];
  dmLogs: DmLog[];
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "store.json");

const defaultSettings: AppSettings = {
  apifyToken: process.env.APIFY_TOKEN || "",
  aiProvider: (process.env.AI_PROVIDER as "openai" | "gemini") || "openai",
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  metaAppId: process.env.META_APP_ID || "",
  metaAppSecret: process.env.META_APP_SECRET || "",
  metaAccessToken: process.env.META_ACCESS_TOKEN || "",
  metaPageId: process.env.META_PAGE_ID || "",
  instagramAccountId: process.env.INSTAGRAM_ACCOUNT_ID || "",
  metaWebhookVerifyToken: process.env.META_WEBHOOK_VERIFY_TOKEN || "viralsaas_meta_verify_token",
  tiktokAppId: process.env.TIKTOK_APP_ID || "",
  tiktokAppSecret: process.env.TIKTOK_APP_SECRET || "",
  tiktokAccessToken: process.env.TIKTOK_ACCESS_TOKEN || "",
  tiktokOpenId: process.env.TIKTOK_OPEN_ID || "",
  tiktokWebhookVerifyToken: process.env.TIKTOK_WEBHOOK_VERIFY_TOKEN || "viralsaas_tiktok_verify_token",
  dmTriggerKeyword: process.env.DM_DEFAULT_TRIGGER_KEYWORD || "LINK",
  dmResponseTemplate:
    process.env.DM_DEFAULT_RESPONSE_TEMPLATE ||
    "Hey! Thanks for your comment on our video. Here is the link you requested: {{link}}",
  dmTargetUrl: process.env.DM_DEFAULT_TARGET_URL || "https://kisseh.com/thinkoutloud",
  kvRestApiUrl: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "",
  kvRestApiToken: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "",
  vercelAuthToken: process.env.VERCEL_AUTH_TOKEN || "",
  vercelProjectId: process.env.VERCEL_PROJECT_ID || "",
  vercelTeamId: process.env.VERCEL_TEAM_ID || "",
};

const defaultCompetitors: CompetitorTarget[] = [
  {
    id: "comp-1",
    platform: "instagram",
    handle: "danmartell",
    profileUrl: "https://www.instagram.com/danmartell/",
    category: "SaaS & High-Performance Business",
    active: true,
  },
  {
    id: "comp-2",
    platform: "instagram",
    handle: "hertz_fauzan",
    profileUrl: "https://www.instagram.com/hertz_fauzan/",
    category: "Visual Storytelling & Filmmaking",
    active: true,
  },
  {
    id: "comp-3",
    platform: "tiktok",
    handle: "@danmartell",
    profileUrl: "https://www.tiktok.com/@danmartell",
    category: "Short-form SaaS Advice",
    active: true,
  },
];

let inMemoryData: DBData = {
  settings: defaultSettings,
  competitors: defaultCompetitors,
  calendar: [],
  publishJobs: [],
  dmLogs: [],
};

/**
 * Reads data with priority:
 * 1. Remote Cloud KV (Upstash / Vercel KV) if configured
 * 2. Local File (.data/store.json)
 * 3. In-memory cache + environment variables
 */
async function readData(): Promise<DBData> {
  const kvUrl = inMemoryData.settings.kvRestApiUrl || process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = inMemoryData.settings.kvRestApiToken || process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (kvUrl && kvToken) {
    try {
      const res = await axios.get(`${kvUrl}/get/viralpulse_data`, {
        headers: { Authorization: `Bearer ${kvToken}` },
        timeout: 4000,
      });
      if (res.data?.result) {
        const parsed = typeof res.data.result === "string" ? JSON.parse(res.data.result) : res.data.result;
        inMemoryData = {
          ...inMemoryData,
          ...parsed,
          settings: {
            ...defaultSettings,
            ...(parsed.settings || {}),
          },
        };
        return inMemoryData;
      }
    } catch (err: any) {
      console.warn("[Storage] Cloud KV read failed, using local store:", err.message);
    }
  }

  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      inMemoryData = {
        ...inMemoryData,
        ...parsed,
        settings: {
          ...defaultSettings,
          ...(parsed.settings || {}),
        },
      };
      return inMemoryData;
    }
  } catch (err) {
    console.warn("[Storage] Local file read failed, using memory:", err);
  }

  return inMemoryData;
}

/**
 * Writes data with persistence to:
 * 1. In-memory
 * 2. Local file (if local disk is writable)
 * 3. Cloud KV (if KV_REST_API_URL & KV_REST_API_TOKEN are configured)
 */
async function writeData(data: DBData): Promise<void> {
  inMemoryData = data;

  // Local file write
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    // Read-only environment on Vercel lambda is expected
  }

  // Cloud KV write
  const kvUrl = data.settings.kvRestApiUrl || process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = data.settings.kvRestApiToken || process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (kvUrl && kvToken) {
    try {
      await axios.post(
        `${kvUrl}/set/viralpulse_data`,
        JSON.stringify(data),
        {
          headers: {
            Authorization: `Bearer ${kvToken}`,
            "Content-Type": "application/json",
          },
          timeout: 4000,
        }
      );
      console.log("[Storage] Successfully synced state to Cloud KV.");
    } catch (err: any) {
      console.warn("[Storage] Cloud KV write failed:", err.message);
    }
  }
}

/**
 * Optional Vercel API Sync:
 * Automatically pushes updated settings directly to Vercel Project Environment Variables.
 */
async function syncToVercelEnv(settings: AppSettings): Promise<void> {
  const token = settings.vercelAuthToken || process.env.VERCEL_AUTH_TOKEN;
  const projectId = settings.vercelProjectId || process.env.VERCEL_PROJECT_ID;
  const teamId = settings.vercelTeamId || process.env.VERCEL_TEAM_ID;

  if (!token || !projectId) return;

  const envMap: Record<string, string | undefined> = {
    APIFY_TOKEN: settings.apifyToken,
    AI_PROVIDER: settings.aiProvider,
    OPENAI_API_KEY: settings.openaiApiKey,
    GEMINI_API_KEY: settings.geminiApiKey,
    META_ACCESS_TOKEN: settings.metaAccessToken,
    INSTAGRAM_ACCOUNT_ID: settings.instagramAccountId,
    META_APP_ID: settings.metaAppId,
    META_APP_SECRET: settings.metaAppSecret,
    META_WEBHOOK_VERIFY_TOKEN: settings.metaWebhookVerifyToken,
    TIKTOK_ACCESS_TOKEN: settings.tiktokAccessToken,
    TIKTOK_APP_ID: settings.tiktokAppId,
    TIKTOK_APP_SECRET: settings.tiktokAppSecret,
    TIKTOK_OPEN_ID: settings.tiktokOpenId,
    DM_DEFAULT_TRIGGER_KEYWORD: settings.dmTriggerKeyword,
    DM_DEFAULT_TARGET_URL: settings.dmTargetUrl,
  };

  const teamQuery = teamId ? `?teamId=${teamId}` : "";

  console.log(`[Vercel Sync] Pushing updated credentials directly to Vercel Project: ${projectId}`);

  for (const [key, val] of Object.entries(envMap)) {
    if (!val || val.includes("••••")) continue;

    try {
      await axios.post(
        `https://api.vercel.com/v10/projects/${projectId}/env${teamQuery}`,
        {
          key,
          value: val,
          type: "encrypted",
          target: ["production", "preview", "development"],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err: any) {
      // If variable already exists, update it via PATCH
      if (err.response?.status === 400 || err.response?.data?.error?.code === "ENV_ALREADY_EXISTS") {
        try {
          const listRes = await axios.get(
            `https://api.vercel.com/v9/projects/${projectId}/env${teamQuery}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const existing = listRes.data?.envs?.find((e: any) => e.key === key);
          if (existing?.id) {
            await axios.patch(
              `https://api.vercel.com/v9/projects/${projectId}/env/${existing.id}${teamQuery}`,
              { value: val },
              { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );
          }
        } catch (patchErr) {
          // ignore error
        }
      }
    }
  }
}

export const db = {
  getSettings: async (): Promise<AppSettings> => {
    const data = await readData();
    return data.settings;
  },

  updateSettings: async (newSettings: Partial<AppSettings>): Promise<AppSettings> => {
    const data = await readData();
    data.settings = { ...data.settings, ...newSettings };
    await writeData(data);

    // If Vercel credentials are provided, sync directly to Vercel Environment Variables
    if (data.settings.vercelAuthToken && data.settings.vercelProjectId) {
      syncToVercelEnv(data.settings).catch((err) =>
        console.warn("[Vercel Sync] Background sync error:", err.message)
      );
    }

    return data.settings;
  },

  getCompetitors: async (): Promise<CompetitorTarget[]> => {
    const data = await readData();
    return data.competitors;
  },

  addCompetitor: async (competitor: Omit<CompetitorTarget, "id">): Promise<CompetitorTarget> => {
    const data = await readData();
    const newEntry: CompetitorTarget = {
      ...competitor,
      id: "comp-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
    };
    data.competitors.push(newEntry);
    await writeData(data);
    return newEntry;
  },

  deleteCompetitor: async (id: string): Promise<void> => {
    const data = await readData();
    data.competitors = data.competitors.filter((c) => c.id !== id);
    await writeData(data);
  },

  toggleCompetitor: async (id: string): Promise<CompetitorTarget | undefined> => {
    const data = await readData();
    const target = data.competitors.find((c) => c.id === id);
    if (target) {
      target.active = !target.active;
      await writeData(data);
    }
    return target;
  },

  getCalendar: async (): Promise<ContentConcept[]> => {
    const data = await readData();
    return data.calendar;
  },

  saveCalendarConcepts: async (concepts: ContentConcept[]): Promise<void> => {
    const data = await readData();
    data.calendar = concepts;
    await writeData(data);
  },

  updateConceptStatus: async (
    id: string,
    status: ContentConcept["status"]
  ): Promise<ContentConcept | undefined> => {
    const data = await readData();
    const item = data.calendar.find((c) => c.id === id);
    if (item) {
      item.status = status;
      await writeData(data);
    }
    return item;
  },

  getPublishJobs: async (): Promise<PublishJob[]> => {
    const data = await readData();
    return data.publishJobs;
  },

  addPublishJob: async (job: Omit<PublishJob, "id" | "createdAt">): Promise<PublishJob> => {
    const data = await readData();
    const newJob: PublishJob = {
      ...job,
      id: "pub-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      createdAt: new Date().toISOString(),
    };
    data.publishJobs.unshift(newJob);
    await writeData(data);
    return newJob;
  },

  updatePublishJob: async (id: string, updates: Partial<PublishJob>): Promise<void> => {
    const data = await readData();
    const job = data.publishJobs.find((j) => j.id === id);
    if (job) {
      Object.assign(job, updates);
      await writeData(data);
    }
  },

  getDmLogs: async (): Promise<DmLog[]> => {
    const data = await readData();
    return data.dmLogs;
  },

  addDmLog: async (log: Omit<DmLog, "id" | "timestamp">): Promise<DmLog> => {
    const data = await readData();
    const newLog: DmLog = {
      ...log,
      id: "dm-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      timestamp: new Date().toISOString(),
    };
    data.dmLogs.unshift(newLog);
    if (data.dmLogs.length > 100) {
      data.dmLogs = data.dmLogs.slice(0, 100);
    }
    await writeData(data);
    return newLog;
  },
};
