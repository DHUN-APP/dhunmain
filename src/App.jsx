import './App.css'
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthLogin from "./Auth/AuthLogin";
import HomePage from "./Components/Home/Home";
import CreateProfile from './Components/CreateProfile/CreateProfile';
import { AuthProvider } from "./Context/AuthContext";
import NavigationError from "./Errors/NavigationError";

function App() {

  return (
    <>
      <AuthProvider>
        <Router>
            <Routes>
              <Route path="/" element={<AuthLogin />} />
              <Route path="/createprofile/:section" element={<CreateProfile />} />
              <Route path="/home" element={<HomePage section="main" />} />
              <Route path="*" element={<NavigationError />} />
            </Routes>
        </Router>
    </AuthProvider>
    </>
  )
}

export default App
