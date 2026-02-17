import React, { useState } from 'react';
import { Plus, Target, TrendingUp } from 'lucide-react';

interface DepartmentGoalsProps {
  departmentSlug: string;
  departmentName: string;
  metricTypes?: string[];
  onNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

const DepartmentGoals: React.FC<DepartmentGoalsProps> = ({
  departmentSlug,
  departmentName,
  onNotification,
}) => {
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: `${departmentName} Q1 Goals`,
      description: 'Strategic objectives for Q1',
      status: 'active',
      progress: 65,
    },
    {
      id: 2,
      title: `${departmentName} Performance Target`,
      description: 'Achieve 95% SLA compliance',
      status: 'active',
      progress: 82,
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Goals & OKRs</h2>
          <p className="text-gray-600 mt-1">{departmentName} Department</p>
        </div>
        <button
          onClick={() => onNotification(`New goal created for ${departmentName}`, 'success')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
              </div>
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div className="mt-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-bold text-blue-600">{goal.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <TrendingUp className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900">Goal Setting Tips</h3>
            <p className="text-sm text-blue-700 mt-2">
              For {departmentName}: Create specific, measurable objectives that align with company strategy.
              Review progress monthly and adjust as needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentGoals;
