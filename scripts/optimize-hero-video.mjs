/**
 * Re-encode public/hero/hero-dubai.mp4 for sharper full-viewport hero playback.
 * Requires @ffmpeg-installer/ffmpeg (devDependency).
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, renameSync, unlinkSync } from "node:fs";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";

const input = "public/hero/hero-dubai.mp4";
const temp = "public/hero/hero-dubai.optimized.mp4";
const backup = "public/hero/hero-dubai.720p-source.mp4";

if (!existsSync(input)) {
  console.error(`Missing ${input}`);
  process.exit(1);
}

if (!existsSync(backup)) {
  copyFileSync(input, backup);
  console.log(`Backed up source → ${backup}`);
}

// 1080p, no audio, web-optimized; light sharpen after upscale from 720p
const args = [
  "-y",
  "-i",
  input,
  "-an",
  "-vf",
  "scale=1920:1080:flags=lanczos,unsharp=5:5:0.35:5:5:0.0",
  "-c:v",
  "libx264",
  "-preset",
  "slow",
  "-crf",
  "17",
  "-pix_fmt",
  "yuv420p",
  "-movflags",
  "+faststart",
  temp,
];

console.log("Encoding 1080p hero…");
execFileSync(ffmpegPath, args, { stdio: "inherit" });

renameSync(temp, input);
console.log(`Updated ${input}`);

try {
  execFileSync(
    ffmpegPath,
    ["-y", "-i", input, "-ss", "0.4", "-vframes", "1", "-q:v", "2", "public/hero/hero-dubai-poster.jpg"],
    { stdio: "inherit" },
  );
  console.log("Wrote public/hero/hero-dubai-poster.jpg");
} catch {
  console.warn("Poster frame export skipped");
}
