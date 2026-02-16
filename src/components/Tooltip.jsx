"use client";

import { useState } from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";

export default function Tooltip({ children, text }) {
  const [open, setOpen] = useState(false);

  const { refs, floatingStyles } = useFloating({
    open,
    onOpenChange: setOpen,
    middleware: [offset(8), flip(), shift()],
    placement: "top",
    whileElementsMounted: autoUpdate,
  });

  return (
    <div
      ref={refs.setReference}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="inline-block"
    >
      {children}
      {open && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className="bg-gray-600 text-white text-xs sm:text-sm md:text-base lg:text-sm 
                     px-3 py-1.5 rounded-lg shadow-lg
                    sm:min-w-[150px] md:min-w-[50px] 
                     whitespace-pre-wrap break-keep z-10"
        >
          <pre className="whitespace-pre-wrap font-mono">
            {String(text)
              .split(",")
              .map((part, idx, arr) => (
                <span key={idx}>
                  {part.trim()}
                  {idx < arr.length - 1 && ","}
                  {"\n"}
                </span>
              ))}
          </pre>
        </div>
      )}
    </div>
  );
}
