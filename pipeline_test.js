const child_process = require("child_process");
const { assert } = require("console");
const http = require("http");

function sleep(seconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

function startChildProcess(command) {
  const commandProcess = child_process.spawn(command, [], {
    cwd: process.cwd(),
    env: process.env,
    shell: true,
  });
  commandProcess.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  commandProcess.stderr.on("data", (data) => {
    console.error(data.toString());
  });

  commandProcess.on("error", (err) => {
    console.error(err.toString());
  });

  return commandProcess;
}

async function queryHost(host, port, path, method) {
  const options = {
    host: host,
    port: port,
    path: path,
    method: method,
    timeout: 3000,
  };
  return new Promise((resolve) => {
    const req = http.request(options, (res) => {
      res.on("data", (chunk) => {
        resolve(true);
      });
      res.on("error", (error) => {
        console.error(error);
        resolve(false);
      });
    });

    req.on("timeout", () => {
      resolve(false);
    });

    req.on("error", (err) => {
      resolve(false);
    });

    req.end();
  });
}

async function testDeploymentBuild() {
  console.log("[DECADES] Testing deployment server!");
  const command = "npm --prefix ./deployment/ run start";

  // Start server and wait a bit
  console.log(`[DECADES] Running command \"${command}\"...`);
  const commandProcess = startChildProcess(command);
  await sleep(5);

  // Query index
  console.log(`[DECADES] Querying the localhost...`)
  const result = await queryHost("localhost", 5000, "/", "GET");
  if (!result) {
    //TODO: make this throw an error!
    console.error(`[DECADES] Could not access localhost!`);
    return false;
  }

  // Wait a bit and kill
  await sleep(5);
  commandProcess.kill();
  return true;
}

async function main() {
  console.log("[DECADES] Testing begins!");

  let success = 1;
  success = await testDeploymentBuild();

  if (success) {
    console.log("[DECADES] Testing finished successfully!");
  } else {
    console.log("[DECADES] Testing finished with errors!!");
  }

  //success = 1, need code 0
  //success = 0, need code 1
  process.exit(!success);
}

if (require.main === module) {
  main();
}
