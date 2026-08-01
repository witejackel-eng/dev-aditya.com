import OGImage, {
  alt as ogAlt,
  size as ogSize,
  contentType as ogContentType,
} from "./opengraph-image";

export const runtime = "edge";
export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;

/**
 * Twitter card preview image (1200×630).
 *
 * Re-exports the same ImageResponse as opengraph-image.tsx so that
 * Open Graph and Twitter share one source of truth. Next.js App Router
 * serves this at /twitter-image automatically.
 */
export default OGImage;
