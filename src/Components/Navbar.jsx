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
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, theme, toggleTheme, sidebarOpen, toggleSidebar } = useApp();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close mobile menu when clicking on a link
  const handleLinkClick = () => {
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  // Close mobile menu when clicking outside
  const handleOverlayClick = () => {
    setMobileMenuOpen(false);
  };

  // Mobile Header (visible only on small screens)
  if (isMobile) {
    return (
      <>
        {/* Mobile Header */}
        <div className={`fixed top-0 left-0 right-0 z-50 ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-b h-16 flex items-center justify-between px-4`}>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">AT</span>
            </div>
            <h1 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>AttendTrack</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Theme toggle button */}
            <button 
              onClick={toggleTheme} 
              className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200'} transition-colors`}
            >
              {theme === 'dark' ? (
                <Sun size={18} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} />
              ) : (
                <Moon size={18} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} />
              )}
            </button>
            
            {/* Mobile menu toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200'} transition-colors`}
            >
              {mobileMenuOpen ? (
                <X size={20} className={theme === 'dark' ? 'text-white' : 'text-gray-900'} />
              ) : (
                <Menu size={20} className={theme === 'dark' ? 'text-white' : 'text-gray-900'} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/30 bg-opacity-50 z-40"
            onClick={handleOverlayClick}
          />
        )}

        {/* Mobile Sidebar */}
        <div className={`fixed top-16 left-0 bottom-0 w-80 ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-r transform transition-transform duration-300 ease-in-out z-50 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Navigation Menu */}
          <nav className="flex-1 p-4 h-full overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <li key={index}>
                    <NavLink
                      to={item.href}
                      onClick={handleLinkClick}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 justify-start px-4 py-3 rounded-lg transition-colors duration-200 ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : `${theme === 'dark' ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <IconComponent 
                            size={20} 
                            className={isActive ? 'text-white' : `${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                          />
                          <span className="font-medium">{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>

            {/* User Profile Section */}
            <div className={`mt-8 pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={16} className="w-full h-full p-2 text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
                </div>
              </div>
              
              {/* Logout Button */}
              <button className={`w-full flex items-center justify-start space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 border-2 ${
                theme === 'dark' 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border-gray-700' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-200 border-gray-200'
              }`}>
                <LogOut size={16} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </nav>
        </div>
      </>
    );
  }

  // Desktop Sidebar (visible only on larger screens)
  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} h-screen ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-r flex flex-col transition-all duration-300`}>
      {/* Header */}
      <div className={`p-6 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} border-b flex justify-between items-center`}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">AT</span>
          </div>
          {sidebarOpen && <h1 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>AttendTrack</h1>}
        </div>
        
        {/* Theme toggle button */}
        <button 
          onClick={toggleTheme} 
          className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200'} transition-colors`}
        >
          {theme === 'dark' ? (
            <Sun size={18} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} />
          ) : (
            <Moon size={18} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} />
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
                        ? 'bg-blue-600 text-white'
                        : `${theme === 'dark' ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <IconComponent 
                        size={20} 
                        className={isActive ? 'text-white' : `${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
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
      <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
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
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</p>
            </div>
          )}
        </div>
        
        {/* Toggle sidebar button */}
        {/* <button 
          onClick={toggleSidebar}
          className={`mb-2 w-full ${sidebarOpen ? 'justify-between px-4' : 'justify-center'} flex items-center py-2 rounded-lg transition-colors duration-200 ${
            theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Menu size={16} />
          {sidebarOpen && <span className="font-medium">Toggle Sidebar</span>}
        </button> */}
        
        {/* Logout Button */}
        <button className={`w-full flex items-center ${sidebarOpen ? 'justify-start space-x-2 px-4' : 'justify-center'} py-2 rounded-lg transition-colors duration-200 border-2 ${
          theme === 'dark' 
            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border-gray-700' 
            : 'bg-gray-50 text-gray-600 hover:bg-gray-200 border-gray-200'
        }`}>
          <LogOut size={16} />
          {sidebarOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Navbar;