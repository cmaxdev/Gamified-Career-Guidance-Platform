const mongoose = require('mongoose');

const assessmentResultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  responses: [{
    question: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['creative', 'analytical', 'social', 'practical', 'technical', 'leadership'],
      required: true
    }
  }],
  careerProfile: {
    dominantType: {
      type: String,
      required: true
    },
    strengths: [{
      type: String
    }],
    recommendedCareers: [{
      title: String,
      description: String,
      matchPercentage: Number
    }],
    suggestedStudyAreas: [{
      type: String
    }]
  },
  experienceGained: {
    type: Number,
    default: 150
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AssessmentResult', assessmentResultSchema);
