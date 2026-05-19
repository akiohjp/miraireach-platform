/**
 * Re-encode hero video from the original 720p backup when available.
 * Requires @ffmpeg-installer/ffmpeg (devDependency).
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, renameSync } from "node:fs";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";

const output = "public/hero/hero-dubai.mp4";
const temp = "public/hero/hero-dubai.optimized.mp4";
const backup = "public/hero/hero-dubai.720p-source.mp4";

const source = existsSync(backup) ? backup : output;
if (!existsSync(source)) {
  console.error(`Missing ${source}`);
  process.exit(1);
}

if (!existsSync(backup) && existsSync(output)) {
  copyFileSync(output, backup);
  console.log(`Backed up source → ${backup}`);
}

const args = [
  "-y",
  "-i",
  source,
  "-an",
  "-vf",
  "scale=1920:1080:flags=lanczos,unsharp=7:7:0.45:7:7:0.0",
  "-c:v",
  "libx264",
  "-preset",
  "slow",
  "-crf",
  "14",
  "-pix_fmt",
  "yuv420p",
  "-movflags",
  "+faststart",
  temp,
];

console.log(`Encoding 1080p hero from ${source}…`);
execFileSync(ffmpegPath, args, { stdio: "inherit" });

renameSync(temp, output);
console.log(`Updated ${output}`);

execFileSync(
  ffmpegPath,
  ["-y", "-i", output, "-ss", "0.4", "-vframes", "1", "-q:v", "1", "public/hero/hero-dubai-poster.jpg"],
  { stdio: "inherit" },
);
console.log("Wrote public/hero/hero-dubai-poster.jpg");
