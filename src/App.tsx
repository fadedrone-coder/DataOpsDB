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

  const navigationSections = [
    {
      title: 'Operations',
      tabs: tabs.slice(0, 4),
    },
    {
      title: 'Execution',
      tabs: tabs.slice(4, 8),
    },
    {
      title: 'Automation',
      tabs: tabs.slice(8),
    },
  ];

  const quickStats = [
    {
      label: 'Active specialists',
      value: teamMembers.length,
      trend: '+2 this month',
    },
    {
      label: 'Open alerts',
      value: notifications.length,
      trend: '4 require review',
    },
    {
      label: 'Workstreams',
      value: tabs.length,
      trend: 'Real-time sync',
    },
  ];

  const overviewCards = [
    {
      title: 'Metrics health',
      description: 'Review today’s throughput, coverage, and SLA posture.',
      tabId: 'metrics',
      action: 'Open metrics',
    },
    {
      title: 'Execution queue',
      description: 'Stay ahead of tasks, blockers, and in-flight requests.',
      tabId: 'tasks',
      action: 'Manage tasks',
    },
    {
      title: 'Risk watch',
      description: 'Investigate anomalies, errors, and claim escalations.',
      tabId: 'errors',
      action: 'Inspect risks',
    },
    {
      title: 'Collaboration hub',
      description: 'Track issues, meetings, and audit trails in one flow.',
      tabId: 'issues',
      action: 'Open hub',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center gap-3">
                <img src="/curacel logo.jpeg" alt="Curacel" className="h-10 w-10 rounded-full bg-white/10 p-1" />
                <div>
                  <span className="block text-sm uppercase tracking-[0.2em] text-blue-300">
                    Curacel
                  </span>
                  <span className="block text-xl font-semibold text-white">DataOps Control Center</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={sendSlackSummary}
                className="hidden items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-100 transition hover:bg-blue-500/20 sm:flex"
              >
                <Bell className="h-4 w-4" />
                Send daily summary
              </button>
              <div className="relative">
                <Bell className="h-6 w-6 text-blue-200 hover:text-blue-100 cursor-pointer transition-colors" />
                {notifications.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center text-sm text-slate-100">
                  <span className="text-lg mr-2">{currentUserData?.avatar}</span>
                  <div>
                    <div className="font-medium">{currentUserData?.name}</div>
                    <div className="text-xs text-slate-400">{currentUserData?.role}</div>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentUser(null)}
                  className="text-sm text-slate-300 hover:text-white transition-colors"
                >
                  Switch User
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)] bg-slate-950">
        {/* Sidebar Navigation */}
        <nav className="w-72 border-r border-slate-800/80 bg-slate-950/60 px-6 py-8">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-lg shadow-blue-500/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Mission Control</h2>
                <p className="text-xs text-slate-400">Navigate every DataOps workstream</p>
              </div>
              <Target className="h-5 w-5 text-blue-400" />
            </div>
            <div className="mt-4 space-y-3">
              {quickStats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-3">
                  <div className="text-xs uppercase tracking-wide text-slate-400">{stat.label}</div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-xl font-semibold text-white">{stat.value}</span>
                    <span className="text-xs text-blue-300">{stat.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-6">
            {navigationSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  {section.title}
                </h3>
                <div className="mt-3 space-y-2">
                  {section.tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-500/15 text-blue-100 border border-blue-500/30'
                            : 'text-slate-300 hover:bg-slate-900/70 hover:text-white'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {tab.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-950 via-slate-900/40 to-slate-950">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="mb-8 flex flex-wrap items-start justify-between gap-6 rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 via-slate-900/60 to-slate-900/80 p-6 shadow-xl shadow-blue-500/10">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-300">Realtime</p>
                <h1 className="mt-2 text-3xl font-semibold text-white">Operations overview for today</h1>
                <p className="mt-2 max-w-xl text-sm text-slate-300">
                  Monitor throughput, surface risks, and orchestrate DataOps execution from a single command surface.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="rounded-full border border-slate-700/80 px-4 py-2 text-sm text-slate-200 transition hover:border-blue-400/60 hover:text-white">
                  View activity log
                </button>
                <button className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-400">
                  Launch response plan
                </button>
              </div>
            </div>
            <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {overviewCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 shadow-lg shadow-slate-900/30"
                >
                  <h2 className="text-lg font-semibold text-white">{card.title}</h2>
                  <p className="mt-2 text-sm text-slate-300">{card.description}</p>
                  <button
                    onClick={() => setActiveTab(card.tabId)}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-blue-100 transition hover:bg-blue-500/20"
                  >
                    {card.action}
                    <TrendingUp className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
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
