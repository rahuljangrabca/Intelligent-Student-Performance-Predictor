import { useState, useEffect } from 'react';
import { Users, BookOpen, Calendar, Clock, AlertTriangle, CheckCircle, TrendingUp, MapPin, Loader } from 'lucide-react';
import api from '../../utils/api';

const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
  <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
    <div style={{ padding: '1rem', borderRadius: '12px', background: `rgba(${color}, 0.1)`, color: `rgb(${color})` }}>
      <Icon size={24} />
    </div>
    <div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>{title}</p>
      <h3 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>{value}</h3>
      {subtitle && <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>{subtitle}</p>}
    </div>
  </div>
);

export default function TeacherOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchTeacherDashboard = async () => {
      try {
        const res = await api.get('/dashboard/teacher');
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch teacher dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacherDashboard();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Loader className="animate-spin text-primary" size={48} />
    </div>
  );

  const courses = data?.courses || [];
  const classes = data?.classes || [];
  const studentsList = data?.studentsList || [];
  const recentAssignments = data?.recentAssignments || [];
  const recentEvents = data?.recentEvents || [];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome, Prof. {user.name || 'Teacher'}!</h1>
        <p style={{ color: 'var(--text-muted)' }}>Overview of your students, classes, and academic activity.</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <StatCard title="My Students" value={data?.myStudentCount || 0} icon={Users} color="14, 165, 233" subtitle={`${data?.totalStudents || 0} total in system`} />
        <StatCard title="Active Classes" value={data?.activeClasses || 0} icon={BookOpen} color="16, 185, 129" subtitle={`${data?.totalClasses || 0} total classes`} />
        <StatCard title="High Risk Students" value={data?.highRiskCount || 0} icon={AlertTriangle} color="239, 68, 68" subtitle={`${data?.mediumRiskCount || 0} medium risk`} />
        <StatCard title="Events" value={data?.totalEvents || 0} icon={Calendar} color="244, 63, 94" />
      </div>

      {/* My Courses & Classes */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {/* Courses List */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>My Courses</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {courses.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No courses yet. Create one from the Courses section.</p>
            ) : (
              courses.map((course, idx) => {
                const colors = ['#8b5cf6', '#0ea5e9', '#f43f5e', '#10b981', '#f59e0b'];
                const color = colors[idx % colors.length];
                return (
                  <div key={course._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ width: '4px', height: '40px', background: color, borderRadius: '4px', flexShrink: 0 }}></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{course.name}</strong>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', gap: '12px' }}>
                        {course.code && <span>{course.code}</span>}
                        <span>{course.studentCount} student{course.studentCount !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      padding: '3px 10px', 
                      borderRadius: '12px',
                      background: course.syllabusStatus === 'Uploaded' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                      color: course.syllabusStatus === 'Uploaded' ? 'var(--success)' : 'var(--warning)',
                      fontWeight: '500',
                      flexShrink: 0
                    }}>
                      {course.syllabusStatus}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Classes List */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>My Classes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {classes.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No classes yet. Create one from the Classes section.</p>
            ) : (
              classes.slice(0, 5).map((cls, idx) => {
                const colors = ['#0ea5e9', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6'];
                const color = colors[idx % colors.length];
                return (
                  <div key={cls._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
                    <div style={{ width: '4px', height: '44px', background: color, borderRadius: '4px', flexShrink: 0 }}></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong style={{ display: 'block', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cls.name}</strong>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Clock size={11} /> {cls.time}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><MapPin size={11} /> {cls.room}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '3px 10px', 
                        borderRadius: '12px',
                        background: cls.status === 'Upcoming' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
                        color: cls.status === 'Upcoming' ? 'var(--success)' : 'var(--text-muted)',
                        fontWeight: '500'
                      }}>
                        {cls.status}
                      </span>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '4px' }}>{cls.day} • {cls.studentCount} students</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Students at Risk & Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        {/* Students at Risk */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Student Risk Overview</h3>
          {studentsList.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No enrolled students yet. Students will appear once they enroll in your classes or courses.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
              {/* Sort high risk first */}
              {[...studentsList]
                .sort((a, b) => {
                  const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
                  return (order[a.risk] ?? 3) - (order[b.risk] ?? 3);
                })
                .slice(0, 10)
                .map(student => {
                  const riskColors = { HIGH: 'var(--danger)', MEDIUM: 'var(--warning)', LOW: 'var(--success)' };
                  const riskBg = { HIGH: 'rgba(239,68,68,0.1)', MEDIUM: 'rgba(245,158,11,0.1)', LOW: 'rgba(16,185,129,0.1)' };
                  return (
                    <div key={student.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '8px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '0.85rem', flexShrink: 0 }}>
                        {student.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <strong style={{ display: 'block', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{student.name}</strong>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                          Attendance: {student.attendance}% • Score: {student.avgScore}
                        </div>
                      </div>
                      <span style={{ 
                        padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600',
                        background: riskBg[student.risk] || riskBg.LOW,
                        color: riskColors[student.risk] || riskColors.LOW,
                        flexShrink: 0
                      }}>
                        {student.risk}
                      </span>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentAssignments.length > 0 ? (
              recentAssignments.slice(0, 4).map((ass, i) => (
                <div key={ass._id || i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  <CheckCircle size={16} style={{ color: 'var(--primary-light)', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.9rem' }}>Assignment: <strong>{ass.title}</strong></span>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      Status: {ass.status} {ass.marks !== undefined && `• Marks: ${ass.marks}`}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No recent assignment activity.</p>
            )}

            {recentEvents.length > 0 && (
              <>
                <div style={{ borderTop: '1px solid var(--glass-border)', margin: '0.5rem 0' }}></div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Recent Events</p>
                {recentEvents.slice(0, 3).map((evt, i) => (
                  <div key={evt._id || i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                    <Calendar size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '0.9rem' }}>{evt.title}</span>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', flexShrink: 0 }}>{new Date(evt.date).toLocaleDateString()}</span>
                  </div>
                ))}
              </>
            )}

            {/* System Status */}
            <div style={{ borderTop: '1px solid var(--glass-border)', margin: '0.5rem 0' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'rgba(16,185,129,0.05)', borderRadius: '8px' }}>
              <TrendingUp size={16} style={{ color: 'var(--success)' }} />
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Performance predictor engine is <strong style={{ color: 'var(--success)' }}>active</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
