const express = require("express");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = 3000 || process.env.PORT;
const app = express();
const httpServer = require("http").createServer(app);

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

const io = require("socket.io")(httpServer);

var clients = {};

// socket functions
io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("message",(payload)=>{
    console.log(payload);
    io.emit("reply",`this was your message: ${payload.message}`)
  })
  socket.on("join",(id)=>{
    // store the user in currently active clients
    clients[id]=socket;
  })
});

// app listen
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});