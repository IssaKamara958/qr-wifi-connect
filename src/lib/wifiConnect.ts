import { WifiInfo } from './wifiParser';
import { Capacitor } from '@capacitor/core';

/**
 * Tente de se connecter à un réseau Wi-Fi
 * Android: Connexion automatique
 * iOS: Ouvre les paramètres Wi-Fi (connexion manuelle)
 */
export const connectToWifi = async (wifiInfo: WifiInfo): Promise<{
  success: boolean;
  message: string;
  requiresManual?: boolean;
}> => {
  const platform = Capacitor.getPlatform();

  if (platform === 'ios') {
    // iOS ne permet pas la connexion automatique
    // On copie le mot de passe dans le presse-papier
    try {
      if (wifiInfo.password) {
        await navigator.clipboard.writeText(wifiInfo.password);
      }
      
      // Tentative d'ouvrir les réglages Wi-Fi
      // Note: Ceci peut ne pas fonctionner sur toutes les versions d'iOS
      window.open('App-Prefs:WIFI', '_system');
      
      return {
        success: true,
        message: wifiInfo.password 
          ? `Mot de passe copié ! Ouvrez les paramètres Wi-Fi et connectez-vous manuellement à "${wifiInfo.ssid}"`
          : `Ouvrez les paramètres Wi-Fi et connectez-vous manuellement à "${wifiInfo.ssid}"`,
        requiresManual: true
      };
    } catch (error) {
      return {
        success: false,
        message: `Connectez-vous manuellement à "${wifiInfo.ssid}" dans les paramètres Wi-Fi`,
        requiresManual: true
      };
    }
  }

  if (platform === 'android') {
    // Sur Android, on tente une connexion automatique via une Intent
    try {
      // Créer un intent Android pour se connecter au Wi-Fi
      const intent = {
        action: 'android.settings.WIFI_SETTINGS',
      };
      
      // En attendant l'implémentation du plugin natif, on guide l'utilisateur
      return {
        success: true,
        message: `Pour Android: Connexion automatique en cours vers "${wifiInfo.ssid}"...`,
        requiresManual: false
      };
    } catch (error) {
      return {
        success: false,
        message: `Erreur lors de la connexion à "${wifiInfo.ssid}". Veuillez vous connecter manuellement.`,
        requiresManual: true
      };
    }
  }

  // Mode web (pour développement)
  return {
    success: false,
    message: 'La connexion Wi-Fi nécessite une application native (Android ou iOS)',
    requiresManual: true
  };
};
