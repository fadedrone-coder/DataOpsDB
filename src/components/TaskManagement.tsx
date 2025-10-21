import React, { useState } from 'react';
import { Plus, User, Calendar, Clock, MessageCircle, Users } from 'lucide-react';
import { TEAM_MEMBERS } from '../App';

interface Task {
  id: string;
  title: string;
  assignees: string[];
  createdBy: string;
  dueDate: string;
  status: 'todo' | 'inprogress' | 'done';
  description?: string;
  createdAt: Date;
  updates: Array<{
    id: string;
    user: string;
    message: string;
    timestamp: Date;
  }>;
}

interface TaskManagementProps {
  onNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error', from?: string) => void;
  currentUser: string;
}

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Review Kenya Claims Data',
    assignees: ['sophie', 'emmanuel'],
    createdBy: 'muyiwa',
    dueDate: '2025-01-24',
    status: 'todo',
    description: 'Analyze and validate claims data from Kenya operations',
    createdAt: new Date('2025-01-15'),
    updates: []
  },
  {
    id: '2',
    title: 'Update Provider Mapping System',
    assignees: ['daniel'],
    createdBy: 'muyiwa',
    dueDate: '2025-01-26',
    status: 'inprogress',
    description: 'Implement new mapping algorithms for healthcare providers',
    createdAt: new Date('2025-01-12'),
    updates: [
      {
        id: '1',
        user: 'daniel',
        message: 'Started working on the mapping algorithms',
        timestamp: new Date('2025-01-20T10:30:00')
      }
    ]
  },
  {
    id: '3',
    title: 'Generate Monthly Reports',
    assignees: ['hope'],
    createdBy: 'muyiwa',
    dueDate: '2025-01-20',
    status: 'done',
    description: 'Create comprehensive monthly performance reports',
    createdAt: new Date('2025-01-10'),
    updates: [
      {
        id: '2',
        user: 'hope',
        message: 'Reports completed and sent to team',
        timestamp: new Date('2025-01-20T16:45:00')
      }
    ]
  }
];

