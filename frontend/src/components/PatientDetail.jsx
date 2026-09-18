import React, { useState } from 'react';
import DentalChart from './DentalChart';

const PatientDetail = ({ patient, onBack }) => {
  const [activeTab, setActiveTab] = useState('demographics');
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printSettings, setPrintSettings] = useState({
    demographics: true,
    medicalHistory: true,
    charting: true,
    prescriptions: false,
    consent: false
  });
  
  if (!patient) return null;

  const hasAlerts = patient.allergies || patient.previousHistoryOfBleeding || patient.drugsBeingTaken;

  const DetailRow = ({ label, value }) => (
    <div className="flex border-b border-gray-100 py-3">
      <span className="font-extrabold text-blue-900 w-1/3">{label}:</span>
      <span className="w-2/3 text-gray-700 font-medium">{value || '-'}</span>
    </div>
  );

  const PrintRow = ({ label, value }) => (
    <div className="flex border-b border-gray-300 py-1 text-sm">
      <span className="font-bold w-1/3 text-black">{label}:</span>
      <span className="w-2/3 text-black">{value || '-'}</span>
    </div>
  );

  const handlePrint = () => {
    setShowPrintModal(false);
    setTimeout(() => window.print(), 100);
  };

  const handleCheckbox = (e) => {
    setPrintSettings({ ...printSettings, [e.target.name]: e.target.checked });
  };

  return (
    <>
      <div className="bg-gray-50 rounded-3xl min-h-screen pb-10 shadow-md border-t-4 border-t-blue-900 print:hidden">
        
        {showPrintModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-96">
              <h3 className="text-xl font-extrabold text-blue-900 mb-4 border-b-2 border-red-600 pb-2 uppercase">Print Options</h3>
              <p className="text-sm font-medium text-gray-600 mb-4">Select categories to include on the printed record:</p>
              
              <div className="space-y-3 mb-8">
                {Object.keys(printSettings).map(key => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      name={key} 
                      checked={printSettings[key]} 
                      onChange={handleCheckbox} 
                      className="w-5 h-5 accent-red-600 cursor-pointer" 
                    />
                    <span className="font-bold text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setShowPrintModal(false)} className="px-5 py-2 bg-gray-200 text-blue-900 font-bold rounded-full hover:bg-gray-300 transition-colors">Cancel</button>
                <button onClick={handlePrint} className="px-5 py-2 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 shadow-md transition-colors">Print Now</button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-t-3xl flex justify-between items-center no-print">
          <h2 className="text-3xl font-extrabold text-blue-900 uppercase">{patient.lastName}, {patient.firstName} {patient.middleName}</h2>
          <div className="space-x-3 flex">
            <button onClick={onBack} className="px-6 py-2 bg-gray-200 text-blue-900 font-bold rounded-full hover:bg-gray-300 transition-colors">Back</button>
            <button onClick={() => setShowPrintModal(true)} className="px-6 py-2 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-colors shadow-sm">Print Options</button>
          </div>
        </div>

        {hasAlerts && (
          <div className="bg-red-600 text-white p-3 text-center font-extrabold tracking-wide uppercase animate-pulse no-print">
            ⚠️ MEDICAL ALERT: 
            {patient.allergies && ` ALLERGIES: ${patient.allergies} | `}
            {patient.previousHistoryOfBleeding && ` BLEEDING RISK | `}
            {patient.drugsBeingTaken && ` TAKING: ${patient.drugsBeingTaken}`}
          </div>
        )}

        <div className="flex flex-wrap bg-blue-900 p-3 gap-3 justify-center no-print shadow-inner">
          {['demographics', 'medical history', 'charting', 'e-prescribe', 'consent forms'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)} 
              className={`px-6 py-2 rounded-full font-bold capitalize transition-colors ${activeTab === tab ? 'bg-white text-blue-900 shadow-md' : 'bg-blue-800 text-white hover:bg-blue-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-8 bg-white m-8 rounded-xl shadow-sm border border-gray-200">
          
          {activeTab === 'demographics' && (
             <div className="grid grid-cols-2 gap-8 text-sm">
               <div>
                  <DetailRow label="Age / Sex" value={`${patient.age} / ${patient.sex}`} />
                  <DetailRow label="Marital Status" value={patient.maritalStatus} />
                  <DetailRow label="Occupation" value={patient.occupation} />
                  <DetailRow label="Date Recorded" value={new Date(patient.date).toLocaleDateString()} />
               </div>
               <div>
                  <DetailRow label="Mobile No." value={patient.mobileNo} />
                  <DetailRow label="Telephone" value={patient.telephone} />
                  <DetailRow label="Home Address" value={patient.homeAddress} />
                  <DetailRow label="Office Address" value={patient.officeAddress} />
               </div>
             </div>
          )}

          {activeTab === 'medical history' && (
             <div className="grid grid-cols-2 gap-8 text-sm">
               <div>
                  <DetailRow label="Occlusion" value={patient.occlusion} />
                  <DetailRow label="Periodontal Condition" value={patient.periodontalCondition} />
                  <DetailRow label="Oral Hygiene" value={patient.oralHygiene} />
                  <DetailRow label="Denture Upper Since" value={patient.dentureUpperSince} />
                  <DetailRow label="Denture Lower Since" value={patient.dentureLowerSince} />
                  <DetailRow label="Abnormalities" value={patient.abnormalities} />
                  <DetailRow label="Nature of Treatment" value={patient.natureOfTreatment} />
               </div>
               <div>
                  <DetailRow label="Blood Pressure" value={patient.bloodPressure} />
                  <DetailRow label="General Condition" value={patient.generalCondition} />
                  <DetailRow label="Physician" value={patient.physician} />
                  <DetailRow label="Chronic Ailments" value={patient.chronicAilments} />
                  <DetailRow label="Drugs Being Taken" value={patient.drugsBeingTaken} />
                  <div className="flex border-b border-gray-100 py-3"><span className="font-extrabold text-red-600 w-1/3">Allergies:</span><span className="w-2/3 font-bold text-red-600">{patient.allergies || 'None'}</span></div>
                  <div className="flex border-b border-gray-100 py-3"><span className="font-extrabold text-red-600 w-1/3">Bleeding Risk:</span><span className="w-2/3 font-bold text-red-600">{patient.previousHistoryOfBleeding ? 'YES' : 'NO'}</span></div>
               </div>
             </div>
          )}
          
          {activeTab === 'charting' && (
            <div className="pointer-events-none">
              <DentalChart formData={patient} setFormData={() => {}} />
            </div>
          )}
          
          {activeTab === 'e-prescribe' && (
            <div>
              <h3 className="text-xl font-extrabold text-blue-900 mb-4 border-b-2 border-red-600 pb-2 uppercase">eRx: Digital Prescription</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <input type="text" placeholder="Medication (e.g. Amoxicillin 500mg)" style={{ backgroundColor: '#ffffff', color: '#000000' }} className="col-span-2 border-2 border-gray-200 focus:border-blue-900 outline-none p-3 rounded-lg" />
                <input type="text" placeholder="Dispense Qty (e.g. 21)" style={{ backgroundColor: '#ffffff', color: '#000000' }} className="border-2 border-gray-200 focus:border-blue-900 outline-none p-3 rounded-lg" />
                <input type="text" placeholder="Sig: Take 1 cap PO TID for 7 days" style={{ backgroundColor: '#ffffff', color: '#000000' }} className="col-span-3 border-2 border-gray-200 focus:border-blue-900 outline-none p-3 rounded-lg" />
              </div>
              <button className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 shadow-md">Send to Pharmacy Network</button>
            </div>
          )}

          {activeTab === 'consent forms' && (
            <div>
              <h3 className="text-xl font-extrabold text-blue-900 mb-4 border-b-2 border-red-600 pb-2 uppercase">Patient Portal & E-Signatures</h3>
              <div className="flex gap-4 mb-8">
                <select style={{ backgroundColor: '#ffffff', color: '#000000' }} className="border-2 border-gray-200 focus:border-blue-900 outline-none p-3 rounded-lg w-72 font-medium">
                  <option>Tooth Extraction Consent</option>
                  <option>Root Canal Consent</option>
                  <option>HIPAA / Privacy Policy</option>
                </select>
                <button className="bg-blue-900 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-800 shadow-md">Send to Phone</button>
                <button className="bg-gray-200 text-blue-900 px-6 py-3 rounded-full font-bold hover:bg-gray-300 shadow-md">Sign on Tablet</button>
              </div>
              
              <h4 className="font-extrabold text-blue-900 mb-2">Signed Documents on File:</h4>
              {patient.consentForms?.length > 0 ? (
                 <ul className="list-disc pl-5">
                   {patient.consentForms.map((form, i) => (
                     <li key={i} className="text-sm font-bold py-1">{form.formName} - Signed {new Date(form.signedDate).toLocaleDateString()}</li>
                   ))}
                 </ul>
              ) : (
                <p className="text-gray-500 italic font-medium">No signed forms on record.</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="hidden print:block w-full bg-white text-black p-4">
        <div className="border-b-4 border-black pb-4 mb-6 text-center">
           <h1 className="text-4xl font-extrabold uppercase tracking-tight">Lubian's Dental Clinic</h1>
           <p className="text-lg font-bold">Patient Record</p>
        </div>

        <div className="mb-8 flex justify-between items-end border-b border-gray-300 pb-2">
           <h2 className="text-3xl font-extrabold uppercase">{patient.lastName}, {patient.firstName} {patient.middleName}</h2>
           <span className="font-bold text-gray-600">Generated: {new Date().toLocaleDateString()}</span>
        </div>

        {printSettings.demographics && (
          <div className="mb-8">
             <h3 className="text-xl font-extrabold uppercase bg-gray-200 p-2 mb-4">Demographics</h3>
             <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                <PrintRow label="Age / Sex" value={`${patient.age} / ${patient.sex}`} />
                <PrintRow label="Marital Status" value={patient.maritalStatus} />
                <PrintRow label="Occupation" value={patient.occupation} />
                <PrintRow label="Mobile No." value={patient.mobileNo} />
                <PrintRow label="Telephone" value={patient.telephone} />
                <PrintRow label="Home Address" value={patient.homeAddress} />
                <PrintRow label="Office Address" value={patient.officeAddress} />
             </div>
          </div>
        )}

        {printSettings.medicalHistory && (
          <div className="mb-8">
             <h3 className="text-xl font-extrabold uppercase bg-gray-200 p-2 mb-4">Medical & Dental History</h3>
             {hasAlerts && (
               <div className="border-2 border-black p-2 font-extrabold uppercase mb-4 text-center">
                 *** Medical Alert: 
                 {patient.allergies && ` Allergies (${patient.allergies}) `}
                 {patient.previousHistoryOfBleeding && ` Bleeding Risk `}
                 {patient.drugsBeingTaken && ` Drugs (${patient.drugsBeingTaken}) `}
                 ***
               </div>
             )}
             <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                <PrintRow label="Blood Pressure" value={patient.bloodPressure} />
                <PrintRow label="General Condition" value={patient.generalCondition} />
                <PrintRow label="Physician" value={patient.physician} />
                <PrintRow label="Chronic Ailments" value={patient.chronicAilments} />
                <PrintRow label="Occlusion" value={patient.occlusion} />
                <PrintRow label="Periodontal" value={patient.periodontalCondition} />
                <PrintRow label="Oral Hygiene" value={patient.oralHygiene} />
                <PrintRow label="Abnormalities" value={patient.abnormalities} />
             </div>
          </div>
        )}

        {printSettings.charting && (
          <div className="mb-8">
             <h3 className="text-xl font-extrabold uppercase bg-gray-200 p-2 mb-4">Dental Chart</h3>
             {/* The charting components print styling is now handled directly by DentalChart.jsx */}
             <div className="pointer-events-none w-full">
               <DentalChart formData={patient} setFormData={() => {}} />
             </div>
          </div>
        )}

        {printSettings.prescriptions && (
          <div className="mb-8">
             <h3 className="text-xl font-extrabold uppercase bg-gray-200 p-2 mb-4">Prescription History</h3>
             <p className="italic text-gray-500 text-sm">No prescriptions on file for this print session.</p>
          </div>
        )}

        {printSettings.consent && (
          <div className="mb-8">
             <h3 className="text-xl font-extrabold uppercase bg-gray-200 p-2 mb-4">Signed Consents</h3>
             {patient.consentForms?.length > 0 ? (
               <ul className="list-disc pl-5">
                 {patient.consentForms.map((form, i) => (
                   <li key={i} className="text-sm font-bold py-1">{form.formName} - Signed {new Date(form.signedDate).toLocaleDateString()}</li>
                 ))}
               </ul>
             ) : (
               <p className="italic text-gray-500 text-sm">No consent forms on record.</p>
             )}
          </div>
        )}
      </div>
    </>
  );
};

export default PatientDetail;