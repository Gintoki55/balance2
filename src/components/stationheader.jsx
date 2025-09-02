"use client";
import { ArrowLeft, Play, Bot, Calculator } from "lucide-react";
import Link from "next/link";

export default function StationHeader({ title }) {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-8 sticky top-0 bg-white z-50 px-4 py-3 shadow-sm">
      {/* زر الرجوع + العنوان */}
      <div className="flex items-center w-full sm:w-auto mb-3 sm:mb-0">
        <Link href="/">
          <button
            className="flex items-center justify-center gap-2 bg-[#429988] text-white px-3 py-2 rounded-lg shadow-md 
                      hover:bg-[#367c6e] active:scale-95 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </Link>
        <h1 className="ml-3 text-xl sm:text-2xl font-bold text-gray-800 truncate">
          {title}
        </h1>
      </div>

      {/* أزرار إضافية */}
      <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto justify-center">
        <Link href="/mediapage">
        <button className="flex items-center gap-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg shadow-md 
                           hover:bg-blue-700 active:scale-95 transition cursor-pointer">
          <Play className="w-4 h-4" /> Media
        </button>
        </Link>

        <button className="flex items-center gap-2 bg-purple-600 text-white px-3 sm:px-4 py-2 rounded-lg shadow-md 
                           hover:bg-purple-700 active:scale-95 transition cursor-pointer">
          <Bot className="w-4 h-4" /> AI Helper
        </button>

        <Link href="/calculator">
          <button className="flex items-center gap-2 bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg shadow-md 
                             hover:bg-green-700 active:scale-95 transition cursor-pointer">
            <Calculator className="w-4 h-4" /> Calculator
          </button>
        </Link>
      </div>
    </div>
  );
}
