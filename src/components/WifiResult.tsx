import { useState } from 'react';
import { Wifi, Lock, Eye, EyeOff, Copy, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { connectToWifi } from '@/lib/wifiConnect';
import type { WifiInfo } from '@/lib/wifiParser';

interface WifiResultProps {
  wifiInfo: WifiInfo;
  onBack: () => void;
}

export const WifiResult = ({ wifiInfo, onBack }: WifiResultProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const { toast } = useToast();

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copié !",
        description: `${label} copié dans le presse-papier`
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier",
        variant: "destructive"
      });
    }
  };

  const handleConnect = async () => {
    setConnecting(true);
    
    try {
      const result = await connectToWifi(wifiInfo);
      
      if (result.success) {
        toast({
          title: result.requiresManual ? "Instructions" : "Connexion en cours",
          description: result.message,
          duration: result.requiresManual ? 10000 : 5000
        });
      } else {
        toast({
          title: "Échec",
          description: result.message,
          variant: "destructive",
          duration: 7000
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se connecter au réseau",
        variant: "destructive"
      });
    } finally {
      setConnecting(false);
    }
  };

  const getSecurityLabel = (security: WifiInfo['security']) => {
    switch (security) {
      case 'WPA':
        return 'WPA/WPA2';
      case 'WEP':
        return 'WEP';
      case 'nopass':
        return 'Ouvert (sans mot de passe)';
      default:
        return security || 'Inconnu';
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Wifi className="w-10 h-10 text-primary" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">QR code scanné !</h2>
          <p className="text-sm text-muted-foreground">
            Informations du réseau Wi-Fi détectées
          </p>
        </div>

        <div className="space-y-4">
          {/* SSID */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Nom du réseau (SSID)
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-sm text-foreground break-all">
                {wifiInfo.ssid}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopy(wifiInfo.ssid, 'SSID')}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Password */}
          {wifiInfo.password && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Mot de passe
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-sm text-foreground break-all">
                  {showPassword ? wifiInfo.password : '••••••••'}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(wifiInfo.password, 'Mot de passe')}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}

          {/* Security */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Type de sécurité
            </label>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground">
                {getSecurityLabel(wifiInfo.security)}
              </span>
            </div>
          </div>

          {/* Hidden */}
          {wifiInfo.hidden && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-sm text-amber-700 dark:text-amber-300">
                ⚠️ Ce réseau est masqué (caché)
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3 pt-4">
          <Button 
            onClick={handleConnect}
            size="lg"
            className="w-full h-14 text-lg"
            disabled={connecting}
          >
            {connecting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connexion en cours...
              </>
            ) : (
              <>
                <Wifi className="mr-2 h-5 w-5" />
                Se connecter au réseau
              </>
            )}
          </Button>

          <Button 
            onClick={onBack}
            variant="outline"
            size="lg"
            className="w-full"
            disabled={connecting}
          >
            Scanner un autre QR code
          </Button>
        </div>
      </Card>

      <div className="text-center px-4">
        <p className="text-xs text-muted-foreground">
          <strong>Android :</strong> Connexion automatique si disponible
          <br />
          <strong>iOS :</strong> Le mot de passe est copié, connectez-vous manuellement
        </p>
      </div>
    </div>
  );
};
