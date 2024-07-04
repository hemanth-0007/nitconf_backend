import express from "express";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();

 

import { authenticateToken } from "../middleware/jwtAuth.js";
import { isPcMember, isReviewer } from "../middleware/roleCheck.js";
 
import { reviewerLogin, reviewerRegister , verifyToken, getProfile} from "../controller/reviwerAuthController.js";


// get the profile of the reviewer
// gets only {firstname, lastname, email, expert_at}
router.get("/profile/:id",authenticateToken, isReviewer,  getProfile);


// register the reviewer account only by the PC member
// request body : {firstname, lastname, email, password, expert_at}
// add some validation for the request body feilds
// MIDDLEWARES : check if the user is PC member and 
// if the user is already registered or not
router.post("/register/", authenticateToken, isPcMember,  reviewerRegister);




// reviwer login
// request body : {email, password}
// verified by the PC member will have two factor authentication
router.post("/login/", reviewerLogin );



// verify the reviwer account token i,e if the reviewer is registered or not
router.post("/verify-token/", verifyToken );



export default router;
