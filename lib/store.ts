import fs from "fs";
import path from "path";
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

function readData(): DBData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      return {
        ...inMemoryData,
        ...parsed,
        settings: {
          ...defaultSettings,
          ...(parsed.settings || {}),
        },
      };
    }
  } catch (err) {
    console.warn("Could not read local store file, falling back to memory:", err);
  }
  return inMemoryData;
}

function writeData(data: DBData): void {
  inMemoryData = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not write to local store file (read-only environment):", err);
  }
}

export const db = {
  getSettings: (): AppSettings => {
    return readData().settings;
  },

  updateSettings: (newSettings: Partial<AppSettings>): AppSettings => {
    const data = readData();
    data.settings = { ...data.settings, ...newSettings };
    writeData(data);
    return data.settings;
  },

  getCompetitors: (): CompetitorTarget[] => {
    return readData().competitors;
  },

  addCompetitor: (competitor: Omit<CompetitorTarget, "id">): CompetitorTarget => {
    const data = readData();
    const newEntry: CompetitorTarget = {
      ...competitor,
      id: "comp-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
    };
    data.competitors.push(newEntry);
    writeData(data);
    return newEntry;
  },

  deleteCompetitor: (id: string): void => {
    const data = readData();
    data.competitors = data.competitors.filter((c) => c.id !== id);
    writeData(data);
  },

  toggleCompetitor: (id: string): CompetitorTarget | undefined => {
    const data = readData();
    const target = data.competitors.find((c) => c.id === id);
    if (target) {
      target.active = !target.active;
      writeData(data);
    }
    return target;
  },

  getCalendar: (): ContentConcept[] => {
    return readData().calendar;
  },

  saveCalendarConcepts: (concepts: ContentConcept[]): void => {
    const data = readData();
    data.calendar = concepts;
    writeData(data);
  },

  updateConceptStatus: (id: string, status: ContentConcept["status"]): ContentConcept | undefined => {
    const data = readData();
    const item = data.calendar.find((c) => c.id === id);
    if (item) {
      item.status = status;
      writeData(data);
    }
    return item;
  },

  getPublishJobs: (): PublishJob[] => {
    return readData().publishJobs;
  },

  addPublishJob: (job: Omit<PublishJob, "id" | "createdAt">): PublishJob => {
    const data = readData();
    const newJob: PublishJob = {
      ...job,
      id: "pub-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      createdAt: new Date().toISOString(),
    };
    data.publishJobs.unshift(newJob);
    writeData(data);
    return newJob;
  },

  updatePublishJob: (id: string, updates: Partial<PublishJob>): void => {
    const data = readData();
    const job = data.publishJobs.find((j) => j.id === id);
    if (job) {
      Object.assign(job, updates);
      writeData(data);
    }
  },

  getDmLogs: (): DmLog[] => {
    return readData().dmLogs;
  },

  addDmLog: (log: Omit<DmLog, "id" | "timestamp">): DmLog => {
    const data = readData();
    const newLog: DmLog = {
      ...log,
      id: "dm-" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      timestamp: new Date().toISOString(),
    };
    data.dmLogs.unshift(newLog);
    if (data.dmLogs.length > 100) {
      data.dmLogs = data.dmLogs.slice(0, 100);
    }
    writeData(data);
    return newLog;
  },
};
