import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { assessmentAPI, downloadFile } from '../../utils/api';
import { AssessmentResult } from '../../types';
import { getCareerTypeColor, getCareerTypeIcon, formatDate } from '../../utils/auth';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { 
  Download, 
  Trophy, 
  Star, 
  BookOpen, 
  TrendingUp, 
  CheckCircle,
  Sparkles,
  Target,
  Award,
  ArrowLeft
} from 'lucide-react';

const Results: React.FC = () => {
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [error, setError] = useState('');

  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const justCompleted = location.state?.justCompleted;
  const experienceGained = location.state?.experienceGained;

  useEffect(() => {
    if (!user?.assessmentCompleted) {
      navigate('/assessment');
      return;
    }

    fetchResult();
  }, [user, navigate]);

  const fetchResult = async () => {
    try {
      const response = await assessmentAPI.getMyResult();
      setResult(response.data.result);
    } catch (err) {
      setError('Failed to load your results');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!result) return;

    setDownloadingPDF(true);
    try {
      const response = await assessmentAPI.downloadReport(result._id);
      const filename = `career-report-${user?.name?.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      downloadFile(response.data, filename);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloadingPDF(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading your results..." />;
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card max-w-md text-center">
          <div className="text-red-600 mb-4">
            <Trophy className="w-12 h-12 mx-auto mb-3" />
            <p>{error || 'No results found'}</p>
          </div>
          <Link to="/" className="btn-primary">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { careerProfile } = result;
  const typeColor = getCareerTypeColor(careerProfile.dominantType);
  const typeIcon = getCareerTypeIcon(careerProfile.dominantType);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Completion Celebration */}
        {justCompleted && (
          <div className="card bg-gradient-to-r from-success-500 to-success-600 text-white mb-8 animate-fadeIn">
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Trophy className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Congratulations! 🎉</h2>
              <p className="text-success-100 mb-4">
                You've successfully completed your career assessment and earned {experienceGained || 150} XP!
              </p>
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">Level up and unlock new achievements!</span>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Career Profile</h1>
            <p className="text-gray-600 mt-2">
              Completed on {formatDate(result.completedAt)}
            </p>
          </div>
          <Link to="/" className="btn-secondary flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Career Type Card */}
        <div className="card mb-8">
          <div className="text-center">
            <div className="text-6xl mb-4">{typeIcon}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              You are a <span className="text-primary-600">{careerProfile.dominantType.toUpperCase()}</span> type!
            </h2>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${typeColor}`}>
              {careerProfile.dominantType.charAt(0).toUpperCase() + careerProfile.dominantType.slice(1)} Personality
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Strengths */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-success-100 text-success-600 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Your Strengths</h3>
            </div>
            
            <div className="space-y-3">
              {careerProfile.strengths.map((strength, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-success-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-success-500 flex-shrink-0" />
                  <span className="text-success-900 font-medium">{strength}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Study Areas */}
          <div className="card">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Suggested Study Areas</h3>
            </div>
            
            <div className="space-y-3">
              {careerProfile.suggestedStudyAreas.map((area, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg">
                  <Target className="w-5 h-5 text-primary-500 flex-shrink-0" />
                  <span className="text-primary-900 font-medium">{area}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Careers */}
        <div className="card mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-warning-100 text-warning-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Recommended Careers</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {careerProfile.recommendedCareers.map((career, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{career.title}</h4>
                  <span className="bg-success-100 text-success-800 text-xs font-medium px-2 py-1 rounded-full">
                    {career.matchPercentage}% match
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{career.description}</p>
                
                {/* Match Level Indicator */}
                <div className="mt-4">
                  <div className="progress-bar h-1">
                    <div 
                      className="h-1 rounded-full bg-success-500 transition-all duration-500" 
                      style={{ width: `${career.matchPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assessment Responses */}
        <div className="card mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Responses</h3>
          
          <div className="space-y-6">
            {result.responses.map((response, index) => (
              <div key={index} className="border-l-4 border-primary-500 pl-6">
                <h4 className="font-medium text-gray-900 mb-2">
                  Question {index + 1}
                </h4>
                <p className="text-gray-700 mb-3">{response.question}</p>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-success-500" />
                  <span className="text-success-800 font-medium">{response.answer}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getCareerTypeColor(response.category)}`}>
                    {response.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <button
            onClick={handleDownloadReport}
            disabled={downloadingPDF}
            className="btn-primary flex items-center space-x-2 w-full sm:w-auto"
          >
            {downloadingPDF ? (
              <LoadingSpinner size="sm" text="" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Download PDF Report</span>
          </button>

          <Link to="/assessment" className="btn-secondary w-full sm:w-auto">
            Retake Assessment
          </Link>
        </div>

        {/* Achievement Badge */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-50 to-primary-100 px-6 py-3 rounded-full">
            <Award className="w-5 h-5 text-primary-600" />
            <span className="text-primary-800 font-medium">Career Explorer Achievement Unlocked!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
