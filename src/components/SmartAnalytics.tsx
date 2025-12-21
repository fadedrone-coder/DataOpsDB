import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, Users, BarChart2, ArrowRight, CheckCircle, XCircle, Clock } from 'lucide-react';

interface Anomaly {
  id: string;
  user_id: string;
  anomaly_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  metrics: any;
  detected_at: string;
  status: 'active' | 'resolved' | 'dismissed';
}

interface WorkloadSuggestion {
  id: string;
  from_user_id: string;
  to_user_id: string;
  task_type: string;
  reason: string;
  estimated_hours: number;
  priority: string;
  status: 'pending' | 'accepted' | 'rejected';
}

interface Prediction {
  type: string;
  title: string;
  value: string;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  recommendation: string;
}

interface SmartAnalyticsProps {
  departmentSlug: string;
  departmentName: string;
  onNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  currentUser: string;
  teamMembers: Array<{ id: string; name: string; role: string; avatar: string }>;
}

const SmartAnalytics: React.FC<SmartAnalyticsProps> = ({ departmentSlug, departmentName, onNotification, currentUser, teamMembers }) => {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [suggestions, setSuggestions] = useState<WorkloadSuggestion[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [selectedTab, setSelectedTab] = useState<'anomalies' | 'workload' | 'predictions'>('anomalies');

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    const mockAnomalies: Anomaly[] = [
      {
        id: '1',
        user_id: 'emmanuel',
        anomaly_type: 'low_productivity',
        severity: 'medium',
        description: 'Productivity 35% below weekly average',
        metrics: { current: 12, average: 18, deficit: 6 },
        detected_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'active',
      },
      {
        id: '2',
        user_id: 'hope',
        anomaly_type: 'overload',
        severity: 'high',
        description: 'Task load 2.5x above team average',
        metrics: { current_tasks: 25, average_tasks: 10 },
        detected_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        status: 'active',
      },
      {
        id: '3',
        user_id: 'daniel',
        anomaly_type: 'bottleneck',
        severity: 'high',
        description: 'Claims review causing workflow delays',
        metrics: { pending_reviews: 45, avg_time: '3.5 hours' },
        detected_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
      },
    ];

    const mockSuggestions: WorkloadSuggestion[] = [
      {
        id: '1',
        from_user_id: 'hope',
        to_user_id: 'sophie',
        task_type: 'Provider Mapping',
        reason: 'Hope is overloaded, Sophie has capacity',
        estimated_hours: 4,
        priority: 'high',
        status: 'pending',
      },
      {
        id: '2',
        from_user_id: 'daniel',
        to_user_id: 'morenikeji',
        task_type: 'Claims Review',
        reason: 'Balanced distribution to clear bottleneck',
        estimated_hours: 6,
        priority: 'urgent',
        status: 'pending',
      },
    ];

    const mockPredictions: Prediction[] = [
      {
        type: 'completion',
        title: 'Kenya Provider Mapping',
        value: 'Completion by Friday, 85% confidence',
        confidence: 85,
        trend: 'up',
        recommendation: 'On track, maintain current pace',
      },
      {
        type: 'risk',
        title: 'Monthly Claims Target',
        value: 'At risk, 65% confidence of missing target',
        confidence: 65,
        trend: 'down',
        recommendation: 'Redistribute 15 claims to accelerate',
      },
      {
        type: 'capacity',
        title: 'Team Capacity Next Week',
        value: '92% utilized, optimal range',
        confidence: 78,
        trend: 'stable',
        recommendation: 'Good balance, no action needed',
      },
      {
        type: 'bottleneck',
        title: 'Potential Bottleneck',
        value: 'Tanzania data quality checks, 72% confidence',
        confidence: 72,
        trend: 'up',
        recommendation: 'Assign additional resource proactively',
      },
    ];

    setAnomalies(mockAnomalies);
    setSuggestions(mockSuggestions);
    setPredictions(mockPredictions);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const handleAnomalyAction = (id: string, action: 'resolved' | 'dismissed') => {
    setAnomalies(anomalies.map(a => a.id === id ? { ...a, status: action } : a));
    onNotification(`Anomaly ${action}!`, 'success');
  };

  const handleSuggestion = (id: string, action: 'accepted' | 'rejected') => {
    setSuggestions(suggestions.map(s => s.id === id ? { ...s, status: action } : s));
    onNotification(`Workload suggestion ${action}!`, action === 'accepted' ? 'success' : 'info');
  };

  const getUserName = (userId: string) => {
    return teamMembers.find(m => m.id === userId)?.name || userId;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-600 transform rotate-180" />;
      default:
        return <ArrowRight className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{departmentName} - Smart Analytics</h2>
        <p className="text-gray-600">AI-powered insights, predictions, and workload optimization</p>
      </div>

      <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
        <button
          onClick={() => setSelectedTab('anomalies')}
          className={`flex-1 flex items-center justify-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'anomalies'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Anomaly Detection
        </button>
        <button
          onClick={() => setSelectedTab('workload')}
          className={`flex-1 flex items-center justify-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'workload'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="h-4 w-4 mr-2" />
          Workload Balancing
        </button>
        <button
          onClick={() => setSelectedTab('predictions')}
          className={`flex-1 flex items-center justify-center px-4 py-3 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'predictions'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BarChart2 className="h-4 w-4 mr-2" />
          Predictive Analytics
        </button>
      </div>

      {selectedTab === 'anomalies' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Active Anomalies</span>
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {anomalies.filter(a => a.status === 'active').length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Resolved Today</span>
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {anomalies.filter(a => a.status === 'resolved').length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Critical Issues</span>
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {anomalies.filter(a => a.severity === 'critical' && a.status === 'active').length}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Detected Anomalies</h3>
            <div className="space-y-3">
              {anomalies.filter(a => a.status === 'active').map((anomaly) => (
                <div key={anomaly.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(anomaly.severity)}`}>
                          {anomaly.severity.toUpperCase()}
                        </span>
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {anomaly.anomaly_type.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{anomaly.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span>User: <span className="font-medium">{getUserName(anomaly.user_id)}</span></span>
                        <span>Detected: {new Date(anomaly.detected_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded p-3 mb-3">
                    <div className="text-xs font-medium text-gray-600 mb-1">Metrics</div>
                    <pre className="text-xs text-gray-700">{JSON.stringify(anomaly.metrics, null, 2)}</pre>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAnomalyAction(anomaly.id, 'resolved')}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark Resolved
                    </button>
                    <button
                      onClick={() => handleAnomalyAction(anomaly.id, 'dismissed')}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'workload' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Workload Rebalancing Suggestions</h3>
            <div className="space-y-4">
              {suggestions.filter(s => s.status === 'pending').map((suggestion) => (
                <div key={suggestion.id} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{getUserName(suggestion.from_user_id)}</span>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{getUserName(suggestion.to_user_id)}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                        suggestion.priority === 'urgent' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-orange-100 text-orange-800 border-orange-200'
                      }`}>
                        {suggestion.priority}
                      </span>
                    </div>
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>

                  <div className="mb-3">
                    <div className="text-sm font-medium text-gray-900 mb-1">{suggestion.task_type}</div>
                    <div className="text-sm text-gray-600 mb-2">{suggestion.reason}</div>
                    <div className="text-xs text-gray-500">
                      Estimated effort: {suggestion.estimated_hours} hours
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSuggestion(suggestion.id, 'accepted')}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Accept & Reassign
                    </button>
                    <button
                      onClick={() => handleSuggestion(suggestion.id, 'rejected')}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedTab === 'predictions' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictions.map((prediction, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-600 capitalize">{prediction.type}</span>
                      {getTrendIcon(prediction.trend)}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{prediction.title}</h4>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-700 mb-2">{prediction.value}</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          prediction.confidence >= 80 ? 'bg-green-600' :
                          prediction.confidence >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                        }`}
                        style={{ width: `${prediction.confidence}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600 font-medium">{prediction.confidence}%</span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <div className="text-xs font-medium text-blue-900 mb-1">Recommendation</div>
                  <div className="text-sm text-blue-800">{prediction.recommendation}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartAnalytics;
