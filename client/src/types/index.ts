// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  level: number;
  experience: number;
  assessmentCompleted: boolean;
  assessmentResult?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

// Assessment types
export interface AssessmentQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    category: string;
  }[];
}

export interface AssessmentResponse {
  questionId: number;
  answer: string;
  category: string;
}

export interface CareerProfile {
  dominantType: string;
  strengths: string[];
  recommendedCareers: {
    title: string;
    description: string;
    matchPercentage: number;
  }[];
  suggestedStudyAreas: string[];
}

export interface AssessmentResult {
  _id: string;
  user: User;
  responses: {
    question: string;
    answer: string;
    category: string;
  }[];
  careerProfile: CareerProfile;
  experienceGained: number;
  completedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  message: string;
  data?: T;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface AssessmentSubmitResponse {
  message: string;
  result: AssessmentResult;
  experienceGained: number;
  newLevel: number;
  totalExperience: number;
}

// Admin types
export interface AdminDashboard {
  statistics: {
    totalStudents: number;
    completedAssessments: number;
    pendingAssessments: number;
    completionRate: number;
  };
  recentActivity: AssessmentResult[];
}

export interface StudentListResponse {
  students: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalStudents: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Game-like types
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface LevelInfo {
  current: number;
  experience: number;
  experienceToNext: number;
  percentage: number;
}
