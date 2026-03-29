'use client';

import { useState, useEffect } from 'react';
import { Search, Moon, Menu, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar({ onSearch = () => {}, onToggleSidebar, title, isPopup = false }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  /* ---------- debounce search ---------- */
  useEffect(() => {
    const delay = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const router = useRouter();

  const handleBack = () => {
    if (isPopup) router.back();
    else router.push('/');
  };

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      }}
    >
      {/* Main header */}
      <div
        style={{
          width: '100%',
          maxWidth: '1480px',
          margin: '0 auto',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        {/* Left */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleBack}
            className="flex items-center justify-center gap-2 bg-[#429988] text-white px-3 py-2 rounded-lg shadow-md hover:bg-[#367c6e] active:scale-95 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <h1 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
            {title}
          </h1>
        </div>

        {/* Right */}
        <div style={{ display:"flex", alignItems: 'center', gap: '0.75rem' }}>
          {/* Search for desktop */}
          {!mobileSearchOpen && (
            <div className='md:block hidden'>
              <SearchInput
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // يظهر فقط للشاشات الكبيرة
                style={{ width: '16rem' }}
              />
            </div>
          )}
          

          <IconBtn>
            <Moon size={20} color="#000000" />
          </IconBtn>

          {/* Hamburger for mobile */}
          <div className="md:hidden">
            <IconBtn onClick={() => setMobileSearchOpen(!mobileSearchOpen)}>
              <Menu size={20} color="#000000" />
            </IconBtn>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      {mobileSearchOpen && (
        <div className="md:hidden" style={{ padding: '0 1rem 0.75rem 1rem' }}>
          <SearchInput
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            full
          />
        </div>
      )}
    </nav>
  );
}

/* ---------- Components ---------- */

function IconBtn({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.5rem',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        transition: 'background 0.2s',
        backgroundColor: 'transparent',
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      {children}
    </button>
  );
}

function SearchInput({ value, onChange, full, style }) {
  return (
    <div
      style={{
        position: 'relative',
        width: full ? '100%' : style?.width || 'auto',
        ...style,
      }}
    >
      <Search
        style={{
          position: 'absolute',
          left: '0.75rem',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '1rem',
          height: '1rem',
          color: '#9ca3af',
        }}
      />
      <input
        value={value}
        onChange={onChange}
        placeholder="Search..."
        style={{
          paddingLeft: '2.5rem',
          paddingRight: '1rem',
          paddingTop: '0.5rem',
          paddingBottom: '0.5rem',
          width: '100%',
          border: '1px solid #d1d5db',
          borderRadius: '0.5rem',
          backgroundColor: '#f9fafb',
          color: '#111827',
          outline: 'none',
        }}
      />
    </div>
  );
}