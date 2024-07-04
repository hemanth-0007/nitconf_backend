import Review from '../models/Review.js';
import Reviewer from '../models/Reviewer.js';
import Document from '../models/Document.js';

// {POST} /api/reviews/:id (id is document id)
// {rating, comment} = req.body
// Add a review to a paper
const addReview = async (req, res) => {
    const {doc_id} = req.params;
    const { email, user_id } = req;
    const {rating, comment} = req.body;
    const newReview = new Review({
        rating,
        body : comment,
        document: doc_id,
        reviewer: user_id
    });
    try {
        const savedReview = await newReview.save();
        console.log(doc_id);
        const document = await Document.findById(doc_id);
        document.reviews.push(savedReview._id);
        await document.save();
        return  res.status(201).json({message : "Review added successfully"});
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
}

// id is the review id
const getReview = async (req, res) => {
    const {id} = req.params; // id is the review id
    if(!id) return res.status(400).json({message : "Invalid id"});
    const {email, user_id} = req;
    try {        
        const review = await Review.findById(id);
        if(review.reviewer != user_id) return res.status(403).json({message : "Forbidden access"});
        if(!review) return res.status(404).json({message : "Review not found"});
        const data = {
            rating : review.rating,
            comment : review.body
        }
        return res.status(200).send(data);
    } catch (error) {
        
    }
}


// {rating , comment} = req.body;
// id is the review id
const updateReview = async (req, res) => {
    console.log("update review");
    const {id} = req.params; // id is the review id
    if(!id) return res.status(400).json({message : "Invalid id"});
    const {rating , comment} = req.body;
    const {email, user_id} = req;
    try {
        const review = await Review.findById(id);
        if(review.reviewer != user_id) return res.status(403).json({message : "Forbidden access"});
        if(!review) return res.status(404).json({message : "Review not found"});
        const document = await Document.findById(review.document);
        document.reviews.pull(id);
        review.rating = rating;
        review.body = comment;
        const savedReview =  await review.save();
        document.reviews.push(savedReview._id);
        await document.save();
        return res.status(200).json({message : "Review updated successfully"});
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
}

// id is the review id
const deleteReview  = async (req, res) => {
    const {emial, user_id} = req;
    const {id} = req.params;
    if(!id) return res.status(400).json({message : "Invalid id"});
    try {
        const review = await Review.findById(id);
        if(review.reviewer != user_id) return res.status(403).json({message : "Forbidden access"});
        if(!review) return res.status(404).json({message : "Review not found"});
        const document = await Document.findById(review.document);
        document.reviews.pull(id);
        await document.save();
        await Review.findByIdAndDelete(id);
        return res.status(200).json({message : "Review deleted successfully"});
    } catch (error) {
        return res.status(500).json({message : error.message});
    }
}

export {addReview, getReview, updateReview, deleteReview};