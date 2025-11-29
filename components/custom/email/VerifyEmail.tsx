import { Button } from '@/components/ui/button';

type VerifyEmailProps = {
  verificationUrl: string;
};

export function VerifyEmail({ verificationUrl }: VerifyEmailProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ color: '#333', textAlign: 'center' }}>Verifică-ți Email-ul</h1>
      <p style={{ color: '#666', lineHeight: '1.6' }}>
        Bun venit pe Tamago! Pentru a finaliza înregistrarea și a avea acces complet la platformă, te rugăm să verifici adresa de email
        făcând clic pe butonul de mai jos.
      </p>
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <Button
          asChild
          style={{ backgroundColor: '#3b82f6', color: 'white', padding: '12px 24px', textDecoration: 'none', borderRadius: '6px' }}
        >
          <a href={verificationUrl}>Verifică Email-ul</a>
        </Button>
      </div>
      <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
        Dacă butonul nu funcționează, poți copia și lipi următorul link în browser:
        <br />
        <a href={verificationUrl} style={{ color: '#3b82f6' }}>
          {verificationUrl}
        </a>
      </p>
      <p style={{ color: '#999', fontSize: '12px', marginTop: '30px' }}>Dacă nu te-ai înregistrat pe Tamago, ignoră acest email.</p>
    </div>
  );
}
