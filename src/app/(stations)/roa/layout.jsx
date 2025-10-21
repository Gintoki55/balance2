"use client";
// import { Provider } from "react-redux";
// import { store } from "../../store/index";
import { AnimateProvider } from "./(data)/animationContext";
// import { StationProvider } from "./(data)/DataTableContext";

export default function RoaLayout({ children }) {
  return (
      <AnimateProvider>
        
          <div className="min-h-screen bg-white">
            {/* <StationProvider> */}
            {children}
            {/* </StationProvider> */}
          </div>
      </AnimateProvider>
  );
}
