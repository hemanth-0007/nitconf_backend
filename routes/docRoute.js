import express from "express";
const docRoute = express.Router();

import { authenticateToken } from "../middleware/jwtAuth.js";
import { isVerified } from "../middleware/roleCheck.js";

// file upload
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

import {
  getAllDocs,
  getLatestDoc,
  uploadDoc,
  updateDoc,
  deleteDoc,
} from "../controller/docController.js";

// get all the documents for the paper
// params : id --> paper id
docRoute.get("/all/:id", authenticateToken,isVerified,
   getAllDocs);

// get the latest documents for the user
docRoute.get("/get-latest/:id", authenticateToken,
  isVerified, getLatestDoc);

// upload a new document
// body : changes_description
// file : pdf-file
docRoute.post(
  "/add/:id",
  authenticateToken,
  isVerified,
  upload.single("pdf-file"),
  uploadDoc
);

// update the document
// body : changes_description
// params : id --> document id, paper-id --> paper id
// file : pdf-file
docRoute.put("/paper/:paper-id/update/:id", authenticateToken,
  isVerified, updateDoc);

// delete the document
// if the documents are 1 then it will through an error
// params : id --> document id, paper-id --> paper id
docRoute.delete("/paper/:paper-id/delete/:id", authenticateToken, 
  isVerified,deleteDoc);

export default docRoute;
