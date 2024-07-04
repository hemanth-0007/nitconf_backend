import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { Role } from "../Enums/role.js";
import validator from "validator";

const reviewerSchema = new Schema({
  firstname: {
    type: String,
    required: true,
    validate: {
      validator: validateName,
      message: (props) => `${props.value} exceeds the limit of 15 characters!
                                or it contains special characters!`,
    },
    // minLength: 15,
  },
  lastname: {
    type: String,
    required: true,
    validate: {
      validator: validateName,
      message: (props) => `${props.value} exceeds the limit of 15 characters!
                                or it contains special characters!`,
    },
    // minLength: 15,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    immutable: true,
    validate: {
      validator: validateEmail,
      message: (props) => `${props.value} is not a valid email!`,
    },
    unique: true, // much important
  },
  password: {
    type: String,
    required: true,
  },
  expert_at: [
    {
      type: String,
      default: [],
      // minlength: 10,
      // maxlength: 100
    },
  ],
  assigned_papers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Paper",
      default: [],
    },
  ],
  reviewed_papers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Paper",
      default: [],
    },
  ],
  unreviewed_papers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Paper",
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: Role.REVIEWER,
    immutable: true,
  },
});

function validateEmail(email) {
  // regex for email validation
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
}

function validateName(name) {
  if (name.length > 15) return false;
  // regex for name validation
  if (!validator.isAlpha(name, "en-US", { ignore: " " })) return false;
  return true;
}

const Reviewer = mongoose.model("Reviewer", reviewerSchema);

export default Reviewer;
