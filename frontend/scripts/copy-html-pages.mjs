import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { extname, join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");

if (!existsSync(dist)) {
  mkdirSync(dist, { recursive: true });
}

for (const file of readdirSync(root)) {
  if (extname(file).toLowerCase() === ".html" && file.toLowerCase() !== "index.html") {
    copyFileSync(join(root, file), join(dist, file));
  }
}
