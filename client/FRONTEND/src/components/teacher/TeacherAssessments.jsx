import { useState, useEffect } from 'react';
import { UploadCloud, FileText, ChevronDown, ChevronUp, Users, Clock, CheckCircle, Loader } from 'lucide-react';
import { useToast } from '../ui/ToastContext';
import Modal from '../ui/Modal';

export default function TeacherAssessments() {
  const [activeTab, setActiveTab] = useState('list');
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [gradingModal, setGradingModal] = useState(null); // { submission, assessmentId }
  
  // Form State
  const [assignTitle, setAssignTitle] = useState('');
  const [assignCourse, setAssignCourse] = useState('MATH-301: Calculus III');
  const [assignDate, setAssignDate] = useState('');
  const [assignPoints, setAssignPoints] = useState('100');

  const { addToast } = useToast();

  const fetchAssessments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/assignments/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAssessments(data);
      }
    } catch (err) {
      console.error("Failed to fetch assessments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const handleDeploy = async (e) => {
    e.preventDefault();
    if (!assignTitle || !assignDate || !assignCourse) {
      addToast('Please fill all assessment fields.', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          title: assignTitle, 
          marks: assignPoints,
          status: 'pending' 
        })
      });
      if (res.ok) {
        addToast('Assessment Deployed Successfully!', 'success');
        setAssignTitle('');
        setAssignDate('');
        setActiveTab('list');
        fetchAssessments();
      }
    } catch (err) {
      addToast('Deployment failed', 'error');
    }
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    const marks = e.target.elements.gradeInput.value;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/assignments/grade', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          assignmentId: gradingModal.assessmentId,
          marks 
        })
      });
      if (res.ok) {
        addToast(`Posted grade correctly`, 'success');
        setGradingModal(null);
        fetchAssessments();
      }
    } catch (err) {
      addToast('Grading failed', 'error');
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><Loader className="animate-spin text-primary" size={48} /></div>;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Assessments</h1>
        <p style={{ color: 'var(--text-muted)' }}>Create assignments and evaluate student submissions by course.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
        <button onClick={() => setActiveTab('list')} className="btn" style={{ background: activeTab === 'list' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'transparent', boxShadow: activeTab === 'list' ? undefined : 'none', color: activeTab === 'list' ? 'white' : 'var(--text-muted)' }}>Manage Assessments</button>
        <button onClick={() => setActiveTab('create')} className="btn" style={{ background: activeTab === 'create' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'transparent', boxShadow: activeTab === 'create' ? undefined : 'none', color: activeTab === 'create' ? 'white' : 'var(--text-muted)' }}>+ Create New</button>
      </div>

      {activeTab === 'create' && (
        <div className="glass-panel animate-fade-in" style={{ padding: '2rem', maxWidth: '600px' }}>
          <form onSubmit={handleDeploy} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Assignment Title</label>
              <input type="text" className="input-field" placeholder="e.g. Calculus Midterm Project" value={assignTitle} onChange={e => setAssignTitle(e.target.value)} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Select Course</label>
              <select className="input-field" style={{ appearance: 'none', background: 'var(--bg-color)' }} value={assignCourse} onChange={e => setAssignCourse(e.target.value)}>
                <option>MATH-301: Calculus III</option>
                <option>MATH-201: Linear Algebra</option>
                <option>CS-101: Intro to Programming</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Due Date</label>
                <input type="date" className="input-field" style={{ colorScheme: 'dark', background: 'var(--bg-color)' }} value={assignDate} onChange={e => setAssignDate(e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Maximum Points</label>
                <input type="number" className="input-field" value={assignPoints} onChange={e => setAssignPoints(e.target.value)} />
              </div>
            </div>
            <div style={{ border: '2px dashed var(--glass-border)', borderRadius: '12px', padding: '3rem', textAlign: 'center', cursor: 'pointer', transition: 'var(--transition)' }} className="hover-brightness">
              <UploadCloud size={48} color="var(--secondary)" style={{ marginBottom: '1rem', margin: '0 auto' }} />
              <p>Drag and drop reference files here or <strong>browse</strong></p>
            </div>
            <button type="submit" className="btn w-full">Deploy Assessment</button>
          </form>
        </div>
      )}

      {activeTab === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(assessments || []).length === 0 && (
            <p style={{ color: 'var(--text-muted)' }}>No assessments created yet.</p>
          )}
          {(assessments || []).map((assessment) => (
            <div key={assessment?.id || Math.random()} className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
              {/* Assessment Header */}
              <div 
                onClick={() => setExpandedId(expandedId === assessment?.id ? null : assessment?.id)}
                style={{ 
                  padding: '1.5rem', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  cursor: 'pointer',
                  background: expandedId === assessment?.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                  transition: 'var(--transition)'
                }}
                className="hover-brightness"
              >
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={20} color="var(--primary-light)" /> {assessment?.title || 'Untitled Assessment'}
                  </h3>
                  <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><UploadCloud size={14} /> {assessment?.course || 'General'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} /> Due: {assessment?.dueDate || 'N/A'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={14} /> {(assessment?.submissions || []).length} Submissions</span>
                  </div>
                </div>
                <div>
                  {expandedId === assessment?.id ? <ChevronUp size={24} color="var(--text-muted)" /> : <ChevronDown size={24} color="var(--text-muted)" />}
                </div>
              </div>

              {/* Submissions List */}
              {expandedId === assessment?.id && (
                <div style={{ borderTop: '1px solid var(--glass-border)', padding: '1.5rem', background: 'rgba(0,0,0,0.2)' }} className="animate-fade-in">
                  <h4 style={{ margin: '0 0 1rem 0', color: 'white' }}>Student Submissions</h4>
                  {(assessment?.submissions || []).length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No student has submitted this assignment yet.</p>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                      <thead style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <tr>
                          <th style={{ padding: '0.8rem 0', fontWeight: '500' }}>Student Details</th>
                          <th style={{ padding: '0.8rem 0', fontWeight: '500' }}>Submission File/Link</th>
                          <th style={{ padding: '0.8rem 0', fontWeight: '500' }}>Status</th>
                          <th style={{ padding: '0.8rem 0', fontWeight: '500', textAlign: 'right' }}>Grade & Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(assessment?.submissions || []).map((sub) => (
                          <tr key={sub?.id || Math.random()} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '1rem 0' }}>
                              <strong style={{ color: 'white' }}>{sub?.name || 'Unknown Student'}</strong><br />
                              <span style={{ color: 'var(--text-muted)' }}>Roll: {sub?.roll || 'N/A'}</span>
                            </td>
                            <td style={{ padding: '1rem 0' }}>
                              <a href="#" style={{ color: 'var(--secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <FileText size={16} /> {sub?.file || 'submission.pdf'}
                              </a>
                            </td>
                            <td style={{ padding: '1rem 0' }}>
                              <span style={{ 
                                color: sub?.status === 'Graded' ? 'var(--success)' : 'var(--warning)', 
                                background: sub?.status === 'Graded' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', 
                                padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem',
                                display: 'inline-flex', alignItems: 'center', gap: '4px'
                              }}>
                                {sub?.status === 'Graded' && <CheckCircle size={12} />}
                                {sub?.status || 'Pending'}
                              </span>
                            </td>
                            <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                              {sub?.status === 'Graded' ? (
                                <span style={{ fontWeight: 'bold', color: 'white', marginRight: '1rem' }}>{sub?.grade} pts</span>
                              ) : null}
                              <button 
                                onClick={() => setGradingModal({ submission: sub, assessmentId: assessment?.id })}
                                className="btn" 
                                style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.1)', boxShadow: 'none', fontSize: '0.85rem' }}
                              >
                                {sub?.status === 'Graded' ? 'Update Grade' : 'Grade'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Grading Modal */}
      <Modal isOpen={!!gradingModal} onClose={() => setGradingModal(null)} title="Grade Submission">
        {gradingModal && (
          <form onSubmit={handleGradeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>Reviewing submission for <strong>{gradingModal.submission.name}</strong>.</p>
            
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FileText size={24} color="var(--primary-light)" />
              <span style={{ flex: 1, textDecoration: 'underline' }}>{gradingModal.submission.file}</span>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Assign Grade / Points</label>
              <input name="gradeInput" type="number" min="0" max="100" className="input-field" style={{ background: 'rgba(0,0,0,0.4)', maxWidth: '150px' }} required placeholder="e.g. 85" defaultValue={gradingModal.submission.grade || ''} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Feedback Comments (Optional)</label>
              <textarea className="input-field" rows="3" style={{ background: 'rgba(0,0,0,0.4)' }} placeholder="Great job on question 4..."></textarea>
            </div>
            <button type="submit" className="btn w-full">Submit Grade</button>
          </form>
        )}
      </Modal>

    </div>
  );
}
