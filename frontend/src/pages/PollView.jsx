import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function PollView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [votes, setVotes] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);

  // Fetch poll from backend
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/polls/${id}`)
      .then((res) => {
        setPoll(res.data);
        setVotes(res.data.options.map((opt) => opt.votes || 0));
      })
      .catch(() => {
        setPoll(null);
      });
  }, [id]);

  const handleVote = async (index) => {
    if (!poll || hasVoted) return;

    try {
      const res = await axios.post(
        `http://localhost:5000/api/polls/${id}/vote`,
        { index }
      );

      setPoll(res.data);
      setVotes(res.data.options.map((opt) => opt.votes));
      setHasVoted(true);
    } catch (err) {
      console.error("Voting error:", err);
      alert("Voting failed.");
    }
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
