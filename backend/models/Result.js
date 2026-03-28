import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  paperName: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['in_progress', 'completed'], 
    default: 'in_progress' 
  },
  score: { 
    type: Number, 
    default: 0 
  },
  totalQuestions: { 
    type: Number, 
    default: 0 
  },
  timeSpentSeconds: {
    type: Number,
    default: 0
  },
  answers: [{
    questionNumber: Number,
    selectedAnswer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Result = mongoose.model('Result', resultSchema);
export default Result;