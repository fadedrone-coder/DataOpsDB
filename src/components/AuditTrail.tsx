import React, { useState, useEffect } from 'react';
import { Shield, Search, Filter, Download, Calendar, User, FileEdit, Trash2, Plus } from 'lucide-react';

interface AuditEntry {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  old_value: any;
  new_value: any;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

interface AuditTrailProps {
  onNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  currentUser: string;
  teamMembers: Array<{ id: string; name: string; role: string; avatar: string }>;
}

const AuditTrail: React.FC<AuditTrailProps> = ({ onNotification, currentUser, teamMembers }) => {
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);

  useEffect(() => {
    loadMockAuditLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [searchTerm, filterAction, filterUser, auditLogs]);

  const loadMockAuditLogs = () => {
    const mockLogs: AuditEntry[] = [
      {
        id: '1',
        user_id: 'sophie',
        action: 'CREATE',
        entity_type: 'metric',
        entity_id: 'metric-001',
        old_value: null,
        new_value: { type: 'Providers Mapped', value: 15, insurer: 'Kenya' },
        ip_address: '192.168.1.10',
        user_agent: 'Mozilla/5.0',
        created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        user_id: 'emmanuel',
        action: 'UPDATE',
        entity_type: 'task',
        entity_id: 'task-042',
        old_value: { status: 'pending', priority: 'medium' },
        new_value: { status: 'completed', priority: 'medium' },
        ip_address: '192.168.1.11',
        user_agent: 'Mozilla/5.0',
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        user_id: 'muyiwa',
        action: 'DELETE',
        entity_type: 'error',
        entity_id: 'error-123',
        old_value: { title: 'Data sync issue', severity: 'low' },
        new_value: null,
        ip_address: '192.168.1.5',
        user_agent: 'Mozilla/5.0',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '4',
        user_id: 'hope',
        action: 'UPDATE',
        entity_type: 'metric',
        entity_id: 'metric-089',
        old_value: { value: 45 },
        new_value: { value: 50 },
        ip_address: '192.168.1.15',
        user_agent: 'Mozilla/5.0',
        created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '5',
        user_id: 'daniel',
        action: 'CREATE',
        entity_type: 'task',
        entity_id: 'task-100',
        old_value: null,
        new_value: { title: 'Review Tanzania claims', priority: 'high', assignee: 'daniel' },
        ip_address: '192.168.1.20',
        user_agent: 'Mozilla/5.0',
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '6',
        user_id: 'morenikeji',
        action: 'UPDATE',
        entity_type: 'goal',
        entity_id: 'goal-007',
        old_value: { current_value: 30, status: 'in_progress' },
        new_value: { current_value: 50, status: 'completed' },
        ip_address: '192.168.1.18',
        user_agent: 'Mozilla/5.0',
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      },
    ];

    setAuditLogs(mockLogs);
  };

  const filterLogs = () => {
    let filtered = [...auditLogs];

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entity_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterAction !== 'all') {
      filtered = filtered.filter(log => log.action === filterAction);
    }

    if (filterUser !== 'all') {
      filtered = filtered.filter(log => log.user_id === filterUser);
    }

    setFilteredLogs(filtered);
  };

  const exportLogs = () => {
    const csv = [
      ['Timestamp', 'User', 'Action', 'Entity Type', 'Entity ID', 'IP Address'].join(','),
      ...filteredLogs.map(log => [
        new Date(log.created_at).toLocaleString(),
        log.user_id,
        log.action,
        log.entity_type,
        log.entity_id,
        log.ip_address,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-trail-${new Date().toISOString()}.csv`;
    a.click();

    onNotification('Audit trail exported successfully!', 'success');
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE':
        return <Plus className="h-4 w-4 text-green-600" />;
      case 'UPDATE':
        return <FileEdit className="h-4 w-4 text-blue-600" />;
      case 'DELETE':
        return <Trash2 className="h-4 w-4 text-red-600" />;
      default:
        return <FileEdit className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DELETE':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUserName = (userId: string) => {
    return teamMembers.find(m => m.id === userId)?.name || userId;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Audit Trail</h2>
          <p className="text-gray-600">Track all system changes and user activities</p>
        </div>
        <button
          onClick={exportLogs}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="h-5 w-5 mr-2" />
          Export Logs
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search logs..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All Actions</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
          </select>

          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All Users</option>
            {teamMembers.map(member => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </select>

          <div className="flex items-center px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
            <Shield className="h-5 w-5 text-gray-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">{filteredLogs.length} entries</span>
          </div>
        </div>

        <div className="space-y-2">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              onClick={() => setSelectedEntry(log)}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {getActionIcon(log.action)}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {log.entity_type}
                      </span>
                      <span className="text-sm text-gray-500">
                        ID: {log.entity_id}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {getUserName(log.user_id)}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                      <span>IP: {log.ip_address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedEntry(null)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">Audit Entry Details</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Action</label>
                  <div className={`mt-1 px-3 py-2 rounded-lg border ${getActionColor(selectedEntry.action)}`}>
                    {selectedEntry.action}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Entity Type</label>
                  <div className="mt-1 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 capitalize">
                    {selectedEntry.entity_type}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">User</label>
                <div className="mt-1 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                  {getUserName(selectedEntry.user_id)}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Timestamp</label>
                <div className="mt-1 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                  {new Date(selectedEntry.created_at).toLocaleString()}
                </div>
              </div>

              {selectedEntry.old_value && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Previous Value</label>
                  <pre className="mt-1 px-3 py-2 bg-red-50 rounded-lg border border-red-200 text-sm overflow-auto">
                    {JSON.stringify(selectedEntry.old_value, null, 2)}
                  </pre>
                </div>
              )}

              {selectedEntry.new_value && (
                <div>
                  <label className="text-sm font-medium text-gray-600">New Value</label>
                  <pre className="mt-1 px-3 py-2 bg-green-50 rounded-lg border border-green-200 text-sm overflow-auto">
                    {JSON.stringify(selectedEntry.new_value, null, 2)}
                  </pre>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">IP Address</label>
                  <div className="mt-1 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 font-mono text-sm">
                    {selectedEntry.ip_address}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Entity ID</label>
                  <div className="mt-1 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 font-mono text-sm">
                    {selectedEntry.entity_id}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditTrail;
