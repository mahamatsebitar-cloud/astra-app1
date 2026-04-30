import React, { useState, useEffect } from 'react';
import { useSubscription } from '../../hooks/useSubscription';

const PremiumGate = ({ 
  children, 
  featureKey, // Clé de la fonctionnalité (ex: 'horoscope_detail')
  onUpgrade, 
  preview = true 
}) => {
  const { isPremiumUser, loading, checkFeature } = useSubscription();
  const [hasAccess, setHasAccess] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verify = async () => {
      if (loading) return;
      // Si featureKey est fourni, on check précisément cette feature
      // Sinon, on se base sur le statut premium global
      const access = featureKey ? await checkFeature(featureKey) : isPremiumUser;
      setHasAccess(access);
      setChecking(false);
    };
    verify();
  }, [loading, isPremiumUser, featureKey, checkFeature]);

  if (loading || checking) {
    return (
      <div className="h-40 w-full bg-night-light/30 border border-gold/10 rounded-2xl animate-pulse flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gold/10">
      {preview && (
        <div 
          className="pointer-events-none select-none"
          style={{ filter: 'blur(8px)', opacity: 0.3 }}
          aria-hidden="true"
        >
          {children}
        </div>
      )}
      
      <div className={`
        ${preview ? 'absolute inset-0' : 'relative'}
        flex flex-col items-center justify-center 
        bg-gradient-to-b from-[#06081A]/60 to-[#06081A]/95
        backdrop-blur-md p-8 text-center
      `}>
        {/* SVG Lock Icon */}
        <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mb-4 border border-gold/20">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A460" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        
        <h3 className="font-serif text-cream text-lg mb-2">Astra Étoile</h3>
        <p className="text-muted text-xs leading-relaxed max-w-[200px] mb-6">
          Cette lecture céleste est réservée aux membres de la constellation Astra.
        </p>
        
        <button
          onClick={onUpgrade}
          className="bg-gold hover:bg-gold-light text-night font-serif text-sm py-3 px-8 rounded-full shadow-xl shadow-gold/10 transition-transform active:scale-95"
        >
          Débloquer mon ciel
        </button>
      </div>
    </div>
  );
};

export default PremiumGate;