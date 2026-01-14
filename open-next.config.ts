import { defineCloudflareConfig, type OpenNextConfig } from "@opennextjs/cloudflare";
import { staticAssetsIncrementalCache } from "./open-next/static-assets-incremental-cache";

export default {
  ...defineCloudflareConfig({
    incrementalCache: () => staticAssetsIncrementalCache,
  }),
  buildCommand: "npm run build:next",
} satisfies OpenNextConfig;
