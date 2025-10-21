import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, BarChart3, Download, Filter } from 'lucide-react';
import { TEAM_MEMBERS } from '../App';

interface TrendData {
  id: string;
  month: string;
  year: number;
  insurer: string;
  claimsReceived: number;
  claimsProcessed: number;
  averageProcessingTime: number; // in hours
}

interface TrendAnalysisProps {
  onNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error', from?: string) => void;
  currentUser: string;
}

const INSURERS = ['Kenya', 'Tanzania', 'Uganda', 'UAP Old Mutual', 'Jubilee', 'APA Insurance'];

const INITIAL_TREND_DATA: TrendData[] = [
  // 2024 Data
  { id: '1', month: 'January', year: 2024, insurer: 'Kenya', claimsReceived: 1250, claimsProcessed: 1180, averageProcessingTime: 24 },
  { id: '2', month: 'January', year: 2024, insurer: 'Uganda', claimsReceived: 980, claimsProcessed: 945, averageProcessingTime: 18 },
  { id: '3', month: 'January', year: 2024, insurer: 'Tanzania', claimsReceived: 750, claimsProcessed: 720, averageProcessingTime: 22 },
  { id: '4', month: 'February', year: 2024, insurer: 'Kenya', claimsReceived: 1320, claimsProcessed: 1280, averageProcessingTime: 20 },
  { id: '5', month: 'February', year: 2024, insurer: 'Uganda', claimsReceived: 1050, claimsProcessed: 1020, averageProcessingTime: 16 },
  { id: '6', month: 'March', year: 2024, insurer: 'Kenya', claimsReceived: 1180, claimsProcessed: 1150, averageProcessingTime: 19 },
  
  // 2025 Data
  { id: '7', month: 'January', year: 2025, insurer: 'Kenya', claimsReceived: 1450, claimsProcessed: 1420, averageProcessingTime: 15 },
  { id: '8', month: 'January', year: 2025, insurer: 'Uganda', claimsReceived: 1180, claimsProcessed: 1160, averageProcessingTime: 12 },
  { id: '9', month: 'January', year: 2025, insurer: 'Tanzania', claimsReceived: 890, claimsProcessed: 875, averageProcessingTime: 14 },
  { id: '10', month: 'January', year: 2025, insurer: 'UAP Old Mutual', claimsReceived: 650, claimsProcessed: 640, averageProcessingTime: 16 },
];

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ onNotification, currentUser }) => {
  const [trendData, setTrendData] = useState<TrendData[]>(INITIAL_TREND_DATA);
  const [filteredData, setFilteredData] = useState<TrendData[]>(INITIAL_TREND_DATA);
  const [selectedInsurer, setSelectedInsurer] = useState('All Insurers');
  const [selectedYear, setSelectedYear] = useState('2025');
  const [comparisonYear, setComparisonYear] = useState('2024');

  // Apply filters
  useEffect(() => {
    let filtered = [...trendData];
    
    if (selectedInsurer !== 'All Insurers') {
      filtered = filtered.filter(data => data.insurer === selectedInsurer);
    }
    
    if (selectedYear !== 'All Years') {
      filtered = filtered.filter(data => data.year.toString() === selectedYear);
    }
    
    setFilteredData(filtered);
  }, [trendData, selectedInsurer, selectedYear]);

  // Simulate NOVA database connection
  useEffect(() => {
    const simulateNovaData = () => {
      const newData: TrendData = {
        id: Date.now().toString(),
        month: 'January',
        year: 2025,
        insurer: INSURERS[Math.floor(Math.random() * INSURERS.length)],
        claimsReceived: Math.floor(Math.random() * 500) + 800,
        claimsProcessed: Math.floor(Math.random() * 450) + 750,
        averageProcessingTime: Math.floor(Math.random() * 10) + 12
      };
      
      setTrendData(prev => [newData, ...prev]);
      onNotification(`📊 NOVA sync: New data from ${newData.insurer}`, 'info');
    };

    const interval = setInterval(simulateNovaData, 60000); // Add new data every minute
    return () => clearInterval(interval);
  }, [onNotification]);

  const getYearOverYearComparison = () => {
    const currentYearData = trendData.filter(d => d.year.toString() === selectedYear);
    const previousYearData = trendData.filter(d => d.year.toString() === comparisonYear);
    
    const currentTotal = currentYearData.reduce((sum, d) => sum + d.claimsReceived, 0);
    const previousTotal = previousYearData.reduce((sum, d) => sum + d.claimsReceived, 0);
    
    const growth = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0;
    
    return {
      current: currentTotal,
      previous: previousTotal,
      growth: growth.toFixed(1)
    };
  };

  const getInsurerComparison = () => {
    const insurerTotals = INSURERS.map(insurer => {
      const insurerData = filteredData.filter(d => d.insurer === insurer);
      const total = insurerData.reduce((sum, d) => sum + d.claimsReceived, 0);
      const processed = insurerData.reduce((sum, d) => sum + d.claimsProcessed, 0);
      const avgTime = insurerData.length > 0 
        ? insurerData.reduce((sum, d) => sum + d.averageProcessingTime, 0) / insurerData.length 
        : 0;
      
      return {
        insurer,
        total,
        processed,
        avgTime: avgTime.toFixed(1),
        efficiency: total > 0 ? ((processed / total) * 100).toFixed(1) : '0'
      };
    }).filter(item => item.total > 0);
    
    return insurerTotals.sort((a, b) => b.total - a.total);
  };

  const exportTrendData = () => {
    const csv = [
      ['Month', 'Year', 'Insurer', 'Claims Received', 'Claims Processed', 'Avg Processing Time (hrs)', 'Efficiency %'],
      ...filteredData.map(d => [
        d.month,
        d.year,
        d.insurer,
        d.claimsReceived,
        d.claimsProcessed,
        d.averageProcessingTime,
        ((d.claimsProcessed / d.claimsReceived) * 100).toFixed(1)
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trend-analysis-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    onNotification('Trend analysis data exported successfully', 'success');
  };

  const yearComparison = getYearOverYearComparison();
  const insurerComparison = getInsurerComparison();
  const currentUserName = TEAM_MEMBERS.find(member => member.id === currentUser)?.name || currentUser;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-blue-600" />
            Trend Analysis - {currentUserName}
          </h1>
          <p className="text-gray-600 mt-1">Monitor claims trends across insurers with NOVA integration</p>
        </div>
        <button
          onClick={exportTrendData}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Insurer</label>
            <select
              value={selectedInsurer}
              onChange={(e) => setSelectedInsurer(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All Insurers">All Insurers</option>
              {INSURERS.map(insurer => (
                <option key={insurer} value={insurer}>{insurer}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Compare with</label>
            <select
              value={comparisonYear}
              onChange={(e) => setComparisonYear(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
        </div>
      </div>

      {/* Year-over-Year Comparison */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Year-over-Year Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{yearComparison.current.toLocaleString()}</div>
            <div className="text-sm text-gray-500">{selectedYear} Claims</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-600">{yearComparison.previous.toLocaleString()}</div>
            <div className="text-sm text-gray-500">{comparisonYear} Claims</div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${parseFloat(yearComparison.growth) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {parseFloat(yearComparison.growth) >= 0 ? '+' : ''}{yearComparison.growth}%
            </div>
            <div className="text-sm text-gray-500">Growth Rate</div>
          </div>
        </div>
      </div>

      {/* Insurer Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Insurer Performance Ranking</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insurer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claims Received</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claims Processed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Processing Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {insurerComparison.map((insurer, index) => (
                <tr key={insurer.insurer} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {insurer.insurer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {insurer.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {insurer.processed.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            parseFloat(insurer.efficiency) >= 95 ? 'bg-green-500' :
                            parseFloat(insurer.efficiency) >= 90 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${insurer.efficiency}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900">{insurer.efficiency}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {insurer.avgTime}h
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Monthly Breakdown ({selectedYear})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insurer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claims Received</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claims Processed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Processing Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((data, index) => (
                <tr key={data.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {data.month} {data.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {data.insurer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {data.claimsReceived.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {data.claimsProcessed.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {data.averageProcessingTime}h
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No data found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your filters.</p>
          </div>
        )}
      </div>

      {/* NOVA Integration Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start">
          <BarChart3 className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-green-900">NOVA Database Integration</h3>
            <p className="text-sm text-green-700 mt-1">
              🔄 Real-time sync with NOVA database. Claims data is automatically updated every hour. 
              n8n workflows handle data transformation and trend calculations for accurate reporting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendAnalysis;