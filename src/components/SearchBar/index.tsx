import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useClickOutside, useGetKeywords, useHandleKeydown } from '../../hooks';
import { IconSearch } from '../../assets';
import { Button, Item } from '../Common';

const SearchBar = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const [label, setLabel] = useState({ input: '', keyword: '' });

  const { isLoading, setIsLoading, keywords, getKeywords } = useGetKeywords();
  const { index, setIndex, changeIndex } = useHandleKeydown();
  const { isOpen, setIsOpen } = useClickOutside(ref);

  const arrayLength = keywords.length;
  const recentWord = localStorage.getItem('recentWord');

  const goSearchPage = (path: string) => {
    navigate(`/search/${path}`);
    localStorage.setItem('recentWord', path);
  };

  const onSubmit = (
    event: React.FormEvent<HTMLFormElement | HTMLButtonElement>,
  ) => {
    event.preventDefault();
    goSearchPage(label.keyword);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    if (!label.input || isLoading) return;

    changeIndex(key, arrayLength);
  };

  const changeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setLabel({ input: value, keyword: value });
    setIndex(-1);

    if (!value) return;

    setIsLoading(true);
    getKeywords(value);
  };

  useEffect(() => {
    if (index === -1 || index === arrayLength || !arrayLength) {
      return setLabel({ ...label, keyword: label.input });
    }

    return setLabel({ ...label, keyword: keywords[index]?.sickNm });
  }, [keywords, index]);

  return (
    <Wrap ref={ref}>
      <Form onSubmit={onSubmit}>
        <Label>
          <IconSearch />
          <MainInput
            name="keywordInput"
            onChange={changeKeyword}
            onKeyDown={onKeyDown}
            placeholder="질환명을 입력해주세요."
            value={label.keyword}
            onClick={() => setIsOpen(true)}
            autoComplete="off"
          />
        </Label>
        <SearchButton type="submit" onSubmit={onSubmit}>
          <IconSearch />
        </SearchButton>
      </Form>

      {isOpen && (
        <FocusWrap>
          {isLoading && <Article>로딩중....</Article>}
          {!label.input && !isLoading && (
            <>
              <Article>
                <H3>최근검색어</H3>
                {recentWord && (
                  <Item onClick={() => goSearchPage(recentWord)}>
                    {recentWord}
                  </Item>
                )}
              </Article>
              <Horizon />
              <Article>
                <H3>추천 검색어로 검색해보세요.</H3>
                <ButtonWrap>
                  {recommend.map((item, index) => (
                    <Button
                      key={item + index}
                      value={item}
                      onClick={() => goSearchPage(item)}
                      children={item}
                    />
                  ))}
                </ButtonWrap>
              </Article>
            </>
          )}

          {label.input && !isLoading && (
            <Article>
              <Item
                onClick={() => goSearchPage(label.input)}
                className="strong"
              >
                {label.input}
              </Item>
              <H3>추천검색어</H3>
              {arrayLength !== 0 &&
                keywords.map((word, idx) => (
                  <Item
                    key={word.sickCd}
                    className={idx === index ? 'selected' : 'none'}
                    onClick={() => goSearchPage(word.sickNm)}
                  >
                    {word.sickNm}
                  </Item>
                ))}
              {!arrayLength && <div>추천 검색어가 없습니다</div>}
            </Article>
          )}
        </FocusWrap>
      )}
    </Wrap>
  );
};

const recommend = ['B형간염', '비만', '관절염', '우울증', '식도염'];

const Horizon = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${props => props.theme.BLUE_GREY_10};
  margin: 24px 0;
`;

const Wrap = styled.div`
  width: 490px;
`;

const Form = styled.form`
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
  margin-top: 8px;
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
