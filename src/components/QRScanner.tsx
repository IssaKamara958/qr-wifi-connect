import { useState, useEffect } from 'react';
import { BarcodeScanner, Barcode } from '@capacitor-mlkit/barcode-scanning';
import { Camera, ImagePlus, X, ScanLine } from 'lucide-react';
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
    checkPermissions();
    return () => {
      stopScan();
    };
  }, []);

  const checkPermissions = async () => {
    try {
      const status = await BarcodeScanner.checkPermissions();
      setHasPermission(status.camera === 'granted');
    } catch (error) {
      console.error('Erreur vérification permission:', error);
      setHasPermission(false);
    }
  };

  const requestPermissions = async () => {
    try {
      const status = await BarcodeScanner.requestPermissions();
      setHasPermission(status.camera === 'granted');
      if (status.camera !== 'granted') {
        toast({ title: "Permission refusée", description: "Veuillez autoriser l'accès à la caméra dans les paramètres", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de demander la permission caméra", variant: "destructive" });
    }
  };

  const startScan = async () => {
    if (hasPermission === false) {
      await requestPermissions();
      return;
    }
    
    document.body.classList.add('scanner-active');
    setIsScanning(true);

    const listener = await BarcodeScanner.addListener(
      'barcodesScanned',
      async (event) => {
        if (event.barcodes.length > 0) {
          const barcode: Barcode = event.barcodes[0];

          await listener.remove();
          await stopScan();
          
          const qrData = barcode.displayValue;
          if (isWifiQrCode(qrData)) {
            const wifiInfo = parseWifiQr(qrData);
            if (wifiInfo) {
              onScanSuccess(wifiInfo);
            } else {
              toast({ title: "QR code invalide", description: "Le format du QR code Wi-Fi n'est pas reconnu", variant: "destructive" });
            }
          } else {
            toast({ title: "Pas un QR code Wi-Fi", description: "Scannez un QR code contenant des informations Wi-Fi", variant: "destructive" });
          }
        }
      },
    );

    try {
        await BarcodeScanner.startScan();
    } catch(error) {
        console.error('Erreur scan:', error);
        await stopScan();
        // TODO: find a better way to check for this error
        // if (error.name !== 'SCAN_CANCELED') {
        //     toast({ title: "Erreur de scan", description: "Impossible de démarrer le scanner. Essayez d'importer une image.", variant: "destructive" });
        // }
    }
  };

  const stopScan = async () => {
    await BarcodeScanner.removeAllListeners();
    await BarcodeScanner.stopScan();
    document.body.classList.remove('scanner-active');
    setIsScanning(false);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const html5QrCode = new Html5Qrcode("reader");
      const qrData = await html5QrCode.scanFile(file, true);
      if (isWifiQrCode(qrData)) {
        const wifiInfo = parseWifiQr(qrData);
        if (wifiInfo) {
          onScanSuccess(wifiInfo);
        } else {
          toast({ title: "QR code invalide", description: "Le format du QR code Wi-Fi n'est pas reconnu", variant: "destructive" });
        }
      } else {
        toast({ title: "Pas un QR code Wi-Fi", description: "L'image doit contenir un QR code Wi-Fi", variant: "destructive" });
      }
    } catch (error) {
      console.error('Erreur lecture image:', error);
      toast({ title: "Erreur", description: "Impossible de lire le QR code depuis l'image", variant: "destructive" });
    }
  };

  if (isScanning) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
        <div className="absolute top-4 right-4 z-20">
            <Button onClick={stopScan} variant="ghost" size="icon" className="text-white rounded-full bg-white/10 hover:bg-white/20">
              <X className="h-6 w-6" />
            </Button>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <div className="relative w-full max-w-xs aspect-square overflow-hidden rounded-2xl border-4 border-white/50 shadow-2xl shadow-primary/30">
             <div className='absolute top-0 left-0 w-full h-full animate-scan-line bg-gradient-to-b from-primary/50 to-transparent'/>
          </div>
          <p className="text-white text-lg font-semibold mt-8 text-center">Placez le QR code dans le cadre</p>
        </div>
      </div>
    );
  }

  return (
    <Card className="p-6 space-y-4 text-center bg-card/50 backdrop-blur-sm border-primary/10 shadow-lg shadow-primary/5">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shadow-inner shadow-primary/10">
            <Camera className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Scanner un QR Code</h3>
          <p className="text-sm text-muted-foreground">Utilisez votre caméra ou importez une image</p>
        </div>
      <div className="grid gap-3 pt-2">
        <Button onClick={startScan} size="lg" className="w-full h-14 text-base" disabled={hasPermission === false && 'ontouchstart' in window}>
          <Camera className="mr-2 h-5 w-5" />
          Scanner avec la caméra
        </Button>
        <div className="relative">
          <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" id="image-upload"/>
          <Button variant="secondary" size="lg" className="w-full h-14 text-base" asChild>
            <label htmlFor="image-upload" className="cursor-pointer w-full flex items-center justify-center">
              <ImagePlus className="mr-2 h-5 w-5" />
              Importer une image
            </label>
          </Button>
        </div>
      </div>
      {hasPermission === false && 'ontouchstart' in window && (
        <div className="text-center p-3 bg-destructive/10 rounded-lg text-sm text-destructive-foreground">
          <p>L'accès à la caméra est refusé.</p>
          <Button onClick={requestPermissions} variant="link" className="h-auto p-0 text-destructive-foreground underline">Réessayer</Button>
        </div>
      )}
      <div id="reader" className="hidden"></div>
    </Card>
  );
};
