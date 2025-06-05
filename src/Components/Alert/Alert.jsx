import React, { useState } from 'react';
import { AlertTriangle, Info, Bell, X, Settings } from 'lucide-react';

const Alert = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'Critical',
      title: 'Computer Networks - Critical Attendance Alert',
      message: 'Your attendance has dropped to 72%. You need to attend 3 more classes to reach 75%.',
      time: '2 hours ago',
      subject: 'Computer Networks',
      actions: ['View Subject', 'Calculate Required']
    },
    {
      id: 2,
      type: 'Critical',
      title: 'Attendance Goal Not Met',
      message: 'Your overall attendance has fallen below the 75% requirement. Immediate action needed.',
      time: '1 day ago',
      actions: ['View Dashboard', 'Create Action Plan']
    },
    {
      id: 3,
      type: 'Warning',
      title: 'Software Engineering - Approaching Threshold',
      message: "Your attendance is at 76%. Don't miss more than 1 class to stay above 75%.",
      time: '3 hours ago',
      subject: 'Software Engineering',
      actions: ['View Subject', 'Set Reminder']
    },
    {
      id: 4,
      type: 'Info',
      title: 'Weekly Attendance Summary',
      message: 'You attended 18 out of 20 classes this week (90% attendance). Great job!',
      time: '1 day ago',
      actions: ['View Report']
    }
  ]);

  const [activeTab, setActiveTab] = useState('All Alerts');
  const [unreadAlerts, setUnreadAlerts] = useState([1, 2, 3, 4]);

  const dismissAlert = (alertId) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
    setUnreadAlerts(unreadAlerts.filter(id => id !== alertId));
  };

  const markAllAsRead = () => {
    setUnreadAlerts([]);
  };

  const getAlertCounts = () => {
    const critical = alerts.filter(alert => alert.type === 'Critical').length;
    const warning = alerts.filter(alert => alert.type === 'Warning').length;
    const info = alerts.filter(alert => alert.type === 'Info').length;
    const unread = unreadAlerts.length;
    return { critical, warning, info, unread };
  };

  const getFilteredAlerts = () => {
    if (activeTab === 'All Alerts') return alerts;
    if (activeTab === 'Unread') return alerts.filter(alert => unreadAlerts.includes(alert.id));
    return alerts.filter(alert => alert.type === activeTab);
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'Critical':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'Warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'Info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getAlertBg = (type) => {
    switch (type) {
      case 'Critical':
        return 'bg-red-50 border-red-100';
      case 'Warning':
        return 'bg-yellow-50 border-yellow-100';
      case 'Info':
        return 'bg-blue-50 border-blue-100';
      default:
        return 'bg-gray-50 border-gray-100';
    }
  };

  const getAlertBadgeBg = (type) => {
    switch (type) {
      case 'Critical':
        return 'bg-red-100 text-red-700';
      case 'Warning':
        return 'bg-yellow-100 text-yellow-700';
      case 'Info':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const counts = getAlertCounts();
  const filteredAlerts = getFilteredAlerts();

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Alerts</h1>
          <p className="text-gray-600">Stay informed about your attendance status and important notifications</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={markAllAsRead}
            className="p-2 text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 hover:rounded-2xl hover:p-2"
          >
            Mark All as Read
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Alert Cards Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-red-50 border border-red-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{counts.critical}</div>
          <div className="text-sm font-medium text-gray-900 mb-1">Critical Alerts</div>
          <div className="text-sm text-gray-600">Below 75% threshold</div>
        </div>

        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{counts.warning}</div>
          <div className="text-sm font-medium text-gray-900 mb-1">Warning Alerts</div>
          <div className="text-sm text-gray-600">Close to threshold</div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Info className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{counts.info}</div>
          <div className="text-sm font-medium text-gray-900 mb-1">Info Alerts</div>
          <div className="text-sm text-gray-600">General updates</div>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5 text-gray-500" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{counts.unread}</div>
          <div className="text-sm font-medium text-gray-900 mb-1">Unread</div>
          <div className="text-sm text-gray-600">Require attention</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-8 mb-6 border-b border-gray-200">
        {['All Alerts', 'Critical', 'Warning', 'Info', 'Unread'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-1 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`${getAlertBg(alert.type)} border rounded-xl p-6 relative transition-all hover:shadow-sm`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                alert.type === 'Critical' ? 'bg-red-100' : 
                alert.type === 'Warning' ? 'bg-yellow-100' : 'bg-blue-100'
              }`}>
                {getAlertIcon(alert.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAlertBadgeBg(alert.type)}`}>
                    {alert.type}
                  </span>
                  {unreadAlerts.includes(alert.id) && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                
                <p className="text-gray-700 mb-4">{alert.message}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {alert.actions.map((action, index) => (
                      <button
                        key={index}
                        className={`text-sm font-medium hover:underline ${
                          index === 0 ? 'text-blue-600' : 'text-green-600'
                        }`}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">{alert.time}</span>
                </div>
              </div>
              
              <button
                onClick={() => dismissAlert(alert.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
          <p className="text-gray-500">There are no alerts in this category.</p>
        </div>
      )}
    </div>
  );
};

export default Alert;