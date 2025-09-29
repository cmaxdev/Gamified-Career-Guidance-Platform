import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { assessmentAPI } from '../../utils/api';
import { AssessmentQuestion, AssessmentResponse } from '../../types';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  PlayCircle, 
  Trophy,
  Target,
  Lightbulb,
  Clock
} from 'lucide-react';

const Assessment: React.FC = () => {
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState('');

  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.assessmentCompleted) {
      navigate('/results');
      return;
    }

    fetchQuestions();
  }, [user, navigate]);

  const fetchQuestions = async () => {
    try {
      const response = await assessmentAPI.getQuestions();
      setQuestions(response.data.questions);
    } catch (err) {
      setError('Failed to load assessment questions');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (optionText: string, category: string) => {
    setSelectedOption(optionText);
    
    // Update or add response
    const newResponse: AssessmentResponse = {
      questionId: questions[currentQuestion].id,
      answer: optionText,
      category
    };

    setResponses(prev => {
      const existingIndex = prev.findIndex(r => r.questionId === questions[currentQuestion].id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newResponse;
        return updated;
      }
      return [...prev, newResponse];
    });
  };

  const handleNext = () => {
    if (!selectedOption) return;

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      // Check if next question has a response
      const nextResponse = responses.find(r => r.questionId === questions[currentQuestion + 1].id);
      setSelectedOption(nextResponse?.answer || '');
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      // Load previous response
      const prevResponse = responses.find(r => r.questionId === questions[currentQuestion - 1].id);
      setSelectedOption(prevResponse?.answer || '');
    }
  };

  const handleSubmit = async () => {
    if (responses.length !== questions.length) {
      setError('Please answer all questions');
      return;
    }

    setSubmitting(true);

    try {
      const response = await assessmentAPI.submitAssessment(responses);
      
      // Update user with new experience and level
      if (user) {
        const updatedUser = {
          ...user,
          assessmentCompleted: true,
          experience: response.data.totalExperience,
          level: response.data.newLevel
        };
        updateUser(updatedUser);
      }

      navigate('/results', { 
        state: { 
          justCompleted: true,
          experienceGained: response.data.experienceGained 
        }
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit assessment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading assessment..." />;
  }

  if (error && questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card max-w-md">
          <div className="text-center text-red-600 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full mx-auto mb-3 flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <p>{error}</p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="btn-primary w-full"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="card text-center">
            <div className="w-20 h-20 bg-primary-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Target className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Career Discovery Assessment
            </h1>
            
            <p className="text-gray-600 mb-8">
              Discover your career path through our interactive assessment. This will help identify 
              your strengths, interests, and ideal career matches.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <Clock className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">5 Minutes</h3>
                <p className="text-sm text-gray-600">Quick and easy</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <Lightbulb className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">3 Questions</h3>
                <p className="text-sm text-gray-600">Focused assessment</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <Trophy className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">+150 XP</h3>
                <p className="text-sm text-gray-600">Level up reward</p>
              </div>
            </div>

            <div className="bg-primary-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-primary-900 mb-3">What you'll discover:</h3>
              <ul className="text-sm text-primary-800 space-y-2 text-left">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-primary-600" />
                  <span>Your dominant career personality type</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-primary-600" />
                  <span>Top 3 recommended career paths</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-primary-600" />
                  <span>Your key strengths and talents</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-primary-600" />
                  <span>Suggested areas of study</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-primary-600" />
                  <span>Downloadable PDF report</span>
                </li>
              </ul>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/')}
                className="btn-secondary flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </button>
              
              <button
                onClick={() => setStarted(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Start Assessment</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Career Assessment</h1>
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="progress-bar">
            <div 
              className="progress-fill transition-all duration-500" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="card mb-8">
          <div className="animate-fadeIn">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {currentQ.question}
            </h2>

            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(option.text, option.category)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    selectedOption === option.text
                      ? 'border-primary-500 bg-primary-50 text-primary-900'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedOption === option.text
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedOption === option.text && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                    <span className="text-sm font-medium">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`btn-secondary flex items-center space-x-2 ${
              currentQuestion === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="text-sm text-gray-500">
            {responses.length} of {questions.length} answered
          </div>

          <button
            onClick={handleNext}
            disabled={!selectedOption || submitting}
            className={`btn-primary flex items-center space-x-2 ${
              !selectedOption || submitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {submitting ? (
              <LoadingSpinner size="sm" text="" />
            ) : (
              <>
                <span>
                  {currentQuestion === questions.length - 1 ? 'Complete' : 'Next'}
                </span>
                {currentQuestion < questions.length - 1 && (
                  <ArrowRight className="w-4 h-4" />
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
