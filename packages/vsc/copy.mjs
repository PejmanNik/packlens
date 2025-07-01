import { readdir, copyFile, mkdir, rm } from "fs/promises";
import { join, resolve } from "path";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = resolve(filename, "..");

const sourceDir = resolve(dirname, "../web/dist/assets");
const outputDir = resolve(dirname, "dist/webviews");

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const files = await readdir(sourceDir);

  const findOrThrow = (regexOrName, description) => {
    const match =
      typeof regexOrName === "string"
        ? files.find((f) => f === regexOrName)
        : files.find((f) => regexOrName.test(f));

    if (!match) {
      throw new Error(`Missing required file: ${description}`);
    }

    return match;
  };

  // web views
  const cssFile = findOrThrow(/^index-.*\.css$/, "main CSS file (index-*.css)");
  const jsFile = findOrThrow(/^index-.*\.js$/, "main JS file (index-*.js)");
  const iconCssFile = findOrThrow("codicon.css", "codicon CSS");
  const iconFontFile = findOrThrow("codicon.ttf", "codicon font");

  if (await fileExists(outputDir)) {
    await rm(outputDir, { recursive: true, force: true });
  }

  await mkdir(outputDir, { recursive: true });

  const copies = [
    [cssFile, "index.css"],
    [jsFile, "index.js"],
    [iconCssFile, "codicon.css"],
    [iconFontFile, "codicon.ttf"],
  ];

  const ops = copies.map(([src, dest]) =>
    copyFile(join(sourceDir, src), join(outputDir, dest)).then(() =>
      console.log(`Copied ${src} → ${dest}`)
    )
  );

  const root = resolve(dirname, "../..");
  ops.push(copyFile(join(root, "README.md"), join(dirname, "README.md")));
  ops.push(copyFile(join(root, "CHANGELOG.md"), join(dirname, "CHANGELOG.md")));
  ops.push(copyFile(join(root, "LICENSE"), join(dirname, "LICENSE")));
  ops.push(
    copyFile(join(root, "media", "icon.png"), join(dirname, "icon.png"))
  );

  await Promise.all(ops);
}

main().catch((err) => {
  console.error("❌ Error during file processing:", err);
  process.exit(1);
});
