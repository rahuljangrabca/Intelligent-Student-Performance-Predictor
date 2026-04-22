import { useState } from 'react';
import { CalendarDays, MapPin, Check } from 'lucide-react';
import { useToast } from '../ui/ToastContext';

const initialEvents = [
  { id: 1, title: 'Annual Science Fair', date: 'Oct 15, 2026', time: '10:00 AM', location: 'Main Hall', type: 'Campus Event', rsvped: false },
  { id: 2, title: 'Guest Lecture: AI Future', date: 'Oct 18, 2026', time: '2:00 PM', location: 'Auditorium A', type: 'Academic', rsvped: false },
  { id: 3, title: 'Inter-College Sports Meet', date: 'Oct 22, 2026', time: '9:00 AM', location: 'Sports Complex', type: 'Sports', rsvped: true },
];

export default function Events() {
  const [eventsList, setEventsList] = useState(initialEvents);
  const { addToast } = useToast();

  const handleRSVP = (id, currentStatus) => {
    if (currentStatus) return; // Already RSVPed
    
    setEventsList(eventsList.map(ev => ev.id === id ? { ...ev, rsvped: true } : ev));
    addToast('Successfully registered for the event!', 'success');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Upcoming Events</h1>
        <p style={{ color: 'var(--text-muted)' }}>Stay updated with campus activities and academic events.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {eventsList.map(event => (
          <div key={event.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ display: 'inline-block', fontSize: '0.8rem', background: 'var(--primary)', color: 'white', padding: '4px 12px', borderRadius: '12px', marginBottom: '0.5rem' }}>
                  {event.type}
                </span>
                <h3 style={{ fontSize: '1.3rem' }}>{event.title}</h3>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarDays size={18} color="var(--secondary-light)" />
                <span>{event.date} at {event.time}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} color="var(--secondary-light)" />
                <span>{event.location}</span>
              </div>
            </div>

            <button 
              onClick={() => handleRSVP(event.id, event.rsvped)}
              className="btn" 
              style={{ 
                marginTop: 'auto', 
                background: event.rsvped ? 'var(--success)' : 'rgba(255,255,255,0.1)', 
                boxShadow: event.rsvped ? '0 4px 15px rgba(16, 185, 129, 0.3)' : 'none',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {event.rsvped ? <><Check size={18} /> RSVP Confirmed</> : 'RSVP Now'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
