import mongoose from 'mongoose';

// This is the blueprint for how a question should look in the database
const questionSchema = new mongoose.Schema({
  paperName: { type: String, required: true },
  questionNumber: { type: Number, required: true },
  type: { type: String, required: true }, // "MCQ" or "NAT"
  questionText: { type: String, required: true },
  imageUrl: { type: String, default: null }, // Optional
  
  // MCQ Options (will be empty for NAT questions)
  options: [{
    id: String,
    text: String,
    isCorrect: Boolean
  }],

  // NAT Answer (will be empty for MCQ questions)
  correctNumericalAnswer: { type: Number, default: null },
  acceptableRange: {
    min: { type: Number },
    max: { type: Number }
  },

  tags: [String], // Array of words like ["Math", "Geometry"]
  estimatedTimeSeconds: { type: Number, required: true },

  // For your awesome Analytics page!
  errorDiagnostics: [{
    wrongAnswer: mongoose.Schema.Types.Mixed, // Can be text "A" or number 45
    errorType: String,
    feedback: String
  }]
});

// Create the model and export it
const Question = mongoose.model('Question', questionSchema);
export default Question;