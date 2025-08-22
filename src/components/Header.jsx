"use client";
import * as React from 'react';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from "next/link";
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="mx-auto px-4 h-[70px] flex justify-between items-center max-w-7xl">

              {/* Right side: Logo + Title */}
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center">
            <img 
              src="/images/logo-balance.png" 
              alt="Balance Desalination Simulator Logo" 
              className="h-10 w-auto object-contain transition-transform duration-150 active:scale-95 cursor-pointer"
            />
          </a>
          <h1 className="hidden lg:block text-lg xl:text-2xl font-sans text-gray-900">
            Balance Desalination Simulator
          </h1>
        </div>
        
        {/* Left side: Menu + Dashboard */}
        <div className="flex items-center gap-3">
          
          {/* Dashboard button */}
          <Link href="/dashboard">
          <button className="bg-sky-300 text-white px-3 py-1 rounded text-sm sm:text-base hover:bg-sky-400 active:scale-95 transition-transform duration-150 cursor-pointer">
            Dashboard
          </button>
          </Link>

          {/* Mobile menu icon */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md hover:bg-gray-100 active:scale-95 transition-transform duration-150 sm:hidden text-gray-800"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

        </div>

  

        {/* Desktop: Login + Register */}
        <div className="hidden sm:flex items-center gap-8">
          <button className="text-[rgb(66,153,136)] font-semibold text-sm sm:text-base border-b-4  border-[rgb(66,153,136)] active:scale-95 transition-transform duration-150 cursor-pointer">
            Login
          </button>
          <button className="bg-[rgb(66,153,136)] text-white font-semibold px-6 py-3 rounded-lg text-sm sm:text-base hover:bg-[rgb(54,124,110)] active:scale-95 transition-transform duration-150 cursor-pointer">
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
