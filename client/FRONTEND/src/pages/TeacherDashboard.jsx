import { Routes, Route } from 'react-router-dom';
import TeacherSidebar from '../components/TeacherSidebar';

import TeacherOverview from '../components/teacher/TeacherOverview';
import TeacherClasses from '../components/teacher/TeacherClasses';
import TeacherCourses from '../components/teacher/TeacherCourses';
import TeacherAttendance from '../components/teacher/TeacherAttendance';
import TeacherAssessments from '../components/teacher/TeacherAssessments';
import TeacherChat from '../components/teacher/TeacherChat';
import TeacherPredictor from '../components/teacher/TeacherPredictor';

export default function TeacherDashboard() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <TeacherSidebar />
      <main style={{ 
        flex: 1, 
        marginLeft: '260px', 
        padding: '2rem', 
        height: '100vh', 
        overflowY: 'auto' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={<TeacherOverview />} />
            <Route path="/classes" element={<TeacherClasses />} />
            <Route path="/courses" element={<TeacherCourses />} />
            <Route path="/attendance" element={<TeacherAttendance />} />
            <Route path="/assessments" element={<TeacherAssessments />} />
            <Route path="/predictor" element={<TeacherPredictor />} />
            <Route path="/chat" element={<TeacherChat />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
