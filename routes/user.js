const express = require("express");
let { createOtp, verifyOtp } = require("../Utilities/otp");
const User = require("../models/userModel");

const router = express.Router();

router.post("/sendotp", (req, res) => {
  console.log(req.body);
  res.send(createOtp(req.body));
});

router.post("/verifyotp", (req, res) => {
  let data = verifyOtp(req.body);
  res.send(data);
});

router.post("/login", (req, res) => {
  let params = req.body;
  try {
    User.findById(params.fullNumber).exec(async (err, user) => {
      if (err) {
        res.send(JSON.stringify({ status: 400, message: "err 1" }));
      }
      if (!user) {
        try {
          const user = new User({
            _id: params.fullNumber,
            name: params.fullNumber,
            status: "Hey there, I am using whatsapp clone",
          });
          const savedUser = await user.save();
          res.send(
            JSON.stringify({
              status: 201,
              message: savedUser,
            })
          );
        } catch (error) {
          res.send(JSON.stringify({ status: 400, message: error }));
        }
      }
      res.send(
        JSON.stringify({
          status: 200,
          message: user,
        })
      );
    });
  } catch (error) {
    res.send(JSON.stringify({ status: 400, message: error }));
  }
});

router.patch("/update", async (req, res) => {
  try {
    const updatedUser = await User.updateOne(
      { _id: req.body.fullNumber },
      {
        $set: {
          name: req.body.name,
          status: req.body.status,
        },
      }
    );
    res.send(JSON.stringify({ status: 200, message: updatedUser }));
  } catch (error) {
    res.send(JSON.stringify({ status: 400, message: error }));
  }
});

module.exports = router;
