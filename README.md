# WiFi QR Scanner - Application Mobile Native

Application mobile **Android & iOS** pour scanner des QR codes Wi-Fi et se connecter automatiquement aux réseaux.

## 🚀 Fonctionnalités

- ✅ **Scan QR code Wi-Fi** en temps réel (caméra)
- ✅ **Import d'images** depuis la galerie
- ✅ **Connexion automatique** sur Android
- ✅ **Copie automatique** du mot de passe sur iOS
- ✅ **Interface moderne** et responsive
- ✅ **100% gratuit** et open source
- ✅ **Support** des QR codes au format standard `WIFI:S:xxx;T:xxx;P:xxx;;`

## 📱 Plateformes supportées

- **Android** : Connexion automatique au Wi-Fi
- **iOS** : Copie du mot de passe + ouverture des paramètres Wi-Fi
- **Web** : Mode développement pour tester l'interface

## 🛠️ Technologies

- **React** + **TypeScript** + **Vite**
- **Capacitor** pour la compilation native
- **Tailwind CSS** pour le design
- **Shadcn/ui** pour les composants UI
- **html5-qrcode** pour le scan d'images
- **@capacitor-community/barcode-scanner** pour le scan caméra

## 📦 Installation & Build

### Prérequis

- Node.js 18+
- Git
- Pour iOS : macOS avec Xcode
- Pour Android : Android Studio

### 1. Cloner et installer

```bash
# Export depuis Lovable via "Export to GitHub"
git clone <YOUR_GITHUB_URL>
cd WiFiQRCodeMobile
npm install
```

### 2. Initialiser Capacitor

```bash
npx cap init
```

Utilisez les valeurs suivantes :
- **App ID** : `app.lovable.284f91e0c0d741a3bada8344c74460e1`
- **App Name** : `WiFi QR Scanner`

### 3. Ajouter les plateformes natives

```bash
# Android
npx cap add android

# iOS (macOS uniquement)
npx cap add ios
```

### 4. Mettre à jour les dépendances natives

```bash
# Pour Android
npx cap update android

# Pour iOS
npx cap update ios
```

### 5. Build du projet

```bash
npm run build
```

### 6. Synchroniser le code

```bash
npx cap sync
```

### 7. Lancer l'application

```bash
# Android (émulateur ou appareil physique)
npx cap run android

# iOS (émulateur ou appareil physique - macOS + Xcode requis)
npx cap run ios
```

## 🔧 Configuration des permissions

Les permissions sont déjà configurées dans `capacitor.config.ts` :

### Android
Ajoutez dans `android/app/src/main/AndroidManifest.xml` :

```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.CHANGE_WIFI_STATE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

### iOS
Les permissions caméra sont déjà configurées dans `capacitor.config.ts`.

## 📖 Utilisation

1. **Lancer l'app** sur votre appareil mobile
2. **Autoriser** l'accès à la caméra
3. **Scanner** un QR code Wi-Fi ou **choisir une image**
4. **Connexion automatique** (Android) ou copie du mot de passe (iOS)

### Format du QR code Wi-Fi

```
WIFI:S:NomDuReseau;T:WPA;P:MotDePasse;H:false;;
```

- **S:** SSID (nom du réseau)
- **T:** Type de sécurité (`WPA`, `WEP`, `nopass`)
- **P:** Mot de passe
- **H:** Réseau caché (`true` ou `false`)

## 🏗️ Structure du projet

```
src/
├── components/
│   ├── QRScanner.tsx       # Composant de scan QR
│   ├── WifiResult.tsx      # Affichage des résultats
│   └── ui/                 # Composants UI (Shadcn)
├── lib/
│   ├── wifiParser.ts       # Parser de QR code Wi-Fi
│   └── wifiConnect.ts      # Logique de connexion
└── pages/
    └── Index.tsx           # Page principale
```

## 🎨 Design System

L'application utilise un design system basé sur **Tailwind CSS** avec des tokens sémantiques définis dans :

- `src/index.css` : Variables CSS (couleurs, espacements, etc.)
- `tailwind.config.ts` : Configuration Tailwind
- Mode sombre/clair automatique

## 🚀 Développement avec Hot Reload

Pour développer avec le hot reload (modifications en temps réel) :

1. L'app est déjà configurée pour pointer vers le sandbox Lovable
2. Les modifications faites dans Lovable apparaissent instantanément sur l'appareil
3. Pour développer localement, modifiez `capacitor.config.ts` :

```typescript
server: {
  url: 'http://YOUR_LOCAL_IP:5173',
  cleartext: true
}
```

Puis lancez `npm run dev` et `npx cap sync`.

## 📝 Notes importantes

- **Après chaque modification** : Exécutez `npx cap sync` si vous modifiez des fichiers natifs
- **Pour iOS** : Xcode est obligatoire (macOS uniquement)
- **Pour Android** : Android Studio est recommandé pour gérer les émulateurs
- **Connexion Wi-Fi iOS** : Apple ne permet pas la connexion automatique, l'app copie le mot de passe automatiquement

## 📄 Licence

**MIT License** - Libre d'utilisation, modification et distribution.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

- 🐛 Signaler des bugs
- 💡 Proposer de nouvelles fonctionnalités
- 🔧 Soumettre des pull requests

## 📞 Support

Pour toute question ou problème, consultez :

1. [Documentation Capacitor](https://capacitorjs.com/docs)
2. [Documentation Lovable](https://docs.lovable.dev/features/cloud)

## 🎯 Roadmap

- [ ] Publication sur Google Play Store
- [ ] Publication sur Apple App Store
- [ ] Historique des réseaux scannés
- [ ] Génération de QR codes Wi-Fi
- [ ] Support des QR codes WPA3
- [ ] Thèmes personnalisables
- [ ] Traductions multilingues

---

## Project info (Lovable)

**URL**: https://lovable.dev/projects/284f91e0-c0d7-41a3-bada-8344c74460e1

Pour éditer le code via Lovable, visitez simplement le lien ci-dessus.

**Développé avec ❤️ en utilisant React + Capacitor + Lovable**
