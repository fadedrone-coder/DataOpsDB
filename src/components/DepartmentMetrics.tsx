import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Plus, Calendar } from 'lucide-react';

interface DepartmentMetricsProps {
  departmentSlug: string;
  metricTypes: string[];
  onNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

const DepartmentMetrics: React.FC<DepartmentMetricsProps> = ({ departmentSlug, metricTypes, onNotification }) => {
  const [showAddMetric, setShowAddMetric] = useState(false);
  const [selectedMetricType, setSelectedMetricType] = useState('');
  const [metricValue, setMetricValue] = useState('');

  const getDepartmentSpecificMetrics = () => {
    const baseMetrics: Record<string, any[]> = {
      'dataops': [
        { name: 'Providers Mapped', value: 1247, target: 1500, trend: 12, period: 'This Month' },
        { name: 'Care Items Mapped', value: 3421, target: 4000, trend: 8, period: 'This Month' },
        { name: 'Claims Checked', value: 892, target: 1000, trend: -5, period: 'This Week' },
        { name: 'Items Grouped', value: 2156, target: 2500, trend: 15, period: 'This Month' },
      ],
      'finance': [
        { name: 'Revenue Processed', value: 2400000, target: 3000000, trend: 18, period: 'This Quarter', unit: '₦' },
        { name: 'Invoices Generated', value: 156, target: 200, trend: 12, period: 'This Month' },
        { name: 'Budget Utilization', value: 78, target: 100, trend: 5, period: 'YTD', unit: '%' },
        { name: 'Payment Collections', value: 1890000, target: 2000000, trend: 22, period: 'This Quarter', unit: '₦' },
      ],
      'customer-success': [
        { name: 'Tickets Resolved', value: 342, target: 400, trend: 15, period: 'This Month' },
        { name: 'CSAT Score', value: 4.6, target: 5.0, trend: 8, period: 'This Month', unit: '/5' },
        { name: 'NPS Score', value: 68, target: 75, trend: -3, period: 'This Quarter' },
        { name: 'Churn Rate', value: 2.4, target: 2.0, trend: -12, period: 'This Month', unit: '%' },
      ],
      'engineering': [
        { name: 'Sprint Velocity', value: 87, target: 100, trend: 12, period: 'Last Sprint', unit: 'pts' },
        { name: 'Bugs Resolved', value: 124, target: 150, trend: 18, period: 'This Sprint' },
        { name: 'Deployments', value: 24, target: 30, trend: 8, period: 'This Month' },
        { name: 'Code Reviews', value: 89, target: 100, trend: 15, period: 'This Month' },
      ],
      'product-health': [
        { name: 'Feature Releases', value: 12, target: 15, trend: 20, period: 'This Quarter' },
        { name: 'User Adoption', value: 68, target: 80, trend: 12, period: 'This Month', unit: '%' },
        { name: 'A/B Tests Run', value: 8, target: 10, trend: -10, period: 'This Month' },
        { name: 'User Feedback', value: 234, target: 300, trend: 25, period: 'This Month' },
      ],
      'product-auto': [
        { name: 'Feature Releases', value: 9, target: 12, trend: 15, period: 'This Quarter' },
        { name: 'User Adoption', value: 72, target: 85, trend: 18, period: 'This Month', unit: '%' },
        { name: 'A/B Tests Run', value: 6, target: 10, trend: -5, period: 'This Month' },
        { name: 'User Feedback', value: 189, target: 250, trend: 28, period: 'This Month' },
      ],
      'people-ops': [
        { name: 'Employees Onboarded', value: 8, target: 10, trend: 12, period: 'This Month' },
        { name: 'Training Sessions', value: 15, target: 20, trend: 8, period: 'This Month' },
        { name: 'Performance Reviews', value: 42, target: 50, trend: 22, period: 'This Quarter' },
        { name: 'Recruitment Pipeline', value: 28, target: 35, trend: 15, period: 'Active' },
      ],
      'commercial': [
        { name: 'Leads Generated', value: 456, target: 600, trend: 28, period: 'This Month' },
        { name: 'Campaign ROI', value: 3.2, target: 4.0, trend: 15, period: 'This Quarter', unit: 'x' },
        { name: 'Website Traffic', value: 24500, target: 30000, trend: 18, period: 'This Month' },
        { name: 'Conversions', value: 189, target: 250, trend: 22, period: 'This Month' },
      ],
    };

    return baseMetrics[departmentSlug] || baseMetrics['dataops'];
  };

  const metrics = getDepartmentSpecificMetrics();

  const handleAddMetric = () => {
    if (!selectedMetricType || !metricValue) {
      onNotification('Please fill in all fields', 'error');
      return;
    }

    onNotification(`${selectedMetricType}: ${metricValue} recorded successfully!`, 'success');
    setShowAddMetric(false);
    setSelectedMetricType('');
    setMetricValue('');
  };

  const formatValue = (value: number, unit?: string) => {
    if (unit === '₦') {
      return `₦${value.toLocaleString()}`;
    }
    if (unit === '%' || unit === '/5' || unit === 'x' || unit === 'pts') {
      return `${value.toLocaleString()}${unit}`;
    }
    return value.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Department Metrics</h2>
          <p className="text-gray-600">Track your key performance indicators</p>
        </div>
        <button
          onClick={() => setShowAddMetric(!showAddMetric)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Metric
        </button>
      </div>

      {showAddMetric && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Record New Metric</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Metric Type</label>
              <select
                value={selectedMetricType}
                onChange={(e) => setSelectedMetricType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Select metric...</option>
                {metricTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
              <input
                type="number"
                value={metricValue}
                onChange={(e) => setMetricValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Enter value..."
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleAddMetric}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Save Metric
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => {
          const progress = (metric.value / metric.target) * 100;
          const isPositiveTrend = metric.trend > 0;

          return (
            <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{metric.name}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {formatValue(metric.value, metric.unit)}
                  </p>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
                  isPositiveTrend ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {isPositiveTrend ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>{Math.abs(metric.trend)}%</span>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Target: {formatValue(metric.target, metric.unit)}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      progress >= 80 ? 'bg-green-500' : progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                <span>{metric.period}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DepartmentMetrics;
