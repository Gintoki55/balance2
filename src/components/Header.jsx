"use client";
import * as React from "react";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-b-gray-200 sticky top-0 z-50">
      <div className="mx-auto px-4 2xl:px-12 h-[70px] 2xl:h-[90px] flex justify-between items-center max-w-7xl 2xl:max-w-[1600px]">

        {/* Right side: Logo */}
        <div className="flex items-center gap-3 2xl:gap-6">
          <a href="/" className="flex items-center">
            <img
              src="/images/logo-balance.png"
              alt="Balance Desalination Simulator Logo"
              className="h-10 w-auto object-contain transition-transform duration-150 active:scale-95 cursor-pointer 2xl:h-12"
            />
          </a>
          <h1 className="hidden lg:block text-lg xl:text-2xl 2xl:text-3xl text-gray-700 font-bold">
            Balance Desalination Simulator
          </h1>
        </div>

        {/* Mobile: Dashboard button (Visible only on mobile) */}
        <div className="flex sm:hidden items-center gap-3">
          <Link href="/dashboard">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg shadow-md active:scale-95 transition border-2 text-sm bg-white text-[#429988] border-[#429988] hover:bg-[#429988] hover:text-white curosr-poiner">
              Dashboard
            </button>
          </Link>

          {/* Mobile menu icon */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md hover:bg-gray-100 active:scale-95 transition text-gray-800 cursor-pointer"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Desktop: Dashboard + Login + Register */}
        <div className="hidden sm:flex items-center gap-4 2xl:gap-6">

          {/* Dashboard */}
          <Link href="/dashboard">
            <button className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg shadow-md active:scale-95 transition border-2 text-sm sm:text-base bg-white text-[#429988] border-[#429988] hover:bg-[#429988] hover:text-white cursor-pointer">
              Dashboard
            </button>
          </Link>

          {/* Login */}
          <button className="px-3 sm:px-4 py-2 rounded-lg shadow-md border-2 bg-[#429988] text-white border-[#429988] hover:bg-white hover:text-[#429988] active:scale-95 cursor-pointer">
            Login
          </button>

          {/* Register */}
          <button className="px-3 sm:px-4 py-2 rounded-lg shadow-md border-2 bg-[#429988] text-white border-[#429988] hover:bg-white hover:text-[#429988] active:scale-95 cursor-pointer">
            Register Now
          </button>
        </div>
      </div>

      {/* Mobile dropdown (NO DASHBOARD HERE) */}
      {menuOpen && (
        <div className="sm:hidden bg-white border-t shadow-md">
          <div className="flex flex-col p-4 gap-3">
            <a href="#" className="text-[rgb(66,153,136)] font-semibold hover:underline">
              Login
            </a>
            <a href="#" className="bg-[rgb(66,153,136)] text-white px-3 py-2 rounded hover:bg-[rgb(54,124,110)] transition  cursor-pointer">
              Register Now
            </a>

            <hr className="my-2 border-gray-200" />
            <a href="about" className="text-gray-700 font-medium hover:text-[rgb(66,153,136)] transition cursor-pointer">
              About
            </a>
            <a href="contact" className="text-gray-700 font-medium hover:text-[rgb(66,153,136)] transition cursor-pointer">
              Contact
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
