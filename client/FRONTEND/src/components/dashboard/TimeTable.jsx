const schedule = {
  'Monday': [
    { time: '09:00 - 10:30', subject: 'Math', type: 'Lecture' },
    { time: '11:00 - 12:30', subject: 'Physics', type: 'Lab' },
  ],
  'Tuesday': [
    { time: '10:00 - 11:30', subject: 'Computer Sci', type: 'Lecture' },
    { time: '13:00 - 14:30', subject: 'English', type: 'Seminar' },
  ],
  'Wednesday': [
    { time: '09:00 - 10:30', subject: 'Math', type: 'Lecture' },
    { time: '15:00 - 16:30', subject: 'History', type: 'Lecture' },
  ],
  'Thursday': [
    { time: '10:00 - 11:30', subject: 'Computer Sci', type: 'Lab' },
    { time: '13:00 - 14:30', subject: 'English', type: 'Seminar' },
  ],
  'Friday': [
    { time: '11:00 - 12:30', subject: 'Physics', type: 'Lecture' },
    { time: '14:00 - 15:30', subject: 'History', type: 'Tutorial' },
  ]
};

export default function TimeTable() {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Time Table</h1>
        <p style={{ color: 'var(--text-muted)' }}>Your weekly class schedule.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', minWidth: '800px' }}>
        {Object.entries(schedule).map(([day, classes]) => (
          <div key={day} className="glass-panel" style={{ padding: '1rem', minHeight: '400px' }}>
            <h3 style={{ textAlign: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)', marginBottom: '1rem' }}>{day}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {classes.map((cls, idx) => (
                <div key={idx} style={{ 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid var(--glass-border)',
                  padding: '1rem', 
                  borderRadius: '8px',
                  borderLeft: `4px solid ${cls.type === 'Lecture' ? 'var(--primary)' : cls.type === 'Lab' ? 'var(--secondary)' : 'var(--warning)'}`
                }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>{cls.time}</div>
                  <strong style={{ display: 'block', fontSize: '1.1rem', marginBottom: '4px' }}>{cls.subject}</strong>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>{cls.type}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
