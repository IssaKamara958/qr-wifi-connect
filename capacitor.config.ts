import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // App ID valide pour Android et iOS (format reverse domain obligatoire)
  appId: 'com.chackororganisation.qrwificonnect',
  appName: 'Chackor Qr Code Wifi',
  webDir: 'dist',

  // Permissions caméra (nécessaires pour le Barcode Scanner)
  plugins: {
    // Plugin officiel @capacitor/camera (si tu l'utilises)
    Camera: {
      ios: {
        NSCameraUsageDescription: 'Cette application a besoin d’accéder à la caméra pour scanner les QR codes Wi-Fi.'
      }
    },
    // Plugin officiel ou MLKit (selon ce que tu utilises)
    BarcodeScanner: {
      ios: {
        NSCameraUsageDescription: 'Cette application a besoin d’accéder à la caméra pour scanner les QR codes Wi-Fi.'
      }
    }
  }
};

export default config;