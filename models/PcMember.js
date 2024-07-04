import mongoose from "mongoose";
const Schema = mongoose.Schema;
import { Role } from "../Enums/role.js";

const PcMemberSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    immutable: true,
    lowercase: true,
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
  reviewersAdded: [
    {
      type: Schema.Types.ObjectId,
      ref: "Reviewer",
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: Role.PC_MEMBER,
    enum: {
      values: [Role.AUTHOR, Role.REVIEWER, Role.PC_MEMBER],
      message: "{VALUE} is not supported",
    },
    immutable: true,
  },
});

function validateEmail(email) {
  // regex for email validation
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
}

const PcMember = mongoose.model("PcMember", PcMemberSchema);

export default PcMember;
