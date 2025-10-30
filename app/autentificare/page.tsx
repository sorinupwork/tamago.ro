import LoginForm from '@/components/custom/form/LoginForm';
import SignupForm from '@/components/custom/form/SignupForm';

export default function Autentificare() {
  return (
    <div className='flex flex-col md:flex-row gap-4 rounded-lg'>
      <LoginForm />

      <SignupForm />
    </div>
  );
}
