import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Clock, BarChart3, Download, Filter } from 'lucide-react';
import { TEAM_MEMBERS } from '../App';

interface ClaimsData {
  id: string;
  insurer: string;
  month: string;
  year: number;
  claimsReceived: number;
  claimsProcessed: number;
  averageProcessingTime: number; // in hours
  volumeGrowth: number; // percentage
}

interface ClaimsAnalysisProps {
  departmentSlug: string;
  departmentName: string;
  onNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error', from?: string) => void;
  currentUser: string;
  teamMembers?: any[];
}

const INSURERS = ['Kenya', 'Tanzania', 'Uganda', 'UAP Old Mutual', 'Leadway Assurance', 'AXA Mansard', 'AIICO Insurance', 'Hadiel Tech'];

const INITIAL_CLAIMS_DATA: ClaimsData[] = [
  { id: '1', insurer: 'Kenya', month: 'January', year: 2025, claimsReceived: 1450, claimsProcessed: 1420, averageProcessingTime: 15, volumeGrowth: 12.5 },
  { id: '2', insurer: 'Tanzania', month: 'January', year: 2025, claimsReceived: 890, claimsProcessed: 875, averageProcessingTime: 14, volumeGrowth: 8.3 },
  { id: '3', insurer: 'Uganda', month: 'January', year: 2025, claimsReceived: 1180, claimsProcessed: 1160, averageProcessingTime: 12, volumeGrowth: 15.2 },
  { id: '4', insurer: 'UAP Old Mutual', month: 'January', year: 2025, claimsReceived: 650, claimsProcessed: 640, averageProcessingTime: 16, volumeGrowth: 5.7 },
  { id: '5', insurer: 'Leadway Assurance', month: 'January', year: 2025, claimsReceived: 780, claimsProcessed: 765, averageProcessingTime: 18, volumeGrowth: 22.1 },
  { id: '6', insurer: 'AXA Mansard', month: 'January', year: 2025, claimsReceived: 920, claimsProcessed: 900, averageProcessingTime: 13, volumeGrowth: 18.9 },
  { id: '7', insurer: 'AIICO Insurance', month: 'January', year: 2025, claimsReceived: 540, claimsProcessed: 530, averageProcessingTime: 20, volumeGrowth: 3.2 },
  { id: '8', insurer: 'Hadiel Tech', month: 'January', year: 2025, claimsReceived: 320, claimsProcessed: 315, averageProcessingTime: 11, volumeGrowth: 45.8 },
];

