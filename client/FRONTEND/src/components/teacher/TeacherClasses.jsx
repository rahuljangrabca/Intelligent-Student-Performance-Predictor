import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Clock, Video, Plus, Trash2, Loader, ClipboardCheck } from 'lucide-react';
import { useToast } from '../ui/ToastContext';
import Modal from '../ui/Modal';
import api from '../../utils/api';

export default function TeacherClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [liveClasses, setLiveClasses] = useState({});
  const [newClass, setNewClass] = useState({ name: '', type: 'Lecture', time: '', room: '', day: 'Monday' });
  const { addToast } = useToast();
  const navigate = useNavigate();

  const fetchClasses = async () => {
    try {
      const res = await api.get('/classes');
      setClasses(res.data);
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

  const handleCreateClass = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/classes', newClass);
      setClasses([...classes, res.data]);
      setNewClass({ name: '', type: 'Lecture', time: '', room: '', day: 'Monday' });
      setIsCreateOpen(false);
      addToast('Class created successfully!', 'success');
    } catch (err) {
      addToast(err.response?.data?.msg || 'Failed to create class', 'error');
    }
  };

  const handleDeleteClass = async (id) => {
    try {
      await api.delete(`/classes/${id}`);
      setClasses(classes.filter(c => c._id !== id));
      addToast('Class deleted', 'info');
    } catch (err) {
      addToast('Failed to delete class', 'error');
    }
  };

  const handleMarkCompleted = async (id) => {
    try {
      const res = await api.put(`/classes/${id}`, { status: 'Completed' });
      setClasses(classes.map(c => c._id === id ? res.data : c));
      setLiveClasses(prev => ({ ...prev, [id]: false }));
      addToast('Class marked as completed', 'success');
    } catch (err) {
      addToast('Failed to update class', 'error');
    }
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    setIsRescheduleOpen(false);
    addToast('Reschedule request sent to administration.', 'info');
  };

  const toggleVirtualLink = (id, currentStatus) => {
    setLiveClasses(prev => ({ ...prev, [id]: !currentStatus }));
    if (!currentStatus) {
      addToast('Virtual Session started! Students are being notified.', 'success');
    } else {
      addToast('Virtual Session ended.', 'info');
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Loader className="animate-spin text-primary" size={48} />
    </div>
  );

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>My Classes</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your daily class schedule.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn" onClick={() => setIsRescheduleOpen(true)}>Request Reschedule</button>
          <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setIsCreateOpen(true)}>
            <Plus size={18} /> Add Class
          </button>
        </div>
      </div>

      {classes.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No classes created yet.</p>
          <button className="btn" onClick={() => setIsCreateOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={18} /> Create Your First Class
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {classes.map(cls => {
            const isLive = liveClasses[cls._id] || false;
            return (
              <div key={cls._id} className="glass-panel" style={{ padding: '1.5rem', borderTop: `4px solid ${cls.status === 'Completed' ? 'var(--text-muted)' : isLive ? 'var(--danger)' : 'var(--accent)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem' }}>{cls.type}</span>
                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cls.day}</span>
                  </div>
                  <span style={{ color: cls.status === 'Upcoming' ? 'var(--success)' : 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {isLive ? (
                      <span style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--danger)', animation: 'pulse 1s infinite' }}></div> LIVE
                      </span>
                    ) : cls.status}
                  </span>
                </div>
                
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>{cls.name}</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} /> <span>{cls.time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={16} /> <span>{cls.room}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={16} /> <span>{cls.studentCount || 0} Enrolled Students</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                  {cls.status === 'Upcoming' && (
                    <>
                      <button 
                        onClick={() => toggleVirtualLink(cls._id, isLive)}
                        className="btn" 
                        style={{ 
                          flex: 1,
                          background: isLive ? 'transparent' : 'rgba(255,255,255,0.1)', 
                          border: isLive ? '1px solid var(--danger)' : 'none',
                          color: isLive ? 'var(--danger)' : 'white',
                          boxShadow: 'none',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                        }}
                      >
                        <Video size={18} /> {isLive ? 'End' : 'Go Live'}
                      </button>
                      <button 
                        onClick={() => navigate('/teacher-dashboard/attendance', { state: { selectedClass: cls } })}
                        className="btn" 
                        style={{ 
                          flex: 1,
                          background: 'rgba(255,255,255,0.1)', 
                          color: 'white',
                          boxShadow: 'none',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                        }}
                      >
                        <ClipboardCheck size={18} /> Attendance
                      </button>
                      <button
                        onClick={() => handleMarkCompleted(cls._id)}
                        className="btn"
                        style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', boxShadow: 'none', fontSize: '0.85rem' }}
                      >
                        Done
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDeleteClass(cls._id)}
                    className="btn"
                    style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', boxShadow: 'none', padding: '8px' }}
                    title="Delete class"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Class Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Class">
        <form onSubmit={handleCreateClass} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Class Name</label>
            <input 
              type="text" 
              className="input-field" 
              style={{ background: 'rgba(0,0,0,0.4)' }}
              value={newClass.name}
              onChange={e => setNewClass({...newClass, name: e.target.value})}
              placeholder="e.g. Advanced Calculus"
              required 
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Type</label>
              <select 
                className="input-field" 
                style={{ appearance: 'none', background: 'rgba(0,0,0,0.4)' }}
                value={newClass.type}
                onChange={e => setNewClass({...newClass, type: e.target.value})}
              >
                <option value="Lecture">Lecture</option>
                <option value="Tutorial">Tutorial</option>
                <option value="Lab">Lab</option>
                <option value="Seminar">Seminar</option>
                <option value="Workshop">Workshop</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Day</label>
              <select 
                className="input-field" 
                style={{ appearance: 'none', background: 'rgba(0,0,0,0.4)' }}
                value={newClass.day}
                onChange={e => setNewClass({...newClass, day: e.target.value})}
              >
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Time</label>
            <input 
              type="text" 
              className="input-field" 
              style={{ background: 'rgba(0,0,0,0.4)' }}
              value={newClass.time}
              onChange={e => setNewClass({...newClass, time: e.target.value})}
              placeholder="e.g. 10:00 AM - 11:30 AM"
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Room / Location</label>
            <input 
              type="text" 
              className="input-field" 
              style={{ background: 'rgba(0,0,0,0.4)' }}
              value={newClass.room}
              onChange={e => setNewClass({...newClass, room: e.target.value})}
              placeholder="e.g. Hall 402"
              required 
            />
          </div>
          <button type="submit" className="btn w-full">Create Class</button>
        </form>
      </Modal>

      {/* Reschedule Modal */}
      <Modal isOpen={isRescheduleOpen} onClose={() => setIsRescheduleOpen(false)} title="Reschedule Class">
        <form onSubmit={handleRescheduleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Select Class</label>
            <select className="input-field" style={{ appearance: 'none', background: 'rgba(0,0,0,0.4)' }}>
              {classes.filter(c => c.status === 'Upcoming').map(c => (
                <option key={c._id} value={c._id}>{c.name} ({c.room})</option>
              ))}
              {classes.filter(c => c.status === 'Upcoming').length === 0 && <option>No upcoming classes</option>}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Proposed Date</label>
            <input type="date" className="input-field" style={{ background: 'rgba(0,0,0,0.4)', colorScheme: 'dark' }} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Reason for Rescheduling</label>
            <textarea className="input-field" rows="3" style={{ background: 'rgba(0,0,0,0.4)' }} placeholder="Briefly explain why..." required></textarea>
          </div>
          <button type="submit" className="btn w-full">Submit Request</button>
        </form>
      </Modal>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
      `}} />
    </div>
  );
}
