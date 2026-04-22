import { useState, useRef, useEffect } from 'react';
import { Send, Search, Loader } from 'lucide-react';

export default function TeacherChat() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef(null);

  const fetchMessages = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/chat/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setMessages(await res.json());
      }
    } catch (err) {
      console.error("Chat fetch fail");
    }
  };

  useEffect(() => {
    const initChat = async () => {
      try {
        const token = localStorage.getItem('token');
        const sRes = await fetch('/api/auth/users?role=student', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await sRes.json();
        setStudents(data);
        if (data.length > 0) {
          setSelectedStudent(data[0]);
          await fetchMessages(data[0]._id);
        }
      } catch (err) {
        console.error("Chat init fail");
      } finally {
        setLoading(false);
      }
    };
    initChat();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedStudent) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          receiverId: selectedStudent._id,
          message: input
        })
      });
      if (res.ok) {
        setInput('');
        fetchMessages(selectedStudent._id);
      }
    } catch (err) {
      console.error("Send message fail");
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><Loader className="animate-spin text-primary" size={48} /></div>;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
      <div>
        <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Student Conversations</h1>
        <p style={{ color: 'var(--text-muted)' }}>Respond to student queries and provide support.</p>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', flex: 1, minHeight: '500px', overflow: 'hidden' }}>
        
        {/* Contact List */}
        <div className="glass-panel" style={{ width: '300px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
             <div style={{ position: 'relative' }}>
               <Search size={16} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
               <input type="text" className="input-field" placeholder="Search student..." style={{ paddingLeft: '36px', background: 'rgba(0,0,0,0.2)' }} />
             </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {students.map(s => (
              <div 
                key={s._id} 
                onClick={() => { setSelectedStudent(s); fetchMessages(s._id); }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', background: selectedStudent?._id === s._id ? 'rgba(255,255,255,0.05)' : 'transparent', transition: 'var(--transition)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {s.name?.charAt(0)}
                  </div>
                  <strong style={{ fontSize: '0.95rem' }}>{s.name}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{selectedStudent?.name || 'Select a student'}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedStudent?.email}</span>
          </div>

          <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {messages.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No messages yet.</p>}
            {messages.map(msg => {
              const isMe = msg.senderId === JSON.parse(localStorage.getItem('user')).id;
              return (
                <div key={msg._id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                  <div style={{ 
                    background: isMe ? 'linear-gradient(135deg, var(--secondary), var(--primary))' : 'rgba(255,255,255,0.1)', 
                    padding: '1rem', 
                    borderRadius: isMe ? '16px 16px 0 16px' : '16px 16px 16px 0',
                    maxWidth: '70%',
                    color: 'white',
                    border: isMe ? 'none' : '1px solid var(--glass-border)'
                  }}>
                    {msg.message}
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={sendMessage} style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '1rem', background: 'rgba(0,0,0,0.1)' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder={`Reply to ${selectedStudent?.name || '...'}`} 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn" style={{ padding: '12px', minWidth: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Send size={20} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
