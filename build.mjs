// Bundles src/entries/*.entry.js back down to the four flat scripts/*.js
// files the PHP pages load via absolute <script src> URLs. Output filenames
// must not change -- see RUNBOOK.md.
import * as esbuild from "esbuild";

const watch = process.argv.includes("--watch");

const entries = [
  ["src/entries/optii-savr.entry.js", "scripts/optii-savr.js"],
  ["src/entries/optii-savr-calculator.entry.js", "scripts/optii-savr-calculator.js"],
  ["src/entries/optii-savr-usermanual.entry.js", "scripts/optii-savr-usermanual.js"],
  ["src/entries/main.entry.js", "scripts/main.js"],
];

const commonOptions = {
  bundle: true,
  format: "iife",
  target: "es2018",
  minify: false,
  logLevel: "info",
};

if (watch) {
  const contexts = await Promise.all(
    entries.map(([entryPoint, outfile]) =>
      esbuild.context({ ...commonOptions, entryPoints: [entryPoint], outfile })
    )
  );
  await Promise.all(contexts.map((ctx) => ctx.watch()));
  console.log("Watching for changes... (Ctrl+C to stop)");
} else {
  for (const [entryPoint, outfile] of entries) {
    await esbuild.build({ ...commonOptions, entryPoints: [entryPoint], outfile });
  }
  console.log("Build complete.");
}
