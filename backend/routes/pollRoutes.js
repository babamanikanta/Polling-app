console.log("pollRoutes loaded");
import express from "express";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

// Temporary in-memory storage
let polls = [];

// CREATE a poll
router.post("/", (req, res) => {
  const { question, options, expiresAt } = req.body;

  if (!question || !options || options.length < 2) {
    return res.status(400).json({ message: "Invalid poll data" });
  }

  const newPoll = {
    id: uuidv4(),
    question,
    options: options.map((opt) => ({
      text: opt.text,
      votes: 0,
    })),
    createdAt: new Date(),
    expiresAt: expiresAt || null,
  };

  polls.push(newPoll);

  res.status(201).json(newPoll);
});

// GET all polls
router.get("/", (req, res) => {
  res.json(polls);
});

// GET poll by ID
router.get("/:id", (req, res) => {
  const poll = polls.find((p) => p.id === req.params.id);

  if (!poll) {
    return res.status(404).json({ message: "Poll not found" });
  }

  res.json(poll);
});

// ⭐ VOTE on a poll WITH EXPIRY CHECK
router.post("/:id/vote", (req, res) => {
  const { index } = req.body;
  const poll = polls.find((p) => p.id === req.params.id);

  if (!poll) return res.status(404).json({ message: "Poll not found" });

  // ⭐ EXPIRY CHECK
  if (poll.expiresAt && new Date() > new Date(poll.expiresAt)) {
    return res.status(400).json({ message: "Poll expired" });
  }

  if (index === undefined || index < 0 || index >= poll.options.length) {
    return res.status(400).json({ message: "Invalid option index" });
  }

  poll.options[index].votes += 1;

  res.json(poll);
});

export default router;
