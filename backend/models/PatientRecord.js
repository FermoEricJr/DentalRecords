const mongoose = require('mongoose');

const PatientRecordSchema = new mongoose.Schema({
  // Demographics
  lastName: { type: String, required: true },
  firstName: { type: String, required: true },
  middleName: { type: String, default: '' },
  age: { type: Number, required: true },
  sex: { type: String, required: true },
  maritalStatus: String,
  homeAddress: { type: String, required: true },
  officeAddress: String,
  occupation: String,
  telephone: String,
  mobileNo: { type: String, required: true },
  date: { type: Date, default: Date.now },

  // Medical History
  occlusion: String,
  periodontalCondition: String,
  oralHygiene: String,
  dentureUpperSince: String,
  dentureLowerSince: String,
  abnormalities: String,
  generalCondition: String,
  physician: String,
  natureOfTreatment: String,
  allergies: String,
  previousHistoryOfBleeding: { type: Boolean, default: false },
  chronicAilments: String,
  bloodPressure: String,
  drugsBeingTaken: String,

  // Basic Form Odontogram
  odontogram: [{
    toothNumber: { type: Number, required: true },
    condition: { type: String, default: 'Normal' }
  }],

  // Advanced Clinical Features (For future expansion)
  perioChart: [],
  treatmentPlan: [],
  radiographs: []
}, { timestamps: true });

module.exports = mongoose.model('PatientRecord', PatientRecordSchema);