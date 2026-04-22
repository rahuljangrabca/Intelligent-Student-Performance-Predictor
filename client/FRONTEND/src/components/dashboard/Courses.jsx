import { useState, useEffect } from 'react';
import { Book, Clock, User, Loader } from 'lucide-react';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/courses', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setCourses(await res.json());
        }
      } catch (err) {
        console.error("Course fetch fail", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><Loader className="animate-spin text-primary" size={48} /></div>;

  const colors = ['#0ea5e9', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>My Courses</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage and track your enrolled courses.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {courses.length === 0 && <p style={{ color: 'var(--text-muted)' }}>You are not enrolled in any courses yet.</p>}
        {courses.map((course, index) => {
          const color = colors[index % colors.length];
          return (
            <div key={course._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: color }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ background: `rgba(255,255,255,0.05)`, padding: '0.75rem', borderRadius: '12px' }}>
                  <Book size={24} color={color} />
                </div>
                <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>Active</span>
              </div>

              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{course.name}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={14} /> {course.teacherName || 'Faculty Member'}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> Schedule TBA</span>
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                  <span>Course Progress</span>
                  <span style={{ color: color }}>75%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.2)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `75%`, height: '100%', background: color, transition: 'var(--transition)' }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
