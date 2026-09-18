import React from 'react';

const ToothBlock = ({ num, currentCondition, handleToothUpdate }) => {
  // Color codes for the printed paper view
  const printColor = 
    currentCondition === 'Normal' ? 'text-gray-500' :
    currentCondition === 'Decayed' ? 'text-red-600' :
    currentCondition === 'Filled' ? 'text-blue-600' : 'text-gray-400';

  // Short labels for the printed paper view so it fits on A4
  const printLabel = 
    currentCondition === 'Normal' ? 'NORM' : 
    currentCondition === 'Decayed' ? 'DCAY' : 
    currentCondition === 'Filled' ? 'FILL' : 'MISS';

  return (
    <div className="flex flex-col items-center p-1 border-2 border-gray-100 rounded-lg bg-white hover:border-blue-900 transition-colors shadow-sm print:border-gray-300 print:shadow-none print:p-1 w-full">
      <span className="font-extrabold text-blue-900 mb-1 print:text-black print:text-sm">{num}</span>
      
      {/* SCREEN VIEW (Dropdown Box) - Adjusted font size and padding to fit screen without scrolling */}
      <select 
        value={currentCondition}
        onChange={(e) => handleToothUpdate(num, e.target.value)} 
        style={{ backgroundColor: '#ffffff', color: '#000000' }}
        className="text-[11px] px-0 py-1 border border-gray-200 rounded w-full outline-none text-center appearance-none font-bold cursor-pointer focus:border-blue-900 focus:ring-1 focus:ring-blue-900 print:hidden"
      >
        <option value="Normal">Normal</option>
        <option value="Decayed">Decayed</option>
        <option value="Filled">Filled</option>
        <option value="Missing">Missing</option>
      </select>

      {/* PAPER PRINT VIEW (Clean Text) - Only visible to the printer */}
      <span className={`hidden print:block text-[10px] font-extrabold uppercase ${printColor}`}>
        {printLabel}
      </span>
    </div>
  );
};

const DentalChart = ({ formData, setFormData }) => {
  const upperAdult = [18,17,16,15,14,13,12,11, 21,22,23,24,25,26,27,28];
  const lowerAdult = [48,47,46,45,44,43,42,41, 31,32,33,34,35,36,37,38];
  const upperChild = [55,54,53,52,51, 61,62,63,64,65];
  const lowerChild = [85,84,83,82,81, 71,72,73,74,75];

  const handleToothUpdate = (toothNum, status) => {
    if (!setFormData) return;
    const existing = formData.odontogram?.filter(t => t.toothNumber !== toothNum) || [];
    setFormData({ ...formData, odontogram: [...existing, { toothNumber: toothNum, condition: status }] });
  };

  const getCondition = (num) => {
    const tooth = formData?.odontogram?.find(t => t.toothNumber === num);
    return tooth ? tooth.condition : "Normal";
  };

  return (
    <div className="w-full pb-4 print:pb-0">
      <div className="w-full p-1 print:p-0">
        <div className="mb-10">
          <h3 className="font-extrabold text-blue-900 mb-4 border-b-2 border-gray-100 pb-2 uppercase text-center print:text-black">Permanent Teeth (Adult)</h3>
          
          <p className="text-center text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest print:text-black">Upper Teeth (Maxillary)</p>
          <div className="grid gap-1 mb-6" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
            {upperAdult.map(num => <ToothBlock key={num} num={num} currentCondition={getCondition(num)} handleToothUpdate={handleToothUpdate} />)}
          </div>
          
          <p className="text-center text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest print:text-black">Lower Teeth (Mandibular)</p>
          <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(16, minmax(0, 1fr))' }}>
            {lowerAdult.map(num => <ToothBlock key={num} num={num} currentCondition={getCondition(num)} handleToothUpdate={handleToothUpdate} />)}
          </div>
        </div>
        
        <div className="w-[85%] mx-auto mt-12 print:w-[80%]">
          <h3 className="font-extrabold text-blue-900 mb-4 border-b-2 border-gray-100 pb-2 uppercase text-center print:text-black">Deciduous Teeth (Child)</h3>
          
          <p className="text-center text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest print:text-black">Upper Teeth (Maxillary)</p>
          <div className="grid gap-1 mb-6" style={{ gridTemplateColumns: 'repeat(10, minmax(0, 1fr))' }}>
            {upperChild.map(num => <ToothBlock key={num} num={num} currentCondition={getCondition(num)} handleToothUpdate={handleToothUpdate} />)}
          </div>
          
          <p className="text-center text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest print:text-black">Lower Teeth (Mandibular)</p>
          <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(10, minmax(0, 1fr))' }}>
            {lowerChild.map(num => <ToothBlock key={num} num={num} currentCondition={getCondition(num)} handleToothUpdate={handleToothUpdate} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DentalChart;