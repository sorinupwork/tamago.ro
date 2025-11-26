'use client';

import { useState } from 'react';
import { CheckCircle, Mail, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type VerificationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEmailVerified: boolean;
  userEmail: string;
  onVerificationRequest: () => Promise<void>;
};

export default function VerificationDialog({
  open,
  onOpenChange,
  isEmailVerified,
  userEmail,
  onVerificationRequest,
}: VerificationDialogProps) {
  const [isRequesting, setIsRequesting] = useState(false);

  const handleVerificationRequest = async () => {
    setIsRequesting(true);
    try {
      await onVerificationRequest();
      toast.success('Email de verificare trimis! Verifică căsuța de email.');
    } catch {
      toast.error('Eșec la trimiterea email-ului de verificare');
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center'>
            <CheckCircle className='h-6 w-6 mr-2 text-purple-500' />
            Verificare Cont
          </DialogTitle>
          <DialogDescription>Verifică-ți contul pentru a crește încrederea și a debloca funcții suplimentare</DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Email Verification */}
          <Card>
            <CardHeader>
              <CardTitle className='text-base flex items-center'>
                <Mail className='h-5 w-5 mr-2' />
                Verificare Email
                <Badge variant={isEmailVerified ? 'default' : 'destructive'} className='ml-auto'>
                  {isEmailVerified ? 'Verificat' : 'Neverificat'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>{userEmail}</p>
                  <p className='text-sm text-muted-foreground'>
                    {isEmailVerified ? 'Adresa de email este verificată.' : 'Verifică-ți adresa de email pentru securitate crescută.'}
                  </p>
                </div>
                {isEmailVerified ? (
                  <CheckCircle className='h-6 w-6 text-green-500' />
                ) : (
                  <AlertTriangle className='h-6 w-6 text-yellow-500' />
                )}
              </div>

              {!isEmailVerified && (
                <div className='space-y-3'>
                  <div className='p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800'>
                    <div className='flex items-start'>
                      <AlertTriangle className='h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 shrink-0' />
                      <div>
                        <p className='text-sm font-medium text-yellow-800 dark:text-yellow-200'>Email neverificat</p>
                        <p className='text-sm text-yellow-700 dark:text-yellow-300 mt-1'>
                          Pentru a putea folosi toate funcțiile platformei, trebuie să verifici adresa de email.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleVerificationRequest} disabled={isRequesting} className='w-full'>
                    {isRequesting ? 'Se trimite...' : 'Trimite Email de Verificare'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Future: Social Verification */}
          <Card>
            <CardHeader>
              <CardTitle className='text-base flex items-center'>
                <CheckCircle className='h-5 w-5 mr-2' />
                Verificare Socială
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground'>
                Conectează-ți conturile sociale pentru verificare suplimentară. Această funcție va fi disponibilă în curând.
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
