import { useState } from 'react';
import QRCode from 'react-qr-code';
import { Wifi, Eye, EyeOff, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateWifiQrString } from '@/lib/wifiInfo';
import { useToast } from '@/hooks/use-toast';

export const WifiQRGenerator = () => {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [security, setSecurity] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [showPassword, setShowPassword] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(false);
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!ssid.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer le nom du réseau (SSID)",
        variant: "destructive"
      });
      return;
    }

    if (security !== 'nopass' && !password.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer le mot de passe",
        variant: "destructive"
      });
      return;
    }

    setQrGenerated(true);
    toast({
      title: "QR Code généré !",
      description: "Votre QR code Wi-Fi est prêt à être scanné"
    });
  };

  const qrValue = qrGenerated ? generateWifiQrString(ssid, password, security) : '';

  return (
    <Card className="p-6 space-y-4 bg-card/50 backdrop-blur-sm border-primary/10">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <QrCode className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Générer un QR Code Wi-Fi</h3>
          <p className="text-sm text-muted-foreground">Partagez votre réseau facilement</p>
        </div>
      </div>

      {qrGenerated && qrValue ? (
        <div className="space-y-4">
          <div className="flex justify-center p-6 bg-white rounded-lg">
            <QRCode value={qrValue} size={200} />
          </div>
          <Button 
            onClick={() => setQrGenerated(false)} 
            variant="outline" 
            className="w-full"
          >
            Modifier les informations
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ssid" className="text-foreground">
              Nom du réseau (SSID)
            </Label>
            <div className="relative">
              <Wifi className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="ssid"
                value={ssid}
                onChange={(e) => setSsid(e.target.value)}
                placeholder="Mon-Wifi"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="security" className="text-foreground">
              Type de sécurité
            </Label>
            <Select value={security} onValueChange={(v) => setSecurity(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WPA">WPA/WPA2</SelectItem>
                <SelectItem value="WEP">WEP</SelectItem>
                <SelectItem value="nopass">Sans mot de passe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {security !== 'nopass' && (
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Mot de passe
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}

          <Button onClick={handleGenerate} className="w-full" size="lg">
            <QrCode className="mr-2 h-5 w-5" />
            Générer le QR Code
          </Button>
        </div>
      )}
    </Card>
  );
};
