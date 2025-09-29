import axios, { AxiosResponse } from 'axios';
import { 
  LoginForm, 
  RegisterForm, 
  LoginResponse, 
  User, 
  AssessmentQuestion, 
  AssessmentResponse,
  AssessmentSubmitResponse,
  AssessmentResult,
  AdminDashboard,
  StudentListResponse
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data: RegisterForm): Promise<AxiosResponse<LoginResponse>> =>
    api.post('/auth/register', data),
    
  login: (data: LoginForm): Promise<AxiosResponse<LoginResponse>> =>
    api.post('/auth/login', data),
    
  getProfile: (): Promise<AxiosResponse<{ user: User }>> =>
    api.get('/auth/profile'),
    
  verifyToken: (): Promise<AxiosResponse<{ valid: boolean; user: User }>> =>
    api.get('/auth/verify'),
};

// Assessment APIs
export const assessmentAPI = {
  getQuestions: (): Promise<AxiosResponse<{ questions: AssessmentQuestion[] }>> =>
    api.get('/assessment/questions'),
    
  submitAssessment: (responses: AssessmentResponse[]): Promise<AxiosResponse<AssessmentSubmitResponse>> =>
    api.post('/assessment/submit', { responses }),
    
  getResult: (id: string): Promise<AxiosResponse<{ result: AssessmentResult }>> =>
    api.get(`/assessment/result/${id}`),
    
  getMyResult: (): Promise<AxiosResponse<{ result: AssessmentResult }>> =>
    api.get('/assessment/my-result'),
    
  downloadReport: (id: string): Promise<AxiosResponse<Blob>> =>
    api.get(`/assessment/download-report/${id}`, { responseType: 'blob' }),
};

// Admin APIs
export const adminAPI = {
  getDashboard: (): Promise<AxiosResponse<AdminDashboard>> =>
    api.get('/admin/dashboard'),
    
  getStudents: (params?: { page?: number; limit?: number; status?: string }): Promise<AxiosResponse<StudentListResponse>> =>
    api.get('/admin/students', { params }),
    
  getStudent: (id: string): Promise<AxiosResponse<{ student: User }>> =>
    api.get(`/admin/students/${id}`),
    
  downloadStudentReport: (id: string): Promise<AxiosResponse<Blob>> =>
    api.get(`/admin/students/${id}/report`, { responseType: 'blob' }),
    
  downloadBulkReports: (status?: string): Promise<AxiosResponse<Blob>> =>
    api.get('/admin/reports/bulk', { 
      params: { status },
      responseType: 'blob' 
    }),
    
  deleteStudent: (id: string): Promise<AxiosResponse<{ message: string }>> =>
    api.delete(`/admin/students/${id}`),
    
  getAnalytics: (): Promise<AxiosResponse<any>> =>
    api.get('/admin/analytics/assessments'),
};

// Utility functions
export const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export default api;
