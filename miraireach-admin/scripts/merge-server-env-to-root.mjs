/**
 * Merge server-side secrets from src/.env.local into root .env.local for Next.js.
 * Next only loads .env* from the project root (next to package.json).
 *
 * - Appends SUPABASE_SERVICE_ROLE_KEY and GOOGLE_SERVICE_ACCOUNT_JSON (minified)
 *   if missing from root .env.local.
 * - Parses multiline GOOGLE_SERVICE_ACCOUNT_JSON={ ... } from src.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const srcEnv = path.join(root, "src", ".env.local");
const rootEnv = path.join(root, ".env.local");

function extractJsonObjectAfterKey(text, keyPrefix) {
  const i = text.indexOf(keyPrefix);
  if (i < 0) return null;
  const j = text.indexOf("{", i);
  if (j < 0) return null;
  let depth = 0;
  for (let k = j; k < text.length; k++) {
    const ch = text[k];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return text.slice(j, k + 1);
    }
  }
  return null;
}

if (!fs.existsSync(srcEnv)) {
  console.error("Missing", srcEnv);
  process.exit(1);
}
if (!fs.existsSync(rootEnv)) {
  console.error("Missing", rootEnv);
  process.exit(1);
}

const srcText = fs.readFileSync(srcEnv, "utf8");
let rootText = fs.readFileSync(rootEnv, "utf8");

const skMatch = srcText.match(/^SUPABASE_SERVICE_ROLE_KEY=(.+)$/m);
if (skMatch && !/^SUPABASE_SERVICE_ROLE_KEY=/m.test(rootText)) {
  rootText = rootText.trimEnd() + "\nSUPABASE_SERVICE_ROLE_KEY=" + skMatch[1].trim() + "\n";
  console.log("Appended SUPABASE_SERVICE_ROLE_KEY to root .env.local");
}

if (!/^GOOGLE_SERVICE_ACCOUNT_JSON=/m.test(rootText)) {
  const raw = extractJsonObjectAfterKey(srcText, "GOOGLE_SERVICE_ACCOUNT_JSON=");
  if (!raw) {
    console.error("Could not parse GOOGLE_SERVICE_ACCOUNT_JSON block from src/.env.local");
    process.exit(1);
  }
  const obj = JSON.parse(raw);
  const oneLine = JSON.stringify(obj);
  rootText = rootText.trimEnd() + "\nGOOGLE_SERVICE_ACCOUNT_JSON=" + oneLine + "\n";
  console.log("Appended GOOGLE_SERVICE_ACCOUNT_JSON (minified) to root .env.local");
}

fs.writeFileSync(rootEnv, rootText.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n"), "utf8");
console.log("Done:", rootEnv);
