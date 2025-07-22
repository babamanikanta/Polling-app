console.log("pollRoutes loaded"); // Add this at the top
import express from "express";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

let polls = []; // temporary storage

// POST /api/polls
router.post("/", (req, res) => {
  const { question, options, expiresAt } = req.body;

  if (!question || !options || options.length < 2) {
    return res.status(400).json({ message: "Invalid poll data" });
  }

  const newPoll = {
    id: uuidv4(),
    question,
    options: options.map((opt) => ({ text: opt.text, votes: 0 })),
    createdAt: new Date(),
    expiresAt: expiresAt || null,
  };

  polls.push(newPoll);

  res.status(201).json(newPoll);
});

export default router;
