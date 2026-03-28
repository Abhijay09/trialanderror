import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import Question from './models/Question.js';
import User from './models/User.js';
import Result from './models/Result.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// --- CONNECT TO MONGODB ---
mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log('✅ Connected to MongoDB successfully!'))
  .catch((error) => console.error('❌ MongoDB connection error:', error.message));

app.post('/api/signup', async (req, res) => {
  try {
    const { mobile, password, nickname, appearingYear, status, stream } = req.body;
    const existingUser = await User.findOne({ mobile });
    if (existingUser) return res.status(400).json({ message: "Mobile number already used." });

    const newUser = await User.create({ mobile, password, nickname, appearingYear, status, stream });
    res.status(201).json(newUser);
  } catch (error) { res.status(500).json({ message: error.message }); }
});

app.post('/api/login', async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const user = await User.findOne({ mobile });
    if (!user) return res.status(404).json({ message: "Account not found." });
    if (user.password !== password) return res.status(400).json({ message: "Incorrect password." });
    res.status(200).json(user);
  } catch (error) { res.status(500).json({ message: "Server error." }); }
});

app.get('/api/questions', async (req, res) => {
  try {
    const allQuestions = await Question.find({});
    res.json(allQuestions);
  } catch (error) { res.status(500).json({ error: 'Failed to fetch questions' }); }
});

// --- START TEST (FIXED REACT STRICT MODE BUG) ---
app.post('/api/start-test', async (req, res) => {
  try {
    const { userId, paperName } = req.body;
    
    // findOneAndUpdate with upsert prevents React from creating duplicate "yellow" rows!
    const result = await Result.findOneAndUpdate(
      { userId, paperName, status: 'in_progress' },
      { $setOnInsert: { userId, paperName, status: 'in_progress' } },
      { upsert: true, new: true }
    );
    
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to start test." });
  }
});

// --- SUBMIT TEST (FIXED YELLOW BUG) ---
app.post('/api/submit-test', async (req, res) => {
  try {
    const { userId, paperName, userAnswers, timeSpentSeconds } = req.body;
    const realQuestions = await Question.find({ paperName });
    
    let score = 0;
    const evaluatedAnswers = [];

    realQuestions.forEach((q) => {
      const userAnswer = userAnswers[q.questionNumber];
      let isCorrect = false;

      if (userAnswer !== undefined && userAnswer !== "") {
        if (q.type === 'MCQ') {
          const correctOption = q.options.find(opt => opt.isCorrect);
          if (correctOption && correctOption.id === userAnswer) { isCorrect = true; score += 1; }
        } else if (q.type === 'NAT') {
          const numAnswer = parseFloat(userAnswer);
          if (numAnswer >= q.acceptableRange.min && numAnswer <= q.acceptableRange.max) { isCorrect = true; score += 1; }
        }
      }
      evaluatedAnswers.push({ questionNumber: q.questionNumber, selectedAnswer: userAnswer || null, isCorrect });
    });

    // Update ALL in_progress ghosts to completed (Forces it to turn green)
    await Result.updateMany(
      { userId, paperName, status: 'in_progress' },
      { $set: { score, totalQuestions: realQuestions.length, timeSpentSeconds, answers: evaluatedAnswers, status: 'completed' } }
    );

    // Fetch the newly updated result to send back
    const finalResult = await Result.findOne({ userId, paperName }).sort({ _id: -1 });

    res.status(201).json(finalResult);
  } catch (error) { res.status(500).json({ message: "Failed to submit test." }); }
});

app.get('/api/results/:userId', async (req, res) => {
  try {
    const results = await Result.find({ userId: req.params.userId }).sort({ createdAt: 1 });
    res.json(results);
  } catch (error) { res.status(500).json({ message: "Failed to fetch results." }); }
});

app.get('/api/seed', async (req, res) => {
  try {
    const mockData = JSON.parse(fs.readFileSync('./mockPaper.json', 'utf-8'));
    await Question.deleteMany({});
    await Question.insertMany(mockData);
    res.send('✅ Database Seeded!');
  } catch (error) { res.status(500).send('❌ Error seeding database: ' + error.message); }
});

app.get('/api/admin/users', async (req, res) => {
  try { const users = await User.find({}); res.json(users); } catch (error) { res.status(500).json({ message: "Failed to fetch users" }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { console.log(`🚀 Backend running on http://localhost:${PORT}`); });