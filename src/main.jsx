import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Layout from './Layout.jsx'
import Dashboard from './Components/Dashboard/Dashboard.jsx'
import AttendanceInput from './Components/Attendence-Input/AttendenceInput.jsx'
import SubjectManagement from './Components/Management/SubjectManagement.jsx'
import Analytics from './Components/Analytics/Analytics.jsx'
import Alert from './Components/Alert/Alert.jsx'
import CalculatorComp from './Components/Calculator/Calculator.jsx'
import ProfileSettings from './Components/ProfileSettings/ProfileSettings.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout/>,
    children: [
      {
        path: "",
        element: <Dashboard/>
      },
      {
        path: "AttendenceInput",
        element: <AttendanceInput/>
      },
      {
        path: "SubjectManagement",
        element: <SubjectManagement/>
      },
      {
        path: "analytics",
        element: <Analytics/>
      },
      {
        path: "alerts",
        element: <Alert/>
      },
      {
        path: 'calculator',
        element: <CalculatorComp/>
      },
      {
        path: 'settings',
        element: <ProfileSettings/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
