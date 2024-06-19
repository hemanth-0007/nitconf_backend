const express = require("express");
const router = express.Router();
const Reviewer = require("../models/Reviewer");
require("dotenv").config();
const authenticateToken = require("../authenticate/jwtAuth"); 
const isPcMember = require("../authenticate/isPcMember"); 
const validateReviewerRegister = require("../validation/validateReviewerRegister");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// get the profile of the reviewer
// gets only {firstname, lastname, email, expert_at}
router.get("/profile/:id", async (req, res) => {});


// register the reviewer account only by the PC member
// request body : {firstname, lastname, email, password, expert_at}
// add some validation for the request body feilds
// MIDDLEWARES : check if the user is PC member and 
// if the user is already registered or not
router.post("/register/", authenticateToken, isPcMember,validateReviewerRegister, async (req, res) => {
    const { firstname, lastname, email, password, expert_at } = req.body;
    // console.log(req.body);
     
    try {
      const user = await Reviewer.findOne({ email: email });
      if (user) {
        return res.status(400).send({message : "User already exits"});
      }
      const hashedPassword = await bcrypt.hash(password, process.env.SALT_ROUNDS);

      const newUser = new Reviewer({
        firstname,
        lastname,
        email,
        password : hashedPassword,
        expert_at,
      });
      await newUser.save();
      return res.status(200).send({message : "User saved successfully"});
    } catch (error) {
      // console.error(`Error saving user ${error.message}`);
      return res.status(500).send({message : "Error saving user"});
    }
});




// reviwer login
// request body : {email, password}
// verified by the PC member will have two factor authentication
router.post("/login/", async (req, res) => {
    const { email, password } = req.body;
    // console.log(req.body);
    if (!email || !password || email == "" || password == "") {
      return res.status(400).send({message : "Please enter all the feilds"});
    }
    try {
      const reviewer = await Reviewer.findOne({ email: email });
      if (reviewer == null || reviewer == undefined) {
        return res.status(400).send({message : "User not exits"});
      }
      const isMatch = await bcrypt.compare(password, reviewer.password);
      if (!isMatch) {
        return res.status(400).send({message : "Invalid credentials"});
      }
      const payload = { id: reviewer._id, email: reviewer.email };
      const token = jwt.sign(payload, process.env.SECRET_KEY);
      return res.status(200).send({ token });
    } catch (error) {
      console.error(`Error saving user ${error.message}`);
      return res.status(500).send("Error saving user");
    }
});



// verify the reviwer account token i,e if the reviewer is registered or not
router.post("/verify-token/", async (req, res) => {});



module.exports = router;
