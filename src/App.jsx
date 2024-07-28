import './App.css'
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthLogin from "./Auth/AuthLogin";
import CreateProfile from './Components/CreateProfile/CreateProfile';
import { AuthProvider } from "./Context/AuthContext";
import NavigationError from "./Errors/NavigationError";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './Layout/Layout';
import ProtectedRoute from './Context/ProtectedRoute';

function App() {

  const [userType,setUserType] = useState();

  return (
    <>
      <AuthProvider>
        <Router>
            <Routes>
              <Route path="/" element={<AuthLogin setUserType={setUserType} />} />
              <Route path="/createprofile/:section" element={<ProtectedRoute><CreateProfile /></ProtectedRoute>} />
              <Route path="/app/:section" element={<ProtectedRoute><Layout userType={userType} setUserType={setUserType} /></ProtectedRoute>} />
              <Route path="*" element={<ProtectedRoute><NavigationError /></ProtectedRoute>} />
            </Routes>
        </Router>
        <ToastContainer
          position="top-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
          theme="light"
          transition: Bounce
          />
    </AuthProvider>
    </>
  )
}

export default App
