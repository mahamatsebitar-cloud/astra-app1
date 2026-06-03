import React, { useState, useCallback } from 'react';
import { useSubscription } from '../hooks/useSubscription';

const FEATURES = [
  'Horoscope hebdomadaire & mensuel',
  'Thème natal entièrement interactif',
  'Nœuds lunaires & chemin karmique',
  'Compatibilité astrologique avancée',
  'Transits planétaires personnels',
  'Connexions illimitées'
];

export default function Abonnement({ onBack, onSubscribed }) {
  const [planKey, setPlanKey] = useState('annuel');
  const [isProcessing, setIsProcessing] = useState(false);
  const [localError, setLocalError] = useState(null);

  const {
    offerings,
    isFree,
    isTrial,
    isActive,
    daysRemaining,
    planLabel,
    purchase,
    restore,
    loading: subLoading
  } = useSubscription();

  // 🔥 Helper : récupère le PACKAGE entier selon le plan choisi (pas juste le produit)
  const getSelectedPackage = useCallback(() => {
    if (!offerings) return null;
    return planKey === 'annuel' ? offerings.annualPackage : offerings.monthlyPackage;
  }, [offerings, planKey]);

  // 🔥 Helper : récupère le PRODUIT pour l'affichage du prix
  const getSelectedProduct = useCallback(() => {
    if (!offerings) return null;
    return planKey === 'annuel' ? offerings.annual : offerings.monthly;
  }, [offerings, planKey]);

  // 🔥 Helper : prix formaté depuis RevenueCat
  const getPriceDisplay = useCallback(() => {
    const product = getSelectedProduct();
    if (!product) return planKey === 'annuel' ? '79,99 €' : '9,99 €';
    return product.priceString;
  }, [getSelectedProduct, planKey]);

  // 🔥 Action principale : ACHETER (passe le PACKAGE entier)
  const handlePurchase = useCallback(async () => {
    console.log('[Abonnement] handlePurchase called, plan:', planKey);
    setIsProcessing(true);
    setLocalError(null);
    
    // 🔥 Utilise le PACKAGE entier pour l'achat
    const pkg = getSelectedPackage();
    if (!pkg) {
      setLocalError("Les offres ne sont pas disponibles. Réessaie plus tard.");
      setIsProcessing(false);
      return;
    }

    try {
      console.log('[Abonnement] Purchasing package:', pkg.identifier || pkg.product?.identifier);
      const result = await purchase(pkg); // 🔥 Passe le package entier
      console.log('[Abonnement] Purchase result:', result);
      
      if (result?.success) {
        console.log('[Abonnement] Purchase successful!');
        if (onSubscribed) onSubscribed();
      } else if (result?.cancelled) {
        console.log('[Abonnement] User cancelled purchase');
      } else {
        throw new Error(result?.error || 'Erreur lors de l\'achat');
      }
    } catch (err) {
      const errorMessage = err?.message || JSON.stringify(err);
      console.error('[Abonnement] Purchase Error:', err);
      setLocalError("Impossible de finaliser : " + errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [purchase, getSelectedPackage, planKey, onSubscribed]);

  // 🔥 Action : RESTAURER les achats
  const handleRestore = useCallback(async () => {
    setIsProcessing(true);
    setLocalError(null);
    
    try {
      const result = await restore();
      if (result?.success) {
        if (onSubscribed) onSubscribed();
      } else {
        setLocalError("Aucun achat trouvé à restaurer.");
      }
    } catch (err) {
      setLocalError("Erreur de restauration : " + err.message);
    } finally {
      setIsProcessing(false);
    }
  }, [restore, onSubscribed]);

  // 🔥 Action : GÉRER l'abonnement (redirige vers Google Play)
  const handleManage = useCallback(() => {
    window.open('https://play.google.com/store/account/subscriptions', '_blank');
  }, []);

  if (subLoading) {
    return (
      <div className="min-h-screen bg-night flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-night flex flex-col max-w-[360px] mx-auto overflow-x-hidden text-cream">
      <header className="sticky top-0 z-20 bg-night/90 backdrop-blur-md px-6 py-4 border-b border-white/5">
        <button onClick={onBack} className="text-muted text-xs mb-3 flex items-center gap-1 hover:text-gold transition-colors">
          <span className="text-lg">←</span> Retour
        </button>
        <h1 className="text-[10px] text-gold tracking-[3px] uppercase font-bold">Astra Étoile</h1>
      </header>

      <main className="flex-1 px-6 pt-6 pb-24 space-y-8 overflow-y-auto">
        <section className="relative overflow-hidden bg-gradient-to-br from-[#120E22] to-[#1C2040] border border-gold/20 rounded-[32px] p-8 text-center shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-shimmer pointer-events-none opacity-10"></div>
          <div className="text-gold text-5xl font-serif mb-4 animate-pulse">✦</div>
          <h2 className="font-serif text-2xl mb-1">Astra Étoile</h2>
          <p className="text-gold/60 text-xs italic font-serif mb-8">« Explorez les profondeurs de votre destin »</p>
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

        {(isFree || isTrial) && (
          <section className="space-y-4">
            <h3 className="text-muted text-[10px] tracking-widest uppercase pl-1">Choisir une constellation</h3>
            
            {/* 🔥 Offres dynamiques depuis RevenueCat */}
            {offerings ? (
              <div className="grid grid-cols-2 gap-4">
                {/* Mensuel */}
                <button 
                  onClick={() => setPlanKey('mensuel')}
                  className={`relative flex flex-col p-5 rounded-2xl border transition-all duration-300 text-left ${
                    planKey === 'mensuel' 
                      ? 'border-gold bg-gold/5 shadow-[0_0_20px_rgba(201,164,96,0.15)]' 
                      : 'border-white/10 bg-white/5 opacity-60'
                  }`}>
                  <span className="text-xs mb-1 font-medium">mensuel</span>
                  <span className="text-xl font-serif">
                    {offerings.monthly?.priceString || '9,99 €'}
                  </span>
                  <span className="text-[10px] text-muted">/mois</span>
                </button>

                {/* Annuel */}
                <button 
                  onClick={() => setPlanKey('annuel')}
                  className={`relative flex flex-col p-5 rounded-2xl border transition-all duration-300 text-left ${
                    planKey === 'annuel' 
                      ? 'border-gold bg-gold/5 shadow-[0_0_20px_rgba(201,164,96,0.15)]' 
                      : 'border-white/10 bg-white/5 opacity-60'
                  }`}>
                  <span className="absolute -top-2.5 right-3 bg-gold text-night text-[10px] px-2 py-0.5 rounded-full font-bold">–33%</span>
                  <span className="text-xs mb-1 font-medium">annuel</span>
                  <span className="text-xl font-serif">
                    {offerings.annual?.priceString || '79,99 €'}
                  </span>
                  <span className="text-[10px] text-muted">/an</span>
                  <p className="text-[9px] text-gold/80 mt-2">soit 6,67€/mois</p>
                </button>
              </div>
            ) : (
              <div className="text-center text-muted text-sm py-4">
                Chargement des offres...
              </div>
            )}
          </section>
        )}

        <section className="space-y-4">
          {localError && (
            <p className="text-red-400 text-[10px] text-center bg-red-400/10 py-2 rounded-lg">
              {localError}
            </p>
          )}

          {isFree && (
            <>
              <button 
                onClick={handlePurchase} 
                disabled={isProcessing || !offerings}
                className="w-full bg-gold hover:bg-gold-light text-night font-serif font-bold rounded-full py-4 text-sm transition-all shadow-lg shadow-gold/20 active:scale-95 disabled:opacity-50">
                {isProcessing ? 'Connexion aux astres...' : 'Essayer 7 jours gratuits'}
              </button>
              <p className="text-muted text-[10px] text-center">
                Puis {getPriceDisplay()}{planKey === 'annuel' ? '/an' : '/mois'} · Sans engagement
              </p>
              
              {/* 🔥 Bouton restaurer */}
              <button 
                onClick={handleRestore}
                disabled={isProcessing}
                className="w-full text-gold/60 text-[10px] underline hover:text-gold disabled:opacity-50">
                Restaurer mes achats
              </button>
            </>
          )}

          {isTrial && (
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 text-center">
                <p className="text-green-400 text-sm font-serif mb-1 italic">✓ Période d'essai active</p>
                <p className="text-muted text-[11px]">Il vous reste {daysRemaining} jours de privilèges.</p>
              </div>
              <button 
                onClick={handleManage}
                className="w-full bg-gold text-night font-serif font-bold rounded-full py-4 text-sm shadow-xl">
                Gérer mon abonnement
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
              <button 
                onClick={handleManage}
                className="w-full border border-gold/30 text-gold/80 font-sans rounded-full py-3 text-xs hover:bg-gold/5 transition-colors">
                Gérer mon abonnement
              </button>
            </div>
          )}
        </section>

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