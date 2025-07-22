// filepath: f:\btech\MERN\polling-app\frontend\src\pages\PollView.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function PollView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [votes, setVotes] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const storedPolls = JSON.parse(localStorage.getItem("polls") || "[]");
    const foundPoll = storedPolls.find((p) => p._id === id || p.id === id);
    setPoll(foundPoll);
    setVotes(foundPoll ? foundPoll.options.map((opt) => opt.votes || 0) : []);
  }, [id]);

  const handleVote = (index) => {
    if (!poll || hasVoted) return;
    const newVotes = [...votes];
    newVotes[index] += 1;
    setVotes(newVotes);
    setHasVoted(true);

    // Update localStorage
    const storedPolls = JSON.parse(localStorage.getItem("polls") || "[]");
    const updatedPolls = storedPolls.map((p) =>
      (p._id || p.id) === (poll._id || poll.id)
        ? {
            ...p,
            options: p.options.map((opt, i) => ({
              ...opt,
              votes: newVotes[i],
            })),
          }
        : p
    );
    localStorage.setItem("polls", JSON.stringify(updatedPolls));
  };

  if (!poll) {
    return (
      <div className="text-center mt-10 text-lg text-gray-500">
        Poll not found.
      </div>
    );
  }

  const totalVotes = votes.reduce((sum, v) => sum + v, 0);

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{poll.question}</h2>
      <div className="grid gap-3">
        {poll.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleVote(i)}
            disabled={hasVoted}
            className="w-full p-3 text-left rounded-lg border-2 border-indigo-300 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200"
          >
            <div className="flex justify-between items-center">
              <span>{opt.text}</span>
              {hasVoted && (
                <span className="text-indigo-600 font-medium">
                  {totalVotes > 0
                    ? Math.round((votes[i] / totalVotes) * 100)
                    : 0}
                  %
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
      {poll.expiresAt && (
        <div className="mt-4 text-sm text-gray-400">
          Expires at: {new Date(poll.expiresAt).toLocaleString()}
        </div>
      )}
      <button
        className="mt-6 text-indigo-600 hover:text-indigo-800 font-medium"
        onClick={() => navigate("/")}
      >
        Back to Home
      </button>
    </div>
  );
}
