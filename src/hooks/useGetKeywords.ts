import { TKeyword } from '../models';
import { useCallback, useState } from 'react';
import debounce from './debounce';
import { CacheData } from '../service';

const useGetKeywords = () => {
  const [keywords, setKeywords] = useState<TKeyword[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getKeywords = useCallback(
    debounce(async (value: string) => {
      setIsLoading(true);
      const Cache = new CacheData('search');
      try {
        const response = await Cache.get(value);
        setKeywords(response.slice(0, 7));
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }, 1000),
    [],
  );

  return { setIsLoading, isLoading, keywords, getKeywords };
};

export default useGetKeywords;
