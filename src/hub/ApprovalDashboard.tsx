import React, { useState, useEffect } from 'react';
import { UserCheck, UserX, Clock, CheckCircle, XCircle, Users, Mail } from 'lucide-react';

interface PendingUser {
  id: string;
  email: string;
  fullName: string;
  departmentName: string;
  createdAt: string;
  requestedRole: string;
}

interface ApprovalDashboardProps {
  currentUser: any;
  onNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

const ApprovalDashboard: React.FC<ApprovalDashboardProps> = ({ currentUser, onNotification }) => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');

  useEffect(() => {
    loadPendingUsers();
  }, []);

  const loadPendingUsers = () => {
    const mockPendingUsers: PendingUser[] = [
      {
        id: '1',
        email: 'john.doe@curacel.com',
        fullName: 'John Doe',
        departmentName: 'Finance',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        requestedRole: 'user',
      },
      {
        id: '2',
        email: 'jane.smith@curacel.com',
        fullName: 'Jane Smith',
        departmentName: 'Engineering',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        requestedRole: 'user',
      },
      {
        id: '3',
        email: 'mike.johnson@curacel.com',
        fullName: 'Mike Johnson',
        departmentName: 'Customer Success',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        requestedRole: 'user',
      },
      {
        id: '4',
        email: 'sarah.wilson@curacel.com',
        fullName: 'Sarah Wilson',
        departmentName: 'DataOps',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        requestedRole: 'user',
      },
    ];

    if (currentUser.role === 'dept_lead') {
      setPendingUsers(mockPendingUsers.filter(u => u.departmentName === currentUser.departmentName));
    } else {
      setPendingUsers(mockPendingUsers);
    }
  };

  const handleAction = (user: PendingUser, action: 'approve' | 'reject') => {
    setSelectedUser(user);
    setActionType(action);
    setShowConfirm(true);
  };

  const confirmAction = () => {
    if (!selectedUser) return;

    setPendingUsers(pendingUsers.filter(u => u.id !== selectedUser.id));
    onNotification(
      `User ${actionType === 'approve' ? 'approved' : 'rejected'} successfully! Email notification sent.`,
      actionType === 'approve' ? 'success' : 'info'
    );
    setShowConfirm(false);
    setSelectedUser(null);
  };

  const canApprove = (user: PendingUser) => {
    if (currentUser.role === 'super_admin' || currentUser.role === 'people_ops') {
      return true;
    }
    if (currentUser.role === 'dept_lead') {
      return user.departmentName === currentUser.departmentName;
    }
    return false;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">User Approvals</h2>
        <p className="text-gray-600">Review and approve pending user registrations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Pending</span>
            <Clock className="h-5 w-5 text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">{pendingUsers.length}</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Approved Today</span>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">0</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total Users</span>
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-gray-900">24</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Pending Requests</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {pendingUsers.length === 0 ? (
            <div className="p-12 text-center">
              <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No pending approval requests</p>
            </div>
          ) : (
            pendingUsers.map((user) => (
              <div key={user.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{user.fullName}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 ml-13">
                      <span>Department: <span className="font-medium text-gray-900">{user.departmentName}</span></span>
                      <span>Role: <span className="font-medium text-gray-900 capitalize">{user.requestedRole}</span></span>
                      <span>Requested: {new Date(user.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {canApprove(user) && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleAction(user, 'approve')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <UserCheck className="h-4 w-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(user, 'reject')}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <UserX className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showConfirm && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              {actionType === 'approve' ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600" />
              )}
              <h3 className="text-xl font-bold text-gray-900">
                {actionType === 'approve' ? 'Approve User?' : 'Reject User?'}
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to {actionType} <span className="font-medium">{selectedUser.fullName}</span>'s
              registration request?
            </p>

            {actionType === 'approve' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 text-sm text-green-800">
                <p>• User will receive approval email</p>
                <p>• Access to {selectedUser.departmentName} dashboard</p>
                <p>• Can start tracking metrics immediately</p>
              </div>
            )}

            {actionType === 'reject' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 text-sm text-red-800">
                <p>• User will receive rejection email</p>
                <p>• Account will not be activated</p>
                <p>• They can reapply if needed</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                  actionType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalDashboard;
