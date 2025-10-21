import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Mail, Clock, Users, Plus, Send, Download } from 'lucide-react';

interface CalendarEvent {
  id: string;
  user_id: string;
  title: string;
  description: string;
  event_type: 'meeting' | 'deadline' | 'reminder';
  start_time: string;
  end_time: string;
  attendees: string[];
}

interface EmailDigest {
  id: string;
  user_id: string;
  digest_type: 'daily' | 'weekly';
  sent_at: string;
  content: {
    metrics_completed: number;
    tasks_completed: number;
    goals_progress: number;
    top_achievements: string[];
  };
  email_status: 'sent' | 'failed' | 'pending';
}

interface CalendarDigestsProps {
  onNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  currentUser: string;
  teamMembers: Array<{ id: string; name: string; role: string; avatar: string }>;
}

const CalendarDigests: React.FC<CalendarDigestsProps> = ({ onNotification, currentUser, teamMembers }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [digests, setDigests] = useState<EmailDigest[]>([]);
  const [selectedTab, setSelectedTab] = useState<'calendar' | 'digests'>('calendar');
  const [showAddEvent, setShowAddEvent] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    event_type: 'meeting' as const,
    start_time: '',
    end_time: '',
  });

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    const now = new Date();
    const mockEvents: CalendarEvent[] = [
      {
        id: '1',
        user_id: currentUser,
        title: 'Weekly Team Standup',
        description: 'Discuss progress and blockers',
        event_type: 'meeting',
        start_time: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        end_time: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(),
        attendees: ['muyiwa', 'sophie', 'emmanuel', 'hope'],
      },
      {
        id: '2',
        user_id: currentUser,
        title: 'Kenya Provider Mapping Deadline',
        description: 'Complete all pending mappings',
        event_type: 'deadline',
        start_time: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        end_time: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        attendees: ['sophie'],
      },
      {
        id: '3',
        user_id: currentUser,
        title: 'Claims Review Session',
        description: 'Review UAP Old Mutual claims',
        event_type: 'meeting',
        start_time: new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString(),
        end_time: new Date(now.getTime() + 48 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
        attendees: ['daniel', 'morenikeji'],
      },
    ];

    const mockDigests: EmailDigest[] = [
      {
        id: '1',
        user_id: currentUser,
        digest_type: 'daily',
        sent_at: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        content: {
          metrics_completed: 5,
          tasks_completed: 3,
          goals_progress: 75,
          top_achievements: [
            'Completed 15 provider mappings',
            'Reviewed 45 claims successfully',
            'Resolved 3 critical errors',
          ],
        },
        email_status: 'sent',
      },
      {
        id: '2',
        user_id: currentUser,
        digest_type: 'weekly',
        sent_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        content: {
          metrics_completed: 28,
          tasks_completed: 15,
          goals_progress: 68,
          top_achievements: [
            'Exceeded weekly provider mapping goal by 20%',
            'Maintained 95% claims approval rate',
            'Reduced error resolution time by 30%',
            'Helped 2 team members with complex cases',
          ],
        },
        email_status: 'sent',
      },
    ];

    setEvents(mockEvents);
    setDigests(mockDigests);
  };

  const addEvent = () => {
    if (!newEvent.title || !newEvent.start_time) {
      onNotification('Please fill in required fields', 'error');
      return;
    }

    const event: CalendarEvent = {
      id: Date.now().toString(),
      user_id: currentUser,
      title: newEvent.title,
      description: newEvent.description,
      event_type: newEvent.event_type,
      start_time: new Date(newEvent.start_time).toISOString(),
      end_time: newEvent.end_time ? new Date(newEvent.end_time).toISOString() : new Date(newEvent.start_time).toISOString(),
      attendees: [currentUser],
    };

    setEvents([...events, event]);
    setShowAddEvent(false);
    setNewEvent({ title: '', description: '', event_type: 'meeting', start_time: '', end_time: '' });
    onNotification('Calendar event created!', 'success');
  };

  const syncToGoogle = () => {
    onNotification('Calendar sync initiated with Google Calendar!', 'success');
  };

  const sendDigestNow = () => {
    onNotification('Email digest sent successfully!', 'success');
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'deadline':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'reminder':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimeRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.toLocaleString()} - ${endDate.toLocaleTimeString()}`;
  };

  const getUserName = (userId: string) => {
    return teamMembers.find(m => m.id === userId)?.name || userId;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Calendar & Email Digests</h2>
          <p className="text-gray-600">Manage events and automated summaries</p>
        </div>
      </div>

      <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
        <button
          onClick={() => setSelectedTab('calendar')}
          className={`flex-1 flex items-center justify-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'calendar'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <CalendarIcon className="h-4 w-4 mr-2" />
          Calendar Integration
        </button>
        <button
          onClick={() => setSelectedTab('digests')}
          className={`flex-1 flex items-center justify-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'digests'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Mail className="h-4 w-4 mr-2" />
          Email Digests
        </button>
      </div>

      {selectedTab === 'calendar' && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddEvent(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Event
            </button>
            <button
              onClick={syncToGoogle}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <CalendarIcon className="h-5 w-5 mr-2" />
              Sync with Google
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              {events.map((event) => {
                const startDate = new Date(event.start_time);
                const isUpcoming = startDate.getTime() > Date.now();

                return (
                  <div key={event.id} className={`border-l-4 ${isUpcoming ? 'border-blue-500' : 'border-gray-300'} bg-gray-50 rounded-r-lg p-4`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{event.title}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getEventTypeColor(event.event_type)}`}>
                            {event.event_type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                      </div>
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span>{formatTimeRange(event.start_time, event.end_time)}</span>
                    </div>

                    {event.attendees.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <div className="flex flex-wrap gap-1">
                          {event.attendees.map((attendee, idx) => (
                            <span key={idx} className="px-2 py-1 bg-white text-gray-700 text-xs rounded-full border border-gray-200">
                              {getUserName(attendee)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'digests' && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <button
              onClick={sendDigestNow}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Send className="h-5 w-5 mr-2" />
              Send Digest Now
            </button>
            <button
              onClick={() => onNotification('Digest settings updated', 'success')}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Configure Schedule
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {digests.map((digest) => (
              <div key={digest.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-900 capitalize">{digest.digest_type} Digest</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Sent {new Date(digest.sent_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                    digest.email_status === 'sent' ? 'bg-green-100 text-green-800 border-green-200' :
                    digest.email_status === 'failed' ? 'bg-red-100 text-red-800 border-red-200' :
                    'bg-yellow-100 text-yellow-800 border-yellow-200'
                  }`}>
                    {digest.email_status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <div className="text-2xl font-bold text-blue-900">{digest.content.metrics_completed}</div>
                      <div className="text-xs text-blue-700">Metrics</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <div className="text-2xl font-bold text-green-900">{digest.content.tasks_completed}</div>
                      <div className="text-xs text-green-700">Tasks</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <div className="text-2xl font-bold text-purple-900">{digest.content.goals_progress}%</div>
                      <div className="text-xs text-purple-700">Goals</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Top Achievements</div>
                    <ul className="space-y-1">
                      {digest.content.top_achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-green-600 mt-0.5">✓</span>
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => onNotification('Digest downloaded!', 'success')}
                  className="w-full mt-4 flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAddEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add Calendar Event</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., Team Meeting"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newEvent.event_type}
                  onChange={(e) => setNewEvent({ ...newEvent, event_type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="meeting">Meeting</option>
                  <option value="deadline">Deadline</option>
                  <option value="reminder">Reminder</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <input
                  type="datetime-local"
                  value={newEvent.start_time}
                  onChange={(e) => setNewEvent({ ...newEvent, start_time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <input
                  type="datetime-local"
                  value={newEvent.end_time}
                  onChange={(e) => setNewEvent({ ...newEvent, end_time: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddEvent(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addEvent}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarDigests;
