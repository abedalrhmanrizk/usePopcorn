import React from 'react';

export function useKey(key, action) {
  React.useEffect(() => {
    function handleKeyDown(e) {
      if (e.key.toLowerCase() === key.toLowerCase()) {
        action();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () =>
      document.removeEventListener('keydown', handleKeyDown);
  }, [key, action]);
}
