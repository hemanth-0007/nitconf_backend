import Reviewer from "../models/Reviewer.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const reviewerLogin = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password || email == "" || password == "") {
        return res.status(400).send({ message: "Please enter all the feilds" });
    }
  try {
    const reviewer = await Reviewer.findOne({ email: email });
    if (reviewer == null || reviewer == undefined) {
      return res.status(400).send({ message: "Reviewer not exits please sign up" });
    }
    const isMatch = await bcrypt.compare(password, reviewer.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Invalid credentials" });
    }
    // ******* This is payload to token ********
    const payload = { id: reviewer._id, email: reviewer.email };
    // ******* This is payload to token ********

    const token = jwt.sign(payload, process.env.SECRET_KEY);
    return res.status(200).send({ token });
  } catch (error) {
    // console.error(`Error saving user ${error.message}`);
    return res.status(500).send({ message: error.message });
  }
}
const reviewerRegister = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    // can add validation here
    try {
      const dbUser = await Reviewer.findOne({ email: email });
      if (dbUser) res.status(401).send({ message: "User already exists" });
    } catch (error) {
      // console.error(`Error finding user ${error.message}`);
      res.status(500).send({ message: "Error finding user" });
    }
    const hashedPassword = await bcrypt.hash(password, process.env.SALT_ROUNDS);
    const reviewer = new Reviewer({
      firstname: firstName,
      lastname: lastName,
      email,
      password: hashedPassword,
    });
    try {
      await reviewer.save();
      res.status(201).send({ message: "Reviewer saved" });
    } catch (error) {
      // console.error(`Error saving user ${error.message}`);
      res.status(500).send({ message: "Internal Error while saving the user" });
    }
}

const verifyToken = async (req, res) => {
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
      jwt.verify(token, SECRET_KEY, async (err, payload) => {
        if (err) return res.status(400).send({ message: "Invalid Token" });
        const reviewer = await Reviewer.findById(payload.id);
        if (!reviewer) return res.status(400).send({ message: "User not found" });
        return res.status(200).send({ message: "Token verified successfully" });
      });
    } catch (error) {
      return res.status(400).send({ message: "something went wrong" });
    }
}

const getProfile = async (req, res) => {
    const id = req.params.id;
    if(!id) return res.status(400).send({message: "Please provide the id"});
    try {
        const reviewer = await Reviewer.findById(id);
        if (!reviewer) return res.status(400).send({ message: "User not found" });
        const { firstname, lastname, email, expert_at } = reviewer;
        const profile = { firstname, lastname, email, expert_at };
        return res.status(200).send({ profile });
    } catch (error) {
        console.error(`Error finding user ${error.message}`);
       return  res.status(500).send({ message: error.message });
    }

}



export { reviewerLogin, reviewerRegister , verifyToken, getProfile};