"use client";
import { Provider } from "react-redux";
import { store } from "./(data)/store/index";

export default function RoaLayout({ children }) {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-white">
        {children}
      </div>
    </Provider>
  );
}
