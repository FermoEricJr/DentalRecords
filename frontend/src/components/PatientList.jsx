import React, { useEffect, useState } from 'react';

const PatientList = ({ onViewPatient, onEditPatient }) => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchPatients = () => {
    fetch('http://localhost:5000/api/patients')
      .then(res => res.json())
      .then(data => setPatients(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(p => 
    `${p.lastName} ${p.firstName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isRecallDue = (lastCleaning) => {
    if (!lastCleaning) return true;
    const monthsSince = (new Date() - new Date(lastCleaning)) / (1000 * 60 * 60 * 24 * 30);
    return monthsSince >= 6;
  };

  // --- DELETE LOGIC ---
  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedIds(filteredPatients.map(p => p._id));
    else setSelectedIds([]);
  };

  const handleSelectOne = (e, id) => {
    if (e.target.checked) setSelectedIds([...selectedIds, id]);
    else setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
  };

  const handleDeleteSingle = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient record?")) return;
    try {
      await fetch(`http://localhost:5000/api/patients/${id}`, { method: 'DELETE' });
      fetchPatients();
    } catch (err) {
      alert("Failed to delete record.");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} patients?`)) return;
    
    try {
      await fetch(`http://localhost:5000/api/patients/bulk-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds })
      });
      setSelectedIds([]);
      fetchPatients();
    } catch (err) {
      alert("Failed to delete records.");
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-md border-t-4 border-t-blue-900 no-print">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-extrabold text-blue-900 uppercase">Patient Directory & Recalls</h2>
        
        <div className="flex gap-4">
          {selectedIds.length > 0 && (
            <button onClick={handleBulkDelete} className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-sm">
              Delete Selected ({selectedIds.length})
            </button>
          )}
          <input 
            type="text" 
            placeholder="Search patients..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-900 focus:ring-0 outline-none w-64 transition-colors" 
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-900 text-white border-b">
              <th className="p-4 font-bold rounded-tl-xl w-12 text-center">
                <input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === filteredPatients.length && filteredPatients.length > 0} className="w-4 h-4 cursor-pointer" />
              </th>
              <th className="p-4 font-bold">Patient Name</th>
              <th className="p-4 font-bold">Mobile No.</th>
              <th className="p-4 font-bold">Recall Status</th>
              <th className="p-4 font-bold rounded-tr-xl">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map(p => (
              <tr key={p._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4 text-center">
                  <input type="checkbox" checked={selectedIds.includes(p._id)} onChange={(e) => handleSelectOne(e, p._id)} className="w-4 h-4 cursor-pointer" />
                </td>
                <td className="p-4 font-extrabold text-blue-900 uppercase">{p.lastName}, {p.firstName}</td>
                <td className="p-4 text-gray-700 font-medium">{p.mobileNo}</td>
                <td className="p-4">
                  {isRecallDue(p.lastCleaningDate) ? (
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold border border-red-200">Due for Prophy (6mo)</span>
                  ) : (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold border border-green-200">Up to Date</span>
                  )}
                </td>
                <td className="p-4 flex gap-3">
                  <button onClick={() => onViewPatient(p)} className="text-blue-600 hover:text-blue-900 font-bold underline decoration-2 underline-offset-2">Chart</button>
                  <button onClick={() => onEditPatient(p)} className="text-yellow-600 hover:text-yellow-800 font-bold underline decoration-2 underline-offset-2">Edit</button>
                  <button onClick={() => handleDeleteSingle(p._id)} className="text-red-500 hover:text-red-700 font-bold underline decoration-2 underline-offset-2">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientList;