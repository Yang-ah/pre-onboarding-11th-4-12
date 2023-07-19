import React from 'react';
import { SearchBar, Button } from '../../components';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Search = () => {
  const params = useParams();
  const navigate = useNavigate();

  return (
    <Wrap>
      <header>
        <Button onClick={() => navigate('/')}>홈으로 가기</Button>
        <h2>'{params.keyword}'의 검색결과입니다.</h2>
      </header>
      <SearchBar />
    </Wrap>
  );
};

const Wrap = styled.div`
  > header {
    display: flex;
    margin: 20px 0;
  }
`;

export default Search;
