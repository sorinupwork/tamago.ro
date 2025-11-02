import LoginForm from '@/components/custom/form/LoginForm';
import SignupForm from '@/components/custom/form/SignupForm';

export default function Autentificare() {
  return (
    <div className='flex flex-col md:flex-row gap-8 rounded-lg max-w-7xl mx-auto w-full'>
      <LoginForm />

      <SignupForm />
    </div>
  );
}
