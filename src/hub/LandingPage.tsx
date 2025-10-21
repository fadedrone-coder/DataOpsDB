import React, { useState, useEffect } from 'react';
import { Building2, Users, TrendingUp, Zap, ArrowRight, MessageCircle } from 'lucide-react';

interface Department {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
}

interface LandingPageProps {
  onDepartmentSelect: (dept: Department) => void;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onDepartmentSelect, onOpenAuth }) => {
  const [showChatbot, setShowChatbot] = useState(false);

  const departments: Department[] = [
    {
      id: '1',
      name: 'DataOps',
      slug: 'dataops',
      description: 'Data Operations & Management',
      icon: '📊',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: '2',
      name: 'Finance',
      slug: 'finance',
      description: 'Financial Management & Reporting',
      icon: '💰',
      color: 'from-green-500 to-green-600',
    },
    {
      id: '3',
      name: 'Customer Success',
      slug: 'customer-success',
      description: 'Customer Support & Success',
      icon: '🤝',
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: '4',
      name: 'Engineering',
      slug: 'engineering',
      description: 'Software Development & Infrastructure',
      icon: '⚙️',
      color: 'from-gray-600 to-gray-700',
    },
    {
      id: '5',
      name: 'Product - Health & Pay',
      slug: 'product-health',
      description: 'Health & Pay Product Management',
      icon: '🏥',
      color: 'from-teal-500 to-teal-600',
    },
    {
      id: '6',
      name: 'Product - Auto',
      slug: 'product-auto',
      description: 'Auto Insurance Product Management',
      icon: '🚗',
      color: 'from-orange-500 to-orange-600',
    },
    {
      id: '7',
      name: 'People Ops',
      slug: 'people-ops',
      description: 'Human Resources & Operations',
      icon: '👥',
      color: 'from-pink-500 to-pink-600',
    },
    {
      id: '8',
      name: 'Commercial',
      slug: 'commercial',
      description: 'Marketing & Business Development',
      icon: '📈',
      color: 'from-red-500 to-red-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <img
                src="/curacel logo.jpeg"
                alt="Curacel Logo"
                className="h-16 w-16 object-contain rounded shadow-sm"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Curacel Performance Hub</h1>
                <p className="text-sm text-gray-600">Enterprise Performance Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onOpenAuth('signin')}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-3xl">🔑</span>
            <h3 className="font-bold text-xl">Test Super Admin Credentials</h3>
          </div>
          <div className="text-center space-y-2 bg-blue-800 bg-opacity-30 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-lg"><span className="font-semibold">Email:</span> admin@curacel.com</p>
            <p className="text-lg"><span className="font-semibold">Password:</span> admin123</p>
            <p className="text-sm text-blue-200 mt-3 border-t border-blue-500 pt-2">
              ✅ Full platform access • View all departments • Approve users
            </p>
          </div>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Curacel Performance Hub
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your centralized platform for tracking performance, managing OKRs, and driving excellence across all departments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Real-time Analytics</h3>
            </div>
            <p className="text-sm text-gray-600">
              Track performance metrics and KPIs across all departments in real-time
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Smart Automation</h3>
            </div>
            <p className="text-sm text-gray-600">
              AI-powered insights, anomaly detection, and workload optimization
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Team Collaboration</h3>
            </div>
            <p className="text-sm text-gray-600">
              Seamless collaboration with task management and team analytics
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Select Your Department
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => onDepartmentSelect(dept)}
                className="group relative bg-white rounded-xl shadow-sm border-2 border-gray-200 p-6 hover:border-blue-500 hover:shadow-lg transition-all"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${dept.color} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity`} />

                <div className="relative">
                  <div className="text-4xl mb-3">{dept.icon}</div>
                  <h4 className="font-semibold text-gray-900 mb-1">{dept.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{dept.description}</p>

                  <div className="flex items-center text-blue-600 text-sm font-medium">
                    <span>Enter Dashboard</span>
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-3">Ready to Get Started?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Join your team on Curacel Performance Hub and start tracking your performance today
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => onOpenAuth('signin')}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-50 font-bold text-lg transition-colors shadow-lg"
            >
              🔑 Sign In (Use Test Credentials)
            </button>
            <button
              onClick={() => onOpenAuth('signup')}
              className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-400 font-bold text-lg transition-colors shadow-lg"
            >
              ➕ Create New Account
            </button>
          </div>
        </div>
      </main>

      <button
        onClick={() => setShowChatbot(!showChatbot)}
        className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {showChatbot && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <span className="font-semibold">Performance Hub Assistant</span>
            </div>
            <button
              onClick={() => setShowChatbot(false)}
              className="text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-3">
              <div className="bg-gray-100 rounded-lg p-3 text-sm">
                <p className="font-medium text-gray-900 mb-1">👋 Hi there!</p>
                <p className="text-gray-700">
                  I'm your Performance Hub assistant. How can I help you today?
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-gray-600 font-medium">Quick Actions:</p>
                <button className="w-full text-left px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors">
                  How do I upload OKRs?
                </button>
                <button className="w-full text-left px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors">
                  Show me my department dashboard
                </button>
                <button className="w-full text-left px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors">
                  How does approval work?
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 text-sm">
            <p>&copy; 2024 Curacel. All rights reserved.</p>
            <p className="mt-2">Enterprise Performance Management Platform</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
