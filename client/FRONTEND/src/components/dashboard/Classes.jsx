import { useState, useEffect } from 'react';
import { MapPin, Users, Clock, Book, UserPlus, Loader, CheckCircle } from 'lucide-react';
import { useToast } from '../ui/ToastContext';
import api from '../../utils/api';

export default function Classes() {
  const [myClasses, setMyClasses] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('enrolled');
  const { addToast } = useToast();

  const fetchClasses = async () => {
    try {
      const [myRes, allRes] = await Promise.all([
        api.get('/classes'),
        api.get('/classes/all')
      ]);
      setMyClasses(myRes.data);
      setAllClasses(allRes.data);
    } catch (err) {
      console.error("Failed to fetch classes", err);
      addToast('Failed to load classes', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleEnroll = async (classId) => {
    try {
      const res = await api.post(`/classes/${classId}/enroll`);
      setMyClasses([...myClasses, res.data]);
      setAllClasses(allClasses.map(c => c._id === classId ? { ...c, isEnrolled: true, studentCount: (c.studentCount || 0) + 1 } : c));
      addToast('Successfully enrolled in class!', 'success');
    } catch (err) {
      addToast(err.response?.data?.msg || 'Failed to enroll', 'error');
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Loader className="animate-spin text-primary" size={48} />
    </div>
  );

  const colors = ['#0ea5e9', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
  const dayOrder = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6, Sunday: 7 };

  const tabStyle = (active) => ({
    padding: '10px 24px',
    borderRadius: '8px',
    background: active ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'rgba(255,255,255,0.05)',
    color: active ? 'white' : 'var(--text-muted)',
    border: 'none',
    cursor: 'pointer',
    fontWeight: active ? '600' : '400',
    transition: 'var(--transition)',
    fontSize: '0.95rem'
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>My Classes</h1>
        <p style={{ color: 'var(--text-muted)' }}>View your enrolled classes and browse available ones.</p>
      </div>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button style={tabStyle(activeTab === 'enrolled')} onClick={() => setActiveTab('enrolled')}>
          My Classes ({myClasses.length})
        </button>
        <button style={tabStyle(activeTab === 'browse')} onClick={() => setActiveTab('browse')}>
          Browse All Classes
        </button>
      </div>

      {activeTab === 'enrolled' ? (
        /* Enrolled Classes */
        myClasses.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>You're not enrolled in any classes yet.</p>
            <button style={tabStyle(true)} onClick={() => setActiveTab('browse')}>
              Browse Available Classes
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {[...myClasses]
              .sort((a, b) => (dayOrder[a.day] || 8) - (dayOrder[b.day] || 8))
              .map((cls, index) => {
              const color = colors[index % colors.length];
              return (
                <div key={cls._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: color }}></div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ background: `${color}22`, color: color, padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '500' }}>{cls.type}</span>
                      <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cls.day}</span>
                    </div>
                    <span style={{ 
                      fontSize: '0.8rem', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      background: cls.status === 'Upcoming' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.05)',
                      color: cls.status === 'Upcoming' ? 'var(--success)' : 'var(--text-muted)' 
                    }}>
                      {cls.status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{cls.name}</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {cls.time}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {cls.room}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Book size={14} /> {cls.teacherName}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14} /> {cls.studentCount || 0} classmates</span>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Browse All Classes */
        allClasses.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)' }}>No classes are available at the moment.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {allClasses.map((cls, index) => {
              const color = colors[index % colors.length];
              return (
                <div key={cls._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: color }}></div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ background: `${color}22`, color: color, padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '500' }}>{cls.type}</span>
                      <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cls.day}</span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{cls.name}</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {cls.time}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {cls.room}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Book size={14} /> {cls.teacherName}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14} /> {cls.studentCount || 0} enrolled</span>
                  </div>

                  <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                    {cls.isEnrolled ? (
                      <button 
                        className="btn w-full" 
                        disabled
                        style={{ 
                          background: 'rgba(16, 185, 129, 0.1)', 
                          color: 'var(--success)', 
                          boxShadow: 'none',
                          cursor: 'default',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                        }}
                      >
                        <CheckCircle size={18} /> Enrolled
                      </button>
                    ) : (
                      <button 
                        className="btn w-full"
                        onClick={() => handleEnroll(cls._id)}
                        style={{ 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                        }}
                      >
                        <UserPlus size={18} /> Enroll Now
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
