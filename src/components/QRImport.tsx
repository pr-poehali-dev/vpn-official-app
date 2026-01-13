import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

type QRImportProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (profile: any) => void;
};

export default function QRImport({ open, onOpenChange, onImport }: QRImportProps) {
  const [scanning, setScanning] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);

          try {
            const { default: jsQR } = await import('jsqr');
            const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
            if (!imageData) throw new Error('Не удалось прочитать изображение');

            const code = jsQR(imageData.data, imageData.width, imageData.height);
            if (code) {
              const profileData = JSON.parse(code.data);
              onImport(profileData);
              onOpenChange(false);
              toast({
                title: 'Профиль импортирован',
                description: `${profileData.name} успешно добавлен`
              });
            } else {
              throw new Error('QR-код не найден');
            }
          } catch (error) {
            toast({
              title: 'Ошибка импорта',
              description: 'Не удалось прочитать QR-код',
              variant: 'destructive'
            });
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить файл',
        variant: 'destructive'
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Импорт профиля</DialogTitle>
          <DialogDescription>
            Загрузите QR-код профиля для импорта
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-full space-y-2">
              <Label htmlFor="qr-upload">Загрузить QR-код</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="qr-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Icon name="Upload" size={32} className="text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Нажмите для загрузки
                    </p>
                  </div>
                  <input
                    id="qr-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
