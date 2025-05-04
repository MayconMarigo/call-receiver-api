const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { routesProvider } = require("./routes");
const { socketProvider } = require("./src/sockets/socket");

const expressPort = 8080;
const socketPort = 8081;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

let corsOptions = {
  origin: ["http://localhost:3000"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

socketProvider(io);
routesProvider(app);

app.listen(expressPort, () => {
  console.log(`Example app listening on port ${expressPort}`);
});

server.listen(socketPort, () => {
  console.log(`Example socket listening on port ${socketPort}`);
});
