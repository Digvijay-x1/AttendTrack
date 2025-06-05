import { Link , NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Plus, 
  BookOpen, 
  BarChart3, 
  Bell, 
  Calculator, 
  Settings, 
  LogOut,
  User,
  Radius
} from 'lucide-react';

const Navbar = () => {
  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      href: '/'
    },
    { 
      icon: Plus, 
      label: 'Attendance Input', 
      href: '/AttendenceInput'
    },
    { 
      icon: BookOpen, 
      label: 'Subject Management', 
      href: '/SubjectManagement'
    },
    { 
      icon: BarChart3, 
      label: 'Analytics', 
      href: '/analytics'
    },
    { 
      icon: Bell, 
      label: 'Alerts', 
      href: '/alerts'
    },
    { 
      icon: Calculator, 
      label: 'Calculator', 
      href: '/calculator'
    },
    { 
      icon: Settings, 
      label: 'Profile Settings', 
      href: '/settings'
    }
  ];

  return (
   
    <div className="w-63 h-screen  border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 ">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">AT</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">AttendTrack</h1>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <li key={index}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <IconComponent 
                        size={20} 
                        className={isActive ? 'text-white' : 'text-gray-500'}
                      />
                      <span className="font-medium">{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">John Doe</p>
            <p className="text-xs text-gray-500">john.doe@college.edu</p>
          </div>
        </div>
        
        {/* Logout Button */}
        <button className="w-full bg-gray-50 flex items-center justify-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors duration-200 border-2 border-gray-200" >
          <LogOut size={16} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
   
  );
};

export default Navbar;