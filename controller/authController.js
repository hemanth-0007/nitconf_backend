import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
 

import User from "../models/User.js";
import OtpAuth from "../models/OtpAuth.js";

import { sendMail } from "../mail_config/gmailConfig.js";


// { firstName, lastName, email, password } --> body
// returns {message : "...."}
// wheater user is saved or not
const register = async (req, res) => {
  // returns { error : "....."}
  
  const { firstname, lastname, email, password } = req.body;
  if(!firstname || !lastname || !email || !password){
    return res.status(400).send({message : "Please enter all the fields may have wrong naming convention"});
  }
  try {
    const dbUser = await User.findOne({ email: email });
    if (dbUser) return res.status(403).send({ message: "User already exists" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    firstname,
    lastname,
    email,
    password: hashedPassword,
  });
  try {
    await user.save();
   return res.status(201).send({ message: "User saved" });
  } catch (error) {
    // console.error(`Error saving user ${error.message}`);
   return res.status(500).send({ message: "Internal Error while saving the user" });
  }
};

// returns {token : "..."}

const login = async (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body);
  if (!email || !password || email == "" || password == "") {
    return res.status(400).send({ message: "Please enter all the feilds" });
  }
  try {
    const user = await User.findOne({ email: email });
    if (user == null || user == undefined) {
      return res.status(400).send({ message: "User not exits" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Invalid credentials" });
    }
    // ******* This is payload to token ********
    const payload = { id: user._id, email: user.email };
    // ******* This is payload to token ********

    const token = jwt.sign(payload, process.env.SECRET_KEY);
    return res.status(200).send({ token });
  } catch (error) {
    // console.error(`Error saving user ${error.message}`);
    return res.status(500).send({ message: error.message});
  }
};

//  returns status code 200 or 400
//  returns {message : "...."}
const verifyToken = async (req, res) => {
  // console.log("hit");
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Access Denied" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).send("Invalid token");
  }
  try {
    // console.log("called inside try", token);
    jwt.verify(token, process.env.SECRET_KEY, async (err, payload) => {
      if (err) return res.status(400).send({ message: "Invalid Token" });
      const user = await User.findById(payload.id);
      if (!user) return res.status(400).send({ message: "User not found" });
      // console.log("verification done");
      return res.status(200).send({ message: "Token verified successfully" });
    });
  } catch (error) {
    return res.status(400).send({ message: "something went wrong" });
  }
};

// parameters: {email}
// returns : {messgae : "...."}
// sends otp to the email length ==6
const sendOtp = async (req, res) => {
 
  const { email } = req.body;
  console.log(email);
  if (!email || email == "") {
    console.log("error in email");
    return res.status(400).send("Please enter email");
  }
  
  // console.log(email);
  // const otp = "1234";
  // Send OTP via email
  const otp = speakeasy.totp({
    secret: process.env.SECRET_KEY,
    encoding: "base32",
    step: 60, // OTP valid for 5 minutes
    digits: 6, // Length of the OTP (default is 6)
  });
  console.log(otp);
  const expiry = new Date();
  const otpAuth = new OtpAuth({
    email,
    otp,
    expiresAt: expiry.setMinutes(expiry.getMinutes() + 1),
  });
  try {
    await otpAuth.save();
    sendMail(email, "OTP", `Your OTP is ${otp}`);
    return res.status(200).send("OTP sent successfully");
  } catch (error) {
    console.error(`Error saving otp ${error.message}`);
    return res.status(500).send("Error saving otp");
  }
};

// parameters: {email, otp}
// returns : {messgae : "...."}
// updates isVerified to true
const verifyOtp = async (req, res) => {

  const { email, otp } = req.body;
   
  if (!email || email == "" || !otp || otp == "") {
    return res.status(400).send("Please enter email and otp");
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send("User not found");
  }
  if(user.isVerified){
    return res.status(403).send({message : "User already verified"});
  }

  const otpAuth = await OtpAuth.findOne({ email });
  if (!otpAuth) {
    await user.delete();
    return res.status(400).send("Invalid OTP request NULL");
  }
  if (otpAuth.expiresAt < new Date()) {
    await OtpAuth.deleteOne({ email });
    return res.status(400).send("OTP expired, Please request for new OTP");
  }
  if (otpAuth.otp !== otp) {
    return res.status(400).send("Invalid OTP");
  }

  try {
    await OtpAuth.deleteOne({ email });
    user.isVerified = true;
    await user.save();
    return res.status(200).send({ message: "User verified successfully"});
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    }); 
  }
   
};


// parameters: {email}
const unverifyUser = async (req, res) => {
  console.log("Hit");
  const { email } = req.body;
  console.log(email);
  if (!email || email == "") {
    return res.status(400).send({message : "Please enter email"});
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send("User not found");
  }
  if (!user.isVerified) {
    return res.status(403).send({ message: "User already unverified" });
  }
  try {
    user.isVerified = false;
    await user.save();
    return res.status(200).send({ message: "User unverified successfully" });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
}

export { register, login, verifyToken, sendOtp, verifyOtp , unverifyUser};
