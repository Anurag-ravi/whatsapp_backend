const express = require("express");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const app = express();
const httpServer = require("http").createServer(app);

// import routes
const userRoutes = require("./routes/user");

// middlewares
app.use(bodyParser.json());
app.use("/users", userRoutes);

// routes
app.get("/", (req, res) => {
  res.send("welcome");
});

// connect to db
mongoose.connect(process.env.DB_CONNECTION, () => {
  console.log("connected to db");
});

const io = require("socket.io")(httpServer);

var clients = {};

// socket functions
io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("message", (payload) => {
    if (clients[payload.to]) {
      clients[payload.to].emit("reply", {
        message: payload.message,
        from: payload.from,
        time: payload.time,
      });
    } else {
      // socket.emit("reply", {
      //   message: payload.message,
      //   from: payload.to,
      //   time: payload.time,
      // });
    }
  });
  socket.on("join", (id) => {
    // store the user in currently active clients
    clients[id] = socket;
  });
});

// app listen
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
