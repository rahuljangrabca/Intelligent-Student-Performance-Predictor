import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Mail, Lock, ArrowRight, User, BookOpen } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // 'student' or 'teacher'
  const navigate = useNavigate();

  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.msg || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'student') {
        navigate('/student-dashboard');
      } else {
        navigate('/teacher-dashboard');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          token: credentialResponse.credential,
          role: role // Use the currently selected role for new signups
        })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.msg || 'Google login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'student') {
        navigate('/student-dashboard');
      } else {
        navigate('/teacher-dashboard');
      }
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="login-container flex items-center justify-center min-h-screen">
      <div className="glass-panel login-card animate-fade-in flex-col gap-6" style={{ padding: '3rem', width: '100%', maxWidth: '420px', margin: '1rem' }}>
        
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="logo-container" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', padding: '16px', borderRadius: '50%', boxShadow: '0 0 20px rgba(109, 40, 217, 0.4)' }}>
            <GraduationCap size={40} color="white" />
          </div>
          <h1 className="text-gradient" style={{ fontSize: '2rem', fontWeight: '700', margin: '0' }}>Portal Login</h1>
          <p style={{ color: 'var(--text-muted)' }}>Sign in to continue your journey</p>
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

        <form onSubmit={handleLogin} className="flex-col gap-4" style={{ marginTop: '1rem' }}>
          <div style={{ position: 'relative' }}>
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
          <div style={{ position: 'relative', marginTop: '1rem' }}>
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
          
          <div className="flex justify-between items-center" style={{ marginTop: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            <label className="flex items-center gap-2" style={{ cursor: 'pointer' }}>
              <input type="checkbox" style={{ accentColor: 'var(--primary)' }} />
              <span style={{ color: 'var(--text-muted)' }}>Remember me</span>
            </label>
            <a href="#" style={{ color: 'var(--secondary-light)', textDecoration: 'none' }}>Forgot password?</a>
          </div>

          <button type="submit" className="btn flex items-center justify-center gap-2 w-full">
            Sign In <ArrowRight size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--glass-border)' }}></div>
          </div>

          {import.meta.env.VITE_GOOGLE_CLIENT_ID && import.meta.env.VITE_GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID_HERE' && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Login Failed')}
                theme="filled_black"
                shape="pill"
              />
            </div>
          )}
        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--secondary-light)', textDecoration: 'none', fontWeight: '500' }}>Register here</Link>
        </p>

      </div>
    </div>
  );
}
