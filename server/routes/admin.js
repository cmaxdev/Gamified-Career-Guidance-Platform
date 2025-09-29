const express = require('express');
const User = require('../models/User');
const AssessmentResult = require('../models/AssessmentResult');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { generatePDF, generateBulkPDFs } = require('../utils/pdfGenerator');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// All admin routes require admin authentication
router.use(authenticateToken);
router.use(requireAdmin);

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const completedAssessments = await User.countDocuments({ 
      role: 'student', 
      assessmentCompleted: true 
    });
    
    const completionRate = totalStudents > 0 ? Math.round((completedAssessments / totalStudents) * 100) : 0;

    // Get recent activity
    const recentResults = await AssessmentResult.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      statistics: {
        totalStudents,
        completedAssessments,
        pendingAssessments: totalStudents - completedAssessments,
        completionRate
      },
      recentActivity: recentResults
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
});

// Get all students with their progress
router.get('/students', async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'all' } = req.query;
    
    let query = { role: 'student' };
    
    if (status === 'completed') {
      query.assessmentCompleted = true;
    } else if (status === 'pending') {
      query.assessmentCompleted = false;
    }

    const students = await User.find(query)
      .select('-password')
      .populate('assessmentResult')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalStudents = await User.countDocuments(query);

    res.json({
      students,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalStudents / limit),
        totalStudents,
        hasNext: page * limit < totalStudents,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Students fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch students' });
  }
});

// Get student details
router.get('/students/:id', async (req, res) => {
  try {
    const student = await User.findOne({ 
      _id: req.params.id, 
      role: 'student' 
    })
    .select('-password')
    .populate('assessmentResult');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ student });

  } catch (error) {
    console.error('Student details error:', error);
    res.status(500).json({ message: 'Failed to fetch student details' });
  }
});

// Download individual student report
router.get('/students/:id/report', async (req, res) => {
  try {
    const student = await User.findOne({ 
      _id: req.params.id, 
      role: 'student' 
    }).populate('assessmentResult');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (!student.assessmentResult) {
      return res.status(404).json({ message: 'Student has not completed assessment' });
    }

    const result = await AssessmentResult.findById(student.assessmentResult._id)
      .populate('user', 'name email');

    const pdfBuffer = await generatePDF(result);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="career-report-${student.name.replace(/\s+/g, '-').toLowerCase()}.pdf"`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Individual report error:', error);
    res.status(500).json({ message: 'Failed to generate report' });
  }
});

// Download bulk reports
router.get('/reports/bulk', async (req, res) => {
  try {
    const { status = 'completed' } = req.query;
    
    let query = { role: 'student' };
    if (status === 'completed') {
      query.assessmentCompleted = true;
    }

    const students = await User.find(query).populate('assessmentResult');
    
    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found' });
    }

    // Filter students with completed assessments
    const studentsWithResults = students.filter(student => student.assessmentResult);
    
    if (studentsWithResults.length === 0) {
      return res.status(404).json({ message: 'No completed assessments found' });
    }

    // Get assessment results
    const resultIds = studentsWithResults.map(student => student.assessmentResult._id);
    const results = await AssessmentResult.find({ _id: { $in: resultIds } })
      .populate('user', 'name email');

    // Generate bulk ZIP file
    const zipBuffer = await generateBulkPDFs(results);

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="career-reports-bulk-${new Date().toISOString().split('T')[0]}.zip"`);
    res.send(zipBuffer);

  } catch (error) {
    console.error('Bulk reports error:', error);
    res.status(500).json({ message: 'Failed to generate bulk reports' });
  }
});

// Get assessment analytics
router.get('/analytics/assessments', async (req, res) => {
  try {
    // Career type distribution
    const careerTypeDistribution = await AssessmentResult.aggregate([
      {
        $group: {
          _id: '$careerProfile.dominantType',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Assessment completion over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const completionTrend = await AssessmentResult.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { 
              format: "%Y-%m-%d", 
              date: "$createdAt" 
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      careerTypeDistribution,
      completionTrend,
      totalAssessments: await AssessmentResult.countDocuments()
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

// Delete student (admin only)
router.delete('/students/:id', async (req, res) => {
  try {
    const student = await User.findOne({ 
      _id: req.params.id, 
      role: 'student' 
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Delete associated assessment result
    if (student.assessmentResult) {
      await AssessmentResult.findByIdAndDelete(student.assessmentResult);
    }

    // Delete student
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'Student deleted successfully' });

  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ message: 'Failed to delete student' });
  }
});

module.exports = router;
