import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

// Temporary placeholders for dashboard sections
import Overview from '../components/dashboard/Overview';
import Attendance from '../components/dashboard/Attendance';
import Courses from '../components/dashboard/Courses';
import TimeTable from '../components/dashboard/TimeTable';
import MyTasks from '../components/dashboard/MyTasks';
import Events from '../components/dashboard/Events';
import Performance from '../components/dashboard/Performance';
import Assignments from '../components/dashboard/Assignments';
import TeacherChat from '../components/dashboard/TeacherChat';

export default function Dashboard() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ 
        flex: 1, 
        marginLeft: '260px', 
        padding: '2rem', 
        height: '100vh', 
        overflowY: 'auto' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/timetable" element={<TimeTable />} />
            <Route path="/tasks" element={<MyTasks />} />
            <Route path="/events" element={<Events />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/chat" element={<TeacherChat />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
