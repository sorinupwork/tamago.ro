'use client';

import { useState } from 'react';
import { Award, CheckCircle, Star, Zap } from 'lucide-react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { quests, rewards } from '@/lib/mockData';

type RewardsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentProgress: { posts: number; friends: number; points: number; verification: number };
  onClaimReward: (rewardId: string) => void;
  quests: typeof quests;
  rewards: typeof rewards;
  badges: string[];
};

export default function RewardsDialog({
  open,
  onOpenChange,
  currentProgress,
  onClaimReward,
  quests,
  rewards,
  badges,
}: RewardsDialogProps) {
  const [claimedRewards, setClaimedRewards] = useState<string[]>([]);

  const isClaimed = (rewardId: string) => {
    if (rewardId === 'verify-email') return badges.includes('Email Verificat');
    if (rewardId === 'badge-social') return badges.includes('Social');
    if (rewardId === 'badge-posts') return badges.includes('Creator');
    if (rewardId === 'badge-friends') return badges.includes('Prietenos');
    if (rewardId === 'badge-verification') return badges.includes('Verificat');
    if (rewardId === 'premium-access') return badges.includes('Premium');
    return claimedRewards.includes(rewardId);
  };

  const handleClaim = (rewardId: string) => {
    if (!claimedRewards.includes(rewardId)) {
      setClaimedRewards([...claimedRewards, rewardId]);
      onClaimReward(rewardId);
      toast.success('Recompensă revendicată!');
    }
  };

  const getProgressValue = (quest: typeof quests[0]) => {
    const current = quest.type === 'posts' ? currentProgress.posts :
      quest.type === 'friends' ? currentProgress.friends :
      quest.type === 'points' ? currentProgress.points :
      quest.type === 'verification' ? currentProgress.verification : 0;
    return Math.min((current / quest.total), 1) * 100;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Award className="h-6 w-6 mr-2 text-secondary" />
            Recompense și Quest-uri
          </DialogTitle>
          <DialogDescription>
            Completează quest-uri pentru a câștiga recompense speciale!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quests Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Star className="h-5 w-5 mr-2" />
              Quest-uri Active
            </h3>
            <div className="grid gap-4">
              {quests.map((quest) => (
                <Card key={quest.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{quest.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{quest.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progres</span>
                        <span>
                          {Math.min(
                            quest.type === 'posts' ? currentProgress.posts :
                            quest.type === 'friends' ? currentProgress.friends :
                            quest.type === 'points' ? currentProgress.points :
                            quest.type === 'verification' ? currentProgress.verification : 0,
                            quest.total
                          )}/{quest.total}
                        </span>
                      </div>
                      <Progress value={getProgressValue(quest)} className="h-2" />
                      <div className="flex justify-between items-center">
                        <Badge variant="secondary" className="text-xs">
                          Recompensă: {quest.reward}
                        </Badge>
                        {getProgressValue(quest) >= 100 && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Rewards Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2" />
              Recompense Disponibile
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {rewards.map((reward) => (
                <Card key={reward.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{reward.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{reward.description}</p>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => handleClaim(reward.id)}
                      disabled={isClaimed(reward.id) || (!reward.available && reward.id !== 'verify-email' && reward.id !== 'badge-social')}
                      className="w-full"
                      variant={isClaimed(reward.id) ? "secondary" : "default"}
                    >
                      {isClaimed(reward.id) ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Revendicat
                        </>
                      ) : reward.available ? (
                        'Revendică'
                      ) : (
                        'Nu Disponibil'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}