import Poll from "../models/Poll.js";

export const createPoll = async (req, res) => {
  const { question, options } = req.body;
  try {
    const newPoll = new Poll({
      question,
      options: options.map((opt) => ({ text: opt })),
    });
    await newPoll.save();
    res.status(201).json(newPoll);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getPolls = async (req, res) => {
  const polls = await Poll.find();
  res.json(polls);
};

export const votePoll = async (req, res) => {
  const { pollId, optionIndex } = req.body;
  const poll = await Poll.findById(pollId);
  if (!poll) return res.status(404).send("Poll not found");

  poll.options[optionIndex].votes += 1;
  await poll.save();
  res.json(poll);
};
