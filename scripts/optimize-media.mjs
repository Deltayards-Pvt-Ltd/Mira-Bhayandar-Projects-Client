import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import ffmpegPath from "ffmpeg-static";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited ${code}`));
    });
  });
}

function kb(file) {
  return `${Math.round(fs.statSync(file).size / 1024)} KB`;
}

const videoDir = path.join(publicDir, "videos");
const sourceVideo = path.join(videoDir, "hero.mp4");
const backupDir = path.join(root, "media-originals");
fs.mkdirSync(backupDir, { recursive: true });
const backupVideo = path.join(backupDir, "hero.mp4");
if (!fs.existsSync(backupVideo)) fs.copyFileSync(sourceVideo, backupVideo);

const desktopOut = path.join(videoDir, "hero-desktop.mp4");
const mobileOut = path.join(videoDir, "hero-mobile.mp4");
const posterOut = path.join(videoDir, "hero-poster.jpg");

await run(ffmpegPath, [
  "-y",
  "-i",
  backupVideo,
  "-an",
  "-vf",
  "scale='min(1280,iw)':-2",
  "-c:v",
  "libx264",
  "-preset",
  "veryfast",
  "-crf",
  "30",
  "-pix_fmt",
  "yuv420p",
  "-movflags",
  "+faststart",
  desktopOut,
]);

await run(ffmpegPath, [
  "-y",
  "-i",
  backupVideo,
  "-an",
  "-vf",
  "scale='min(854,iw)':-2",
  "-c:v",
  "libx264",
  "-preset",
  "veryfast",
  "-crf",
  "32",
  "-pix_fmt",
  "yuv420p",
  "-movflags",
  "+faststart",
  mobileOut,
]);

await run(ffmpegPath, [
  "-y",
  "-ss",
  "0.4",
  "-i",
  backupVideo,
  "-frames:v",
  "1",
  "-vf",
  "scale=1280:-2",
  "-q:v",
  "5",
  posterOut,
]);

fs.rmSync(sourceVideo);
console.log("desktop", kb(desktopOut));
console.log("mobile", kb(mobileOut));
console.log("poster", kb(posterOut));

const photos = [
  ["bhayandar east.png", "bhayandar-east.webp", 960],
  ["bhayandar west.png", "bhayandar-west.webp", 960],
  ["mira road east.png", "mira-road-east.webp", 960],
  ["mira bhayandar.png", "mira-bhayandar.webp", 1400],
];

for (const [input, output, width] of photos) {
  const from = path.join(publicDir, input);
  const to = path.join(publicDir, output);
  await sharp(from).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 72 }).toFile(to);
  console.log(output, kb(to), "from", kb(from));
}

const partnersDir = path.join(publicDir, "partners");
for (const name of fs.readdirSync(partnersDir).filter((n) => n.endsWith(".png"))) {
  const file = path.join(partnersDir, name);
  const before = fs.statSync(file).size;
  const buf = await sharp(file)
    .resize({ height: 160, withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();
  if (buf.length < before) fs.writeFileSync(file, buf);
  console.log(`partner ${name}`, Math.round(before / 1024), "->", Math.round(fs.statSync(file).size / 1024), "KB");
}
