import { useState, useEffect } from 'react';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Camera, ImagePlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { parseWifiQr, isWifiQrCode } from '@/lib/wifiParser';
import type { WifiInfo } from '@/lib/wifiParser';

interface QRScannerProps {
  onScanSuccess: (wifiInfo: WifiInfo) => void;
}

export const QRScanner = ({ onScanSuccess }: QRScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkPermission();
    
    return () => {
      if (isScanning) {
        stopScan();
      }
    };
  }, []);

  const checkPermission = async () => {
    try {
      const status = await BarcodeScanner.checkPermission({ force: false });
      setHasPermission(status.granted);
    } catch (error) {
      console.error('Erreur vérification permission:', error);
      setHasPermission(false);
    }
  };

  const requestPermission = async () => {
    try {
      const status = await BarcodeScanner.checkPermission({ force: true });
      setHasPermission(status.granted);
      
      if (!status.granted) {
        toast({
          title: "Permission refusée",
          description: "Veuillez autoriser l'accès à la caméra dans les paramètres",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de demander la permission caméra",
        variant: "destructive"
      });
    }
  };

  const startScan = async () => {
    if (hasPermission === false) {
      await requestPermission();
      return;
    }

    try {
      // Préparer le scanner (rend le fond transparent)
      await BarcodeScanner.prepare();
      
      setIsScanning(true);
      document.body.classList.add('scanner-active');
      
      // Démarrer le scan
      const result = await BarcodeScanner.startScan();
      
      if (result.hasContent) {
        const qrData = result.content || '';
        
        if (isWifiQrCode(qrData)) {
          const wifiInfo = parseWifiQr(qrData);
          
          if (wifiInfo) {
            await stopScan();
            onScanSuccess(wifiInfo);
          } else {
            toast({
              title: "QR code invalide",
              description: "Le format du QR code Wi-Fi n'est pas reconnu",
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: "Pas un QR code Wi-Fi",
            description: "Scannez un QR code contenant des informations Wi-Fi",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Erreur scan:', error);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer le scanner",
        variant: "destructive"
      });
      await stopScan();
    }
  };

  const stopScan = async () => {
    try {
      await BarcodeScanner.stopScan();
      setIsScanning(false);
      document.body.classList.remove('scanner-active');
    } catch (error) {
      console.error('Erreur arrêt scan:', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Utiliser html5-qrcode pour lire depuis une image
      const { Html5Qrcode } = await import('html5-qrcode');
      const html5QrCode = new Html5Qrcode("reader");
      
      const qrData = await html5QrCode.scanFile(file, true);
      
      if (isWifiQrCode(qrData)) {
        const wifiInfo = parseWifiQr(qrData);
        
        if (wifiInfo) {
          onScanSuccess(wifiInfo);
        } else {
          toast({
            title: "QR code invalide",
            description: "Le format du QR code Wi-Fi n'est pas reconnu",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Pas un QR code Wi-Fi",
          description: "L'image doit contenir un QR code Wi-Fi",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Erreur lecture image:', error);
      toast({
        title: "Erreur",
        description: "Impossible de lire le QR code depuis l'image",
        variant: "destructive"
      });
    }
  };

  if (isScanning) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-xl font-semibold">Scannez le QR code Wi-Fi</h2>
            <Button 
              onClick={stopScan}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 h-64 border-4 border-primary rounded-lg" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-white text-center text-sm">
            Placez le QR code Wi-Fi dans le cadre
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Scanner un QR code Wi-Fi</h2>
        <p className="text-muted-foreground">
          Scannez ou importez une image contenant un QR code Wi-Fi
        </p>
      </div>

      <div className="grid gap-3">
        <Button 
          onClick={startScan}
          size="lg"
          className="w-full h-16 text-lg"
          disabled={hasPermission === false}
        >
          <Camera className="mr-2 h-6 w-6" />
          Scanner avec la caméra
        </Button>

        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="image-upload"
          />
          <Button 
            variant="outline"
            size="lg"
            className="w-full h-16 text-lg"
            asChild
          >
            <label htmlFor="image-upload" className="cursor-pointer">
              <ImagePlus className="mr-2 h-6 w-6" />
              Choisir une image
            </label>
          </Button>
        </div>
      </div>

      {hasPermission === false && (
        <div className="text-center p-4 bg-destructive/10 rounded-lg">
          <p className="text-sm text-destructive-foreground">
            Permission caméra refusée. Veuillez l'autoriser dans les paramètres.
          </p>
          <Button 
            onClick={requestPermission}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            Demander la permission
          </Button>
        </div>
      )}
      
      <div id="reader" className="hidden"></div>
    </Card>
  );
};
