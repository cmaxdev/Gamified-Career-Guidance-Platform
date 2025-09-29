import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI, downloadFile } from '../../utils/api';
import { AdminDashboard as AdminDashboardType } from '../../types';
import { formatDate, getCareerTypeColor } from '../../utils/auth';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Download,
  FileText,
  BarChart3,
  Activity,
  Calendar,
  Trophy
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<AdminDashboardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloadingBulk, setDownloadingBulk] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboard();
      setDashboardData(response.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadBulkReports = async () => {
    setDownloadingBulk(true);
    try {
      const response = await adminAPI.downloadBulkReports('completed');
      const filename = `career-reports-bulk-${new Date().toISOString().split('T')[0]}.zip`;
      downloadFile(response.data, filename);
    } catch (err) {
      console.error('Bulk download failed:', err);
    } finally {
      setDownloadingBulk(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading dashboard..." />;
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="card max-w-md text-center">
          <div className="text-red-600 mb-4">
            <BarChart3 className="w-12 h-12 mx-auto mb-3" />
            <p>{error || 'Failed to load dashboard'}</p>
          </div>
          <button 
            onClick={fetchDashboardData}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { statistics, recentActivity } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Monitor student progress and manage assessments
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleDownloadBulkReports}
                disabled={downloadingBulk || statistics.completedAssessments === 0}
                className="btn-primary flex items-center space-x-2"
              >
                {downloadingBulk ? (
                  <LoadingSpinner size="sm" text="" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>Download All Reports</span>
              </button>
              <Link to="/admin/students" className="btn-secondary">
                View All Students
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Students */}
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.totalStudents}</p>
              </div>
            </div>
          </div>

          {/* Completed Assessments */}
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-success-100 text-success-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.completedAssessments}</p>
              </div>
            </div>
          </div>

          {/* Pending Assessments */}
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-warning-100 text-warning-600 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.pendingAssessments}</p>
              </div>
            </div>
          </div>

          {/* Completion Rate */}
          <div className="card">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.completionRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Completion Progress */}
          <div className="lg:col-span-2 card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Assessment Progress</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Completed Assessments</span>
                  <span>{statistics.completedAssessments} / {statistics.totalStudents}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill bg-success-500" 
                    style={{ width: `${statistics.completionRate}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Pending Assessments</span>
                  <span>{statistics.pendingAssessments} remaining</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill bg-warning-500" 
                    style={{ width: `${100 - statistics.completionRate}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h4>
              <div className="flex flex-wrap gap-2">
                <Link to="/admin/students?status=pending" className="btn-secondary text-sm">
                  View Pending Students
                </Link>
                <Link to="/admin/students?status=completed" className="btn-secondary text-sm">
                  View Completed Students
                </Link>
                <button
                  onClick={handleDownloadBulkReports}
                  disabled={downloadingBulk || statistics.completedAssessments === 0}
                  className="btn-secondary text-sm flex items-center space-x-1"
                >
                  <FileText className="w-3 h-3" />
                  <span>Export Reports</span>
                </button>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Key Metrics</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-medium text-primary-900">Avg. Completion Time</span>
                </div>
                <span className="text-primary-700 font-bold">~5 min</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-success-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-success-600" />
                  <span className="text-sm font-medium text-success-900">Success Rate</span>
                </div>
                <span className="text-success-700 font-bold">100%</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">This Month</span>
                </div>
                <span className="text-blue-700 font-bold">{statistics.completedAssessments}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Assessments</h3>
            <Link to="/admin/students" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View all →
            </Link>
          </div>

          {recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No recent assessments</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Career Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentActivity.slice(0, 5).map((result) => (
                    <tr key={result._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {result.user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {result.user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          getCareerTypeColor(result.careerProfile.dominantType)
                        }`}>
                          {result.careerProfile.dominantType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(result.completedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link 
                          to={`/admin/students/${result.user.id}`}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
