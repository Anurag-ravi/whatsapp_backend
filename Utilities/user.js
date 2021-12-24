const User = require("../models/userModel");

const saveUser = (params) => {
  // params = {
  //     number,
  //     countryCode,
  //     fullNumber,
  // }
  try {
    User.findById(params.fullNumber).exec(async (err, user) => {
      if (err) {
        return JSON.stringify({ statusCode: 400, message: err });
      }
      if (!user) {
        try {
          const user = new User({
            _id: params.fullNumber,
            number: params.number,
            countryCode: params.countryCode,
            fullNumber: params.fullNumber,
            name: params.fullNumber,
            status: "Hey there, I am using whatsapp clone",
          });
          const savedUser = await user.save();
          return JSON.stringify({ statusCode: 200, message: savedUser });
        } catch (error) {
          return JSON.stringify({ statusCode: 400, message: error });
        }
      }
      return JSON.stringify({ statusCode: 200, message: user });
    });
  } catch (error) {
    return JSON.stringify({ statusCode: 400, message: error });
  }
};

module.exports = {
  saveUser,
};
