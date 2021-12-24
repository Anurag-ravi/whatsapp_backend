const express = require("express");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
require("dotenv").config();

const PORT = 3000 || process.env.PORT;
const app = express();

// import routes
const userRoutes = require("./routes/user");

// middlewares
app.use(bodyParser.json());
app.use("/users", userRoutes);
// routes

// connect to db
mongoose.connect(process.env.DB_CONNECTION, () => {
  console.log("connected to db");
});

// app listen
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

const socketio = new Server(server);

// socket functions

socketio.on("connection", (socket) => {
  console.log(socket.id);
});
