# WarLike Hub

Portail **autonome** de l'univers WarLike, indépendant des dépôts **WarLike Server**, **WarLike Mail**, **WarLike Engine** et **WarLike Modeliser**.

## Fonctionnalités

- Annuaire de 11 applications et services WarLike avec liens réels
- Filtres Création, Communauté, Outils personnels, Équipe & serveur
- Recherche instantanée et favoris enregistrés **localement** dans le navigateur
- Interface responsive, cartes et icônes SVG
- Liens séparés vers le Hub et vers l'infrastructure privée `/serveur`

## Hébergement

Application statique, sans compilation ni dépendance externe. Pour Cloudflare Pages ou GitHub Pages, publier la racine du dépôt. Pour le développement local :

```sh
python -m http.server 8080
```

## Sécurité et migration

Le Hub est un **lanceur public**, pas un serveur d'authentification. Il ne stocke ni mots de passe, ni jetons ni messages. Les liens d'administration sont visibles comme destinations mais **les autorisations doivent être appliquées par WarLike Server**. Le statut « site externe » n'est pas une vérification de disponibilité ni d'accès.

La version historique du Hub reste actuellement accessible à la racine de `https://warlike-server.vikktor7.chatgpt.site/`. La migration de cette ancienne route et la publication d'un domaine dédié à WarLike Hub sont des opérations distinctes à effectuer sur l'hébergement ; elles **ne sont pas déclenchées** par les fichiers de ce dépôt.

## Structure

- `index.html` : application et structure sémantique
- `style.css` : interface et adaptation mobile
- `app.js` : catalogue, dossiers, recherche et favoris
