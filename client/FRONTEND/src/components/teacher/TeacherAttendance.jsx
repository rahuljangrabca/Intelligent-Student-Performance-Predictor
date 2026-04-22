import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Check, X, Loader, ChevronRight } from 'lucide-react';
import { useToast } from '../ui/ToastContext';
import api from '../../utils/api';

export default function TeacherAttendance() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();
  const location = useLocation();

  useEffect(() => {
    fetchClasses();
    if (location.state?.selectedClass) {
      handleSelectClass(location.state.selectedClass);
    }
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await api.get('/classes');
      setClasses(res.data);
      setLoading(false);
    } catch (err) {
      addToast('Failed to load classes', 'error');
      setLoading(false);
    }
  };

  const handleSelectClass = async (cls) => {
    setSelectedClass(cls);
    setLoading(true);
    try {
      const res = await api.get(`/classes/${cls._id}/students`);
      // Initialize status as 'Present' by default for convenience
      setStudents(res.data.map(s => ({ ...s, status: 'Present' })));
    } catch (err) {
      addToast('Failed to load students', 'error');
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = (id, status) => {
    setStudents(students.map(s => s._id === id ? { ...s, status } : s));
  };

  const handleSubmit = async () => {
    if (!selectedClass) return;
    
    setSubmitting(true);
    try {
      const attendanceData = students.map(s => ({
        studentId: s._id,
        status: s.status
      }));

      await api.post('/attendance', {
        classId: selectedClass._id,
        attendanceData
      });

      addToast('Attendance Register Successfully Saved!', 'success');
      setSelectedClass(null);
      setStudents([]);
    } catch (err) {
      addToast('Failed to save attendance', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !selectedClass) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Loader className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div>
        <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Attendance Register</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          {selectedClass ? `Marking for: ${selectedClass.name} (${selectedClass.time})` : 'Select a class to mark attendance'}
        </p>
      </div>

      {!selectedClass ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {classes.map(cls => (
            <button 
              key={cls._id} 
              onClick={() => handleSelectClass(cls)}
              className="glass-panel" 
              style={{ 
                width: '100%', 
                padding: '1.5rem', 
                textAlign: 'left', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                transition: 'var(--transition)',
                cursor: 'pointer',
                border: '1px solid var(--glass-border)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{cls.name}</h3>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{cls.day} • {cls.time} • {cls.room}</span>
              </div>
              <ChevronRight size={20} style={{ color: 'var(--text-muted)' }} />
            </button>
          ))}
          {classes.length === 0 && (
            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No classes assigned to you.
            </div>
          )}
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          {loading ? (
             <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                <Loader className="animate-spin text-primary" size={32} />
             </div>
          ) : (
            <>
              <button 
                onClick={() => setSelectedClass(null)} 
                style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                ← Back to classes
              </button>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {students.map(student => (
                  <div key={student._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{student.name}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{student.email}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => markAttendance(student._id, 'Present')}
                        style={{ 
                          background: student.status === 'Present' ? 'var(--success)' : 'transparent', 
                          color: student.status === 'Present' ? 'white' : 'var(--text-main)',
                          border: `1px solid ${student.status === 'Present' ? 'var(--success)' : 'var(--glass-border)'}`,
                          padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s ease'
                        }}>
                        <Check size={16} /> Present
                      </button>
                      <button 
                        onClick={() => markAttendance(student._id, 'Absent')}
                        style={{ 
                          background: student.status === 'Absent' ? 'var(--danger)' : 'transparent', 
                          color: student.status === 'Absent' ? 'white' : 'var(--text-main)',
                          border: `1px solid ${student.status === 'Absent' ? 'var(--danger)' : 'var(--glass-border)'}`,
                          padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s ease'
                        }}>
                        <X size={16} /> Absent
                      </button>
                    </div>
                  </div>
                ))}
                {students.length === 0 && (
                   <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>No students enrolled in this class yet.</p>
                )}
              </div>

              {students.length > 0 && (
                <button 
                  onClick={handleSubmit} 
                  disabled={submitting}
                  className="btn" 
                  style={{ marginTop: '2rem', width: '100%', opacity: submitting ? 0.7 : 1 }}
                >
                  {submitting ? 'Saving...' : 'Submit Attendance Register'}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
