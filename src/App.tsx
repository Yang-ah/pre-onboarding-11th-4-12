import React, { useState } from 'react';
import { Keyword } from './models';
import { CacheData } from './service';

const App = () => {
  const [searchResults, setSearchResults] = useState<Keyword[]>([]);

  const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    const searchCache = new CacheData('search');

    const response = await searchCache.get(value);
    setSearchResults(response);
  };

  return (
    <div>
      <h1>모든 임상시험 검색</h1>
      <div>
        <input name="keywordInput" onChange={onChange} />
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
