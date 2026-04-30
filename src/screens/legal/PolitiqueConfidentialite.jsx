import { LEGAL } from '../../data/legalData';

export default function PolitiqueConfidentialite({ onBack }) {
  return (
    <div className="min-h-screen bg-night flex flex-col max-w-[340px] mx-auto text-cream">
      
      {/* Header fixe */}
      <div className="sticky top-0 z-10 bg-night/95 backdrop-blur-sm px-5 py-4 border-b border-border">
        <button 
          onClick={onBack}
          className="text-muted text-xs mb-3 hover:text-cream transition-colors"
        >
          ← Retour
        </button>
        <h1 className="text-[9px] text-gold tracking-[2px] uppercase font-sans">
          Confidentialité & Sécurité
        </h1>
      </div>

      {/* Contenu scrollable */}
      <div className="flex-1 px-5 pt-5 pb-20 space-y-4">
        
        {/* 1. ENGAGEMENT DE TRANSPARENCE */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h2 className="text-[10px] text-gold tracking-widest uppercase mb-2 font-sans">
            1. Transparence
          </h2>
          <p className="text-muted text-xs leading-relaxed font-sans">
            Conformément aux règles du <strong>Google Play Store</strong> et au RGPD, {LEGAL.app.nom} s'engage à protéger votre vie privée. Nous ne collectons que les données strictement nécessaires à l'expérience astrologique.
          </p>
        </div>

        {/* 2. TABLEAU DES DONNÉES (Adapté Mobile) */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h2 className="text-[10px] text-gold tracking-widest uppercase mb-3 font-sans">
            2. Données et Finalités
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-[9px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-gold text-left py-2 pr-2 font-sans uppercase tracking-tighter">Nature</th>
                  <th className="text-gold text-left py-2 pr-2 font-sans uppercase tracking-tighter">Usage</th>
                  <th className="text-gold text-left py-2 font-sans uppercase tracking-tighter">Base</th>
                </tr>
              </thead>
              <tbody className="text-muted font-sans">
                <tr className="border-b border-border/30">
                  <td className="py-2 pr-1 font-bold">Identité</td>
                  <td className="py-2 pr-1">Compte & Sync</td>
                  <td className="py-2">Contrat</td>
                </tr>
                <tr className="border-b border-border/30">
                  <td className="py-2 pr-1 font-bold">Naissance</td>
                  <td className="py-2 pr-1">Calcul Astro</td>
                  <td className="py-2">Consentement</td>
                </tr>
                <tr className="border-b border-border/30">
                  <td className="py-2 pr-1 font-bold">Position</td>
                  <td className="py-2 pr-1">Ascendant</td>
                  <td className="py-2">Consentement</td>
                </tr>
                <tr>
                  <td className="py-2 pr-1 font-bold">Technique</td>
                  <td className="py-2 pr-1">Stabilité App</td>
                  <td className="py-2">Légitime</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[8px] text-muted/60 mt-3 italic leading-tight">
            Note : Vos données de naissance sont considérées comme sensibles et ne sont jamais partagées avec des tiers.
          </p>
        </div>

        {/* 3. SYSTÈME DE PAIEMENT GOOGLE PLAY */}
        <div className="bg-card border border-border rounded-2xl p-4 border-gold/20">
          <h2 className="text-[10px] text-gold tracking-widest uppercase mb-2 font-sans flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            3. Paiements sécurisés
          </h2>
          <p className="text-muted text-xs leading-relaxed font-sans">
            Toute transaction pour l'abonnement <strong>Astra Étoile</strong> est gérée par le système de facturation de <strong>Google Play Billing</strong>. Astra ne stocke aucune donnée bancaire. Vos informations de paiement sont sécurisées par l'infrastructure de Google.
          </p>
        </div>

        {/* 4. STOCKAGE ET SÉCURITÉ */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h2 className="text-[10px] text-gold tracking-widest uppercase mb-2 font-sans">
            4. Stockage (UE)
          </h2>
          <p className="text-muted text-xs leading-relaxed font-sans">
            Vos données sont chiffrées et stockées via <strong>Supabase</strong> sur des serveurs situés en Allemagne (Frankfurt, Union Européenne), garantissant une protection optimale selon les standards RGPD.
          </p>
        </div>

        {/* 5. VOS DROITS ET SUPPRESSION */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h2 className="text-[10px] text-gold tracking-widest uppercase mb-3 font-sans">
            5. Contrôle de vos données
          </h2>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {["Accès", "Rectification", "Effacement", "Opposition"].map((droit) => (
              <div key={droit} className="bg-[#141731] border border-border rounded-xl p-2 text-center">
                <p className="text-cream text-[9px] font-sans">{droit}</p>
              </div>
            ))}
          </div>
          <p className="text-muted text-xs leading-relaxed font-sans">
            Vous pouvez exercer vos droits ou demander la <strong>suppression définitive</strong> de votre compte et de toutes vos données associées en nous écrivant à : <span className="text-gold">{LEGAL.dpo.email}</span> ou via les paramètres de l'application.
          </p>
        </div>

        {/* 6. COOKIES & SERVICES TIERS */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h2 className="text-[10px] text-gold tracking-widest uppercase mb-2 font-sans">
            6. Cookies & SDK
          </h2>
          <p className="text-muted text-xs leading-relaxed font-sans">
            Nous n'utilisons aucun cookie de suivi publicitaire. L'application utilise uniquement les identifiants techniques nécessaires à l'authentification et au bon fonctionnement des services Google Play.
          </p>
        </div>

        {/* Date et Contact */}
        <div className="pt-4 pb-4 text-center border-t border-border/20">
          <p className="text-muted/40 text-[9px] uppercase tracking-widest">
            Mise à jour : {LEGAL.dates.derniereMAJ}
          </p>
          <p className="text-muted/40 text-[9px] mt-1">
            Contact DPO : {LEGAL.dpo.email}
          </p>
        </div>

      </div>
    </div>
  );
}