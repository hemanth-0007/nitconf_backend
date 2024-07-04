import express from "express";

import {
  register,
  login,
  verifyToken,
  sendOtp,
  verifyOtp,
  unverifyUser,
} from "../controller/authController.js";

import { isVerified } from "../middleware/roleCheck.js";

const authRoute = express.Router();

authRoute.post("/register/", register);

authRoute.post("/login/",isVerified, login);

authRoute.get("/verify-token/", verifyToken);

authRoute.put("/forgot-password/", (req, res) => {});

authRoute.post("/send-otp/", sendOtp);

authRoute.post("/verify-otp/", verifyOtp);

authRoute.put("/unverify/", unverifyUser);

export default authRoute;
