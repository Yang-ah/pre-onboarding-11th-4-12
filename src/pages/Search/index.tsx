import React from 'react';
import { SearchBar, Button } from '../../components';
import { useParams, Link } from 'react-router-dom';

const Search = () => {
  const params = useParams();

  return (
    <div>
      <SearchBar />
      <p>'{params.keyword}'의 검색결과입니다.</p>
      <Button>
        <Link to="/">홈으로 가기</Link>
      </Button>
    </div>
  );
};

export default Search;
