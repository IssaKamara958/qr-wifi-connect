# Guide d'Installation Capacitor - WiFi QR Scanner

Ce guide vous accompagne pas à pas pour transformer votre application web en application mobile native Android et iOS.

## 📋 Prérequis

### Pour tout le monde
- ✅ Node.js 18+ installé ([télécharger](https://nodejs.org/))
- ✅ Git installé ([télécharger](https://git-scm.com/))
- ✅ Un compte GitHub

### Pour Android
- ✅ Android Studio ([télécharger](https://developer.android.com/studio))
- ✅ Java JDK 11 ou supérieur

### Pour iOS (Mac uniquement)
- ✅ macOS
- ✅ Xcode 13+ ([installer depuis l'App Store](https://apps.apple.com/app/xcode/id497799835))
- ✅ CocoaPods : `sudo gem install cocoapods`

---

## 🚀 Installation Étape par Étape

### Étape 1 : Exporter le projet depuis Lovable

1. Dans Lovable, cliquez sur **"Export to GitHub"**
2. Connectez votre compte GitHub si ce n'est pas déjà fait
3. Créez un nouveau repository (ex: `WiFiQRScanner`)
4. Attendez que l'export soit terminé

### Étape 2 : Cloner le projet localement

Ouvrez un terminal et exécutez :

```bash
# Remplacez YOUR_USERNAME par votre nom d'utilisateur GitHub
git clone https://github.com/YOUR_USERNAME/WiFiQRScanner.git
cd WiFiQRScanner
```

### Étape 3 : Installer les dépendances

```bash
npm install
```

⏱️ Durée : 2-3 minutes

### Étape 4 : Initialiser Capacitor

```bash
npx cap init
```

Répondez aux questions suivantes :
- **App name** : `WiFi QR Scanner`
- **App ID** : `app.lovable.284f91e0c0d741a3bada8344c74460e1` (ou votre propre ID comme `com.yourname.wifiscanner`)
- **Web directory** : Appuyez sur Entrée (valeur par défaut : `dist`)

✅ Le fichier `capacitor.config.ts` est créé automatiquement

---

## 📱 Build Android

### Étape 5A : Ajouter la plateforme Android

```bash
npx cap add android
```

⏱️ Durée : 1-2 minutes

### Étape 6A : Mettre à jour les dépendances natives

```bash
npx cap update android
```

### Étape 7A : Build du projet web

```bash
npm run build
```

### Étape 8A : Synchroniser le code

```bash
npx cap sync android
```

Cette commande :
- Copie le code web compilé vers le projet Android
- Met à jour les plugins natifs
- Configure les permissions

### Étape 9A : Ouvrir dans Android Studio

```bash
npx cap open android
```

Ou ouvrez manuellement le dossier `android/` dans Android Studio.

### Étape 10A : Lancer l'application

**Option A : Depuis Android Studio**
1. Attendez que Gradle se synchronise (barre de progression en bas)
2. Cliquez sur le bouton ▶️ "Run" en haut
3. Choisissez un émulateur ou un appareil connecté

**Option B : Depuis le terminal**
```bash
npx cap run android
```

🎉 **Votre app Android est lancée !**

---

## 🍎 Build iOS (macOS uniquement)

### Étape 5B : Ajouter la plateforme iOS

```bash
npx cap add ios
```

⏱️ Durée : 1-2 minutes

### Étape 6B : Mettre à jour les dépendances natives

```bash
npx cap update ios
```

### Étape 7B : Build du projet web

```bash
npm run build
```

### Étape 8B : Synchroniser le code

```bash
npx cap sync ios
```

### Étape 9B : Installer les CocoaPods

```bash
cd ios/App
pod install
cd ../..
```

### Étape 10B : Ouvrir dans Xcode

```bash
npx cap open ios
```

Ou ouvrez manuellement `ios/App/App.xcworkspace` dans Xcode.

### Étape 11B : Configurer l'équipe de signature

1. Dans Xcode, sélectionnez le projet **App** dans le navigateur
2. Onglet **Signing & Capabilities**
3. Cochez **"Automatically manage signing"**
4. Sélectionnez votre **Team** (compte Apple Developer)

### Étape 12B : Lancer l'application

**Option A : Depuis Xcode**
1. Choisissez un simulateur iPhone en haut (ex: iPhone 15)
2. Cliquez sur le bouton ▶️ "Play"

**Option B : Depuis le terminal**
```bash
npx cap run ios
```

🎉 **Votre app iOS est lancée !**

---

## 🔄 Workflow de Développement

### Modification du code

Après chaque modification :

```bash
# 1. Build le projet web
npm run build

# 2. Synchroniser avec les plateformes natives
npx cap sync

# 3. Relancer l'app
npx cap run android  # ou ios
```

### Mode Hot Reload (recommandé pour dev)

L'app est configurée pour pointer vers le sandbox Lovable :
- Toutes les modifications dans Lovable apparaissent instantanément
- Pas besoin de rebuild l'app
- Idéal pour le développement rapide

Pour développer en local avec hot reload :

1. Modifiez `capacitor.config.ts` :
```typescript
server: {
  url: 'http://YOUR_LOCAL_IP:5173',  // Remplacez par votre IP locale
  cleartext: true
}
```

2. Lancez le serveur de dev :
```bash
npm run dev
```

3. Synchronisez :
```bash
npx cap sync
npx cap run android  # ou ios
```

---

## 🛠️ Commandes Utiles

```bash
# Lister les informations du projet
npx cap doctor

# Mettre à jour Capacitor
npm install @capacitor/core@latest @capacitor/cli@latest

# Mettre à jour les plateformes
npx cap update

# Nettoyer et rebuild
npm run build && npx cap sync

# Logs Android
npx cap run android --livereload

# Logs iOS
npx cap run ios --livereload
```

---

## 🐛 Résolution de Problèmes

### Problème : Permission caméra refusée

**Android** : Ajoutez dans `android/app/src/main/AndroidManifest.xml` :
```xml
<uses-permission android:name="android.permission.CAMERA" />
```

**iOS** : Déjà configuré dans `capacitor.config.ts`

### Problème : "Cleartext HTTP traffic not permitted"

Ajoutez dans `android/app/src/main/AndroidManifest.xml` :
```xml
<application android:usesCleartextTraffic="true">
```

### Problème : Gradle sync failed

```bash
cd android
./gradlew clean
cd ..
npx cap sync android
```

### Problème : CocoaPods erreur (iOS)

```bash
cd ios/App
pod deintegrate
pod install
cd ../..
```

---

## 📦 Publication sur les Stores

### Google Play Store

1. Build de production :
```bash
cd android
./gradlew bundleRelease
```

2. Le fichier APK/AAB sera dans `android/app/build/outputs/`

3. Créez un compte Google Play Console (25$ unique)

4. Suivez le [guide officiel](https://developer.android.com/studio/publish)

### Apple App Store

1. Archivez l'app depuis Xcode : **Product → Archive**

2. Compte Apple Developer requis (99$/an)

3. Suivez le [guide officiel](https://developer.apple.com/help/app-store-connect/get-started/)

---

## 📚 Ressources

- [Documentation Capacitor](https://capacitorjs.com/docs)
- [Plugins Capacitor](https://capacitorjs.com/docs/plugins)
- [Lovable Documentation](https://docs.lovable.dev)
- [Android Developer Guide](https://developer.android.com/guide)
- [iOS Developer Guide](https://developer.apple.com/documentation)

---

## ✅ Checklist de Vérification

Avant de publier, vérifiez :

- [ ] L'app fonctionne sur émulateur Android
- [ ] L'app fonctionne sur émulateur iOS
- [ ] L'app fonctionne sur appareil physique Android
- [ ] L'app fonctionne sur appareil physique iOS
- [ ] Les permissions caméra sont demandées
- [ ] Le scan QR fonctionne (caméra + image)
- [ ] La connexion Wi-Fi fonctionne sur Android
- [ ] L'icône de l'app est personnalisée
- [ ] Le nom de l'app est correct
- [ ] Les métadonnées (description, auteur) sont à jour

---

## 🆘 Besoin d'Aide ?

1. Consultez les logs : `npx cap run android --livereload`
2. Vérifiez la documentation Capacitor
3. Ouvrez une issue sur le [GitHub du projet](https://github.com/IssaKamara958/WiFiQRCodeMobile/issues)

**Bon développement ! 🚀**
