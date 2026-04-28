// src/data/horoscopesData.js

export const HOROSCOPES = {
    "Bélier": {
      0: {
        message: "« L'élan qui te traverse aujourd'hui est une flèche qui ne demande qu'à être décochée vers l'inconnu. »",
        amour: { texte: "Une rencontre fortuite pourrait faire vibrer ton cœur de guerrier. Ne te protège pas derrière ton armure, la vulnérabilité est ta plus grande force aujourd'hui. Ose le mot tendre.", score: 4 },
        travail: { texte: "Ton ambition brûle comme un feu de forge. Un projet que tu croyais endormi se réveille soudainement. Ne t'éparpille pas, concentre cette énergie sur une seule direction.", score: 3 },
        bienEtre: { texte: "Ton corps réclame du mouvement, presque de la fureur. Une course à l'aube ou une danse effrénée libéreront les tensions accumulées. L'eau fraîche sera ton alliée.", score: 5 },
        tags: ["Courage", "Initiative"]
      },
      1: {
        message: "« Les commencements sont des portes étroites, mais c'est en les franchissant que tu découvres ta stature véritable. »",
        amour: { texte: "La patience n'est pas ta vertu première, pourtant c'est elle qui fera fleurir une relation naissante. Laisse le mystère s'installer, ne dévoile pas tout ton feu d'un seul coup.", score: 3 },
        travail: { texte: "Une proposition inattendue te pousse hors de ta zone de confort. Accepte ce vertige, il contient les germes d'une évolution que tu attendais sans le savoir. Fonce.", score: 5 },
        bienEtre: { texte: "La colère rentrée te noue les épaules. Trouve un exutoire qui ne blesse personne — un cri dans un oreiller, un sprint jusqu'à l'épuisement. La détente viendra après.", score: 2 },
        tags: ["Audace", "Renouveau"]
      },
      2: {
        message: "« Le courage n'est pas l'absence de peur, mais la décision que quelque chose est plus grand que cette peur. »",
        amour: { texte: "Un ancien amour hante tes pensées ce matin. Ne le chasse pas avec brusquerie, écoute ce qu'il a à t'apprendre sur qui tu es devenu. La nostalgie est parfois une boussole.", score: 4 },
        travail: { texte: "Un conflit latent mérite d'être abordé avec franchise. Ta nature directe trouvera les mots justes si tu prends une respiration avant de parler. L'honnêteté désarme.", score: 4 },
        bienEtre: { texte: "Ta peau reflète ton stress intérieur. Un bain aux sels marins, un massage vigoureux — prends soin de cette enveloppe qui te porte. Elle mérite ta douceur.", score: 3 },
        tags: ["Clarté", "Confrontation"]
      },
      3: {
        message: "« Dans le silence qui suit l'action, tu entendras la voix qui te guide depuis toujours. »",
        amour: { texte: "Tu as tendance à confondre passion et possession. Aujourd'hui, offre à l'autre l'espace que tu revendiques pour toi-même. La liberté partagée est le plus beau des liens.", score: 3 },
        travail: { texte: "Une idée fulgurante te réveille avant l'aube. Note-la immédiatement, elle contient le germe d'une réussite future. Ne laisse pas le quotidien l'étouffer par négligence.", score: 5 },
        bienEtre: { texte: "L'insomnie te guette, ton esprit galope quand le corps réclame le repos. Une tisane de verveine, trois pages d'écriture libre, et la nuit t'accueillera enfin.", score: 2 },
        tags: ["Créativité", "Lâcher-prise"]
      },
      4: {
        message: "« La solitude choisie est un jardin secret où poussent les fleurs les plus rares de l'âme. »",
        amour: { texte: "Un regard échangé dans un lieu inattendu pourrait ébranler tes certitudes. Ne te cache pas derrière l'ironie, laisse ce trouble exister sans chercher à le nommer tout de suite.", score: 4 },
        travail: { texte: "Tu portes trop de dossiers à bout de bras. Délègue, fais confiance, même si ton instinct te dit le contraire. La vraie force consiste à savoir s'entourer.", score: 3 },
        bienEtre: { texte: "Un massage crânien te ferait un bien immense. Les tensions s'accumulent à la racine des cheveux, libère-les. Tes pensées en seront plus claires.", score: 4 },
        tags: ["Rencontre", "Délégation"]
      },
      5: {
        message: "« La beauté n'est pas dans les choses, mais dans l'élan qui te pousse à les atteindre. »",
        amour: { texte: "Une conversation profonde transforme une amitié en quelque chose de plus troublant. Ne t'enfuis pas devant l'intensité, reste présent à ce qui émerge entre les silences.", score: 5 },
        travail: { texte: "Un retard administratif te contrarie. Au lieu de t'emporter, utilise cette pause forcée pour repenser ta stratégie. L'obstacle cache souvent un raccourci.", score: 2 },
        bienEtre: { texte: "Les longues marches en pleine nature apaisent ton feu intérieur. Cherche un horizon dégagé, respire à pleins poumons. Le mouvement te sauvera de la rumination.", score: 4 },
        tags: ["Passion", "Patience"]
      },
      6: {
        message: "« Tu ne trouves pas ta voie, tu la crées à chaque pas, même ceux qui te semblent hésitants. »",
        amour: { texte: "Un malentendu avec ton partenaire s'estompe si tu choisis l'écoute plutôt que la défense. Dépose les armes, ne serait-ce qu'une heure. La trêve est fertile.", score: 3 },
        travail: { texte: "Une reconnaissance tardive arrive enfin. Savoure-la sans fausse modestie. Tu as travaillé dur, tu mérites ce moment de lumière. Accepte les compliments.", score: 4 },
        bienEtre: { texte: "Les sports d'eau vive sont ton refuge cette semaine. Plonge dans une piscine ou cours sous la pluie, laisse l'élément liquide calmer tes ardeurs.", score: 5 },
        tags: ["Reconnaissance", "Trêve"]
      }
    },
    "Taureau": {
      0: {
        message: "« La lenteur n'est pas une faiblesse, mais la certitude tranquille que tout arrive à point à qui sait attendre. »",
        amour: { texte: "Un geste tendre, presque anodin, ravive une flamme qui couvait sous les cendres du quotidien. Ne sous-estime pas le pouvoir d'une main posée sur une épaule.", score: 4 },
        travail: { texte: "Ta persévérance commence à porter ses fruits. Ne cède pas aux sirènes de l'impatience, continue à labourer ton sillon. La récolte sera plus abondante que prévu.", score: 5 },
        bienEtre: { texte: "La gastronomie est une forme de méditation pour toi. Prépare un repas lent, choisis chaque ingrédient avec soin. Le plaisir des sens est sacré.", score: 4 },
        tags: ["Patience", "Sensualité"]
      },
      1: {
        message: "« Les racines les plus profondes ne se voient pas, mais ce sont elles qui résistent aux tempêtes. »",
        amour: { texte: "Un souvenir d'enfance remonte, lié à une odeur ou une chanson. Partage-le avec l'être aimé, ces confidences tissent l'intimité plus sûrement que les grandes déclarations.", score: 5 },
        travail: { texte: "Une proposition financière mérite ton attention, mais ne te précipite pas. Étudie chaque clause, ton flair pour la sécurité est ton meilleur atout aujourd'hui.", score: 3 },
        bienEtre: { texte: "Ton dos te parle, écoute-le. Une séance d'étirements profonds ou un bain chaud aux huiles essentielles de lavande dénoueront les crispations du stress.", score: 3 },
        tags: ["Stabilité", "Prudence"]
      },
      2: {
        message: "« La beauté est partout pour qui sait poser un regard neuf sur le monde familier. »",
        amour: { texte: "Une jalousie sourde s'installe. Plutôt que de la ruminer, exprime ton besoin de réassurance. L'autre ne peut pas deviner ce que tu tais avec tant de soin.", score: 2 },
        travail: { texte: "Un collègue envahit ton territoire. Pose des limites claires sans agressivité, ta fermeté suffira. Ton espace de travail est un sanctuaire, protège-le.", score: 4 },
        bienEtre: { texte: "Le contact avec la terre est thérapeutique. Jardinage, poterie, ou simplement marcher pieds nus dans l'herbe — reconnecte-toi à l'humus originel.", score: 5 },
        tags: ["Territoire", "Expression"]
      },
      3: {
        message: "« Le silence habité est plus éloquent que tous les discours du monde. »",
        amour: { texte: "Tu sens monter le besoin de t'isoler, même de l'être aimé. Explique ce mouvement de repli avec douceur, ce n'est pas un rejet mais un retour nécessaire à soi.", score: 3 },
        travail: { texte: "Une routine qui te pesait se fissure enfin. Une opportunité de changement se présente, saisis-la même si elle t'effraie un peu. L'inconfort précède la croissance.", score: 5 },
        bienEtre: { texte: "La musique adoucit tes tensions. Crée une playlist qui épouse tes humeurs, laisse les sons pénétrer tes défenses et faire vibrer quelque chose d'ancien en toi.", score: 4 },
        tags: ["Introspection", "Changement"]
      },
      4: {
        message: "« Ce que tu possèdes finit par te posséder — choisis avec soin ce qui mérite de t'accompagner. »",
        amour: { texte: "Une déclaration inattendue te touche plus que tu ne le montres. Baisse ta garde, laisse voir cette émotion qui te traverse. Le courage sentimental te va bien.", score: 4 },
        travail: { texte: "Un investissement que tu as fait par le passé te revient décuplé. Ne réinvestis pas tout, garde une part pour le plaisir pur. La prospérité se célèbre.", score: 5 },
        bienEtre: { texte: "Les massages aux pierres chaudes sont indiqués pour toi aujourd'hui. La chaleur minérale réveille quelque chose d'ancestral dans tes muscles. Offre-toi ce soin.", score: 3 },
        tags: ["Prospérité", "Lâcher-prise"]
      },
      5: {
        message: "« La constance n'est pas la stagnation, mais le lent polissage de l'âme par les jours qui se ressemblent. »",
        amour: { texte: "Un projet commun avec ton partenaire renforce vos liens. Construire ensemble, même symboliquement, est un acte d'amour profond pour ta nature bâtisseuse.", score: 5 },
        travail: { texte: "On fait appel à ton expertise. Ta réputation grandit dans l'ombre, on reconnaît ta fiabilité. Accepte cette nouvelle responsabilité, elle est à ta mesure.", score: 4 },
        bienEtre: { texte: "La cuisine réconfortante est ton refuge. Un plat mijoté longtemps, des épices douces — le bonheur est parfois dans un chaudron qui embaume la maison.", score: 2 },
        tags: ["Construction", "Reconnaissance"]
      },
      6: {
        message: "« Chaque ride au coin de l'œil raconte un éclat de rire — ton visage est le livre de ta joie. »",
        amour: { texte: "Un ami cher traverse une crise, ta présence silencieuse suffit. Tu n'as pas besoin de mots pour réconforter, ta seule constance est un baume pour ceux qui t'entourent.", score: 3 },
        travail: { texte: "Une offre alléchante exige que tu quittes ta zone de confort. Pèse le pour et le contre avec ton pragmatisme habituel, mais n'oublie pas d'écouter ton instinct.", score: 4 },
        bienEtre: { texte: "Le yoga restauratif est parfait pour toi ce week-end. Des postures tenues longtemps, une respiration profonde — ton corps te remerciera de cette attention patiente.", score: 5 },
        tags: ["Fidélité", "Choix"]
      }
    },
    "Gémeaux": {
      0: {
        message: "« Les mots sont des oiseaux migrateurs, ils traversent le ciel de ta pensée sans jamais s'y poser longtemps. »",
        amour: { texte: "Une conversation légère prend un tour inattendu, dévoilant des profondeurs que tu ne soupçonnais pas chez l'autre. Reste dans cette intimité nouvelle, ne fuis pas vers un autre sujet.", score: 3 },
        travail: { texte: "Deux opportunités s'offrent à toi simultanément. Ta dualité naturelle veut tout saisir, mais un choix s'impose. Écoute ton corps, il sait déjà laquelle te fait vibrer.", score: 5 },
        bienEtre: { texte: "Ton esprit papillonnant a besoin d'être apaisé. La méditation guidée, même brève, réunira tes fragments éparpillés. Concentre-toi sur un seul souffle à la fois.", score: 2 },
        tags: ["Choix", "Profondeur"]
      },
      1: {
        message: "« La curiosité est une forme de courage, celle d'ouvrir des portes sans savoir ce qui se cache derrière. »",
        amour: { texte: "Un message arrive d'une personne que tu avais perdue de vue. Ne réponds pas immédiatement, laisse résonner en toi ce que ce retour fait surgir comme souvenirs et comme espoir.", score: 4 },
        travail: { texte: "Une idée que tu as lancée en l'air prend racine ailleurs. Réclame ta paternité intellectuelle avec élégance, sans agressivité. Ta créativité mérite reconnaissance.", score: 3 },
        bienEtre: { texte: "La danse libre est ton élixir du jour. Mets de la musique et laisse ton corps improviser sans jugement. Chaque mouvement inattendu libère une pensée prisonnière.", score: 5 },
        tags: ["Créativité", "Communication"]
      },
      2: {
        message: "« L'ennui n'est que le silence entre deux notes — c'est là que la mélodie prend son sens. »",
        amour: { texte: "Tu as tendance à intellectualiser tes sentiments, à les disséquer. Aujourd'hui, laisse une émotion exister sans l'analyser. Elle est valide simplement parce qu'elle est là.", score: 4 },
        travail: { texte: "Un apprentissage nouveau te tend les bras. Une formation courte, un livre technique — tu as soif de savoir, cette acquisition te servira plus vite que tu ne le crois.", score: 5 },
        bienEtre: { texte: "La marche en ville stimule ton esprit. Perds-toi volontairement dans des rues inconnues, observe les détails. La flânerie est une forme d'intelligence sensible.", score: 3 },
        tags: ["Apprentissage", "Flânerie"]
      },
      3: {
        message: "« Tu n'es pas double, tu es multiple — chaque facette de toi est une étoile dans ta constellation intérieure. »",
        amour: { texte: "Une attirance intellectuelle se mue en désir plus trouble. Ne t'en défends pas, explore cette frontière poreuse entre l'esprit et le corps. Certaines vérités sont charnelles.", score: 5 },
        travail: { texte: "Un malentendu professionnel s'envenime. Utilise ton don pour les mots, clarifie sans accuser. Une conversation franche dissipera le quiproquo avant qu'il ne s'installe.", score: 3 },
        bienEtre: { texte: "Les exercices respiratoires sont ta bouée. Le souffle alterné des narines calme le bavardage mental. Essaie-le ce soir avant de dormir, tu trouveras un silence inespéré.", score: 4 },
        tags: ["Désir", "Clarté"]
      },
      4: {
        message: "« Le vent ne sait pas où il va, mais il sait qu'il doit souffler — ainsi va ta pensée vagabonde. »",
        amour: { texte: "Un secret partagé renforce un lien naissant. La confiance est un trésor fragile, garde-le contre ton cœur. Ce que l'autre te confie aujourd'hui est sacré.", score: 4 },
        travail: { texte: "Une réunion que tu redoutais se passe mieux que prévu. Ta capacité à rebondir sur les idées des autres impressionne. Tu brilles dans le dialogue improvisé.", score: 4 },
        bienEtre: { texte: "L'écriture automatique libère ton inconscient. Trois pages chaque matin, sans réfléchir ni corriger. Tu découvriras des trésors enfouis sous le bavardage quotidien.", score: 5 },
        tags: ["Confiance", "Improvisation"]
      },
      5: {
        message: "« La légèreté n'est pas l'absence de profondeur, mais la capacité à plonger sans poids superflu. »",
        amour: { texte: "Un flirt amusant pourrait devenir plus sérieux si tu le laisses faire. Ne sabote pas cette possibilité par peur de l'ennui. Certaines histoires simples sont les plus belles.", score: 5 },
        travail: { texte: "Un projet collaboratif t'enthousiasme au début, puis la routine te pèse. Tiens bon cette fois, l'engagement a ses vertus. La persévérance t'apprendra une leçon précieuse.", score: 2 },
        bienEtre: { texte: "Les sports de raquette répondent à ton besoin de vivacité. Un match de badminton ou de tennis libérera ton trop-plein d'énergie mentale par le mouvement.", score: 4 },
        tags: ["Engagement", "Vivacité"]
      },
      6: {
        message: "« Écouter n'est pas se taire, c'est faire de l'espace en soi pour que la parole de l'autre puisse y danser. »",
        amour: { texte: "Tu parles beaucoup, mais aujourd'hui on a besoin de ton oreille. Offre ce cadeau rare : l'attention pure. Ce que tu entendras transformera ta vision de la relation.", score: 3 },
        travail: { texte: "Une ancienne idée revient sous une forme nouvelle. Ne la rejette pas sous prétexte que tu l'as déjà eue, elle a mûri et toi aussi. Réexamine-la avec fraîcheur.", score: 5 },
        bienEtre: { texte: "La sieste est une pratique spirituelle pour toi ce week-end. Vingt minutes d'abandon, les volets mi-clos. Le monde peut attendre, ta vitalité en dépend.", score: 4 },
        tags: ["Écoute", "Renouveau"]
      }
    },
    "Cancer": {
      0: {
        message: "« La coquille n'est pas une prison, mais un temple où l'âme se recueille avant d'affronter la marée. »",
        amour: { texte: "Un souvenir familial affleure et colore ta façon d'aimer aujourd'hui. Ne le refoule pas, il contient une clé. Ce que tes ancêtres ont vécu résonne dans tes propres choix.", score: 4 },
        travail: { texte: "Ton instinct te dit de refuser un projet, écoute-le. Ta sensibilité perçoit des écueils que la raison ignore. Cette prudence te sauvera d'un engagement regrettable.", score: 5 },
        bienEtre: { texte: "Les tisanes de grand-mère sont plus que des boissons, elles sont un héritage. Camomille, mélisse, tilleul — prépare-toi une infusion comme on prépare un rituel sacré.", score: 4 },
        tags: ["Intuition", "Héritage"]
      },
      1: {
        message: "« Les larmes ne sont pas une faiblesse, mais la preuve que l'océan intérieur est assez vaste pour contenir toutes les tempêtes. »",
        amour: { texte: "Un geste de tendresse inattendu te bouleverse plus que de raison. Ne cache pas cette émotion, laisse-la traverser ton visage. La vulnérabilité est une offrande précieuse.", score: 5 },
        travail: { texte: "Une ambiance tendue au travail te pèse. Ton besoin d'harmonie est malmené. Protège-toi en visualisant une bulle de lumière autour de toi, c'est plus qu'une image.", score: 2 },
        bienEtre: { texte: "Le bain chaud est ton sanctuaire ce soir. Sels d'Epsom, bougie, porte close. L'eau lave plus que le corps, elle nettoie les traces que le jour a laissées sur ton âme.", score: 5 },
        tags: ["Vulnérabilité", "Protection"]
      },
      2: {
        message: "« Les maisons sont faites de pierres, mais les foyers sont tissés de souvenirs et de silences partagés. »",
        amour: { texte: "Un conflit larvé avec ton partenaire mérite une attention douce. N'attends pas l'explosion, aborde le sujet avec une tasse de thé et la volonté sincère de comprendre.", score: 3 },
        travail: { texte: "On cherche à t'imposer un rythme qui n'est pas le tien. Affirme ton besoin de profondeur contre la tyrannie de la vitesse. La qualité naît dans la lenteur.", score: 4 },
        bienEtre: { texte: "La cuisine régressive du dimanche te fait du bien. Un gâteau de ton enfance, l'odeur qui emplit la maison — c'est toi que tu nourris à travers ces gestes anciens.", score: 4 },
        tags: ["Dialogue", "Lenteur"]
      },
      3: {
        message: "« La mémoire n'est pas un grenier poussiéreux, mais un jardin où certaines fleurs ne demandent qu'à refleurir. »",
        amour: { texte: "Une photo ancienne réveille un amour que tu croyais endormi. Ne fuis pas la nostalgie, elle te dit quelque chose d'essentiel sur ce que ton cœur cherche vraiment.", score: 4 },
        travail: { texte: "Ta créativité est stimulée par un environnement rassurant. Aménage ton espace de travail avec des objets qui te sont chers. Le beau et le familier nourrissent ton inspiration.", score: 5 },
        bienEtre: { texte: "Les promenades au bord de l'eau sont ta médecine. La mer, un lac, ou simplement une fontaine — l'élément liquide te recharge plus profondément que le sommeil.", score: 3 },
        tags: ["Mémoire", "Créativité"]
      },
      4: {
        message: "« Nourrir les autres est ta façon de dire je t'aime sans les mots qui parfois te manquent. »",
        amour: { texte: "Un repas préparé avec soin est ton langage amoureux aujourd'hui. Chaque ingrédient choisi, chaque épice dosée porte une intention. L'amour passe aussi par les papilles.", score: 5 },
        travail: { texte: "Un collègue traverse une épreuve, ton empathie naturelle fait la différence. Une parole de réconfort au bon moment a plus de valeur qu'un grand discours.", score: 3 },
        bienEtre: { texte: "Le besoin de te lover est légitime. Cédez à l'appel du canapé, d'un plaid doux, d'un livre qui ne demande rien. La régression volontaire est une forme de résistance.", score: 5 },
        tags: ["Empathie", "Récupération"]
      },
      5: {
        message: "« L'attachement n'est pas un piège, mais un fil qui te relie à ce qui compte vraiment. »",
        amour: { texte: "Une peur de l'abandon ressurgit de manière irrationnelle. Parle-en à l'autre sans accusation, simplement pour partager ce qui te traverse. Nommer le vertige le dissipe.", score: 3 },
        travail: { texte: "Un projet que tu as couvé avec patience éclot enfin. Ne le donne pas au monde trop vite, protège-le encore un peu. La gestation a ses raisons que le marché ignore.", score: 4 },
        bienEtre: { texte: "Les exercices de visualisation sont puissants pour toi. Imagine une coquille de nacre autour de ton corps, qui filtre les énergies sans t'isoler du monde.", score: 4 },
        tags: ["Sécurité", "Accomplissement"]
      },
      6: {
        message: "« La lune ne rivalise pas avec le soleil, elle éclaire simplement la nuit de sa lumière empruntée et douce. »",
        amour: { texte: "Un moment de grâce avec ta famille ou tes proches illuminera ta journée. Ne cherche pas la perfection, laisse la beauté surgir du chaos ordinaire d'un déjeuner partagé.", score: 4 },
        travail: { texte: "Tu prends conscience d'un talent que tu sous-estimais. Accueille ce compliment sincère comme une vérité. Ton humilité, poussée trop loin, devient une injustice envers toi-même.", score: 3 },
        bienEtre: { texte: "Le rangement est thérapeutique ce week-end. Trier, donner, jeter — chaque objet libéré est un poids ôté. Fais de la place pour ce qui vient.", score: 5 },
        tags: ["Gratitude", "Allègement"]
      }
    },
    "Lion": {
      0: {
        message: "« Briller n'est pas voler la lumière aux autres, c'est leur montrer qu'elle existe en chacun. »",
        amour: { texte: "Une admiration se transforme en attirance plus trouble. Laisse-toi surprendre par ce désir qui ne ressemble pas à tes schémas habituels. L'inattendu est une fête.", score: 4 },
        travail: { texte: "Sous les projecteurs aujourd'hui, tu excelles. Ta présentation captive, ta vision inspire. Ne fais pas l'économie de la reconnaissance, reçois-la pleinement.", score: 5 },
        bienEtre: { texte: "Les soins capillaires royaux te font du bien. Un masque, un brossage lent, comme un rituel de couronnement. Ta crinière est le reflet de ta vitalité, bichonne-la.", score: 5 },
        tags: ["Rayonnement", "Reconnaissance"]
      },
      1: {
        message: "« L'orgueil est un soleil qui aveugle, la fierté une étoile qui guide — apprends à distinguer leur lumière. »",
        amour: { texte: "Un besoin d'être admiré peut froisser ton partenaire. Aujourd'hui, offre des compliments sincères sans attendre de retour. La générosité du cœur est une force solaire.", score: 4 },
        travail: { texte: "On teste ton autorité, garde contenance. Ta légitimité ne se démontre pas dans l'affrontement mais dans la constance. Le vrai chef inspire sans élever la voix.", score: 3 },
        bienEtre: { texte: "Le yoga du matin au soleil te recharge en fierté lumineuse. Les salutations au soleil ne portent pas ce nom par hasard, honore ton astre tutélaire.", score: 5 },
        tags: ["Générosité", "Leadership"]
      },
      2: {
        message: "« Le courage n'est pas rugissement, mais murmure tenace qui refuse d'être étouffé. »",
        amour: { texte: "Une promesse que tu as faite et oubliée remonte à la surface. Excuse-toi avec élégance, sans chercher d'excuses. La noblesse consiste à reconnaître ses propres failles.", score: 3 },
        travail: { texte: "Une collaboration prestigieuse se profile. Ne néglige pas les détails pratiques dans l'enthousiasme du moment. La grandeur se construit aussi sur des fondations modestes.", score: 5 },
        bienEtre: { texte: "Le théâtre ou le cinéma en grand spectacle nourrit ton âme. Laisse-toi emporter par une histoire plus grande que la tienne, elle mettra tes soucis en perspective.", score: 4 },
        tags: ["Humilité", "Grandeur"]
      },
      3: {
        message: "« Ta voix porte plus loin que tu ne le crois, parle avec conscience, chaque mot est une semence. »",
        amour: { texte: "Une déclaration passionnée te brûle les lèvres. Dis-la sans peur, mais sans attendre de réponse immédiate. Offrir ses sentiments sans condition est un acte royal.", score: 5 },
        travail: { texte: "Ta créativité explose, les idées fusent. Canalise ce feu dans un projet structuré, ne le disperse pas en pétillements sans lendemain. La discipline sublime le talent.", score: 4 },
        bienEtre: { texte: "La natation en eau libre réveille ta puissance vitale. L'eau fraîche sur ta peau, le soleil sur ton dos — un baptême quotidien qui te rend invincible.", score: 3 },
        tags: ["Passion", "Discipline"]
      },
      4: {
        message: "« Le trône n'est pas un siège, c'est la responsabilité de porter les autres avec grâce. »",
        amour: { texte: "Une personne timide cherche ton attention. Abaisse ta garde royale, va vers elle. Parfois les cœurs les plus modestes cachent les plus grands trésors.", score: 4 },
        travail: { texte: "Un budget serré contrarie tes plans ambitieux. Vois-y un exercice de créativité plutôt qu'une punition. L'abondance reviendra, en attendant fais des merveilles avec peu.", score: 3 },
        bienEtre: { texte: "Les séances de musculation douce renforcent ton corps sans violence. Gainage, postures tenues — la force tranquille est cent fois plus puissante que l'effort brutal.", score: 4 },
        tags: ["Humilité", "Adaptation"]
      },
      5: {
        message: "« L'amour-propre bien placé n'est pas vanité, c'est la juste reconnaissance de sa propre valeur. »",
        amour: { texte: "Un flirt en ligne te fait sourire, prends-le pour ce qu'il est : un jeu léger. Ne cherche pas à tout prix une profondeur qui n'est peut-être pas au rendez-vous.", score: 5 },
        travail: { texte: "Ton réseau s'élargit grâce à une rencontre fortuite. Cultive ce contact avec sincérité, pas uniquement par intérêt. Les vraies alliances naissent de la considération mutuelle.", score: 4 },
        bienEtre: { texte: "La sieste en journée n'est pas une faiblesse, c'est un luxe. Vingt minutes les yeux fermés, rideaux tirés — tu te relèveras plus flamboyant que jamais.", score: 3 },
        tags: ["Légèreté", "Réseau"]
      },
      6: {
        message: "« L'ombre n'est pas l'ennemie de la lumière, elle en est le contrepoint nécessaire pour qu'on puisse la voir. »",
        amour: { texte: "Une ombre de jalousie te traverse. Examine-la froidement : est-elle fondée ou nourrie par ton besoin d'être le centre ? La lucidité désamorce les drames inutiles.", score: 3 },
        travail: { texte: "Une critique constructive te blesse plus que de raison. Respire, prends du recul avant de réagir. Ce feedback contient une pépite pour ta progression, cherche-la.", score: 5 },
        bienEtre: { texte: "L'automassage du visage est un acte de réconciliation avec ton image. Des gestes doux, une huile précieuse — réconcilie-toi avec le visage dans le miroir.", score: 4 },
        tags: ["Lucidité", "Progression"]
      }
    },
    "Vierge": {
      0: {
        message: "« La perfection n'est pas un but, c'est une direction — et chaque pas compte, même celui qui te semble de travers. »",
        amour: { texte: "Tu analyses trop les intentions de l'autre jusqu'à en perdre la spontanéité. Laisse une phrase rester mystérieuse, un geste ne pas être décortiqué. Le doute est fertile.", score: 3 },
        travail: { texte: "Ton sens du détail sauve un projet de l'échec. Ne t'excuse pas d'être minutieux, cette qualité est rare. Tu vois ce que les autres négligent, c'est un don.", score: 5 },
        bienEtre: { texte: "La routine matinale est ton ancrage. Une infusion verte, dix minutes de silence — ce rituel n'est pas ennuyeux, il est sacré. Protège-le contre les imprévus.", score: 4 },
        tags: ["Minutie", "Rituel"]
      },
      1: {
        message: "« L'ordre intérieur ne se force pas, il se cultive comme un jardin — avec patience et attention aux saisons. »",
        amour: { texte: "Un geste d'affection maladroit te touche plus qu'une déclaration sophistiquée. Laisse-toi émouvoir par la sincérité malhabile, elle vaut cent fois la perfection froide.", score: 4 },
        travail: { texte: "Un collègue te confie une tâche que tu aurais faite autrement. Résiste à l'envie de tout reprendre, la délégation est une compétence qui s'apprend.", score: 3 },
        bienEtre: { texte: "Le rangement de printemps même en automne libère tes énergies. Un tiroir, un placard — chaque espace ordonné libère une charge mentale.", score: 5 },
        tags: ["Lâcher-prise", "Ordre"]
      },
      2: {
        message: "« Ton corps est un temple dont tu es à la fois le prêtre et l'architecte — construis avec soin. »",
        amour: { texte: "Un souci de santé t'inquiète et freine tes élans amoureux. Parles-en à l'autre au lieu de t'isoler. Le partage de la vulnérabilité crée une intimité profonde.", score: 2 },
        travail: { texte: "Une erreur passée te hante encore. Pardonne-toi publiquement, c'est le seul moyen de la dépasser. Ta sévérité envers toi-même est plus lourde que le jugement d'autrui.", score: 4 },
        bienEtre: { texte: "La marche digestive après le repas est une sagesse ancienne. Vingt minutes d'un pas lent, sans écouteurs — laisse les pensées se décanter comme un vin noble.", score: 5 },
        tags: ["Pardon", "Soin"]
      },
      3: {
        message: "« Le doute n'est pas ton ennemi, c'est l'aiguillon qui te pousse à chercher le vrai sous le vraisemblable. »",
        amour: { texte: "L'incertitude te ronge au sujet d'une relation. Au lieu de chercher des réponses dans ta tête, pose des questions à l'autre. La vérité émerge du dialogue.", score: 3 },
        travail: { texte: "Une formation complémentaire s'offre à toi. Même si le timing semble mauvais, saisis-la. L'investissement dans tes compétences est le plus sûr des placements.", score: 5 },
        bienEtre: { texte: "Les infusions de plantes amères sont ton allié santé. Pissenlit, artichaut, romarin — ton foie te remerciera de cette attention herbacée.", score: 4 },
        tags: ["Dialogue", "Formation"]
      },
      4: {
        message: "« Le silence est un espace vide où les réponses que tu ne cherches plus viennent se poser. »",
        amour: { texte: "Tu aides un proche dans une épreuve, cet élan de service cache un sentiment plus profond. Interroge-toi sur ce dévouement : est-ce de l'amour ou de la fuite ?", score: 4 },
        travail: { texte: "Une charge de travail excessive te guette. Dis non avant que ton corps ne le dise pour toi. La prévention est ta meilleure alliée cette semaine.", score: 3 },
        bienEtre: { texte: "Les étirements de la colonne sont prioritaires. Ton dos porte le poids de tes soucis, offre-lui des torsions douces, des flexions lentes.", score: 5 },
        tags: ["Limites", "Prévention"]
      },
      5: {
        message: "« La pureté n'est pas l'absence de tache, mais la clarté de l'intention derrière chaque geste. »",
        amour: { texte: "Un flirt au travail te trouble. Pèse les conséquences avant d'agir, mais ne rejette pas cette étincelle par pur principe. Certaines règles méritent d'être questionnées.", score: 5 },
        travail: { texte: "Ta rigueur est citée en exemple. Accepte cet éloge sans le minimiser, tu l'as mérité. La reconnaissance n'est pas de la vanité quand elle est juste.", score: 4 },
        bienEtre: { texte: "La diète médiatique s'impose. Une journée sans écrans, ou simplement une soirée. Le silence numérique est une cure pour l'esprit saturé.", score: 3 },
        tags: ["Reconnaissance", "Déconnexion"]
      },
      6: {
        message: "« Au service des autres, tu te trouves — mais ne t'y perds pas entièrement. »",
        amour: { texte: "Un proche abuse de ta disponibilité, pose une limite aimante. Aider n'est pas se sacrifier, et l'amour ne se mesure pas à l'épuisement que tu acceptes.", score: 3 },
        travail: { texte: "Un dossier complexe trouve enfin sa résolution grâce à ta persévérance. Célèbre cette victoire discrètement, elle est le fruit de ton intelligence patiente.", score: 5 },
        bienEtre: { texte: "Le ménage de printemps s'impose même en hiver. Trie tes vêtements, donne ce qui ne te sert plus. Le désencombrement matériel est une libération mentale.", score: 4 },
        tags: ["Équilibre", "Désencombrement"]
      }
    },
    "Balance": {
      0: {
        message: "« L'équilibre n'est pas immobile, c'est une danse constante entre ce que tu retiens et ce que tu offres. »",
        amour: { texte: "Une décision affective te paralyse, chaque option a son charme. Plutôt que de peser sans fin, demande à ton corps ce qu'il veut. Le cœur a des raisons que la balance ignore.", score: 3 },
        travail: { texte: "Un conflit entre collègues fait appel à tes talents de médiateur. Interviens avec délicatesse, mais ne porte pas la responsabilité de la réconciliation sur tes seules épaules.", score: 5 },
        bienEtre: { texte: "L'harmonie des couleurs dans ta tenue influence ton humeur. Choisis des teintes apaisantes, un accord visuel qui te met en paix avant même de parler à quiconque.", score: 4 },
        tags: ["Médiation", "Harmonie"]
      },
      1: {
        message: "« La beauté sauvera le monde, et toi avec — cherche-la partout, même là où on ne l'attend pas. »",
        amour: { texte: "Un rendez-vous arrangé te surprend par sa profondeur. Laisse tomber tes attentes, vis le moment présent. L'amour arrive parfois par des chemins que tu n'aurais pas choisis.", score: 5 },
        travail: { texte: "Une offre alléchante te fait hésiter. Pèse les pour et les contre une fois, puis décide. L'indécision prolongée est plus coûteuse qu'un mauvais choix.", score: 3 },
        bienEtre: { texte: "La visite d'un musée ou d'une exposition est une nécessité aujourd'hui. L'art réaligne tes énergies, nourris-toi de beauté comme d'un aliment essentiel.", score: 5 },
        tags: ["Beauté", "Décision"]
      },
      2: {
        message: "« La justice n'est pas d'être d'accord avec tous, mais de donner à chacun la chance d'être entendu. »",
        amour: { texte: "Un vieux grief remonte entre toi et ton partenaire. Ne le balaie pas d'un « ce n'est rien », affronte-le ensemble. Les non-dits sont des termites dans la charpente du couple.", score: 2 },
        travail: { texte: "On te demande de prendre parti, ta neutralité est mise à l'épreuve. Choisis le camp de l'équité, même si cela déplaît. L'intégrité se mesure dans la tempête.", score: 4 },
        bienEtre: { texte: "Les exercices d'équilibre physique répondent à ton besoin symbolique. Tiens-toi sur un pied, cherche ta stabilité. Le corps enseigne ce que l'esprit peine à comprendre.", score: 4 },
        tags: ["Intégrité", "Équilibre"]
      },
      3: {
        message: "« L'autre n'est pas ta moitié, il est le miroir où tu apprends à te voir tout entier. »",
        amour: { texte: "Une complicité intellectuelle allume un désir plus charnel. Ne t'en défends pas, explore cette alchimie. Le corps et l'esprit ne sont jamais aussi éloignés qu'on le croit.", score: 4 },
        travail: { texte: "Une collaboration artistique ou créative t'enthousiasme. Lance-toi sans attendre le moment parfait, l'élan initial contient déjà la beauté du résultat final.", score: 5 },
        bienEtre: { texte: "La musique classique apaise tes tourments intérieurs. Un concerto pour piano, une sonate — laisse les structures sonores réparer ce qui est désaccordé en toi.", score: 3 },
        tags: ["Créativité", "Alchimie"]
      },
      4: {
        message: "« L'art de la diplomatie consiste à savoir dire la vérité d'une manière que l'autre peut entendre. »",
        amour: { texte: "Une vérité difficile doit être dite à un proche. Pèse tes mots sans les édulcorer, la franchise respectueuse est un acte d'amour plus grand que le silence confortable.", score: 3 },
        travail: { texte: "Un partenariat commercial se profile, vérifie les termes avec soin. Ton sens de l'équité te protège des clauses abusives. Fais confiance à ton instinct juridique.", score: 5 },
        bienEtre: { texte: "Les soins du visage en institut sont une offrande à toi-même aujourd'hui. Laisse-toi toucher, masser, embellir par des mains expertes. La beauté est un dû.", score: 4 },
        tags: ["Franchise", "Partenariat"]
      },
      5: {
        message: "« Les extrêmes s'attirent, mais c'est au point médian que naît la véritable rencontre. »",
        amour: { texte: "Une personne venue d'un univers très différent du tien t'attire. Ne la juge pas avec tes critères habituels, élargis ton spectre. L'étrangeté est le début de l'aventure.", score: 5 },
        travail: { texte: "Ton bureau a besoin d'être réaménagé pour favoriser la concentration. Déplace les meubles, crée un espace qui respire. L'environnement façonne la pensée.", score: 3 },
        bienEtre: { texte: "La danse de salon est une thérapie joyeuse. Un cours de tango ou de valse — le dialogue des corps en mouvement te sortira de la rumination mentale.", score: 4 },
        tags: ["Ouverture", "Mouvement"]
      },
      6: {
        message: "« Ce qui pèse lourd aujourd'hui sera plume demain, si tu acceptes de poser la balance un instant. »",
        amour: { texte: "Un week-end en amoureux s'annonce, déconnecte vraiment. Laisse le téléphone, sois entièrement présent. La qualité de l'attention est le plus grand des aphrodisiaques.", score: 4 },
        travail: { texte: "Une injustice te révolte dans ton environnement professionnel. Agis avec stratégie plutôt qu'avec émotion. La colère justifiée gagne à s'armer de patience.", score: 4 },
        bienEtre: { texte: "La flânerie sans but est un art perdu que tu dois retrouver. Marche une heure sans destination, sans montre. Le temps offert à soi est le luxe suprême.", score: 5 },
        tags: ["Présence", "Patience"]
      }
    },
    "Scorpion": {
      0: {
        message: "« Ce qui ne peut être nommé te possède — mets des mots sur l'ombre et tu la verras reculer. »",
        amour: { texte: "Une passion ancienne ressurgit avec la force d'un geyser. Ne la combats pas, ne la fuis pas — observe-la. Elle a un message pour toi, déchiffre-le avant d'agir.", score: 5 },
        travail: { texte: "Un secret professionnel te parvient, garde-le avec un soin jaloux. L'information est un pouvoir, utilise-la avec sagesse et non pour manipuler.", score: 4 },
        bienEtre: { texte: "Les bains de purification au sel sont ton rituel du jour. Sel de mer, quelques gouttes de sauge, une bougie noire. L'eau emporte ce que tu es prêt à laisser partir.", score: 3 },
        tags: ["Passion", "Discrétion"]
      },
      1: {
        message: "« La métamorphose n'est pas confortable, mais c'est le prix pour devenir ce que tu es vraiment. »",
        amour: { texte: "Une crise transforme ta relation, ne la traverse pas en surface. Plonge dans l'inconfort, dis ce qui est difficile. La vérité, même brutale, est le seul chemin vers l'intimité vraie.", score: 4 },
        travail: { texte: "Un investissement risqué te tente. Ton flair est bon, mais vérifie chaque détail. La chance favorise les audacieux qui ont préparé le terrain.", score: 5 },
        bienEtre: { texte: "La psychanalyse ou une conversation profonde avec un confident dénoue une crispation ancienne. Parle de ce que tu tais depuis trop longtemps, la parole libère.", score: 4 },
        tags: ["Vérité", "Transformation"]
      },
      2: {
        message: "« Le phénix ne renaît pas de la facilité, mais de l'incendie qu'il a osé traverser. »",
        amour: { texte: "Une rupture que tu n'as pas digérée te hante encore. Aujourd'hui, écris une lettre que tu n'enverras pas. Brûle-la ensuite, cérémonieusement. La cendre est fertile.", score: 3 },
        travail: { texte: "On tente de prendre ton crédit pour un travail accompli. Lève-toi et parle, calmement. Ta réputation se défend avec des faits, pas avec des cris.", score: 5 },
        bienEtre: { texte: "Le jeûne intermittent peut t'apporter la clarté mentale que tu cherches. Commence doucement, écoute ton corps. La privation choisie est une conquête.", score: 4 },
        tags: ["Résilience", "Affirmation"]
      },
      3: {
        message: "« Le désir est une boussole plus fiable que la raison quand il s'agit d'atteindre ton cœur profond. »",
        amour: { texte: "Une attraction irrésistible te pousse vers une personne interdite. Ne juge pas ton désir, mais interroge-le. Que cherche-t-il vraiment au-delà de l'objet qu'il désigne ?", score: 5 },
        travail: { texte: "Une enquête ou une recherche en profondeur révèle des éléments cachés. Continue à creuser, tu touches au but. Ta persévérance inspectrice est un atout.", score: 5 },
        bienEtre: { texte: "La natation en eau profonde est un défi qui te ressemble. Plonger dans le grand bassin, sentir le vertige — apprivoiser l'immensité te rend plus fort.", score: 3 },
        tags: ["Désir", "Investigation"]
      },
      4: {
        message: "« L'intimité n'est pas de montrer ses blessures, mais d'accepter que l'autre les voie et ne fuie pas. »",
        amour: { texte: "Un moment de fusion intense avec ton partenaire te bouleverse. Ne rationalise pas cette expérience, laisse-la infuser. Certains mystères ne demandent pas à être résolus.", score: 5 },
        travail: { texte: "Une rivalité s'intensifie, elle cache peut-être du respect. Cherche le dialogue plutôt que l'affrontement, l'adversaire d'aujourd'hui pourrait être l'allié de demain.", score: 3 },
        bienEtre: { texte: "Les postures de yoga inversées changent ta perspective. La chandelle, le poirier — voir le monde à l'envers remet les idées à l'endroit.", score: 4 },
        tags: ["Fusion", "Perspective"]
      },
      5: {
        message: "« La vengeance est une chaîne, le pardon une clé — choisis ce qui te libère vraiment. »",
        amour: { texte: "Une trahison ancienne te retient prisonnier. Aujourd'hui, fais un pas vers le pardon, non pour l'autre mais pour toi. La rancune est un poison que tu bois seul.", score: 2 },
        travail: { texte: "Tu découvres un pot aux roses qui pourrait éclabousser. Agis avec discernement, ne dévoile pas tout immédiatement. La vérité a besoin de timing.", score: 4 },
        bienEtre: { texte: "La boxe ou un sport de combat canalisent ton trop-plein d'intensité. Frappe dans les règles, laisse sortir la force sans détruire. La discipline te sauve.", score: 5 },
        tags: ["Pardon", "Stratégie"]
      },
      6: {
        message: "« L'ombre en toi n'est pas un ennemi, c'est une partie de toi qui attend d'être aimée. »",
        amour: { texte: "Un désir inavouable te travaille. Explore-le dans le fantasme avant de le confronter au réel. Certaines explorations intérieures sont des voyages nécessaires.", score: 4 },
        travail: { texte: "Une transaction financière importante demande ta signature. Lis chaque ligne, la magie est dans les détails que les autres négligent.", score: 5 },
        bienEtre: { texte: "L'aromathérapie avec des huiles profondes te correspond. Patchouli, santal, myrrhe — des parfums de cérémonie ancienne qui réveillent ta puissance endormie.", score: 3 },
        tags: ["Exploration", "Prudence"]
      }
    },
    "Sagittaire": {
      0: {
        message: "« L'horizon n'est pas une fuite, c'est la promesse que quelque chose de plus grand t'attend. »",
        amour: { texte: "Une rencontre en voyage ou lors d'un déplacement imprévu pourrait tout changer. Reste ouvert, ne planifie pas chaque minute. La spontanéité est ton talisman amoureux.", score: 5 },
        travail: { texte: "Une opportunité à l'étranger ou dans une autre région se concrétise. Ose le grand saut, ta nature expansive dépérirait dans la stagnation.", score: 4 },
        bienEtre: { texte: "La course à pied en pleine nature est ta messe. Un sentier inconnu, le souffle du vent — le mouvement est ta prière, l'espace ton sanctuaire.", score: 5 },
        tags: ["Aventure", "Expansion"]
      },
      1: {
        message: "« La vérité est une flèche, elle atteint sa cible sans détour — mais parfois la cible n'est pas prête. »",
        amour: { texte: "Ta franchise a blessé un être cher sans que tu le mesures. Reviens avec douceur, une excuse sincère n'est pas un recul mais une avancée vers l'autre.", score: 3 },
        travail: { texte: "Un projet philosophique ou éditorial prend forme. Écris, partage, enseigne — ta vision du monde mérite d'être entendue. Le professeur en toi s'éveille.", score: 5 },
        bienEtre: { texte: "La randonnée en montagne est essentielle aujourd'hui. L'effort, l'altitude, le panorama — tu as besoin de grandeur pour te sentir à ta juste place.", score: 4 },
        tags: ["Douceur", "Enseignement"]
      },
      2: {
        message: "« L'optimisme n'est pas naïveté, c'est la certitude que le sens se révèle toujours au voyageur patient. »",
        amour: { texte: "Un flirt avec une personne d'une autre culture t'enrichit. Laisse-toi dépayser, apprends son langage amoureux. L'amour est la plus belle des langues étrangères.", score: 4 },
        travail: { texte: "Une formation en ligne ou un séminaire te passionne. Investis dans ce savoir, il éclairera ta route professionnelle plus brillamment qu'un diplôme ordinaire.", score: 4 },
        bienEtre: { texte: "L'équitation répond à ton besoin d'élan et de liberté. Une chevauchée, même débutante, te reconnecte à l'animal puissant et noble qui sommeille en toi.", score: 5 },
        tags: ["Découverte", "Passion"]
      },
      3: {
        message: "« L'humour est la politesse du désespoir — aujourd'hui, ris de tes propres drames. »",
        amour: { texte: "Une peur de l'engagement te fait fuir une relation qui s'approfondit. Arrête-toi et regarde ta peur en face. L'engagement n'est pas une cage, c'est un camp de base.", score: 2 },
        travail: { texte: "On te propose un rôle de mentor. Accepte cette responsabilité, transmettre est ta vocation cachée. L'élève que tu guideras t'apprendra autant que tu lui offriras.", score: 5 },
        bienEtre: { texte: "Les sports collectifs en plein air sont à l'honneur. Football, volley sur plage — le jeu partagé sous le ciel est la meilleure cure pour ton âme aventureuse.", score: 3 },
        tags: ["Engagement", "Transmission"]
      },
      4: {
        message: "« La maison n'est pas un lieu, c'est la certitude que tu peux toujours y revenir. »",
        amour: { texte: "Un amour lointain te manque soudain douloureusement. Appelle, écris, envoie un signe. La distance n'est rien quand le lien est cultivé avec attention.", score: 4 },
        travail: { texte: "Une idée géniale te traverse au milieu de la nuit, note-la. Ta créativité est en ébullition, ne laisse pas la banalité quotidienne éteindre cette flamme.", score: 5 },
        bienEtre: { texte: "Le camping sauvage ou une nuit à la belle étoile est indiqué. Dors près du ciel, laisse la voie lactée te rappeler l'immensité qui t'habite.", score: 4 },
        tags: ["Lien", "Créativité"]
      },
      5: {
        message: "« Le voyage le plus long commence par un pas, mais aussi par le courage de quitter ce qui est connu. »",
        amour: { texte: "Une exubérance amoureuse te fait prendre des risques. Profite de cette énergie, mais n'oublie pas que l'autre a son propre rythme. La fougue charme, l'écoute captive.", score: 5 },
        travail: { texte: "Un coup de chance professionnel te tombe du ciel. Ne le questionne pas, saisis-le. Parfois la fortune récompense simplement ceux qui ont osé.", score: 4 },
        bienEtre: { texte: "La danse intuitive, sans chorégraphie, libère ton corps. Mets de la musique tribale et bouge comme l'esprit te guide. Laisse l'instinct mener le mouvement.", score: 4 },
        tags: ["Chance", "Instinct"]
      },
      6: {
        message: "« La liberté n'est pas l'absence d'attaches, mais de choisir celles qui t'élèvent. »",
        amour: { texte: "Une discussion philosophique avec ton partenaire renforce votre complicité. L'intelligence partagée est un ciment aussi fort que le désir. Cultivez cette conversation infinie.", score: 4 },
        travail: { texte: "Tu envisages de changer radicalement de voie. Pèse les risques, mais ne les laisse pas te paralyser. La sécurité est parfois le masque de la peur.", score: 3 },
        bienEtre: { texte: "Le sauna ou le hammam sont parfaits pour toi aujourd'hui. La chaleur enveloppante, la sudation purificatrice — retrouve le confort primitif des sources chaudes.", score: 5 },
        tags: ["Liberté", "Purification"]
      }
    },
    "Capricorne": {
      0: {
        message: "« La montagne ne se conquiert pas en un jour, mais chaque pas te rapproche du sommet invisible. »",
        amour: { texte: "Tu as tendance à traiter l'amour comme un projet avec des objectifs. Lâche la planification, laisse du jeu. L'imprévu sentimental est une brèche dans ta forteresse.", score: 3 },
        travail: { texte: "Une promotion ou une reconnaissance longtemps attendue se profile. Continue d'être irréprochable, le dernier effort est souvent le plus dur mais le plus beau.", score: 5 },
        bienEtre: { texte: "La randonnée en solitaire fortifie ton âme plus que ton corps. Choisis un sentier escarpé, mesure ta force. L'effort consenti est la source de ta fierté.", score: 4 },
        tags: ["Persévérance", "Reconnaissance"]
      },
      1: {
        message: "« Le temps n'est pas ton ennemi, mais l'architecte patient qui polit la pierre brute de ton être. »",
        amour: { texte: "Une relation mature demande un nouveau palier d'intimité. Ne te dérobe pas devant l'exigence du cœur, tu as bâti des empires, construis maintenant un sanctuaire.", score: 4 },
        travail: { texte: "Un mentor ou une figure d'autorité te remarque favorablement aujourd'hui. Ne sois pas trop modeste, laisse la lumière te désigner. Tu l'as mérité.", score: 5 },
        bienEtre: { texte: "Le soin de la colonne vertébrale est prioritaire. Ostéopathie, yoga ciblé — ton dos est la poutre maîtresse de ton temple physique.", score: 3 },
        tags: ["Maturité", "Visibilité"]
      },
      2: {
        message: "« La solitude du chef n'est pas une fatalité, c'est l'espace où se forge la décision juste. »",
        amour: { texte: "Un ami fidèle traverse une épreuve et tu es la seule personne vers qui il se tourne. Sois présent sans chercher à résoudre, l'écoute est ton cadeau aujourd'hui.", score: 3 },
        travail: { texte: "Une décision difficile doit être prise et retombe sur toi. Assume-la avec la dignité qui te caractérise. Le vrai leadership se mesure au poids des choix.", score: 5 },
        bienEtre: { texte: "Les aliments racines sont à l'honneur cette semaine. Carottes, panais, betteraves — ce qui pousse sous terre t'ancre et te nourrit en profondeur.", score: 4 },
        tags: ["Leadership", "Fidélité"]
      },
      3: {
        message: "« La patience n'est pas passive, c'est la détermination silencieuse qui use les obstacles les plus durs. »",
        amour: { texte: "Tu as mis ton cœur en jachère par peur de souffrir. Aujourd'hui, accepte un café, un rendez-vous léger. Le retour à l'amour commence par de petits pas.", score: 3 },
        travail: { texte: "Un investissement à long terme commence à rapporter. Réinvestis avec prudence, la stratégie prudente est ta signature. La fortune sourit aux constants.", score: 5 },
        bienEtre: { texte: "La marche en ville tôt le matin, avant la foule, est un luxe sobre qui te ressemble. Le pavé désert, la lumière naissante — une méditation en mouvement.", score: 4 },
        tags: ["Retour", "Stratégie"]
      },
      4: {
        message: "« L'ambition n'est pas vanité quand elle est au service de quelque chose de plus grand que toi. »",
        amour: { texte: "Une déclaration d'amour te prend au dépourvu. Ne cherche pas de réponse parfaite, dis simplement la vérité de ton cœur, même si elle est maladroite.", score: 4 },
        travail: { texte: "Une alliance stratégique se dessine, choisis tes partenaires avec discernement. La confiance se mérite et se vérifie, ne l'accorde pas légèrement.", score: 4 },
        bienEtre: { texte: "Le renforcement musculaire profond te convient. Pilates, barre au sol — des efforts subtils mais intenses qui sculptent sans violence.", score: 5 },
        tags: ["Sincérité", "Alliance"]
      },
      5: {
        message: "« La responsabilité est le prix de la liberté que tu chéris tant — assume ce paradoxe. »",
        amour: { texte: "Le travail empiète sur ta vie sentimentale. Pose une limite claire aujourd'hui, l'amour ne survit pas aux miettes de temps qu'on lui concède.", score: 2 },
        travail: { texte: "Un ancien projet ressuscité demande ton expertise. Tu es le seul à pouvoir le mener à bien, accepte cette mission comme un hommage à ta compétence.", score: 5 },
        bienEtre: { texte: "Le massage aux pierres volcaniques répond à ton besoin de chaleur structurante. La pierre chaude, la main experte — un moment de détente mérité.", score: 3 },
        tags: ["Équilibre", "Mission"]
      },
      6: {
        message: "« Le sommet atteint, tu verras que la vraie victoire était dans l'ascension elle-même. »",
        amour: { texte: "Le bilan d'une année de couple s'impose doucement. Regarde le chemin parcouru avec gratitude, les tempêtes traversées ensemble sont la preuve de votre solidité.", score: 5 },
        travail: { texte: "Un succès professionnel mérite d'être célébré sobrement. Invite ton équipe, partage la gloire. Le vrai leader élève ceux qui l'entourent.", score: 4 },
        bienEtre: { texte: "Le jeûne digital d'un week-end te ressourcera plus qu'une semaine de vacances. Débranche tout, laisse le monde tourner sans toi. Le silence est ton ami.", score: 4 },
        tags: ["Bilan", "Célébration"]
      }
    },
    "Verseau": {
      0: {
        message: "« L'avenir n'est pas à prévoir, il est à inventer — et tu en as toujours été l'architecte secret. »",
        amour: { texte: "Une amitié se teinte de sentiments plus troublants. Ne classe pas cette relation trop vite, laisse-la flotter dans l'indéfini. Les plus belles histoires naissent aux frontières.", score: 4 },
        travail: { texte: "Une invention ou une innovation germe dans ton esprit. Protège ton idée avant de la partager, le monde n'est pas toujours prêt pour les visionnaires.", score: 5 },
        bienEtre: { texte: "Les technologies de méditation sont pour toi. Une application de cohérence cardiaque, des sons binauraux — le futur est aussi intérieur.", score: 3 },
        tags: ["Innovation", "Amitié"]
      },
      1: {
        message: "« Être différent n'est pas une condamnation, c'est la preuve que tu as une longueur d'avance. »",
        amour: { texte: "Ton détachement apparent blesse un cœur qui te veut plus proche. Explique ton besoin d'espace sans froideur. La liberté que tu revendiques, offre-la aussi à l'autre.", score: 3 },
        travail: { texte: "Un collectif ou une communauté te sollicite pour ton expertise unique. Réponds présent, le travail collaboratif exalte le meilleur de ta nature.", score: 4 },
        bienEtre: { texte: "L'électrostimulation ou les nouvelles technologies de fitness stimulent ton corps. Curieux et avant-gardiste, teste ces méthodes qui changent le rapport au corps.", score: 5 },
        tags: ["Liberté", "Communauté"]
      },
      2: {
        message: "« La solitude choisie est une utopie portative, ton royaume intérieur que nul ne peut envahir. »",
        amour: { texte: "Un excentrique croise ta route et éveille ta curiosité. Ne le juge pas sur ses bizarreries, tu sais mieux que personne qu'elles cachent des trésors.", score: 5 },
        travail: { texte: "Un projet humanitaire ou écologique te tente. Engage-toi, même modestement. Le sens que tu cherches dans le travail passe peut-être par le don de tes talents.", score: 4 },
        bienEtre: { texte: "La flottaison en caisson d'isolation sensorielle est une expérience à vivre. L'apesanteur, le silence absolu — un voyage interstellaire sans quitter la Terre.", score: 4 },
        tags: ["Originalité", "Engagement"]
      },
      3: {
        message: "« L'intuition est une intelligence qui ne passe pas par les mots — écoute ce qui pulse sous ta raison. »",
        amour: { texte: "Une révolution intérieure bouleverse tes schémas amoureux. Ce qui t'attirait hier te semble fade. Accepte cette évolution, tes goûts grandissent avec toi.", score: 4 },
        travail: { texte: "Une vision fugace dans un rêve contient une solution professionnelle. Note-la au réveil, tes nuits sont plus créatives que tes jours.", score: 5 },
        bienEtre: { texte: "L'astrologie que tu consultes n'est pas superstition mais langage symbolique. Tire une carte, médite un transit — le ciel est un miroir de ta psyché.", score: 3 },
        tags: ["Révolution", "Intuition"]
      },
      4: {
        message: "« L'amitié est une forme d'amour plus subtile, moins exigeante, mais tout aussi essentielle. »",
        amour: { texte: "Un ami blessé a besoin de ton écoute. Laisse tomber tes projets pour cette soirée, la présence humaine vaut plus qu'une réussite supplémentaire.", score: 4 },
        travail: { texte: "Une start-up te démarche pour ton expertise anticonformiste. Évalue le sérieux du projet avant de t'engager, mais ne laisse pas passer ta chance.", score: 5 },
        bienEtre: { texte: "La méditation en réalité virtuelle te transporte. Des paysages impossibles, des sons immersifs — utilise la technologie pour ouvrir les portes de l'intériorisation.", score: 4 },
        tags: ["Présence", "Opportunité"]
      },
      5: {
        message: "« L'électricité de ta pensée allume les ampoules que les autres n'avaient même pas vues. »",
        amour: { texte: "Une conversation nocturne sur les réseaux peut mener à une belle surprise. Ne te méfie pas de tout, laisse la magie du hasard numérique agir.", score: 5 },
        travail: { texte: "Un brevet ou une création personnelle mérite d'être protégée. Fais les démarches nécessaires, ta propriété intellectuelle est ton capital le plus précieux.", score: 4 },
        bienEtre: { texte: "Les sports de glisse urbaine sont dans ton énergie. Skate, trottinette — retrouve la liberté du mouvement fluide dans la ville.", score: 3 },
        tags: ["Création", "Mouvement"]
      },
      6: {
        message: "« Tu n'es pas en avance, le monde est en retard — continue d'avancer, d'autres suivront ta lumière. »",
        amour: { texte: "Une prise de conscience écologique ou sociale rapproche ton couple. Partager des valeurs fortes est un puissant aphrodisiaque pour ton âme.", score: 4 },
        travail: { texte: "L'envie de tout quitter pour un métier plus aligné te traverse. Ne démissionne pas sur un coup de tête, mais prépare cette transition avec soin.", score: 3 },
        bienEtre: { texte: "Le bénévolat dans un refuge animalier est thérapeutique. Le contact avec les bêtes, leur reconnaissance simple — une guérison mutuelle.", score: 5 },
        tags: ["Alignement", "Altruisme"]
      }
    },
    "Poissons": {
      0: {
        message: "« L'océan de tes émotions est plus vaste que toutes les mers du monde — apprends à naviguer sans te perdre. »",
        amour: { texte: "Une intuition fulgurante au sujet d'une rencontre traverse ta rêverie. Ne la balaie pas, suis ce fil ténu. Les poissons savent trouver les courants chauds.", score: 5 },
        travail: { texte: "Un projet artistique te fait de l'œil, même s'il semble peu lucratif. Offre-lui une place dans ta vie, la créativité nourrit ce que l'argent ne peut acheter.", score: 3 },
        bienEtre: { texte: "La baignade en mer ou en piscine est un retour à la source. Flotte sur le dos, les oreilles dans l'eau, laisse le monde s'éloigner quelques minutes.", score: 5 },
        tags: ["Intuition", "Création"]
      },
      1: {
        message: "« La frontière entre le rêve et le réel est poreuse — c'est là que tu trouves les plus beaux trésors. »",
        amour: { texte: "Un rêve érotique te poursuit toute la journée. Note-le en détail, il contient un message de ton inconscient sur ce que ton cœur désire vraiment.", score: 4 },
        travail: { texte: "On te propose un rôle de soutien créatif, accepte sans honte. Tu n'as pas besoin d'être le premier rôle pour exprimer ton talent. L'ombre te va bien.", score: 4 },
        bienEtre: { texte: "La sieste avec un bandeau sur les yeux est un voyage intérieur. Abandonne-toi au demi-sommeil, cette zone où les idées les plus douces te visitent.", score: 5 },
        tags: ["Rêve", "Abandon"]
      },
      2: {
        message: "« La compassion est ta force, pas ta faiblesse — elle te relie à tout ce qui vit et respire. »",
        amour: { texte: "Tu absorbes trop les émotions de ton partenaire, au point de ne plus savoir ce qui est à toi. Aujourd'hui, pratique le détachement aimant.", score: 3 },
        travail: { texte: "Une ambiance toxique au travail menace ton équilibre. Protège-toi avec des rituels de nettoyage énergétique, aussi symboliques soient-ils. L'intention crée la barrière.", score: 2 },
        bienEtre: { texte: "La musique ambient ou New Age est ton refuge. Des nappes sonores longues, sans rythme marqué — laisse-toi dissoudre dans les harmonies.", score: 5 },
        tags: ["Protection", "Harmonie"]
      },
      3: {
        message: "« Ce que tu fuis dans le réel te rattrape dans les songes — affronte le rêve pour guérir le jour. »",
        amour: { texte: "Une peur irrationnelle d'être quitté te submerge. Parle-en à l'autre sans l'accuser, demande du réconfort simplement. La transparence désarme l'angoisse.", score: 2 },
        travail: { texte: "Une occasion de t'exprimer en public se présente. Prépare-toi mais ne surmène pas ton texte, laisse de la place à l'improvisation inspirée.", score: 4 },
        bienEtre: { texte: "Le dessin automatique ou la peinture libératrice évacuent le trop-plein d'images. Laisse la main tracer ce qu'elle veut, sans projet.", score: 5 },
        tags: ["Vulnérabilité", "Expression"]
      },
      4: {
        message: "« Le pardon n'efface pas le passé, mais il ouvre l'avenir — c'est le plus bel acte de création. »",
        amour: { texte: "Une déception amoureuse ancienne refait surface pour être guérie. Accueille cette réminiscence, elle vient pour partir définitivement si tu la laisses passer.", score: 4 },
        travail: { texte: "Tu te disperses entre mille projets, aucun n'avance vraiment. Concentre-toi sur un seul aujourd'hui, celui qui fait battre ton cœur le plus fort.", score: 3 },
        bienEtre: { texte: "Les pierres semi-précieuses sont un soutien au quotidien. Une améthyste pour le calme, une labradorite pour l'intuition — choisis celle qui t'appelle.", score: 4 },
        tags: ["Guérison", "Focalisation"]
      },
      5: {
        message: "« La mélancolie est une marée basse qui découvre des trésors invisibles à marée haute. »",
        amour: { texte: "Une romance platonique te fait vibrer plus qu'une relation consommée. Ne méprise pas cet amour chaste, il a sa beauté propre et son mystère.", score: 5 },
        travail: { texte: "Une œuvre que tu as commencée et délaissée t'appelle à nouveau. Rouvre ce dossier, ton inspiration est revenue. La marée créative a tourné.", score: 5 },
        bienEtre: { texte: "Le jeûne d'informations et de paroles jusqu'à midi clarifie ton esprit. Le silence matinal est un bain d'eau claire pour ton âme perméable.", score: 3 },
        tags: ["Inspiration", "Silence"]
      },
      6: {
        message: "« Le mysticisme n'est pas une fuite du réel, mais une plongée dans ses couches les plus profondes. »",
        amour: { texte: "Une connexion télépathique avec un être cher te surprend. Note ce qui te traverse sans chercher d'explication rationnelle. L'amour a ses canaux secrets.", score: 4 },
        travail: { texte: "On reconnaît enfin ta contribution discrète à un succès collectif. Savoure ce moment sans modestie excessive, ta lumière diffuse mérite d'être vue.", score: 4 },
        bienEtre: { texte: "Un pélerinage ou une visite dans un lieu sacré, quelle que soit ta croyance, élève ton âme. Le lieu saint est celui où ton cœur s'ouvre.", score: 5 },
        tags: ["Connexion", "Sacré"]
      }
    }
  };