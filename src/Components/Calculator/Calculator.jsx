import React, { useState, useEffect } from 'react';
import { Calculator, Zap, Plus, Check } from 'lucide-react';

const CalculatorComp = () => {
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

  // Subject data
  const [subjects] = useState([
    { name: 'Data Structures', current: '29/34', percentage: 85, status: 'achieved' },
    { name: 'Operating Systems', current: '22/25', percentage: 88, status: 'achieved' },
    { name: 'Computer Networks', current: '21/29', percentage: 72, status: 'critical' },
    { name: 'Database Management', current: '27/30', percentage: 90, status: 'achieved' },
    { name: 'Software Engineering', current: '19/25', percentage: 76, status: 'achieved' }
  ]);

  const [customSubjects, setCustomSubjects] = useState([]);

  // Calculate current percentage for quick calculator
  useEffect(() => {
    if (attended && total && parseInt(total) > 0) {
      const percentage = (parseInt(attended) / parseInt(total)) * 100;
      setCurrentPercentage(Math.round(percentage * 100) / 100);
      
      // Update what-if scenarios
      const attendedNum = parseInt(attended);
      const totalNum = parseInt(total);
      
      const scenario1 = ((attendedNum + 5) / (totalNum + 5)) * 100;
      const scenario2 = (attendedNum / (totalNum + 2)) * 100;
      const scenario3 = ((attendedNum + 10) / (totalNum + 10)) * 100;
      
      setWhatIfScenarios([
        { text: 'If I attend next 5 classes', change: `${scenario1 > percentage ? '+' : ''}${(scenario1 - percentage).toFixed(1)}%` },
        { text: 'If I miss next 2 classes', change: `${(scenario2 - percentage).toFixed(1)}%` },
        { text: 'If I attend next 10 classes', change: `${scenario3 > percentage ? '+' : ''}${(scenario3 - percentage).toFixed(1)}%` }
      ]);
    } else {
      setCurrentPercentage(0);
      setWhatIfScenarios([
        { text: 'If I attend next 5 classes', change: '+0%' },
        { text: 'If I miss next 2 classes', change: '-0%' },
        { text: 'If I attend next 10 classes', change: '+0%' }
      ]);
    }
  }, [attended, total]);

  const calculateRequiredClasses = () => {
    if (!selectedSubject || !targetAttendance || !estimatedFutureClasses) {
      alert('Please fill in all fields');
      return;
    }

    const subject = subjects.find(s => s.name === selectedSubject);
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

  const getSubjectStatusText = (percentage) => {
    if (percentage >= 75) return 'Already achieved ✓';
    const needed = Math.ceil((0.75 * parseInt(percentage * 100 / percentage)) - (percentage * parseInt(percentage * 100 / percentage) / 100));
    return `Need ${needed} more`;
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
    const name = prompt('Enter subject name:');
    const current = prompt('Enter current attendance (e.g., 20/25):');
    
    if (name && current && current.includes('/')) {
      const [attended, total] = current.split('/').map(Number);
      const percentage = Math.round((attended / total) * 100);
      
      setCustomSubjects([...customSubjects, {
        name,
        current,
        percentage,
        status: percentage >= 75 ? 'achieved' : 'critical'
      }]);
    }
  };

  const allSubjects = [...subjects, ...customSubjects];

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Calculator</h1>
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
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700">To reach 75%:</span>
                <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                  Calculate above
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700">To reach 80%:</span>
                <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                  Calculate above
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700">To reach 85%:</span>
                <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                  Calculate above
                </button>
              </div>
            </div>
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
          {allSubjects.map((subject, index) => {
            const status = getSubjectStatus(subject.percentage);
            return (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
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
      </div>
    </div>
  );
};

export default CalculatorComp;