const net = require("net");
const fs = require("fs");
const path = require("path");
const os = require("os");

const action = process.argv[2];
const tmp =
  process.env.TMPDIR || process.env.TMP || process.env.TEMP || os.tmpdir();
const sockFilePath = path.join(tmp, "tplay_socket_path");

if (!action) {
  process.exit(1);
}

if (!fs.existsSync(sockFilePath)) {
  process.exit(1);
}

const sockPath = fs.readFileSync(sockFilePath, "utf8").trim();

if (!sockPath) {
  process.exit(1);
}

function sendCommand(command) {
  const client = net.createConnection(sockPath);
  client.on("connect", () => {
    client.write(JSON.stringify({ command }) + "\n");
    client.end();
  });
  client.on("error", () => {
    process.exit(1);
  });
}

switch (action) {
  case "pause":
  case "play":
    if (action === "pause") {
      sendCommand(["set_property", "pause", true]);
    } else {
      sendCommand(["set_property", "pause", false]);
    }
    break;
  case "next":
    sendCommand(["script-message", "tplay", "next"]);
    break;
  case "prev":
    sendCommand(["script-message", "tplay", "prev"]);
    break;
}
