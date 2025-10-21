import React, { useState, useEffect } from 'react';
import { Target, Plus, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  target_value: number;
  current_value: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'at_risk';
  start_date: string;
  end_date: string;
  created_at: string;
}

interface GoalTrackingProps {
  onNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  currentUser: string;
  teamMembers: Array<{ id: string; name: string; role: string; avatar: string }>;
}

const GoalTracking: React.FC<GoalTrackingProps> = ({ onNotification, currentUser, teamMembers }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly'>('weekly');
  const [viewMode, setViewMode] = useState<'my' | 'team'>('my');

  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    type: 'weekly' as const,
    target_value: 0,
  });

  useEffect(() => {
    loadMockGoals();
  }, []);

  const loadMockGoals = () => {
    const mockGoals: Goal[] = [
      {
        id: '1',
        user_id: currentUser,
        title: 'Map 50 Healthcare Providers',
        description: 'Complete mapping for Kenya insurers',
        type: 'weekly',
        target_value: 50,
        current_value: 32,
        status: 'in_progress',
        start_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        user_id: currentUser,
        title: 'Review 200 Claims',
        description: 'Process pending claims for UAP Old Mutual',
        type: 'weekly',
        target_value: 200,
        current_value: 180,
        status: 'in_progress',
        start_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
      },
      {
        id: '3',
        user_id: currentUser,
        title: 'Group 100 Care Items',
        description: 'Monthly target for care item categorization',
        type: 'monthly',
        target_value: 100,
        current_value: 45,
        status: 'at_risk',
        start_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
      },
    ];
    setGoals(mockGoals);
  };

  const addGoal = () => {
    if (!newGoal.title || newGoal.target_value <= 0) {
      onNotification('Please fill in all required fields', 'error');
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      user_id: currentUser,
      title: newGoal.title,
      description: newGoal.description,
      type: newGoal.type,
      target_value: newGoal.target_value,
      current_value: 0,
      status: 'not_started',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + (newGoal.type === 'daily' ? 1 : newGoal.type === 'weekly' ? 7 : newGoal.type === 'monthly' ? 30 : 90) * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
    };

    setGoals([...goals, goal]);
    setShowAddModal(false);
    setNewGoal({ title: '', description: '', type: 'weekly', target_value: 0 });
    onNotification('Goal created successfully!', 'success');
  };

  const updateGoalProgress = (goalId: string, value: number) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const newValue = Math.min(value, goal.target_value);
        const percentage = (newValue / goal.target_value) * 100;
        let newStatus: Goal['status'] = 'in_progress';

        if (percentage >= 100) {
          newStatus = 'completed';
        } else if (percentage < 50) {
          const daysLeft = Math.ceil((new Date(goal.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          if (daysLeft <= 2) newStatus = 'at_risk';
        }

        return { ...goal, current_value: newValue, status: newStatus };
      }
      return goal;
    }));
    onNotification('Progress updated!', 'success');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'at_risk':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'at_risk':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Target className="h-5 w-5 text-gray-600" />;
    }
  };

  const filteredGoals = goals.filter(g =>
    (selectedType === 'daily' || g.type === selectedType) &&
    (viewMode === 'my' ? g.user_id === currentUser : true)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Goals & OKRs</h2>
          <p className="text-gray-600">Track and manage your objectives</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Goal
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
          {(['daily', 'weekly', 'monthly', 'quarterly'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                selectedType === type
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
          <button
            onClick={() => setViewMode('my')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'my'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            My Goals
          </button>
          <button
            onClick={() => setViewMode('team')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'team'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Team Goals
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGoals.map((goal) => {
          const percentage = Math.round((goal.current_value / goal.target_value) * 100);
          const daysLeft = Math.ceil((new Date(goal.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

          return (
            <div key={goal.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{goal.title}</h3>
                  <p className="text-sm text-gray-600">{goal.description}</p>
                </div>
                {getStatusIcon(goal.status)}
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-semibold text-gray-900">{percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      percentage >= 100 ? 'bg-green-600' :
                      percentage >= 70 ? 'bg-blue-600' :
                      percentage >= 40 ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-sm">
                  <span className="text-gray-600">Current: </span>
                  <span className="font-semibold text-gray-900">{goal.current_value}</span>
                  <span className="text-gray-600"> / {goal.target_value}</span>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(goal.status)}`}>
                  {goal.status.replace('_', ' ')}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}</span>
                <span className="capitalize">{goal.type}</span>
              </div>

              {goal.user_id === currentUser && (
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    max={goal.target_value}
                    value={goal.current_value}
                    onChange={(e) => updateGoalProgress(goal.id, parseInt(e.target.value) || 0)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <button
                    onClick={() => updateGoalProgress(goal.id, goal.target_value)}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                  >
                    Complete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Create New Goal</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., Map 50 Providers"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Add details about this goal..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newGoal.type}
                  onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Value</label>
                <input
                  type="number"
                  value={newGoal.target_value || ''}
                  onChange={(e) => setNewGoal({ ...newGoal, target_value: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., 50"
                  min="1"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addGoal}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalTracking;
