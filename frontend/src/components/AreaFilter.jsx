export default function AreaFilter({ areas, value, onChange }) {
  // Hardcoded Pune areas as fallback
  const FALLBACK_AREAS = [
    { id: 1, name: 'Hinjewadi' },
    { id: 2, name: 'Wakad' },
    { id: 3, name: 'Baner' },
    { id: 4, name: 'Kothrud' },
    { id: 5, name: 'Viman Nagar' },
    { id: 6, name: 'Kharadi' },
    { id: 7, name: 'Shivajinagar' },
    { id: 8, name: 'Aundh' },
    { id: 9, name: 'Koregaon Park' },
    { id: 10, name: 'Hadapsar' },
    { id: 11, name: 'Magarpatta' },
    { id: 12, name: 'Balewadi' },
    { id: 13, name: 'Pashan' },
    { id: 14, name: 'Sus Road' },
    { id: 15, name: 'Bavdhan' },
    { id: 16, name: 'Katraj' },
    { id: 17, name: 'Kondhwa' },
    { id: 18, name: 'Wanowrie' },
    { id: 19, name: 'Camp' },
    { id: 20, name: 'Deccan' },
    { id: 21, name: 'FC Road' },
    { id: 22, name: 'JM Road' },
    { id: 23, name: 'Senapati Bapat Road' },
    { id: 24, name: 'Kalyani Nagar' },
    { id: 25, name: 'Yerwada' },
    { id: 26, name: 'Lohegaon' },
    { id: 27, name: 'Dhanori' },
    { id: 28, name: 'Wagholi' },
    { id: 29, name: 'Chandan Nagar' },
    { id: 30, name: 'Kharadi Bypass' },
    { id: 31, name: 'Mundhwa' },
    { id: 32, name: 'Keshav Nagar' },
    { id: 33, name: 'NIBM' },
    { id: 34, name: 'Mohammedwadi' },
    { id: 35, name: 'Hadaspar' },
    { id: 36, name: 'Manjri' },
    { id: 37, name: 'Lonikand' },
    { id: 38, name: 'Shivane' },
    { id: 39, name: 'Warje' },
    { id: 40, name: 'Karve Nagar' },
    { id: 41, name: 'Erandwane' },
    { id: 42, name: 'Model Colony' },
    { id: 43, name: 'Aundh Gaon' },
    { id: 44, name: 'Baner Gaon' },
    { id: 45, name: 'Pimple Saudagar' },
    { id: 46, name: 'Rahatani' },
    { id: 47, name: 'Wakad Gaon' },
    { id: 48, name: 'Tathawade' }
  ];

  const displayAreas = (areas && areas.length > 0) ? areas : FALLBACK_AREAS;
  
  return (
    <div className="relative">
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value || null)}
        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-700 font-medium cursor-pointer appearance-none shadow-sm hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <option value="">📍 All Areas (Pune) - {displayAreas.length} areas</option>
        {displayAreas.map(a => (
          <option key={a.id} value={a.id}>
            📍 {a.name}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
