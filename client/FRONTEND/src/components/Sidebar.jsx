import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserCheck,
  Users, 
  BookOpen, 
  Calendar, 
  CheckSquare, 
  BellRing, 
  TrendingUp, 
  FileText, 
  MessageSquare,
  LogOut
} from 'lucide-react';

const navItems = [
  { path: '/student-dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { path: '/student-dashboard/classes', label: 'My Classes', icon: Users },
  { path: '/student-dashboard/attendance', label: 'Class Attendance', icon: UserCheck },
  { path: '/student-dashboard/courses', label: 'Courses', icon: BookOpen },
  { path: '/student-dashboard/timetable', label: 'Time Table', icon: Calendar },
  { path: '/student-dashboard/tasks', label: 'My Task', icon: CheckSquare },
  { path: '/student-dashboard/events', label: 'Events', icon: BellRing },
  { path: '/student-dashboard/performance', label: 'Performance', icon: TrendingUp },
  { path: '/student-dashboard/assignments', label: 'Assignments', icon: FileText },
  { path: '/student-dashboard/chat', label: 'Teacher Chat', icon: MessageSquare },
];

export default function Sidebar() {
  return (
    <aside style={{
      width: '260px',
      height: '100vh',
      background: 'var(--sidebar-bg)',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid var(--glass-border)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 10
    }}>
      <div style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
          S
        </div>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '600', margin: 0 }} className="text-gradient">StudentPortal</h2>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              color: isActive ? 'white' : 'var(--text-muted)',
              textDecoration: 'none',
              transition: 'var(--transition)',
              background: isActive ? 'linear-gradient(90deg, rgba(109, 40, 217, 0.2), transparent)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--primary-light)' : '3px solid transparent',
              fontWeight: isActive ? '600' : '400'
            })}
          >
            <item.icon size={20} style={{ color: 'inherit' }} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '1.5rem' }}>
        <NavLink 
          to="/login"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '12px',
            color: 'var(--danger)',
            textDecoration: 'none',
            transition: 'var(--transition)'
          }}
        >
          <LogOut size={20} />
          Logout
        </NavLink>
      </div>
    </aside>
  );
}
