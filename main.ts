// news-image-20261119-cand-a: copies the pre-built entry.png to the output dir.
// The image itself was composed programmatically (PIL) from the verified
// 35-story list for Thursday 19 November 2026; this script only copies it.
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const EXPECTED_SHA256 =
  "8e343fc721e87ae32affde3de95dad5ce6f0740cff6ca9ed749090c19a274853";

const here = fileURLToPath(new URL(".", import.meta.url));
const sourcePath = join(here, "entry.png");
let bytes: Buffer;
try {
  bytes = readFileSync(sourcePath);
} catch {
  throw new Error(`cannot read entry.png at ${sourcePath}: file missing or unreadable`);
}
if (bytes.length === 0) {
  throw new Error(`entry.png is empty (0 bytes) at ${sourcePath}`);
}
if (bytes.length > 1048576) {
  throw new Error(
    `entry.png too large: ${bytes.length} bytes exceeds 1 MiB limit (1048576 bytes)`,
  );
}

const digest = createHash("sha256").update(bytes).digest("hex");
if (digest !== EXPECTED_SHA256) {
  throw new Error(
    `entry.png sha256 mismatch: got ${digest}, expected ${EXPECTED_SHA256}`,
  );
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.png"), bytes);
console.log(`entry.png sha256 ${digest}`);
