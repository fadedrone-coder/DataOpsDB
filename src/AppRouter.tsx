import React, { useState, useEffect } from 'react';
import App from './App';
import HubApp from './HubApp';

const AppRouter: React.FC = () => {
  const [selectedApp, setSelectedApp] = useState<'dataops' | 'hub' | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const app = params.get('app');
    if (app === 'hub') {
      setSelectedApp('hub');
    }
  }, []);

  if (selectedApp === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="max-w-4xl w-full mx-4">
          <div className="text-center mb-12">
            <img
              src="/curacel logo.jpeg"
              alt="Curacel Logo"
              className="h-28 w-28 object-contain rounded mx-auto mb-6 shadow-lg"
            />
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Welcome to Curacel
            </h1>
            <p className="text-xl text-gray-600">
              Select your platform to continue
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => setSelectedApp('dataops')}
              className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-500"
            >
              <div className="text-5xl mb-4">📊</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                DataOps Dashboard
              </h2>
              <p className="text-gray-600 mb-4">
                Original DataOps team dashboard with metrics tracking, task management, and analytics
              </p>
              <div className="flex items-center text-blue-600 font-medium">
                <span>Launch DataOps</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <button
              onClick={() => setSelectedApp('hub')}
              className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all border-2 border-transparent hover:border-green-500"
            >
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Performance Hub
              </h2>
              <p className="text-gray-600 mb-4">
                Enterprise-wide platform with multi-department support, OKR management, and AI-powered features
              </p>
              <div className="flex items-center text-green-600 font-medium">
                <span>Launch Hub</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-gray-600">
            <p>Not sure which to choose? Contact your team lead or People Ops</p>
          </div>
        </div>
      </div>
    );
  }

  return selectedApp === 'dataops' ? <App /> : <HubApp />;
};

export default AppRouter;
