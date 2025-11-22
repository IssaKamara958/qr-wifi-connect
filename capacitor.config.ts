import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.284f91e0c0d741a3bada8344c74460e1',
  appName: 'WiFi QR Scanner',
  webDir: 'dist',
  server: {
    url: 'https://284f91e0-c0d7-41a3-bada-8344c74460e1.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      ios: {
        NSCameraUsageDescription: 'Nous avons besoin de la caméra pour scanner les QR codes Wi-Fi'
      }
    },
    BarcodeScanner: {
      ios: {
        NSCameraUsageDescription: 'Nous avons besoin de la caméra pour scanner les QR codes Wi-Fi'
      }
    }
  }
};

export default config;
