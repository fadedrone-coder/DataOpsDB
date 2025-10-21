import React from 'react';
import { Users } from 'lucide-react';
import { TEAM_MEMBERS } from '../App';

interface UserSelectionProps {
  onUserSelect: (userId: string) => void;
  teamMembers: TeamMember[];
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

const UserSelection: React.FC<UserSelectionProps> = ({ onUserSelect, teamMembers }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl w-full">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src="/curacel logo.jpeg" alt="Curacel" className="h-16 w-auto" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to DataOps Dashboard</h1>
          <p className="text-gray-600">Select your profile to continue</p>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {teamMembers.map((member) => (
            <button
              key={member.id}
              onClick={() => onUserSelect(member.id)}
              className="group p-6 bg-gray-50 rounded-xl hover:bg-blue-50 hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-blue-200"
            >
              <div className="text-center">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {member.avatar}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Features Preview */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              📊
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Metrics Tracking</h3>
            <p className="text-sm text-gray-600">Track daily metrics across all insurers and regions</p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              ✅
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Task Management</h3>
            <p className="text-sm text-gray-600">Collaborate on tasks with Slack notifications</p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              🚨
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Error Monitoring</h3>
            <p className="text-sm text-gray-600">Auto-resolve errors from Slack notifications</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSelection;