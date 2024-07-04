// Here we will assume that only one admin credentials are there in the database.
// So, we will not use any id to get the admin credentials.
//  and this admin can update his/her credentials.

// functionalities of admin
//  1.can add the pcMember --> admin has lot of power
// 2.can add the revier direcly
// 3. can access anything of the database
// 4. able to change the DEADLINE of the paper submission***
// 5. able to change the DEADLINE of the review submission***

// ******
// since this is admin access we assume the admin hw uses it responsibly and
// we will no have any validation for the admin entered data in the database
// ******

// const regex = /^[a-zA-Z\s][a-zA-Z0-9\s]+$/;
// console.log(regex.test('sadn%^%$%^ fsda DSA fdas321fdsDJDOPSWJ  ffds  ds 2fdsa34')) // true

import PcMember from "../models/PcMember.js";
import Admin from "../models/Admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// body is  {firstname, lastname , username, email, password}
const addPcMember = async (req, res) => {
  const { firstname, lastname, username, email, password } = req.body;
  if (!firstname || !lastname || !username || !email || !password) {
    return res.status(400).json({ message: "Please enter all the fields" });
  }
  const member = await PcMember.findOne({ email });
  if (member) {
    return res.status(400).json({ message: "Email is already taken" });
  }
 
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newPcMember = new PcMember({
        firstname,
        lastname,
        username,
        email,
        password : hashedPassword,
      });
    const savedPcMember = await newPcMember.save();
    return res.status(200).send({ message: "Pc Member added successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addAdmin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all the fields" });
  }
  const admin = await Admin.findOne({ email });
  if (admin) {
    return res.status(400).json({ message: "Emial is already taken" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newAdmin = new Admin({
    email,
    password: hashedPassword,
  });
  try {
    await newAdmin.save();
    return res.status(200).send({ message: "Admin added successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || email == "" || password == "") {
    return res.status(400).send({ message: "Please enter all the feilds" });
  }
  console.log(email);
  try {
    const admin = await Admin.findOne({ email });
    console.log(admin);
    if (admin == null || admin == undefined) {
      return res.status(400).send({ message: "Admin not exits" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Invalid credentials" });
    }
    // ******* This is payload to token ********
    const payload = { id: admin._id, email: admin.email };
    // ******* This is payload to token ********
    const token = jwt.sign(payload, process.env.SECRET_KEY);
    return res.status(200).send({ token });
  } catch (error) {
    //   console.error(`Error saving user ${error.message}`);
    return res.status(500).send({ message: error.message });
  }
};

export { addPcMember, addAdmin, login };
