import { createContext, useContext, useState } from 'react';

// Create the context
const AttendanceContext = createContext();

// Custom hook for using the context
export const useAttendance = () => useContext(AttendanceContext);

export const AttendanceProvider = ({ children }) => {
  // Attendance state
  const [attendanceStatus, setAttendanceStatus] = useState({
    'data-structures': null,
    'operating-systems': 'present',
    'computer-networks': null
  });

  // Recent attendance entries
  const [recentEntries, setRecentEntries] = useState([
    {
      id: 1,
      name: 'Database Management',
      time: 'Today, 9:00 AM',
      status: 'present'
    },
    {
      id: 2,
      name: 'Software Engineering',
      time: 'Yesterday, 3:00 PM',
      status: 'absent'
    },
    {
      id: 3,
      name: 'Computer Networks',
      time: 'Yesterday, 2:00 PM',
      status: 'present'
    }
  ]);

  // Attendance history
  const [attendanceHistory, setAttendanceHistory] = useState([
    {
      id: 1,
      date: 'Nov 15, 2024',
      subject: 'Data Structures',
      time: '10:00 AM',
      status: 'present'
    },
    {
      id: 2,
      date: 'Nov 14, 2024',
      subject: 'Operating Systems',
      time: '11:30 AM',
      status: 'absent'
    }
  ]);

  // Today's classes
  const [todaysClasses, setTodaysClasses] = useState([
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
  ]);

  // Available subjects
  const [subjects, setSubjects] = useState([
    'Data Structures',
    'Operating Systems',
    'Computer Networks',
    'Database Management',
    'Software Engineering',
    'Computer Graphics',
    'Machine Learning'
  ]);

  // Attendance operations
  const handleAttendanceChange = (classId, status) => {
    setAttendanceStatus(prev => ({
      ...prev,
      [classId]: status
    }));
  };

  const addAttendanceEntry = (entry) => {
    const newEntry = {
      id: Date.now(),
      name: entry.subject,
      time: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      status: entry.status
    };
    
    setRecentEntries(prev => [newEntry, ...prev.slice(0, 2)]);
    
    // Also add to attendance history
    const historyEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      subject: entry.subject,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: entry.status
    };
    
    setAttendanceHistory(prev => [historyEntry, ...prev]);
  };

  const updateAttendanceEntry = (id, updatedEntry) => {
    setAttendanceHistory(prev => 
      prev.map(entry => 
        entry.id === id 
          ? { ...entry, ...updatedEntry }
          : entry
      )
    );
  };

  const addBulkAttendance = (entries) => {
    const newEntries = entries.map(entry => ({
      id: Date.now() + Math.random(),
      name: entry.className,
      time: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      status: entry.status
    }));
    
    setRecentEntries(prev => [...newEntries, ...prev].slice(0, 5));
    
    // Also add to attendance history
    const historyEntries = entries.map(entry => ({
      id: Date.now() + Math.random(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      subject: entry.className,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: entry.status
    }));
    
    setAttendanceHistory(prev => [...historyEntries, ...prev]);
  };

  return (
    <AttendanceContext.Provider 
      value={{
        attendanceStatus,
        recentEntries,
        attendanceHistory,
        todaysClasses,
        subjects,
        handleAttendanceChange,
        addAttendanceEntry,
        updateAttendanceEntry,
        addBulkAttendance,
        setAttendanceStatus,
        setRecentEntries,
        setAttendanceHistory,
        setTodaysClasses,
        setSubjects
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export default AttendanceContext; 