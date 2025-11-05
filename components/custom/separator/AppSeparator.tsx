import styles from './AppSeparator.module.css';

type AppSeparatorProps = {
  overlapClass?: string;
  wrapperClass?: string;
  separatorClass?: string;
};

export default function AppSeparator({ overlapClass = '-mt-3 sm:-mt-4', wrapperClass = '', separatorClass = '' }: AppSeparatorProps) {
  return (
    <div className={`${styles.wrapper} ${overlapClass} ${wrapperClass}`}>
      <div className={`${styles.netflixSeparator} ${separatorClass}`} role='presentation' aria-hidden='true' />
    </div>
  );
}
