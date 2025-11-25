import { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { Wifi, Eye, EyeOff, QrCode, Download, Edit } from 'lucide-react';
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
  const qrCodeRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    if (!ssid.trim()) {
      toast({ title: "Erreur", description: "Veuillez entrer le nom du réseau (SSID)", variant: "destructive" });
      return;
    }
    if (security !== 'nopass' && !password.trim()) {
      toast({ title: "Erreur", description: "Veuillez entrer le mot de passe", variant: "destructive" });
      return;
    }
    setQrGenerated(true);
    toast({ title: "QR Code généré !", description: "Votre QR code Wi-Fi est prêt à être scanné" });
  };

  const handleDownload = () => {
    const svg = qrCodeRef.current?.querySelector('svg');
    if (!svg) {
      toast({ title: "Erreur", description: "Impossible de télécharger le QR code.", variant: "destructive" });
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = `wifi-qrcode-${ssid}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  const qrValue = qrGenerated ? generateWifiQrString(ssid, password, security) : '';

  return (
    <Card className="p-6 space-y-6 bg-card/50 backdrop-blur-sm border-primary/10 shadow-lg shadow-primary/5">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shadow-inner shadow-primary/10">
          <QrCode className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Générateur de QR Code Wi-Fi</h3>
          <p className="text-sm text-muted-foreground">Partagez votre connexion réseau en un scan</p>
        </div>
      </div>

      {qrGenerated && qrValue ? (
        <div className="space-y-4 text-center">
          <div ref={qrCodeRef} className="flex justify-center p-4 bg-white rounded-lg shadow-md">
            <QRCode value={qrValue} size={220} />
          </div>
          <p className='text-sm text-muted-foreground pt-2'>Scannez ce code pour vous connecter</p>
          <div className='flex gap-2 pt-2'>
             <Button onClick={() => setQrGenerated(false)} variant="outline" className="w-full">
              <Edit className="mr-2 h-4 w-4"/>
              Modifier
            </Button>
            <Button onClick={handleDownload} className="w-full">
              <Download className="mr-2 h-4 w-4"/>
              Télécharger
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="ssid" className="font-medium">Nom du réseau (SSID)</Label>
            <div className="relative">
              <Wifi className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input id="ssid" value={ssid} onChange={(e) => setSsid(e.target.value)} placeholder="Mon-Wifi" className="pl-10 h-11" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="security" className="font-medium">Type de sécurité</Label>
            <Select value={security} onValueChange={(v) => setSecurity(v as any)}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WPA">WPA/WPA2</SelectItem>
                <SelectItem value="WEP">WEP</SelectItem>
                <SelectItem value="nopass">Aucune (Ouvert)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {security !== 'nopass' && (
            <div className="space-y-2">
              <Label htmlFor="password" className="font-medium">Mot de passe</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="h-11 pr-12" />
                <Button type="button" variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)} className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          )}

          <Button onClick={handleGenerate} className="w-full h-12 text-base font-semibold mt-4" size="lg">
            <QrCode className="mr-2 h-5 w-5" />
            Générer le QR Code
          </Button>
        </div>
      )}
    </Card>
  );
};
