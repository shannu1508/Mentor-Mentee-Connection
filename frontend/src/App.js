import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import Pages
import SignUp from './pages/signup';
import Login from './pages/login';
import Home from './pages/home';
import FindMentor from './pages/findmentor';
import InfoBox from './pages/InfoBox';
import AboutUs from './pages/AboutUs';
import MenteeDashboard from './pages/MenteeDashboard';
import MentorDashboard from './pages/MentorDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/about" element={<AboutUs />} />

          {/* Protected Routes for Mentees */}
          <Route 
            path="/mentee/dashboard" 
            element={
              <ProtectedRoute requireRole="mentee">
                <MenteeDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/find-mentor" 
            element={
              <ProtectedRoute requireRole="mentee">
                <FindMentor />
              </ProtectedRoute>
            } 
          />

          {/* Protected Routes for Mentors */}
          <Route 
            path="/mentor/dashboard" 
            element={
              <ProtectedRoute requireRole="mentor">
                <MentorDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Protected Routes for All Authenticated Users */}
          <Route 
            path="/aichat" 
            element={
              <ProtectedRoute>
                <InfoBox />
              </ProtectedRoute>
            } 
          />

          {/* Chat Routes - Will be implemented in next phase */}
          <Route path="/mentee/chat" element={<div>Mentee Chat Coming Soon!</div>} />
          <Route path="/mentor/chat" element={<div>Mentor Chat Coming Soon!</div>} />
          <Route path="/mentor/students" element={<div>Students Management Coming Soon!</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;