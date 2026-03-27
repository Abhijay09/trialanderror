import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  paperName: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  answers: [{
    questionNumber: Number,
    selectedAnswer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean,
    timeSpent: Number
  }],
  completedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Result', resultSchema);