import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function LandingPage() {
  return (
    <div>
      <Navbar />
      <main className="pt-20">
        <HeroSection />
      </main>

      {/* ✅ Stylish Footer with Background + Parallax */}
      <footer
        className="relative text-white mt-10 bg-fixed"
        style={{
          backgroundImage: "url('/img/pattern.png')", // ✅ from public folder
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/5"></div>

        {/* Content */}
        <div className="relative container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <h2 className="text-2xl font-bold tracking-wide">📚 Book Recommendation</h2>
            <p className="mt-3 text-sm text-gray-300 leading-relaxed">
              Discover, recommend, and share your favorite books with a growing
              community of readers.
            </p>
          </div>
        
        </div>

        {/* Bottom Bar */}
        <div className="relative border-t border-gray-700 py-4 text-center text-sm text-gray-300">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-white">Book Recommendation</span>. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
