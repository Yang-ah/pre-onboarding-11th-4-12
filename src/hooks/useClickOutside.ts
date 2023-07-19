import { useState, useEffect } from 'react';

const useClickOutside = (ref: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && isOpen && !ref.current.contains(event.target as Node)) {
      return setIsOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return { ref, isOpen, setIsOpen };
};

export default useClickOutside;
