import type { User, LevelInfo } from '../types';

export const getStoredAuth = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  return {
    token,
    user: user ? JSON.parse(user) : null,
    isAuthenticated: !!token
  };
};

export const setStoredAuth = (token: string, user: User) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearStoredAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const calculateLevelInfo = (experience: number): LevelInfo => {
  const current = Math.floor(experience / 100) + 1;
  const experienceInCurrentLevel = experience % 100;
  const experienceToNext = 100 - experienceInCurrentLevel;
  const percentage = (experienceInCurrentLevel / 100) * 100;

  return {
    current,
    experience: experienceInCurrentLevel,
    experienceToNext,
    percentage
  };
};

export const getCareerTypeColor = (type: string): string => {
  const colors: Record<string, string> = {
    creative: 'bg-purple-100 text-purple-800',
    analytical: 'bg-blue-100 text-blue-800',
    social: 'bg-green-100 text-green-800',
    practical: 'bg-orange-100 text-orange-800',
    technical: 'bg-indigo-100 text-indigo-800',
    leadership: 'bg-red-100 text-red-800'
  };
  
  return colors[type] || 'bg-gray-100 text-gray-800';
};

export const getCareerTypeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    creative: '🎨',
    analytical: '📊',
    social: '🤝',
    practical: '🔧',
    technical: '💻',
    leadership: '👑'
  };
  
  return icons[type] || '⭐';
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (!/[A-Za-z]/.test(password)) {
    errors.push('Password must contain at least one letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
