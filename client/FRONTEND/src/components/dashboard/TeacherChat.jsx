import { useState, useRef, useEffect } from 'react';
import { Send, User, Loader } from 'lucide-react';

export default function TeacherChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState(null);
  const chatEndRef = useRef(null);

  const fetchMessages = async (teacherId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/chat/${teacherId}`, {
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
        // 1. Get Teacher List
        const tRes = await fetch('/api/auth/users?role=teacher', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const teachers = await tRes.json();
        if (teachers.length > 0) {
          setTeacher(teachers[0]);
          await fetchMessages(teachers[0]._id);
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
    if (!input.trim() || !teacher) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          receiverId: teacher._id,
          message: input
        })
      });
      if (res.ok) {
        setInput('');
        fetchMessages(teacher._id);
      }
    } catch (err) {
      console.error("Send message fail");
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><Loader className="animate-spin text-primary" size={48} /></div>;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
      <div>
        <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Teacher Chat</h1>
        <p style={{ color: 'var(--text-muted)' }}>Direct communication line with your instructors.</p>
      </div>

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: '500px' }}>
        
        {/* Chat Header */}
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.1)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={20} color="white" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Prof. Anderson (Math)</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>Online</span>
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map(msg => {
            const isMe = msg.sender === 'Me';
            return (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                <div style={{ 
                  background: isMe ? 'linear-gradient(135deg, var(--primary), var(--primary-light))' : 'rgba(255,255,255,0.1)', 
                  padding: '1rem', 
                  borderRadius: isMe ? '16px 16px 0 16px' : '16px 16px 16px 0',
                  maxWidth: '70%',
                  color: 'white',
                  border: isMe ? 'none' : '1px solid var(--glass-border)'
                }}>
                  {msg.text}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{msg.time}</span>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={sendMessage} style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '1rem', background: 'rgba(0,0,0,0.1)' }}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Type your message..." 
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
  );
}
