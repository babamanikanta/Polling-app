import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [expiresAt, setExpiresAt] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = !!location.state?.poll;
  const pollToEdit = location.state?.poll;

  useEffect(() => {
    if (isEditing) {
      setQuestion(pollToEdit.question);
      setOptions(pollToEdit.options);
      setExpiresAt(pollToEdit.expiresAt || "");
    }
  }, [isEditing, pollToEdit]);

  const handleAddOption = () => {
    if (options.length < 6) setOptions([...options, ""]);
  };

  const handleChange = (i, val) => {
    const newOptions = [...options];
    newOptions[i] = val;
    setOptions(newOptions);
  };

  const handleDeleteOption = (i) => {
    if (options.length > 2 && i > 1) {
      const newOptions = options.filter((_, index) => index !== i);
      setOptions(newOptions);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validOptions = options.filter((opt) => opt.trim());
    if (validOptions.length < 2) {
      alert("Please provide at least two non-empty options.");
      return;
    }
    const newPoll = {
      id: isEditing ? pollToEdit.id : uuidv4(),
      question,
      options: validOptions,
      votes: isEditing ? pollToEdit.votes : Array(validOptions.length).fill(0),
      expiresAt: expiresAt || null,
    };
    const storedPolls = JSON.parse(localStorage.getItem("polls") || "[]");
    const updatedPolls = isEditing
      ? storedPolls.map((p) => (p.id === pollToEdit.id ? newPoll : p))
      : [...storedPolls, newPoll];
    localStorage.setItem("polls", JSON.stringify(updatedPolls));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          {isEditing ? "Edit Poll" : "Create a Poll"}
        </h1>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
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
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            {isEditing ? "Update Poll" : "Submit Poll"}
          </button>
        </div>
      </div>
    </div>
  );
}
