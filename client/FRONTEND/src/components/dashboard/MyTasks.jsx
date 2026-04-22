import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Loader } from 'lucide-react';

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/tasks', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setTasks(await res.json());
      }
    } catch (err) {
      console.error("Task fetch fail", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const toggleTask = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchTasks();
    } catch (err) {
      console.error("Toggle fail", err);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ title: newTask })
      });
      if (res.ok) {
        setNewTask('');
        fetchTasks();
      }
    } catch (err) {
      console.error("Add task fail", err);
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><Loader className="animate-spin text-primary" size={48} /></div>;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '600px' }}>
      <div>
        <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>My Tasks</h1>
        <p style={{ color: 'var(--text-muted)' }}>Keep track of your daily to-dos.</p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <form onSubmit={addTask} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Add a new task..." 
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button type="submit" className="btn">Add</button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {tasks.map(task => {
            const isCompleted = task.status === 'Completed';
            return (
              <div 
                key={task._id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem', 
                  padding: '1rem', 
                  background: 'rgba(255,255,255,0.05)', 
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  transition: 'var(--transition)'
                }}
              >
                <button 
                  onClick={() => toggleTask(task._id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: isCompleted ? 'var(--success)' : 'var(--text-muted)' }}
                >
                  {isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>
                <span style={{ 
                  fontSize: '1.1rem',
                  color: isCompleted ? 'var(--text-muted)' : 'var(--text-main)',
                  textDecoration: isCompleted ? 'line-through' : 'none'
                }}>
                  {task.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
