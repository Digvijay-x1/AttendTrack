import React, { useState, useEffect } from 'react';
import { Calculator, Zap, Plus, Check, Trash2 } from 'lucide-react';
import { useSubjects } from '../../context/SubjectContext';

const CalculatorComp = () => {
  // Get subjects from context
  const { subjects: contextSubjects } = useSubjects();
  
  // Main calculator state
  const [selectedSubject, setSelectedSubject] = useState('');
  const [targetAttendance, setTargetAttendance] = useState(75);
  const [estimatedFutureClasses, setEstimatedFutureClasses] = useState(10);
  const [calculationResult, setCalculationResult] = useState(null);

  // Quick calculator state
  const [attended, setAttended] = useState('');
  const [total, setTotal] = useState('');
  const [currentPercentage, setCurrentPercentage] = useState(0);

  // What-if scenarios
  const [whatIfScenarios, setWhatIfScenarios] = useState([
    { text: 'If I attend next 5 classes', change: '+0%' },
    { text: 'If I miss next 2 classes', change: '-0%' },
    { text: 'If I attend next 10 classes', change: '+0%' }
  ]);

  // Goal tracker calculations
  const [goalCalculations, setGoalCalculations] = useState({
    75: { needed: 0, canMiss: 0 },
    80: { needed: 0, canMiss: 0 },
    85: { needed: 0, canMiss: 0 }
  });

  // Convert context subjects to the format needed by calculator
  const [subjects, setSubjects] = useState([]);
  
  // Update subjects when context subjects change
  useEffect(() => {
    const formattedSubjects = contextSubjects.map(subject => ({
      name: subject.name,
      current: `${subject.attended}/${subject.totalClasses}`,
      percentage: subject.attendance,
      status: subject.attendance >= 75 ? 'achieved' : 'critical',
      id: `subject-${subject.id}`
    }));
    
    setSubjects(formattedSubjects);
  }, [contextSubjects]);

  const [customSubjects, setCustomSubjects] = useState([]);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalSubjectName, setModalSubjectName] = useState('');
  const [modalAttended, setModalAttended] = useState('');
  const [modalTotal, setModalTotal] = useState('');

  // Calculate current percentage and goal tracker for quick calculator
  useEffect(() => {
    if (attended && total && parseInt(total) > 0) {
      const attendedNum = parseInt(attended);
      const totalNum = parseInt(total);
      const percentage = (attendedNum / totalNum) * 100;
      setCurrentPercentage(Math.round(percentage * 100) / 100);
      
      // Update what-if scenarios
      const scenario1 = ((attendedNum + 5) / (totalNum + 5)) * 100;
      const scenario2 = (attendedNum / (totalNum + 2)) * 100;
      const scenario3 = ((attendedNum + 10) / (totalNum + 10)) * 100;
      
      setWhatIfScenarios([
        { text: 'If I attend next 5 classes', change: `${scenario1 > percentage ? '+' : ''}${(scenario1 - percentage).toFixed(1)}%` },
        { text: 'If I miss next 2 classes', change: `${(scenario2 - percentage).toFixed(1)}%` },
        { text: 'If I attend next 10 classes', change: `${scenario3 > percentage ? '+' : ''}${(scenario3 - percentage).toFixed(1)}%` }
      ]);

      // Calculate goal tracker
      const newGoalCalculations = {};
      [75, 80, 85].forEach(targetPerc => {
        if (percentage >= targetPerc) {
          // Already achieved - calculate how many can miss
          const canMiss = Math.floor((attendedNum - (targetPerc/100) * totalNum) / (targetPerc/100));
          newGoalCalculations[targetPerc] = { 
            needed: 0, 
            canMiss: Math.max(0, canMiss),
            achieved: true 
          };
        } else {
          // Calculate needed classes (assuming some future classes)
          const futureClasses = 20; // Assume 20 future classes for goal tracker
          const totalFutureClasses = totalNum + futureClasses;
          const neededToAttend = Math.ceil((targetPerc/100) * totalFutureClasses - attendedNum);
          const canMiss = futureClasses - neededToAttend;
          
          newGoalCalculations[targetPerc] = { 
            needed: Math.max(0, neededToAttend), 
            canMiss: Math.max(0, canMiss),
            achieved: false 
          };
        }
      });
      setGoalCalculations(newGoalCalculations);
    } else {
      setCurrentPercentage(0);
      setWhatIfScenarios([
        { text: 'If I attend next 5 classes', change: '+0%' },
        { text: 'If I miss next 2 classes', change: '-0%' },
        { text: 'If I attend next 10 classes', change: '+0%' }
      ]);
      setGoalCalculations({
        75: { needed: 0, canMiss: 0 },
        80: { needed: 0, canMiss: 0 },
        85: { needed: 0, canMiss: 0 }
      });
    }
  }, [attended, total]);

  const calculateRequiredClasses = () => {
    if (!selectedSubject || !targetAttendance || !estimatedFutureClasses) {
      alert('Please fill in all fields');
      return;
    }

    const allSubjects = [...subjects, ...customSubjects];
    const subject = allSubjects.find(s => s.name === selectedSubject);
    if (!subject) return;

    const [currentAttended, currentTotal] = subject.current.split('/').map(Number);
    const currentPerc = (currentAttended / currentTotal) * 100;
    
    // Calculate classes needed to reach target
    const totalFutureClasses = parseInt(estimatedFutureClasses);
    const targetPerc = parseInt(targetAttendance);
    
    // Formula: (currentAttended + x) / (currentTotal + totalFutureClasses) >= targetPerc/100
    // Solving for x: x >= (targetPerc/100) * (currentTotal + totalFutureClasses) - currentAttended
    
    const minRequired = Math.ceil((targetPerc/100) * (currentTotal + totalFutureClasses) - currentAttended);
    const maxCanMiss = totalFutureClasses - minRequired;
    
    setCalculationResult({
      current: currentPerc.toFixed(1),
      required: Math.max(0, minRequired),
      canMiss: Math.max(0, maxCanMiss),
      subject: selectedSubject
    });
  };

  const getSubjectStatus = (percentage) => {
    if (percentage >= 85) return { color: 'text-green-600', bg: 'bg-green-100' };
    if (percentage >= 75) return { color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getCanMissText = (percentage, current) => {
    if (percentage >= 75) {
      const [attended, total] = current.split('/').map(Number);
      const canMiss = Math.floor((attended - 0.75 * total) / 0.75);
      return `${Math.max(0, canMiss)} more classes`;
    }
    return '0 classes';
  };

  const addCustomSubject = () => {
    setShowModal(true);
  };

  const handleModalSubmit = () => {
    if (modalSubjectName && modalAttended && modalTotal) {
      const attended = parseInt(modalAttended);
      const total = parseInt(modalTotal);
      
      if (attended >= 0 && total > 0 && attended <= total) {
        const percentage = Math.round((attended / total) * 100);
        
        setCustomSubjects([...customSubjects, {
          name: modalSubjectName,
          current: `${attended}/${total}`,
          percentage,
          status: percentage >= 75 ? 'achieved' : 'critical',
          id: `custom-${Date.now()}`
        }]);
        
        // Reset modal
        setModalSubjectName('');
        setModalAttended('');
        setModalTotal('');
        setShowModal(false);
      } else {
        alert('Please enter valid numbers (attended should not exceed total)');
      }
    } else {
      alert('Please fill in all fields');
    }
  };

  const closeModal = () => {
    setModalSubjectName('');
    setModalAttended('');
    setModalTotal('');
    setShowModal(false);
  };

  const deleteSubject = (subjectId) => {
    setCustomSubjects(customSubjects.filter(subject => subject.id !== subjectId));
  };

  const allSubjects = [...subjects, ...customSubjects];

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance Calculator</h1>
        <p className="text-gray-600">Calculate how many classes you need to attend to reach your attendance goals</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Attendance Calculator */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Attendance Calculator</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Subject</option>
                {allSubjects.map((subject, index) => (
                  <option key={index} value={subject.name}>{subject.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Attendance (%)</label>
              <input
                type="number"
                value={targetAttendance}
                onChange={(e) => setTargetAttendance(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="75"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Future Classes</label>
              <input
                type="number"
                value={estimatedFutureClasses}
                onChange={(e) => setEstimatedFutureClasses(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="10"
              />
              <p className="text-xs text-gray-500 mt-1">How many more classes are expected in this subject?</p>
            </div>

            <button
              onClick={calculateRequiredClasses}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Calculate Required Classes
            </button>

            {calculationResult && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Results for {calculationResult.subject}</h3>
                <p className="text-sm text-gray-600 mb-1">Current: {calculationResult.current}%</p>
                <p className="text-sm text-gray-900 font-medium">
                  You need to attend {calculationResult.required} more classes
                </p>
                <p className="text-sm text-gray-600">
                  You can miss up to {calculationResult.canMiss} classes
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Calculator */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Quick Calculator</h2>
          </div>

          {/* Current Percentage */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Current Percentage</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input
                type="number"
                placeholder="Attended"
                value={attended}
                onChange={(e) => setAttended(e.target.value)}
                className="p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                placeholder="Total"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                className="p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="text-center">
              <span className="text-sm text-gray-600">Percentage: </span>
              <span className="text-lg font-bold text-blue-600">{currentPercentage}%</span>
            </div>
          </div>

          {/* What If Scenarios */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-purple-900 mb-3">What If Scenarios</h3>
            <div className="space-y-2">
              {whatIfScenarios.map((scenario, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-700">{scenario.text}</span>
                  <span className={`text-sm font-medium ${
                    scenario.change.startsWith('+') ? 'text-green-600' : 
                    scenario.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {scenario.change}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Goal Tracker */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-3">Goal Tracker</h3>
            <div className="space-y-2">
              {[75, 80, 85].map((targetPerc) => (
                <div key={targetPerc} className="flex justify-between items-center py-1">
                  <span className="text-sm text-green-700">To reach {targetPerc}%:</span>
                  <span className={`text-sm font-medium ${
                    goalCalculations[targetPerc]?.achieved ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {goalCalculations[targetPerc]?.achieved 
                      ? `✓ Achieved` 
                      : `Need ${goalCalculations[targetPerc]?.needed || 0} more`
                    }
                  </span>
                </div>
              ))}
            </div>
            {(attended && total) && (
              <div className="mt-3 pt-3 border-t border-green-200">
                <p className="text-xs text-green-600">
                  *Calculations assume 20 future classes
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subject-wise Quick Calculations */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Subject-wise Quick Calculations</h2>
          <p className="text-gray-600">See how many classes you need for each subject</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => {
            const status = getSubjectStatus(subject.percentage);
            return (
              <div key={subject.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-gray-900">{subject.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                    {subject.percentage}%
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current:</span>
                    <span className="text-gray-900">{subject.current}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">For 75%:</span>
                    <span className={subject.percentage >= 75 ? 'text-green-600' : 'text-red-600'}>
                      {subject.percentage >= 75 ? 'Already achieved ✓' : 
                       `Need ${Math.ceil((0.75 * parseInt(subject.current.split('/')[1])) - parseInt(subject.current.split('/')[0]))} more`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Can miss:</span>
                    <span className="text-blue-600">
                      {getCanMissText(subject.percentage, subject.current)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Custom subjects with delete button */}
          {customSubjects.map((subject, index) => {
            const status = getSubjectStatus(subject.percentage);
            return (
              <div key={subject.id} className="border border-gray-200 rounded-lg p-4 relative">
                <button
                  onClick={() => deleteSubject(subject.id)}
                  className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                  title="Delete subject"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                <div className="flex justify-between items-start mb-3 pr-8">
                  <h3 className="font-medium text-gray-900">{subject.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                    {subject.percentage}%
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current:</span>
                    <span className="text-gray-900">{subject.current}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">For 75%:</span>
                    <span className={subject.percentage >= 75 ? 'text-green-600' : 'text-red-600'}>
                      {subject.percentage >= 75 ? 'Already achieved ✓' : 
                       `Need ${Math.ceil((0.75 * parseInt(subject.current.split('/')[1])) - parseInt(subject.current.split('/')[0]))} more`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Can miss:</span>
                    <span className="text-blue-600">
                      {getCanMissText(subject.percentage, subject.current)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Custom Subject Card */}
          <div 
            onClick={addCustomSubject}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
              <Plus className="w-5 h-5 text-gray-600" />
            </div>
            <span className="text-gray-600 font-medium">Add Custom Subject</span>
          </div>
        </div>

        {/* Modal for adding custom subject */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Custom Subject</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject Name</label>
                  <input
                    type="text"
                    value={modalSubjectName}
                    onChange={(e) => setModalSubjectName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Machine Learning"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Classes Attended</label>
                    <input
                      type="number"
                      value={modalAttended}
                      onChange={(e) => setModalAttended(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="20"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Classes</label>
                    <input
                      type="number"
                      value={modalTotal}
                      onChange={(e) => setModalTotal(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="25"
                      min="1"
                    />
                  </div>
                </div>
                
                {modalAttended && modalTotal && parseInt(modalTotal) > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      Current Percentage: <span className="font-semibold">
                        {Math.round((parseInt(modalAttended) / parseInt(modalTotal)) * 100)}%
                      </span>
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleModalSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
};

export default CalculatorComp;