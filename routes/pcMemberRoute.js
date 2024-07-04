import {
  addReviewer,
  removeReviewer,
  getAllUsers,
  getAllReviewers,
  assignReviewer,
  acceptPaper,
  rejectPaper,
  getAssignedPapers,
  loginPcMember,
  setPaperPending
} from "../controller/pcMemberController.js";
import express from "express";
import {authenticateToken} from "../middleware/jwtAuth.js";
import { isPcMember } from "../middleware/roleCheck.js";

const pcMemberRoute = express.Router();



pcMemberRoute.post('/login/', loginPcMember)

// { firstname, lastname, password, expert_at } --> body
pcMemberRoute.post("/add/",authenticateToken, isPcMember, addReviewer);

// get all the users route
pcMemberRoute.get("/get-user/", authenticateToken, isPcMember, getAllUsers);

// get all the reviewers route
pcMemberRoute.get("/get-reviewer/", authenticateToken, isPcMember, getAllReviewers);

// assign a reviewer to a paper
// /assign/:reviewer_id/:paper_id
pcMemberRoute.post("/assign/:reviewer_id/:paper_id", authenticateToken, isPcMember, assignReviewer);

// accept a paper
// /accept/:paper_id
pcMemberRoute.post("/accept/:paper_id", authenticateToken, isPcMember, acceptPaper);


// reject a paper
// /reject/:paper_id
pcMemberRoute.post("/reject/:paper_id", authenticateToken, isPcMember, rejectPaper);

// set the status of a paper to pending
pcMemberRoute.post("/pending/:paper_id", authenticateToken, isPcMember, setPaperPending);



export default pcMemberRoute;