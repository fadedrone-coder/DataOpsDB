import React, { useState } from 'react';
import { BarChart3, CheckSquare, AlertTriangle, Target, TrendingUp, Users, Video, Shield, Zap, Mail, Upload, UserCheck, LogOut, Menu, X, Building2 } from 'lucide-react';
import LandingPage from './hub/LandingPage';
import AuthModal from './hub/AuthModal';
import ApprovalDashboard from './hub/ApprovalDashboard';
import ExcelOKRUpload from './hub/ExcelOKRUpload';
import DepartmentMetrics from './components/DepartmentMetrics';
import TaskManagement from './components/TaskManagement';
import DepartmentErrors from './components/DepartmentErrors';
import Notifications from './components/Notifications';
import DepartmentIssues from './components/DepartmentIssues';
import DepartmentClaims from './components/DepartmentClaims';
import TeamAnalytics from './components/TeamAnalytics';
import DepartmentGoals from './components/DepartmentGoals';
import FirefliesIntegration from './components/FirefliesIntegration';
import AuditTrail from './components/AuditTrail';
import SmartAnalytics from './components/SmartAnalytics';
import CalendarDigests from './components/CalendarDigests';

interface Department {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  features_enabled: Record<string, boolean>;
  metric_types: string[];
}

interface User {
  id: string;
  email: string;
  fullName: string;
  departmentId: string;
  departmentName: string;
  role: 'user' | 'dept_lead' | 'people_ops' | 'super_admin';
  status: string;
}

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  from?: string;
}

const HubApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [activeTab, setActiveTab] = useState('metrics');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showOKRUpload, setShowOKRUpload] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showDepartmentSelector, setShowDepartmentSelector] = useState(false);

  const departments: Department[] = [
    {
      id: '1',
      name: 'DataOps',
      slug: 'dataops',
      description: 'Data Operations Team',
      icon: '📊',
      features_enabled: {
        metrics: true,
        goals: true,
        tasks: true,
        errors: true,
        claims: true,
        fireflies: true,
        audit: true,
        calendar: true,
        smart: true,
      },
      metric_types: [
        'Number of Providers Mapped',
        'Number of Care items Mapped',
        'Number of Care items Grouped',
        'Claims piles checked',
        'Auto P.A Reviewed',
        'Flagged Care Items',
      ],
    },
    {
      id: '2',
      name: 'Finance',
      slug: 'finance',
      description: 'Finance Department',
      icon: '💰',
      features_enabled: {
        metrics: true,
        goals: true,
        tasks: true,
        errors: false,
        claims: true,
        fireflies: true,
        audit: true,
        calendar: true,
        smart: true,
      },
      metric_types: [
        'Revenue Processed',
        'Invoices Generated',
        'Budget Tracked',
        'Payment Collections',
        'Financial Reports',
        'Audit Compliance',
      ],
    },
    {
      id: '3',
      name: 'Customer Success',
      slug: 'customer-success',
      description: 'Customer Success Team',
      icon: '🤝',
      features_enabled: {
        metrics: true,
        goals: true,
        tasks: true,
        errors: false,
        claims: true,
        fireflies: true,
        audit: true,
        calendar: true,
        smart: true,
      },
      metric_types: [
        'Tickets Resolved',
        'CSAT Score',
        'NPS Score',
        'Churn Rate',
        'Customer Onboarded',
        'Support Response Time',
      ],
    },
    {
      id: '4',
      name: 'Engineering',
      slug: 'engineering',
      description: 'Engineering Team',
      icon: '⚙️',
      features_enabled: {
        metrics: true,
        goals: true,
        tasks: true,
        errors: true,
        claims: false,
        fireflies: true,
        audit: true,
        calendar: true,
        smart: true,
      },
      metric_types: [
        'Sprint Velocity',
        'Bugs Resolved',
        'Deployments',
        'Code Reviews',
        'Feature Releases',
        'System Uptime',
      ],
    },
    {
      id: '5',
      name: 'Product - Health & Pay',
      slug: 'product-health',
      description: 'Product Team - Health & Pay',
      icon: '🏥',
      features_enabled: {
        metrics: true,
        goals: true,
        tasks: true,
        errors: false,
        claims: false,
        fireflies: true,
        audit: true,
        calendar: true,
        smart: true,
      },
      metric_types: [
        'Feature Releases',
        'User Adoption Rate',
        'A/B Tests Run',
        'User Feedback',
        'Product Updates',
        'Beta Testing',
      ],
    },
    {
      id: '6',
      name: 'Product - Auto',
      slug: 'product-auto',
      description: 'Product Team - Auto',
      icon: '🚗',
      features_enabled: {
        metrics: true,
        goals: true,
        tasks: true,
        errors: false,
        claims: false,
        fireflies: true,
        audit: true,
        calendar: true,
        smart: true,
      },
      metric_types: [
        'Feature Releases',
        'User Adoption Rate',
        'A/B Tests Run',
        'User Feedback',
        'Product Updates',
        'Beta Testing',
      ],
    },
    {
      id: '7',
      name: 'People Ops',
      slug: 'people-ops',
      description: 'People Operations (HR)',
      icon: '👥',
      features_enabled: {
        metrics: true,
        goals: true,
        tasks: true,
        errors: false,
        claims: false,
        fireflies: true,
        audit: true,
        calendar: true,
        smart: true,
      },
      metric_types: [
        'Employees Onboarded',
        'Training Sessions',
        'Performance Reviews',
        'Recruitment Pipeline',
        'Employee Satisfaction',
        'Retention Rate',
      ],
    },
    {
      id: '8',
      name: 'Commercial',
      slug: 'commercial',
      description: 'Commercial Unit (Marketing)',
      icon: '📈',
      features_enabled: {
        metrics: true,
        goals: true,
        tasks: true,
        errors: false,
        claims: false,
        fireflies: true,
        audit: true,
        calendar: true,
        smart: true,
      },
      metric_types: [
        'Leads Generated',
        'Campaign ROI',
        'Website Traffic',
        'Conversions',
        'Social Engagement',
        'Content Published',
      ],
    },
  ];

  const TEAM_MEMBERS = [
    { id: 'muyiwa', name: 'Muyiwa', role: 'Team Lead', avatar: '👨‍💼' },
    { id: 'sophie', name: 'Sophie', role: 'Specialist', avatar: '👩‍💻' },
    { id: 'emmanuel', name: 'Emmanuel', role: 'Specialist', avatar: '👨‍💻' },
    { id: 'hope', name: 'Hope', role: 'Specialist', avatar: '👩‍💻' },
    { id: 'daniel', name: 'Daniel', role: 'Specialist', avatar: '👨‍💼' },
    { id: 'morenikeji', name: 'Morenikeji', role: 'Specialist', avatar: '👩‍💼' },
  ];

  const handleDepartmentSelect = (dept: Department) => {
    setSelectedDepartment(dept);
    if (currentUser) {
      setCurrentView('dashboard');
      setShowDepartmentSelector(false);
    } else {
      setShowAuth(true);
      setAuthMode('signin');
    }
  };

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  const handleAuthSuccess = (user: any) => {
    const dept = departments.find(d => d.id === user.departmentId) || departments[0];
    const userWithDept: User = {
      ...user,
      departmentName: dept.name,
    };
    setCurrentUser(userWithDept);
    setSelectedDepartment(dept);
    setCurrentView('dashboard');
    setShowAuth(false);
    addNotification(`Welcome back, ${user.fullName}!`, 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedDepartment(null);
    setCurrentView('landing');
    setActiveTab('metrics');
  };

  const addNotification = (message: string, type: Notification['type'], from?: string) => {
    const notification: Notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date(),
      from,
    };
    setNotifications(prev => [notification, ...prev].slice(0, 50));
  };

  const canSwitchDepartment = currentUser?.role === 'super_admin' || currentUser?.role === 'people_ops';

  const getNavigationItems = () => {
    if (!selectedDepartment) return [];

    const allItems = [
      { id: 'metrics', name: 'Metrics', icon: BarChart3, feature: 'metrics' },
      { id: 'goals', name: 'Goals & OKRs', icon: Target, feature: 'goals' },
      { id: 'analytics', name: 'Team Analytics', icon: TrendingUp, feature: 'metrics' },
      { id: 'smart', name: 'Smart Analytics', icon: Zap, feature: 'smart' },
      { id: 'tasks', name: 'Tasks', icon: CheckSquare, feature: 'tasks' },
      { id: 'errors', name: 'Errors', icon: AlertTriangle, feature: 'errors' },
      { id: 'claims', name: 'Claims', icon: Target, feature: 'claims' },
      { id: 'issues', name: 'Issues', icon: Users, feature: 'tasks' },
      { id: 'fireflies', name: 'Fireflies', icon: Video, feature: 'fireflies' },
      { id: 'calendar', name: 'Calendar', icon: Mail, feature: 'calendar' },
      { id: 'audit', name: 'Audit', icon: Shield, feature: 'audit' },
    ];

    if (currentUser && ['dept_lead', 'people_ops', 'super_admin'].includes(currentUser.role)) {
      allItems.push({ id: 'approvals', name: 'Approvals', icon: UserCheck, feature: 'metrics' });
    }

    return allItems.filter(item => selectedDepartment.features_enabled[item.feature]);
  };

  const renderActiveTab = () => {
    if (!currentUser || !selectedDepartment) return null;

    const currentUserId = TEAM_MEMBERS[0].id;

    switch (activeTab) {
      case 'metrics':
        return <DepartmentMetrics departmentSlug={selectedDepartment.slug} metricTypes={selectedDepartment.metric_types} onNotification={addNotification} />;
      case 'goals':
        return <DepartmentGoals departmentSlug={selectedDepartment.slug} departmentName={selectedDepartment.name} onNotification={addNotification} />;
      case 'analytics':
        return <TeamAnalytics onNotification={addNotification} currentUser={currentUserId} teamMembers={TEAM_MEMBERS} />;
      case 'smart':
        return <SmartAnalytics onNotification={addNotification} currentUser={currentUserId} teamMembers={TEAM_MEMBERS} />;
      case 'tasks':
        return <TaskManagement onNotification={addNotification} currentUser={currentUserId} teamMembers={TEAM_MEMBERS} />;
      case 'errors':
        return <DepartmentErrors departmentSlug={selectedDepartment.slug} departmentName={selectedDepartment.name} onNotification={addNotification} />;
      case 'claims':
        return <DepartmentClaims departmentSlug={selectedDepartment.slug} departmentName={selectedDepartment.name} onNotification={addNotification} />;
      case 'issues':
        return <DepartmentIssues departmentSlug={selectedDepartment.slug} departmentName={selectedDepartment.name} onNotification={addNotification} />;
      case 'fireflies':
        return <FirefliesIntegration onNotification={addNotification} currentUser={currentUserId} teamMembers={TEAM_MEMBERS} />;
      case 'calendar':
        return <CalendarDigests onNotification={addNotification} currentUser={currentUserId} teamMembers={TEAM_MEMBERS} />;
      case 'audit':
        return <AuditTrail onNotification={addNotification} currentUser={currentUserId} teamMembers={TEAM_MEMBERS} />;
      case 'approvals':
        return <ApprovalDashboard currentUser={currentUser} onNotification={addNotification} />;
      default:
        return <DepartmentMetrics departmentSlug={selectedDepartment.slug} metricTypes={selectedDepartment.metric_types} onNotification={addNotification} />;
    }
  };

  if (currentView === 'landing') {
    return (
      <>
        <LandingPage
          onDepartmentSelect={handleDepartmentSelect}
          onOpenAuth={handleOpenAuth}
        />
        {showAuth && (
          <AuthModal
            mode={authMode}
            onClose={() => setShowAuth(false)}
            onSuccess={handleAuthSuccess}
            departments={departments}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'} flex flex-col fixed h-full z-30`}>
        <div className={`p-4 border-b border-gray-200 flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <img src="/curacel logo.jpeg" alt="Curacel" className="h-10 w-10 object-contain rounded" />
              <div>
                <h1 className="text-sm font-bold text-gray-900">Curacel Hub</h1>
                <p className="text-xs text-gray-600">{selectedDepartment?.name}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </button>
        </div>

        {canSwitchDepartment && (
          <div className="p-3 border-b border-gray-200">
            <button
              onClick={() => setShowDepartmentSelector(!showDepartmentSelector)}
              className={`w-full flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
            >
              <Building2 className="h-5 w-5" />
              {!sidebarCollapsed && <span className="text-sm font-medium">Switch Department</span>}
            </button>
          </div>
        )}

        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="space-y-1">
            {getNavigationItems().map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  } ${sidebarCollapsed ? 'justify-center' : ''}`}
                  title={sidebarCollapsed ? item.name : ''}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="text-sm font-medium">{item.name}</span>}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-3 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors ${sidebarCollapsed ? 'justify-center' : ''}`}
            title={sidebarCollapsed ? 'Logout' : ''}
          >
            <LogOut className="h-5 w-5" />
            {!sidebarCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{selectedDepartment?.name} Dashboard</h2>
              <p className="text-sm text-gray-600">Welcome back, {currentUser?.fullName}</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowOKRUpload(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium shadow-md transition-all"
              >
                <Upload className="h-4 w-4" />
                Upload OKRs
              </button>

              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Mail className="h-6 w-6" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {notifications.length}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{currentUser?.fullName}</p>
                  <p className="text-xs text-gray-600 capitalize">{currentUser?.role.replace('_', ' ')}</p>
                </div>
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {currentUser?.fullName.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {renderActiveTab()}
        </div>
      </main>

      {showNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-end p-6">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Notifications</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`p-3 rounded-lg border ${
                      notif.type === 'success' ? 'bg-green-50 border-green-200' :
                      notif.type === 'error' ? 'bg-red-50 border-red-200' :
                      notif.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-blue-50 border-blue-200'
                    }`}>
                      <p className="text-sm font-medium text-gray-900">{notif.message}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {notif.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showDepartmentSelector && canSwitchDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Select Department</h3>
              <button
                onClick={() => setShowDepartmentSelector(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => handleDepartmentSelect(dept)}
                  className={`p-6 border-2 rounded-lg transition-all text-left ${
                    selectedDepartment?.id === dept.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-3xl mb-3">{dept.icon}</div>
                  <h4 className="font-bold text-gray-900 mb-1">{dept.name}</h4>
                  <p className="text-sm text-gray-600">{dept.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showOKRUpload && currentUser && selectedDepartment && (
        <ExcelOKRUpload
          departmentId={selectedDepartment.id}
          userId={currentUser.id}
          onNotification={addNotification}
          onClose={() => setShowOKRUpload(false)}
        />
      )}
    </div>
  );
};

export default HubApp;
