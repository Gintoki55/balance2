'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FAQ({ faqs = [], activeId }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  /* 🔥 فتح السؤال تلقائياً إذا جا من البحث */
  useEffect(() => {
    if (activeId) {
      const index = faqs.findIndex((_, i) => `faq-${i}` === activeId);
      if (index !== -1) {
        setOpenIndex(index);
      }
    }
  }, [activeId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {faqs.map((faq, i) => (
        <div
          id={`faq-${i}`} // ✅ هذا أهم سطر
          key={i}
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            backgroundColor: '#ffffff',
          }}
        >
          {/* السؤال */}
          <button
            onClick={() => toggle(i)}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontWeight: '500', color: '#111827' }}>
              {faq.question}
            </span>

            {openIndex === i ? (
              <ChevronUp size={18} style={{ color: '#2563eb' }} />
            ) : (
              <ChevronDown size={18} style={{ color: '#2563eb' }} />
            )}
          </button>

          {/* الجواب */}
          {openIndex === i && (
            <div style={{ padding: '0 1rem 1rem 1rem', color: '#4b5563' }}>
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}