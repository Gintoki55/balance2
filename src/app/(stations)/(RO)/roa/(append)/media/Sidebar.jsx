'use client';

import { FileText, Waves, Settings, CircleHelp as HelpCircle, Link2 } from 'lucide-react';

const sections = [
  { id: 'overview', label: 'Overview', icon: FileText },
  { id: 'technology', label: 'RO Technology', icon: Waves },
  { id: 'parameters', label: 'Parameters', icon: Settings },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
  { id: 'references', label: 'References', icon: Link2 },
];

export default function Sidebar({
  activeSection,
  onSectionClick = () => {},
  isOpen,
}) {
  return (
    <>
      {/* Overlay */}
      <Overlay show={isOpen} onClick={() => onSectionClick(null)} />

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="p-4">
          <h2 className="sidebar-title" style={{ color: '#374151' }}>Contents</h2>

          <nav className="space-y-1">
            {sections.map((section) => (
              <NavItem
                key={section.id}
                section={section}
                active={activeSection === section.id}
                onClick={() => onSectionClick(section.id)}
              />
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}

/* ---------- Components ---------- */

function NavItem({ section, active, onClick }) {
  const Icon = section.icon;

  return (
    <button
      onClick={onClick}
      className={`nav-item cursor-pointer ${active ? 'active' : ''}`}
      style={{
        color: active ? '#1d4ed8' : '#374151',
        backgroundColor: active ? '#eff6ff' : 'transparent',
      }}
    >
      <Icon size={16} color={active ? '#1d4ed8' : '#6b7280'} />
      <span>{section.label}</span>
    </button>
  );
}

function Overlay({ show, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`fixed inset-0 z-40 lg:hidden transition`}
      style={{
        backgroundColor: 'rgba(0,0,0,0.5)',
        opacity: show ? 1 : 0,
        pointerEvents: show ? 'auto' : 'none',
      }}
    />
  );
}