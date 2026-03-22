import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  text: String,
  image: String, // ✅ MUST EXIST
  votes: { type: Number, default: 0 },
});

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [optionSchema],
  expiry: { type: Date, required: true },
});

export default mongoose.model("Poll", pollSchema);