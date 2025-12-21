import React, { useState, useEffect } from 'react';
import { AlertTriangle, Download, Search, Filter, Zap, Database } from 'lucide-react';

interface SlackError {
  id: string;
  invId: string;
  errorMessage: string;
  timestamp: Date;
  source: 'slack' | 'system';
  status: 'new' | 'investigating' | 'resolved';
}

interface ErrorHandlerProps {
  onNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error', from?: string) => void;
  currentUser: string;
}

const INITIAL_ERRORS: SlackError[] = [
  {
    id: '1',
    invId: '1101556',
    errorMessage: 'The items field is required.',
    timestamp: new Date('2025-01-20T10:30:00'),
    source: 'slack',
    status: 'resolved'
  },
  {
    id: '2',
    invId: '1101557',
    errorMessage: 'Missing provider code.',
    timestamp: new Date('2025-01-20T11:15:00'),
    source: 'slack',
    status: 'investigating'
  },
  {
    id: '3',
    invId: '1101558',
    errorMessage: 'Invalid claim amount format.',
    timestamp: new Date('2025-01-20T14:22:00'),
    source: 'system',
    status: 'new'
  },
  {
    id: '4',
    invId: '1101559',
    errorMessage: 'Patient ID not found in database.',
    timestamp: new Date('2025-01-21T09:45:00'),
    source: 'slack',
    status: 'new'
  },
  {
    id: '5',
    invId: '1101560',
    errorMessage: 'Duplicate claim submission detected.',
    timestamp: new Date('2025-01-21T13:30:00'),
    source: 'system',
    status: 'new'
  }
];

