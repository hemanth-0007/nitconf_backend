// decide on questions
//  1. how many reviewers should be assigned to a paper --> 3
// 2. a reviwer can be assigned how many papers at max --> 3
//

import Reviewer from "../models/Reviewer.js";
import PcMember from "../models/PcMember.js";
import User from "../models/User.js";
import Paper from "../models/Paper.js";
import Document from "../models/Document.js";
import { Status } from "../Enums/status.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const loginPcMember = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required!" });
  }
  try {
    const pcMember = await PcMember.findOne({ email });
    if (!pcMember)
      return res.status(404).json({ message: "Pc Member not found!" });
    const isMatch = await bcrypt.compare(password, pcMember.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials!" });
    const token = jwt.sign(
      { email: pcMember.email, id: pcMember._id },
      process.env.SECRET_KEY
    );
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addReviewer = async (req, res) => {
  const { email } = req;
  const pcMember = await PcMember.findOne({ email });
  const { firstname, lastname, password, expert_at } = req.body;
  const reviewerEmail = req.body.email;
  // check if all the fields are present
  if (!firstname || !lastname || !reviewerEmail || !password || !expert_at) {
    return res.status(400).json({ message: "All fields are required!" });
  }
  // check if the email is already registered
  const reviewer = await Reviewer.findOne({ email });
  if (reviewer) {
    return res.status(400).json({ message: "Reviewer already exists!" });
  }
  // create a new reviewer
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
      const newReviewer = new Reviewer({
        firstname,
        lastname,
        email: reviewerEmail,
        password : hashedPassword,
        expert_at,
      });
    const savedReviewer = await newReviewer.save();
    pcMember.reviewersAdded.push(savedReviewer._id);
    await pcMember.save();
    return res.status(201).json({ message: "Reviewer added successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// this should have a reviewer id or email
const removeReviewer = async (req, res) => {};

const getAllUsers = async (req, res) => {
  // these are pc member users
  const { email, user_id } = req;
  const pcMember = await PcMember.findOne({ email });
  if (!pcMember) {
    return res.status(401).json({ message: "Unauthorized access!" });
  }
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllReviewers = async (req, res) => {
  const { email } = req;
  const pcMember = await PcMember.findOne({ email });
  if (!pcMember) {
    return res.status(401).json({ message: "Unauthorized access!" });
  }
  try {
    const reviewers = await Reviewer.find({});
    return res.status(200).json(reviewers);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//   /assign/:reviewer_id/:paper_id
// this should have a reviewer id and a paper id
const assignReviewer = async (req, res) => {
  const { email } = req;
  const pcMember = await PcMember.findOne({ email });
  if (!pcMember) {
    return res.status(401).json({ message: "Unauthorized access!" });
  }
  const reviewer_id = req.params.reviewer_id;
  const paper_id = req.params.paper_id;
  if (!reviewer_id || !paper_id) {
    return res
      .status(400)
      .json({ message: "Reviewer id and paper id are required!" });
  }
  try {
    const reviewer = await Reviewer.findById(reviewer_id);
    if (!reviewer) {
      return res.status(404).json({ message: "Reviewer not found!" });
    }
    const paper = await Paper.findById(paper_id);
    if (!paper) {
      return res.status(404).json({ message: "Paper not found!" });
    }
    reviewer.assigned_papers.push(paper_id);
    await reviewer.save();
    return res.status(200).json({ message: "Reviewer assigned successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// /accept/:paper_id
// this should have a paper id
// final call is based on the pc Members discussion
const acceptPaper = async (req, res) => {
  const { email } = req;
  const pcMember = await PcMember.findOne({ email });
  if (!pcMember) {
    return res.status(401).json({ message: "Unauthorized access!" });
  }
  const paper_id = req.params.paper_id;
  if (!paper_id) {
    return res.status(400).json({ message: "Paper id is required!" });
  }
  try {
    const paper = await Paper.findById(paper_id);
    paper.status = Status.ACCEPTED;
    await paper.save();
    return res.status(200).json({ message: "Paper accepted successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// this should have a paper id
const rejectPaper = async (req, res) => {
  const { email } = req;
  const pcMember = await PcMember.findOne({ email });
  if (!pcMember) {
    return res.status(401).json({ message: "Unauthorized access!" });
  }
  const paper_id = req.params.paper_id;
  if (!paper_id) {
    return res.status(400).json({ message: "Paper id is required!" });
  }
  try {
    const paper = await Paper.findById(paper_id);
    paper.status = Status.REJECTED;
    await paper.save();
    return res.status(200).json({ message: "Paper Rejected successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAssignedPapers = async (req, res) => {};

const setPaperPending = async (req, res) => {
  const { email } = req;
  const pcMember = await PcMember.findOne({ email });
  if (!pcMember) {
    return res.status(401).json({ message: "Unauthorized access!" });
  }
  const paper_id = req.params.paper_id;
  if (!paper_id) {
    return res.status(400).json({ message: "Paper id is required!" });
  }
  try {
    const paper = await Paper.findById(paper_id);
    paper.status = Status.PENDING;
    await paper.save();
    return res
      .status(200)
      .json({ message: "Paper successfully set back to pending" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  loginPcMember,
  addReviewer,
  removeReviewer,
  getAllUsers,
  getAllReviewers,
  assignReviewer,
  acceptPaper,
  rejectPaper,
  getAssignedPapers,
  setPaperPending,
};
