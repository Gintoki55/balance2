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
    <div className="bg-[#F9FAFB] min-h-screen flex flex-col">
      {/* Header */}
      <StationHeader title="Dashboard" />

      {/* Main content */}
      <main className="flex-grow p-6 flex flex-col items-center">
        {loading ? (
          <div className="flex flex-col items-center gap-2 text-gray-500 text-lg">
            <Loader className="w-8 h-8 animate-spin text-gray-500" />
            <span>Loading dashboards...</span>
          </div>
        ) : dashboards.length === 0 ? (
          <div className="text-center bg-white p-8 rounded-2xl shadow-md border border-gray-200 w-full max-w-md">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Dashboards Found</h2>
            <p className="text-gray-500">
              There are no saved dashboards in the database. <br />
              Create a new dashboard to get started.
            </p>
          </div>
        ) : (
          dashboards.map((dashboard, index) => (
            <div
              key={dashboard._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6 w-full"
            >
              <TableDashboard
                stationData={dashboard.stationData}
                name={dashboard.name} // الاسم يظهر فوق الجدول
              />
            </div>
          ))
        )}
      </main>
    </div>
  );
}
