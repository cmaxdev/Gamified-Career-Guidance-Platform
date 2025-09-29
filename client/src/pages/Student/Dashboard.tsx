import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { calculateLevelInfo, getCareerTypeColor, getCareerTypeIcon } from '../../utils/auth';
import { 
  Trophy, 
  Target, 
  Download, 
  PlayCircle, 
  CheckCircle2, 
  Star,
  Zap,
  BookOpen,
  Award
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const levelInfo = calculateLevelInfo(user.experience);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name}! 🎯
          </h1>
          <p className="mt-2 text-gray-600">
            Ready to continue your career discovery journey?
          </p>
        </div>

        {/* Level & Progress Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Level Card */}
          <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-100 text-sm font-medium">Current Level</p>
                <p className="text-3xl font-bold">{levelInfo.current}</p>
              </div>
              <Trophy className="w-10 h-10 text-primary-200" />
            </div>
          </div>

          {/* Experience Card */}
          <div className="card bg-gradient-to-r from-success-500 to-success-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-success-100 text-sm font-medium">Total Experience</p>
                <p className="text-3xl font-bold">{user.experience} XP</p>
              </div>
              <Zap className="w-10 h-10 text-success-200" />
            </div>
          </div>

          {/* Progress Card */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-gray-600 text-sm font-medium">Progress to Level {levelInfo.current + 1}</p>
                <p className="text-2xl font-bold text-gray-900">{levelInfo.experience}/100 XP</p>
              </div>
              <Target className="w-10 h-10 text-gray-400" />
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${levelInfo.percentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {levelInfo.experienceToNext} XP until next level
            </p>
          </div>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Assessment Status */}
          <div className="card">
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                user.assessmentCompleted 
                  ? 'bg-success-100 text-success-600' 
                  : 'bg-primary-100 text-primary-600'
              }`}>
                {user.assessmentCompleted ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <PlayCircle className="w-6 h-6" />
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Career Assessment
                </h3>
                
                {user.assessmentCompleted ? (
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <CheckCircle2 className="w-4 h-4 text-success-500" />
                      <span className="text-success-700 font-medium">Assessment Completed!</span>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Great job! You've discovered your career profile. View your results and download your personalized report.
                    </p>
                    <div className="flex space-x-3">
                      <Link to="/results" className="btn-primary">
                        View Results
                      </Link>
                      <Link to="/results" className="btn-secondary flex items-center space-x-2">
                        <Download className="w-4 h-4" />
                        <span>Download Report</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-4">
                      Take our interactive career assessment to discover your strengths, interests, and ideal career paths. 
                      It only takes 5 minutes!
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">What you'll discover:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Your dominant career type</li>
                        <li>• Top 3 recommended careers</li>
                        <li>• Suggested study areas</li>
                        <li>• Personalized strengths profile</li>
                      </ul>
                    </div>
                    <Link to="/assessment" className="btn-primary flex items-center space-x-2">
                      <PlayCircle className="w-4 h-4" />
                      <span>Start Assessment</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Achievements & Rewards */}
          <div className="card">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-warning-100 text-warning-600 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Achievements & Rewards
                </h3>
                <p className="text-gray-600 mb-4">
                  Unlock achievements as you progress through your career discovery journey.
                </p>
                
                <div className="space-y-3">
                  {/* Achievement items */}
                  <div className={`flex items-center space-x-3 p-3 rounded-lg ${
                    user.assessmentCompleted ? 'bg-success-50' : 'bg-gray-50'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      user.assessmentCompleted 
                        ? 'bg-success-500 text-white' 
                        : 'bg-gray-300 text-gray-500'
                    }`}>
                      <Star className="w-4 h-4" />
                    </div>
                    <div>
                      <p className={`font-medium ${
                        user.assessmentCompleted ? 'text-success-800' : 'text-gray-600'
                      }`}>
                        Career Explorer
                      </p>
                      <p className="text-xs text-gray-500">Complete your first assessment</p>
                    </div>
                    {user.assessmentCompleted && (
                      <span className="text-success-600 text-sm font-medium">+150 XP</span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                    <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-600">Knowledge Seeker</p>
                      <p className="text-xs text-gray-500">Download your career report</p>
                    </div>
                    <span className="text-gray-400 text-sm">+50 XP</span>
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                    <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-600">Level Master</p>
                      <p className="text-xs text-gray-500">Reach Level 5</p>
                    </div>
                    <span className="text-gray-400 text-sm">+200 XP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card text-center">
            <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{user.assessmentCompleted ? '1' : '0'}</p>
            <p className="text-sm text-gray-600">Assessments</p>
          </div>

          <div className="card text-center">
            <div className="w-10 h-10 bg-success-100 text-success-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{user.experience}</p>
            <p className="text-sm text-gray-600">Total XP</p>
          </div>

          <div className="card text-center">
            <div className="w-10 h-10 bg-warning-100 text-warning-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{levelInfo.current}</p>
            <p className="text-sm text-gray-600">Current Level</p>
          </div>

          <div className="card text-center">
            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{user.assessmentCompleted ? '1' : '0'}</p>
            <p className="text-sm text-gray-600">Achievements</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
