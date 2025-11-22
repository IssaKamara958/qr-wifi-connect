export interface WifiInfo {
  ssid: string;
  password: string;
  security: 'WPA' | 'WEP' | 'nopass' | '';
  hidden: boolean;
}

/**
 * Parse un QR code Wi-Fi au format standard : WIFI:S:SSID;T:WPA;P:password;H:false;;
 */
export const parseWifiQr = (data: string): WifiInfo | null => {
  if (!data.startsWith('WIFI:')) {
    return null;
  }

  // Enlève "WIFI:" au début et ";;" à la fin
  const content = data.slice(5);
  const endIndex = content.lastIndexOf(';;');
  const fields = content.slice(0, endIndex > 0 ? endIndex : content.length).split(';');

  let ssid = '';
  let password = '';
  let security: WifiInfo['security'] = 'nopass';
  let hidden = false;

  fields.forEach(field => {
    const colonIndex = field.indexOf(':');
    if (colonIndex === -1) return;

    const key = field.slice(0, colonIndex);
    const value = field.slice(colonIndex + 1);

    switch (key) {
      case 'S':
        // Décoder les échappements
        ssid = value
          .replace(/\\;/g, ';')
          .replace(/\\:/g, ':')
          .replace(/\\\\/g, '\\')
          .replace(/\\,/g, ',')
          .replace(/\\"/g, '"');
        break;
      case 'P':
        password = value
          .replace(/\\;/g, ';')
          .replace(/\\:/g, ':')
          .replace(/\\\\/g, '\\')
          .replace(/\\,/g, ',')
          .replace(/\\"/g, '"');
        break;
      case 'T':
        security = value as WifiInfo['security'];
        break;
      case 'H':
        hidden = value === 'true';
        break;
    }
  });

  if (!ssid) {
    return null;
  }

  return { ssid, password, security, hidden };
};

/**
 * Vérifie si une chaîne ressemble à un QR code Wi-Fi valide
 */
export const isWifiQrCode = (data: string): boolean => {
  return data.startsWith('WIFI:') && data.includes('S:');
};
