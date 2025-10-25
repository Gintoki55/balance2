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
          setDashboards([]); // حالة فارغة
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
  <div className="bg-[#F9FAFB] min-h-screen flex flex-col overflow-hidden relative">
    {/* Header */}
    <StationHeader title="Dashboard" />

    {/* ✅ شاشة التحميل تظهر فوق الجميع */}
    {loading && (
        <div className="absolute left-0 right-0 top-[80px] bottom-0 flex flex-col items-center justify-center bg-[#F9FAFB] z-40">
          <Loader className="w-10 h-10 animate-spin text-gray-500 mb-3" />
          <span className="text-gray-600 text-lg font-medium">Loading dashboards...</span>
        </div>
      )}

    {/* Main content */}
    <div className="flex-grow overflow-x-auto">
      <main className="p-6 flex flex-col items-center min-w-[1000px]">
        {!loading && dashboards.length === 0 ? (
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
          !loading &&
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
  </div>
);

}
