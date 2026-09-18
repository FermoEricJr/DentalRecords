const express = require('express');
const router = express.Router();
const PatientRecord = require('../models/PatientRecord');

// Create a new record
router.post('/', async (req, res) => {
  try {
    const newRecord = new PatientRecord(req.body);
    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all records
router.get('/', async (req, res) => {
  try {
    const records = await PatientRecord.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a record (EDIT)
router.put('/:id', async (req, res) => {
  try {
    const updatedRecord = await PatientRecord.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    res.json(updatedRecord);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a single record
router.delete('/:id', async (req, res) => {
  try {
    await PatientRecord.findByIdAndDelete(req.params.id);
    res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bulk delete records
router.post('/bulk-delete', async (req, res) => {
  try {
    const { ids } = req.body;
    await PatientRecord.deleteMany({ _id: { $in: ids } });
    res.json({ message: 'Patients deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;