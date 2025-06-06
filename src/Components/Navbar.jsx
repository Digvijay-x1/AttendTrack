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
  Radius,
  Sun,
  Moon
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const Navbar = () => {
  const { user, theme, toggleTheme, sidebarOpen, toggleSidebar } = useApp();
  
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
    <div className={`${sidebarOpen ? 'w-63' : 'w-20'} h-screen border-r border-gray-200 flex flex-col transition-all duration-300`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">AT</span>
          </div>
          {sidebarOpen && <h1 className="text-xl font-semibold text-gray-900">AttendTrack</h1>}
        </div>
        
        {/* Theme toggle button */}
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {theme === 'dark' ? (
            <Sun size={18} className="text-gray-600" />
          ) : (
            <Moon size={18} className="text-gray-600" />
          )}
        </button>
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
                    `flex items-center ${sidebarOpen ? 'space-x-3 justify-start px-4' : 'justify-center'} py-3 rounded-lg transition-colors duration-200 ${
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
                      {sidebarOpen && <span className="font-medium">{item.label}</span>}
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
        <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} mb-4`}>
          <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
            {user.profileImage ? (
              <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={16} className="w-full h-full p-2 text-gray-600" />
            )}
          </div>
          {sidebarOpen && (
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          )}
        </div>
        
        {/* Toggle sidebar button */}
        <button 
          onClick={toggleSidebar}
          className={`mb-2 w-full ${sidebarOpen ? 'bg-gray-100 justify-between px-4' : 'justify-center'} flex items-center py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors duration-200`}
        >
          <Radius size={16} className="text-gray-600" />
          {sidebarOpen && <span className="font-medium">Toggle Sidebar</span>}
        </button>
        
        {/* Logout Button */}
        <button className={`w-full bg-gray-50 flex items-center ${sidebarOpen ? 'justify-start space-x-2 px-4' : 'justify-center'} py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors duration-200 border-2 border-gray-200`} >
          <LogOut size={16} />
          {sidebarOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Navbar;