import './App.css'
import React, { useState, useEffect } from "react";
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
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      setShowSplash(false);
    }, 5100);

    return () => clearTimeout(splashTimeout);
  }, []);

  return (
    <>
      <AuthProvider>
        <Router>
        {showSplash ? (
            <div className="flex flex-col items-center justify-center h-screen bg-black">
              <video
                  src="/assets/sqrlogo.mp4"
                  autoPlay
                  loop
                  muted
                  className="w-auto h-screen max-md:w-screen max-md:h-auto"
                >
              </video>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<AuthLogin setUserType={setUserType} />} />
              <Route path="/createprofile/:section" element={<ProtectedRoute><CreateProfile /></ProtectedRoute>} />
              <Route path="/app/:section" element={<ProtectedRoute><Layout userType={userType} setUserType={setUserType} /></ProtectedRoute>} />
              <Route path="*" element={<ProtectedRoute><NavigationError /></ProtectedRoute>} />
            </Routes>
          )}
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
