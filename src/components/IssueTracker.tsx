import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, Clock, AlertTriangle, Filter, Download, Search } from 'lucide-react';
import { TEAM_MEMBERS } from '../App';

interface SlackIssue {
  id: string;
  title: string;
  description: string;
  raisedBy: string;
  raisedAt: Date;
  channel: string;
  participants: string[];
  status: 'open' | 'investigating' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'critical';
  isExternalUser: boolean;
  tags: string[];
  lastActivity: Date;
  resolutionTime?: number; // in minutes
}

interface IssueTrackerProps {
  onNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error', from?: string) => void;
  currentUser: string;
}

const EXTERNAL_USERS = [
  { id: 'ext1', name: 'John Okafor', role: 'Claims Officer', avatar: '👨‍💼' },
  { id: 'ext2', name: 'Sarah Ahmed', role: 'Provider Relations', avatar: '👩‍💼' },
  { id: 'ext3', name: 'Michael Tunde', role: 'IT Support', avatar: '👨‍💻' },
];

const SLACK_CHANNELS = ['#dataops-support', '#claims-issues', '#provider-mapping', '#general-help'];

const INITIAL_ISSUES: SlackIssue[] = [
  {
    id: '1',
    title: 'Provider mapping error for Lagos hospitals',
    description: 'Unable to map new providers in Lagos region. System shows validation error.',
    raisedBy: 'ext1',
    raisedAt: new Date('2025-01-21T09:30:00'),
    channel: '#dataops-support',
    participants: ['sophie', 'emmanuel'],
    status: 'investigating',
    priority: 'high',
    isExternalUser: true,
    tags: ['provider-mapping', 'lagos', 'validation'],
    lastActivity: new Date('2025-01-21T11:45:00')
  },
  {
    id: '2',
    title: 'Claims processing delay for Uganda batch',
    description: 'Uganda claims batch from yesterday is still pending. Need urgent review.',
    raisedBy: 'morenikeji',
    raisedAt: new Date('2025-01-21T08:15:00'),
    channel: '#claims-issues',
    participants: ['muyiwa', 'hope', 'daniel'],
    status: 'resolved',
    priority: 'critical',
    isExternalUser: false,
    tags: ['uganda', 'claims', 'processing'],
    lastActivity: new Date('2025-01-21T14:30:00'),
    resolutionTime: 375 // 6 hours 15 minutes
  },
  {
    id: '3',
    title: 'ICD-10 codes not updating for Jubilee',
    description: 'Recent ICD-10 adjustments are not reflecting in the Jubilee portal.',
    raisedBy: 'ext2',
    raisedAt: new Date('2025-01-21T13:20:00'),
    channel: '#provider-mapping',
    participants: ['daniel', 'intern1'],
    status: 'open',
    priority: 'medium',
    isExternalUser: true,
    tags: ['icd-10', 'jubilee', 'portal'],
    lastActivity: new Date('2025-01-21T13:20:00')
  }
];

