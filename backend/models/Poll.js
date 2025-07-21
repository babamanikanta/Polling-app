import mongoose from "mongoose";

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ text: String, votes: { type: Number, default: 0 } }], // Array of objects with text and votes
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Poll", pollSchema);
