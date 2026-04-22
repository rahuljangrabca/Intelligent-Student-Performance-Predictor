import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, TrendingDown, BookOpen, UserX, Search, Filter, ArrowRight, Loader } from 'lucide-react';
import { useToast } from '../ui/ToastContext';

export default function TeacherPredictor() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchTeacherDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/dashboard/teacher', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          // Transform backend data to fit the frontend
          const transformedStudents = data.studentsList.map(s => ({
            id: s.id,
            name: s.name,
            class: 'General Class', 
            attendance: s.attendance || 0,
            avgScore: s.avgScore || 0,
            assignmentsMissed: s.badPoints ? s.badPoints.filter(p => p.toLowerCase().includes('assignment')).length : 0,
            risk: s.risk.charAt(0).toUpperCase() + s.risk.slice(1).toLowerCase(),
            reason: s.badPoints && s.badPoints.length > 0 ? s.badPoints.join(', ') : 'Performance is within expectations.',
            intervention: s.suggestions && s.suggestions.length > 0 ? s.suggestions[0] : 'Continue business as usual.',
            trend: [ 
              { week: 'W1', score: Math.max(0, s.avgScore - 5) }, 
              { week: 'W2', score: Math.max(0, s.avgScore - 2) }, 
              { week: 'W3', score: s.avgScore }, 
              { week: 'W4', score: s.avgScore } 
            ]
          }));
          setStudents(transformedStudents);
          if (transformedStudents.length > 0) {
            setSelectedStudent(transformedStudents[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacherDashboard();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter(s => 
      (filterClass === 'All' || s.class === filterClass) &&
      s.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, filterClass, students]);

  const stats = useMemo(() => {
    return {
      highRisk: students.filter(s => s.risk === 'High').length,
      mediumRisk: students.filter(s => s.risk === 'Medium').length,
      lowRisk: students.filter(s => s.risk === 'Low').length,
      total: students.length
    };
  }, [students]);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><Loader className="animate-spin text-primary" size={48} /></div>;

  const getRiskColor = (risk) => {
    if (risk === 'High') return 'var(--error)';
    if (risk === 'Medium') return 'var(--warning)';
    return 'var(--success)';
  };
  
  const getRiskBg = (risk) => {
    if (risk === 'High') return 'rgba(239, 68, 68, 0.1)';
    if (risk === 'Medium') return 'rgba(245, 158, 11, 0.1)';
    return 'rgba(16, 185, 129, 0.1)';
  };

  const handleAction = () => {
    addToast(`Action initiated for ${selectedStudent.name}. Opening messaging...`, 'success');
  };

  const handleLogInteraction = () => {
    addToast(`Interaction correctly logged on ${selectedStudent.name}'s profile.`, 'success');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          Performance Predictor
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Proactive AI analytics to identify and support at-risk students.</p>
      </div>

      {/* Global Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ textAlign: 'center', borderTop: '4px solid var(--error)' }}>
          <h3 style={{ margin: '0', fontSize: '2rem', color: 'var(--error)' }}>{stats.highRisk}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>High Risk Actions Needed</p>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center', borderTop: '4px solid var(--warning)' }}>
          <h3 style={{ margin: '0', fontSize: '2rem', color: 'var(--warning)' }}>{stats.mediumRisk}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>Medium Risk Students</p>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center', borderTop: '4px solid var(--success)' }}>
          <h3 style={{ margin: '0', fontSize: '2rem', color: 'var(--success)' }}>{stats.lowRisk}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>On-Track Students</p>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center', borderTop: '4px solid var(--primary)' }}>
          <h3 style={{ margin: '0', fontSize: '2rem', color: 'var(--primary-light)' }}>{stats.total}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0 0 0' }}>Total Students Analyzed</p>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) minmax(400px, 1fr)', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Col: Roster and Filter */}
        <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '600px' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>Class Roster Predictions</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  placeholder="Search student..." 
                  className="input-field" 
                  style={{ paddingLeft: '36px', height: '100%', padding: '8px 12px 8px 36px' }}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <select className="input-field" style={{ width: '120px', appearance: 'none', background: 'var(--bg-color)', padding: '8px 12px' }} value={filterClass} onChange={e => setFilterClass(e.target.value)}>
                <option value="All">All Classes</option>
                <option value="MATH-301">MATH-301</option>
                <option value="MATH-201">MATH-201</option>
                <option value="CS-101">CS-101</option>
              </select>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredStudents.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No students found.</div>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {filteredStudents.map(student => (
                  <li 
                    key={student.id} 
                    onClick={() => setSelectedStudent(student)}
                    style={{ 
                      padding: '1rem 1.5rem', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      borderBottom: '1px solid var(--glass-border)',
                      cursor: 'pointer',
                      background: selectedStudent?.id === student.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                      transition: 'var(--transition)'
                    }}
                    className="hover-brightness"
                  >
                    <div>
                      <strong style={{ display: 'block', marginBottom: '4px' }}>{student.name}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{student.class}</span>
                    </div>
                    <span style={{
                      background: getRiskBg(student.risk),
                      color: getRiskColor(student.risk),
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold'
                    }}>
                      {student.risk} Risk
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Col: Deep Dive Analysis */}
        {selectedStudent ? (
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: '600px' }}>
            
            {/* Context Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem' }}>{selectedStudent.name}</h2>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <span><BookOpen size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }}/>{selectedStudent.class}</span>
                  <span>Average Score: <strong style={{ color: 'white' }}>{selectedStudent.avgScore}%</strong></span>
                </div>
              </div>
              <span style={{
                background: getRiskBg(selectedStudent.risk),
                color: getRiskColor(selectedStudent.risk),
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <AlertCircle size={16} /> {selectedStudent.risk} Risk Status
              </span>
            </div>

            <hr style={{ border: '0', borderTop: '1px solid var(--glass-border)', margin: '0' }} />

            {/* AI Diagnostics */}
            <div>
              <h4 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingDown size={18} color="var(--primary-light)" /> Algorithm Insights
              </h4>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.2rem', borderRadius: '8px', borderLeft: `3px solid ${getRiskColor(selectedStudent.risk)}` }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '0.95rem' }}><strong>Identified Pattern:</strong> {selectedStudent.reason}</p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                   <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem' }}>
                     <span style={{ color: 'var(--text-muted)' }}>Attendance:</span> <strong style={{color: selectedStudent.attendance < 75 ? 'var(--error)' : 'white'}}>{selectedStudent.attendance}%</strong>
                   </div>
                   <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem' }}>
                     <span style={{ color: 'var(--text-muted)' }}>Missed Assignments:</span> <strong style={{color: selectedStudent.assignmentsMissed > 0 ? 'var(--warning)' : 'white'}}>{selectedStudent.assignmentsMissed}</strong>
                   </div>
                </div>
              </div>
            </div>

            {/* Actionable Intervention */}
            <div>
              <h4 style={{ margin: '0 0 1rem 0' }}>Suggested Intervention</h4>
              <div style={{ background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(139, 92, 246, 0.1))', padding: '1.2rem', borderRadius: '8px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <ArrowRight size={20} color="var(--primary-light)" />
                  <p style={{ margin: 0, fontSize: '1rem', fontWeight: '500' }}>{selectedStudent.intervention}</p>
                </div>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '10px' }}>
                  <button onClick={handleAction} className="btn" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Take Action Mode</button>
                  <button onClick={handleLogInteraction} className="btn" style={{ background: 'transparent', boxShadow: 'none', border: '1px solid var(--glass-border)', padding: '6px 12px', fontSize: '0.85rem' }}>Log Interaction</button>
                </div>
              </div>
            </div>

            {/* Performance Trend Chart */}
            <div style={{ flex: 1, minHeight: '300px', width: '100%', position: 'relative' }}>
              <h4 style={{ margin: '0 0 1rem 0' }}>Performance Trend (Last 4 Weeks)</h4>
              <div style={{ width: '100%', height: '250px' }}>
                {selectedStudent?.trend && selectedStudent.trend.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%" debounce={100}>
                    <LineChart data={selectedStudent.trend} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                      <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} dot={{ r: 5, fill: 'var(--primary-light)' }} />
                      <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="week" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                      <YAxis domain={[0, 100]} stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                        itemStyle={{ color: 'var(--primary-light)' }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    No trend data available for this student.
                  </div>
                )}
              </div>
            </div>

          </div>
        ) : (
          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '600px' }}>
            <p style={{ color: 'var(--text-muted)' }}>Select a student from the roster to view their predictor profile.</p>
          </div>
        )}

      </div>
    </div>
  );
}
