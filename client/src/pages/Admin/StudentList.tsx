import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { adminAPI, downloadFile } from '../../utils/api';
import type { User, StudentListResponse } from '../../types';
import { formatDate, getCareerTypeColor, calculateLevelInfo } from '../../utils/auth';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { 
  Users, 
  Search, 
  Filter, 
  Download,
  CheckCircle,
  Clock,
  User as UserIcon,
  Trophy,
  Zap,
  MoreHorizontal,
  Eye,
  FileText,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const StudentList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [studentsData, setStudentsData] = useState<StudentListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadingReport, setDownloadingReport] = useState<string | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents();
  }, [currentPage, statusFilter]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getStudents({
        page: currentPage,
        limit: 10,
        status: statusFilter === 'all' ? undefined : statusFilter
      });
      setStudentsData(response.data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    setSearchParams(status === 'all' ? {} : { status });
  };

  const handleDownloadReport = async (studentId: string, studentName: string) => {
    setDownloadingReport(studentId);
    try {
      const response = await adminAPI.downloadStudentReport(studentId);
      const filename = `career-report-${studentName.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      downloadFile(response.data, filename);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloadingReport(null);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      return;
    }

    setDeletingStudent(studentId);
    try {
      await adminAPI.deleteStudent(studentId);
      fetchStudents(); // Refresh the list
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setDeletingStudent(null);
    }
  };

  const filteredStudents = studentsData?.students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading && !studentsData) {
    return <LoadingSpinner fullScreen text="Loading students..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
              <p className="text-gray-600 mt-2">
                Manage student accounts and assessment progress
              </p>
            </div>
            <Link to="/admin/dashboard" className="btn-secondary">
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="card mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Students</option>
                <option value="completed">Completed Assessment</option>
                <option value="pending">Pending Assessment</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {studentsData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-xl font-bold text-gray-900">{studentsData.pagination.totalStudents}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-success-100 text-success-600 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-xl font-bold text-gray-900">
                    {studentsData.students.filter(s => s.assessmentCompleted).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-warning-100 text-warning-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-xl font-bold text-gray-900">
                    {studentsData.students.filter(s => !s.assessmentCompleted).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Students Table */}
        <div className="card">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" text="Loading students..." />
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">
                  {searchTerm ? 'No students found matching your search.' : 'No students found.'}
                </p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Level & Experience
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assessment Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => {
                    const levelInfo = calculateLevelInfo(student.experience);
                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                              <UserIcon className="w-5 h-5" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {student.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {student.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <span className="level-badge flex items-center space-x-1">
                              <Trophy className="w-3 h-3" />
                              <span>Level {levelInfo.current}</span>
                            </span>
                            <span className="experience-badge flex items-center space-x-1">
                              <Zap className="w-3 h-3" />
                              <span>{student.experience} XP</span>
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.assessmentCompleted ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(student.createdAt || new Date().toISOString())}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/admin/students/${student.id}`}
                              className="text-primary-600 hover:text-primary-700 flex items-center space-x-1"
                            >
                              <Eye className="w-4 h-4" />
                              <span>View</span>
                            </Link>
                            
                            {student.assessmentCompleted && (
                              <button
                                onClick={() => handleDownloadReport(student.id, student.name)}
                                disabled={downloadingReport === student.id}
                                className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                              >
                                {downloadingReport === student.id ? (
                                  <LoadingSpinner size="sm" text="" />
                                ) : (
                                  <FileText className="w-4 h-4" />
                                )}
                                <span>Report</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteStudent(student.id)}
                              disabled={deletingStudent === student.id}
                              className="text-red-600 hover:text-red-700 flex items-center space-x-1"
                            >
                              {deletingStudent === student.id ? (
                                <LoadingSpinner size="sm" text="" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {studentsData && studentsData.pagination.totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={!studentsData.pagination.hasPrev}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={!studentsData.pagination.hasNext}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">
                      {(currentPage - 1) * 10 + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * 10, studentsData.pagination.totalStudents)}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium">
                      {studentsData.pagination.totalStudents}
                    </span>{' '}
                    results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={!studentsData.pagination.hasPrev}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: studentsData.pagination.totalPages }, (_, i) => i + 1)
                      .filter(page => 
                        page === 1 || 
                        page === studentsData.pagination.totalPages || 
                        Math.abs(page - currentPage) <= 1
                      )
                      .map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === currentPage
                              ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                    <button
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      disabled={!studentsData.pagination.hasNext}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentList;
