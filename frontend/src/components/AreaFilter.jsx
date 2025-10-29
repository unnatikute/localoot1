export default function AreaFilter({ areas, value, onChange }) {
  return (
    <select value={value || ''} onChange={(e) => onChange(e.target.value || null)} className="border rounded px-2 py-1">
      <option value="">All Areas</option>
      {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
    </select>
  );
}


