import { AppSettings, AuthSession } from "./types";

const SESSION_KEY = "viralpulse_auth_session";
const VAULT_KEY = "viralpulse_admin_vault";

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
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

export function saveClientVault(settings: AppSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(VAULT_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save to local vault", e);
  }
}

/**
 * Merges server settings with local client vault.
 * If server masked a key with bullet points or returned empty,
 * local vault keeps the real key intact so it never resets!
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

    // If server value is empty or masked, but vault has the real value, use vault!
    if ((!serverVal || (typeof serverVal === "string" && serverVal.includes("••••"))) && vaultVal) {
      (merged as any)[k] = vaultVal;
    } else if (serverVal && typeof serverVal === "string" && !serverVal.includes("••••")) {
      (merged as any)[k] = serverVal;
    }
  }

  // Also preserve non-secret fields if vault has them and server returned defaults
  if (vault.aiProvider) merged.aiProvider = vault.aiProvider;
  if (vault.instagramAccountId && !merged.instagramAccountId) merged.instagramAccountId = vault.instagramAccountId;
  if (vault.metaAppId && !merged.metaAppId) merged.metaAppId = vault.metaAppId;
  if (vault.tiktokAppId && !merged.tiktokAppId) merged.tiktokAppId = vault.tiktokAppId;

  return merged;
}
