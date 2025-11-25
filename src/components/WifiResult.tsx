import { useState, useEffect } from 'react';
import { Wifi, Lock, Eye, EyeOff, Copy, Check, Loader2, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { connectToWifi } from '@/lib/wifiConnect';
import type { WifiInfo } from '@/lib/wifiParser';
import QRCode from 'react-qr-code';
import { generateWifiQrString } from '@/lib/wifiInfo';

interface WifiResultProps {
  wifiInfo: WifiInfo | null;
  onBack: () => void;
}

export const WifiResult = ({ wifiInfo, onBack }: WifiResultProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
  const [connecting, setConnecting] = useState(false);
  const [savedWifi, setSavedWifi] = useState<WifiInfo | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (wifiInfo) {
      localStorage.setItem('lastWifi', JSON.stringify(wifiInfo));
      setSavedWifi(wifiInfo);
    } else {
      const lastWifi = localStorage.getItem('lastWifi');
      if (lastWifi) {
        setSavedWifi(JSON.parse(lastWifi));
      }
    }
  }, [wifiInfo]);

  const currentWifi = wifiInfo || savedWifi;

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates({ ...copiedStates, [label]: true });
      toast({ title: 'Copié !', description: `${label} a été copié dans le presse-papiers.` });
      setTimeout(() => setCopiedStates({ ...copiedStates, [label]: false }), 2500);
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible de copier le texte.', variant: 'destructive' });
    }
  };

  const handleConnect = async () => {
    if (!currentWifi) return;
    setConnecting(true);
    try {
      const result = await connectToWifi(currentWifi);
      if (result.success) {
        toast({ title: result.requiresManual ? 'Instructions' : 'Connexion en cours', description: result.message, duration: result.requiresManual ? 10000 : 5000 });
      } else {
        toast({ title: 'Échec', description: result.message, variant: 'destructive', duration: 7000 });
      }
    } catch (error) {
      toast({ title: 'Erreur', description: 'Une erreur est survenue lors de la tentative de connexion.', variant: 'destructive' });
    } finally {
      setConnecting(false);
    }
  };

  const handleForget = () => {
    localStorage.removeItem('lastWifi');
    setSavedWifi(null);
    onBack();
  };

  if (!currentWifi) {
    return null;
  }
  
  const qrValue = generateWifiQrString(currentWifi.ssid, currentWifi.password || '', currentWifi.security || 'nopass');

  const getSecurityLabel = (security: WifiInfo['security']) => {
    if (security === 'WPA') return 'WPA/WPA2';
    if (security === 'WEP') return 'WEP';
    if (security === 'nopass') return 'Réseau ouvert';
    return security || 'Inconnu';
  };

  const InfoRow = ({ label, value, onCopy, isSecret = false }: { label: string, value: string, onCopy?: () => void, isSecret?: boolean}) => {
    const [show, setShow] = isSecret ? useState(false) : [true, () => {}];
    const copyState = isSecret ? copiedStates['Password'] : copiedStates['SSID'];

    return (
      <div className="space-y-1.5">
        <Label className="font-medium text-muted-foreground">{label}</Label>
        <div className="flex items-center gap-2">
          <div className="flex-1 p-3 h-11 flex items-center bg-muted/50 rounded-lg font-mono text-sm text-foreground break-all">
            {isSecret && !show ? '••••••••' : value}
          </div>
          {isSecret && (
             <Button variant="ghost" size="icon" onClick={() => setShow(!show)} className="h-11 w-11">
                {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
             </Button>
          )}
          {onCopy && (
            <Button variant="ghost" size="icon" onClick={onCopy} className="h-11 w-11">
              {copyState ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card className="p-6 space-y-6 bg-card/50 backdrop-blur-sm border-primary/10 shadow-lg shadow-primary/5">
        <div className="flex flex-col items-center gap-3">
           <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shadow-inner shadow-primary/10">
            <Wifi className="w-9 h-9 text-primary" />
          </div>
          <div className='text-center'>
            <h2 className="text-xl font-bold text-foreground">{wifiInfo ? 'Réseau Détecté' : 'Dernier Réseau Connu'}</h2>
            <p className="text-muted-foreground">{wifiInfo ? 'Les informations du QR code ont été lues.' : 'Voici le dernier réseau auquel vous vous êtes connecté.'}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-center p-4 bg-white rounded-lg shadow-md">
            <QRCode value={qrValue} size={220} />
          </div>
          <InfoRow label="Nom du réseau (SSID)" value={currentWifi.ssid} onCopy={() => handleCopy(currentWifi.ssid, 'SSID')} />
          {currentWifi.password && (
            <InfoRow label="Mot de passe" value={currentWifi.password} onCopy={() => handleCopy(currentWifi.password, 'Password')} isSecret />
          )}

          <div className="space-y-1.5">
            <Label className="font-medium text-muted-foreground">Type de sécurité</Label>
            <div className="flex items-center gap-3 p-3 h-11 bg-muted/50 rounded-lg">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{getSecurityLabel(currentWifi.security)}</span>
            </div>
          </div>

          {currentWifi.hidden && (
            <div className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400"/>
              <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Ce réseau est masqué (invisible).</p>
            </div>
          )}
        </div>

        <div className="space-y-3 pt-2">
          {wifiInfo && (
            <Button onClick={handleConnect} size="lg" className="w-full h-14 text-base font-semibold" disabled={connecting}>
              {connecting ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Connexion...</> : <><Wifi className="mr-2 h-5 w-5" />Se Connecter au Réseau</>}
            </Button>
          )}
          <Button onClick={handleForget} variant="outline" size="lg" className="w-full h-12" disabled={connecting}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {wifiInfo ? 'Retourner au Scanner' : 'Scanner un nouveau QR Code'}
          </Button>
        </div>
      </Card>

       <div className="text-center px-4">
        <p className="text-xs text-muted-foreground/80">
          <strong>Android :</strong> La connexion est souvent automatique.
          <br />
          <strong>iOS :</strong> Le mot de passe est copié, vous devez vous connecter manuellement.
        </p>
      </div>
    </div>
  );
};
