import React, { useState, useCallback } from 'react';
import { useSubscription } from '../hooks/useSubscription';

// Configuration des prix pour maintenance facile
const PLANS = {
  mensuel: { id: 'etoile_mensuel', price: '9,99 €', period: '/mois', billing: 'mensuel' },
  annuel: { id: 'etoile_annuel', price: '79,99 €', period: '/an', billing: 'annuel', savings: '–33%', detail: 'soit 6,67€/mois' }
};

const FEATURES = [
  'Horoscope hebdomadaire & mensuel',
  'Thème natal entièrement interactif',
  'Nœuds lunaires & chemin karmique',
  'Compatibilité astrologique avancée',
  'Transits planétaires personnels',
  'Expérience sans publicité'
];

export default function Abonnement({ onBack, onSubscribed }) {
  const [planKey, setPlanKey] = useState('mensuel');
  const [isProcessing, setIsProcessing] = useState(false);
  const [localError, setLocalError] = useState(null);

  const {
    isFree,
    isTrial,
    isActive,
    daysRemaining,
    planLabel,
    startTrial,
    loading: subLoading
  } = useSubscription();

  const handleAction = useCallback(async () => {
    setIsProcessing(true);
    setLocalError(null);
    
    try {
      // On passe l'ID du plan sélectionné au service
      const result = await startTrial(PLANS[planKey].id);
      
      if (result?.error) throw new Error(result.error);
      
      if (onSubscribed) onSubscribed();
    } catch (err) {
      setLocalError("Impossible d'activer l'essai. Vérifiez votre connexion.");
      console.error("Subscription Error:", err);
    } finally {
      setIsProcessing(false);
    }
  }, [planKey, startTrial, onSubscribed]);

  // État de chargement initial du Hook
  if (subLoading) {
    return (
      <div className="min-h-screen bg-night flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-night flex flex-col max-w-[360px] mx-auto overflow-x-hidden text-cream">
      
      {/* Header fixe */}
      <header className="sticky top-0 z-20 bg-night/90 backdrop-blur-md px-6 py-4 border-b border-white/5">
        <button
          onClick={onBack}
          className="text-muted text-xs mb-3 flex items-center gap-1 hover:text-gold transition-colors"
        >
          <span className="text-lg">←</span> Retour
        </button>
        <h1 className="text-[10px] text-gold tracking-[3px] uppercase font-bold">
          Astra Étoile
        </h1>
      </header>

      <main className="flex-1 px-6 pt-6 pb-24 space-y-8 overflow-y-auto">
        
        {/* Hero Card avec effet Shimmer */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#120E22] to-[#1C2040] border border-gold/20 rounded-[32px] p-8 text-center shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-shimmer pointer-events-none opacity-10"></div>
          <div className="text-gold text-5xl font-serif mb-4 animate-pulse">✦</div>
          <h2 className="font-serif text-2xl mb-1">Astra Étoile</h2>
          <p className="text-gold/60 text-xs italic font-serif mb-8 italic">
            « Explorez les profondeurs de votre destin »
          </p>
          
          <ul className="space-y-4 text-left">
            {FEATURES.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="mt-1 w-4 h-4 rounded-full border border-gold flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
                </div>
                <span className="text-[12px] leading-tight text-cream/90">{feature}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Sélecteur de plan (si non Premium) */}
        {(isFree || isTrial) && (
          <section className="space-y-4">
            <h3 className="text-muted text-[10px] tracking-widest uppercase pl-1">
              Choisir une constellation
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(PLANS).map(([key, plan]) => (
                <button
                  key={key}
                  onClick={() => setPlanKey(key)}
                  className={`relative flex flex-col p-5 rounded-2xl border transition-all duration-300 text-left ${
                    planKey === key 
                      ? 'border-gold bg-gold/5 shadow-[0_0_20px_rgba(201,164,96,0.15)]' 
                      : 'border-white/10 bg-white/5 opacity-60'
                  }`}
                >
                  {plan.savings && (
                    <span className="absolute -top-2.5 right-3 bg-gold text-night text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {plan.savings}
                    </span>
                  )}
                  <span className="text-xs mb-1 font-medium">{plan.billing}</span>
                  <span className="text-xl font-serif">{plan.price}</span>
                  <span className="text-[10px] text-muted">{plan.period}</span>
                  {plan.detail && <p className="text-[9px] text-gold/80 mt-2">{plan.detail}</p>}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Action Button & Feedback */}
        <section className="space-y-4">
          {localError && <p className="text-red-400 text-[10px] text-center bg-red-400/10 py-2 rounded-lg">{localError}</p>}

          {isFree && (
            <>
              <button
                onClick={handleAction}
                disabled={isProcessing}
                className="w-full bg-gold hover:bg-gold-light text-night font-serif font-bold rounded-full py-4 text-sm transition-all shadow-lg shadow-gold/20 active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? 'Connexion aux astres...' : 'Essayer 7 jours gratuits'}
              </button>
              <p className="text-muted text-[10px] text-center">
                Puis {PLANS[planKey].price}{PLANS[planKey].period} · Sans engagement
              </p>
            </>
          )}

          {isTrial && (
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 text-center">
                <p className="text-green-400 text-sm font-serif mb-1 italic">✓ Période d'essai active</p>
                <p className="text-muted text-[11px]">Il vous reste {daysRemaining} jours de privilèges.</p>
              </div>
              <button className="w-full bg-gold text-night font-serif font-bold rounded-full py-4 text-sm shadow-xl">
                Confirmer l'accès Premium
              </button>
            </div>
          )}

          {isActive && (
            <div className="space-y-6">
              <div className="bg-gold/10 border border-gold/20 rounded-2xl p-6 text-center">
                <p className="text-gold text-sm font-serif mb-2 italic">✦ Membre Astra Étoile</p>
                <p className="text-cream text-xs">{planLabel}</p>
                <p className="text-muted text-[10px] mt-2 italic">Prochaine lunaison dans {daysRemaining} jours</p>
              </div>
              <button className="w-full border border-gold/30 text-gold/80 font-sans rounded-full py-3 text-xs hover:bg-gold/5 transition-colors">
                Gérer mon abonnement
              </button>
            </div>
          )}
        </section>

        {/* Trust Badges */}
        <footer className="grid grid-cols-3 gap-2 pt-4 border-t border-white/5">
           {[
             { label: 'Annulation facile', icon: '🔓' },
             { label: 'Données protégées', icon: '🛡️' },
             { label: 'Paiement sécurisé', icon: '💳' }
           ].map((badge, i) => (
             <div key={i} className="text-center space-y-1">
               <span className="text-lg opacity-50">{badge.icon}</span>
               <p className="text-muted text-[8px] uppercase tracking-tighter leading-tight font-bold">{badge.label}</p>
             </div>
           ))}
        </footer>
      </main>
    </div>
  );
}