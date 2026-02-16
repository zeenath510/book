import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-bold">
          📚 Book Recommendation
        </NavLink>
        <div className="space-x-6">
          <NavLink to="/" className="hover:text-blue-600">Home</NavLink>
          <NavLink to="/auth/user-sign-in" className="hover:text-blue-600">
            User
          </NavLink>
          <NavLink to="/auth/sign-in" className="hover:text-blue-600">
            Admin
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
