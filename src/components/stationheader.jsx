"use client";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function StationHeader({ title, buttons = [], isPopup = false }) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path) => pathname === path;

  const handleBack = () => {
    if (isPopup) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center sm:justify-between sticky top-0 bg-white z-50 px-4 py-3 shadow-sm">
      {/* زر الرجوع + العنوان */}
      <div className="flex items-center w-full sm:w-auto mb-3 sm:mb-0">
        <button
          onClick={handleBack}
          className="flex items-center justify-center gap-2 bg-[#429988] text-white px-3 py-2 rounded-lg shadow-md 
                    hover:bg-[#367c6e] active:scale-95 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="ml-3 text-xl sm:text-2xl font-bold text-gray-800 truncate">
          {title}
        </h1>
      </div>

      {/* الأزرار الخاصة بالصفحة */}
      <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-start">
        {buttons.map((btn, idx) => (
          <button
            key={idx}
            onClick={() => router.push(btn.href)}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg shadow-md active:scale-95 transition cursor-pointer border-2 text-sm sm:text-base ${
              isActive(btn.href)
                ? "bg-[#429988] text-white border-[#429988]"
                : "bg-white text-[#429988] border-[#429988] hover:bg-[#367c6e] hover:text-white"
            } w-full sm:w-auto`}
          >
            {btn.icon && <btn.icon className="w-4 h-4" />}
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
