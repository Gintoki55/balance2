"use client";
import { ArrowLeft, Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function StationHeader({ title, buttons = [], isPopup = false }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => pathname === path;

  const handleBack = () => {
    if (isPopup) router.back();
    else router.push("/");
  };

  return (
    <div className="sticky top-0 bg-white z-50 px-4 py-2 shadow-sm mb-0">
      {/* ✅ الصف العلوي: الرجوع + العنوان + القائمة */}
      <div className="flex items-center justify-between w-full">
        {/* يسار: زر الرجوع والعنوان */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleBack}
            className="flex items-center justify-center gap-2 bg-[#429988] text-white px-3 py-2 rounded-lg shadow-md 
                      hover:bg-[#367c6e] active:scale-95 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
            {title}
          </h1>
        </div>

        {/* يمين: زر القائمة (للجوال فقط) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex sm:hidden items-center justify-center bg-[#429988] text-white px-3 py-2 rounded-lg shadow-md hover:bg-[#367c6e] transition"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* ✅ الأزرار الثلاثة في صف واحد عند كبر الشاشة */}
        <div className="hidden sm:flex items-center gap-3">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              onClick={() => router.push(btn.href)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md active:scale-95 transition border-2 text-sm sm:text-base ${
                isActive(btn.href)
                  ? "bg-[#429988] text-white border-[#429988]"
                  : "bg-white text-[#429988] border-[#429988] hover:bg-[#367c6e] hover:text-white"
              }`}
            >
              {btn.icon && <btn.icon className="w-4 h-4" />}
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* ✅ القائمة المنسدلة للجوال */}
      {menuOpen && (
        <div className="sm:hidden mt-2 bg-white border rounded-lg shadow-lg flex flex-col w-full z-50">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              onClick={() => {
                router.push(btn.href);
                setMenuOpen(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 border-b text-left text-[#429988] hover:bg-[#f0f7f5] ${
                isActive(btn.href) ? "bg-[#e3f5f1]" : ""
              }`}
            >
              {btn.icon && <btn.icon className="w-4 h-4" />}
              {btn.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
