import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg sticky top-0 z-20">
      <Link to="/" className="text-2xl font-extrabold tracking-tight">
        Pollify
      </Link>
      <div className="space-x-6">
        <Link
          to="/"
          className="text-white hover:text-yellow-200 transition-colors duration-200 font-medium"
        >
          Home
        </Link>
        <Link
          to="/create"
          className="text-white hover:text-yellow-200 transition-colors duration-200 font-medium"
        >
          Create Poll
        </Link>
      </div>
    </nav>
  );
}
