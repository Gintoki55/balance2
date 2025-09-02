"use client";
import { useState, useRef, useEffect } from "react";

export default function Tooltip({ children, text }) {
  const [position, setPosition] = useState("center");
  const ref = useRef(null);

  useEffect(() => {
    const handlePosition = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        if (rect.left < 100) setPosition("left");
        else if (window.innerWidth - rect.right < 100) setPosition("right");
        else setPosition("center");
      }
    };

    handlePosition();
    window.addEventListener("resize", handlePosition);
    return () => window.removeEventListener("resize", handlePosition);
  }, []);

  return (
    <div ref={ref} className="relative group inline-block">
      {children}
      <div
        className={`absolute bottom-full mb-2 hidden group-hover:block 
                    bg-black text-white text-sm px-4 py-2 rounded-lg shadow-lg 
                    whitespace-normal break-words w-64 max-w-[90vw] z-10
                    ${
                      position === "left"
                        ? "left-0"
                        : position === "right"
                        ? "right-0"
                        : "left-1/2 -translate-x-1/2"
                    }`}
      >
        {text}
      </div>
    </div>
  );
}
