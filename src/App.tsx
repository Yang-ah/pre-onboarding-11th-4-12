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

const useGetKeywords = () => {
  const [keywords, setKeywords] = useState<Keyword[]>([]);

  const getKeywords = useCallback(
    debounce(async (value: string, storage: string) => {
      const Cache = new CacheData(storage);
      const response = await Cache.get(value);
      setKeywords(response.slice(0, 7));
    }, 1_000),
    [],
  );

  return { keywords, getKeywords };
};

const App = () => {
  const [input, setInput] = useState('');
  const [keyword, setKeyword] = useState({ content: '', index: -1 });

  const { keywords, getKeywords } = useGetKeywords();

  const changeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setInput(value);
    setKeyword({ content: value, index: -1 });

    if (!value) return;

    getKeywords(value);
  };

  const changeIndex = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    const length = keywords.length;

    if (!length) {
      return;
    }

    if (key === 'ArrowUp' && keyword.index < 1) {
      if (keyword.index === 0) {
        setKeyword({ content: input, index: -1 });
        return;
      }

      if (keyword.index === -1) {
        setKeyword({
          content: keywords[length - 1].sickNm,
          index: length - 1,
        });
        return;
      }
    }

    if (key === 'ArrowDown' && length - 1 <= keyword.index) {
      if (keyword.index === length - 1) {
        setKeyword({
          content: input,
          index: length,
        });
        return;
      }

      if (keyword.index === length) {
        setKeyword({
          content: keywords[0].sickNm,
          index: 0,
        });
        return;
      }
    }

    if (key === 'ArrowDown') {
      setKeyword({
        content: keywords[keyword.index + 1].sickNm,
        index: keyword.index + 1,
      });
      return;
    }

    if (key === 'ArrowUp') {
      setKeyword({
        content: keywords[keyword.index - 1].sickNm,
        index: keyword.index - 1,
      });
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
        <div>{keyword.content}</div>
        <button>검색</button>
      </div>
      <h3>추천검색어</h3>
      {/**TODO: Remove inline style */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {keywords.length ? (
          keywords.map((result, index) => (
            <Input
              className={index === keyword.index ? 'dd' : 'yy'}
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
