import React, { useCallback, useEffect, useState } from 'react';
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
    debounce(async (value: string) => {
      const Cache = new CacheData('search');
      const response = await Cache.get(value);
      setKeywords(response.slice(0, 7));
    }, 1_000),
    [],
  );

  return { keywords, getKeywords };
};

const useHandleKeydown = () => {
  const [index, setIndex] = useState(-1);

  const changeIndex = (key: string, arrayLength: number) => {
    if (!arrayLength) {
      return;
    }

    if (key === 'ArrowUp') {
      switch (index) {
        case -1:
          setIndex(arrayLength - 1);
          break;

        default:
          setIndex(cur => cur - 1);
          break;
      }
    }

    if (key === 'ArrowDown') {
      switch (index) {
        case arrayLength:
          setIndex(0);
          break;
        default:
          setIndex(cur => cur + 1);
          break;
      }
    }
  };

  return { index, setIndex, changeIndex };
};

const App = () => {
  const [label, setLabel] = useState({ input: '', keyword: '' });

  const { keywords, getKeywords } = useGetKeywords();
  const { index, setIndex, changeIndex } = useHandleKeydown();

  const changeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setLabel({ input: value, keyword: value });
    setIndex(-1);
    if (!value) return;

    getKeywords(value);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    changeIndex(key, keywords.length);
  };

  useEffect(() => {
    if (index === -1 || index === keywords.length) {
      return setLabel({ ...label, keyword: label.input });
    }

    return setLabel({ ...label, keyword: keywords[index]?.sickNm });
  }, [keywords, index]);

  return (
    <div>
      <h1>모든 임상시험 검색</h1>
      <div>
        <input
          name="keywordInput"
          onChange={changeKeyword}
          onKeyDown={onKeyDown}
          value={label.input}
        />
        <label>{label.keyword}</label>
        <button>검색</button>
      </div>
      <h3>추천검색어</h3>
      {/**TODO: Remove inline style */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {keywords.length !== 0 &&
          keywords.map((word, idx) => (
            <Input
              key={word.sickCd}
              className={idx === index ? 'dd' : 'yy'}
              value={word.sickNm}
              readOnly
            />
          ))}
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
