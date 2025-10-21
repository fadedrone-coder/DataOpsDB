import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  from?: string;
}

interface NotificationsProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ notifications, onRemove }) => {
  useEffect(() => {
    if (notifications.length === 0) return;

    const timers = notifications.map(notification => {
      const timer = window.setTimeout(() => {
        onRemove(notification.id);
      }, 5000);
      return { id: notification.id, timer };
    });

    return () => {
      timers.forEach(({ timer }) => window.clearTimeout(timer));
    };
  }, [notifications, onRemove]);
  if (notifications.length === 0) return null;

  const getNotificationStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {notifications.slice(0, 5).map((notification) => (
        <div
          key={notification.id}
          className={`max-w-sm w-full border rounded-lg shadow-lg p-4 animate-slide-in ${getNotificationStyles(notification.type)}`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="ml-3 w-0 flex-1">
              {notification.from && (
                <p className="text-xs font-medium opacity-75 mb-1">
                  📱 Slack → {notification.from}
                </p>
              )}
              <p className="text-sm font-medium">{notification.message}</p>
              <p className="text-xs opacity-75 mt-1">
                {notification.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;