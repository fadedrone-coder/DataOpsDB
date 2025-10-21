import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Calendar, BarChart3, Download, Filter, User } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface Metric {
  id: string;
  date: string;
  metricType: string;
  value: number;
  user: string;
  insurer?: string;
}

interface TeamAnalyticsProps {
  onNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error', from?: string) => void;
  currentUser: string;
  teamMembers: TeamMember[];
}

// Sample metrics data for analytics
const SAMPLE_METRICS: Metric[] = [
  // Today's data
  { id: '1', date: new Date().toISOString().split('T')[0], metricType: 'Claims piles checked', value: 45, user: 'sophie', insurer: 'Uganda' },
  { id: '2', date: new Date().toISOString().split('T')[0], metricType: 'Claims piles checked', value: 32, user: 'emmanuel', insurer: 'Uganda' },
  { id: '3', date: new Date().toISOString().split('T')[0], metricType: 'Number of Providers Mapped', value: 12, user: 'daniel' },
  { id: '4', date: new Date().toISOString().split('T')[0], metricType: 'Number of Care items Mapped', value: 28, user: 'hope' },
  { id: '5', date: new Date().toISOString().split('T')[0], metricType: 'Claims piles checked', value: 38, user: 'morenikeji', insurer: 'Kenya' },
  
  // Yesterday's data
  { id: '6', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], metricType: 'Claims piles checked', value: 52, user: 'sophie', insurer: 'Uganda' },
  { id: '7', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], metricType: 'Claims piles checked', value: 41, user: 'emmanuel', insurer: 'Tanzania' },
  { id: '8', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], metricType: 'Number of ICD-10 Adjusted', value: 15, user: 'daniel' },
  
  // Week ago data
  { id: '9', date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0], metricType: 'Claims piles checked', value: 67, user: 'hope', insurer: 'Uganda' },
  { id: '10', date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0], metricType: 'Number of Providers Mapped', value: 23, user: 'morenikeji' },
];

const TeamAnalytics: React.FC<TeamAnalyticsProps> = ({ onNotification, currentUser, teamMembers }) => {
  const [metrics, setMetrics] = useState<Metric[]>(SAMPLE_METRICS);
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [selectedInsurer, setSelectedInsurer] = useState('all');
  const [dateRange, setDateRange] = useState('week'); // today, week, month, quarter, year
  const [selectedUser, setSelectedUser] = useState('all');

  // Get unique metric types and insurers from data
  const metricTypes = [...new Set(metrics.map(m => m.metricType))];
  const insurers = [...new Set(metrics.filter(m => m.insurer).map(m => m.insurer!))];

  // Filter metrics based on selections
  const getFilteredMetrics = () => {
    let filtered = [...metrics];
    
    // Date range filter
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    switch (dateRange) {
      case 'today':
        filtered = filtered.filter(m => m.date === today);
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        filtered = filtered.filter(m => m.date >= weekAgo);
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        filtered = filtered.filter(m => m.date >= monthAgo);
        break;
      case 'quarter':
        const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        filtered = filtered.filter(m => m.date >= quarterAgo);
        break;
      case 'year':
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        filtered = filtered.filter(m => m.date >= yearAgo);
        break;
    }
    
    // Other filters
    if (selectedMetric !== 'all') {
      filtered = filtered.filter(m => m.metricType === selectedMetric);
    }
    
    if (selectedInsurer !== 'all') {
      filtered = filtered.filter(m => m.insurer === selectedInsurer);
    }
    
    if (selectedUser !== 'all') {
      filtered = filtered.filter(m => m.user === selectedUser);
    }
    
    return filtered;
  };

  // Calculate analytics
  const getAnalytics = () => {
    const filtered = getFilteredMetrics();
    
    // Individual user stats
    const userStats = teamMembers.map(member => {
      const userMetrics = filtered.filter(m => m.user === member.id);
      const totalValue = userMetrics.reduce((sum, m) => sum + m.value, 0);
      const uniqueMetrics = new Set(userMetrics.map(m => m.metricType)).size;
      const uniqueInsurers = new Set(userMetrics.filter(m => m.insurer).map(m => m.insurer)).size;
      
      return {
        user: member,
        totalValue,
        entriesCount: userMetrics.length,
        uniqueMetrics,
        uniqueInsurers,
        avgValue: userMetrics.length > 0 ? Math.round(totalValue / userMetrics.length) : 0
      };
    }).filter(stat => stat.entriesCount > 0);
    
    // Team totals
    const teamTotal = filtered.reduce((sum, m) => sum + m.value, 0);
    const teamEntries = filtered.length;
    
    // Metric breakdown
    const metricBreakdown = metricTypes.map(metricType => {
      const metricData = filtered.filter(m => m.metricType === metricType);
      const contributors = new Set(metricData.map(m => m.user)).size;
      const totalValue = metricData.reduce((sum, m) => sum + m.value, 0);
      
      return {
        metricType,
        totalValue,
        contributors,
        entries: metricData.length,
        avgValue: metricData.length > 0 ? Math.round(totalValue / metricData.length) : 0
      };
    }).filter(metric => metric.entries > 0);
    
    // Insurer breakdown (for claims piles checked)
    const insurerBreakdown = insurers.map(insurer => {
      const insurerData = filtered.filter(m => m.insurer === insurer);
      const contributors = new Set(insurerData.map(m => m.user)).size;
      const totalValue = insurerData.reduce((sum, m) => sum + m.value, 0);
      
      return {
        insurer,
        totalValue,
        contributors,
        entries: insurerData.length,
        avgValue: insurerData.length > 0 ? Math.round(totalValue / insurerData.length) : 0
      };
    }).filter(ins => ins.entries > 0);
    
    return {
      userStats: userStats.sort((a, b) => b.totalValue - a.totalValue),
      teamTotal,
      teamEntries,
      metricBreakdown: metricBreakdown.sort((a, b) => b.totalValue - a.totalValue),
      insurerBreakdown: insurerBreakdown.sort((a, b) => b.totalValue - a.totalValue)
    };
  };

  const exportAnalytics = () => {
    const analytics = getAnalytics();
    const csv = [
      ['User Analytics'],
      ['User', 'Total Value', 'Entries', 'Unique Metrics', 'Avg Value'],
      ...analytics.userStats.map(stat => [
        stat.user.name,
        stat.totalValue,
        stat.entriesCount,
        stat.uniqueMetrics,
        stat.avgValue
      ]),
      [''],
      ['Metric Breakdown'],
      ['Metric Type', 'Total Value', 'Contributors', 'Entries', 'Avg Value'],
      ...analytics.metricBreakdown.map(metric => [
        metric.metricType,
        metric.totalValue,
        metric.contributors,
        metric.entries,
        metric.avgValue
      ]),
      [''],
      ['Insurer Breakdown'],
      ['Insurer', 'Total Value', 'Contributors', 'Entries', 'Avg Value'],
      ...analytics.insurerBreakdown.map(ins => [
        ins.insurer,
        ins.totalValue,
        ins.contributors,
        ins.entries,
        ins.avgValue
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `team-analytics-${dateRange}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    onNotification('Analytics data exported successfully', 'success');
  };

  const currentUserName = teamMembers.find(member => member.id === currentUser)?.name || currentUser;
  const analytics = getAnalytics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-indigo-600" />
            Team Analytics - {currentUserName}
          </h1>
          <p className="text-gray-600 mt-1">Individual and team performance metrics analysis</p>
        </div>
        <button
          onClick={exportAnalytics}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Analytics
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 90 Days</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Metric Type</label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Metrics</option>
              {metricTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Insurer</label>
            <select
              value={selectedInsurer}
              onChange={(e) => setSelectedInsurer(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Insurers</option>
              {insurers.map(insurer => (
                <option key={insurer} value={insurer}>{insurer}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Team Member</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Members</option>
              {teamMembers.map(member => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedMetric('all');
                setSelectedInsurer('all');
                setSelectedUser('all');
                setDateRange('week');
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Value</dt>
                <dd className="text-lg font-medium text-gray-900">{analytics.teamTotal.toLocaleString()}</dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Entries</dt>
                <dd className="text-lg font-medium text-gray-900">{analytics.teamEntries}</dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <User className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Active Members</dt>
                <dd className="text-lg font-medium text-gray-900">{analytics.userStats.length}</dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Avg per Entry</dt>
                <dd className="text-lg font-medium text-gray-900">
                  {analytics.teamEntries > 0 ? Math.round(analytics.teamTotal / analytics.teamEntries) : 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Individual Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Individual Performance Ranking</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entries</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unique Metrics</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insurers</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.userStats.map((stat, index) => (
                <tr key={stat.user.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{stat.user.avatar}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{stat.user.name}</div>
                        <div className="text-sm text-gray-500">{stat.user.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {stat.totalValue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stat.entriesCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stat.uniqueMetrics}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stat.avgValue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stat.uniqueInsurers || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {analytics.userStats.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No data found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or date range.</p>
          </div>
        )}
      </div>

      {/* Metric Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Metric Type Breakdown</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.metricBreakdown.map(metric => (
                <div key={metric.metricType} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{metric.metricType}</div>
                    <div className="text-xs text-gray-500">
                      {metric.contributors} contributor{metric.contributors !== 1 ? 's' : ''} • {metric.entries} entries
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">{metric.totalValue.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Avg: {metric.avgValue}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Insurer Breakdown</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.insurerBreakdown.map(insurer => (
                <div key={insurer.insurer} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{insurer.insurer}</div>
                    <div className="text-xs text-gray-500">
                      {insurer.contributors} contributor{insurer.contributors !== 1 ? 's' : ''} • {insurer.entries} entries
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{insurer.totalValue.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Avg: {insurer.avgValue}</div>
                  </div>
                </div>
              ))}
              {analytics.insurerBreakdown.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No insurer-specific data in selected range</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Notice */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <div className="flex items-start">
          <BarChart3 className="h-5 w-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-indigo-900">Team Analytics Dashboard</h3>
            <p className="text-sm text-indigo-700 mt-1">
              📊 Real-time analytics showing individual and team performance across all metrics. 
              Filter by date range, metric type, insurer, or team member to get detailed insights. 
              Perfect for performance reviews and team optimization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamAnalytics;