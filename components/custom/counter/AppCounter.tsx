import { useRef, useEffect } from 'react';

export default function AppCounter({ auctionEndTime }: { auctionEndTime: Date }) {
  const timeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const diff = auctionEndTime.getTime() - now.getTime();
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        if (timeRef.current) {
          timeRef.current.textContent = `${hours}h ${minutes}m ${seconds}s`;
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
