# WarLike — audit transversal et ordre d'exécution
**Revue : 16 novembre 2026.** Base : 32 dépôts GitHub accessibles sous Motherlode94 ; README de 30 dépôts examinés (pas de README disponible à la racine de `GAME_HUB-v2` et `Music-Generator`).

## Interprétation des états
- **Présent dans le code** : élément déclaré dans le dépôt ou son README. Ne signifie pas utilisable en production.
- **CI réussie** : seuls les tests couverts sont réussis ; n'atteste pas de la qualité des appareils, des médias ni de l'expérience réelle.
- **Validé de bout en bout** : exige test documenté dans l'environnement cible avec ressources réelles, comptes et permissions appropriés.
- **Production vérifiée** : exige vérification de la version déployée, des bindings/secrets, des flux et de la restauration. Aucun des 32 projets n'a été certifié de bout en bout par cette revue.

## Priorité P0 — bloquants transversaux
| Flux | Dépôts | Critères de sortie |
| --- | --- | --- |
| Authentification et sécurité | WarLike-Server, WarLike-Tower, WarLike-Online, WarLike-Mail, WarLike-Chat | Auth réelle, autorisations et rôles côté serveur, séparation des comptes, D1/R2 et migrations validés, journalisation et erreur sans fuite |
| Production de jeux | WarLike-Engine | Import GLB texturé, physique Rigidbody/Collider, Animator, scripts et export autonome reproduisant les comportements |
| Production musicale | WarLike-Studio | Session multipiste sauvegardée, audio réel, entrées physiques, latence et endurance 30–60 minutes mesurées, isolation utilisateur |
| Pipeline des personnages | WarLike-Rig-Studio, WarLike-Virtual-Idols | Sept vrais GLB importés, rigging/skin testé en mouvement, export→réimport, morphs faciaux, pistes vocales isolées et visèmes validés |
| Avatar IA | WarLike-Heart | Backend et sessions, configuration de production, vrai rendu GLB, contrôle de confidentialité et de stockage |
| Collaboration | CodeDuo-Academy | Auth étudiant et collaboration simultanée à deux navigateurs réels, stockage/presence vérifiés |

**WarLike Keys** est décrit dans l'écosystème comme un service d'identité, mais **aucun dépôt autonome `WarLike-Keys` ne figure dans les 32 dépôts retournés**. Identifier l'implémentation réelle du service de comptes et ses contrats avant d'intégrer un second mécanisme d'auth.

## Priorité P1 — intégration et robustesse
- **Library ↔ Asset Stores ↔ Engine :** transfert de bytes PNG/GLB et scripts, empreintes, licences, prefabs, installation, rechargement et export.
- **Ebook :** lecteur réel EPUB/PDF, signets, annotations, sauvegarde/restauration et compte privé éventuel. Protéger les textes et distinguer sync manuelle de sync cloud.
- **Monteur ↔ Node :** rendu vidéo et audio fiable, réimport du WebM dans un lecteur indépendant, timeline multipiste, puis compositing avancé.
- **Modeliser :** conserver matériaux/UV/maillage à l'export et réimporter dans Engine.
- **Game Hub :** recenser jeux jouables et vérifier contrôles, scènes, caméra, collisions, UI et sauvegardes.
- **Hub :** maintenir un inventaire complet sans supposer que tous les dépôts correspondent à des applications publiques.
- **Android Hub, OSA, OSW, Browser :** binaires signés et tests sur Android/Windows réels ; la version web n'équivaut pas au programme natif.
- **Crypte :** audit cryptographique, récupération, formats de sauvegarde, absence de stockage de secrets en clair.

## Priorité P2 — qualité pédagogique et secondaire
- **PDF :** tester imports difficiles, export et validation des documents dans un lecteur indépendant.
- **Radio :** distinguer lecteur local/flux HTTPS d'une station diffusée à plusieurs auditeurs.
- **MISC :** tester le microphone et la précision de détection sur instruments réels.
- **DIVINE-SHADOW :** compléter les scènes succinctes et valider les sauvegardes/conversions d'état.
- **GAMEdesign-Course, Music-Generator, multi-funiverse-adventure :** décider maintien, spécialisation ou intégration aux produits principaux.
- **skills-copilot-codespaces-vscode :** ressource de formation, pas un service WarLike à déployer.

## Les règles communes à tous les dépôts
1. **Source de vérité par produit :** dépôt `main` et version déployée, PR distinctes en revue ; ne pas publier comme terminés des changements seulement sur branche.
2. **Mise en service :** build, tests automatisés, contrôle manuel navigateur/appareil cible et traçabilité des versions.
3. **Données :** contrat d'import/export versionné, migrations compatibles, sauvegardes restaurables et isolation comptes.
4. **Sécurité :** authentification serveur, contrôles de rôles, validation des types/taille d'upload, CORS et origine, aucun secret dans le dépôt.
5. **Propriété et licences :** distinguer créations originales WarLike Corps et composants, modèles, fichiers, échantillons ou textures tiers ; garder leurs droits et notices.
6. **Expérience :** ergonomie souris/clavier/tactile, hiérarchie visuelle cohérente, performance faible puissance, accessibilité et messages d'erreur.
7. **Passerelles :** contrats explicites entre applications ; aucun stockage IndexedDB inter-origines supposé partagé, aucun transfert de session par simple URL.

## Cinq lots de réalisation à suivre
- **Lot A — Identité et Server** : API de santé fonctionnelle + rôles + test deux comptes sur tous les services privés.
- **Lot B — Création fiable** : Engine, Studio ; vrais tests de projets et médias.
- **Lot C — Assets et artistes** : Store, Library, Rig Studio, Virtual Idol, Modeliser ; GLB contrôlés et visages fidèles.
- **Lot D — Publication** : Ebook, Monteur, Node, Online, Mail, Chat ; données et contenus persistants.
- **Lot E — Distribution** : Hub, Tower, Android, Windows, Browser et produits secondaires.

## Points non vérifiés
Les README sont parfois plus récents que les dernières captures, mais ne constituent pas une preuve de déploiement. Les migrations D1, bindings Cloudflare, secrets, épreuves HTTP authentifiées, véritables microphones, appareils Android/Windows, fichiers GLB Meshy et exports réels ne sont pas attestés par cet audit. Une disponibilité ou une absence de bug ne doit pas être déduite de la seule présence d'un code.
