"use client";
import * as React from 'react';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-b-gray-200 sticky top-0 z-50">
      <div className="mx-auto px-4 2xl:px-12 h-[70px] 2xl:h-[90px] flex justify-between items-center max-w-7xl 2xl:max-w-[1600px]">

        {/* Right side: Logo + Title */}
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
        
        {/* Left side: Menu + Dashboard */}
        <div className="flex items-center gap-3 2xl:gap-6">
          
          {/* Dashboard button */}
          <Link href="/dashboard">
            <button className="bg-sky-300 text-white px-3 sm:px-4 2xl:px-6 py-1 sm:py-2 2xl:py-3 rounded text-sm sm:text-base 2xl:text-lg hover:bg-sky-400 active:scale-95 transition-transform duration-150 cursor-pointer">
              Dashboard
            </button>
          </Link>

          {/* Mobile menu icon */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md hover:bg-gray-100 active:scale-95 transition-transform duration-150 sm:hidden text-gray-800 cursor-pointer"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

        </div>

        {/* Desktop: Login + Register */}
        <div className="hidden sm:flex items-center gap-8 2xl:gap-12">
          <button className="text-[rgb(66,153,136)] font-semibold text-sm sm:text-base 2xl:text-lg border-b-4 border-[rgb(66,153,136)] active:scale-95 transition-transform duration-150 cursor-pointer">
            Login
          </button>
          <button className="bg-[rgb(66,153,136)] text-white font-semibold px-6 sm:px-8 2xl:px-10 py-3 2xl:py-4 rounded-lg text-sm sm:text-base 2xl:text-lg hover:bg-[rgb(54,124,110)] active:scale-95 transition-transform duration-150 cursor-pointer">
            Register Now
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="sm:hidden bg-white border-t shadow-md">
          <div className="flex flex-col p-4 gap-3">
            <a href="#" className="text-[rgb(66,153,136)] font-semibold hover:underline">
              Login
            </a>
            <a href="#" className="bg-[rgb(66,153,136)] text-white px-3 py-2 rounded hover:bg-[rgb(54,124,110)] transition">
              Register Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
