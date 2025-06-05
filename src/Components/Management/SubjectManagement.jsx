import { useState } from 'react';
import { Plus, Edit, Trash2, Book, Users, Clock, BarChart3 } from 'lucide-react';

export default function SubjectManagement() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [subjects, setSubjects] = useState([
    {
      id: 1,
      name: 'Data Structures',
      code: 'CS301',
      professor: 'Prof. Johnson',
      schedule: 'Mon, Wed, Fri • 10:00 AM',
      totalClasses: 34,
      attended: 29,
      attendance: 85,
      status: 'Above 75%',
      color: 'green'
    },
    {
      id: 2,
      name: 'Operating Systems',
      code: 'CS302',
      professor: 'Prof. Smith',
      schedule: 'Tue, Thu • 11:30 AM',
      totalClasses: 25,
      attended: 22,
      attendance: 88,
      status: 'Above 75%',
      color: 'blue'
    },
    {
      id: 3,
      name: 'Computer Networks',
      code: 'CS303',
      professor: 'Prof. Davis',
      schedule: 'Mon, Wed • 2:00 PM',
      totalClasses: 29,
      attended: 21,
      attendance: 72,
      status: 'Below 75%',
      color: 'red'
    },
    {
      id: 4,
      name: 'Database Management',
      code: 'CS304',
      professor: 'Prof. Wilson',
      schedule: 'Tue, Fri • 9:00 AM',
      totalClasses: 30,
      attended: 27,
      attendance: 90,
      status: 'Above 75%',
      color: 'green'
    },
    {
      id: 5,
      name: 'Software Engineering',
      code: 'CS305',
      professor: 'Prof. Brown',
      schedule: 'Thu, Fri • 3:00 PM',
      totalClasses: 25,
      attended: 19,
      attendance: 76,
      status: 'Just Above 75%',
      color: 'yellow'
    }
  ]);

  const totalSubjects = subjects.length;
  const activeSubjects = subjects.length;
  const weeklyClasses = subjects.reduce((total, subject) => {
    const days = subject.schedule.split('•')[0].split(',').length;
    return total + days;
  }, 0);
  const avgAttendance = Math.round(
    subjects.reduce((total, subject) => total + subject.attendance, 0) / subjects.length
  );

  const getProgressBarColor = (attendance) => {
    if (attendance >= 90) return 'bg-green-500';
    if (attendance >= 85) return 'bg-blue-500';
    if (attendance >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusColor = (status) => {
    if (status === 'Above 75%') return 'bg-green-100 text-green-800';
    if (status === 'Just Above 75%') return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Subject Management</h1>
            <p className="text-gray-600">Manage your subjects, schedules, and attendance goals</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            Add Subject
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Total Subjects</h3>  
               <p className="text-3xl font-bold text-gray-900">{totalSubjects}</p>
              </div>
              
            
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">

           <Book className="h-6 w-6 p-0.5 text-blue-500 bg-blue-100" />
            </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Active Subjects</h3>
              <p className="text-3xl font-bold text-green-600">{activeSubjects}</p>
              </div>
              
              
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
               <div className="h-5 w-5 bg-green-500 rounded flex items-center justify-center">
                <div className="h-2 w-2 bg-white rounded-full"></div>
              </div>
            </div>
           
              </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Weekly Classes</h3>
              <p className="text-3xl font-bold text-purple-600">{weeklyClasses}</p>
              </div>
              
              <div class="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-purple-500" />
              </div>
            
            
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-medium text-gray-600">Avg. Attendance</h3>
              <p className="text-3xl font-bold text-blue-600">{avgAttendance}%</p>
              </div>
              
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                 <BarChart3 className="h-5 w-5 text-blue-500" />
              </div>
            
           
            </div>
          </div>
        </div>

        {/* Subject Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <div key={subject.id} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{subject.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{subject.code} • {subject.professor}</p>
                  <p className="text-sm text-gray-500">{subject.schedule}</p>
                </div>
                <div className="flex gap-2">
                  <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Attendance</span>
                  <span className="text-sm font-bold text-gray-900">{subject.attendance}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getProgressBarColor(subject.attendance)}`}
                    style={{ width: `${subject.attendance}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{subject.totalClasses}</p>
                  <p className="text-xs text-gray-500">Total Classes</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{subject.attended}</p>
                  <p className="text-xs text-gray-500">Attended</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(subject.status)}`}>
                  {subject.status}
                </span>
              </div>
            </div>
          ))}

          {/* Add New Subject Card */}
          <div 
            onClick={() => setShowAddModal(true)}
            className="bg-white rounded-lg p-6 shadow-sm border-2 border-dashed border-gray-300 hover:border-blue-400 cursor-pointer transition-colors duration-200 flex flex-col items-center justify-center min-h-[300px]"
          >
            <div className="text-center">
              <div className="bg-gray-100 rounded-full p-4 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Add New Subject</h3>
              <p className="text-sm text-gray-500">Create a new subject to track attendance</p>
            </div>
          </div>
        </div>

        {/* Add Subject Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Subject</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Machine Learning"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject Code</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., CS306"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Professor</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Prof. Anderson"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
                  <input 
                    type="text" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Mon, Wed • 10:00 AM"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200"
                >
                  Add Subject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}