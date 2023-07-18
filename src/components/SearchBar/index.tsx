import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGetKeywords, useHandleKeydown } from '../../hooks';

const SearchBar = () => {
  const [label, setLabel] = useState({ input: '', keyword: '' });

  const { keywords, getKeywords } = useGetKeywords();
  const { index, setIndex, changeIndex } = useHandleKeydown();

  const arrayLength = keywords.length;

  const changeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setLabel({ input: value, keyword: value });
    setIndex(-1);
    if (!value) return;

    getKeywords(value);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    changeIndex(key, arrayLength);
  };

  useEffect(() => {
    if (index === -1 || index === arrayLength || !arrayLength) {
      return setLabel({ ...label, keyword: label.input });
    }

    return setLabel({ ...label, keyword: keywords[index]?.sickNm });
  }, [keywords, index]);

  return (
    <Main>
      <div>
        <label>
          <MainInput
            name="keywordInput"
            onChange={changeKeyword}
            onKeyDown={onKeyDown}
          />
          <p>{label.keyword}</p>
        </label>
        <button>검색</button>
      </div>
      <h3>추천검색어</h3>
      {/**TODO: Remove inline style */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {arrayLength !== 0 &&
          keywords.map((word, idx) => (
            <Input
              key={word.sickCd}
              className={idx === index ? 'dd' : 'yy'}
              value={word.sickNm}
              readOnly
            />
          ))}
        {!arrayLength && <div>추천 검색어가 없습니다</div>}
      </div>
    </Main>
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

const Main = styled.main`
  width: 490px;
`;

const MainInput = styled.input``;
export default SearchBar;
