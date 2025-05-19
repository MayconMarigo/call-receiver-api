require("dotenv").config();
require("./src/database/database");
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { socketProvider } = require("./src/sockets/socket");
const { routesProvider } = require("./src/routes/routes");
const morgan = require("morgan")

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
app.use(morgan('dev'));

socketProvider(io);
routesProvider(app);

app.listen(expressPort, () => {
  console.log(`HTTP server listening on port ${expressPort}`);
});

server.listen(socketPort, () => {
  console.log(`Socket server listening on port ${socketPort}`);
});
