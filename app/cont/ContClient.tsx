'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import LoginForm from '@/components/custom/form/auth/LoginForm';
import SignupForm from '@/components/custom/form/auth/SignupForm';
import SocialMediaForm from '@/components/custom/form/auth/SocialMediaForm';
import AuthInfo from '@/components/custom/form/auth/AuthInfo';
import Image from 'next/image';

export default function ContClient() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup' | 'social'>('login');
  const [isLg, setIsLg] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateIsLg = () => setIsLg(window.innerWidth >= 1024);
    updateIsLg();
    window.addEventListener('resize', updateIsLg);
    return () => window.removeEventListener('resize', updateIsLg);
  }, []);

  useEffect(() => {
    const updateIsDark = () => setIsDark(document.documentElement.classList.contains('dark'));
    updateIsDark();
    // listen for theme changes
    const observer = new MutationObserver(updateIsDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const imageSrc = {
    login:
      'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bG9naW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=80&w=2000',
    signup:
      'https://images.unsplash.com/photo-1529539795054-3c162aab037a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bG9naW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=80&w=2000',
    social:
      'https://images.unsplash.com/photo-1603145733146-ae562a55031e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c29jaWFsJTIwbWVkaWF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=80&w=2000',
  }[activeTab];

  return (
    <div className='relative grid min-h-screen lg:grid-cols-2'>
      {!isLg && (
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: isDark ? 'brightness(0.2) grayscale(1)' : 'none',
            zIndex: -1,
          }}
        />
      )}
      <div
        className={`flex flex-1 flex-col items-center justify-center p-4 lg:p-0 lg:bg-transparent ${
          isDark ? 'bg-black/50' : 'bg-white/80'
        }`}
      >
        <div className='w-full h-full overflow-y-auto'>
          <Tabs
            defaultValue='login'
            onValueChange={(value) => setActiveTab(value as 'login' | 'signup' | 'social')}
            className='w-full h-full flex flex-col'
          >
            <TabsList className='grid w-full grid-cols-3 h-12 p-1 rounded-none'>
              <TabsTrigger value='login' className='text-base'>
                Autentificare
              </TabsTrigger>
              <TabsTrigger value='signup' className='text-base'>
                Înregistrare
              </TabsTrigger>
              <TabsTrigger value='social' className='text-base'>
                Social Media
              </TabsTrigger>
            </TabsList>
            <TabsContent value='login' className='flex-1 overflow-y-auto space-y-6 max-w-md mx-auto'>
              <LoginForm />
              <AuthInfo
                whyTitle='De ce să te autentifici?'
                whyDescription='Accesează funcții personalizate ale platformei Tamago, gestionează-ți contul și bucură-te de o experiență fără întreruperi. Descoperă instrumente pentru productivitate, învățare și conectare cu comunitatea. Autentificarea îți permite să salvezi progresul, să colaborezi cu alții și să primești recomandări bazate pe preferințele tale.'
                whyList={[
                  'Acces securizat la datele tale personale și proiecte salvate',
                  'Urmărește progresul și realizările în timp real cu statistici detaliate',
                  'Conectează-te cu alți utilizatori pentru colaborare și schimb de idei',
                  'Primește notificări personalizate despre actualizări și evenimente noi',
                  'Accesează resurse exclusive pentru dezvoltare personală și profesională',
                  'Beneficiază de backup automat al datelor pentru siguranță maximă',
                ]}
                howTitle='Cum să începi'
                howList={[
                  'Introdu email-ul și parola asociate contului tău existent',
                  'Apasă "Autentificare" pentru a accesa panoul principal personalizat',
                  'Explorează funcțiile platformei și personalizează-ți setările',
                  'Participă în comunitate pentru sfaturi, idei noi și suport',
                  'Verifică notificările pentru a rămâne la curent cu noutățile',
                ]}
                benefitsTitle='Beneficii'
                benefitsDescription='După autentificare, vei beneficia de acces nelimitat la funcții avansate, recompense pentru activitate și o comunitate susținătoare. Crește-ți productivitatea și atinge obiectivele cu ușurință.'
                benefitsList={[
                  'Recompense pentru milestones atinse în proiecte',
                  'Acces la badge-uri și certificate pentru realizări',
                  'Prioritate în evenimente exclusive și workshop-uri',
                  'Oportunități de networking cu profesioniști din domeniu',
                  'Reduceri pentru upgrade-uri și servicii premium',
                  'Recunoaștere în comunitate pentru contribuții valoroase',
                ]}
              />
            </TabsContent>
            <TabsContent value='signup' className='flex-1 overflow-y-auto space-y-6 max-w-md mx-auto'>
              <SignupForm />
              <AuthInfo
                whyTitle='De ce să te înregistrezi?'
                whyDescription='Alătură-te comunității Tamago pentru a debloca funcții exclusive, a primi recomandări personalizate și a crește alături de noi. Platforma oferă instrumente pentru învățare continuă și networking, ajutându-te să îți dezvolți abilitățile și să construiești relații valoroase.'
                whyList={[
                  'Acces gratuit la instrumente premium pentru productivitate și organizare',
                  'Construiește-ți profilul și rețeaua profesională pentru oportunități',
                  'Primește actualizări și notificări despre evenimente și workshop-uri',
                  'Participă în proiecte colaborative cu echipe din întreaga lume',
                  'Beneficiază de suport comunitar pentru întrebări și feedback',
                  'Accesează cursuri și resurse pentru dezvoltare continuă',
                ]}
                howTitle='Cum să începi'
                howList={[
                  'Completează numele, email-ul și parola pentru a crea cont nou',
                  'Apasă "Înregistrare" pentru a crea contul și verifica email-ul primit',
                  'Completează profilul cu detalii pentru recomandări personalizate',
                  'Începe explorarea platformei și alătură-te comunității active',
                  'Participă în primul tău proiect pentru a te familiariza cu funcțiile',
                ]}
                benefitsTitle='Beneficii'
                benefitsDescription='Înregistrarea aduce beneficii imediate precum acces la resurse gratuite, recompense pentru participare și oportunități de creștere. Devino parte a unei rețele globale de inovatori.'
                benefitsList={[
                  'Bonus de bun venit cu resurse exclusive gratuite',
                  'Puncte de loialitate pentru fiecare activitate completată',
                  'Acces la grupuri private pentru discuții avansate',
                  'Șanse de a câștiga premii în concursuri lunare',
                  'Mentorat de la membri experiențați ai comunității',
                  'Certificate digitale pentru cursuri finalizate',
                ]}
              />
            </TabsContent>
            <TabsContent value='social' className='flex-1 overflow-y-auto space-y-6 max-w-md mx-auto'>
              <SocialMediaForm />
              <AuthInfo
                whyTitle='De ce să te autentifici cu social media?'
                whyDescription='Autentificarea rapidă și sigură îți permite să accesezi platforma Tamago fără a crea parole suplimentare, oferind o experiență fluidă și securizată prin OAuth. Integrarea cu rețelele sociale facilitează conectarea și partajarea.'
                whyList={[
                  'Conectare instantanee fără gestionarea parolelor complexe',
                  'Securitate îmbunătățită prin standarde OAuth recunoscute global',
                  'Integrare ușoară cu profilurile existente pentru networking rapid',
                  'Acces rapid la funcții sociale ale platformei pentru colaborare',
                  'Sincronizare automată cu datele din rețelele sociale pentru comoditate',
                  'Posibilitatea de a invita prieteni și a extinde comunitatea',
                ]}
                howTitle='Cum să începi'
                howList={[
                  'Alege platforma preferată (Google, Instagram sau Facebook) din opțiuni',
                  'Autorizează accesul când este solicitat de Tamago pentru securitate',
                  'Bucură-te de acces imediat la cont și funcții fără întârzieri',
                  'Explorează opțiunile de conectare cu alți utilizatori din rețeaua ta',
                  'Partajează progresul tău pentru a motiva comunitatea',
                ]}
                benefitsTitle='Beneficii'
                benefitsDescription='Autentificarea socială aduce beneficii precum conectare rapidă cu prieteni, recompense pentru partajare și o experiență socială îmbogățită. Extinde-ți rețeaua și câștigă recunoaștere.'
                benefitsList={[
                  'Invitații bonus pentru fiecare prieten adus în platformă',
                  'Recompense pentru postări și interacțiuni sociale',
                  'Acces la evenimente exclusive pentru utilizatori activi',
                  'Badge-uri sociale pentru conexiuni extinse',
                  'Prioritate în matchmaking pentru proiecte colaborative',
                  'Șanse crescute de a fi featured în comunitate',
                ]}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className='hidden lg:block h-full relative'>
        <Image fill src={imageSrc} alt='Image' className='object-cover object-center dark:brightness-[0.2] dark:grayscale' />
      </div>
    </div>
  );
}
