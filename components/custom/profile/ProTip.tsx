import { useState } from 'react';
import { ChevronRight, Lightbulb } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { proTips } from '@/lib/mockData';

export default function ProTip() {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextTip = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentTipIndex((prev) => (prev + 1) % proTips.length);
      setIsAnimating(false);
    }, 300); // Match transition duration
  };

  return (
    <Card className="rounded-xl hover:shadow-lg transition-all duration-300 bg-linear-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
          Pro Sfaturi Tamago
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative min-h-[60px] flex items-center">
          <p
            className={`text-sm text-muted-foreground transition-all duration-300 ${
              isAnimating ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'
            }`}
          >
            {proTips[currentTipIndex]}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={nextTip}
          className="w-full hover:scale-105 transition-transform"
        >
          <ChevronRight className="h-4 w-4 mr-2" />
          Următorul Sfat
        </Button>
      </CardContent>
    </Card>
  );
}
