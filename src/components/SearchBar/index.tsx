import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useGetKeywords, useHandleKeydown } from '../../hooks';
import { IconSearch } from '../assets';

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
    <Wrap>
      <Main>
        <Label>
          <IconSearch />
          <MainInput
            name="keywordInput"
            onChange={changeKeyword}
            onKeyDown={onKeyDown}
            placeholder="질환명을 입력해주세요."
          />
          <p>{label.keyword}</p>
        </Label>
        <Button>
          <IconSearch />
        </Button>
      </Main>
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
    </Wrap>
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

const Wrap = styled.div`
  width: 490px;
`;

const Main = styled.main`
  position: relative;
`;

const Button = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${props => props.theme.BLUE_30};
  transform: translateY(-50%);

  > svg {
    width: 21px;
    height: 21px;
    fill: white;
  }
`;

const MainInput = styled.input`
  background-color: transparent;
  width: 100%;
  font-size: 18px;
  //  user-select: none;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  width: 490px;
  height: 70px;
  border: 2px solid white;
  border-radius: 42px;
  background-color: white;
  padding: 20px 10px 20px 24px;

  > svg {
    width: 16px;
    height: 16px;
    margin-right: 12px;
    fill: ${props => props.theme.GREY_20};
  }

  &:focus-within {
    border-color: ${props => props.theme.BLUE_30};
  }
`;

export default SearchBar;
