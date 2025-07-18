import express from "express";
import {
  createPoll,
  getPolls,
  votePoll,
} from "../controllers/pollController.js";

const router = express.Router();
router.post("/", createPoll);
router.get("/", getPolls);
router.post("/vote", votePoll);

export default router;
