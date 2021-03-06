const otpGenerator = require("otp-generator");
var CryptoJS = require("crypto-js");
require("dotenv").config();
const nodemailer = require("nodemailer");
const twilio = require("twilio");
const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

const createOtp = (params) => {
  const otp = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  const delay = 5 * 60 * 1000;
  const expires = Date.now() + delay;
  const data = `${params.phone}.${otp}.${expires}`;
  const hash = CryptoJS.HmacSHA256(data, process.env.SECRET_KEY);
  const readableHash = CryptoJS.enc.Base64.stringify(hash);
  const fullHash = `${readableHash}.${expires}`;
  console.log(otp);

  // Send SMS to user
  // client.messages
  //   .create({
  //     to: params.phone,
  //     from: "+12626864763",
  //     body: `Your verification code is ${otp}. It will be valid for 5 minutes`,
  //   })
  //   .then((message) => console.log(`Message SID ${message.sid}`))
  //   .catch((error) => console.error(error));

  sendMail(params.phone, otp);
  return JSON.stringify({ hash: fullHash });
};
const verifyOtp = (params) => {
  try {
    let [hashValue, expires] = params.hash.split(".");
    let now = Date.now();

    if (now < parseInt(expires)) {
      const data = `${params.phone.toString()}.${params.otp.toString()}.${expires.toString()}`;
      const newHash = CryptoJS.HmacSHA256(data, process.env.SECRET_KEY);
      const readableHash = CryptoJS.enc.Base64.stringify(newHash);
      if (readableHash === hashValue.toString()) {
        return JSON.stringify({
          status: 200,
          message: "OTP verified successfully",
        });
      } else {
        return JSON.stringify({ status: 400, message: "Invalid OTP" });
      }
    }
    return JSON.stringify({ status: 400, message: "OTP Expired" });
  } catch (err) {
    return JSON.stringify({ status: 400, message: "An Error occured" });
  }
};

const sendMail = async (number, otp) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ONE,
      pass: process.env.PASS,
    },
  });

  var mailOptions = {
    from: process.env.EMAIL_ONE,
    to: process.env.EMAIL_TWO,
    subject: "OTP",
    text: `Your verification code is ${otp}. It will be valid for 5 minutes for ${number}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = {
  createOtp,
  verifyOtp,
};
