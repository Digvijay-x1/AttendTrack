import { useState } from 'react';
import { Check, Copy, Clock } from 'lucide-react';

export default function AttendanceInput() {
  const [attendanceStatus, setAttendanceStatus] = useState({
    'data-structures': null,
    'operating-systems': 'present',
    'computer-networks': null
  });

  const handleAttendanceChange = (classId, status) => {
    setAttendanceStatus(prev => ({
      ...prev,
      [classId]: status
    }));
  };

  const todaysClasses = [
    {
      id: 'data-structures',
      name: 'Data Structures',
      time: '10:00 AM - 11:00 AM',
      room: 'Room 301',
      professor: 'Prof. Johnson'
    },
    {
      id: 'operating-systems',
      name: 'Operating Systems',
      time: '11:30 AM - 12:30 PM',
      room: 'Room 205',
      professor: 'Prof. Smith'
    },
    {
      id: 'computer-networks',
      name: 'Computer Networks',
      time: '2:00 PM - 3:00 PM',
      room: 'Room 102',
      professor: 'Prof. Davis'
    }
  ];

  const recentEntries = [
    {
      name: 'Database Management',
      time: 'Today, 9:00 AM',
      status: 'present'
    },
    {
      name: 'Software Engineering',
      time: 'Yesterday, 3:00 PM',
      status: 'absent'
    },
    {
      name: 'Computer Networks',
      time: 'Yesterday, 2:00 PM',
      status: 'present'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance Input</h1>
          <p className="text-gray-600">Record your class attendance quickly and easily</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button className="bg-green-600 hover:bg-green-700 text-white rounded-lg p-6 text-left transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Mark Present</h3>
                <p className="text-green-100">Quick attendance entry</p>
              </div>
              <Check className="h-6 w-6" />
            </div>
          </button>

          <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-6 text-left transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Bulk Entry</h3>
                <p className="text-blue-100">Multiple classes at once</p>
              </div>
              <Copy className="h-6 w-6" />
            </div>
          </button>

          <button className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg p-6 text-left transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">View History</h3>
                <p className="text-purple-100">Past attendance records</p>
              </div>
              <Clock className="h-6 w-6" />
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Schedule */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Today's Schedule</h2>
                <p className="text-gray-600">Mark attendance for today's classes</p>
              </div>

              <div className="space-y-4">
                {todaysClasses.map((classItem) => (
                  <div key={classItem.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{classItem.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {classItem.time} • {classItem.room}
                        </p>
                        <p className="text-sm text-gray-500">{classItem.professor}</p>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        {attendanceStatus[classItem.id] === 'present' ? (
                          <span className="px-4 py-2 bg-green-100 text-green-800 rounded-md font-medium">
                            Present
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={() => handleAttendanceChange(classItem.id, 'present')}
                              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium transition-colors duration-200"
                            >
                              Present
                            </button>
                            <button
                              onClick={() => handleAttendanceChange(classItem.id, 'absent')}
                              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium transition-colors duration-200"
                            >
                              Absent
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Entries */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Recent Entries</h2>
                <p className="text-gray-600">Your latest attendance records</p>
              </div>

              <div className="space-y-4">
                {recentEntries.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        entry.status === 'present' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-900">{entry.name}</p>
                        <p className="text-sm text-gray-500">{entry.time}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-md text-sm font-medium ${
                      entry.status === 'present' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {entry.status === 'present' ? 'Present' : 'Absent'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}