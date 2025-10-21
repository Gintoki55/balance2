"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";

const StationContext = createContext();

export const StationProvider = ({ children }) => {
  const { stationData } = useSelector((state) => state.station); // البيانات الأصلية من Redux
  const [localTable, setLocalTable] = useState([]);

  // عند تحميل stationData من Redux، اعمل نسخة محلية
  useEffect(() => {
    if (stationData) {
      setLocalTable(stationData);
      console.log("there is !!!", stationData);
    }
  }, [stationData]);

  const updateCell = (cellKey, value) => {
    setLocalTable(prev =>
        prev.map(col =>
        col.map(cell => {
            if (cell.key === cellKey) {
            // ✅ نرجع نسخة جديدة فعليًا
            return { ...cell, value };
            }
            return cell;
        })
        )
    );
  };


  const resetLocalTable = () => {
    setLocalTable(stationData);
  };

  return (
    <StationContext.Provider value={{ localTable, updateCell, resetLocalTable }}>
      {children}
    </StationContext.Provider>
  );
};

// Hook للاستخدام
export const useStation = () => useContext(StationContext);
