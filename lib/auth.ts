import { AppSettings, AuthSession } from "./types";

const SESSION_KEY = "viralpulse_auth_session";
const VAULT_KEY = "viralpulse_admin_vault";
const COOKIE_NAME = "viralpulse_vault";

export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function setAuthSession(session: AuthSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

export function getClientVault(): Partial<AppSettings> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(VAULT_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);

    // Sanitize any corrupted bullet characters from previous sessions
    const sanitized: Partial<AppSettings> = {};
    for (const [key, val] of Object.entries(parsed)) {
      if (typeof val === "string" && (val.includes("••••") || val.includes("..."))) {
        continue;
      }
      (sanitized as any)[key] = val;
    }
    return sanitized;
  } catch (e) {
    return {};
  }
}

export function saveClientVault(settings: AppSettings): void {
  if (typeof window === "undefined") return;
  try {
    // Sanitize bullets before saving
    const sanitized: Record<string, any> = {};
    for (const [k, v] of Object.entries(settings)) {
      if (typeof v === "string" && (v.includes("••••") || v.includes("..."))) {
        continue;
      }
      sanitized[k] = v;
    }

    const json = JSON.stringify(sanitized);
    localStorage.setItem(VAULT_KEY, json);

    // Write to cookie so all serverless routes on Vercel automatically receive it
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(json)}; path=/; max-age=31536000; SameSite=Lax`;
  } catch (e) {
    console.error("Failed to save to local vault", e);
  }
}

/**
 * Merges server settings with local client vault.
 * Local vault keeps the real unmasked key intact so it never resets!
 */
export function mergeWithClientVault(serverSettings: AppSettings): AppSettings {
  const vault = getClientVault();
  const merged: AppSettings = { ...serverSettings };

  const secretKeys: (keyof AppSettings)[] = [
    "apifyToken",
    "openaiApiKey",
    "geminiApiKey",
    "metaAppSecret",
    "metaAccessToken",
    "tiktokAppSecret",
    "tiktokAccessToken",
    "kvRestApiToken",
    "vercelAuthToken",
  ];

  for (const k of secretKeys) {
    const serverVal = serverSettings[k];
    const vaultVal = vault[k];

    // If server value is empty or has bullets, but vault has the real value, use vault!
    if ((!serverVal || (typeof serverVal === "string" && serverVal.includes("••••"))) && vaultVal) {
      (merged as any)[k] = vaultVal;
    } else if (serverVal && typeof serverVal === "string" && !serverVal.includes("••••")) {
      (merged as any)[k] = serverVal;
    }
  }

  if (vault.aiProvider) merged.aiProvider = vault.aiProvider;
  if (vault.instagramAccountId && !merged.instagramAccountId) merged.instagramAccountId = vault.instagramAccountId;
  if (vault.metaAppId && !merged.metaAppId) merged.metaAppId = vault.metaAppId;
  if (vault.tiktokAppId && !merged.tiktokAppId) merged.tiktokAppId = vault.tiktokAppId;

  return merged;
}
