import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  paperName: { type: String, required: true },
  
  // NEW FIELDS ADDED HERE:
  category: { type: String, required: true, default: 'Uceed' }, 
  testDurationMinutes: { type: Number, required: true, default: 180 }, 
  
  questionNumber: { type: Number, required: true },
  type: { type: String, required: true }, 
  questionText: { type: String, required: true },
  imageUrl: { type: String, default: null }, 
  options: [{
    id: String,
    text: String,
    isCorrect: Boolean
  }],
  correctNumericalAnswer: { type: Number, default: null },
  acceptableRange: {
    min: { type: Number },
    max: { type: Number }
  },
  tags: [String], 
  estimatedTimeSeconds: { type: Number, required: true },
  errorDiagnostics: [{
    wrongAnswer: mongoose.Schema.Types.Mixed, 
    errorType: String,
    feedback: String
  }]
});

const Question = mongoose.model('Question', questionSchema);
export default Question;