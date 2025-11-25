import { useState, useEffect } from 'react';
import { QRScanner } from '@/components/QRScanner';
import { WifiResult } from '@/components/WifiResult';
import { WifiQRGenerator } from '@/components/WifiQRGenerator';
import { TechnicalGuide } from '@/components/TechnicalGuide';
import { WifiInfo } from '@/lib/wifiParser';
import { Button } from '@/components/ui/button';
import { BookCopy } from 'lucide-react';

const Index = () => {
  const [scannedWifi, setScannedWifi] = useState<WifiInfo | null>(null);
  const [lastWifi, setLastWifi] = useState<WifiInfo | null>(null);
  const [view, setView] = useState<'scanner' | 'result'>('scanner');
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const savedWifi = localStorage.getItem('lastWifi');
    if (savedWifi) {
      setLastWifi(JSON.parse(savedWifi));
      setView('result');
    }
  }, []);

  const handleScanSuccess = (wifiInfo: WifiInfo) => {
    setScannedWifi(wifiInfo);
    setLastWifi(wifiInfo);
    setView('result');
  };

  const handleBack = () => {
    setScannedWifi(null);
    setLastWifi(null);
    setView('scanner');
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 flex flex-col items-center">
        <header className="w-full max-w-md mb-6 text-center pt-8">
            <div className="flex justify-center items-center gap-3 mb-2">
                <img src="/logo.png" alt="Chackor Organisation Logo" className="w-10 h-10" />
                <h1 className="text-3xl font-bold text-foreground">Wi-Fi Connect</h1>
            </div>
            <p className="text-muted-foreground">Scannez, générez, et connectez-vous en toute simplicité.</p>
            <Button variant="link" className="text-primary mt-2" onClick={() => setShowGuide(true)}>
                <BookCopy className="mr-2 h-4 w-4"/>
                Ouvrir le guide
            </Button>
        </header>

        <main className="w-full max-w-md space-y-4 flex-grow">
          {view === 'result' ? (
            <WifiResult wifiInfo={scannedWifi} onBack={handleBack} />
          ) : (
            <>
              <WifiQRGenerator />
              <QRScanner onScanSuccess={handleScanSuccess} />
            </>
          )}
        </main>

        <footer className="w-full max-w-md text-center py-4">
            <div className="flex justify-center items-center gap-2">
                <img src="/logo.png" alt="" className="w-5 h-5"/>
                <span className="text-xs text-muted-foreground">Chackor Organisation</span>
            </div>
        </footer>
      </div>

      {showGuide && <TechnicalGuide onClose={() => setShowGuide(false)} />}
    </>
  );
};

export default Index;
