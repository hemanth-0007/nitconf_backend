import express from "express";
const reviewRoute= express.Router();
import {addReview, getReview, updateReview, deleteReview} from "../controller/reviewController.js";
import {authenticateToken} from "../middleware/jwtAuth.js";
import {isReviewer} from "../middleware/isReviewer.js";


// an api to right review
// it takes document id, reviewer id, review body
reviewRoute.post("/add/:doc_id", authenticateToken, isReviewer ,addReview);
 
reviewRoute.get("/get/:id", authenticateToken,isReviewer, getReview);
 
reviewRoute.put("/update/:id", authenticateToken,isReviewer, updateReview);

reviewRoute.delete("/delete/:id", authenticateToken,isReviewer, deleteReview);

 
export default reviewRoute;
