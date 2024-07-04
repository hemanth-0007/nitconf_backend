import express from "express";
const paperRoute = express.Router();

import { authenticateToken } from "../middleware/jwtAuth.js";
import { validatePaperRequest } from "../validation/validatePaperRequest.js";
import {
  getAllPapers,
  getPaper,
  addPaper,
  deletePaper,
  updatePaper,
} from "../controller/paperController.js";
import { isVerified } from "../middleware/roleCheck.js";

// get all the papers for the user
paperRoute.get("/all/", authenticateToken,isVerified, getAllPapers);

paperRoute.get("/get/:id", authenticateToken,isVerified, getPaper);

// add a paper to the user's collection
paperRoute.post(
  "/add/",
  authenticateToken,
  isVerified,
  validatePaperRequest,
  addPaper
);

// delete a paper from the user's collection
paperRoute.delete("/delete/:id", authenticateToken,
  isVerified, deletePaper);

// update a paper in the user's collection
paperRoute.put(
  "/update/:id",
  authenticateToken,
  isVerified,
  validatePaperRequest,
  updatePaper
);

export default paperRoute;
