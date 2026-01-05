"use client";
import React, { useState, useEffect } from "react";
import StationHeader from "@/components/stationheader";
import TableDashboard from "./components/table";
import SecondTableRows from "./components/secondTable";
import { Loader, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MEDSecondTable from "@/app/(stations)/med/(append)/components/secondTable";
import MSFSecondTable from "@/app/(stations)/msf/(append)/components/secondTable";
import ROASecondTable from "@/app/(stations)/(RO)/roa/(append)/components/secondTable";

export default function Dashboard() {
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function loadDashboards() {
    try {
      const res = await fetch("/api/dashboard");
      const json = await res.json();

      if (json.success && json.dashboards.length > 0) {

        // 🔥 ترتيب حسب رقم الداشبورد
        const sorted = [...json.dashboards].sort((a, b) => {
          const numA = Number(a.name.replace("D", ""));
          const numB = Number(b.name.replace("D", ""));
          return numA - numB;
        });

        setDashboards(sorted);

      } else {
        setDashboards([]);
      }

    } catch (err) {
      console.error("❌ Error loading dashboards:", err);
      setDashboards([]);
    } finally {
      setLoading(false);
    }
  }

  loadDashboards();
}, []);


  return (
    <div className="bg-[#F9FAFB] min-h-screen flex flex-col relative">
      {/* Header */}
      <StationHeader title="Dashboard" />

      {/* Legend */}
      <div className="w-full bg-white border-y border-gray-200 flex items-center gap-8 py-3 px-8 shadow-sm sticky top-[45px] z-30">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-sm bg-blue-200 border border-blue-400" />
          <span className="text-sm font-medium text-blue-800">ROA</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-sm bg-orange-200 border border-orange-900" />
          <span className="text-sm font-medium text-orange-900">MED</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-sm bg-orange-600 border border-orange-900" />
          <span className="text-sm font-medium text-orange-900">MSF</span>
        </div>
      </div>

      {/* المحتوى — الحاوية الرئيسية ذات الـ Scroll */}
      {loading ? (
        <div className="flex-grow flex flex-col items-center justify-center">
          <Loader className="w-10 h-10 animate-spin text-gray-500 mb-3" />
          <span className="text-gray-600 text-lg font-medium">
            Loading dashboards...
          </span>
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto overflow-x-hidden">
          <main className="py-4 flex flex-col items-center gap-8 w-full max-w-[1500px] mx-auto">
            {dashboards.length === 0 ? (
              <div className="text-center bg-white p-8 rounded-2xl shadow-md border border-gray-200 w-full max-w-md">
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                  No Dashboards Found
                </h2>
                <p className="text-gray-500">
                  There are no saved dashboards in the database. <br />
                  Create a new dashboard to get started.
                </p>
              </div>
            ) : (
              <div className=" border border-gray-200 w-full bg-white">
                {dashboards.map((dashboard) => (
                  <DashboardCard key={dashboard._id} dashboard={dashboard} />
                ))}
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}

function DashboardCard({ dashboard }) {
  const [isOpen, setIsOpen] = useState(false);
  const stationName =  dashboard.stationData[0][0]?.key;
  console.log(stationName)

  return (
    <div className="bg-white border-b border-gray-200">

      {/* Header */}
      <div className="flex items-center justify-between py-3 border-b border-gray-200 px-4">
        <h2 className="text-lg font-semibold text-gray-700">
          {dashboard.name}
        </h2>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
          {isOpen ? "Hide Details" : "Show Details"}
        </button>
      </div>

      {/* Table */}
      <div className="p-4 overflow-x-auto">
        <TableDashboard
          stationData={dashboard.stationData}
          name={dashboard.name}
        />

        <hr className="border-t border-gray-300 my-5 w-full" />

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="mt-4"
            >
              <table className="table-fixed border border-gray-300 border-collapse w-full text-center shadow-sm rounded-md">
                <colgroup>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <col key={i} className="w-[90px]" />
                  ))}
                </colgroup>

                <tbody>
                   {stationName === "ROA" && (
                      <ROASecondTable JValues={dashboard.JValues} />
                    )}

                    {stationName === "MED" && (
                      <MEDSecondTable JValues={dashboard.JValues} />
                    )}

                    {stationName === "MSF" && (
                      <MSFSecondTable JValues={dashboard.JValues} />
                    )}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
