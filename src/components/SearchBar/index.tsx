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
    <div>
      <h1>
        국내 모든 임상시험 검색하고
        <br />
        온라인으로 참여하기
      </h1>
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

export default SearchBar;
