import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/ToastContext';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard'; // Will create this next

import ErrorBoundary from './components/ui/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/student-dashboard/*" element={<StudentDashboard />} />
            <Route path="/teacher-dashboard/*" element={<TeacherDashboard />} />
            {/* Keep this mapping temporarily just in case anything references /dashboard */}
            <Route path="/dashboard/*" element={<Navigate to="/student-dashboard" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
