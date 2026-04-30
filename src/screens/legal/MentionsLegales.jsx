import { LEGAL } from '../../data/legalData';

export default function MentionsLegales({ onBack }) {
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
          Mentions Légales
        </h1>
      </div>

      {/* Contenu scrollable */}
      <div className="flex-1 px-5 pt-5 pb-20 space-y-4">

        {/* ÉDITEUR / DÉVELOPPEUR PLAY STORE */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h2 className="text-[10px] text-gold tracking-widest uppercase mb-2 font-sans">
            Éditeur du Service
          </h2>
          <p className="text-muted text-xs leading-relaxed font-sans">
            L'application <strong>Astra</strong> est développée et éditée par :<br />
            <span className="text-cream">{LEGAL.editeur.nom}</span><br />
            Statut : {LEGAL.editeur.statut}<br />
            {LEGAL.editeur.siret && <>SIRET : {LEGAL.editeur.siret}<br /></>}
            Siège social : {LEGAL.editeur.adresse}<br />
            Contact : {LEGAL.editeur.email}
          </p>
        </div>

        {/* PUBLICATION */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h2 className="text-[10px] text-gold tracking-widest uppercase mb-2 font-sans">
            Responsable Publication
          </h2>
          <p className="text-muted text-xs leading-relaxed font-sans">
            Directeur de la publication : {LEGAL.editeur.nom}
          </p>
        </div>

        {/* DISTRIBUTION & HÉBERGEMENT */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h2 className="text-[10px] text-gold tracking-widest uppercase mb-2 font-sans">
            Hébergement & Plateforme
          </h2>
          <p className="text-muted text-xs leading-relaxed font-sans">
            <strong>Plateforme de distribution :</strong> Google Play Store<br />
            <strong>Infrastructure Cloud :</strong> {LEGAL.hebergeur.nom}<br />
            {LEGAL.hebergeur.adresse}
          </p>
        </div>

        {/* DONNÉES ET INFRASTRUCTURE */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h2 className="text-[10px] text-gold tracking-widest uppercase mb-2 font-sans">
            Infrastructure de Données
          </h2>
          <p className="text-muted text-xs leading-relaxed font-sans">
            Base de données : {LEGAL.bdd.nom}<br />
            Serveurs : {LEGAL.bdd.region} (UE)<br />
            Conformité RGPD : {LEGAL.bdd.conformiteRGPD ? 'Certifiée' : 'En cours'}
          </p>
        </div>

        {/* PROPRIÉTÉ ET DROITS D'AUTEUR */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h2 className="text-[10px] text-gold tracking-widest uppercase mb-2 font-sans">
            Propriété Intellectuelle
          </h2>
          <div className="bg-[#141731] border border-border rounded-xl p-3">
            <p className="text-cream text-[11px] leading-relaxed font-serif italic">
              « Astra est une marque déposée. L'ensemble des contenus (algorithmes, textes, design) est protégé par le Code de la propriété intellectuelle. Toute extraction de données est interdite. »
            </p>
          </div>
        </div>

        {/* CRÉDITS TECHNIQUES */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <h2 className="text-[10px] text-gold tracking-widest uppercase mb-2 font-sans">
            Crédits & Technologies
          </h2>
          <ul className="text-muted text-[10px] leading-relaxed font-sans space-y-1">
            <li>• Calculs : Algorithmes propriétaires Astra</li>
            <li>• Éphémérides : Swiss Ephemeris Library</li>
            <li>• Moteur : React & Vite Technology</li>
            <li>• Cartographie céleste : Astra Studio Design</li>
          </ul>
        </div>

        {/* AVERTISSEMENT CRITIQUE GOOGLE PLAY */}
        <div className="bg-[#1F0A0A] border border-red-900/30 rounded-2xl p-4">
          <h2 className="text-[10px] text-[#E05C5C] tracking-widest uppercase mb-2 font-sans">
            Avertissement Légal
          </h2>
          <p className="text-[#E05C5C] text-[11px] leading-relaxed font-sans italic">
            Astra est une application à visée de divertissement uniquement. Les analyses fournies ne sauraient se substituer à une expertise professionnelle médicale, psychologique ou financière. L'utilisateur est seul responsable de l'interprétation des données.
          </p>
        </div>

        {/* Version et MAJ */}
        <div className="pt-4 flex flex-col items-center">
          <p className="text-muted/40 text-[9px] uppercase tracking-widest">
            Version {LEGAL.app.version}
          </p>
          <p className="text-muted/40 text-[9px]">
            Dernière mise à jour : {LEGAL.dates.derniereMAJ}
          </p>
        </div>

      </div>
    </div>
  );
}