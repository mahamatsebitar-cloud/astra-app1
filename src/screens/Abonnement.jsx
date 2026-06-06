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

  // 🆓 MODE GRATUIT — abonnement bientôt disponible
  return (
    <div className="min-h-screen bg-night flex flex-col max-w-[360px] mx-auto overflow-x-hidden text-cream">
      <header className="sticky top-0 z-20 bg-night/90 backdrop-blur-md px-6 py-4 border-b border-white/5">
        <button onClick={onBack} className="text-muted text-xs mb-3 flex items-center gap-1 hover:text-gold transition-colors">
          <span className="text-lg">←</span> Retour
        </button>
        <h1 className="text-[10px] text-gold tracking-[3px] uppercase font-bold">Astra Étoile</h1>
      </header>

      <main className="flex-1 px-6 pt-6 pb-24 space-y-8 overflow-y-auto flex flex-col items-center justify-center text-center">
        <div className="text-gold text-6xl mb-4 animate-pulse">✦</div>
        <h2 className="font-serif text-2xl mb-2">Astra Étoile</h2>
        <p className="text-gold/60 text-xs italic font-serif mb-8 max-w-[280px]">
          « L'abonnement premium arrive bientôt. Pour l'instant, toutes les fonctionnalités sont gratuites. »
        </p>
        
        <div className="bg-gradient-to-br from-[#120E22] to-[#1C2040] border border-gold/20 rounded-[32px] p-8 text-center shadow-2xl w-full">
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
        </div>

        <p className="text-muted text-xs">
          ✓ Toutes ces fonctionnalités sont déjà disponibles gratuitement
        </p>

        <button 
          onClick={onBack}
          className="w-full bg-gold hover:bg-gold-light text-night font-serif font-bold rounded-full py-4 text-sm transition-all shadow-lg shadow-gold/20 active:scale-95"
        >
          Retour à l'application
        </button>
      </main>
    </div>
  );

  /* CODE ORIGINAL DÉSACTIVÉ — À RÉACTIVER QUAND GOOGLE PLAY BILLING DISPONIBLE
  const getSelectedPackage = useCallback(() => {
    if (!offerings) return null;
    return planKey === 'annuel' ? offerings.annualPackage : offerings.monthlyPackage;
  }, [offerings, planKey]);

  const getSelectedProduct = useCallback(() => {
    if (!offerings) return null;
    return planKey === 'annuel' ? offerings.annual : offerings.monthly;
  }, [offerings, planKey]);

  const getPriceDisplay = useCallback(() => {
    const product = getSelectedProduct();
    if (!product) return planKey === 'annuel' ? '79,99 €' : '9,99 €';
    return product.priceString;
  }, [getSelectedProduct, planKey]);

  const handlePurchase = useCallback(async () => {
    console.log('[Abonnement] handlePurchase called, plan:', planKey);
    setIsProcessing(true);
    setLocalError(null);
    
    const pkg = getSelectedPackage();
    if (!pkg) {
      setLocalError("Les offres ne sont pas disponibles. Réessaie plus tard.");
      setIsProcessing(false);
      return;
    }

    try {
      console.log('[Abonnement] Purchasing package:', pkg.identifier || pkg.product?.identifier);
      const result = await purchase(pkg);
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
      ... (reste du code original)
    </div>
  );
  FIN CODE ORIGINAL */
}