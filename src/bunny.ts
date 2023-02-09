import { BunnyCdnStream } from "bunnycdn-stream";
import { env } from "./env";
export const bunny = new BunnyCdnStream({
  apiKey: env.BUNNY_API_KEY,
  videoLibrary: env.BUNNY_VIDEO_LIBRARY,
});
