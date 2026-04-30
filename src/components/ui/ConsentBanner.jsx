import { useState, useEffect } from 'react';

const CONSENT_KEY = 'astra_consent_v1';

export default function ConsentBanner({ onShowPolicy }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    // On ne montre la bannière que si aucun choix n'a été fait
    if (!consent) {
      setVisible(true);
      // Bloquer le scroll du corps de la page pour focus sur le consentement
      document.body.style.overflow = 'hidden';
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
    document.body.style.overflow = 'unset';
  };

  const handleDecline = () => {
    // Pour Astra, l'essentiel inclut l'auth Supabase
    localStorage.setItem(CONSENT_KEY, 'essential_only');
    setVisible(false);
    document.body.style.overflow = 'unset';
  };

  if (!visible) return null;

  return (
    <>
      {/* Overlay pour assombrir l'arrière-plan (très apprécié par Google pour le consentement) */}
      <div className="fixed inset-0 bg-night/60 backdrop-blur-[2px] z-[45]" />

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[340px] z-50 bg-[#090C1E] border-t border-gold/30 p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] rounded-t-[32px]">
        
        {/* Icône discrète */}
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 rounded-full bg-gold/20" />
        </div>

        {/* Titre */}
        <h3 className="text-gold font-serif text-base text-center">
          Respect de votre vie privée
        </h3>

        {/* Texte spécifique Play Store / Données sensibles */}
        <p className="text-muted text-[11px] leading-relaxed mt-3 text-center font-sans">
          En utilisant Astra, vous acceptez notre utilisation de cookies techniques pour votre compte, ainsi que le traitement de vos <strong>données de naissance</strong> pour vos calculs astrologiques. 
        </p>

        {/* Bouton vers la politique */}
        <div className="text-center mt-2">
          <button
            onClick={onShowPolicy}
            className="text-gold/80 text-[10px] underline underline-offset-4 cursor-pointer hover:text-gold transition-colors font-sans"
          >
            Consulter la Politique de Confidentialité
          </button>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-6">
          <button
            onClick={handleAccept}
            className="w-full bg-gold text-night font-serif font-bold rounded-full py-3 text-xs uppercase tracking-widest hover:bg-gold/90 active:scale-[0.98] transition-all shadow-lg shadow-gold/10"
          >
            Accepter et Continuer
          </button>
          
          <button
            onClick={handleDecline}
            className="w-full text-muted/60 text-[10px] font-sans py-2 hover:text-muted transition-colors"
          >
            Continuer avec le strict minimum
          </button>
        </div>

        {/* Note RGPD bas de page */}
        <p className="text-[8px] text-muted/30 text-center mt-4 uppercase tracking-tighter">
          Conforme RGPD & Google Play Policy 2026
        </p>
      </div>
    </>
  );
}