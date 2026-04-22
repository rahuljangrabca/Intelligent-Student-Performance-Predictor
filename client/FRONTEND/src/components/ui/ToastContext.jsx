import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, hiding: false }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.map(t => t.id === id ? { ...t, hiding: true } : t));
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== id));
        }, 300); // Wait for fadeOut animation
      }, duration);
    }
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.hiding ? 'hiding' : ''}`} style={{ borderLeft: `4px solid ${toast.type === 'success' ? 'var(--success)' : toast.type === 'error' ? 'var(--danger)' : 'var(--secondary)'}` }}>
            {toast.type === 'success' && <CheckCircle size={20} color="var(--success)" />}
            {toast.type === 'error' && <AlertCircle size={20} color="var(--danger)" />}
            {toast.type === 'info' && <Info size={20} color="var(--secondary)" />}
            <span style={{ fontSize: '0.95rem' }}>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
