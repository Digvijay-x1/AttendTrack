import React, { useState, useEffect } from 'react';
import { useAttendance } from '../../context/AttendanceContext';
import { useSubjects } from '../../context/SubjectContext';

const Dashboard = () => {
  const { attendanceHistory } = useAttendance();
  const { subjects } = useSubjects();
  
  const [isVisible, setIsVisible] = useState(false);
  const [animateChart, setAnimateChart] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState(null);

  useEffect(() => {
    setIsVisible(true);
    setTimeout(() => setAnimateChart(true), 200);
  }, []);

  // Generate line chart data from attendance history
  const generateAttendanceData = () => {
    // Group by week and calculate average
    const weeks = {};
    const now = new Date();
    
    // Last 6 weeks
    for (let i = 0; i < 6; i++) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7));
      const weekLabel = `Week ${6-i}`;
      weeks[weekLabel] = { count: 0, present: 0 };
    }
    
    // Process attendance history
    attendanceHistory.forEach(entry => {
      const entryDate = new Date(entry.date);
      const diffTime = Math.abs(now - entryDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const weekNum = Math.floor(diffDays / 7) + 1;
      
      if (weekNum <= 6) {
        const weekLabel = `Week ${6-weekNum+1}`;
        if (weeks[weekLabel]) {
          weeks[weekLabel].count++;
          if (entry.status === 'present') {
            weeks[weekLabel].present++;
          }
        }
      }
    });
    
    // Calculate percentages
    return Object.entries(weeks).map(([week, data]) => ({
      week,
      attendance: data.count > 0 ? Math.round((data.present / data.count) * 100) : 80 // fallback value
    }));
  };
  
  const attendanceData = generateAttendanceData();

  // Transform subjects data for pie chart
  const generateSubjectData = () => {
    return subjects.map((subject, index) => {
      // Assign fixed colors
      const colors = ['#10B981', '#3B82F6', '#EF4444', '#8B5CF6', '#F59E0B', '#06B6D4', '#EC4899'];
      return {
        name: subject.name,
        percentage: subject.attendance / 5, // Scale for pie chart
        color: colors[index % colors.length],
        attended: subject.attended,
        total: subject.totalClasses
      };
    });
  };
  
  const subjectData = generateSubjectData();

  // Calculate pie chart segments
  const calculatePieSegments = () => {
    const total = subjectData.reduce((sum, subject) => sum + subject.percentage, 0);
    let cumulativePercentage = 0;
    
    return subjectData.map((subject, index) => {
      const percentage = (subject.percentage / total) * 100;
      const startAngle = (cumulativePercentage / 100) * 360;
      const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
      cumulativePercentage += percentage;
      
      // Calculate path for pie slice
      const radius = 80;
      const centerX = 100;
      const centerY = 100;
      
      const startAngleRad = (startAngle - 90) * (Math.PI / 180);
      const endAngleRad = (endAngle - 90) * (Math.PI / 180);
      
      const x1 = centerX + radius * Math.cos(startAngleRad);
      const y1 = centerY + radius * Math.sin(startAngleRad);
      const x2 = centerX + radius * Math.cos(endAngleRad);
      const y2 = centerY + radius * Math.sin(endAngleRad);
      
      const largeArcFlag = percentage > 50 ? 1 : 0;
      
      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');
      
      return {
        ...subject,
        pathData,
        startAngle,
        endAngle,
        percentage
      };
    });
  };

  const pieSegments = calculatePieSegments();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600 text-lg">Track your attendance across all subjects and stay on top of your goals</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Overall Attendance */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                 <h3 className="text-sm text-gray-600 font-medium">Overall Attendance</h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">82.5%</div>
              </div>
             
             
            
             <div className="bg-blue-100 p-2 rounded-lg">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              
              </div>
              </div>
            
            <div className="text-green-600 text-sm font-medium">+2.1% from last week</div>
          </div>

          {/* Total Classes */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm text-gray-600 font-medium">Total Classes</h3>
              <div className="text-3xl font-bold text-gray-900 mb-2">156</div>
              </div>
              
              <div className="bg-gray-100 p-2 rounded-lg">
                <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            
            
            <div className="text-blue-600 text-sm font-medium">128 attended</div>
          </div>

          {/* Below 75% */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm text-gray-600 font-medium">Below 75%</h3>
              <div className="text-3xl font-bold text-red-600 mb-2">2</div>
              </div>
              
              <div className="bg-red-100 p-2 rounded-lg">
                <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            
            <div className=" text-red-600 text-sm font-medium">Needs attention</div>
          </div>

          {/* This Week */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                 <h3 className="text-sm text-gray-600 font-medium">This Week</h3>
              <div className="text-3xl font-bold text-green-600 mb-2">18/20</div>
              </div>
             
              <div className="bg-green-100 p-2 rounded-lg">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <div className="text-green-600 text-sm font-medium">90% attendance</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Attendance Trend Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Attendance Trend</h3>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option>Last 30 days</option>
                <option>Last 7 days</option>
                <option>Last 3 months</option>
              </select>
            </div>
            
            <div className="h-64 relative">
              <svg className="w-full h-full" viewBox="0 0 600 250">
                {/* Grid lines */}
                {[70, 75, 80, 85, 90, 95, 100].map((value) => (
                  <g key={value}>
                    <line
                      x1="60"
                      y1={220 - ((value - 70) / 30) * 160}
                      x2="540"
                      y2={220 - ((value - 70) / 30) * 160}
                      stroke="#f3f4f6"
                      strokeWidth="1"
                    />
                    <text
                      x="45"
                      y={225 - ((value - 70) / 30) * 160}
                      className="text-xs fill-gray-500"
                      textAnchor="end"
                    >
                      {value}
                    </text>
                  </g>
                ))}
                
                {/* Animated gradient area */}
                <defs>
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                
                {/* Area under the curve */}
                <path
                  d={`M 100 ${220 - ((78 - 70) / 30) * 160} 
                      L 180 ${220 - ((82 - 70) / 30) * 160}
                      L 260 ${220 - ((79 - 70) / 30) * 160}
                      L 340 ${220 - ((85 - 70) / 30) * 160}
                      L 420 ${220 - ((81 - 70) / 30) * 160}
                      L 500 ${220 - ((83 - 70) / 30) * 160}
                      L 500 220 L 100 220 Z`}
                  fill="url(#areaGradient)"
                  className={`transition-all duration-2000 ease-out ${
                    animateChart ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                
                {/* Main line */}
                <path
                  d={`M 100 ${220 - ((78 - 70) / 30) * 160} 
                      L 180 ${220 - ((82 - 70) / 30) * 160}
                      L 260 ${220 - ((79 - 70) / 30) * 160}
                      L 340 ${220 - ((85 - 70) / 30) * 160}
                      L 420 ${220 - ((81 - 70) / 30) * 160}
                      L 500 ${220 - ((83 - 70) / 30) * 160}`}
                  stroke="#3B82F6"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="800"
                  strokeDashoffset={animateChart ? "0" : "800"}
                  className="transition-all duration-2000 ease-out"
                />
                
                {/* Data points */}
                {attendanceData.map((point, index) => (
                  <circle
                    key={index}
                    cx={100 + index * 80}
                    cy={220 - ((point.attendance - 70) / 30) * 160}
                    r="4"
                    fill="#3B82F6"
                    className={`transition-all duration-1000 ${
                      animateChart ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                    }`}
                    style={{ transitionDelay: `${(index + 1) * 150}ms` }}
                  />
                ))}
                
                {/* Week labels */}
                {attendanceData.map((point, index) => (
                  <text
                    key={index}
                    x={100 + index * 80}
                    y={240}
                    className="text-xs fill-gray-500"
                    textAnchor="middle"
                  >
                    {point.week}
                  </text>
                ))}
              </svg>
            </div>
          </div>

          {/* Subject-wise Attendance Pie Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Subject-wise Attendance</h3>
              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">View All</button>
            </div>
            
            <div className="flex items-center justify-center mb-6 relative">
              <svg width="200" height="200" className="relative">
                {pieSegments.map((segment, index) => (
                  <g key={segment.name}>
                    <path
                      d={segment.pathData}
                      fill={segment.color}
                      className={`transition-all duration-1000 ease-out cursor-pointer ${
                        hoveredSegment === index ? 'opacity-90 scale-105' : 'opacity-100 scale-100'
                      }`}
                      style={{
                        transformOrigin: '100px 100px',
                        transitionDelay: `${index * 200}ms`,
                        opacity: animateChart ? 1 : 0
                      }}
                      onMouseEnter={() => setHoveredSegment(index)}
                      onMouseLeave={() => setHoveredSegment(null)}
                    />
                  </g>
                ))}
                
                {/* Center white circle for donut effect */}
                <circle
                  cx="100"
                  cy="100"
                  r="35"
                  fill="white"
                  className={`transition-all duration-1000 ${
                    animateChart ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                
                {/* Hover tooltip */}
                {hoveredSegment !== null && (
                  <g className="pointer-events-none">
                    <rect
                      x="75"
                      y="85"
                      width="50"
                      height="30"
                      rx="4"
                      fill="rgba(0,0,0,0.8)"
                      className="animate-fade-in"
                    />
                    <text
                      x="100"
                      y="96"
                      textAnchor="middle"
                      className="fill-white text-xs font-medium"
                    >
                      {pieSegments[hoveredSegment].name.split(' ')[0]}
                    </text>
                    <text
                      x="100"
                      y="108"
                      textAnchor="middle"
                      className="fill-white text-xs font-medium"
                    >
                      {pieSegments[hoveredSegment].attended}
                    </text>
                  </g>
                )}
              </svg>
            </div>
            
            <div className="space-y-3">
              {subjectData.map((subject, index) => (
                <div 
                  key={subject.name} 
                  className={`flex items-center justify-between transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                  }`}
                  style={{ transitionDelay: `${(index + 1) * 100}ms` }}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: subject.color }}
                    ></div>
                    <span className="text-sm text-gray-700">{subject.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{subject.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-900 font-medium">Attended Data Structures class</p>
                  <p className="text-gray-500 text-sm">Today, 10:00 AM</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-900 font-medium">Attended Operating Systems class</p>
                  <p className="text-gray-500 text-sm">Today, 8:00 AM</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-900 font-medium">Missed Computer Networks class</p>
                  <p className="text-gray-500 text-sm">Yesterday, 2:00 PM</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-900 font-medium">Attended Database Management class</p>
                  <p className="text-gray-500 text-sm">Yesterday, 11:00 AM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts & Notifications */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Alerts & Notifications</h3>
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="text-red-800 font-medium">Computer Networks: 72%</p>
                    <p className="text-red-700 text-sm">Below 75% threshold. Attend 3 more classes to reach 75%.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="text-yellow-800 font-medium">Software Engineering: 76%</p>
                    <p className="text-yellow-700 text-sm">Just above threshold. Don't miss more than 1 class.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-blue-800 font-medium">Upcoming: Data Structures</p>
                    <p className="text-blue-700 text-sm">Tomorrow, 10:00 AM - Room 301</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;