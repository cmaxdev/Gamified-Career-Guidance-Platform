const express = require('express');
const User = require('../models/User');
const AssessmentResult = require('../models/AssessmentResult');
const { authenticateToken } = require('../middleware/auth');
const { generatePDF } = require('../utils/pdfGenerator');

const router = express.Router();

// Mock assessment questions for MVP
const mockQuestions = [
  {
    id: 1,
    question: "What type of activities do you enjoy most?",
    options: [
      { text: "Working with your hands and building things", category: "practical" },
      { text: "Analyzing data and solving complex problems", category: "analytical" },
      { text: "Helping and teaching others", category: "social" },
      { text: "Creating art, music, or writing", category: "creative" }
    ]
  },
  {
    id: 2,
    question: "In a group project, you prefer to:",
    options: [
      { text: "Lead the team and coordinate tasks", category: "leadership" },
      { text: "Focus on research and technical details", category: "technical" },
      { text: "Facilitate discussions and resolve conflicts", category: "social" },
      { text: "Come up with innovative ideas and solutions", category: "creative" }
    ]
  },
  {
    id: 3,
    question: "Your ideal work environment would be:",
    options: [
      { text: "A laboratory or workshop with tools and equipment", category: "technical" },
      { text: "An office where you can analyze data and strategies", category: "analytical" },
      { text: "A collaborative space where you interact with many people", category: "social" },
      { text: "A flexible space where you can express creativity", category: "creative" }
    ]
  }
];

// Career recommendations based on dominant category
const careerRecommendations = {
  practical: {
    careers: [
      { title: "Mechanical Engineer", description: "Design and build mechanical systems", matchPercentage: 95 },
      { title: "Construction Manager", description: "Oversee building projects", matchPercentage: 88 },
      { title: "Automotive Technician", description: "Repair and maintain vehicles", matchPercentage: 82 }
    ],
    strengths: ["Problem-solving", "Hands-on skills", "Technical aptitude", "Attention to detail"],
    studyAreas: ["Engineering", "Technology", "Applied Sciences", "Trades"]
  },
  analytical: {
    careers: [
      { title: "Data Scientist", description: "Analyze complex data to find insights", matchPercentage: 96 },
      { title: "Financial Analyst", description: "Evaluate investment opportunities", matchPercentage: 89 },
      { title: "Research Scientist", description: "Conduct scientific research", matchPercentage: 85 }
    ],
    strengths: ["Critical thinking", "Mathematical skills", "Research abilities", "Pattern recognition"],
    studyAreas: ["Mathematics", "Computer Science", "Economics", "Natural Sciences"]
  },
  social: {
    careers: [
      { title: "School Counselor", description: "Guide and support students", matchPercentage: 94 },
      { title: "Human Resources Manager", description: "Manage employee relations", matchPercentage: 87 },
      { title: "Social Worker", description: "Help individuals and communities", matchPercentage: 83 }
    ],
    strengths: ["Communication", "Empathy", "Interpersonal skills", "Conflict resolution"],
    studyAreas: ["Psychology", "Education", "Social Work", "Human Resources"]
  },
  creative: {
    careers: [
      { title: "Graphic Designer", description: "Create visual communications", matchPercentage: 93 },
      { title: "Marketing Creative Director", description: "Lead creative campaigns", matchPercentage: 88 },
      { title: "User Experience Designer", description: "Design digital experiences", matchPercentage: 84 }
    ],
    strengths: ["Creativity", "Visual thinking", "Innovation", "Artistic expression"],
    studyAreas: ["Design", "Fine Arts", "Marketing", "Digital Media"]
  },
  technical: {
    careers: [
      { title: "Software Developer", description: "Build applications and systems", matchPercentage: 95 },
      { title: "Cybersecurity Specialist", description: "Protect digital systems", matchPercentage: 90 },
      { title: "Network Administrator", description: "Manage computer networks", matchPercentage: 85 }
    ],
    strengths: ["Technical skills", "Logical thinking", "System design", "Troubleshooting"],
    studyAreas: ["Computer Science", "Information Technology", "Cybersecurity", "Software Engineering"]
  },
  leadership: {
    careers: [
      { title: "Project Manager", description: "Lead and coordinate projects", matchPercentage: 92 },
      { title: "Business Consultant", description: "Advise organizations on strategy", matchPercentage: 88 },
      { title: "Operations Manager", description: "Oversee business operations", matchPercentage: 85 }
    ],
    strengths: ["Leadership", "Strategic thinking", "Communication", "Team management"],
    studyAreas: ["Business Administration", "Management", "Leadership Studies", "Organizational Psychology"]
  }
};

