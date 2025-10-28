import LoginForm from '@/components/custom/form/LoginForm';
import SignupForm from '@/components/custom/form/SignupForm';

export default function Autentificare() {
  return (
    <div className='flex flex-col md:flex-row bg-gray-100 dark:bg-gray-300 p-4 gap-4 rounded-xs'>
      <LoginForm />

      <SignupForm />
    </div>
  );
}
