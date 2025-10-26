"use client";
import React, { useState, useEffect } from "react";
import StationHeader from "@/components/stationheader";
import TableDashboard from "./components/table";
import { Loader } from "lucide-react";

export default function Dashboard() {
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboards() {
      try {
        const res = await fetch("/api/dashboard");
        const json = await res.json();

        if (json.success && json.dashboards.length > 0) {
          setDashboards(json.dashboards);
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
      <div className="w-full bg-white border-y border-gray-200 flex items-center gap-8 py-3 px-8 shadow-sm  sticky top-[55px] z-30">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-sm bg-blue-200 border border-blue-400" />
          <span className="text-sm font-medium text-blue-800">ROA</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-sm bg-green-200 border border-green-400" />
          <span className="text-sm font-medium text-green-800">MSF</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-sm bg-orange-200 border border-orange-400" />
          <span className="text-sm font-medium text-orange-800">MED</span>
        </div>
      </div>

      {/* ✅ شاشة التحميل داخل نفس الصفحة */}
      {loading ? (
        <div className="flex-grow flex flex-col items-center justify-center">
          <Loader className="w-10 h-10 animate-spin text-gray-500 mb-3" />
          <span className="text-gray-600 text-lg font-medium">
            Loading dashboards...
          </span>
        </div>
      ) : (
        <div className="flex-grow overflow-x-auto">
          <main className="p-6 flex flex-col items-center min-w-[1000px]">
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
              dashboards.map((dashboard) => (
                <div
                  key={dashboard._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6 w-full"
                >
                  <TableDashboard
                    stationData={dashboard.stationData}
                    name={dashboard.name}
                  />
                </div>
              ))
            )}
          </main>
        </div>
      )}
    </div>
  );
}
