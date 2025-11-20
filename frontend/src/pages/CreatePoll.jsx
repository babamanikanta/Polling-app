import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios"; // ✅ IMPORTANT — axios added

export default function CreatePoll() {
  const location = useLocation();
  const navigate = useNavigate();
  const editingPoll = location.state?.poll;

  const [question, setQuestion] = useState(editingPoll?.question || "");
  const [options, setOptions] = useState(
    editingPoll?.options?.map((opt) => opt.text) || ["", ""]
  );
  const [expiresAt, setExpiresAt] = useState(editingPoll?.expiresAt || "");

  const handleChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleDeleteOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question || options.length < 2) {
      alert("Please enter a question and at least two options.");
      return;
    }

    // Backend expects { text: "Option" }
    const formattedOptions = options.map((opt) => ({ text: opt }));

    try {
      const response = await axios.post("http://localhost:5000/api/polls", {
        question,
        options: formattedOptions,
        expiresAt,
      });

      console.log("Poll created:", response.data);

      navigate("/"); // Go back to home after creating poll
    } catch (error) {
      console.error("Error creating poll:", error);
      alert("Failed to create poll. Check backend.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          {editingPoll ? "Edit Poll" : "Create a Poll"}
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
        >
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Poll Question
            </label>
            <input
              type="text"
              placeholder="Enter your poll question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          {options.map((opt, i) => (
            <div key={i} className="mb-4 flex items-center gap-2">
              <div className="flex-1">
                <label className="block text-gray-700 font-medium mb-2">
                  Option {i + 1}
                </label>
                <input
                  type="text"
                  value={opt}
                  placeholder={`Option ${i + 1}`}
                  onChange={(e) => handleChange(i, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              {i > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteOption(i)}
                  className="mt-7 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddOption}
            className="text-indigo-600 font-medium mb-4 hover:text-indigo-800 transition-colors"
            disabled={options.length >= 6}
          >
            + Add another option
          </button>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Expiration Date (Optional)
            </label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            {editingPoll ? "Update Poll" : "Submit Poll"}
          </button>
        </form>
      </div>
    </div>
  );
}
