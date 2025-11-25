import { X, Wifi, QrCode, ScanLine, Smartphone, BookCopy, Apple, Bot, MoreVertical, Share, PlusSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserGuideProps {
  onClose: () => void;
}

const AnimatedIcon = ({ children }: { children: React.ReactNode }) => (
    <div className="relative w-16 h-16 flex items-center justify-center rounded-lg bg-primary/10 shadow-inner shadow-primary/10">
        <style>{`
        @keyframes pulse-guide-icon {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.9; }
        }
        .animate-pulse-guide {
            animation: pulse-guide-icon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        `}</style>
        <div className="animate-pulse-guide">{children}</div>
    </div>
);

const ScreenshotPlaceholder = ({ description }: { description: string }) => (
    <div className="w-full max-w-xs mx-auto border-4 border-gray-700 rounded-2xl bg-gray-900 p-4 text-center shadow-lg">
        <p className="text-sm text-gray-300">{description}</p>
    </div>
);

export const TechnicalGuide = ({ onClose }: UserGuideProps) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-background border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <BookCopy className="w-6 h-6 text-primary" />
            Guide d'Utilisation
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* User Guide Sections */}
          <section className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <AnimatedIcon><ScanLine size={32} className="text-primary" /></AnimatedIcon>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2">1. Scannez pour vous Connecter</h3>
              <p className="text-muted-foreground mb-4">Pointez l'appareil photo vers un QR Code Wi-Fi. L'application lira instantanément les informations.</p>
              <ScreenshotPlaceholder description="[Capture d'écran du scanner]" />
            </div>
          </section>

          <section className="flex flex-col md:flex-row-reverse items-center gap-6">
            <div className="flex-shrink-0">
                <AnimatedIcon><QrCode size={32} className="text-primary" /></AnimatedIcon>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2">2. Générez pour Partager</h3>
              <p className="text-muted-foreground mb-4">Créez un QR code pour votre propre réseau Wi-Fi en remplissant les détails du réseau.</p>
              <ScreenshotPlaceholder description="[Capture d'écran du générateur de QR code]" />
            </div>
          </section>

          {/* PWA Installation Guide */}
          <section>
             <h3 className="font-bold text-lg mb-4 text-center flex items-center justify-center gap-2">
                <Smartphone className="w-6 h-6" />
                Installer l'application sur votre téléphone
             </h3>
             <p className="text-muted-foreground text-center mb-6">Pour un accès plus rapide, ajoutez cette application à votre écran d'accueil. Elle fonctionnera comme une application native !</p>
             <div className="grid md:grid-cols-2 gap-6">
                {/* Android Guide */}
                <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-md mb-3 flex items-center gap-2"><Bot className="w-5 h-5"/> Pour Android (avec Chrome)</h4>
                    <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                        <li>Ouvrez le menu du navigateur en cliquant sur <MoreVertical className="inline-block h-5 w-5 mx-1" />.</li>
                        <li>Appuyez sur <strong>"Installer l'application"</strong> ou <strong>"Ajouter à l'écran d'accueil"</strong>.</li>
                        <li>Suivez les instructions pour ajouter l'icône.</li>
                    </ol>
                </div>

                {/* iOS Guide */}
                 <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold text-md mb-3 flex items-center gap-2"><Apple className="w-5 h-5"/> Pour iOS (avec Safari)</h4>
                    <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                        <li>Appuyez sur l'icône de partage <Share className="inline-block h-5 w-5 mx-1" />.</li>
                        <li>Faites défiler vers le bas et sélectionnez <strong>"Sur l'écran d'accueil"</strong>.</li>
                        <li>Appuyez sur "Ajouter" pour confirmer.</li>
                    </ol>
                </div>
             </div>
          </section>
        </main>
      </div>
    </div>
  );
};