const IssueTracker: React.FC<IssueTrackerProps> = ({ onNotification, currentUser }) => {
  const [issues, setIssues] = useState<SlackIssue[]>(INITIAL_ISSUES);
  const [filteredIssues, setFilteredIssues] = useState<SlackIssue[]>(INITIAL_ISSUES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');

  // Apply filters
  useEffect(() => {
    let filtered = [...issues];
    
    if (searchTerm) {
      filtered = filtered.filter(issue => 
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(issue => issue.status === statusFilter);
    }
    
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(issue => issue.priority === priorityFilter);
    }
    
    if (channelFilter !== 'all') {
      filtered = filtered.filter(issue => issue.channel === channelFilter);
    }
    
    setFilteredIssues(filtered);
  }, [issues, searchTerm, statusFilter, priorityFilter, channelFilter]);

  // Simulate real-time Slack issue detection
  useEffect(() => {
    const simulateSlackIssue = () => {
      const isExternal = Math.random() > 0.6;
      const raisedBy = isExternal 
        ? EXTERNAL_USERS[Math.floor(Math.random() * EXTERNAL_USERS.length)].id
        : TEAM_MEMBERS[Math.floor(Math.random() * TEAM_MEMBERS.length)].id;
      
      const titles = [
        'Data sync issue with NOVA database',
        'Provider portal authentication failing',
        'Claims validation rules not working',
        'Bulk upload feature throwing errors',
        'Report generation taking too long',
        'User permissions not updating correctly'
      ];
      
      const newIssue: SlackIssue = {
        id: Date.now().toString(),
        title: titles[Math.floor(Math.random() * titles.length)],
        description: 'Detailed description of the issue would be extracted from Slack message...',
        raisedBy,
        raisedAt: new Date(),
        channel: SLACK_CHANNELS[Math.floor(Math.random() * SLACK_CHANNELS.length)],
        participants: [],
        status: 'open',
        priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
        isExternalUser: isExternal,
        tags: ['auto-detected', 'slack'],
        lastActivity: new Date()
      };
      
      setIssues(prev => [newIssue, ...prev]);
      
      const user = isExternal 
        ? EXTERNAL_USERS.find(u => u.id === raisedBy)
        : TEAM_MEMBERS.find(u => u.id === raisedBy);
      
      onNotification(`🚨 New issue detected: "${newIssue.title}" from ${user?.name}`, 'warning');
    };

    const interval = setInterval(simulateSlackIssue, 120000); // Add new issue every 2 minutes
    return () => clearInterval(interval);
  }, [onNotification]);

  const updateIssueStatus = (issueId: string, newStatus: 'open' | 'investigating' | 'resolved') => {
    setIssues(issues.map(issue => {
      if (issue.id === issueId) {
        const updatedIssue = { ...issue, status: newStatus, lastActivity: new Date() };
        
        if (newStatus === 'resolved' && !issue.resolutionTime) {
          const resolutionTime = Math.floor((new Date().getTime() - issue.raisedAt.getTime()) / (1000 * 60));
          updatedIssue.resolutionTime = resolutionTime;
        }
        
        return updatedIssue;
      }
      return issue;
    }));
    
    const issue = issues.find(i => i.id === issueId);
    if (issue) {
      onNotification(`Issue "${issue.title}" marked as ${newStatus}`, 'info');
    }
  };

  const assignToIssue = (issueId: string, userId: string) => {
    setIssues(issues.map(issue => {
      if (issue.id === issueId) {
        const participants = issue.participants.includes(userId) 
          ? issue.participants 
          : [...issue.participants, userId];
        
        const user = TEAM_MEMBERS.find(m => m.id === userId);
        if (user) {
          onNotification(`📋 You've been assigned to issue: "${issue.title}"`, 'info', user.name);
        }
        
        return { ...issue, participants, lastActivity: new Date() };
      }
      return issue;
    }));
  };

  const exportIssues = () => {
    const csv = [
      ['Title', 'Raised By', 'Channel', 'Status', 'Priority', 'Raised At', 'Resolution Time (min)', 'Participants'],
      ...filteredIssues.map(issue => {
        const raisedBy = issue.isExternalUser 
          ? EXTERNAL_USERS.find(u => u.id === issue.raisedBy)?.name || issue.raisedBy
          : TEAM_MEMBERS.find(u => u.id === issue.raisedBy)?.name || issue.raisedBy;
        
        const participants = issue.participants
          .map(id => TEAM_MEMBERS.find(m => m.id === id)?.name || id)
          .join('; ');
        
        return [
          issue.title,
          raisedBy,
          issue.channel,
          issue.status,
          issue.priority,
          issue.raisedAt.toISOString(),
          issue.resolutionTime || '',
          participants
        ];
      })
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `slack-issues-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    onNotification('Issues data exported successfully', 'success');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getIssueStats = () => {
    const myIssues = issues.filter(i => 
      i.raisedBy === currentUser || i.participants.includes(currentUser)
    );
    
    return {
      total: issues.length,
      open: issues.filter(i => i.status === 'open').length,
      investigating: issues.filter(i => i.status === 'investigating').length,
      resolved: issues.filter(i => i.status === 'resolved').length,
      myIssues: myIssues.length,
      external: issues.filter(i => i.isExternalUser).length
    };
  };

  const currentUserName = TEAM_MEMBERS.find(member => member.id === currentUser)?.name || currentUser;
  const stats = getIssueStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="h-6 w-6 mr-2 text-indigo-600" />
            Slack Issue Tracker - {currentUserName}
          </h1>
          <p className="text-gray-600 mt-1">Monitor and manage issues raised in Slack channels</p>
          <div className="mt-2 text-sm text-indigo-600">
            📋 My involvement: {stats.myIssues} issues • External users: {stats.external} issues
          </div>
        </div>
        <button
          onClick={exportIssues}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Issues
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageCircle className="h-8 w-8 text-gray-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Issues</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Open</dt>
                <dd className="text-lg font-medium text-red-900">{stats.open}</dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Investigating</dt>
                <dd className="text-lg font-medium text-yellow-900">{stats.investigating}</dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Resolved</dt>
                <dd className="text-lg font-medium text-green-900">{stats.resolved}</dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">My Issues</dt>
                <dd className="text-lg font-medium text-blue-900">{stats.myIssues}</dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">🔗</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">External</dt>
                <dd className="text-lg font-medium text-purple-900">{stats.external}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search issues..."
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Channel</label>
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Channels</option>
              {SLACK_CHANNELS.map(channel => (
                <option key={channel} value={channel}>{channel}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Issues Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Raised By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredIssues.map((issue, index) => {
                const raisedBy = issue.isExternalUser 
                  ? EXTERNAL_USERS.find(u => u.id === issue.raisedBy)
                  : TEAM_MEMBERS.find(u => u.id === issue.raisedBy);
                
                return (
                  <tr key={issue.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="text-sm font-medium text-gray-900">{issue.title}</div>
                        <div className="text-sm text-gray-500 truncate">{issue.description}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {issue.tags.map(tag => (
                            <span key={tag} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm">
                        <span className="mr-2">{raisedBy?.avatar}</span>
                        <div>
                          <div className="font-medium text-gray-900">{raisedBy?.name}</div>
                          {issue.isExternalUser && (
                            <div className="text-xs text-purple-600 flex items-center">
                              🔗 External User
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {issue.channel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(issue.status)}`}>
                        {issue.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {issue.participants.map(participantId => {
                          const participant = TEAM_MEMBERS.find(m => m.id === participantId);
                          return participant ? (
                            <span key={participantId} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {participant.avatar} {participant.name}
                            </span>
                          ) : null;
                        })}
                        {issue.participants.length === 0 && (
                          <span className="text-xs text-gray-500">None</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col gap-1">
                        {issue.status !== 'resolved' && (
                          <>
                            <button
                              onClick={() => updateIssueStatus(issue.id, 'investigating')}
                              className="text-yellow-600 hover:text-yellow-900 transition-colors text-xs"
                            >
                              Investigate
                            </button>
                            <button
                              onClick={() => updateIssueStatus(issue.id, 'resolved')}
                              className="text-green-600 hover:text-green-900 transition-colors text-xs"
                            >
                              Resolve
                            </button>
                          </>
                        )}
                        {!issue.participants.includes(currentUser) && (
                          <button
                            onClick={() => assignToIssue(issue.id, currentUser)}
                            className="text-blue-600 hover:text-blue-900 transition-colors text-xs"
                          >
                            Join
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredIssues.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No issues found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' || channelFilter !== 'all'
                ? 'Try adjusting your filters.' 
                : 'Great! No issues to display.'}
            </p>
          </div>
        )}
      </div>

      {/* Slack Integration Notice */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <div className="flex items-start">
          <MessageCircle className="h-5 w-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-indigo-900">Slack Integration Active</h3>
            <p className="text-sm text-indigo-700 mt-1">
              🤖 n8n monitors DataOps channels for issues. Auto-detects problems, tracks participants, 
              logs resolution times, and identifies external users. Weekly summaries sent to team leads.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueTracker;