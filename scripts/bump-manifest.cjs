const fs = require("node:fs");
const path = require("node:path");
const manifest = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "manifest.json"), "utf8")
);

manifest.version = process.argv[2];

fs.writeFileSync(
  path.join(__dirname, "..", "manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n"
);
