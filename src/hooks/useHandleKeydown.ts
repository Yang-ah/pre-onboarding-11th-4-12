import { useState } from 'react';

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

export default useHandleKeydown;
