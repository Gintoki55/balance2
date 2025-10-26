"use client";
import { AnimateProvider } from "./(data)/animationContext";

export default function RoaLayout({ children }) {
  return (
      <AnimateProvider>
          <div className="min-h-screen bg-white">
            {children}
          </div>
      </AnimateProvider>
  );
}
