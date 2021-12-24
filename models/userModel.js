const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: "Name",
  },
  status: {
    type: String,
    default: "Hey there, I am using whatsapp clone.",
  },
});

module.exports = mongoose.model("User", UserSchema);
