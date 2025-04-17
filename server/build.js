const { execSync } = require('child_process');
const fs = require('fs');

// Load dependencies from package.json
const packageJson = require('./package.json');
const dependencies = Object.keys(packageJson.dependencies || {});
let externalDeps = new Set(); // Store dependencies to exclude

console.log("🔄 Running initial esbuild attempt...");

try {
  // Run esbuild without exclusions to detect failures
  execSync(
    `esbuild ./src/index.js --bundle --platform=node --minify --target=node20 --outdir=./dist --splitting --format=esm --loader:.html=text`,
    { stdio: 'inherit', shell: true }
  );
  console.log("✅ Build successful with all dependencies bundled.");
} catch (error) {
  console.log("⚠️ Build failed. Detecting unbundlable dependencies...");
  
  // Capture the error output to a temporary file
  const tempErrorFile = './esbuild-errors.log';
  try {
    execSync(
      `esbuild ./src/index.js --bundle --platform=node --minify --target=node20 --outdir=./dist --splitting --format=esm --loader:.html=text > ${tempErrorFile} 2>&1 || true`,
      { shell: true }
    );
    
    // Read the error file
    const errorOutput = fs.readFileSync(tempErrorFile, 'utf8');
    
    // Look for "Could not resolve" errors in the output
    const resolveErrors = errorOutput.match(/Could not resolve "([^"]+)"/g) || [];
    
    resolveErrors.forEach(errorMatch => {
      // Extract the dependency name from the error message
      const depMatch = errorMatch.match(/Could not resolve "([^"]+)"/);
      if (depMatch && depMatch[1]) {
        externalDeps.add(depMatch[1]);
      }
    });
    
    // Clean up the temporary file
    fs.unlinkSync(tempErrorFile);
    
  } catch (captureError) {
    console.error("Error capturing build errors:", captureError);
  }

  // If no dependencies were detected automatically, add the ones from the error message
  if (externalDeps.size === 0) {
    console.log("Manually adding problematic dependencies based on the error log...");
    ["mock-aws-s3", "aws-sdk", "nock", "pg-hstore"].forEach(dep => externalDeps.add(dep));
  }

  if (externalDeps.size > 0) {
    console.log(`🚫 Excluding the following dependencies from bundling: ${[...externalDeps].join(", ")}`);

    // Re-run esbuild with the failed dependencies marked as external
    const externalFlags = [...externalDeps].map(dep => `--external:${dep}`).join(" ");
    const buildCommand = `esbuild ./src/index.js --bundle --platform=node --minify --target=node20 --outdir=./dist --splitting --format=esm --loader:.html=text ${externalFlags}`;

    console.log(`🔄 Running esbuild again with excluded dependencies...`);
    try {
      execSync(buildCommand, { stdio: 'inherit', shell: true });
      console.log("✅ Build completed with necessary modules excluded.");
    } catch (rebuildError) {
      console.error("❌ Build still failed after excluding dependencies. Additional issues may exist.");
      process.exit(1);
    }
  } else {
    console.log("❌ Build failed, but no dependencies were automatically detected as problematic. Check error logs.");
    process.exit(1);
  }
}