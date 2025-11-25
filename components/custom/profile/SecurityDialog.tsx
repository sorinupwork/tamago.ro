'use client';

import { useState } from 'react';
import { Shield, Key } from 'lucide-react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { changePassword } from '@/actions/auth/actions';

type SecurityDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onActivityUpdate?: (activity: string) => void;
};

export default function SecurityDialog({ open, onOpenChange, onActivityUpdate }: SecurityDialogProps) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Toate câmpurile sunt obligatorii');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Parolele nu se potrivesc');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Parola nouă trebuie să aibă cel puțin 8 caractere');
      return;
    }

    setIsChangingPassword(true);
    try {
      const formData = new FormData();
      formData.append('currentPassword', currentPassword);
      formData.append('newPassword', newPassword);

      await changePassword(formData);
      toast.success('Parola a fost schimbată cu succes!');
      onActivityUpdate?.(`Parola schimbată - ${new Date().toLocaleString()}`);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Eșec la schimbarea parolei');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleTwoFactorToggle = async (enabled: boolean) => {
    try {
      // TODO: Implement 2FA API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setTwoFactorEnabled(enabled);
      const action = enabled ? 'activată' : 'dezactivată';
      toast.success(`Autentificarea în doi pași ${action}`);
      onActivityUpdate?.(`2FA ${action} - ${new Date().toLocaleString()}`);
    } catch {
      toast.error('Eșec la actualizarea setărilor de securitate');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Shield className="h-6 w-6 mr-2 text-blue-500" />
            Securitate Cont
          </DialogTitle>
          <DialogDescription>
            Gestionează setările de securitate ale contului tău
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Autentificare în Doi Pași
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Activează 2FA</p>
                  <p className="text-sm text-muted-foreground">
                    Adaugă un nivel suplimentar de securitate contului tău
                  </p>
                </div>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={handleTwoFactorToggle}
                />
              </div>
              {twoFactorEnabled && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    2FA este activat. Vei primi un cod de verificare la fiecare autentificare.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Key className="h-5 w-5 mr-2" />
                Schimbă Parola
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Parola Actuală</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Introdu parola actuală"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Parola Nouă</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Introdu parola nouă"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmă Parola Nouă</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmă parola nouă"
                />
              </div>
              <Button
                onClick={handlePasswordChange}
                disabled={isChangingPassword}
                className="w-full"
              >
                {isChangingPassword ? 'Se schimbă...' : 'Schimbă Parola'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}