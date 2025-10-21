import React, { useState, useEffect } from 'react';
import { BarChart3, CheckSquare, AlertTriangle, Plus, Download, Filter, Search, Bell, Calendar, User, Target, TrendingUp, Users, Video, Shield, Zap, Mail } from 'lucide-react';
import MetricsDashboard from './components/MetricsDashboard';
import TaskManagement from './components/TaskManagement';
import ErrorHandler from './components/ErrorHandler';
import TrendAnalysis from './components/TrendAnalysis';
import UserSelection from './components/UserSelection';
import Notifications from './components/Notifications';
import IssueTracker from './components/IssueTracker';
import ClaimsAnalysis from './components/ClaimsAnalysis';
import TeamAnalytics from './components/TeamAnalytics';
import GoalTracking from './components/GoalTracking';
import FirefliesIntegration from './components/FirefliesIntegration';
import AuditTrail from './components/AuditTrail';
import SmartAnalytics from './components/SmartAnalytics';
import CalendarDigests from './components/CalendarDigests';

const tabs = [
  { id: 'metrics', name: 'Metrics Dashboard', icon: BarChart3 },
  { id: 'goals', name: 'Goals & OKRs', icon: Target },
  { id: 'analytics', name: 'Team Analytics', icon: TrendingUp },
  { id: 'smart', name: 'Smart Analytics', icon: Zap },
  { id: 'tasks', name: 'Task Management', icon: CheckSquare },
  { id: 'errors', name: 'Error Handler', icon: AlertTriangle },
  { id: 'trends', name: 'Trend Analysis', icon: BarChart3 },
  { id: 'claims', name: 'Claims Analysis', icon: Target },
  { id: 'issues', name: 'Issue Tracker', icon: Users },
  { id: 'fireflies', name: 'Fireflies', icon: Video },
  { id: 'calendar', name: 'Calendar & Digests', icon: Mail },
  { id: 'audit', name: 'Audit Trail', icon: Shield },
];

export const TEAM_MEMBERS = [
  { id: 'muyiwa', name: 'Muyiwa', role: 'Team Lead', avatar: '👨‍💼' },
  { id: 'sophie', name: 'Sophie', role: 'DataOps Specialist', avatar: '👩‍💻' },
  { id: 'morenikeji', name: 'Morenikeji', role: 'DataOps Specialist', avatar: '👩‍💼' },
  { id: 'emmanuel', name: 'Emmanuel', role: 'DataOps Specialist', avatar: '👨‍💻' },
  { id: 'hope', name: 'Hope', role: 'DataOps Specialist', avatar: '👩‍💻' },
  { id: 'daniel', name: 'Daniel', role: 'DataOps Specialist', avatar: '👨‍💼' },
  { id: 'intern1', name: 'Intern 1', role: 'DataOps Intern', avatar: '👨‍🎓' },
  { id: 'intern2', name: 'Intern 2', role: 'DataOps Intern', avatar: '👩‍🎓' },
];

// Global state for metrics and insurers (in real app, this would be in a database)
export const GLOBAL_METRIC_TYPES = [
  'Number of Providers Mapped',
  'Number of Care items Mapped',
  'Number of Care items Grouped',
  'Claims piles checked',
  'Number of Auto P.A Reviewed/Approved',
  'Number of Flagged Care Items',
  'Number of ICD-10 Adjusted',
  'Num Benefits set up',
  'Providers assigned',
  'Resolved Cares'
];

export const GLOBAL_INSURERS = [
  'Kenya', 'Tanzania', 'Uganda', 'UAP Old Mutual',
  'Leadway Assurance', 'AXA Mansard', 'AIICO Insurance', 'Hadiel Tech'
];

function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('metrics');
  const [globalMetricTypes, setGlobalMetricTypes] = useState<string[]>(GLOBAL_METRIC_TYPES);
  const [globalInsurers, setGlobalInsurers] = useState<string[]>(GLOBAL_INSURERS);
  const [teamMembers, setTeamMembers] = useState(TEAM_MEMBERS);
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: Date;
    from?: string;
  }>>([]);

  const addNotification = (message: string, type: 'info' | 'success' | 'warning' | 'error', from?: string) => {
    const notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date(),
      from,
    };
    setNotifications(prev => [notification, ...prev.slice(0, 9)]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const sendSlackSummary = () => {
    // Simulate sending daily summary to Slack
    addNotification('Daily summary sent to Slack! 📊', 'success');
  };

  if (!currentUser) {
    return <UserSelection onUserSelect={setCurrentUser} teamMembers={teamMembers} />;
  }

  const currentUserData = teamMembers.find(member => member.id === currentUser);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'metrics':
        return <MetricsDashboard onNotification={addNotification} currentUser={currentUser} teamMembers={teamMembers} onAddUser={setTeamMembers} />;
      case 'goals':
        return <GoalTracking onNotification={addNotification} currentUser={currentUser} teamMembers={teamMembers} />;
      case 'analytics':
        return <TeamAnalytics onNotification={addNotification} currentUser={currentUser} teamMembers={teamMembers} />;
      case 'smart':
        return <SmartAnalytics onNotification={addNotification} currentUser={currentUser} teamMembers={teamMembers} />;
      case 'tasks':
        return <TaskManagement onNotification={addNotification} currentUser={currentUser} teamMembers={teamMembers} />;
      case 'errors':
        return <ErrorHandler onNotification={addNotification} currentUser={currentUser} teamMembers={teamMembers} />;
      case 'trends':
        return <TrendAnalysis onNotification={addNotification} currentUser={currentUser} teamMembers={teamMembers} />;
      case 'claims':
        return <ClaimsAnalysis onNotification={addNotification} currentUser={currentUser} teamMembers={teamMembers} />;
      case 'issues':
        return <IssueTracker onNotification={addNotification} currentUser={currentUser} teamMembers={teamMembers} />;
      case 'fireflies':
        return <FirefliesIntegration onNotification={addNotification} currentUser={currentUser} teamMembers={teamMembers} />;
      case 'calendar':
        return <CalendarDigests onNotification={addNotification} currentUser={currentUser} teamMembers={teamMembers} />;
      case 'audit':
        return <AuditTrail onNotification={addNotification} currentUser={currentUser} teamMembers={teamMembers} />;
      default:
        return <MetricsDashboard onNotification={addNotification} currentUser={currentUser} teamMembers={teamMembers} onAddUser={setTeamMembers} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <img src="/curacel logo.jpeg" alt="Curacel" className="h-10 w-auto" />
                <span className="ml-2 text-xl font-bold text-gray-900">Curacel DataOps</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Bell className="h-6 w-6 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors" />
                {notifications.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center text-sm text-gray-700">
                  <span className="text-lg mr-2">{currentUserData?.avatar}</span>
                  <div>
                    <div className="font-medium">{currentUserData?.name}</div>
                    <div className="text-xs text-gray-500">{currentUserData?.role}</div>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentUser(null)}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Switch User
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>


      <div className="flex h-screen bg-gray-50">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
          </div>
          <div className="flex-1 px-4 pb-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-4 py-3 mb-2 rounded-lg font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {renderActiveTab()}
          </div>
        </main>
      </div>

      {/* Notifications */}
      <Notifications notifications={notifications} onRemove={removeNotification} />
    </div>
  );
}

export default App;