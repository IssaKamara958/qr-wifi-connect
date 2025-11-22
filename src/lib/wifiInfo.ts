import { Capacitor } from '@capacitor/core';

/**
 * Récupère le SSID du réseau Wi-Fi actuel
 * Note: Le mot de passe ne peut pas être récupéré pour des raisons de sécurité
 */
export const getCurrentWifiSSID = async (): Promise<string | null> => {
  const platform = Capacitor.getPlatform();
  
  if (platform === 'web') {
    return null;
  }

  // Pour Android/iOS, on utiliserait un plugin natif
  // En attendant, on retourne null et l'utilisateur devra entrer le SSID manuellement
  try {
    // Cette partie nécessiterait un plugin Capacitor personnalisé
    // Pour l'instant, on laisse l'utilisateur entrer le SSID
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération du SSID:', error);
    return null;
  }
};

/**
 * Génère la chaîne de QR code Wi-Fi au format standard
 */
export const generateWifiQrString = (
  ssid: string,
  password: string,
  security: 'WPA' | 'WEP' | 'nopass' = 'WPA',
  hidden: boolean = false
): string => {
  // Échapper les caractères spéciaux
  const escapedSSID = ssid
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/:/g, '\\:')
    .replace(/,/g, '\\,')
    .replace(/"/g, '\\"');
    
  const escapedPassword = password
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/:/g, '\\:')
    .replace(/,/g, '\\,')
    .replace(/"/g, '\\"');

  return `WIFI:S:${escapedSSID};T:${security};P:${escapedPassword};H:${hidden};;`;
};
