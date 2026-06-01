import mongoose from 'mongoose';

/**
 * Mongoose schema for storing one resume analysis result.
 *
 * @type {mongoose.Schema}
 */
const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeFileName: {
    type: String,
    required: true
  },
  structureFeedback: {
    type: String,
    required: true
  },
  contentQualityFeedback: {
    type: String,
    required: true
  },
  keywordStrengthFeedback: {
    type: String,
    required: true
  },
  weaknesses: {
    type: [String],
    default: []
  },
  improvements: {
    type: [String],
    default: []
  },
  careerRecommendations: {
    type: [
      {
        role: String,
        explanation: String
      }
    ],
    default: []
  },
  resumeText: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Analysis', analysisSchema);

