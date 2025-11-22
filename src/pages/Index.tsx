import { useState } from 'react';
import { QRScanner } from '@/components/QRScanner';
import { WifiResult } from '@/components/WifiResult';
import { WifiInfo } from '@/lib/wifiParser';

const Index = () => {
  const [scannedWifi, setScannedWifi] = useState<WifiInfo | null>(null);

  const handleScanSuccess = (wifiInfo: WifiInfo) => {
    setScannedWifi(wifiInfo);
  };

  const handleBack = () => {
    setScannedWifi(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {scannedWifi ? (
          <WifiResult wifiInfo={scannedWifi} onBack={handleBack} />
        ) : (
          <QRScanner onScanSuccess={handleScanSuccess} />
        )}
      </div>
    </div>
  );
};

export default Index;
