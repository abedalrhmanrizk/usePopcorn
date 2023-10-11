import React from 'react';
import { useKey } from '../hooks/useKey';

export function Search({ query, setQuery }) {
  const inputEl = React.useRef(null);

  useKey('Enter', () => {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery('');
  });

  return (
    <input
      ref={inputEl}
      className='search'
      type='text'
      placeholder='Search movies...'
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