const ClaimsAnalysis: React.FC<ClaimsAnalysisProps> = ({ departmentSlug, departmentName, onNotification, currentUser, teamMembers }) => {
  const [claimsData, setClaimsData] = useState<ClaimsData[]>(INITIAL_CLAIMS_DATA);
  const [filteredData, setFilteredData] = useState<ClaimsData[]>(INITIAL_CLAIMS_DATA);
  const [selectedInsurer, setSelectedInsurer] = useState('All Insurers');
  const [selectedYear, setSelectedYear] = useState('2025');

  // Apply filters
  useEffect(() => {
    let filtered = [...claimsData];
    
    if (selectedInsurer !== 'All Insurers') {
      filtered = filtered.filter(data => data.insurer === selectedInsurer);
    }
    
    if (selectedYear !== 'All Years') {
      filtered = filtered.filter(data => data.year.toString() === selectedYear);
    }
    
    setFilteredData(filtered);
  }, [claimsData, selectedInsurer, selectedYear]);

  // Simulate real-time data updates from insurer portals
  useEffect(() => {
    const simulatePortalData = () => {
      const randomInsurer = INSURERS[Math.floor(Math.random() * INSURERS.length)];
      const newData: ClaimsData = {
        id: Date.now().toString(),
        insurer: randomInsurer,
        month: 'January',
        year: 2025,
        claimsReceived: Math.floor(Math.random() * 500) + 300,
        claimsProcessed: Math.floor(Math.random() * 480) + 290,
        averageProcessingTime: Math.floor(Math.random() * 15) + 10,
        volumeGrowth: Math.floor(Math.random() * 30) + 5
      };
      
      setClaimsData(prev => [newData, ...prev]);
      onNotification(`📊 Portal sync: New claims data from ${randomInsurer}`, 'info');
    };

    const interval = setInterval(simulatePortalData, 90000); // Add new data every 1.5 minutes
    return () => clearInterval(interval);
  }, [onNotification]);

  const exportClaimsData = () => {
    const csv = [
      ['Insurer', 'Month', 'Year', 'Claims Received', 'Claims Processed', 'Avg Processing Time (hrs)', 'Volume Growth %', 'Efficiency %'],
      ...filteredData.map(d => [
        d.insurer,
        d.month,
        d.year,
        d.claimsReceived,
        d.claimsProcessed,
        d.averageProcessingTime,
        d.volumeGrowth,
        ((d.claimsProcessed / d.claimsReceived) * 100).toFixed(1)
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `claims-analysis-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    onNotification('Claims analysis data exported successfully', 'success');
  };

  const getTotalStats = () => {
    const totalReceived = filteredData.reduce((sum, d) => sum + d.claimsReceived, 0);
    const totalProcessed = filteredData.reduce((sum, d) => sum + d.claimsProcessed, 0);
    const avgProcessingTime = filteredData.length > 0 
      ? filteredData.reduce((sum, d) => sum + d.averageProcessingTime, 0) / filteredData.length 
      : 0;
    const avgGrowth = filteredData.length > 0 
      ? filteredData.reduce((sum, d) => sum + d.volumeGrowth, 0) / filteredData.length 
      : 0;
    
    return {
      totalReceived,
      totalProcessed,
      efficiency: totalReceived > 0 ? ((totalProcessed / totalReceived) * 100).toFixed(1) : '0',
      avgProcessingTime: avgProcessingTime.toFixed(1),
      avgGrowth: avgGrowth.toFixed(1)
    };
  };

  const currentUserName = TEAM_MEMBERS.find(member => member.id === currentUser)?.name || currentUser;
  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Target className="h-6 w-6 mr-2 text-purple-600" />
            Claims Volume Analysis - {currentUserName}
          </h1>
          <p className="text-gray-600 mt-1">Monitor claims volume, processing times, and growth trends across insurers</p>
        </div>
        <button
          onClick={exportClaimsData}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Export Analysis
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Insurer</label>
            <select
              value={selectedInsurer}
              onChange={(e) => setSelectedInsurer(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="All Insurers">All Insurers</option>
              {INSURERS.map(insurer => (
                <option key={insurer} value={insurer}>{insurer}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Received</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.totalReceived.toLocaleString()}</dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Processed</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.totalProcessed.toLocaleString()}</dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">%</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Efficiency</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.efficiency}%</dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Avg Processing</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.avgProcessingTime}h</dd>
              </dl>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Avg Growth</dt>
                <dd className="text-lg font-medium text-gray-900">+{stats.avgGrowth}%</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Claims Data Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Claims Volume & Processing Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insurer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claims Received</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claims Processed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Efficiency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Processing Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume Growth</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((data, index) => {
                const efficiency = ((data.claimsProcessed / data.claimsReceived) * 100);
                return (
                  <tr key={data.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {data.insurer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {data.month} {data.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                      {data.claimsReceived.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      {data.claimsProcessed.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2 w-16">
                          <div 
                            className={`h-2 rounded-full ${
                              efficiency >= 95 ? 'bg-green-500' :
                              efficiency >= 90 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${efficiency}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{efficiency.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-orange-500 mr-1" />
                        {data.averageProcessingTime}h
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        data.volumeGrowth >= 20 ? 'bg-green-100 text-green-800' :
                        data.volumeGrowth >= 10 ? 'bg-blue-100 text-blue-800' :
                        data.volumeGrowth >= 0 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +{data.volumeGrowth}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <Target className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No claims data found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your filters.</p>
          </div>
        )}
      </div>

      {/* Portal Integration Notice */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start">
          <Target className="h-5 w-5 text-purple-600 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-purple-900">Insurer Portal Integration</h3>
            <p className="text-sm text-purple-700 mt-1">
              🔄 Real-time sync with insurer portals (Kenya, Tanzania, Uganda, UAP Old Mutual, Leadway, AXA Mansard, AIICO, Hadiel Tech). 
              n8n workflows automatically fetch claims volume and processing time data every hour for accurate trend analysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimsAnalysis;