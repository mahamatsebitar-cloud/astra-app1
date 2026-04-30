import { LEGAL } from '../../data/legalData';

export default function CGU({ onBack }) {
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
          Conditions d'Utilisation
        </h1>
      </div>

      {/* Contenu scrollable */}
      <div className="flex-1 px-5 pt-5 pb-20 space-y-4 font-sans">
        
        {/* ARTICLE 1 — OBJET & DIVERTISSEMENT */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h2 className="text-[10px] text-gold tracking-widest uppercase mb-2">
            Article 1 — Objet
          </h2>
          <p className="text-muted text-xs leading-relaxed">
            Astra est une application mobile d'astrologie personnalisée 
            éditée par {LEGAL.editeur.nom}. Elle propose des outils de 
            calculs astronomiques et des interprétations symboliques.
          </p>
          <div className="mt-3 bg-[#1F0A0A] border border-red-900/20 rounded-xl p-3">
            <p className="text-cream text-[10px] leading-relaxed italic font-serif">
              ⚠️ AVERTISSEMENT : Astra est une application de divertissement. 
              Les contenus ne constituent pas des conseils professionnels. 
              L'utilisateur reste seul responsable de ses décisions.
            </p>
          </div>
        </div>

        {/* ARTICLE 2 — ACCÈS AU SERVICE (Play Store Compliance) */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h2 className="text-[10px] text-gold tracking-widest uppercase mb-2">
            Article 2 — Accès au Service
          </h2>
          <ul className="text-muted text-xs leading-relaxed space-y-2">
            <li>• <strong>Âge :</strong> 16 ans minimum requis.</li>
            <li>• <strong>Compte :</strong> Nécessite une authentification via email ou Google Sign-In.</li>
            <li>• <strong>Sécurité :</strong> Vous êtes responsable de la protection de votre compte sur le Play Store.</li>
          </ul>
        </div>

        {/* ARTICLE 3 — DONNÉES PERSONNELLES */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h2 className="text-[10px] text-gold tracking-widest uppercase mb-2">
            Article 3 — Données & RGPD
          </h2>
          <p className="text-muted text-xs leading-relaxed">
            Conformément au RGPD et aux politiques de Google, vos données de naissance sont 
            utilisées uniquement pour les calculs internes de l'application. 
            Contact DPO : {LEGAL.dpo.email}
          </p>
        </div>

        {/* ARTICLE 4 — PROPRIÉTÉ INTELLECTUELLE */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h2 className="text-[10px] text-gold tracking-widest uppercase mb-2">
            Article 4 — Propriété
          </h2>
          <p className="text-muted text-xs leading-relaxed">
            Les algorithmes de calcul et le design visuel sont la propriété de {LEGAL.editeur.nom}. 
            Toute tentative de "reverse engineering" sur l'APK est interdite.
          </p>
        </div>

        {/* ARTICLE 6 — ABONNEMENT GOOGLE PLAY BILLING (CRITIQUE) */}
        <div className="bg-card border border-gold/20 rounded-2xl p-4">
          <h2 className="text-[10px] text-gold tracking-widest uppercase mb-2">
            Article 6 — Abonnement Astra Étoile
          </h2>
          <div className="text-muted text-xs leading-relaxed space-y-2">
            <p>• <strong>Facturation :</strong> Toutes les transactions sont traitées par <strong>Google Play Billing</strong>.</p>
            <p>• <strong>Gestion :</strong> Les abonnements se gèrent et se résilient directement dans votre compte Google Play (Paramètres {'>'} Paiements & abonnements).</p>
            <p>• <strong>Remboursement :</strong> Soumis aux conditions de remboursement de Google Play.</p>
          </div>
        </div>

        {/* ARTICLE 7 — RESPONSABILITÉ TECHNIQUE */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h2 className="text-[10px] text-gold tracking-widest uppercase mb-2">
            Article 7 — Responsabilité
          </h2>
          <p className="text-muted text-xs leading-relaxed">
            L'éditeur ne peut être tenu responsable des bugs liés aux services Google (Play Services) 
            ou des interruptions de réseau mobile.
          </p>
        </div>

        {/* ARTICLE 8 — DROIT APPLICABLE */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h2 className="text-[10px] text-gold tracking-widest uppercase mb-2">
            Article 8 — Litiges
          </h2>
          <p className="text-muted text-xs leading-relaxed">
            Droit applicable : France. Avant toute action, une résolution amiable est privilégiée via {LEGAL.editeur.email}.
          </p>
        </div>

        {/* Pied de page */}
        <div className="text-center pt-6 opacity-40">
          <p className="text-[9px] uppercase tracking-widest">
            {LEGAL.app.nom} v{LEGAL.app.version}
          </p>
          <p className="text-[9px]">
            Dernière mise à jour : {LEGAL.dates.derniereMAJ}
          </p>
        </div>

      </div>
    </div>
  );
}