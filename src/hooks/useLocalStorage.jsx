import React from 'react';

export function useLocalStorageState(initialState, key) {
  const [value, setValue] = React.useState(
    () => JSON.parse(localStorage.getItem(`${key}`)) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(`${key}`, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
}
