# WarLike Android Hub (application Android native)

Application Kotlin Android autonome. **Ce n'est pas une PWA ou une WebView déguisée** : le lanceur, les filtres, la recherche, les favoris et la présentation des applications utilisent les composants Android natifs.

## Fonctions

- Catalogue hors ligne de 14 services WarLike, tri et recherche.
- Favoris locaux conservés via SharedPreferences.
- Ouverture explicite des services WarLike en HTTPS par Intent Android (navigateur choisi par Android).
- Distinction honnête entre services web et APK Android natifs. Le catalogue ne déclare aucun APK publié tant qu'une version native réelle et vérifiée n'existe.
- Interface sombre adaptée aux téléphones et tablettes, sans authentification ni permission dangereuse.

## Compilation APK

Ouvrir le dossier `android/` dans Android Studio (JDK 17, Android SDK 35), synchroniser Gradle, puis **Build → Build APK(s)**. Ou, avec Gradle installé dans le PATH :

```sh
cd android
gradle :app:assembleDebug
```

APK généré en `android/app/build/outputs/apk/debug/app-debug.apk`.

Le dépôt ne contient **pas** de binaire APK compilé ni de wrapper Gradle. Ce code doit être compilé et testé sur un appareil ou un émulateur Android. Les applications WarLike listées sont actuellement des services Web, pas des applications Android installables séparément.

## Évolutions prévues

Quand les logiciels auront de véritables APK signés, le catalogue pourra ajouter des entrées APK avec URL, empreinte SHA-256, contrôle de version et installation explicite par le gestionnaire Android. Ne pas annoncer ou déclencher de téléchargement APK sans vérifier son origine et sa signature.
