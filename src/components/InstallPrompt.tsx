import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isIOSDevice = /iPhone|iPad|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    
    if (!isInStandaloneMode && !localStorage.getItem('installPromptDismissed')) {
      if (isIOSDevice) {
        setShowInstallPrompt(true);
      }
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('installPromptDismissed', 'true');
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-50 animate-fade-in max-w-md mx-auto">
      <Card className="border-2 border-primary shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Icon name="Download" className="text-primary-foreground" size={20} />
              </div>
              <div>
                <CardTitle className="text-base">Установить DominoVPN</CardTitle>
                <CardDescription className="text-xs">
                  {isIOS ? 'Добавьте на главный экран' : 'Установите приложение для быстрого доступа'}
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleDismiss}
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {isIOS ? (
            <div className="text-sm space-y-2">
              <p className="flex items-center gap-2">
                <Icon name="Share" size={16} />
                <span>Нажмите <strong>Поделиться</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <Icon name="Plus" size={16} />
                <span>Выберите <strong>На экран "Домой"</strong></span>
              </p>
            </div>
          ) : (
            <Button onClick={handleInstallClick} className="w-full">
              <Icon name="Download" className="mr-2" size={16} />
              Установить приложение
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
