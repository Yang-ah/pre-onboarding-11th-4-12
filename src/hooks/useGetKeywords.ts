import { TKeyword } from '../models';
import { useCallback, useState } from 'react';
import debounce from './debounce';
import { CacheData } from '../service';

const useGetKeywords = () => {
  const [keywords, setKeywords] = useState<TKeyword[]>([]);

  const getKeywords = useCallback(
    debounce(async (value: string) => {
      const Cache = new CacheData('search');
      const response = await Cache.get(value);
      setKeywords(response.slice(0, 7));
    }, 1_000),
    [],
  );

  return { keywords, getKeywords };
};

export default useGetKeywords;
