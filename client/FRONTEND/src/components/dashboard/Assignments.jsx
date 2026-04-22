import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, Upload, X, Link, Check, Loader } from 'lucide-react';

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState(null);
  const [submissionLink, setSubmissionLink] = useState('');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/assignments', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setAssignments(data);
        }
      } catch (err) {
        console.error("Failed to fetch assignments", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const handleUploadClick = (id) => {
    setUploadingId(id);
    setSubmissionLink('');
  };

  const handleCancelUpload = () => {
    setUploadingId(null);
    setSubmissionLink('');
  };

  const handleSubmit = async (id) => {
    // For now, localized UI update as we don't have a submission endpoint yet, 
    // but the get part is hooked. 
    setAssignments(assignments.map(item => 
      item._id === id ? { ...item, status: 'submitted', submission: submissionLink } : item
    ));
    setUploadingId(null);
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><Loader className="animate-spin text-primary" size={48} /></div>;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Assignments</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your submissions and track grades.</p>
      </div>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--glass-border)' }}>
            <tr>
              <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: '500' }}>Assignment</th>
              <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: '500' }}>Course</th>
              <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: '500' }}>Status</th>
              <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: '500' }}>Due Date</th>
              <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: '500' }}>Points / Grade</th>
              <th style={{ padding: '1.2rem', color: 'var(--text-muted)', fontWeight: '500' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map(item => (
              <React.Fragment key={item.id}>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', transition: 'var(--transition)' }}>
                  <td style={{ padding: '1.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                        <FileText size={18} color="var(--secondary)" />
                      </div>
                      <span style={{ fontWeight: '500' }}>{item.title}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1.2rem', color: 'var(--text-muted)' }}>{item.course}</td>
                  <td style={{ padding: '1.2rem' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      background: item.status === 'Pending' ? 'rgba(245, 158, 11, 0.1)' : item.status === 'Submitted' ? 'rgba(14, 165, 233, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      color: item.status === 'Pending' ? 'var(--warning)' : item.status === 'Submitted' ? 'var(--secondary)' : 'var(--success)',
                    }}>
                      {item.status === 'Pending' && <Clock size={14} />}
                      {item.status === 'Graded' && <CheckCircle size={14} />}
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '1.2rem', color: 'var(--text-muted)' }}>{item.dueDate}</td>
                  <td style={{ padding: '1.2rem', fontWeight: item.status === 'Graded' ? 'bold' : 'normal', color: item.status === 'Graded' ? 'var(--primary-light)' : 'var(--text-muted)' }}>
                    {item.points}
                  </td>
                  <td style={{ padding: '1.2rem' }}>
                    {item.status === 'Pending' && uploadingId !== item.id && (
                      <button 
                        onClick={() => handleUploadClick(item.id)}
                        style={{
                          padding: '6px 12px',
                          background: 'var(--primary)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}
                      >
                        <Upload size={14} /> Upload
                      </button>
                    )}
                    {(item.status === 'Submitted' || item.status === 'Graded') && (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={14} color="var(--secondary)" /> Done
                      </span>
                    )}
                  </td>
                </tr>
                {uploadingId === item.id && (
                  <tr style={{ background: 'rgba(0,0,0,0.2)' }}>
                    <td colSpan="6" style={{ padding: '1.5rem' }}>
                      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Upload size={18} color="var(--primary-light)"/> Submit Assessment: {item.title}</h4>
                          <button onClick={handleCancelUpload} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
                        </div>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          <div style={{ flex: 1, minWidth: '250px' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Submission Link (PDF / Github / Drive)</label>
                            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0 12px' }}>
                               <Link size={16} color="var(--text-muted)" style={{ marginRight: '8px' }} />
                               <input 
                                 type="text" 
                                 placeholder="https://..." 
                                 value={submissionLink}
                                 onChange={(e) => setSubmissionLink(e.target.value)}
                                 style={{ width: '100%', background: 'transparent', border: 'none', color: 'white', padding: '10px 0', outline: 'none' }}
                               />
                            </div>
                          </div>
                          <div style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '15px' }}>
                             <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>OR</span>
                             <label style={{
                               padding: '10px 16px',
                               background: 'rgba(255,255,255,0.05)',
                               border: '1px dashed var(--glass-border)',
                               borderRadius: '8px',
                               cursor: 'pointer',
                               fontSize: '0.9rem',
                               color: 'var(--text-muted)',
                               display: 'flex',
                               alignItems: 'center',
                               gap: '6px',
                               transition: 'var(--transition)'
                             }} className="hover-brightness">
                               <FileText size={16} /> Choose File
                               <input type="file" style={{ display: 'none' }} />
                             </label>
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
                          <button onClick={handleCancelUpload} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '6px', color: 'white', cursor: 'pointer' }}>Cancel</button>
                          <button onClick={() => handleSubmit(item.id)} style={{ padding: '8px 16px', background: 'var(--primary)', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>Submit Assignment</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
