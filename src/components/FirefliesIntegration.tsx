import React, { useState, useEffect } from 'react';
import { Video, Users, Clock, CheckSquare, TrendingUp, AlertTriangle, Lightbulb, RefreshCw, Send } from 'lucide-react';

interface FirefliesRecording {
  id: string;
  meeting_id: string;
  title: string;
  date: string;
  duration: number;
  participants: string[];
  action_items: Array<{
    task: string;
    assigned_to: string;
    priority: string;
  }>;
  highlights: string[];
  lowlights: string[];
  insights: string[];
  transcript_url: string;
}

interface FirefliesIntegrationProps {
  onNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  currentUser: string;
  teamMembers: Array<{ id: string; name: string; role: string; avatar: string }>;
}

const FirefliesIntegration: React.FC<FirefliesIntegrationProps> = ({ onNotification, currentUser, teamMembers }) => {
  const [recordings, setRecordings] = useState<FirefliesRecording[]>([]);
  const [selectedRecording, setSelectedRecording] = useState<FirefliesRecording | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadMockRecordings();
  }, []);

  const loadMockRecordings = () => {
    const mockRecordings: FirefliesRecording[] = [
      {
        id: '1',
        meeting_id: 'ff-001',
        title: 'Weekly DataOps Standup',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 45,
        participants: ['Muyiwa', 'Sophie', 'Emmanuel', 'Hope'],
        action_items: [
          { task: 'Complete Kenya provider mapping by Friday', assigned_to: 'sophie', priority: 'high' },
          { task: 'Review UAP claims backlog', assigned_to: 'emmanuel', priority: 'urgent' },
          { task: 'Update care items grouping documentation', assigned_to: 'hope', priority: 'medium' },
        ],
        highlights: [
          'Successfully mapped 200+ providers this week',
          'Claims processing time reduced by 30%',
          'New automation tools showing promising results',
        ],
        lowlights: [
          'Tanzania data quality issues persist',
          'Team experiencing burnout on repetitive tasks',
          'Delayed response from AXA Mansard stakeholders',
        ],
        insights: [
          'Consider implementing batch processing for Tanzania data',
          'Automation could reduce manual work by 40%',
          'Need better communication protocol with external insurers',
        ],
        transcript_url: '#',
      },
      {
        id: '2',
        meeting_id: 'ff-002',
        title: 'Claims Review Session - UAP',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 60,
        participants: ['Muyiwa', 'Daniel', 'Morenikeji'],
        action_items: [
          { task: 'Investigate flagged claims for UAP Q4', assigned_to: 'daniel', priority: 'urgent' },
          { task: 'Create claims processing SOP', assigned_to: 'morenikeji', priority: 'high' },
        ],
        highlights: [
          'Identified key patterns in claim denials',
          'Streamlined approval workflow',
        ],
        lowlights: [
          'High volume of incomplete claim submissions',
        ],
        insights: [
          'Provider training could reduce claim errors',
          'Implement pre-submission validation checks',
        ],
        transcript_url: '#',
      },
      {
        id: '3',
        meeting_id: 'ff-003',
        title: 'Monthly Planning - East Africa',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 90,
        participants: ['Muyiwa', 'Sophie', 'Emmanuel', 'Hope', 'Daniel', 'Morenikeji'],
        action_items: [
          { task: 'Coordinate with Kenya team for Q1 goals', assigned_to: 'muyiwa', priority: 'high' },
          { task: 'Set up quarterly OKRs for each specialist', assigned_to: 'muyiwa', priority: 'high' },
          { task: 'Research new care item categorization methods', assigned_to: 'sophie', priority: 'medium' },
        ],
        highlights: [
          'Q4 targets exceeded by 15%',
          'Successful rollout of new tools',
          'Strong team collaboration noted',
        ],
        lowlights: [
          'Budget constraints affecting tool purchases',
          'Some team members overloaded',
        ],
        insights: [
          'Need better workload distribution mechanism',
          'Consider hiring additional specialists for Q1',
          'Invest in automation to handle peak periods',
        ],
        transcript_url: '#',
      },
    ];

    setRecordings(mockRecordings);
  };

  const syncToTasks = (recording: FirefliesRecording) => {
    setIsLoading(true);
    setTimeout(() => {
      const count = recording.action_items.length;
      onNotification(`${count} action items synced to Task Management!`, 'success');
      setIsLoading(false);
    }, 1500);
  };

  const sendToSlack = (recording: FirefliesRecording) => {
    setIsLoading(true);
    setTimeout(() => {
      onNotification('Weekly report sent to #dataops-updates channel!', 'success');
      setIsLoading(false);
    }, 1500);
  };

  const refreshRecordings = () => {
    setIsLoading(true);
    setTimeout(() => {
      loadMockRecordings();
      onNotification('Synced with Fireflies API', 'success');
      setIsLoading(false);
    }, 2000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fireflies Integration</h2>
          <p className="text-gray-600">Meeting recordings, action items, and insights</p>
        </div>
        <button
          onClick={refreshRecordings}
          disabled={isLoading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Sync Recordings
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total Meetings</span>
            <Video className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{recordings.length}</div>
          <div className="text-sm text-gray-500 mt-1">This week</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Action Items</span>
            <CheckSquare className="h-5 w-5 text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {recordings.reduce((acc, r) => acc + r.action_items.length, 0)}
          </div>
          <div className="text-sm text-gray-500 mt-1">Extracted</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total Duration</span>
            <Clock className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {recordings.reduce((acc, r) => acc + r.duration, 0)}
          </div>
          <div className="text-sm text-gray-500 mt-1">Minutes</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Recordings</h3>
          {recordings.map((recording) => (
            <div
              key={recording.id}
              onClick={() => setSelectedRecording(recording)}
              className={`bg-white rounded-lg shadow-sm border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedRecording?.id === recording.id ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{recording.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {recording.duration} min
                    </span>
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {recording.participants.length}
                    </span>
                    <span>{new Date(recording.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <Video className="h-5 w-5 text-blue-600" />
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full border border-orange-200">
                  {recording.action_items.length} actions
                </span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full border border-green-200">
                  {recording.highlights.length} highlights
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full border border-purple-200">
                  {recording.insights.length} insights
                </span>
              </div>
            </div>
          ))}
        </div>

        {selectedRecording && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedRecording.title}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(selectedRecording.date).toLocaleDateString()} • {selectedRecording.duration} minutes
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Participants
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedRecording.participants.map((participant, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    {participant}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <CheckSquare className="h-4 w-4 mr-2" />
                Action Items ({selectedRecording.action_items.length})
              </h4>
              <div className="space-y-2">
                {selectedRecording.action_items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 mb-1">{item.task}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">
                          Assigned to: <span className="font-medium capitalize">{item.assigned_to}</span>
                        </span>
                        <span className={`px-2 py-0.5 text-xs rounded-full border ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                Highlights
              </h4>
              <ul className="space-y-2">
                {selectedRecording.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-600 mt-1">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-red-600" />
                Lowlights
              </h4>
              <ul className="space-y-2">
                {selectedRecording.lowlights.map((lowlight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-red-600 mt-1">•</span>
                    <span>{lowlight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Lightbulb className="h-4 w-4 mr-2 text-yellow-600" />
                Insights
              </h4>
              <ul className="space-y-2">
                {selectedRecording.insights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-yellow-600 mt-1">💡</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={() => syncToTasks(selectedRecording)}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Sync to Tasks
              </button>
              <button
                onClick={() => sendToSlack(selectedRecording)}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Send className="h-4 w-4 mr-2" />
                Send to Slack
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FirefliesIntegration;
