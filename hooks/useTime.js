import { useState, useEffect } from 'react';

export default function useTime() {
  const [time, setTime] = useState('');
  
  useEffect(() => {
    function updateTime() {
      setTime(new Date().toLocaleTimeString());
    }
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return time;
}