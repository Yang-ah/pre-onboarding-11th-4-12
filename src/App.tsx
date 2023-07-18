import React, { useCallback, useState } from 'react';
import { Keyword } from './models';
import { CacheData } from './service';
import styled from 'styled-components';

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
  const [input, setInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [recommendKeywords, setRecommendKeywords] = useState<Keyword[]>([]);
  const [keywordIndex, setKeywordIndex] = useState(-1);

  const getKeywords = useCallback(
    debounce(async (value: string) => {
      const searchCache = new CacheData('search');
      const response = await searchCache.get(value);
      setRecommendKeywords(response.slice(0, 7));
    }, 1_000),
    [],
  );

  const changeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setInput(value);
    setKeyword(value);
    setKeywordIndex(-1);

    if (!value) return;

    getKeywords(value);
  };

  const changeIndex = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    const length = recommendKeywords.length;
    const index = keywordIndex;

    if (!length) {
      return;
    }

    if (key === 'ArrowUp' && index < 1) {
      if (index === 0) {
        setKeywordIndex(-1);
        setKeyword(input);
        return;
      }

      if (index === -1) {
        setKeywordIndex(length - 1);
        setKeyword(recommendKeywords[length - 1].sickNm);
        return;
      }
    }

    if (key === 'ArrowDown' && length - 1 <= index) {
      if (index === length - 1) {
        setKeywordIndex(length);
        setKeyword(input);
        return;
      }

      if (index === length) {
        setKeywordIndex(0);
        setKeyword(recommendKeywords[0].sickNm);
        return;
      }
    }

    if (key === 'ArrowDown') {
      setKeyword(recommendKeywords[index + 1].sickNm);
      setKeywordIndex(cur => cur + 1);
      return;
    }

    if (key === 'ArrowUp') {
      setKeyword(recommendKeywords[index - 1].sickNm);
      setKeywordIndex(cur => cur - 1);
      return;
    }
  };

  return (
    <div>
      <h1>모든 임상시험 검색</h1>
      <div>
        <input
          name="keywordInput"
          onChange={changeKeyword}
          onKeyDown={changeIndex}
          value={input}
        />
        <div>{keyword}</div>
        <button>검색</button>
      </div>
      <h3>추천검색어</h3>
      {/**TODO: Remove inline style */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {recommendKeywords.length ? (
          recommendKeywords.map((result, index) => (
            <Input
              className={index === keywordIndex ? 'dd' : 'yy'}
              key={result.sickCd}
              value={result.sickNm}
              readOnly
            />
          ))
        ) : (
          <h1>추천 검색어가 없습니다</h1>
        )}
      </div>
    </div>
  );
};

/**TODO: Style 제거 */
const Input = styled.input`
  &.dd {
    color: red;
  }
  &.yy {
    color: blue;
  }
`;

export default App;
