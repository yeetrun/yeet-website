import { error } from "@opennextjs/aws/adapters/logger.js";
import { IgnorableError } from "@opennextjs/aws/utils/error.js";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const CACHE_DIR = "cdn-cgi/_next_cache";
const FALLBACK_BUILD_ID = "no-build-id";

export const staticAssetsIncrementalCache = {
  name: "cf-static-assets-incremental-cache",
  async get(key: string, cacheType?: string) {
    const assets = getCloudflareContext().env.ASSETS;
    if (!assets) {
      throw new IgnorableError("No Static Assets");
    }
    try {
      const response = await assets.fetch(this.getAssetUrl(key, cacheType));
      if (!response.ok) {
        await response.body?.cancel();
        return null;
      }
      return {
        value: await response.json(),
        lastModified: (globalThis as any).__BUILD_TIMESTAMP_MS__ ?? Date.now(),
      };
    } catch (err) {
      error("Failed to get from cache", err);
      return null;
    }
  },
  async set(key: string, _value: unknown, cacheType?: string) {
    error(
      `StaticAssetsIncrementalCache: Failed to set to read-only cache key=${key} type=${cacheType}`,
    );
  },
  async delete() {
    error("StaticAssetsIncrementalCache: Failed to delete from read-only cache");
  },
  getAssetUrl(key: string, cacheType?: string) {
    if (cacheType === "composable") {
      throw new Error(
        "Composable cache is not supported in static assets incremental cache",
      );
    }
    const buildId = process.env.NEXT_BUILD_ID ?? FALLBACK_BUILD_ID;
    const name = (cacheType === "fetch"
      ? `${CACHE_DIR}/__fetch/${buildId}/${key}`
      : `${CACHE_DIR}/${buildId}/${key}.cache`
    ).replace(/\/+/g, "/");
    return `http://assets.local/${name}`;
  },
} as const;
