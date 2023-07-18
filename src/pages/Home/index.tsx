import React from 'react';
import { SearchBar } from '../../components';
import styled from 'styled-components';

const Home = () => {
  return (
    <Wrap>
      <H1>
        국내 모든 임상시험 검색하고
        <br />
        온라인으로 참여하기
      </H1>
      <SearchBar />
    </Wrap>
  );
};

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100vw;
  height: 460px;
  margin-top: 56px;
  padding: 80px 0 60px;

  background-color: ${props => props.theme.BLUE_20};
`;

const H1 = styled.h1`
  text-align: center;
  margin-bottom: 40px;
  font-weight: 700;
  line-height: 1.6;
  letter-spacing: 1px;
`;

export default Home;
