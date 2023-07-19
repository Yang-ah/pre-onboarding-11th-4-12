import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useGetKeywords, useHandleKeydown } from '../../hooks';
import { IconSearch } from '../../assets';
import { Button } from '../Common';

const SearchBar = () => {
  const navigate = useNavigate();
  const [label, setLabel] = useState({ input: '', keyword: '' });

  const { isLoading, keywords, getKeywords } = useGetKeywords();
  const { index, setIndex, changeIndex } = useHandleKeydown();

  const arrayLength = keywords.length;

  const changeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setLabel({ input: value, keyword: value });
    setIndex(-1);
    if (!value) return;

    getKeywords(value);
  };

  const goSearchPage = (event: React.FormEvent<HTMLButtonElement>) => {
    const { value } = event.currentTarget;
    navigate(`/search/${value}`);
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
        <SearchButton>
          <IconSearch />
        </SearchButton>
      </Main>
      <FocusWrap>
        {isLoading && <p>로딩중....</p>}
        {!label.input && !isLoading && (
          <>
            <Article>
              <H3>최근검색어</H3>
              <ul>
                <Li>
                  <IconSearch />
                  <p>간암</p>
                </Li>
                <Li>
                  <IconSearch />
                  <p>간암</p>
                </Li>
              </ul>
            </Article>
            <Horizon />
            <Article>
              <H3>추천 검색어로 검색해보세요.</H3>
              <ButtonWrap>
                <Button onClick={goSearchPage} value="B형간염">
                  B형간염
                </Button>
                <Button>비만</Button>
                <Button>관절염</Button>
                <Button>우울증</Button>
                <Button>식도염</Button>
              </ButtonWrap>
            </Article>
          </>
        )}
        {label.input && !isLoading && (
          <Article>
            <Li>
              <IconSearch />
              <p>
                <strong>{label.input}</strong>
              </p>
            </Li>
            <H3>추천검색어</H3>
            {arrayLength !== 0 &&
              keywords.map((word, idx) => (
                <Li key={word.sickCd} className={idx === index ? 'dd' : 'yy'}>
                  {word.sickNm}
                </Li>
              ))}
            {!arrayLength && <div>추천 검색어가 없습니다</div>}
          </Article>
        )}
      </FocusWrap>
    </Wrap>
  );
};

const Horizon = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${props => props.theme.BLUE_GREY_10};
  margin: 24px 0;
`;

const Wrap = styled.div`
  width: 490px;
`;

const Main = styled.main`
  position: relative;
`;

const ButtonWrap = styled.div`
  > button {
    background-color: ${props => props.theme.BLUE_10};
    color: ${props => props.theme.BLUE_30};
    padding: 8px 16px;
    border-radius: 20px;
    margin-right: 8px;
  }

  margin-bottom: 8px;
`;

const FocusWrap = styled.section`
  width: 100%;
  border-radius: 20px;
  background-color: white;
  display: flex;
  flex-direction: column;
  box-shadow: rgba(30, 32, 37, 0.1) 0px 2px 10px;
  padding: 24px 0 16px;
`;

const Article = styled.article`
  padding: 0 24px;
`;

const H3 = styled.h3`
  font-size: 13px;
  font-weight: 400;
  color: ${props => props.theme.GREY_30};
  margin-bottom: 16px;
`;

const Li = styled.li`
  display: flex;
  align-items: center;
  padding: 8px 0;

  &.dd {
    color: red;
  }
  &.yy {
    color: blue;
  }

  > svg {
    width: 16px;
    height: 16px;
    fill: ${props => props.theme.GREY_20};
    margin-right: 12px;
  }
`;

const SearchButton = styled.button`
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
  cursor: pointer;
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
  cursor: pointer;

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
