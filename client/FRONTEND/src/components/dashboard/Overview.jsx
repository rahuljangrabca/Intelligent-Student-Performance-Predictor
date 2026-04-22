import { useState, useEffect } from 'react';
import { Users, BookOpen, Star, TrendingUp, CheckSquare, Clock, MapPin, AlertTriangle, Loader, CalendarCheck } from 'lucide-react';
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

export default function Overview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard/student');
        setData(res.data);
      } catch (err) {
        console.error("Dashboard fetch fail", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Loader className="animate-spin text-primary" size={48} />
    </div>
  );

  const stats = data?.stats || {};
  const announcements = data?.announcements || [];
  const deadlines = data?.upcomingDeadlines || [];
  const upcomingClasses = data?.upcomingClasses || [];
  const recentTasks = data?.recentTasks || [];
  const analysis = data?.analysis || {};

  const riskColorMap = {
    'LOW': { color: '16, 185, 129', label: 'Low Risk' },
    'MEDIUM': { color: '245, 158, 11', label: 'Medium Risk' },
    'HIGH': { color: '239, 68, 68', label: 'High Risk' }
  };
  const riskInfo = riskColorMap[stats.riskLevel] || riskColorMap.LOW;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome back, {user.name || 'Student'}!</h1>
        <p style={{ color: 'var(--text-muted)' }}>Here's an overview of your academic progress.</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        <StatCard title="Overall Attendance" value={`${stats.attendance || 0}%`} icon={Users} color="16, 185, 129" />
        <StatCard title="Study Hours" value={`${stats.studyHours || 0} hrs/day`} icon={BookOpen} color="14, 165, 233" />
        <StatCard title="Average Grade" value={stats.avgGrade || 'N/A'} icon={Star} color="245, 158, 11" subtitle={`Exam: ${stats.examScore || 0} | Assignment: ${stats.assignmentScore || 0}`} />
        <StatCard title="Predicted Risk" value={riskInfo.label} icon={TrendingUp} color={riskInfo.color} />
      </div>

      {/* Quick Counts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <CalendarCheck size={20} style={{ color: 'var(--primary-light)', marginBottom: '6px' }} />
          <h4 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '4px 0' }}>{stats.classCount || 0}</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Enrolled Classes</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <BookOpen size={20} style={{ color: 'var(--secondary)', marginBottom: '6px' }} />
          <h4 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '4px 0' }}>{stats.courseCount || 0}</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Enrolled Courses</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <CheckSquare size={20} style={{ color: 'var(--success)', marginBottom: '6px' }} />
          <h4 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '4px 0' }}>{stats.completedTasks || 0}/{stats.totalTasks || 0}</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Tasks Done</p>
        </div>
        <div className="glass-panel" style={{ padding: '1.25rem', textAlign: 'center' }}>
          <Clock size={20} style={{ color: 'var(--warning)', marginBottom: '6px' }} />
          <h4 style={{ fontSize: '1.5rem', fontWeight: '700', margin: '4px 0' }}>{stats.pendingTasks || 0}</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Pending Tasks</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {/* Upcoming Classes */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Upcoming Classes</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {upcomingClasses.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No upcoming classes. Enroll in classes to see them here.</p>
            )}
            {upcomingClasses.map((cls, idx) => {
              const colors = ['#0ea5e9', '#f43f5e', '#10b981', '#f59e0b'];
              const color = colors[idx % colors.length];
              return (
                <div key={cls._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ width: '4px', height: '44px', background: color, borderRadius: '4px', flexShrink: 0 }}></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <strong style={{ display: 'block', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cls.name}</strong>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {cls.time}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {cls.room}</span>
                    </div>
                  </div>
                  <span style={{ background: `${color}18`, color: color, padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '500', flexShrink: 0 }}>{cls.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Announcements */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Recent Announcements</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {announcements.length === 0 && <li style={{ color: 'var(--text-muted)' }}>No recent announcements.</li>}
            {announcements.map((event, idx) => (
              <li key={event._id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '8px' }}>
                <span style={{ fontWeight: '500' }}>{event.title}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', flexShrink: 0, marginLeft: '12px' }}>{new Date(event.date).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        {/* Upcoming Deadlines */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Upcoming Deadlines</h3>
          {deadlines.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {deadlines.map((d, i) => (
                <div key={d._id || i} style={{ background: 'rgba(239, 68, 68, 0.08)', borderLeft: '4px solid var(--danger)', padding: '12px', borderRadius: '0 8px 8px 0' }}>
                  <strong style={{ color: 'var(--danger)', display: 'block', marginBottom: '4px' }}>{d.title}</strong>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    Due: {d.dueDate ? new Date(d.dueDate).toLocaleString() : 'TBA'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', borderLeft: '4px solid var(--success)', padding: '12px', borderRadius: '0 8px 8px 0' }}>
              <strong style={{ color: 'var(--success)', display: 'block', marginBottom: '4px' }}>All caught up!</strong>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No upcoming deadlines.</span>
            </div>
          )}
        </div>

        {/* Performance Insights */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Performance Insights</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {analysis.goodPoints?.length > 0 && analysis.goodPoints.map((p, i) => (
              <div key={`g-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '8px' }}>
                <CheckSquare size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
                <span style={{ color: 'var(--success)', fontSize: '0.9rem' }}>{p}</span>
              </div>
            ))}
            {analysis.badPoints?.length > 0 && analysis.badPoints.map((p, i) => (
              <div key={`b-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'rgba(239, 68, 68, 0.08)', borderRadius: '8px' }}>
                <AlertTriangle size={16} style={{ color: 'var(--danger)', flexShrink: 0 }} />
                <span style={{ color: 'var(--danger)', fontSize: '0.9rem' }}>{p}</span>
              </div>
            ))}
            {analysis.suggestions?.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Suggestions</p>
                {analysis.suggestions.map((s, i) => (
                  <p key={`s-${i}`} style={{ color: 'var(--text-muted)', fontSize: '0.85rem', paddingLeft: '8px', marginBottom: '4px' }}>• {s}</p>
                ))}
              </div>
            )}
            {(!analysis.goodPoints?.length && !analysis.badPoints?.length) && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Performance data will appear here once you have grades.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      {recentTasks.length > 0 && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Recent Tasks</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {recentTasks.map(t => (
              <div key={t._id} style={{ flex: '1 1 250px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', borderLeft: `4px solid ${t.status === 'Completed' ? 'var(--success)' : 'var(--warning)'}` }}>
                <strong style={{ display: 'block', marginBottom: '4px' }}>{t.title}</strong>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span style={{ color: t.status === 'Completed' ? 'var(--success)' : 'var(--warning)' }}>{t.status}</span>
                  {t.dueDate && <span>{new Date(t.dueDate).toLocaleDateString()}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
