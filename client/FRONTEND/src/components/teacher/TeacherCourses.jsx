import { useState, useEffect } from 'react';
import { Settings, FileText, Plus, Trash2, Loader } from 'lucide-react';
import Modal from '../ui/Modal';
import { useToast } from '../ui/ToastContext';
import api from '../../utils/api';

export default function TeacherCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: '', code: '', description: '', syllabusStatus: 'Pending' });
  const { addToast } = useToast();

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to fetch courses", err);
      addToast('Failed to load courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/courses', newCourse);
      setCourses([...courses, res.data]);
      setNewCourse({ name: '', code: '', description: '', syllabusStatus: 'Pending' });
      setIsCreateOpen(false);
      addToast('Course created successfully!', 'success');
    } catch (err) {
      addToast(err.response?.data?.msg || 'Failed to create course', 'error');
    }
  };

  const handleSettingsClick = (course) => {
    setEditingCourse({
      _id: course._id,
      name: course.name,
      code: course.code || '',
      description: course.description || '',
      syllabusStatus: course.syllabusStatus || 'Pending'
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/courses/${editingCourse._id}`, editingCourse);
      setCourses(courses.map(c => c._id === editingCourse._id ? res.data : c));
      setEditingCourse(null);
      addToast('Course updated successfully', 'success');
    } catch (err) {
      addToast(err.response?.data?.msg || 'Failed to update course', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/courses/${id}`);
      setCourses(courses.filter(c => c._id !== id));
      addToast('Course deleted', 'info');
    } catch (err) {
      addToast('Failed to delete course', 'error');
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Loader className="animate-spin text-primary" size={48} />
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Manage Courses</h1>
          <p style={{ color: 'var(--text-muted)' }}>Curriculum and administrative oversight for your assigned subjects.</p>
        </div>
        <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setIsCreateOpen(true)}>
          <Plus size={18} /> Add Course
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No courses created yet.</p>
          <button className="btn" onClick={() => setIsCreateOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={18} /> Create Your First Course
          </button>
        </div>
      ) : (
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--glass-border)' }}>
              <tr>
                <th style={{ padding: '1.2rem' }}>Course Title</th>
                <th style={{ padding: '1.2rem' }}>Course Code</th>
                <th style={{ padding: '1.2rem' }}>Syllabus Status</th>
                <th style={{ padding: '1.2rem' }}>Students</th>
                <th style={{ padding: '1.2rem', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(course => (
                <tr key={course._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '1.2rem', fontWeight: '500' }}>{course.name}</td>
                  <td style={{ padding: '1.2rem', color: 'var(--secondary)' }}>{course.code || '—'}</td>
                  <td style={{ padding: '1.2rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: course.syllabusStatus === 'Uploaded' ? 'var(--success)' : 'var(--warning)' }}>
                      <FileText size={16} /> {course.syllabusStatus || 'Pending'}
                    </span>
                  </td>
                  <td style={{ padding: '1.2rem', color: 'var(--text-muted)' }}>{course.studentCount || 0}</td>
                  <td style={{ padding: '1.2rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button 
                        onClick={() => handleSettingsClick(course)}
                        className="btn" 
                        style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', boxShadow: 'none' }}
                        title="Edit course"
                      >
                        <Settings size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(course._id)}
                        className="btn" 
                        style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', boxShadow: 'none' }}
                        title="Delete course"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Course Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Course">
        <form onSubmit={handleCreateCourse} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Course Title</label>
            <input 
              type="text" 
              className="input-field" 
              style={{ background: 'rgba(0,0,0,0.4)' }}
              value={newCourse.name}
              onChange={e => setNewCourse({...newCourse, name: e.target.value})}
              placeholder="e.g. Calculus III"
              required 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Course Code</label>
            <input 
              type="text" 
              className="input-field" 
              style={{ background: 'rgba(0,0,0,0.4)' }}
              value={newCourse.code}
              onChange={e => setNewCourse({...newCourse, code: e.target.value})}
              placeholder="e.g. MATH-301"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Description</label>
            <textarea 
              className="input-field" 
              rows="3" 
              style={{ background: 'rgba(0,0,0,0.4)' }}
              value={newCourse.description}
              onChange={e => setNewCourse({...newCourse, description: e.target.value})}
              placeholder="Brief course description..."
            ></textarea>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Syllabus Status</label>
            <select 
              className="input-field" 
              style={{ appearance: 'none', background: 'rgba(0,0,0,0.4)' }}
              value={newCourse.syllabusStatus}
              onChange={e => setNewCourse({...newCourse, syllabusStatus: e.target.value})}
            >
              <option value="Pending">Pending</option>
              <option value="Uploaded">Uploaded</option>
            </select>
          </div>
          <button type="submit" className="btn w-full">Create Course</button>
        </form>
      </Modal>

      {/* Edit Course Modal */}
      <Modal isOpen={!!editingCourse} onClose={() => setEditingCourse(null)} title={`Edit ${editingCourse?.code || 'Course'}`}>
        {editingCourse && (
          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Course Title</label>
              <input 
                type="text" 
                className="input-field" 
                style={{ background: 'rgba(0,0,0,0.4)' }}
                value={editingCourse.name}
                onChange={e => setEditingCourse({...editingCourse, name: e.target.value})}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Course Code</label>
              <input 
                type="text" 
                className="input-field" 
                style={{ background: 'rgba(0,0,0,0.4)' }}
                value={editingCourse.code}
                onChange={e => setEditingCourse({...editingCourse, code: e.target.value})}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Description</label>
              <textarea 
                className="input-field" 
                rows="3" 
                style={{ background: 'rgba(0,0,0,0.4)' }}
                value={editingCourse.description}
                onChange={e => setEditingCourse({...editingCourse, description: e.target.value})}
              ></textarea>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Syllabus Status</label>
              <select 
                className="input-field" 
                style={{ appearance: 'none', background: 'rgba(0,0,0,0.4)' }}
                value={editingCourse.syllabusStatus}
                onChange={e => setEditingCourse({...editingCourse, syllabusStatus: e.target.value})}
              >
                <option value="Uploaded">Uploaded</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <button type="submit" className="btn w-full">Save Changes</button>
          </form>
        )}
      </Modal>
    </div>
  );
}
