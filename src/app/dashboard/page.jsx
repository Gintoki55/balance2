"use client";
import React from "react";
import { ArrowLeft } from "lucide-react"; // أيقونة الرجوع
// fake data for one device (D1)
const deviceData = {
  deviceId: "D1",
  metrics: [
    { label: "Ka", value: 1.0, extra: "Aa", num: 2153.75, delta: 5.0, color: "text-green-700 bg-green-100 px-2 rounded" },
    { label: "Kb", value: 1.0, extra: "Ab", num: 3030.44, delta: 2.0, color: "text-green-700 bg-green-100 px-2 rounded" },
    { label: "Kc", value: 1.0, extra: "Ac", num: 4056.03, delta: 2.0, color: "text-green-700 bg-green-100 px-2 rounded" },
    { label: "cg", value: 0.99, extra: "S0", num: 40.0, delta: null, color: "text-green-700 bg-green-100 px-2 rounded" },
  ],
  rightMetrics: [
    { label: "Jb", value: 10.0 },
    { label: "Jc", value: 10.0 },
    { label: "Md", value: 1000.0, color: "text-blue-700 bg-blue-100 px-2 rounded" },
    { label: "Ts", value: 120.0 },
    { label: "Th", value: 115.0, color: "text-blue-700 bg-blue-100 px-2 rounded" },
    { label: "T0", value: 30.0, color: "text-blue-700 bg-blue-100 px-2 rounded" },
    { label: "M0", value: 5628.41 },
    { label: "Mm", value: 2814.21 },
    { label: "WR", value: 17.77 },
    { label: "Ms", value: 119.84 },
    { label: "GOR", value: 8.34 },
    { label: "SEC", value: 62.4 },
    { label: "m", value: 0.5, color: "text-orange-700 bg-orange-100 px-2 rounded" },
    { label: "sA", value: 73.02 },
  ],
};

function DeviceTable({ device }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6">
      <h2 className="font-bold text-lg mb-4 text-gray-900">{device.deviceId}</h2>

      {/* جدول على الشاشات الكبيرة */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-50 text-gray-700">
              <th className="px-2 py-1 text-left">MSF Design</th>
              <th className="px-2 py-1 text-left">Extra</th>
              <th className="px-2 py-1 text-left">Value</th>
              <th className="px-2 py-1 text-left">Δ</th>
              <th className="px-2 py-1 text-left">More</th>
            </tr>
          </thead>
          <tbody>
            {device.metrics.map((row, i) => (
              <tr key={i} className="border-t hover:bg-gray-50 transition">
                <td className="px-2 py-1 font-semibold text-gray-800">{row.label}</td>
                <td className="px-2 py-1 text-gray-600">{row.extra}</td>
                <td className={`px-2 py-1 font-medium ${row.color || "text-gray-800"}`}>{row.value}</td>
                <td className="px-2 py-1 text-blue-700">{row.delta ?? ""}</td>
                <td className="px-2 py-1 text-gray-700">{row.num}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* عرض ككروت في الجوال */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:hidden">
        {device.metrics.map((row, i) => (
          <div key={i} className="border rounded-lg p-2 bg-gray-50">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-800">{row.label}</span>
              <span className={`font-semibold ${row.color || "text-gray-800"}`}>{row.value}</span>
            </div>
            <div className="text-xs text-gray-600">Extra: {row.extra}</div>
            {row.delta && <div className="text-xs text-blue-600">Δ {row.delta}</div>}
            <div className="text-xs text-gray-700">More: {row.num}</div>
          </div>
        ))}
      </div>

      {/* المقاييس الجانبية */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-4">
        {device.rightMetrics.map((m, i) => (
          <div
            key={i}
            className="flex justify-between border px-2 py-1 rounded text-xs bg-gray-50 hover:bg-gray-100 transition"
          >
            <span className="font-medium text-gray-700">{m.label}</span>
            <span className={`font-semibold ${m.color || "text-gray-800"}`}>{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-[500px]">
      
      {/* الهيدر مع زر الرجوع */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 bg-[rgb(66,153,136)] text-white px-3 py-2 rounded-lg shadow hover:bg-gray-50 hover:text-[rgb(66,153,136)] active:scale-95 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="ml-4 text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <DeviceTable device={deviceData} />
    </div>
  );
}
