const express = require("express");
const socketio = require("socket.io");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = 3000 || process.env.PORT;
const app = express();

// import routes
const userRoutes = require("./routes/user");

// middlewares
app.use(bodyParser.json());
app.use("/users", userRoutes);

// routes
app.get("/", (req, res) => {
  res.send("hello");
});

// connect to db
mongoose.connect(process.env.DB_CONNECTION, () => {
  console.log("connected to db");
});

// app listen
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
