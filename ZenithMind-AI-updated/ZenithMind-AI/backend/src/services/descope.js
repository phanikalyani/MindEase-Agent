/**
 * Descope Provider Token Service (toggle SDK / REST)
 *
 * ENV required:
 *   DESCOPE_PROJECT_ID
 *   DESCOPE_MANAGEMENT_KEY
 *   DESCOPE_API_BASE (optional)
 *   USE_SDK (true|false)
 */

import axios from "axios";
import { err, log } from "../utils/logger.js";

const projectId = process.env.DESCOPE_PROJECT_ID;
const managementKey = process.env.DESCOPE_MANAGEMENT_KEY;
const apiBase = process.env.DESCOPE_API_BASE || "https://api.descope.com";
const useSdk = process.env.USE_SDK === "true";

if (!projectId || !managementKey) {
  err("DESCOPE_PROJECT_ID and DESCOPE_MANAGEMENT_KEY must be set in .env");
  // do not exit here to allow local dev with DEMO token env if desired
}

let descopeSdk = null;

async function tryInitSdk() {
  if (!useSdk) return;
  try {
    const DescopeClient = (await import("@descope/node-sdk")).default;
    descopeSdk = DescopeClient({
      projectId,
      managementKey,
      baseUrl: apiBase,
    });
    log("Descope SDK initialized successfully");
  } catch (e) {
    err("Failed to load Descope SDK, will use REST fallback:", e.message);
    descopeSdk = null;
  }
}
tryInitSdk();

export async function getProviderAccessToken({ descopeUserId, provider = "google" }) {
  if (!descopeUserId) throw new Error("descopeUserId is required");

  // SDK mode
  if (useSdk && descopeSdk) {
    try {
      const resp = await descopeSdk.management.user.getProviderToken(descopeUserId, provider);
      if (resp?.data?.accessToken) {
        log(`[SDK] Got ${provider} access token for ${descopeUserId}`);
        return {
          accessToken: resp.data.accessToken,
          expiration: resp.data.expiration,
          scopes: resp.data.scopes,
        };
      }
      throw new Error("No accessToken returned from Descope SDK");
    } catch (e) {
      err("[SDK] Failed to fetch provider token:", e.message);
      // fallthrough to REST
    }
  }

  // REST fallback
  const url = `${apiBase}/v1/management/users/${encodeURIComponent(descopeUserId)}/provider?provider=${encodeURIComponent(provider)}`;
  try {
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${projectId}:${managementKey}`,
        "Content-Type": "application/json",
      },
    });
    if (res?.data?.accessToken) {
      log(`[REST] Got ${provider} access token for ${descopeUserId}`);
      return {
        accessToken: res.data.accessToken,
        expiration: res.data.expiration,
        scopes: res.data.scopes,
      };
    }
    throw new Error("No accessToken in Descope response");
  } catch (e) {
    err("[REST] Failed to fetch provider token:", e.response?.data || e.message);
    // As a last resort, support a DEMO token from env for local development
    if (process.env.DEMO_GOOGLE_ACCESS_TOKEN) {
      log("[FALLBACK] Using DEMO_GOOGLE_ACCESS_TOKEN from env (dev only)");
      return { accessToken: process.env.DEMO_GOOGLE_ACCESS_TOKEN };
    }
    throw e;
  }
}

export function buildConnectProviderUrl() {
  const baseUrl = process.env.DESCOPE_HOSTED_FLOW_URL || "https://your-descope-hosted-flow.example/connect";
  const params = new URLSearchParams({
    provider: "google",
    scopes: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events"
    ].join(" ")
  });
  return `${baseUrl}?${params.toString()}`;
}
