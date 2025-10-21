import React, { useState, useEffect } from 'react';
import { Plus, Download, Filter, Search, Settings, Calendar, TrendingUp, Database, User } from 'lucide-react';
import { TEAM_MEMBERS, GLOBAL_METRIC_TYPES, GLOBAL_INSURERS } from '../App';

interface Metric {
  id: string;
  date: string;
  metricType: string;
  value: number;
  user: string;
  insurer?: string;
}

interface MetricsDashboardProps {
  onNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error', from?: string) => void;
  currentUser: string;
  teamMembers: TeamMember[];
  onAddUser: (users: TeamMember[]) => void;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

// Sample data with today's date
const getTodaysDate = () => new Date().toISOString().split('T')[0];

const INITIAL_METRICS: Metric[] = [
  {
    id: '1',
    date: getTodaysDate(),
    metricType: 'Number of Providers Mapped',
    value: 0,
    user: 'system',
  },
  {
    id: '2',
    date: getTodaysDate(),
    metricType: 'Number of Care items Mapped',
    value: 0,
    user: 'system',
  },
  {
    id: '3',
    date: getTodaysDate(),
    metricType: 'Claims piles checked',
    value: 0,
    user: 'system',
    insurer: 'Kenya'
  },
  // Add more initial metrics as needed
];

const MetricsDashboard: React.FC<MetricsDashboardProps> = ({ onNotification, currentUser, teamMembers, onAddUser }) => {
  const [metrics, setMetrics] = useState<Metric[]>(INITIAL_METRICS);
  const [filteredMetrics, setFilteredMetrics] = useState<Metric[]>(INITIAL_METRICS);
  const [showForm, setShowForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [metricFilter, setMetricFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [newMetric, setNewMetric] = useState({
    date: getTodaysDate(),
    metricType: '',
    value: '',
    insurer: ''
  });
  const [newMetricType, setNewMetricType] = useState('');
  const [newInsurer, setNewInsurer] = useState('');
  const [showAddMetricType, setShowAddMetricType] = useState(false);
  const [showAddInsurer, setShowAddInsurer] = useState(false);
  const [metricTypes, setMetricTypes] = useState<string[]>(GLOBAL_METRIC_TYPES);
  const [insurers, setInsurers] = useState<string[]>(GLOBAL_INSURERS);
  const [newUser, setNewUser] = useState({
    name: '',
    role: '',
    avatar: '👤'
  });

  // Apply filters
  useEffect(() => {
    let filtered = metrics;
    
    if (searchTerm) {
      filtered = filtered.filter(metric => 
        metric.metricType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        metric.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (metric.insurer && metric.insurer.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (dateFilter !== 'all') {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
      
      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(metric => metric.date === today);
          break;
        case 'yesterday':
          filtered = filtered.filter(metric => metric.date === yesterday);
          break;
        case 'week':
          filtered = filtered.filter(metric => metric.date >= weekAgo);
          break;
      }
    }
    
    if (metricFilter !== 'all') {
      filtered = filtered.filter(metric => metric.metricType === metricFilter);
    }
    
    if (userFilter !== 'all') {
      filtered = filtered.filter(metric => metric.user === userFilter);
    }
    
    setFilteredMetrics(filtered);
  }, [metrics, searchTerm, dateFilter, metricFilter, userFilter, teamMembers]);

  // Initialize today's metrics for all types
  useEffect(() => {
    const today = getTodaysDate();
    const todaysMetrics = metrics.filter(m => m.date === today);
    
    // Add missing metric types for today
    metricTypes.forEach(metricType => {
      const exists = todaysMetrics.some(m => m.metricType === metricType);
      if (!exists) {
        const newMetric: Metric = {
          id: `${Date.now()}-${metricType}`,
          date: today,
          metricType,
          value: 0,
          user: 'system',
          insurer: metricType === 'Claims piles checked' ? 'Kenya' : undefined
        };
        setMetrics(prev => [...prev, newMetric]);
      }
    });
  }, [metricTypes]);

  const handleSubmitMetric = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMetric.metricType || !newMetric.value) {
      onNotification('Please fill in all required fields', 'error');
      return;
    }

    const metric: Metric = {
      id: Date.now().toString(),
      date: newMetric.date,
      metricType: newMetric.metricType,
      value: parseInt(newMetric.value),
      user: currentUser,
      insurer: newMetric.metricType === 'Claims piles checked' ? newMetric.insurer : undefined
    };

    setMetrics(prev => [...prev, metric]);
    setNewMetric({
      date: getTodaysDate(),
      metricType: '',
      value: '',
      insurer: ''
    });
    setShowForm(false);
    onNotification('Metric added successfully', 'success');
  };

  const addNewMetricType = () => {
    if (newMetricType && !metricTypes.includes(newMetricType)) {
      setMetricTypes([...metricTypes, newMetricType]);
      setNewMetricType('');
      onNotification(`New metric type "${newMetricType}" added globally`, 'success');
    }
  };

  const addNewInsurer = () => {
    if (newInsurer && !insurers.includes(newInsurer)) {
      setInsurers([...insurers, newInsurer]);
      setNewInsurer('');
      onNotification(`New insurer "${newInsurer}" added globally`, 'success');
    }
  };

  const addNewUser = () => {
    if (newUser.name && newUser.role) {
      const userId = newUser.name.toLowerCase().replace(/\s+/g, '');
      const userExists = teamMembers.some(member => member.id === userId);
      
      if (userExists) {
        onNotification('User with this name already exists', 'error');
        return;
      }
      
      const newTeamMember = {
        id: userId,
        name: newUser.name,
        role: newUser.role,
        avatar: newUser.avatar
      };
      
      onAddUser([...teamMembers, newTeamMember]);
      setNewUser({ name: '', role: '', avatar: '👤' });
      setShowAddUser(false);
      onNotification(`New user "${newUser.name}" added to the team`, 'success');
    }
  };
  const exportMetrics = () => {
    const csvContent = [
      ['Date', 'Metric Type', 'Value', 'User', 'Insurer'],
      ...filteredMetrics.map(m => [m.date, m.metricType, m.value.toString(), m.user, m.insurer || ''])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `metrics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    onNotification('Metrics data exported successfully', 'success');
  };

  const getMetricSummary = () => {
    const today = getTodaysDate();
    const todaysMetrics = metrics.filter(m => m.date === today && m.user !== 'system');
    const totalValue = todaysMetrics.reduce((sum, m) => sum + m.value, 0);
    
    return {
      totalMetrics: todaysMetrics.length,
      totalValue,
      myMetrics: todaysMetrics.filter(m => m.user === currentUser).length
    };
  };

  const currentUserName = TEAM_MEMBERS.find(member => member.id === currentUser)?.name || currentUser;
  const summary = getMetricSummary();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Database className="h-6 w-6 mr-2 text-blue-600" />
            Daily Metrics Dashboard - {currentUserName}
          </h1>
          <p className="text-gray-600 mt-1">Track daily metrics • Today: {summary.myMetrics} entries • Total value: {summary.totalValue}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </button>
          <button
            onClick={() => setShowAddUser(!showAddUser)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <User className="h-4 w-4 mr-2" />
            Add User
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Metric
          </button>
          <button
            onClick={exportMetrics}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Global Settings (Admin: {currentUser === 'muyiwa' ? 'Enabled' : 'View Only'})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Add New Metric Type</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMetricType}
                  onChange={(e) => setNewMetricType(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter new metric type..."
                  disabled={currentUser !== 'muyiwa'}
                />
                <button
                  onClick={addNewMetricType}
                  disabled={currentUser !== 'muyiwa'}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  Add
                </button>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Add New Insurer</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newInsurer}
                  onChange={(e) => setNewInsurer(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter new insurer..."
                  disabled={currentUser !== 'muyiwa'}
                />
                <button
                  onClick={addNewInsurer}
                  disabled={currentUser !== 'muyiwa'}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          {currentUser !== 'muyiwa' && (
            <p className="text-sm text-gray-500 mt-4">ℹ️ Only Muyiwa (Team Lead) can add new metric types and insurers</p>
          )}
        </div>
      )}

      {/* Metric Entry Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Add New Metric</h3>
          <form onSubmit={handleSubmitMetric} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={newMetric.date}
                  onChange={(e) => setNewMetric({...newMetric, date: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Metric Type</label>
                <div className="space-y-2">
                  <select
                    value={newMetric.metricType}
                    onChange={(e) => setNewMetric({...newMetric, metricType: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select metric type...</option>
                    {metricTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowAddMetricType(!showAddMetricType)}
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    + Add new metric type
                  </button>
                  {showAddMetricType && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMetricType}
                        onChange={(e) => setNewMetricType(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter new metric type..."
                      />
                      <button
                        type="button"
                        onClick={addNewMetricType}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {newMetric.metricType === 'Claims piles checked' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Insurer</label>
                  <div className="space-y-2">
                    <select
                      value={newMetric.insurer}
                      onChange={(e) => setNewMetric({...newMetric, insurer: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select insurer...</option>
                      {insurers.map(insurer => (
                        <option key={insurer} value={insurer}>{insurer}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowAddInsurer(!showAddInsurer)}
                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      + Add new insurer
                    </button>
                    {showAddInsurer && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newInsurer}
                          onChange={(e) => setNewInsurer(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter new insurer..."
                        />
                        <button
                          type="button"
                          onClick={addNewInsurer}
                          className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
                <input
                  type="number"
                  value={newMetric.value}
                  onChange={(e) => setNewMetric({...newMetric, value: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter value"
                  required
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Metric
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search metrics..."
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">Last 7 Days</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Metric Type</label>
            <select
              value={metricFilter}
              onChange={(e) => setMetricFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Metrics</option>
              {metricTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Users</option>
              {teamMembers.map(member => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Metrics Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insurer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMetrics.map((metric) => (
                <tr key={metric.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(metric.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.metricType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{metric.value}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {teamMembers.find(m => m.id === metric.user)?.name || metric.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{metric.insurer || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {metric.user === currentUser && (
                      <button className="text-blue-600 hover:text-blue-900 transition-colors">
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredMetrics.length === 0 && (
          <div className="text-center py-12">
            <Database className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No metrics found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || dateFilter !== 'all' || metricFilter !== 'all' 
                ? 'Try adjusting your filters.' 
                : 'Add your first metric for today.'}
            </p>
          </div>
        )}
      </div>

      {/* Add User Form */}
      {showAddUser && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Add New Team Member</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter full name..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              >
                <option value="">Select role...</option>
                <option value="Team Lead">Team Lead</option>
                <option value="DataOps Specialist">DataOps Specialist</option>
                <option value="DataOps Intern">DataOps Intern</option>
                <option value="Senior DataOps Specialist">Senior DataOps Specialist</option>
                <option value="DataOps Manager">DataOps Manager</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
              <select
                value={newUser.avatar}
                onChange={(e) => setNewUser({...newUser, avatar: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="👤">👤 Default</option>
                <option value="👨‍💼">👨‍💼 Man Business</option>
                <option value="👩‍💼">👩‍💼 Woman Business</option>
                <option value="👨‍💻">👨‍💻 Man Tech</option>
                <option value="👩‍💻">👩‍💻 Woman Tech</option>
                <option value="👨‍🎓">👨‍🎓 Man Student</option>
                <option value="👩‍🎓">👩‍🎓 Woman Student</option>
                <option value="🧑‍💼">🧑‍💼 Person Business</option>
                <option value="🧑‍💻">🧑‍💻 Person Tech</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={addNewUser}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Add User
            </button>
            <button
              onClick={() => setShowAddUser(false)}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Today's Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <TrendingUp className="h-6 w-6 text-blue-600 mt-1 mr-4 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Today's Progress</h3>
            {summary.myMetrics === 0 && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⏰ You haven't logged any metrics today. Don't forget to track your daily progress!
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{summary.myMetrics}</div>
                <div className="text-sm text-blue-700">My Entries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{summary.totalMetrics}</div>
                <div className="text-sm text-green-700">Team Entries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{summary.totalValue}</div>
                <div className="text-sm text-purple-700">Total Value</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsDashboard;