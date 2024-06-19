const express = require("express");
const authenticateToken = require("../authenticate/jwtAuth");
const router = express.Router();
const User = require("../models/User");

// get the profile of the user
// gets only firstname, lastname, email
router.get("/profile/", authenticateToken, async (req, res) => {
  const user_id = req.user_id;
  try {
    const user = await User.findById(user_id);
    const { firstname, lastname, email } = user;
    const data = { firstname, lastname, email };
    res.send(data);
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});

// update the profile of the user
// request body : {firstname, lastname}
// updates only firstname, lastname
// if error occurs, send the error message as {message : "error_message"}
router.post("/profile/update/", authenticateToken, async (req, res) => {
  const user_id = req.user_id;
  const { firstname, lastname } = req.body;
  try {
    const user = await User.findById(user_id);
    if(!user){
      return res.status(400).send({message : "Bad Request User not found"});
    }
    user.firstname = firstname;
    user.lastname = lastname;
    await user.save();
    res.send({message : "Profile updated successfully"});
    
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
});





module.exports = router;
