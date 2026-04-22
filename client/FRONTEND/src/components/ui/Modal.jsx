import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        {title && <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }} className="text-gradient">{title}</h2>}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}
