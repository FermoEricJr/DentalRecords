import React, { useState } from 'react';
import PatientForm from './components/PatientForm';
import PatientList from './components/PatientList';
import PatientDetail from './components/PatientDetail';

function App() {
  const [view, setView] = useState('list');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientToEdit, setPatientToEdit] = useState(null);

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setView('detail');
  };

  const handleEditPatient = (patient) => {
    setPatientToEdit(patient);
    setView('form');
  };

  const handleAddNew = () => {
    setPatientToEdit(null);
    setView('form');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 no-print flex flex-col items-center">
          <div className="flex items-center gap-4 mb-6">
            <img src="lubian_logo.png" alt="Lubian's Dental Clinic" className="w-24 h-24 object-contain shadow-sm rounded-full bg-white p-1 border-2 border-blue-900" />
            <h1 className="text-4xl font-extrabold text-blue-900 tracking-tight uppercase">Lubian's Dental Clinic</h1>
          </div>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => setView('list')} 
              className={`px-6 py-2 rounded-full font-bold transition-colors shadow-sm ${view === 'list' ? 'bg-blue-900 text-white' : 'bg-white text-blue-900 border-2 border-blue-900 hover:bg-gray-100'}`}
            >
              Patient List
            </button>
            <button 
              onClick={handleAddNew} 
              className={`px-6 py-2 rounded-full font-bold transition-colors shadow-sm ${view === 'form' && !patientToEdit ? 'bg-red-600 text-white' : 'bg-white text-red-600 border-2 border-red-600 hover:bg-red-50 hover:text-red-700'}`}
            >
              + Add New Patient
            </button>
          </div>
        </header>
        
        <main>
          {view === 'list' && <PatientList onViewPatient={handleViewPatient} onEditPatient={handleEditPatient} />}
          {view === 'form' && <PatientForm patientToEdit={patientToEdit} onSave={() => setView('list')} />}
          {view === 'detail' && <PatientDetail patient={selectedPatient} onBack={() => setView('list')} />}
        </main>
      </div>
    </div>
  );
}

export default App;