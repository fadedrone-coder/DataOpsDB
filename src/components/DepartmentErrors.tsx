import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, TrendingDown } from 'lucide-react';

interface DepartmentErrorsProps {
  departmentSlug: string;
  departmentName: string;
  onNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

const DepartmentErrors: React.FC<DepartmentErrorsProps> = ({
  departmentSlug,
  departmentName,
  onNotification,
}) => {
  const [errors, setErrors] = useState([
    {
      id: 1,
      message: `${departmentName}: Data validation error`,
      severity: 'high',
      count: 24,
      trend: -15,
    },
    {
      id: 2,
      message: `${departmentName}: Processing timeout`,
      severity: 'medium',
      count: 8,
      trend: 0,
    },
    {
      id: 3,
      message: `${departmentName}: API rate limit`,
      severity: 'low',
      count: 2,
      trend: 5,
    },
  ]);

  const severityColors = {
    high: 'bg-red-50 border-red-200 text-red-700',
    medium: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    low: 'bg-blue-50 border-blue-200 text-blue-700',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Error Handler</h2>
        <p className="text-gray-600 mt-1">{departmentName} Department Error Tracking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Errors</p>
              <p className="text-3xl font-bold text-gray-900">34</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved Today</p>
              <p className="text-3xl font-bold text-gray-900">12</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Resolution</p>
              <p className="text-3xl font-bold text-gray-900">4h</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {errors.map((error) => (
          <div key={error.id} className={`${severityColors[error.severity]} border rounded-lg p-4`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{error.message}</p>
                <p className="text-sm mt-1 opacity-75">Occurrences: {error.count}</p>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className={`h-4 w-4 ${error.trend < 0 ? 'text-green-600' : 'text-red-600'}`} />
                <span className="text-sm font-medium">{error.trend > 0 ? '+' : ''}{error.trend}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentErrors;