const ErrorHandler: React.FC<ErrorHandlerProps> = ({ onNotification, currentUser }) => {
  const [errors, setErrors] = useState<SlackError[]>(INITIAL_ERRORS);
  const [filteredErrors, setFilteredErrors] = useState<SlackError[]>(INITIAL_ERRORS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  // Apply filters
  useEffect(() => {
    let filtered = [...errors];
    
    if (searchTerm) {
      filtered = filtered.filter(error => 
        error.invId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        error.errorMessage.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(error => error.status === statusFilter);
    }
    
    if (sourceFilter !== 'all') {
      filtered = filtered.filter(error => error.source === sourceFilter);
    }
    
    setFilteredErrors(filtered);
  }, [errors, searchTerm, statusFilter, sourceFilter]);

  // Simulate real-time error detection from Slack
  useEffect(() => {
    const simulateSlackError = () => {
      const newError: SlackError = {
        id: Date.now().toString(),
        invId: `110${Math.floor(Math.random() * 9000) + 1000}`,
        errorMessage: [
          'Failed to validate claim data.',
          'Connection timeout to provider API.',
          'Missing required field: diagnosis.',
          'Invalid date format in claim.',
          'Provider not authorized for this service.'
        ][Math.floor(Math.random() * 5)],
        timestamp: new Date(),
        source: 'slack',
        status: 'new'
      };
      
      setErrors(prev => [newError, ...prev]);
      onNotification(`New error detected: INV ID ${newError.invId}`, 'warning');
    };

    const interval = setInterval(simulateSlackError, 45000); // Add new error every 45 seconds
    return () => clearInterval(interval);
  }, [onNotification]);

  // Auto-resolve errors after some time (simulate n8n automation)
  useEffect(() => {
    const autoResolveErrors = () => {
      setErrors(prevErrors => 
        prevErrors.map(error => {
          // Auto-resolve errors that are older than 2 minutes and investigating
          const timeDiff = new Date().getTime() - error.timestamp.getTime();
          if (error.status === 'investigating' && timeDiff > 120000) { // 2 minutes
            onNotification(`✅ Auto-resolved: INV ID ${error.invId}`, 'success');
            return { ...error, status: 'resolved' as const };
          }
          return error;
        })
      );
    };

    const interval = setInterval(autoResolveErrors, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [onNotification]);

  const exportErrors = () => {
    const csv = [
      ['INV ID', 'Error Message', 'Timestamp', 'Source', 'Status'],
      ...filteredErrors.map(error => [
        error.invId,
        error.errorMessage,
        error.timestamp.toISOString(),
        error.source,
        error.status
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `errors-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    onNotification('Error data exported successfully', 'success');
  };

  const updateErrorStatus = (errorId: string, newStatus: 'new' | 'investigating' | 'resolved') => {
    setErrors(errors.map(error => 
      error.id === errorId ? { ...error, status: newStatus } : error
    ));
    
    const error = errors.find(e => e.id === errorId);
    if (error) {
      onNotification(`Error ${error.invId} marked as ${newStatus}`, 'info');
    }
  };

  const bulkResolveErrors = () => {
    const newErrors = errors.filter(e => e.status === 'new');
    if (newErrors.length === 0) {
      onNotification('No new errors to resolve', 'info');
      return;
    }
    
    setErrors(errors.map(error => 
      error.status === 'new' ? { ...error, status: 'resolved' } : error
    ));
    
    onNotification(`✅ Bulk resolved ${newErrors.length} errors`, 'success');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceIcon = (source: string) => {
    return source === 'slack' ? '💬' : '⚙️';
  };

  const getStatusCounts = () => {
    return {
      total: errors.length,
      new: errors.filter(e => e.status === 'new').length,
      investigating: errors.filter(e => e.status === 'investigating').length,
      resolved: errors.filter(e => e.status === 'resolved').length
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <AlertTriangle className="h-6 w-6 mr-2 text-red-600" />
            {departmentName} - Errors
          </h1>
          <p className="text-gray-600 mt-1">Monitor and manage errors from Slack notifications and system alerts</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={bulkResolveErrors}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Zap className="h-4 w-4 mr-2" />
            Bulk Resolve New
          </button>
          <button
            onClick={exportErrors}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Errors
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Database className="h-8 w-8 text-gray-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Errors</dt>
                <dd className="text-lg font-medium text-gray-900">{statusCounts.total}</dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">New Errors</dt>
                <dd className="text-lg font-medium text-red-900">{statusCounts.new}</dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Zap className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Investigating</dt>
                <dd className="text-lg font-medium text-yellow-900">{statusCounts.investigating}</dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Resolved</dt>
                <dd className="text-lg font-medium text-green-900">{statusCounts.resolved}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by INV ID or error message..."
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Sources</option>
              <option value="slack">Slack</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
      </div>

      {/* Errors Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">INV ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredErrors.map((error, index) => (
                <tr key={error.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600">#{error.invId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-md">{error.errorMessage}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {error.timestamp.toLocaleDateString()} {error.timestamp.toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <span className="mr-1">{getSourceIcon(error.source)}</span>
                      {error.source}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(error.status)}`}>
                      {error.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {error.status !== 'investigating' && (
                        <button
                          onClick={() => updateErrorStatus(error.id, 'investigating')}
                          className="text-yellow-600 hover:text-yellow-900 transition-colors"
                        >
                          Investigate
                        </button>
                      )}
                      {error.status !== 'resolved' && (
                        <button
                          onClick={() => updateErrorStatus(error.id, 'resolved')}
                          className="text-green-600 hover:text-green-900 transition-colors"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredErrors.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No errors found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' || sourceFilter !== 'all' 
                ? 'Try adjusting your filters.' 
                : 'Great! No errors to display.'}
            </p>
          </div>
        )}
      </div>

      {/* Real-time Monitoring Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Zap className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-blue-900">Real-time Monitoring Active</h3>
            <p className="text-sm text-blue-700 mt-1">
              🤖 n8n Integration: Monitoring Slack channels for error messages with 🚨 emoji. 
              Errors are auto-parsed, tracked, and can be auto-resolved based on patterns. 
              Investigating errors auto-resolve after 2 minutes if no manual intervention.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorHandler;