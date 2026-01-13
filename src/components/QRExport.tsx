import { QRCodeSVG } from 'qrcode.react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

type VPNProfile = {
  id: string;
  name: string;
  server: string;
  port: number;
  sshKey: string;
  vpnConfig?: string;
  protocol: 'SSH' | 'OpenVPN' | 'WireGuard';
  createdAt: Date;
};

type QRExportProps = {
  profile: VPNProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function QRExport({ profile, open, onOpenChange }: QRExportProps) {
  if (!profile) return null;

  const profileData = JSON.stringify({
    name: profile.name,
    server: profile.server,
    port: profile.port,
    protocol: profile.protocol,
    sshKey: profile.sshKey,
    vpnConfig: profile.vpnConfig
  });

  const handleDownload = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = `${profile.name}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Экспорт профиля</DialogTitle>
          <DialogDescription>
            Отсканируйте QR-код на другом устройстве для импорта
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="bg-white p-4 rounded-xl">
            <QRCodeSVG
              id="qr-code-svg"
              value={profileData}
              size={256}
              level="H"
              includeMargin={true}
            />
          </div>
          <div className="text-center space-y-1">
            <p className="font-semibold">{profile.name}</p>
            <p className="text-sm text-muted-foreground">{profile.server}</p>
          </div>
          <Button onClick={handleDownload} variant="outline" className="w-full">
            <Icon name="Download" className="mr-2" size={16} />
            Скачать QR-код
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
