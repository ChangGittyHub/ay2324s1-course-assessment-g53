const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

dotenv.config({
  path: ".env.local",
});
const DEFAULT_DOCUMENT_DATA = "";
const PORT = process.env.PORT ? process.env.PORT : 9001;
const FRONTEND_HOST = process.env.FRONTEND_HOST
  ? process.env.FRONTEND_HOST
  : "http://localhost:3000";

const app = express();
const server = require("http").createServer(app);
app.use(cors());
app.use(express.json());
const io = new Server(server, {
  cors: {
    origin: FRONTEND_HOST,
    methods: ["GET", "POST"],
  },
});

server.listen(PORT, () => {
  console.log(`Communication service connected on port ${PORT}`);
});

app.use("/", (req, res) => res.status(200).json({status: "OK"}))

let count = 0;
io.on("connection", (socket) => {
  console.log("One person connected", count++);
  socket.on("hello-server", (obj) => {
    const roomId = obj.roomId
    const userId = obj.id
    socket.join(roomId)
    socket.broadcast.to(roomId).emit("user-joined", userId)
    socket.on("disconnect", () => {
      socket.broadcast.to(roomId).emit("user-left", userId)
      socket.leave(roomId)
    })

  })


});
