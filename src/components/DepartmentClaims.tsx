import React, { useState } from 'react';
import { FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface DepartmentClaimsProps {
  departmentSlug: string;
  departmentName: string;
  onNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

const DepartmentClaims: React.FC<DepartmentClaimsProps> = ({
  departmentSlug,
  departmentName,
  onNotification,
}) => {
  const [claims, setclaims] = useState([
    {
      id: 'CLM-001',
      provider: 'Healthcare Provider A',
      amount: 5200,
      status: 'approved',
      date: '2024-02-15',
    },
    {
      id: 'CLM-002',
      provider: 'Healthcare Provider B',
      amount: 3800,
      status: 'pending',
      date: '2024-02-14',
    },
    {
      id: 'CLM-003',
      provider: 'Healthcare Provider C',
      amount: 2100,
      status: 'under_review',
      date: '2024-02-13',
    },
  ]);

  const statusConfig = {
    approved: { bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle2, text: 'Approved' },
    pending: { bg: 'bg-yellow-50', border: 'border-yellow-200', icon: Clock, text: 'Pending' },
    under_review: { bg: 'bg-blue-50', border: 'border-blue-200', icon: AlertCircle, text: 'Under Review' },
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Claims Analysis</h2>
        <p className="text-gray-600 mt-1">{departmentName} Department Claims</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Claims</p>
              <p className="text-3xl font-bold text-gray-900">247</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-3xl font-bold text-gray-900">198</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-3xl font-bold text-gray-900">$186K</p>
            </div>
            <FileText className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {claims.map((claim) => {
          const config = statusConfig[claim.status as keyof typeof statusConfig];
          const StatusIcon = config.icon;
          return (
            <div key={claim.id} className={`${config.bg} border ${config.border} rounded-lg p-4`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <StatusIcon className="h-5 w-5 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">{claim.id} - {claim.provider}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Amount: ${claim.amount.toLocaleString()} • {claim.date}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-white rounded text-sm font-medium text-gray-700">
                  {config.text}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DepartmentClaims;
