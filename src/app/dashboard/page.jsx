"use client";
import React from "react";
import { ArrowLeft } from "lucide-react";
import { medData, msfData, rogData } from "../../components/designs"; // استدعاء البيانات

function DeviceTable({ device }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6">
      <h2 className="font-bold text-lg mb-4 text-gray-900">{device.deviceId}</h2>

      {/* جدول على الشاشات الكبيرة */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-50 text-gray-700">
              <th className="px-2 py-1 text-left">Label</th>
              <th className="px-2 py-1 text-left">Value</th>
              <th className="px-2 py-1 text-left">Extra</th>
              <th className="px-2 py-1 text-left">More</th>
            </tr>
          </thead>
          <tbody>
            {device.metrics.map((row, i) => (
              <tr key={i} className="border-t hover:bg-gray-50 transition">
                <td className="px-2 py-1 font-semibold text-gray-800">{row.label}</td>
                <td className={`px-2 py-1 font-medium ${row.color || "text-gray-800"}`}>
                  {row.value}
                </td>
                <td className="px-2 py-1 text-gray-600">{row.extra}</td>
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
  const devices = [medData, msfData, rogData]; // مصفوفة الأجهزة

  return (
    <div className="min-h-[500px] bg-hexagons">
      {/* الهيدر مع زر الرجوع */}
      <div className="flex items-center mb-4 bg-gray-100  sticky top-0 z-50 px-6 py-4 shadow-sm">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 bg-[rgb(66,153,136)] text-white px-3 py-2 rounded-lg shadow hover:bg-gray-50 hover:text-[rgb(66,153,136)] active:scale-95 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="ml-4 text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="p-4 sm:p-6">
      {/* مربعات الأجهزة D1, D2, D3 */}
          <div className="grid grid-cols-1 gap-4">
            {devices.map((device, idx) => (
              <div key={idx} className="bg-white  rounded-xl shadow p-4">
                <h2 className="text-lg font-bold mb-2 text-gray-900">D{idx + 1}</h2>
                <DeviceTable device={device} />
              </div>
            ))}
          </div>
      </div>
    
    </div>
  );
}
