import { createContext, useContext, useState } from 'react';

// Create the context
const SubjectContext = createContext();

// Custom hook for using the context
export const useSubjects = () => useContext(SubjectContext);

export const SubjectProvider = ({ children }) => {
  // Subjects data
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

  // Stats calculated from subjects
  const totalSubjects = subjects.length;
  const activeSubjects = subjects.length;
  const weeklyClasses = subjects.reduce((total, subject) => {
    const days = subject.schedule.split('•')[0].split(',').length;
    return total + days;
  }, 0);
  const avgAttendance = Math.round(
    subjects.reduce((total, subject) => total + subject.attendance, 0) / subjects.length
  );

  // Subject operations
  const addSubject = (newSubject) => {
    if (newSubject.name.trim() === '') return;
    
    const subject = {
      id: Date.now(),
      name: newSubject.name,
      code: newSubject.code,
      professor: newSubject.professor,
      schedule: newSubject.schedule,
      totalClasses: 0,
      attended: 0,
      attendance: 0,
      status: 'New',
      color: 'gray'
    };
    
    setSubjects(prev => [...prev, subject]);
    return subject;
  };

  const updateSubject = (id, updatedData) => {
    if (!updatedData.name || updatedData.name.trim() === '') return null;
    
    const totalClassesNum = parseInt(updatedData.totalClasses) || 0;
    const attendedNum = parseInt(updatedData.attended) || 0;
    const attendancePercentage = totalClassesNum > 0 ? Math.round((attendedNum / totalClassesNum) * 100) : 0;
    
    let status = 'New';
    if (totalClassesNum > 0) {
      if (attendancePercentage >= 85) status = 'Above 75%';
      else if (attendancePercentage >= 75) status = 'Just Above 75%';
      else status = 'Below 75%';
    }
    
    let color = 'gray';
    if (attendancePercentage >= 85) color = 'green';
    else if (attendancePercentage >= 75) color = 'yellow';
    else if (totalClassesNum > 0) color = 'red';
    
    const updatedSubject = {
      ...updatedData,
      totalClasses: totalClassesNum,
      attended: attendedNum,
      attendance: attendancePercentage,
      status: status,
      color: color
    };
    
    setSubjects(prev => 
      prev.map(subject => subject.id === id ? { ...subject, ...updatedSubject } : subject)
    );
    
    return updatedSubject;
  };

  const deleteSubject = (id) => {
    setSubjects(prev => prev.filter(subject => subject.id !== id));
  };

  // Update subject attendance
  const updateSubjectAttendance = (subjectName, isPresent) => {
    setSubjects(prev => 
      prev.map(subject => {
        if (subject.name === subjectName) {
          const newAttended = subject.attended + (isPresent ? 1 : 0);
          const newTotal = subject.totalClasses + 1;
          const newAttendance = Math.round((newAttended / newTotal) * 100);
          
          let newStatus = 'New';
          if (newAttendance >= 85) newStatus = 'Above 75%';
          else if (newAttendance >= 75) newStatus = 'Just Above 75%';
          else newStatus = 'Below 75%';
          
          let newColor = 'gray';
          if (newAttendance >= 85) newColor = 'green';
          else if (newAttendance >= 75) newColor = 'yellow';
          else newColor = 'red';
          
          return {
            ...subject,
            totalClasses: newTotal,
            attended: newAttended,
            attendance: newAttendance,
            status: newStatus,
            color: newColor
          };
        }
        return subject;
      })
    );
  };

  return (
    <SubjectContext.Provider 
      value={{
        subjects,
        totalSubjects,
        activeSubjects,
        weeklyClasses,
        avgAttendance,
        addSubject,
        updateSubject,
        deleteSubject,
        updateSubjectAttendance,
        setSubjects
      }}
    >
      {children}
    </SubjectContext.Provider>
  );
};

export default SubjectContext; 