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
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000 
})
  .then(() => console.log('✅ Connected to MongoDB successfully!'))
  .catch((error) => console.error('❌ MongoDB connection error:', error.message));

// --- SIGNUP ROUTE ---
app.post('/api/signup', async (req, res) => {
  try {
    const { mobile, password, nickname, appearingYear, status, stream } = req.body;
    const existingUser = await User.findOne({ mobile });
    if (existingUser) return res.status(400).json({ message: "Mobile number already used." });

    const newUser = await User.create({ mobile, password, nickname, appearingYear, status, stream });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message }); 
  }
});

// --- LOGIN ROUTE ---
app.post('/api/login', async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const user = await User.findOne({ mobile });
    if (!user) return res.status(404).json({ message: "Account not found. Please sign up." });
    if (user.password !== password) return res.status(400).json({ message: "Incorrect password." });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error during login." });
  }
});

// --- FETCH ALL QUESTIONS ---
app.get('/api/questions', async (req, res) => {
  try {
    const allQuestions = await Question.find({});
    res.json(allQuestions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// --- SUBMIT TEST ROUTE ---
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
          if (correctOption && correctOption.id === userAnswer) {
            isCorrect = true;
            score += 1;
          }
        } else if (q.type === 'NAT') {
          const numAnswer = parseFloat(userAnswer);
          if (numAnswer >= q.acceptableRange.min && numAnswer <= q.acceptableRange.max) {
            isCorrect = true;
            score += 1;
          }
        }
      }

      evaluatedAnswers.push({
        questionNumber: q.questionNumber,
        selectedAnswer: userAnswer || null,
        isCorrect
      });
    });

    const newResult = await Result.create({
      userId,
      paperName,
      score,
      totalQuestions: realQuestions.length,
      timeSpentSeconds,
      answers: evaluatedAnswers
    });

    res.status(201).json(newResult);
  } catch (error) {
    res.status(500).json({ message: "Failed to submit test." });
  }
});

// --- GET ALL RESULTS FOR A SPECIFIC USER (NEW) ---
app.get('/api/results/:userId', async (req, res) => {
  try {
    // Sort by createdAt: 1 (Ascending order - Oldest to Newest)
    const results = await Result.find({ userId: req.params.userId }).sort({ createdAt: 1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch analytics data." });
  }
});

// --- SEED DATABASE ---
app.get('/api/seed', async (req, res) => {
  try {
    const mockData = JSON.parse(fs.readFileSync('./mockPaper.json', 'utf-8'));
    await Question.deleteMany({});
    await Question.insertMany(mockData);
    res.send('✅ Database Seeded!');
  } catch (error) {
    res.status(500).send('❌ Error seeding database: ' + error.message);
  }
});

// --- ADMIN: VIEW ALL USERS ---
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});