# WarLike Foundation 1.1

Source commune : `warlike-foundation.css`. Chaque application embarque une copie locale identique et son adaptateur `warlike-shell.css`. Aucun chargement CDN n’est requis.

| Rôle | Couleur |
| --- | --- |
| Vert profond | #37463D |
| Gris ardoise | #5B696B |
| Graphite | #535953 |
| Ivoire | #F8FBF1 |
| Sauge | #C5C5A9 |

Le mode sombre reprend les surfaces du Hub (#17211B, #233027). Le mode clair conserve la même palette et est activé par `data-warlike-mode="light"`, `data-warlike-theme="light"` ou la classe existante `body.light`.

Les adaptateurs modifient uniquement la présentation des interfaces : aucune dimension, disposition, clé de stockage ni donnée de projet ne change. Les couleurs des scènes, pistes audio, vumètres, ports de graphe, illustrations et états d’erreur restent gérées par chaque application. Heart conserve son accent rose. Engine conserve ses onze thèmes, Graphite par défaut et ses préférences enregistrées.

## Mise à jour

Modifier la source ici, recopier le fichier à l’identique dans les applications listées dans `theme-rollout.json`, puis vérifier les chemins de feuilles de style, les contrastes et les modes existants. Les ressources des pages de service sont aussi embarquées dans leur propre racine de publication.
