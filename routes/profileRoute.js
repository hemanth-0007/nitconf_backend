import express from "express";
const profileRoute = express.Router();
import { authenticateToken } from "../middleware/jwtAuth.js";

import { isVerified } from "../middleware/roleCheck.js";

import { getProfile, updateProfile } from "../controller/profileController.js";

// get the profile of the user
// gets only firstname, lastname, email
profileRoute.get("/get/", authenticateToken,
    isVerified,
     getProfile );

// update the profile of the user
// request body : {firstname, lastname}
// updates only firstname, lastname
// if error occurs, send the error message as {message : "error_message"}
profileRoute.post("/update/", authenticateToken,
    isVerified, updateProfile);





export default profileRoute;