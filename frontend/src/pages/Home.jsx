import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PollCard from "../components/PollCard";

export default function Home() {
  const [polls, setPolls] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedPolls = JSON.parse(localStorage.getItem("polls") || "[]");
    setPolls(storedPolls);
  }, []);

  const handleDelete = (idToDelete) => {
    const updatedPolls = polls.filter(
      (poll) => poll._id !== idToDelete && poll.id !== idToDelete
    );
    setPolls(updatedPolls);
    localStorage.setItem("polls", JSON.stringify(updatedPolls));
  };

  const handleEdit = (poll) => navigate("/create", { state: { poll } });

  const handleShare = (id) => {
    const url = `${window.location.origin}/poll/${id}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Active Polls
        </h1>
        {polls.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No polls available. Create one now!
          </p>
        ) : (
          <div className="grid gap-6">
            {polls.map((poll) => (
              <PollCard
                key={poll._id ? poll._id : poll.id} // Always use a unique key
                poll={poll}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onShare={handleShare}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
