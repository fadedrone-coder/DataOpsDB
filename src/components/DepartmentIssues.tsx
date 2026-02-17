import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Clock, Users } from 'lucide-react';

interface DepartmentIssuesProps {
  departmentSlug: string;
  departmentName: string;
  onNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

const DepartmentIssues: React.FC<DepartmentIssuesProps> = ({
  departmentSlug,
  departmentName,
  onNotification,
}) => {
  const [issues, setIssues] = useState([
    {
      id: 'ISS-001',
      title: `${departmentName}: Data sync delays`,
      description: 'Periodic delays in data synchronization',
      priority: 'high',
      assignee: 'Team Lead',
      dueDate: '2024-02-20',
    },
    {
      id: 'ISS-002',
      title: `${departmentName}: Report generation`,
      description: 'Performance optimization needed',
      priority: 'medium',
      assignee: 'Specialist',
      dueDate: '2024-02-25',
    },
    {
      id: 'ISS-003',
      title: `${departmentName}: User feedback system`,
      description: 'Enhancement request for feedback collection',
      priority: 'low',
      assignee: 'Pending',
      dueDate: '2024-03-01',
    },
  ]);

  const priorityColors = {
    high: 'bg-red-100 text-red-800 border-red-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    low: 'bg-green-100 text-green-800 border-green-300',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Issue Tracker</h2>
        <p className="text-gray-600 mt-1">{departmentName} Department Issues</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Open Issues</p>
              <p className="text-3xl font-bold text-gray-900">8</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-3xl font-bold text-gray-900">3</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-3xl font-bold text-gray-900">42</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {issues.map((issue) => (
          <div key={issue.id} className="bg-white rounded-lg shadow p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900">{issue.id}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${priorityColors[issue.priority]}`}>
                    {issue.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-900 font-medium mt-1">{issue.title}</p>
                <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="text-gray-600">
                  <Users className="h-4 w-4 inline mr-1" />
                  {issue.assignee}
                </span>
                <span className="text-gray-600">Due: {issue.dueDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentIssues;
