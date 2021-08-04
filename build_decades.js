const fse = require("fs-extra");
const path = require("path")
const child_process = require("child_process");

const deploymentDirectory = "deployment";
const serverAppItems = [
  "bin",
  "client/build",
  "app.yaml",
  "routes",
  "app.js",
  "package.json"
]

console.log("[DECADES] Started Building!");

// 1. Create if doesn't exist and make sure it's empty
console.log(`Purging ${deploymentDirectory}/ directory...`);
fse.emptyDirSync(deploymentDirectory);

// 2. Build the client
console.log(`[DECADES] Building the react app at client/build...`);
const build = child_process.execSync("npm --prefix ./client/ run build", {
  stdio: "inherit",
});

// 3. Copy server items into deployment/
console.log(`[DECADES] Copying the server items to ${deploymentDirectory}/...`);
for (const item of serverAppItems) {
  const isFile = path.extname(item) !== ""
  const resultPath = path.join(deploymentDirectory, item)
  if (isFile){
    fse.copyFileSync(item, resultPath)
  }
  else {
    fse.copySync(item, resultPath)
  }
}

console.log(`[DECADES] Successfully created build!`)