// Get assessment questions
router.get('/questions', authenticateToken, (req, res) => {
  res.json({ questions: mockQuestions });
});

// Submit assessment
router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const { responses } = req.body;
    const userId = req.user._id;

    // Validate responses
    if (!responses || responses.length !== 3) {
      return res.status(400).json({ message: 'All 3 questions must be answered' });
    }

    // Count category frequencies
    const categoryCount = {};
    responses.forEach(response => {
      categoryCount[response.category] = (categoryCount[response.category] || 0) + 1;
    });

    // Find dominant category
    const dominantType = Object.keys(categoryCount).reduce((a, b) => 
      categoryCount[a] > categoryCount[b] ? a : b
    );

    // Get career profile
    const careerProfile = {
      dominantType,
      strengths: careerRecommendations[dominantType].strengths,
      recommendedCareers: careerRecommendations[dominantType].careers,
      suggestedStudyAreas: careerRecommendations[dominantType].studyAreas
    };

    // Create assessment result
    const assessmentResult = new AssessmentResult({
      user: userId,
      responses: responses.map((response, index) => ({
        question: mockQuestions[index].question,
        answer: response.answer,
        category: response.category
      })),
      careerProfile,
      experienceGained: 150
    });

    await assessmentResult.save();

    // Update user
    const user = await User.findById(userId);
    user.assessmentCompleted = true;
    user.assessmentResult = assessmentResult._id;
    user.experience += 150;
    user.calculateLevel();
    await user.save();

    res.json({
      message: 'Assessment completed successfully!',
      result: assessmentResult,
      experienceGained: 150,
      newLevel: user.level,
      totalExperience: user.experience
    });

  } catch (error) {
    console.error('Assessment submission error:', error);
    res.status(500).json({ message: 'Failed to submit assessment' });
  }
});

// Get assessment result
router.get('/result/:id', authenticateToken, async (req, res) => {
  try {
    const resultId = req.params.id;
    const result = await AssessmentResult.findById(resultId).populate('user', 'name email');

    if (!result) {
      return res.status(404).json({ message: 'Assessment result not found' });
    }

    // Check if user owns this result or is admin
    if (result.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ result });
  } catch (error) {
    console.error('Result fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch result' });
  }
});

// Get user's latest assessment result
router.get('/my-result', authenticateToken, async (req, res) => {
  try {
    const result = await AssessmentResult.findOne({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('user', 'name email');

    if (!result) {
      return res.status(404).json({ message: 'No assessment completed yet' });
    }

    res.json({ result });
  } catch (error) {
    console.error('My result fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch your result' });
  }
});

// Download PDF report
router.get('/download-report/:id', authenticateToken, async (req, res) => {
  try {
    const resultId = req.params.id;
    const result = await AssessmentResult.findById(resultId).populate('user', 'name email');

    if (!result) {
      return res.status(404).json({ message: 'Assessment result not found' });
    }

    // Check if user owns this result or is admin
    if (result.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Generate PDF
    const pdfBuffer = await generatePDF(result);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="career-report-${result.user.name.replace(/\s+/g, '-').toLowerCase()}.pdf"`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF download error:', error);
    res.status(500).json({ message: 'Failed to generate PDF report' });
  }
});

module.exports = router;
