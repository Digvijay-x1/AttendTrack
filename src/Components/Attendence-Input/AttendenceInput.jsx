import { useState } from 'react';
import { Check, Copy, Clock, X, Calendar, Edit } from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';
import { useSubjects } from '../../context/SubjectContext';

export default function AttendanceInput() {
  // Get attendance and subject data from context
  const { 
    attendanceStatus, 
    recentEntries, 
    attendanceHistory,
    todaysClasses,
    subjects: subjectsList,
    handleAttendanceChange,
    addAttendanceEntry,
    updateAttendanceEntry,
    addBulkAttendance
  } = useAttendance();
  
  const { updateSubjectAttendance } = useSubjects();

  // Local component state
  const [showModal, setShowModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const [modalData, setModalData] = useState({
    subject: '',
    date: '',
    status: 'present'
  });

  const [editData, setEditData] = useState({
    id: null,
    date: '',
    subject: '',
    time: '',
    status: 'present'
  });

  const [bulkData, setBulkData] = useState({
    startDate: '',
    endDate: '',
    classes: {
      'Data Structures': { selected: false, status: 'present' },
      'Operating Systems': { selected: false, status: 'present' },
      'Computer Networks': { selected: false, status: 'present' }
    }
  });

  const [historyData, setHistoryData] = useState({
    subject: 'All Subjects',
    date: ''
  });

  // Update to use context handleAttendanceChange
  const handleAttendanceStatusChange = (classId, status) => {
    handleAttendanceChange(classId, status);
    
    // Also update subject attendance in SubjectContext
    const subject = todaysClasses.find(c => c.id === classId);
    if (subject) {
      updateSubjectAttendance(subject.name, status === 'present');
    }
  };

  const openModal = () => {
    setShowModal(true);
    setModalData({
      subject: '',
      date: new Date().toISOString().split('T')[0],
      status: 'present'
    });
  };

  const openBulkModal = () => {
    setShowBulkModal(true);
    setBulkData({
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      classes: {
        'Data Structures': { selected: false, status: 'present' },
        'Operating Systems': { selected: false, status: 'present' },
        'Computer Networks': { selected: false, status: 'present' }
      }
    });
  };

  const openHistoryModal = () => {
    setShowHistoryModal(true);
    setHistoryData({
      subject: 'All Subjects',
      date: ''
    });
  };

  const openEditModal = (entry) => {
    setEditData({
      id: entry.id,
      date: entry.date,
      subject: entry.subject,
      time: entry.time,
      status: entry.status
    });
    setShowEditModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const closeBulkModal = () => {
    setShowBulkModal(false);
  };

  const closeHistoryModal = () => {
    setShowHistoryModal(false);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const handleSave = () => {
    if (modalData.subject && modalData.date) {
      // Use context method to add attendance entry
      addAttendanceEntry({
        subject: modalData.subject,
        date: modalData.date,
        status: modalData.status
      });
      
      // Also update subject attendance in SubjectContext
      updateSubjectAttendance(modalData.subject, modalData.status === 'present');
      
      closeModal();
    }
  };

  const handleEditSave = () => {
    if (editData.subject && editData.date) {
      // Use context method to update attendance entry
      updateAttendanceEntry(editData.id, {
        subject: editData.subject,
        date: editData.date,
        status: editData.status,
        time: editData.time
      });
      
      closeEditModal();
    }
  };

  const handleBulkSave = () => {
    const selectedClasses = Object.entries(bulkData.classes)
      .filter(([_, data]) => data.selected);
    
    if (selectedClasses.length > 0) {
      // Format data for context method
      const entries = selectedClasses.map(([className, data]) => ({
        className,
        status: data.status
      }));
      
      // Use context method to add bulk attendance
      addBulkAttendance(entries);
      
      // Also update subject attendance in SubjectContext for each entry
      entries.forEach(entry => {
        updateSubjectAttendance(entry.className, entry.status === 'present');
      });
      
      closeBulkModal();
    }
  };

  const handleBulkClassToggle = (className) => {
    setBulkData(prev => ({
      ...prev,
      classes: {
        ...prev.classes,
        [className]: {
          ...prev.classes[className],
          selected: !prev.classes[className].selected
        }
      }
    }));
  };

  const handleBulkStatusChange = (className, status) => {
    setBulkData(prev => ({
      ...prev,
      classes: {
        ...prev.classes,
        [className]: {
          ...prev.classes[className],
          status: status
        }
      }
    }));
  };

  // We now get todaysClasses and subjects from context

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
          <button 
            onClick={openModal}
            className="bg-green-600 hover:bg-green-700 text-white rounded-lg p-6 text-left transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Mark Present</h3>
                <p className="text-green-100">Quick attendance entry</p>
              </div>
              <Check className="h-6 w-6" />
            </div>
          </button>

          <button 
            onClick={openBulkModal}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-6 text-left transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Bulk Entry</h3>
                <p className="text-blue-100">Multiple classes at once</p>
              </div>
              <Copy className="h-6 w-6" />
            </div>
          </button>

          <button 
            onClick={openHistoryModal}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg p-6 text-left transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
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
                        ) : attendanceStatus[classItem.id] === 'absent' ? (
                          <span className="px-4 py-2 bg-red-100 text-red-800 rounded-md font-medium">
                            Absent
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={() => handleAttendanceStatusChange(classItem.id, 'present')}
                              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium transition-colors duration-200"
                            >
                              Present
                            </button>
                            <button
                              onClick={() => handleAttendanceStatusChange(classItem.id, 'absent')}
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

      {/* Quick Mark Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 transition-opacity duration-300"
            onClick={closeModal}
          ></div>
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-500">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Quick Mark Attendance</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  value={modalData.subject}
                  onChange={(e) => setModalData(prev => ({...prev, subject: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={modalData.date}
                    onChange={(e) => setModalData(prev => ({...prev, date: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Status
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="present"
                      checked={modalData.status === 'present'}
                      onChange={(e) => setModalData(prev => ({...prev, status: e.target.value}))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Present</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="absent"
                      checked={modalData.status === 'absent'}
                      onChange={(e) => setModalData(prev => ({...prev, status: e.target.value}))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Absent</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 transition-opacity duration-300"
            onClick={closeEditModal}
          ></div>
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-500">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Edit Attendance</h2>
              <button
                onClick={closeEditModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  value={editData.subject}
                  onChange={(e) => setEditData(prev => ({...prev, subject: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={editData.date}
                    onChange={(e) => setEditData(prev => ({...prev, date: e.target.value}))}
                    placeholder="e.g., Nov 15, 2024"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="text"
                  value={editData.time}
                  onChange={(e) => setEditData(prev => ({...prev, time: e.target.value}))}
                  placeholder="e.g., 10:00 AM"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Status
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="editStatus"
                      value="present"
                      checked={editData.status === 'present'}
                      onChange={(e) => setEditData(prev => ({...prev, status: e.target.value}))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Present</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="editStatus"
                      value="absent"
                      checked={editData.status === 'absent'}
                      onChange={(e) => setEditData(prev => ({...prev, status: e.target.value}))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Absent</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button
                onClick={closeEditModal}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Entry Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 transition-opacity duration-300"
            onClick={closeBulkModal}
          ></div>
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 transform transition-all duration-500">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Bulk Attendance Entry</h2>
              <button
                onClick={closeBulkModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Date Range
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="mm/dd/yyyy"
                      value={bulkData.startDate}
                      onChange={(e) => setBulkData(prev => ({...prev, startDate: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                    <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="mm/dd/yyyy"
                      value={bulkData.endDate}
                      onChange={(e) => setBulkData(prev => ({...prev, endDate: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                    <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Select Classes
                </label>
                <div className="space-y-4">
                  {Object.entries(bulkData.classes).map(([className, data]) => (
                    <div key={className} className="flex items-center justify-between py-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={data.selected}
                          onChange={() => handleBulkClassToggle(className)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm text-gray-700">{className}</span>
                      </label>
                      <select
                        value={data.status}
                        onChange={(e) => handleBulkStatusChange(className, e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button
                onClick={closeBulkModal}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkSave}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
              >
                Save All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 transition-opacity duration-300"
            onClick={closeHistoryModal}
          ></div>
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 transform transition-all duration-500">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Attendance History</h2>
              <button
                onClick={closeHistoryModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex gap-4 mb-6">
                <select
                  value={historyData.subject}
                  onChange={(e) => setHistoryData(prev => ({...prev, subject: e.target.value}))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option value="All Subjects">All Subjects</option>
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    value={historyData.date}
                    onChange={(e) => setHistoryData(prev => ({...prev, date: e.target.value}))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Subject</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Time</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceHistory.map((entry, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-4 px-4 text-gray-900">{entry.date}</td>
                        <td className="py-4 px-4 text-gray-900">{entry.subject}</td>
                        <td className="py-4 px-4 text-gray-900">{entry.time}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-md text-sm font-medium ${
                            entry.status === 'present' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {entry.status === 'present' ? 'Present' : 'Absent'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <button 
                            onClick={() => {
                              closeHistoryModal();
                              openEditModal(entry);
                            }}
                            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end p-6 border-t border-gray-100">
              <button
                onClick={closeHistoryModal}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}