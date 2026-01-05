"use client";
import { createContext, useContext, useState } from "react";

const AnimateContext = createContext();

export const AnimateProvider = ({ children }) => {
  const [animateTrigger, setAnimateTrigger] = useState(false);

  const triggerAnimation = () => {
    setAnimateTrigger(true);
    setTimeout(() => setAnimateTrigger(false), 1500);
  };

  return (
    <AnimateContext.Provider value={{ animateTrigger, triggerAnimation }}>
      {children}
    </AnimateContext.Provider>
  );
};

export const useAnimate = () => useContext(AnimateContext);
