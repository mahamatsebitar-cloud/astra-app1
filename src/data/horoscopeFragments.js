// src/data/horoscopeFragments.js
// Fragments de texte combinables pour la génération d'horoscopes uniques
// Ton : littéraire français, intime, inspiré de Yourcenar, Nin, Bachelard
// Longueur : 12 à 18 mots par fragment
// Chaque fragment fonctionne seul ET se connecte naturellement aux autres

export const OUVERTURES = {
    "Bélier": [
      "Ce que tu crois impulsif est souvent ton intelligence la plus rapide.",
      "Le courage ne prévient pas — il arrive. Tu le sais mieux que quiconque.",
      "Quelque chose en toi refuse de se taire aujourd'hui, et c'est bien.",
      "L'élan qui te traverse n'est pas de l'impatience — c'est de la clarté.",
      "Tu avances avant même d'avoir décidé d'avancer. C'est ton don.",
      "Ce matin, ton énergie devance ta pensée. Laisse-la faire.",
      "La première impression que tu as est souvent la bonne. Fais-lui confiance.",
      "Il y a une urgence tranquille en toi que les autres ne voient pas encore.",
      "Tu portes une flamme que même toi tu ne mesures pas toujours.",
      "Aujourd'hui, ton instinct est ton meilleur conseiller."
    ],
    "Taureau": [
      "Ce qui dure mérite qu'on prenne le temps de le construire bien.",
      "Ton rapport au beau n'est pas superficiel — c'est une forme de sagesse.",
      "Il y a dans ta lenteur une intelligence que l'urgence ne comprend pas.",
      "Ce que tu touches, tu le transformes sans effort apparent.",
      "La patience que tu incarnes aujourd'hui est une forme de courage rare.",
      "Ton corps sait avant ton esprit. Écoute ce qu'il te dit.",
      "La sécurité que tu cherches est plus intérieure qu'extérieure.",
      "Ce que tu cultives avec soin portera ses fruits au bon moment.",
      "Ta constance est ton pouvoir le plus sous-estimé.",
      "Aujourd'hui, le simple est profond. Ne cherche pas plus loin."
    ],
    "Gémeaux": [
      "Ton esprit a visité dix endroits avant que ton corps se lève.",
      "La curiosité que tu portes est une forme de générosité envers le monde.",
      "Ce que tu appelles dispersion est parfois une richesse que les autres n'ont pas.",
      "Tu sais parler à chacun dans sa langue. C'est un art rare.",
      "Il y a une idée qui tourne depuis hier soir. Elle mérite ton attention.",
      "La légèreté n'est pas la superficialité — tu le prouves chaque jour.",
      "Deux pensées contraires peuvent coexister. Tu le sais mieux que quiconque.",
      "Ce que tu dis aujourd'hui laissera une trace plus longue que tu ne crois.",
      "Ton intelligence est un feu qui a besoin d'air. Donne-lui de l'espace.",
      "La connexion que tu établis entre les choses est ton vrai talent."
    ],
    "Cancer": [
      "Ce que tu portes pour les autres est réel, mais toi aussi tu as besoin.",
      "Ta mémoire émotionnelle est une archive précieuse — consulte-la doucement.",
      "Il y a une tendresse en toi que les mots ne suffisent pas à décrire.",
      "Ta maison intérieure est plus vaste que tu ne l'imagines.",
      "Ce que tu ressens aujourd'hui appartient à une sagesse ancienne.",
      "Les marées de ton âme ont leur propre rythme. Respecte-le.",
      "Ta sensibilité n'est pas une faiblesse — c'est ton radar le plus précis.",
      "Prendre soin de toi aujourd'hui est un acte de générosité envers les autres.",
      "Ce que tu appelles nostalgie est parfois une boussole vers ce qui compte.",
      "Ton cœur a raison même quand ta tête hésite."
    ],
    "Lion": [
      "Rayonner n'est pas de la vanité quand ça réchauffe les autres.",
      "Il y a un éclat en toi qui ne demande qu'une permission : la tienne.",
      "Ce que tu crées aujourd'hui porte ta signature unique. Ne la dilue pas.",
      "Ta générosité est réelle — assure-toi qu'elle te revient parfois.",
      "La scène sur laquelle tu joues aujourd'hui t'appartient entièrement.",
      "Quelqu'un a besoin de ta lumière aujourd'hui. Tu sauras qui.",
      "Ton besoin de reconnaissance est humain. Il n'a pas à te faire honte.",
      "Ce que tu accomplis avec joie a plus de valeur que ce que tu accomples par devoir.",
      "Ta présence seule change la température d'une pièce.",
      "Aujourd'hui, ose occuper tout l'espace qui t'est dû."
    ],
    "Vierge": [
      "Le souci du détail n'est pas de l'anxiété — c'est de l'amour sous une autre forme.",
      "Ce que tu remarques en premier dit quelque chose sur ce que tu valorises.",
      "Il y a une perfection tranquille dans les choses imparfaites. Tu le sais.",
      "Ton service aux autres est réel. Mais as-tu servi aujourd'hui aussi ?",
      "La précision que tu apportes à tout est un cadeau que peu comprennent.",
      "Ce que tu analyses aujourd'hui mérite aussi d'être ressenti.",
      "Ton corps est plus sage que tes pensées ce matin. Écoute-le.",
      "La critique que tu retiens est souvent plus juste que celle que tu exprimes.",
      "Il n'est pas nécessaire que tout soit parfait pour que tout soit bien.",
      "Ta modestie cache quelque chose de grand. Laisse-le apparaître."
    ],
    "Balance": [
      "L'équilibre que tu cherches n'est pas l'absence de tension — c'est sa juste gestion.",
      "Ta capacité à voir tous les côtés est un don qui parfois te coûte cher.",
      "Il y a une beauté dans la décision elle-même, même imparfaite.",
      "Ce que tu appelles indécision est souvent une intelligence qui refuse le raccourci.",
      "Quelque chose dans tes relations mérite d'être dit avec douceur mais clairement.",
      "L'harmonie que tu crées autour de toi commence par celle que tu cultives en toi.",
      "Aujourd'hui, choisis ce qui est juste plutôt que ce qui est confortable.",
      "Ta sensibilité à l'injustice est un baromètre précieux.",
      "Ce que tu évites par diplomatie finira par s'imposer. Anticipe.",
      "La paix que tu offres aux autres, offre-la-toi d'abord."
    ],
    "Scorpion": [
      "Ce que tu vois sous la surface, les autres ne le verront qu'après.",
      "Ta capacité à supporter l'intensité est une force que peu possèdent.",
      "Il y a une vérité que tu portes depuis longtemps. Elle cherche à sortir.",
      "Ce que tu transformes aujourd'hui disparaît mais revient différent.",
      "Ta méfiance n'est pas de la paranoïa — c'est de la précision.",
      "Quelque chose meurt en toi pour que quelque chose de plus grand naisse.",
      "La profondeur de ce que tu ressens n'est pas un fardeau — c'est un privilège.",
      "Ce que tu gardes secret te protège ou t'emprisonne. Sais-tu lequel ?",
      "Ton pouvoir vient de ta capacité à rester dans l'inconfort plus longtemps que les autres.",
      "Aujourd'hui, laisse quelqu'un te voir vraiment."
    ],
    "Sagittaire": [
      "L'horizon que tu vises existe. Tu en es plus proche que tu ne crois.",
      "Ta vérité n'est pas une arme — mais elle coupe parfois quand même.",
      "Il y a une leçon dans ce qui t'arrive aujourd'hui. Tu la trouveras vite.",
      "Ce que tu appelles liberté est parfois la peur de l'engagement. Examine.",
      "Ton optimisme n'est pas naïf — c'est une décision philosophique.",
      "La sagesse ne vient pas toujours de loin. Parfois elle est juste là.",
      "Ce voyage dont tu rêves a peut-être commencé sans que tu t'en rendes compte.",
      "Ton rire est une forme d'intelligence. Use-en aujourd'hui.",
      "Ce que tu crois être une fuite est parfois la plus courageuse des directions.",
      "Aujourd'hui, le sens que tu cherches est dans la question elle-même."
    ],
    "Capricorne": [
      "Ce que tu bâtis aujourd'hui sera encore debout quand tu l'auras oublié.",
      "Ta discipline n'est pas une prison — c'est la forme que prend ta liberté.",
      "Il y a une légèreté que tu t'interdis. Autorise-la ce soir.",
      "Ce que tu accomplis sans bruit a plus de valeur que ce qu'on célèbre avec bruit.",
      "Ton rapport au temps est une forme de sagesse rare dans ce siècle.",
      "La montagne ne se gravit pas d'un bond. Tu le sais et tu avances quand même.",
      "Ce que tu portes avec sérieux mérite aussi d'être porté avec joie.",
      "Ta patience n'est pas de la résignation — c'est de la stratégie.",
      "Quelqu'un admire de loin ce que tu fais. Tu ne le sais probablement pas.",
      "Aujourd'hui, permets-toi d'être fier de ce chemin parcouru."
    ],
    "Verseau": [
      "Ce que tu vois que les autres ne voient pas encore n'est pas une erreur — c'est une avance.",
      "Ta différence n'est pas un défaut à corriger — c'est une direction à suivre.",
      "Il y a une idée en toi qui dérange parce qu'elle est vraie.",
      "Ce que tu appelles solitude est parfois la condition de ta clarté.",
      "Ton détachement n'est pas de l'indifférence — c'est une forme d'objectivité.",
      "La liberté que tu défends pour les autres, réclame-la aussi pour toi.",
      "Ce que tu libères en toi libère quelque chose dans le monde.",
      "Ton avenir n'est pas une utopie — c'est un projet en cours.",
      "Il y a une contradiction en toi aujourd'hui. Elle porte une vérité.",
      "Aujourd'hui, fais confiance à ce qui ne ressemble à rien de connu."
    ],
    "Poissons": [
      "Ce que tu perçois sans pouvoir le nommer est souvent le plus réel.",
      "Ta porosité au monde n'est pas une faiblesse — c'est ta façon de comprendre.",
      "Il y a une frontière entre toi et l'autre qui mérite d'être posée avec douceur.",
      "Ce que tu rêves la nuit parle de ce que tu évites le jour.",
      "Ton intuition a raison avant que ta logique comprenne pourquoi.",
      "La compassion que tu donnes sans compter, donne-la aussi à toi-même.",
      "Ce que tu appelles confusion est parfois une vérité qui cherche sa forme.",
      "Ton âme est plus ancienne que ce corps — elle se souvient de choses que tu as oubliées.",
      "Ce que tu crées quand personne ne regarde est ton œuvre la plus honnête.",
      "Aujourd'hui, laisse-toi traverser par ce qui vient sans chercher à le retenir."
    ]
  };
  
  export const CLOTURES = [
    "Ce soir, ce que tu n'as pas dit a autant de valeur que ce que tu as accompli.",
    "La nuit qui vient portera ce que la journée n'a pas terminé. Laisse-la faire.",
    "Une chose bien faite aujourd'hui vaut mieux que dix choses à moitié.",
    "Ce que tu lâches aujourd'hui crée de l'espace pour ce qui vient.",
    "Le silence de ce soir est une réponse. Écoute-le.",
    "Quelque chose de petit a changé aujourd'hui. Tu le mesureras plus tard.",
    "Ce que tu as traversé aujourd'hui t'appartient. Personne ne peut te l'enlever.",
    "La journée se referme. Ce qui reste en toi était là avant elle et sera là après."
  ];