const TaskManagement: React.FC<TaskManagementProps> = ({ onNotification, currentUser }) => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newUpdate, setNewUpdate] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    assignees: [] as string[],
    dueDate: '',
    description: ''
  });

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-100 border-gray-300' },
    { id: 'inprogress', title: 'In Progress', color: 'bg-blue-50 border-blue-300' },
    { id: 'done', title: 'Done', color: 'bg-green-50 border-green-300' }
  ];

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || newTask.assignees.length === 0 || !newTask.dueDate) {
      onNotification('Please fill in all required fields', 'error');
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      assignees: newTask.assignees,
      createdBy: currentUser,
      dueDate: newTask.dueDate,
      status: 'todo',
      description: newTask.description,
      createdAt: new Date(),
      updates: []
    };

    setTasks([...tasks, task]);
    setNewTask({ title: '', assignees: [], dueDate: '', description: '' });
    setShowForm(false);
    
    // Simulate Slack notifications to assignees
    task.assignees.forEach(assigneeId => {
      const assignee = TEAM_MEMBERS.find(m => m.id === assigneeId);
      if (assignee) {
        onNotification(`📋 New task assigned: "${task.title}" - Due: ${new Date(task.dueDate).toLocaleDateString()}`, 'info', assignee.name);
      }
    });
  };

  const moveTask = (taskId: string, newStatus: 'todo' | 'inprogress' | 'done') => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, status: newStatus };
        
        // Add automatic update
        const update = {
          id: Date.now().toString(),
          user: currentUser,
          message: `Moved task to ${newStatus.toUpperCase()}`,
          timestamp: new Date()
        };
        updatedTask.updates = [...task.updates, update];
        
        // Notify task creator and other assignees
        const notifyUsers = [task.createdBy, ...task.assignees].filter(userId => userId !== currentUser);
        notifyUsers.forEach(userId => {
          const user = TEAM_MEMBERS.find(m => m.id === userId);
          if (user) {
            onNotification(`📝 Task "${task.title}" moved to ${newStatus.toUpperCase()}`, 'info', user.name);
          }
        });
        
        return updatedTask;
      }
      return task;
    }));
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      onNotification(`Task "${task.title}" moved to ${newStatus.toUpperCase()}`, 'success');
    }
  };

  const addTaskUpdate = (taskId: string) => {
    if (!newUpdate.trim()) return;
    
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const update = {
          id: Date.now().toString(),
          user: currentUser,
          message: newUpdate,
          timestamp: new Date()
        };
        
        // Notify task creator and other assignees
        const notifyUsers = [task.createdBy, ...task.assignees].filter(userId => userId !== currentUser);
        notifyUsers.forEach(userId => {
          const user = TEAM_MEMBERS.find(m => m.id === userId);
          if (user) {
            onNotification(`💬 Update on "${task.title}": ${newUpdate}`, 'info', user.name);
          }
        });
        
        return { ...task, updates: [...task.updates, update] };
      }
      return task;
    }));
    
    setNewUpdate('');
    onNotification('Update added successfully', 'success');
  };

  const getTasksByStatus = (status: 'todo' | 'inprogress' | 'done') => {
    return tasks.filter(task => task.status === status);
  };

  const getMyTasks = () => {
    return tasks.filter(task => 
      task.assignees.includes(currentUser) || task.createdBy === currentUser
    );
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  const getDueDateColor = (dueDate: string, status: string) => {
    if (status === 'done') return 'text-green-600';
    if (isOverdue(dueDate)) return 'text-red-600';
    if (new Date(dueDate).toDateString() === new Date().toDateString()) return 'text-amber-600';
    return 'text-gray-600';
  };

  const currentUserName = TEAM_MEMBERS.find(member => member.id === currentUser)?.name || currentUser;
  const myTasks = getMyTasks();
  const tasksAssignedToMe = tasks.filter(task => task.assignees.includes(currentUser));
  const tasksCreatedByMe = tasks.filter(task => task.createdBy === currentUser);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Clock className="h-6 w-6 mr-2 text-blue-600" />
            Task Management - {currentUserName}
          </h1>
          <p className="text-gray-600 mt-1">Organize and track team tasks with automated notifications</p>
          <div className="mt-2 text-sm text-blue-600">
            📋 Assigned to you: {tasksAssignedToMe.length} • Created by you: {tasksCreatedByMe.length} • Total: {myTasks.length}
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Task
        </button>
      </div>

      {/* Task Creation Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Create New Task</h3>
          <form onSubmit={handleSubmitTask} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assignees *</label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <select
                    multiple
                    value={newTask.assignees}
                    onChange={(e) => setNewTask({...newTask, assignees: Array.from(e.target.selectedOptions, option => option.value)})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {TEAM_MEMBERS.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.avatar} {member.name}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple assignees</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Add task description..."
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Task
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* My Tasks Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">📋 My Tasks Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Tasks Assigned to Me ({tasksAssignedToMe.length})</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {tasksAssignedToMe.map(task => {
                const creator = TEAM_MEMBERS.find(m => m.id === task.createdBy);
                return (
                  <div key={task.id} className="bg-white p-2 rounded border text-sm">
                    <div className="font-medium">{task.title}</div>
                    <div className="text-xs text-gray-500">
                      From: {creator?.avatar} {creator?.name} • Due: {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      task.status === 'done' ? 'bg-green-100 text-green-800' :
                      task.status === 'inprogress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                );
              })}
              {tasksAssignedToMe.length === 0 && (
                <p className="text-sm text-gray-500">No tasks assigned to you</p>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Tasks I Created ({tasksCreatedByMe.length})</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {tasksCreatedByMe.map(task => (
                <div key={task.id} className="bg-white p-2 rounded border text-sm">
                  <div className="font-medium">{task.title}</div>
                  <div className="text-xs text-gray-500">
                    Assignees: {task.assignees.map(id => TEAM_MEMBERS.find(m => m.id === id)?.name).join(', ')}
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    task.status === 'done' ? 'bg-green-100 text-green-800' :
                    task.status === 'inprogress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))}
              {tasksCreatedByMe.length === 0 && (
                <p className="text-sm text-gray-500">No tasks created by you</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map(column => (
          <div key={column.id} className={`rounded-lg border-2 ${column.color} p-4 min-h-96`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{column.title}</h3>
              <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                {getTasksByStatus(column.id as any).length}
              </span>
            </div>
            
            <div className="space-y-3">
              {getTasksByStatus(column.id as any).map(task => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-move"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('taskId', task.id);
                  }}
                >
                  <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                  {task.description && (
                    <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center text-gray-500 flex-wrap gap-1">
                      <Users className="h-3 w-3 mr-1" />
                      {task.assignees.map(assigneeId => {
                        const assignee = TEAM_MEMBERS.find(m => m.id === assigneeId);
                        return assignee ? (
                          <span key={assigneeId} className="text-xs bg-blue-100 text-blue-800 px-1 rounded">
                            {assignee.avatar} {assignee.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                    <div className={`flex items-center ${getDueDateColor(task.dueDate, task.status)}`}>
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mb-2">
                    Created by: {TEAM_MEMBERS.find(m => m.id === task.createdBy)?.name}
                  </div>
                  
                  {task.updates.length > 0 && (
                    <div className="text-xs text-blue-600 mb-2">
                      💬 {task.updates.length} update{task.updates.length !== 1 ? 's' : ''}
                    </div>
                  )}
                  
                  {isOverdue(task.dueDate) && task.status !== 'done' && (
                    <div className="mt-2 text-xs text-red-600 font-medium">
                      ⚠️ Overdue
                    </div>
                  )}
                  
                  {/* Quick Status Change Buttons */}
                  <div className="mt-3 flex gap-1">
                    {column.id !== 'todo' && (
                      <button
                        onClick={() => moveTask(task.id, 'todo')}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                      >
                        To Do
                      </button>
                    )}
                    {column.id !== 'inprogress' && (
                      <button
                        onClick={() => moveTask(task.id, 'inprogress')}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                      >
                        In Progress
                      </button>
                    )}
                    {column.id !== 'done' && (
                      <button
                        onClick={() => moveTask(task.id, 'done')}
                        className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
                      >
                        Done
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">{selectedTask.title}</h3>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Updates & Comments</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedTask.updates.map(update => {
                      const user = TEAM_MEMBERS.find(m => m.id === update.user);
                      return (
                        <div key={update.id} className="bg-gray-50 p-3 rounded">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">
                              {user?.avatar} {user?.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {update.timestamp.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{update.message}</p>
                        </div>
                      );
                    })}
                    {selectedTask.updates.length === 0 && (
                      <p className="text-sm text-gray-500">No updates yet</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Add Update</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newUpdate}
                      onChange={(e) => setNewUpdate(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Add an update..."
                      onKeyPress={(e) => e.key === 'Enter' && addTaskUpdate(selectedTask.id)}
                    />
                    <button
                      onClick={() => addTaskUpdate(selectedTask.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Summary */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Task Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{tasks.length}</div>
            <div className="text-sm text-gray-500">Total Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{getTasksByStatus('inprogress').length}</div>
            <div className="text-sm text-gray-500">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{getTasksByStatus('done').length}</div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {tasks.filter(t => isOverdue(t.dueDate) && t.status !== 'done').length}
            </div>
            <div className="text-sm text-gray-500">Overdue</div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="font-medium mb-2">My Tasks ({myTasks.length})</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {myTasks.filter(t => t.assignees.includes(currentUser)).length}
              </div>
              <div className="text-xs text-gray-500">Assigned to Me</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {myTasks.filter(t => t.createdBy === currentUser).length}
              </div>
              <div className="text-xs text-gray-500">Created by Me</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">
                {myTasks.filter(t => isOverdue(t.dueDate) && t.status !== 'done' && t.assignees.includes(currentUser)).length}
              </div>
              <div className="text-xs text-gray-500">My Overdue</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManagement;