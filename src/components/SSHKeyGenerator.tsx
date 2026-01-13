import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

type SSHKeyGeneratorProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onKeysGenerated: (publicKey: string, privateKey: string) => void;
  hasSubscription: boolean;
};

export default function SSHKeyGenerator({ open, onOpenChange, onKeysGenerated, hasSubscription }: SSHKeyGeneratorProps) {
  const [keyType, setKeyType] = useState<'RSA' | 'ED25519'>('ED25519');
  const [generating, setGenerating] = useState(false);
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const { toast } = useToast();

  const generateKeys = async () => {
    if (!hasSubscription) {
      toast({
        title: 'Требуется подписка',
        description: 'Генерация SSH ключей доступна по подписке 150₽/мес',
        variant: 'destructive'
      });
      return;
    }

    setGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockPrivateKey = `-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACBK${Math.random().toString(36).substring(2, 15)}
-----END OPENSSH PRIVATE KEY-----`;

      const mockPublicKey = `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI${Math.random().toString(36).substring(2, 15)} dominovpn@generated`;

      setPrivateKey(mockPrivateKey);
      setPublicKey(mockPublicKey);
      
      toast({
        title: 'Ключи сгенерированы',
        description: 'SSH ключи успешно созданы'
      });
    } catch (error) {
      toast({
        title: 'Ошибка генерации',
        description: 'Не удалось сгенерировать ключи',
        variant: 'destructive'
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleUseKeys = () => {
    if (privateKey && publicKey) {
      onKeysGenerated(publicKey, privateKey);
      onOpenChange(false);
      setPrivateKey('');
      setPublicKey('');
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Скопировано',
      description: `${label} скопирован в буфер обмена`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Key" size={20} />
            Генератор SSH ключей
          </DialogTitle>
          <DialogDescription>
            {hasSubscription 
              ? 'Создайте пару SSH ключей для безопасного подключения'
              : 'Доступно с подпиской DominoVPN Premium (150₽/мес)'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {!hasSubscription && (
            <div className="p-4 bg-muted rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Icon name="Sparkles" size={16} />
                <span>DominoVPN Premium</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                <li>• Генерация SSH ключей</li>
                <li>• Неограниченное количество профилей</li>
                <li>• Приоритетная поддержка</li>
                <li>• Автоматическое резервное копирование</li>
              </ul>
              <p className="text-sm font-semibold">150₽ / месяц</p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Тип ключа</Label>
            <Select value={keyType} onValueChange={(v) => setKeyType(v as 'RSA' | 'ED25519')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ED25519">ED25519 (рекомендуется)</SelectItem>
                <SelectItem value="RSA">RSA 4096</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={generateKeys} 
            className="w-full" 
            disabled={generating || !hasSubscription}
          >
            {generating ? (
              <>
                <Icon name="Loader2" className="mr-2 animate-spin" size={16} />
                Генерация...
              </>
            ) : (
              <>
                <Icon name="Wand2" className="mr-2" size={16} />
                Сгенерировать ключи
              </>
            )}
          </Button>

          {privateKey && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Публичный ключ</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(publicKey, 'Публичный ключ')}
                  >
                    <Icon name="Copy" size={14} className="mr-1" />
                    Копировать
                  </Button>
                </div>
                <Textarea
                  value={publicKey}
                  readOnly
                  className="font-mono text-xs"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Приватный ключ</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(privateKey, 'Приватный ключ')}
                  >
                    <Icon name="Copy" size={14} className="mr-1" />
                    Копировать
                  </Button>
                </div>
                <Textarea
                  value={privateKey}
                  readOnly
                  className="font-mono text-xs"
                  rows={6}
                />
              </div>

              <Button onClick={handleUseKeys} className="w-full">
                <Icon name="Check" className="mr-2" size={16} />
                Использовать эти ключи
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
