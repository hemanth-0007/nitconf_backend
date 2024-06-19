const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
 
const speakeasy = require('speakeasy');
const validateRegister = require("../validation/validateRegister");

const OtpAuth = require("../models/OtpAuth");
// const transporter = require("../mail_config/config");

const sendMail = require("../mail_config/gmailConfig");

const saltRounds = 10;
 

router.post("/", (req, res) => {
  // return res.send('Hello World');
  // console.log("Hello World");
  console.log(req.body);
  const { file } = req.body;
  console.log(file);
  return res.send("formData received");
});

router.post("/register/", async (req, res) => {
  const { error } = validateRegister(req.body);
  if (error) return res.status(400).send(error);
  const { firstName, lastName, email, password } = req.body;
  try {
    const dbUser = await User.findOne({ email: email });
    if (dbUser) res.status(400).send("User already exists");
  } catch (error) {
    console.error(`Error finding user ${error.message}`);
    res.status(500).send("Error finding user");
  }
  const hashedPassword = await bcrypt.hash(password, process.env.SALT_ROUNDS);
  const user = new User({
    firstname: firstName,
    lastname: lastName,
    email,
    password: hashedPassword,
  });
  try {
    await user.save();
    res.status(201).send("User saved");
  } catch (error) {
    console.error(`Error saving user ${error.message}`);
    res.status(500).send("Error saving user");
  }
});

router.post("/login/", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password || email == "" || password == "") {
    res.status(400).send("Please enter all the feilds");
    return;
  }
  try {
    const user = await User.findOne({ email: email });
    if (user == null || user == undefined) {
      return res.status(400).send("User not exits");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid credentials");
    }
    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, process.env.SECRET_KEY);
    return res.status(200).send({ token });
  } catch (error) {
    console.error(`Error saving user ${error.message}`);
    return res.status(500).send("Error saving user");
  }
});



router.get("/verify-token/", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).send("Access Denied");
  }
  try {
    // console.log("called inside try", token);
    jwt.verify(token, SECRET_KEY, async (err, decoded) => {
      if (err) return res.status(400).send({message : "Invalid Token"});
      const user = await User.findById(decoded.id);
      if (!user) return res.status(400).send({message : "User not found"});
      return res.status(200).send({message : "Token verified successfully"});
    });
  } catch (error) {
    return res.status(400).send({message : "Invalid Token"});
  }
});

router.get("/test/", (req, res) => {
  console.log("Hello World");
  res.send({
    msg: "Hello World",
  });
});

router.put("/forgot-password/", (req, res) => {});

// request : {email}
// outcome : {otp} to the email
// response : {message}
router.post("/send-otp/", async (req, res) => {
  const { email } = req.body;
  if (!email || email == "") {
    return res.status(400).send("Please enter email");
  }
  console.log(email);
  // const otp = "1234";
   // Send OTP via email
   const otp = speakeasy.totp({
    secret: process.env.SECRET_KEY,
    encoding: 'base32',
    step: 60 ,// OTP valid for 5 minutes
    digits: 6  // Length of the OTP (default is 6)
  });
  
  const expiry = new Date();
  const otpAuth = new OtpAuth({
    email,
    otp,
    expiresAt : expiry.setMinutes(expiry.getMinutes() + 1),
  });
  try {
    await otpAuth.save();
    sendMail(email, "OTP", `Your OTP is ${otp}`);
    return res.status(200).send("OTP sent successfully");
  } catch (error) {
    console.error(`Error saving otp ${error.message}`);
    return res.status(500).send("Error saving otp");
  }

});


router.post ("/verify-otp/", async (req, res) => {
  const { email, otp } = req.body;
  console.log(email, otp);
  if (!email || email == "" || !otp || otp == "") {
    return res.status(400).send("Please enter email and otp");
  }
  const user = await User.findOne({ email});
  if (!user) {
    return res.status(400).send("User not found");
  }
  const otpAuth = await OtpAuth.findOne({ email});
  if (!otpAuth) {
    await user.delete();
    return res.status(400).send("Invalid OTP request NULL");
  }
  if(otpAuth.expiresAt < new Date()) {
    await otpAuth.delete();
    return res.status(400).send("OTP expired, Please request for new OTP");
  }
  if (otpAuth.otp !== otp) {
    return res.status(400).send("Invalid OTP");
  }
  
  // verify the user
  user.isVerified = true;
  await user.save();
  return res.status(200).send("OTP verified successfully");
});



module.exports = router;
