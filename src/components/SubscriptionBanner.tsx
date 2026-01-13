import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

type SubscriptionBannerProps = {
  hasSubscription: boolean;
  trialEndsAt: Date | null;
  onSubscribe: () => void;
};

export default function SubscriptionBanner({ hasSubscription, trialEndsAt, onSubscribe }: SubscriptionBannerProps) {
  const [daysLeft, setDaysLeft] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (trialEndsAt) {
      const days = Math.ceil((trialEndsAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      setDaysLeft(days);
    }
  }, [trialEndsAt]);

  if (hasSubscription) return null;

  const isTrialActive = trialEndsAt && daysLeft > 0;

  return (
    <Card className="border-2 border-secondary animate-fade-in">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Icon name="Sparkles" size={20} className="text-secondary" />
              DominoVPN Premium
            </CardTitle>
            <CardDescription>
              {isTrialActive 
                ? `Пробный период: осталось ${daysLeft} ${daysLeft === 1 ? 'день' : daysLeft < 5 ? 'дня' : 'дней'}`
                : 'Получите полный доступ ко всем функциям'
              }
            </CardDescription>
          </div>
          {isTrialActive && (
            <Badge variant="secondary" className="gap-1">
              <Icon name="Clock" size={12} />
              Пробный период
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-start gap-2">
            <Icon name="Check" size={16} className="text-secondary mt-0.5" />
            <span className="text-sm">Генерация SSH ключей</span>
          </div>
          <div className="flex items-start gap-2">
            <Icon name="Check" size={16} className="text-secondary mt-0.5" />
            <span className="text-sm">Безлимит профилей</span>
          </div>
          <div className="flex items-start gap-2">
            <Icon name="Check" size={16} className="text-secondary mt-0.5" />
            <span className="text-sm">QR-код экспорт/импорт</span>
          </div>
          <div className="flex items-start gap-2">
            <Icon name="Check" size={16} className="text-secondary mt-0.5" />
            <span className="text-sm">Приоритетная поддержка</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="text-2xl font-bold">150₽</p>
            <p className="text-xs text-muted-foreground">в месяц</p>
          </div>
          <Button onClick={onSubscribe} size="lg" className="gap-2">
            <Icon name="CreditCard" size={16} />
            {isTrialActive ? 'Продлить подписку' : 'Оформить подписку'}
          </Button>
        </div>

        {!isTrialActive && (
          <p className="text-xs text-center text-muted-foreground">
            Первый месяц бесплатно, затем 150₽/мес
          </p>
        )}
      </CardContent>
    </Card>
  );
}
