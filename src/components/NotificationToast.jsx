import { useEffect, useState } from 'react';
import './NotificationToast.css';

export function NotificationToast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handler = (event) => {
      setToast(event.detail);
      // Auto-hide après 4 secondes
      setTimeout(() => setToast(null), 4000);
    };
    
    window.addEventListener('astra-notification', handler);
    return () => window.removeEventListener('astra-notification', handler);
  }, []);

  if (!toast) return null;

  return (
    <div className="notification-toast">
      <div className="toast-content">
        <span className="toast-icon">✦</span>
        <div>
          <h4>{toast.title}</h4>
          <p>{toast.body}</p>
        </div>
      </div>
      <button onClick={() => setToast(null)}>✕</button>
    </div>
  );
}