import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreatePoll from "./pages/CreatePoll";

export default function App() {
  return (
    <>
      {/* <div className="bg-blue-500 p-4 mb-4">Test Style</div> */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePoll />} />
        </Routes>
      </Router>
    </>
  );
}
