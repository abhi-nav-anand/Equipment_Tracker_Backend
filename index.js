const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Machine', 'Vessel', 'Tank', 'Mixer'], required: true },
  status: { type: String, enum: ['Active', 'Inactive', 'Under Maintenance'], required: true },
  lastCleaned: { type: String, required: true },
}, { timestamps: true });

const Equipment = mongoose.model('Equipment', equipmentSchema);

app.get('/api/equipment', async (req, res) => {
  try {
    const equipment = await Equipment.find();
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch equipment' });
  }
});

app.post('/api/equipment', async (req, res) => {
  try {
    const newItem = new Equipment(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add equipment', details: err.message });
  }
});


app.put('/api/equipment/:id', async (req, res) => {
  try {
    const updated = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update equipment', details: err.message });
  }
});


app.delete('/api/equipment/:id', async (req, res) => {
  try {
    const deleted = await Equipment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json(deleted);
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete equipment', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
