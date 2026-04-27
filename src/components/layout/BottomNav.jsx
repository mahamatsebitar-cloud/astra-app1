import React from 'react';

const BottomNav = ({ activeTab, onTabChange }) => {
  // J'ai synchronisé les IDs ici pour qu'ils marchent avec ton App.jsx
  const tabs = [
    { id: 'home', label: 'ACCUEIL', icon: 'home' },
    { id: 'natal', label: 'THÈME', icon: 'wheel' },
    { id: 'compat', label: 'AFFINITÉS', icon: 'overlap' },
    { id: 'profil', label: 'PROFIL', icon: 'profile' }
  ];

  const renderIcon = (iconName, isActive) => {
    // Utilisation des variables CSS de ton index.css (Tailwind v4)
    const strokeColor = isActive ? 'var(--color-gold)' : 'var(--color-muted)';
    
    switch(iconName) {
      case 'home':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H16C15.4477 21 15 20.5523 15 20V15C15 14.4477 14.5523 14 14 14H10C9.44772 14 9 14.4477 9 15V20C9 20.5523 8.55228 21 8 21H4C3.44772 21 3 20.5523 3 20V9.5Z" />
          </svg>
        );
      case 'wheel':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="8" />
            <circle cx="12" cy="12" r="3" />
            <line x1="12" y1="4" x2="12" y2="7" />
            <line x1="12" y1="17" x2="12" y2="20" />
            <line x1="4" y1="12" x2="7" y2="12" />
            <line x1="17" y1="12" x2="20" y2="12" />
          </svg>
        );
      case 'overlap':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="12" r="6" />
            <circle cx="15" cy="12" r="6" />
            <path d="M12 8C13.6569 9.5 13.6569 14.5 12 16" />
          </svg>
        );
      case 'profile':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="9" r="5" />
            <path d="M5 20C5 17 8 15 12 15C16 15 19 17 19 20" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="absolute bottom-0 w-full bg-[#090C1E] border-t border-border h-[66px] flex items-center justify-around px-2 pb-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <div
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center gap-1 cursor-pointer min-w-[60px] py-2"
          >
            {renderIcon(tab.icon, isActive)}
            <span className={`text-[9px] tracking-wide font-serif ${isActive ? 'text-gold' : 'text-muted'}`}>
              {tab.label}
            </span>
          </div>
        );
      })}
    </nav>
  );
};

export default BottomNav;