import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

type VPNProfile = {
  id: string;
  name: string;
  server: string;
  port: number;
  sshKey: string;
  createdAt: Date;
};

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

export default function Index() {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [profiles, setProfiles] = useState<VPNProfile[]>([
    {
      id: '1',
      name: 'Офисный VPN',
      server: 'vpn.company.com',
      port: 22,
      sshKey: '-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQ...',
      createdAt: new Date('2024-01-15')
    }
  ]);
  const [selectedProfile, setSelectedProfile] = useState<VPNProfile | null>(profiles[0]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: '',
    server: '',
    port: 22,
    sshKey: ''
  });
  const { toast } = useToast();

  const handleConnect = () => {
    if (!selectedProfile) {
      toast({
        title: 'Выберите профиль',
        description: 'Сначала выберите VPN профиль для подключения',
        variant: 'destructive'
      });
      return;
    }

    setStatus('connecting');
    setTimeout(() => {
      setStatus('connected');
      toast({
        title: 'Подключено',
        description: `Успешное подключение к ${selectedProfile.name}`
      });
    }, 2000);
  };

  const handleDisconnect = () => {
    setStatus('disconnected');
    toast({
      title: 'Отключено',
      description: 'VPN соединение разорвано'
    });
  };

  const handleAddProfile = () => {
    if (!newProfile.name || !newProfile.server || !newProfile.sshKey) {
      toast({
        title: 'Заполните все поля',
        description: 'Все поля обязательны для создания профиля',
        variant: 'destructive'
      });
      return;
    }

    const profile: VPNProfile = {
      id: Date.now().toString(),
      name: newProfile.name,
      server: newProfile.server,
      port: newProfile.port,
      sshKey: newProfile.sshKey,
      createdAt: new Date()
    };

    setProfiles([...profiles, profile]);
    setIsAddDialogOpen(false);
    setNewProfile({ name: '', server: '', port: 22, sshKey: '' });
    toast({
      title: 'Профиль создан',
      description: `${profile.name} успешно добавлен`
    });
  };

  const handleDeleteProfile = (id: string) => {
    setProfiles(profiles.filter(p => p.id !== id));
    if (selectedProfile?.id === id) {
      setSelectedProfile(profiles[0] || null);
      setStatus('disconnected');
    }
    toast({
      title: 'Профиль удалён',
      description: 'VPN профиль успешно удалён'
    });
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'bg-primary';
      case 'connecting':
        return 'bg-secondary';
      default:
        return 'bg-muted';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Подключено';
      case 'connecting':
        return 'Подключение...';
      default:
        return 'Отключено';
    }
  };

  return (
    <div className="min-h-screen bg-background dark">
      <div className="container max-w-4xl mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
              <Icon name="Shield" className="text-primary-foreground" size={24} />
            </div>
            <h1 className="text-3xl font-bold">VPN Manager</h1>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-xl">
                <Icon name="Plus" size={20} />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Новый VPN профиль</DialogTitle>
                <DialogDescription>
                  Добавьте новый профиль с SSH ключом для подключения
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Название</Label>
                  <Input
                    id="name"
                    placeholder="Офисный VPN"
                    value={newProfile.name}
                    onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="server">Адрес сервера</Label>
                  <Input
                    id="server"
                    placeholder="vpn.company.com"
                    value={newProfile.server}
                    onChange={(e) => setNewProfile({ ...newProfile, server: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Порт</Label>
                  <Input
                    id="port"
                    type="number"
                    placeholder="22"
                    value={newProfile.port}
                    onChange={(e) => setNewProfile({ ...newProfile, port: parseInt(e.target.value) || 22 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sshKey">SSH ключ</Label>
                  <Textarea
                    id="sshKey"
                    placeholder="-----BEGIN RSA PRIVATE KEY-----&#10;MIIEpAIBAAKCAQ..."
                    className="font-mono text-xs min-h-[120px]"
                    value={newProfile.sshKey}
                    onChange={(e) => setNewProfile({ ...newProfile, sshKey: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleAddProfile} className="w-full">
                Создать профиль
              </Button>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-2 animate-scale-in">
          <CardContent className="pt-12 pb-12">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className={`w-32 h-32 rounded-full ${getStatusColor()} flex items-center justify-center transition-all duration-300 ${status === 'connected' ? 'shadow-lg shadow-primary/50' : ''}`}>
                  <Icon 
                    name={status === 'connected' ? 'ShieldCheck' : status === 'connecting' ? 'Loader2' : 'ShieldOff'} 
                    className={`text-white ${status === 'connecting' ? 'animate-spin' : ''}`} 
                    size={48} 
                  />
                </div>
                {status === 'connected' && (
                  <div className="absolute inset-0 w-32 h-32 rounded-full bg-primary animate-pulse-glow opacity-30"></div>
                )}
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold">{getStatusText()}</h2>
                {selectedProfile && status !== 'disconnected' && (
                  <p className="text-muted-foreground">{selectedProfile.name}</p>
                )}
              </div>

              {status === 'disconnected' ? (
                <Button 
                  size="lg" 
                  onClick={handleConnect} 
                  className="px-12 rounded-full text-lg"
                  disabled={!selectedProfile}
                >
                  <Icon name="Power" className="mr-2" size={20} />
                  Подключить
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  variant="destructive"
                  onClick={handleDisconnect} 
                  className="px-12 rounded-full text-lg"
                  disabled={status === 'connecting'}
                >
                  <Icon name="PowerOff" className="mr-2" size={20} />
                  Отключить
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">VPN Профили</h3>
            <Badge variant="secondary">{profiles.length}</Badge>
          </div>

          <div className="grid gap-3">
            {profiles.map((profile) => (
              <Card 
                key={profile.id}
                className={`cursor-pointer transition-all hover:border-primary ${selectedProfile?.id === profile.id ? 'border-primary border-2' : ''}`}
                onClick={() => {
                  if (status === 'disconnected') {
                    setSelectedProfile(profile);
                  }
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Icon name="Server" size={18} />
                        {profile.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1">
                          <Icon name="Globe" size={14} />
                          {profile.server}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="Zap" size={14} />
                          Port {profile.port}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedProfile?.id === profile.id && (
                        <Badge variant="default" className="gap-1">
                          <Icon name="Check" size={12} />
                          Активен
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProfile(profile.id);
                        }}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon name="Key" size={14} />
                    <span className="font-mono truncate">
                      {profile.sshKey.substring(0, 40)}...
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
