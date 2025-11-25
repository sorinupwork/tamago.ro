'use client';

import { useState } from 'react';
import { Eye, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { updatePrivacySettings } from '@/actions/auth/actions';

type PrivacyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onActivityUpdate?: (activity: string) => void;
};

export default function PrivacyDialog({ open, onOpenChange, onActivityUpdate }: PrivacyDialogProps) {
  const [privacySettings, setPrivacySettings] = useState({
    emailPublic: false,
    phonePublic: false,
    locationPublic: false,
    profileVisible: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('emailPublic', privacySettings.emailPublic.toString());
      formData.append('phonePublic', privacySettings.phonePublic.toString());
      formData.append('locationPublic', privacySettings.locationPublic.toString());
      formData.append('profileVisible', privacySettings.profileVisible.toString());

      await updatePrivacySettings(formData);
      toast.success('Setările de confidențialitate au fost salvate!');
      onActivityUpdate?.(`Setări confidențialitate actualizate - ${new Date().toLocaleString()}`);
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Eșec la salvarea setărilor');
    } finally {
      setIsSaving(false);
    }
  };

  const updateSetting = (key: keyof typeof privacySettings, value: boolean) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Eye className="h-6 w-6 mr-2 text-green-500" />
            Confidențialitate
          </DialogTitle>
          <DialogDescription>
            Controlează ce informații sunt vizibile pentru alți utilizatori
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Vizibilitate Profil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label
                    htmlFor="profile-visible"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Profil vizibil pentru toți utilizatorii
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Dacă dezactivezi această opțiune, profilul tău va fi vizibil doar pentru prieteni.
                  </p>
                </div>
                <Switch
                  id="profile-visible"
                  checked={privacySettings.profileVisible}
                  onCheckedChange={(checked) => updateSetting('profileVisible', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Informații de Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <label
                    htmlFor="email-public"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Email public
                  </label>
                </div>
                <Switch
                  id="email-public"
                  checked={privacySettings.emailPublic}
                  onCheckedChange={(checked) => updateSetting('emailPublic', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <label
                    htmlFor="phone-public"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Telefon public
                  </label>
                </div>
                <Switch
                  id="phone-public"
                  checked={privacySettings.phonePublic}
                  onCheckedChange={(checked) => updateSetting('phonePublic', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <label
                    htmlFor="location-public"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Locație publică
                  </label>
                </div>
                <Switch
                  id="location-public"
                  checked={privacySettings.locationPublic}
                  onCheckedChange={(checked) => updateSetting('locationPublic', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Se salvează...' : 'Salvează Setările'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}