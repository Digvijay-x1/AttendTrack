import { createContext, useContext, useState } from 'react';
import { AttendanceProvider } from './AttendanceContext';
import { SubjectProvider } from './SubjectContext';

// Create the context
const AppContext = createContext();

// Custom hook for using the context
export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // Global application state
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    course: 'Computer Science',
    year: '3rd Year',
    profileImage: 'https://i.pravatar.cc/300'
  });

  // App theme
  const [theme, setTheme] = useState('light');

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Update user info
  const updateUser = (updatedInfo) => {
    setUser(prev => ({
      ...prev,
      ...updatedInfo
    }));
  };

  return (
    <AppContext.Provider 
      value={{
        user,
        theme,
        sidebarOpen,
        toggleSidebar,
        toggleTheme,
        updateUser
      }}
    >
      <AttendanceProvider>
        <SubjectProvider>
          {children}
        </SubjectProvider>
      </AttendanceProvider>
    </AppContext.Provider>
  );
};

export default AppContext; 