import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function UserNavbar() {
  const navigate = useNavigate();

  // Get logged in user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Brand Name (Left) */}
        <NavLink to="/" className="text-2xl font-bold">
          📚 Book Recommendation
        </NavLink>

        {/* Center Navigation */}
        <div className="flex-1 flex justify-center">
          <NavLink
            to="/user/recommendation"
            className="text-lg font-semibold text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-4 py-4 rounded-md"
          >
            Recommendation
          </NavLink>
        </div>

        {/* Right Side User Info */}
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold">
            Welcome, {user?.uname || "User"}
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
