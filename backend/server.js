import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs'; // Built-in Node tool to read files
import Question from './models/Question.js'; // Import our new Blueprint

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// --- CONNECT TO MONGODB ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB successfully!'))
  .catch((error) => console.error('❌ MongoDB connection error:', error));


// --- ROUTE 1: UPLOAD DATA (We will run this once) ---
app.get('/api/seed', async (req, res) => {
  try {
    // 1. Read the JSON file
    const mockData = JSON.parse(fs.readFileSync('./mockPaper.json', 'utf-8'));
    
    // 2. Clear out any old test data just in case
    await Question.deleteMany({});
    
    // 3. Insert the new 10 questions into MongoDB
    await Question.insertMany(mockData);
    
    res.send('✅ Database Seeded! 10 questions successfully uploaded to MongoDB.');
  } catch (error) {
    console.error(error);
    res.status(500).send('❌ Error seeding database: ' + error.message);
  }
});


// --- ROUTE 2: FETCH DATA (Your React app will use this) ---
app.get('/api/questions', async (req, res) => {
  try {
    // Go to MongoDB, find all questions, and send them back!
    const allQuestions = await Question.find({});
    res.json(allQuestions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});