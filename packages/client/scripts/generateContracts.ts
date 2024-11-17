import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create necessary directories
const targetDir = path.resolve(__dirname, "../contracts");
fs.mkdirSync(path.resolve(targetDir, "out/IWorld.sol"), { recursive: true });

// Try to build contracts first
try {
  execSync("pnpm mud build", {
    cwd: path.resolve(__dirname, "../../contracts"),
    stdio: "inherit",
  });
} catch (error) {
  console.error("Failed to build contracts:", error);
  process.exit(1);
}

// Copy only the needed files
const filesToCopy = [
  // From setupNetwork.ts
  ["out/IWorld.sol/IWorld.abi.json", "out/IWorld.sol/IWorld.abi.json"],
  // From getNetworkConfig.ts
  ["worlds.json", "worlds.json"],
  // From index.tsx
  ["mud.config.ts", "mud.config.ts"],
];

filesToCopy.forEach(([source, target]) => {
  const sourcePath = path.resolve(__dirname, "../../contracts", source);
  const targetPath = path.resolve(targetDir, target);

  fs.copyFileSync(sourcePath, targetPath);
  console.log(`Copied ${source} to ${targetPath}`);
});
