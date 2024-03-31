import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  // Schema definition here
  username: {
    type: String,
    required: [true, "Please enter your username..!!"],
  },
  password: { type: String, required: [true, "Please enter password..!!"] },
  email: { type: String, required: [true, "Please enter email..!!"] },
});
export const UserDB = mongoose.model("User", UserSchema);
