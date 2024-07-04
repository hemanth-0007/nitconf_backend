import mongoose from "mongoose";
const Schema = mongoose.Schema;
import validator from "validator";

const reviewSchema = new Schema({
  body: {
    type: String,
    required: true,
    validate: {
      validator: validateReview,
      message: (props) => `${props.value} is longer than 500 characters!
                            or contains special characters!`,
    },
  },
  rating : {
    type: Number,
    required: true,
    min: [1, "Rating must be between 1 and 10"],
    max: [10, "Rating must be between 1 and 10"]
  },
  document: {
    type: Schema.Types.ObjectId,
    ref: "Document",
    // immutable: true,
  },

  reviewer: {
    type: Schema.Types.ObjectId,
    ref: "Reviewer",
  },
});

function validateReview(body) {
  if (body.length > 500) {
    return false;
  }
  if (!validator.isAlpha(body, "en-US", { ignore: " " })) {
    return false;
  }
  return true;
}

const Review = mongoose.model("Review", reviewSchema);
export default Review;
