import { useRef, useEffect } from 'react';

export default function AppCounter({ auctionEndTime }: { auctionEndTime: Date }) {
  const timeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const diff = auctionEndTime.getTime() - now.getTime();
      
      if (diff > 0) {
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);

        let displayText = '';

        if (months > 0) {
          const remainingDays = days % 30;
          displayText = `${months} ${months === 1 ? 'lună' : 'luni'}`;
          if (remainingDays > 0) {
            displayText += ` ${remainingDays} ${remainingDays === 1 ? 'zi' : 'zile'}`;
          }
        } else if (days > 0) {
          const remainingHours = hours % 24;
          displayText = `${days} ${days === 1 ? 'zi' : 'zile'}`;
          if (remainingHours > 0) {
            displayText += ` ${remainingHours}h`;
          }
        } else if (hours > 0) {
          const remainingMinutes = minutes % 60;
          displayText = `${hours}h ${remainingMinutes}m`;
        } else if (minutes > 0) {
          const remainingSeconds = seconds % 60;
          displayText = `${minutes}m ${remainingSeconds}s`;
        } else {
          displayText = `${seconds}s`;
        }

        if (timeRef.current) {
          timeRef.current.textContent = displayText;
        }
      } else {
        if (timeRef.current) {
          timeRef.current.textContent = 'Licitația s-a încheiat';
        }
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [auctionEndTime]);

  return <span ref={timeRef}></span>;
}
