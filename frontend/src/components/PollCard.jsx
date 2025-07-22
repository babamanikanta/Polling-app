import { useState } from "react";

export default function PollCard({ poll, onDelete, onEdit, onShare }) {
  // Ensure poll.options is always an array
  const options = Array.isArray(poll.options) ? poll.options : [];
  const [votes, setVotes] = useState(
    poll.votes || options.map((opt) => opt.votes || 0)
  );
  const [hasVoted, setHasVoted] = useState(false);
  const totalVotes = votes.reduce((sum, vote) => sum + vote, 0);

  const isExpired = poll.expiresAt
    ? new Date(poll.expiresAt) < new Date()
    : false;

  const handleVote = (index) => {
    if (isExpired || hasVoted) return;
    const newVotes = [...votes];
    newVotes[index] += 1;
    setVotes(newVotes);
    setHasVoted(true);
    const storedPolls = JSON.parse(localStorage.getItem("polls") || "[]");
    const updatedPolls = storedPolls.map((p) =>
      p._id === poll._id ? { ...p, votes: newVotes } : p
    );
    localStorage.setItem("polls", JSON.stringify(updatedPolls));
  };

  const handleDelete = () => {
    console.log("Deleting poll:", poll._id);
    onDelete(poll._id);
  };

  const handleEdit = () => onEdit(poll);
  const handleShare = () => {
    if (onShare) {
      onShare(poll._id);
    } else {
      console.warn("onShare function not provided");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">
        {poll.question}
      </h2>
      {isExpired && (
        <p className="text-red-500 font-medium mb-2">This poll has expired</p>
      )}
      <div className="grid gap-2">
        {options.map((opt, i) => (
          <button
            key={opt._id || i} // Use a unique key if available
            onClick={() => handleVote(i)}
            disabled={isExpired || hasVoted}
            className="p-3 text-left rounded-lg border-2 border-indigo-300 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200"
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-700">{opt.text}</span>
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
      <div className="flex justify-between mt-4">
        <button
          onClick={handleEdit}
          className="text-indigo-600 hover:text-indigo-800 font-medium"
          disabled={isExpired}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(poll._id || poll.id)}
          className="text-red-600 hover:text-red-800 font-medium"
        >
          Delete
        </button>
        <button
          onClick={() => onShare(poll._id || poll.id)}
          className="text-green-600 hover:text-green-800 font-medium"
        >
          Share
        </button>
      </div>
    </div>
  );
}
