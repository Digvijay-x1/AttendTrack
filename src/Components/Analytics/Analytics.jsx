import { TrendingUp, CheckCircle, X, Star, ChevronDown } from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';
import { useSubjects } from '../../context/SubjectContext';
import { useEffect, useState } from 'react';

const Analytics = () => {
  const { attendanceHistory } = useAttendance();
  const { subjects, avgAttendance } = useSubjects();
  
  // Calculate statistics based on context data
  const [stats, setStats] = useState({
    overallAttendance: 0,
    classesAttended: 0,
    classesMissed: 0,
    totalClasses: 0,
    bestSubject: { name: '', attendance: 0 },
    weeklyPattern: [],
    timeSlotAnalysis: [],
    monthlySummary: { best: {}, lowest: {}, current: {}, improvement: 0 }
  });
  
  useEffect(() => {
    // Calculate overall stats
    const totalClasses = subjects.reduce((sum, subject) => sum + subject.totalClasses, 0);
    const classesAttended = subjects.reduce((sum, subject) => sum + subject.attended, 0);
    const classesMissed = totalClasses - classesAttended;
    
    // Find best subject
    let bestSubject = { name: '', attendance: 0 };
    subjects.forEach(subject => {
      if (subject.attendance > bestSubject.attendance) {
        bestSubject = { name: subject.name, attendance: subject.attendance };
      }
    });
    
    // Calculate weekly pattern (using sample data for now)
    const weeklyPattern = [
      { day: 'Monday', percentage: 85, color: 'bg-green-600' },
      { day: 'Tuesday', percentage: 90, color: 'bg-green-600' },
      { day: 'Wednesday', percentage: 75, color: 'bg-yellow-600' },
      { day: 'Thursday', percentage: 88, color: 'bg-green-600' },
      { day: 'Friday', percentage: 65, color: 'bg-red-600' }
    ];
    
    // Calculate time slot analysis (using sample data for now)
    const timeSlotAnalysis = [
      { time: '8:00 - 10:00 AM', percentage: 92, color: 'bg-green-600' },
      { time: '10:00 - 12:00 PM', percentage: 88, color: 'bg-green-600' },
      { time: '12:00 - 2:00 PM', percentage: 78, color: 'bg-yellow-600' },
      { time: '2:00 - 4:00 PM', percentage: 70, color: 'bg-red-600' },
      { time: '4:00 - 6:00 PM', percentage: 65, color: 'bg-red-600' }
    ];
    
    // Monthly summary (using sample data for now)
    const monthlySummary = {
      best: { month: 'September 2024', percentage: 94 },
      lowest: { month: 'November 2024', percentage: 68 },
      current: { month: 'December 2024', percentage: 82 },
      improvement: 7
    };
    
    setStats({
      overallAttendance: avgAttendance,
      classesAttended,
      classesMissed,
      totalClasses,
      bestSubject,
      weeklyPattern,
      timeSlotAnalysis,
      monthlySummary
    });
  }, [subjects, avgAttendance]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
            <p className="text-gray-600 text-lg">Detailed insights into your attendance patterns and trends</p>
          </div>
          <div className="flex flex-col md:flex-row gap-3 ">
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>This Semester</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </button>
          </div>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Overall Attendance */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4 ">
              <div>
                <h3 className="text-gray-600 font-medium">Overall Attendance</h3>
               <div className="text-3xl font-bold text-blue-600 mb-2">{stats.overallAttendance}%</div>
              </div>
              
               <div className="bg-blue-50 p-2 rounded-lg">
                <TrendingUp className="h-7 w-7 p-0.5 text-blue-600" />
              </div>
            </div>
    
           
            <div className="text-sm text-green-600 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              +2.1% vs last month
            </div>
          </div>

          {/* Classes Attended */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-gray-600 font-medium">Classes Attended</h3>
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.classesAttended}</div>
              </div>
              
              <div className="bg-green-50 p-2 rounded-lg">
                <CheckCircle className="h-7 w-7 p-0.5  text-green-600" />
              </div>
            </div>
            
            <div className="text-sm text-gray-600">Out of {stats.totalClasses} total</div>
          </div>

          {/* Classes Missed */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-gray-600 font-medium">Classes Missed</h3>
              <div className="text-3xl font-bold text-red-600 mb-2">{stats.classesMissed}</div>
              </div>
              
              <div className="bg-red-50 p-2 rounded-lg">
                <X className="h-7 w-7 text-red-600 m-0.5" />
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              {stats.totalClasses > 0 ? ((stats.classesMissed / stats.totalClasses) * 100).toFixed(1) : 0}% absence rate
            </div>
          </div>

          {/* Best Subject */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-gray-600 font-medium">Best Subject</h3>
              <div className="text-xl font-bold text-purple-600 mb-1">{stats.bestSubject.name}</div>
              </div>
              
              <div className="bg-purple-50 p-2 rounded-lg">
                <Star className="h-7 w-7 text-purple-600 m-0.5" />
              </div>
            </div>
            
            <div className="text-sm text-gray-600">{stats.bestSubject.attendance}% attendance</div>
          </div>
        </div>

        {/* Second Row - Weekly Pattern, Time Slot Analysis, Monthly Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Weekly Pattern */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Weekly Pattern</h3>
            <div className="space-y-4">
              {stats.weeklyPattern.map((item) => (
                <div key={item.day} className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium w-20">{item.day}</span>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${item.color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-gray-900 font-semibold w-10 text-right">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Time Slot Analysis */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Time Slot Analysis</h3>
            <div className="space-y-4">
              {stats.timeSlotAnalysis.map((item) => (
                <div key={item.time} className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium w-28 text-sm">{item.time}</span>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${item.color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-gray-900 font-semibold w-10 text-right">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Summary */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Monthly Summary</h3>
            <div className="space-y-4">
              {/* Best Month */}
              <div className="flex justify-between bg-green-50 rounded-lg p-4">
                <div>
                  <div className="text-sm text-green-700 font-medium mb-1">Best Month</div>
                  <div className="text-sm text-green-600 mb-2">{stats.monthlySummary.best.month}</div>
                </div>
                
                <div className="text-2xl font-bold text-green-700">{stats.monthlySummary.best.percentage}%</div>
              </div>

              {/* Lowest Month */}
              <div className="flex justify-between bg-red-50 rounded-lg p-4">
                <div>
                  <div className="text-sm text-red-700 font-medium mb-1">Lowest Month</div>
                  <div className="text-sm text-red-600 mb-2">{stats.monthlySummary.lowest.month}</div>
                </div>
                
                <div className="text-2xl font-bold text-red-700">{stats.monthlySummary.lowest.percentage}%</div>
              </div>

              {/* Current Month */}
              <div className="flex justify-between bg-blue-50 rounded-lg p-4">
                <div>
                  <div className="text-sm text-blue-700 font-medium mb-1">Current Month</div>
                  <div className="text-sm text-blue-600 mb-2">{stats.monthlySummary.current.month}</div>
                </div>
                
                <div className="text-2xl font-bold text-blue-700">{stats.monthlySummary.current.percentage}%</div>
              </div>

              {/* Improvement Needed */}
              <div className="mt-4">
                <div className="text-sm text-gray-600 mb-2">Improvement Needed</div>
                <div className="bg-gray-200 rounded-full h-2 mb-1">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${stats.monthlySummary.improvement}%` }}></div>
                </div>
                <div className="text-sm text-gray-600">{stats.monthlySummary.improvement}% to reach 89%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Subject-wise Detailed Analysis */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Subject-wise Detailed Analysis</h3>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg font-medium">All</button>
              <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Above 75%</button>
              <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Below 75%</button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">SUBJECT</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">ATTENDANCE %</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">CLASSES ATTENDED</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">TOTAL CLASSES</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">TREND</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">STATUS</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { 
                    subject: 'Data Structures', 
                    code: 'CS301', 
                    attendance: 85, 
                    attended: 29, 
                    total: 34, 
                    trend: '+2%', 
                    status: 'Above Target',
                    statusColor: 'text-green-700 bg-green-100',
                    barColor: 'bg-green-600'
                  },
                  { 
                    subject: 'Operating Systems', 
                    code: 'CS302', 
                    attendance: 88, 
                    attended: 22, 
                    total: 25, 
                    trend: '+5%', 
                    status: 'Above Target',
                    statusColor: 'text-green-700 bg-green-100',
                    barColor: 'bg-green-600'
                  },
                  { 
                    subject: 'Computer Networks', 
                    code: 'CS303', 
                    attendance: 72, 
                    attended: 21, 
                    total: 29, 
                    trend: '-3%', 
                    status: 'Below Target',
                    statusColor: 'text-red-700 bg-red-100',
                    barColor: 'bg-red-600'
                  },
                  { 
                    subject: 'Database Management', 
                    code: 'CS304', 
                    attendance: 90, 
                    attended: 27, 
                    total: 30, 
                    trend: '+1%', 
                    status: 'Above Target',
                    statusColor: 'text-green-700 bg-green-100',
                    barColor: 'bg-green-600'
                  },
                  { 
                    subject: 'Software Engineering', 
                    code: 'CS305', 
                    attendance: 76, 
                    attended: 19, 
                    total: 25, 
                    trend: '0%', 
                    status: 'Just Above',
                    statusColor: 'text-yellow-700 bg-yellow-100',
                    barColor: 'bg-yellow-600'
                  }
                ].map((subject, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-semibold text-gray-900">{subject.subject}</div>
                        <div className="text-sm text-gray-500">{subject.code}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${subject.barColor} h-2 rounded-full`}
                            style={{ width: `${subject.attendance}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold text-gray-900">{subject.attendance}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-900 font-medium">{subject.attended}</td>
                    <td className="py-4 px-4 text-gray-900 font-medium">{subject.total}</td>
                    <td className="py-4 px-4">
                      <span style={{ fontFamily: "Segoe UI, Arial, sans-serif" }} className={`flex items-center gap-1 text-sm ${subject.trend.includes('+') ? 'text-green-600' : subject.trend.includes('-') ? 'text-red-600' : 'text-gray-600'}`}>
                        {subject.trend.includes('+') ? '↗' : subject.trend.includes('-') ? '↘' : '—'} {subject.trend}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${subject.statusColor}`}>
                        {subject.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;