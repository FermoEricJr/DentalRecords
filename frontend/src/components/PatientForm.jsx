import React, { useState, useEffect } from 'react';
import DentalChart from './DentalChart';

const InputField = ({ label, name, type = "text", required = false, value, onChange }) => (
  <div className="flex flex-col mb-4">
    <label className="mb-1 text-sm font-extrabold text-blue-900 uppercase tracking-wide">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <input 
      type={type} name={name} onChange={onChange} value={value} required={required} 
      autoComplete="off"
      style={{ backgroundColor: '#ffffff', color: '#000000' }}
      className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-900 focus:ring-0 outline-none transition-colors shadow-sm" 
    />
  </div>
);

const SelectField = ({ label, name, options, required = false, value, onChange }) => (
  <div className="flex flex-col mb-4">
    <label className="mb-1 text-sm font-extrabold text-blue-900 uppercase tracking-wide">
      {label} {required && <span className="text-red-600">*</span>}
    </label>
    <select 
      name={name} onChange={onChange} value={value} required={required} 
      autoComplete="off"
      style={{ backgroundColor: '#ffffff', color: '#000000' }}
      className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-900 focus:ring-0 outline-none transition-colors shadow-sm"
    >
      <option value="" disabled>Select...</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const PatientForm = ({ onSave, patientToEdit }) => {
  const [formData, setFormData] = useState({
    lastName: '', firstName: '', middleName: '', age: '', sex: '', maritalStatus: '',
    homeAddress: '', officeAddress: '', occupation: '', telephone: '', mobileNo: '', 
    date: new Date().toISOString().split('T')[0], occlusion: '', periodontalCondition: '', 
    oralHygiene: '', dentureUpperSince: '', dentureLowerSince: '', abnormalities: '',
    generalCondition: '', physician: '', natureOfTreatment: '', allergies: '', 
    previousHistoryOfBleeding: false, chronicAilments: '', bloodPressure: '', 
    drugsBeingTaken: '', odontogram: []
  });

  // Pre-fill form if we are editing an existing patient
  useEffect(() => {
    if (patientToEdit) {
      setFormData({
        ...patientToEdit,
        date: patientToEdit.date ? new Date(patientToEdit.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      });
    }
  }, [patientToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEdit = Boolean(patientToEdit && patientToEdit._id);
    const url = isEdit ? `http://localhost:5000/api/patients/${patientToEdit._id}` : 'http://localhost:5000/api/patients';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) { 
        alert(isEdit ? 'Patient Record Updated Successfully!' : 'Patient Record Saved Successfully!'); 
        if(onSave) onSave(); 
      } else { 
        const data = await response.json();
        alert(`Failed to save: ${data.error}`); 
      }
    } catch (error) {
      alert('Network Error: Make sure your backend terminal is running!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="bg-white p-8 rounded-3xl shadow-md border-t-4 border-t-blue-900">
        <div className="flex justify-between items-center mb-6 border-b-2 border-gray-100 pb-2">
           <h2 className="text-2xl font-extrabold text-blue-900 uppercase">Demographics</h2>
           {patientToEdit && <span className="bg-yellow-100 text-yellow-800 font-bold px-3 py-1 rounded-full border border-yellow-300">EDIT MODE</span>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField label="Last Name" name="lastName" required value={formData.lastName} onChange={handleChange} />
          <InputField label="First Name" name="firstName" required value={formData.firstName} onChange={handleChange} />
          <InputField label="Middle Name" name="middleName" value={formData.middleName} onChange={handleChange} />
          <InputField label="Age" name="age" type="number" required value={formData.age} onChange={handleChange} />
          <SelectField label="Sex" name="sex" options={["Male", "Female"]} required value={formData.sex} onChange={handleChange} />
          <SelectField label="Marital Status" name="maritalStatus" options={["Single", "Married", "Widowed", "Separated"]} value={formData.maritalStatus} onChange={handleChange} />
          <InputField label="Mobile Number" name="mobileNo" required value={formData.mobileNo} onChange={handleChange} />
          <InputField label="Telephone" name="telephone" value={formData.telephone} onChange={handleChange} />
          <InputField label="Occupation" name="occupation" value={formData.occupation} onChange={handleChange} />
          <div className="md:col-span-2"><InputField label="Home Address" name="homeAddress" required value={formData.homeAddress} onChange={handleChange} /></div>
          <InputField label="Office Address" name="officeAddress" value={formData.officeAddress} onChange={handleChange} />
        </div>
      </section>

      <section className="bg-white p-8 rounded-3xl shadow-md border-t-4 border-t-red-600">
        <h2 className="text-2xl font-extrabold text-blue-900 mb-6 border-b-2 border-gray-100 pb-2 uppercase">Medical & Dental History</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <SelectField label="Occlusion" name="occlusion" options={["Class I", "Class II", "Class III"]} value={formData.occlusion} onChange={handleChange} />
          <SelectField label="Periodontal Condition" name="periodontalCondition" options={["Healthy", "Gingivitis", "Mild Periodontitis", "Severe Periodontitis"]} value={formData.periodontalCondition} onChange={handleChange} />
          <SelectField label="Oral Hygiene" name="oralHygiene" options={["Excellent", "Good", "Fair", "Poor"]} value={formData.oralHygiene} onChange={handleChange} />
          <InputField label="Denture Upper Since" name="dentureUpperSince" value={formData.dentureUpperSince} onChange={handleChange} />
          <InputField label="Denture Lower Since" name="dentureLowerSince" value={formData.dentureLowerSince} onChange={handleChange} />
          <InputField label="Abnormalities" name="abnormalities" value={formData.abnormalities} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField label="Blood Pressure" name="bloodPressure" value={formData.bloodPressure} onChange={handleChange} />
          <InputField label="Allergies" name="allergies" value={formData.allergies} onChange={handleChange} />
          <InputField label="General Condition" name="generalCondition" value={formData.generalCondition} onChange={handleChange} />
          <InputField label="Physician" name="physician" value={formData.physician} onChange={handleChange} />
          <InputField label="Nature of Treatment" name="natureOfTreatment" value={formData.natureOfTreatment} onChange={handleChange} />
          <InputField label="Chronic Ailments" name="chronicAilments" value={formData.chronicAilments} onChange={handleChange} />
          <div className="md:col-span-3">
             <InputField label="Drugs Being Taken" name="drugsBeingTaken" value={formData.drugsBeingTaken} onChange={handleChange} />
          </div>
          <div className="flex items-center md:col-span-3 mt-4 bg-red-50 p-4 rounded-xl border-2 border-red-200">
            <input type="checkbox" name="previousHistoryOfBleeding" onChange={handleChange} checked={formData.previousHistoryOfBleeding} className="w-5 h-5 text-red-600 rounded focus:ring-red-500" style={{ backgroundColor: '#ffffff' }} />
            <label className="ml-3 font-extrabold text-red-700 uppercase tracking-wide">Patient has Previous History of Bleeding</label>
          </div>
        </div>
      </section>

      <section className="bg-white p-8 rounded-3xl shadow-md border-t-4 border-t-blue-900">
        <h2 className="text-2xl font-extrabold text-blue-900 mb-6 border-b-2 border-gray-100 pb-2 uppercase">Dental Chart</h2>
        <DentalChart formData={formData} setFormData={setFormData} />
      </section>

      <div className="flex justify-end pb-10">
        <button type="submit" className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-extrabold uppercase tracking-wide rounded-xl shadow-md transition-colors">
          {patientToEdit ? 'Update Patient Record' : 'Save Patient Record'}
        </button>
      </div>
    </form>
  );
};

export default PatientForm;