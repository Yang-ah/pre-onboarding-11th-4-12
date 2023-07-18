import React, { useCallback, useState } from 'react';
import { Keyword } from './models';
import { CacheData } from './service';

const debounce = (callback: any, delay: number) => {
  let finalExecute: any;

  return function (...args: any) {
    clearTimeout(finalExecute);

    finalExecute = setTimeout(() => {
      callback.apply(callback, args);
    }, delay);
  };
};

const App = () => {
  const [keyword, setKeyword] = useState('');
  const [searchResults, setSearchResults] = useState<Keyword[]>([]);

  const printValue = useCallback(
    debounce(async (value: string) => {
      const searchCache = new CacheData('search');
      const response = await searchCache.get(value);
      setSearchResults(response);
    }, 3_000),
    [],
  );

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setKeyword(value);

    if (!value) return;

    printValue(value);
  };

  return (
    <div>
      <h1>모든 임상시험 검색</h1>
      <div>
        <input name="keywordInput" onChange={onChange} value={keyword} />
        <button>검색</button>
      </div>
      <ul>
        {searchResults?.map(result => (
          <li key={result.sickCd}>{result.sickNm}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
