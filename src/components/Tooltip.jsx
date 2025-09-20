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
                     max-w-[200px] sm:max-w-[250px] md:max-w-[300px] 
                     whitespace-normal break-words z-10"
        >
          {text}
        </div>
      )}
    </div>
  );
}
