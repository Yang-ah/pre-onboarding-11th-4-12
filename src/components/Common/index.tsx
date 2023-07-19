import styled from 'styled-components';
import { IconSearch } from '../../assets';

export const Button = styled.button`
  background-color: ${props => props.theme.BLUE_10};
  color: ${props => props.theme.BLUE_30};
  padding: 8px 16px;
  border-radius: 20px;
  margin-right: 8px;
`;

export const Li = styled.li`
  display: flex;
  align-items: center;
  padding: 8px 0;
  cursor: pointer;

  &.selected,
  &.strong,
  &:hover {
    font-weight: 800;
  }

  > svg {
    width: 16px;
    height: 16px;
    fill: ${props => props.theme.GREY_20};
    margin-right: 12px;
  }
`;

type TItem = {
  children: string;
  className?: string;
  onClick: () => void;
};

export const Item = (props: TItem) => {
  return (
    <Li
      className={props.className ? props.className : 'none'}
      onClick={props.onClick}
    >
      <IconSearch />
      <p>{props.children}</p>
    </Li>
  );
};
