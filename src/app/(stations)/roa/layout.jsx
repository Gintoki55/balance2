"use client";
import { Provider } from "react-redux";
import { store } from "./(data)/store/index";
import { AnimateProvider } from "./(data)/animationContext";

export default function RoaLayout({ children }) {
  return (
    <Provider store={store}>
      <AnimateProvider>
        <div className="min-h-screen bg-white">
          {children}
        </div>
      </AnimateProvider>
    </Provider>
  );
}
