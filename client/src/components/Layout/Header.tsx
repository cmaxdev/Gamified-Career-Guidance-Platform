import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { calculateLevelInfo } from '../../utils/auth';
import { User, LogOut, Trophy, Zap } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const levelInfo = calculateLevelInfo(user.experience);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">CareerQuest</span>
            </Link>
          </div>

          {/* User Info & Progress */}
          <div className="flex items-center space-x-6">
            {user.role === 'student' && (
              <div className="hidden md:flex items-center space-x-4">
                {/* Level Badge */}
                <div className="level-badge">
                  <Trophy className="w-3 h-3 mr-1" />
                  Level {levelInfo.current}
                </div>

                {/* Experience Badge */}
                <div className="experience-badge">
                  <Zap className="w-3 h-3 mr-1" />
                  {user.experience} XP
                </div>

                {/* Progress Bar */}
                <div className="flex items-center space-x-2">
                  <div className="progress-bar w-20">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${levelInfo.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    {levelInfo.experienceToNext} to next
                  </span>
                </div>
              </div>
            )}

            {/* User Menu */}
            <div className="relative">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:block">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
