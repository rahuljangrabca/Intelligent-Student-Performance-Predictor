import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Mail, Lock, ArrowRight, User, BookOpen, UserPlus } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // 'student' or 'teacher'
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.msg || 'Registration failed');
      }

      // Automatically login after register, or just redirect to login logic
      // Assuming register returns user object similar to login, we might need a separate login step, 
      // but let's just send them back to login page with success message
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="login-container flex items-center justify-center min-h-screen">
      <div className="glass-panel login-card animate-fade-in flex-col gap-6" style={{ padding: '3rem', width: '100%', maxWidth: '420px', margin: '1rem' }}>
        
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="logo-container" style={{ background: 'linear-gradient(135deg, var(--secondary), var(--primary))', padding: '16px', borderRadius: '50%', boxShadow: '0 0 20px rgba(14, 165, 233, 0.4)' }}>
            <UserPlus size={40} color="white" />
          </div>
          <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: '700', margin: '0' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)' }}>Join our educational platform today</p>
        </div>

        {/* Role Toggle */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '12px', marginTop: '1rem' }}>
          <button 
            type="button"
            onClick={() => setRole('student')}
            style={{ 
              flex: 1, 
              padding: '10px', 
              borderRadius: '8px', 
              border: 'none', 
              background: role === 'student' ? 'var(--card-bg)' : 'transparent',
              color: role === 'student' ? 'white' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'var(--transition)'
            }}
          >
            <User size={16} /> Student
          </button>
          <button 
            type="button"
            onClick={() => setRole('teacher')}
            style={{ 
              flex: 1, 
              padding: '10px', 
              borderRadius: '8px', 
              border: 'none', 
              background: role === 'teacher' ? 'var(--card-bg)' : 'transparent',
              color: role === 'teacher' ? 'white' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'var(--transition)'
            }}
          >
            <BookOpen size={16} /> Teacher
          </button>
        </div>

        {error && <div style={{ color: '#ff4d4f', background: 'rgba(255, 77, 79, 0.1)', padding: '10px', borderRadius: '8px', marginTop: '1rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleRegister} className="flex-col gap-4" style={{ marginTop: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <User size={18} style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Full Name" 
              className="input-field" 
              style={{ paddingLeft: '44px' }} 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div style={{ position: 'relative', marginTop: '1rem' }}>
            <Mail size={18} style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="email" 
              placeholder="Email address" 
              className="input-field" 
              style={{ paddingLeft: '44px' }} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={{ position: 'relative', marginTop: '1rem', marginBottom: '1.5rem' }}>
            <Lock size={18} style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="password" 
              placeholder="Password" 
              className="input-field" 
              style={{ paddingLeft: '44px' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn flex items-center justify-center gap-2 w-full">
            Register <ArrowRight size={18} />
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--secondary-light)', textDecoration: 'none', fontWeight: '500' }}>Sign In here</Link>
        </p>

      </div>
    </div>
  );
}
