'use client';

import { Info, ExternalLink, Printer, Download } from 'lucide-react';

export default function InfoBox({ statistics = {}, links = [], onExportPDF }) {
  return (
    <aside
      className="hidden xl:block sticky top-[73px] h-[calc(100vh-73px)] w-80 overflow-y-auto"
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="p-4 space-y-4">

        {/* Quick Facts */}
        <div
            className="box"
            style={{
                backgroundColor: '#eff6ff', // blue-50
                border: '1px solid #dbeafe', // blue-100
                borderRadius: '0.5rem',
                padding: '1rem',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Info size={18} style={{ color: '#2563eb' }} />
                <h3 style={{ color: '#1e3a8a', fontWeight: '600' }}>Quick Facts</h3>
            </div>

            <Item label="Main Technology" value={statistics.mainTechnology} />
            <Item label="RO Stages" value={statistics.stages} />
            <Item label="Parameters" value={statistics.totalParameters} />
            <Item label="Global Capacity" value={statistics.globalCapacity} />
            <Item label="Active Plants" value={statistics.plantCount} />
        </div>
        {/* Links */}
        <div
          className="box"
          style={{
            backgroundColor: '#f9f9f9',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            padding: '1rem',
          }}
        >
        <h3 className="title" style={{ color: '#111827', fontWeight: '600', marginBottom: '1rem' }}>External Links</h3>
         {links.map((link, i) => (
            <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:underline"
                style={{
                color: '#2563eb',
                marginBottom: i !== links.length - 1 ? '1rem' : 0
                }}
            >
                <ExternalLink size={15} style={{ display: 'block' }} /> {/* 👈 الحل هنا */}
                <span style={{ lineHeight: '1' }}>{link.title}</span> {/* 👈 يضبط المحاذاة */}
            </a>
            ))}
        </div>

        {/* Tools */}
        <div
          className="box"
          style={{
            backgroundColor: '#f9f9f9',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            padding: '1rem',
          }}
        >
          <h3 className="title" style={{ color: '#111827', fontWeight: '600', marginBottom: '0.75rem' }}>Tools</h3>

          <Tool icon={Printer} onClick={() => window.print()} text="Print" />
          <Tool icon={Download} text="Export PDF" onClick={onExportPDF} />
        </div>

      </div>
    </aside>
  );
}

/* ---------- Components ---------- */

function Header({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon size={18} style={{ color: '#2563eb' }} />
      <h3 className="title" style={{ color: '#111827', fontWeight: '600' }}>{title}</h3>
    </div>
  );
}

function Item({ label, value }) {
  return (
    <div className="text-sm mb-2">
      <p style={{ color: '#6b7280' }}>{label}</p>
      <p style={{ fontWeight: '500', color: '#111827' }}>{value || '-'}</p>
    </div>
  );
}

function Tool({ icon: Icon, text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg"
      style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', cursor: 'pointer', marginBottom: '0.25rem' }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
    >
      <Icon size={16} style={{ color: '#2563eb' }} />
      {text}
    </button>
  );
}