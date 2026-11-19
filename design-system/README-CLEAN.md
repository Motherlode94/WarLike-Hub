# WarLike Clean — contrat visuel commun v1

Source canonique : `design-system/warlike-clean.css` dans WarLike Hub.

## Portée STRICTE
Décoration seulement : couleurs, fonds, bordures, ombres, couleurs des contrôles, états de focus et contrastes.
Interdits : déplacement/placement des textes et boutons, taille du texte, interlignage, marges, paddings, grille/flex, dimensions, responsive, canvas, rendu 2D/3D, timeline et aperçus.

## Déploiement
1. Ajouter une copie **identique** du CSS dans chaque dépôt (solution transitoire sans dépendance externe).
2. Charger cette feuille EN DERNIER, après les feuilles de thème historiques.
3. Supprimer les anciens sélecteurs de palette uniquement après audit des références de variables; conserver les CSS fonctionnels.
4. Valider visuellement les pages desktop/mobile et chaque section. Vérifier styles de champs, contraste et focus.
5. À terme distribuer ce fichier par un package versionné commun au lieu de copies divergentes.

Palette : blanc #FFFFFF, ivoire #F1F2EA, olive #D9D28B, sauge #6A795D, encre #1C2B28.
Le réglage « dark/light » historique n'est plus une autorité distincte sur les couleurs des surfaces : WarLike Clean est la base visuelle unique. Les différences de rendu nécessaires aux outils restent locales et **non thématiques**.

## Compatibilité
Les variables sémantiques `--wl-*` et les alias de composants sont maintenus afin d'éviter la rupture des interfaces existantes. Ce changement ne modifie pas les textes ni leur emplacement.
