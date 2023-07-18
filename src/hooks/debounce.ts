const debounce = (callback: any, delay: number) => {
  let finalExecute: any;

  return function (...args: any) {
    clearTimeout(finalExecute);

    finalExecute = setTimeout(() => {
      callback.apply(callback, args);
    }, delay);
  };
};

export default debounce;
