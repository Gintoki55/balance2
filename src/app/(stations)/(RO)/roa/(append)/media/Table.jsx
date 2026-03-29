'use client';

export default function Table({ parameters = [] }) {
  const categories = getCategories(parameters);

  return (
    <div className="overflow-x-auto space-y-6">
      {categories.map((category) => (
        <CategoryTable
          key={category}
          title={category}
          data={parameters.filter((p) => p.category === category)}
        />
      ))}
    </div>
  );
}

/* ---------- Components ---------- */

function CategoryTable({ title, data }) {
  return (
    <div>
      <h4 className="table-title" style={{ color: '#1f2937' }}>
        {title} Parameters
      </h4>

      <div className="table-wrapper" style={{ borderColor: '#d1d5db' }}>
        <table className="w-full">
          <thead className="table-head" style={{ backgroundColor: '#f3f4f6' }}>
            <tr>
              <Th>Parameter</Th>
              <Th>Description</Th>
              <Th>Unit</Th>
              <Th>Typical Range</Th>
            </tr>
          </thead>

          <tbody className="divide-y" style={{ borderColor: '#e5e7eb' }}>
            {data.map((param, i) => (
              <Row key={i} param={param} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Row({ param }) {
  return (
    <tr className="table-row" style={{ backgroundColor: '#ffffff' }}>
      <Td bold>{param.name}</Td>
      <Td>{param.description}</Td>
      <Td>{param.unit}</Td>
      <Td mono>{param.example}</Td>
    </tr>
  );
}

function Th({ children }) {
  return (
    <th className="table-th" style={{ color: '#374151', textAlign: 'left', padding: '0.75rem' }}>
      {children}
    </th>
  );
}

function Td({ children, bold, mono }) {
  return (
    <td
      className={`table-td ${mono ? 'font-mono' : ''}`}
      style={{
        fontWeight: bold ? 500 : 400,
        color: bold ? '#111827' : '#4b5563',
        padding: '0.75rem',
      }}
    >
      {children || '-'}
    </td>
  );
}

/* ---------- Helpers ---------- */

function getCategories(data) {
  return [...new Set(data.map((p) => p.category))];
}