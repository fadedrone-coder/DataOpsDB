import React, { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, Loader, Download, X } from 'lucide-react';

interface ParsedOKR {
  objective: string;
  keyResults: Array<{
    description: string;
    target: number;
    unit: string;
    owner: string;
  }>;
  tasks: Array<{
    title: string;
    description: string;
    target: number;
    assignee: string;
    dueDate: string;
    priority: string;
  }>;
}

interface ExcelOKRUploadProps {
  departmentId: string;
  userId: string;
  onNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  onClose: () => void;
}

const ExcelOKRUpload: React.FC<ExcelOKRUploadProps> = ({
  departmentId,
  userId,
  onNotification,
  onClose,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedOKR[]>([]);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (
        selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        selectedFile.type === 'application/vnd.ms-excel'
      ) {
        setFile(selectedFile);
      } else {
        onNotification('Please upload a valid Excel file (.xlsx or .xls)', 'error');
      }
    }
  };

  const downloadTemplate = () => {
    onNotification('Template download started!', 'info');
  };

  const handleUpload = async () => {
    if (!file) {
      onNotification('Please select a file to upload', 'error');
      return;
    }

    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setProcessing(true);

      setTimeout(() => {
        const mockParsedData: ParsedOKR[] = [
          {
            objective: 'Improve Customer Satisfaction to 95%',
            keyResults: [
              {
                description: 'Achieve NPS score of 50+',
                target: 50,
                unit: 'points',
                owner: 'CS Team',
              },
              {
                description: 'Reduce response time to under 2 hours',
                target: 2,
                unit: 'hours',
                owner: 'Support Team',
              },
              {
                description: 'Resolve 90% of tickets on first contact',
                target: 90,
                unit: '%',
                owner: 'CS Team',
              },
            ],
            tasks: [
              {
                title: 'Implement automated customer feedback system',
                description: 'Set up post-interaction surveys',
                target: 1,
                assignee: 'Sophie',
                dueDate: '2024-11-30',
                priority: 'high',
              },
              {
                title: 'Train support team on new escalation protocols',
                description: 'Conduct 3 training sessions',
                target: 3,
                assignee: 'Emmanuel',
                dueDate: '2024-11-15',
                priority: 'urgent',
              },
              {
                title: 'Optimize ticket routing algorithm',
                description: 'Reduce routing time by 40%',
                target: 40,
                assignee: 'Hope',
                dueDate: '2024-12-15',
                priority: 'medium',
              },
            ],
          },
          {
            objective: 'Scale DataOps Operations by 200%',
            keyResults: [
              {
                description: 'Map 500+ healthcare providers',
                target: 500,
                unit: 'providers',
                owner: 'Mapping Team',
              },
              {
                description: 'Process 2000+ claims monthly',
                target: 2000,
                unit: 'claims',
                owner: 'Claims Team',
              },
            ],
            tasks: [
              {
                title: 'Complete Kenya provider mapping',
                description: 'Map all tier-1 providers in Nairobi',
                target: 150,
                assignee: 'Daniel',
                dueDate: '2024-11-30',
                priority: 'high',
              },
              {
                title: 'Automate claims validation workflow',
                description: 'Reduce manual review by 50%',
                target: 50,
                assignee: 'Morenikeji',
                dueDate: '2024-12-31',
                priority: 'urgent',
              },
            ],
          },
        ];

        setParsedData(mockParsedData);
        setProcessing(false);
        setUploadComplete(true);
        onNotification(
          `Successfully parsed ${mockParsedData.length} objectives and created ${mockParsedData.reduce((acc, okr) => acc + okr.tasks.length, 0)} tasks!`,
          'success'
        );
      }, 3000);
    }, 1500);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Upload Quarterly OKRs</h2>
            <p className="text-gray-600 text-sm">Upload your Excel file and let AI parse and create tasks</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {!uploadComplete ? (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-900 font-medium mb-1">
                    Excel Format Requirements
                  </p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Column A: Objective</li>
                    <li>• Column B: Key Result</li>
                    <li>• Column C: Target Value</li>
                    <li>• Column D: Owner/Assignee</li>
                    <li>• Column E: Due Date (optional)</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={downloadTemplate}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Download className="h-5 w-5" />
              Download Template
            </button>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
              <div className="text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <label className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-700 font-medium">
                    Click to upload
                  </span>
                  <span className="text-gray-600"> or drag and drop</span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".xlsx,.xls"
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-500 mt-2">Excel files only (.xlsx, .xls)</p>

                {file && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                    <FileSpreadsheet className="h-5 w-5 text-green-600" />
                    <span className="text-gray-900 font-medium">{file.name}</span>
                    <span className="text-gray-500">
                      ({(file.size / 1024).toFixed(2)} KB)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {(uploading || processing) && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Loader className="h-6 w-6 text-blue-600 animate-spin" />
                  <span className="font-medium text-gray-900">
                    {uploading ? 'Uploading file...' : 'AI is parsing your OKRs...'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {uploading
                    ? 'Please wait while we upload your file'
                    : 'Analyzing objectives, extracting key results, and creating tasks'}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!file || uploading || processing}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload & Process
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Upload Successful!</p>
                <p className="text-sm text-green-800">
                  {parsedData.length} objectives parsed and {parsedData.reduce((acc, okr) => acc + okr.tasks.length, 0)} tasks created
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Parsed OKRs & Tasks</h3>
              {parsedData.map((okr, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">{okr.objective}</h4>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Key Results:</p>
                    <div className="space-y-2">
                      {okr.keyResults.map((kr, krIdx) => (
                        <div key={krIdx} className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
                          <span className="text-gray-900">{kr.description}</span>
                          <span className="text-gray-600">
                            (Target: {kr.target} {kr.unit})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Auto-Generated Tasks ({okr.tasks.length}):
                    </p>
                    <div className="space-y-2">
                      {okr.tasks.map((task, taskIdx) => (
                        <div key={taskIdx} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-medium text-gray-900">{task.title}</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <span>Assignee: <span className="font-medium">{task.assignee}</span></span>
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                            <span>Target: {task.target}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcelOKRUpload;
