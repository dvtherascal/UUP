const express = require("express");
const { createBareServer } = require("@tomphttp/bare-server-node");
const http = require("http");
const path = require("path");

const app = express();
const bare = createBareServer("/bare/");

app.use(express.static(path.join(__dirname, "public")));

// Serve UV bundle from node_modules
app.use("/uv/", express.static(
  path.join(__dirname, "node_modules/@titaniumnetwork-dev/ultraviolet/dist")
));

const server = http.createServer((req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bare.shouldRoute(req)) {
    bare.routeUpgrade(req, socket, head);
  } else {
    socket.destroy();
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`UUP proxy live on port ${PORT}`);
});
