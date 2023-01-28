import React from 'react';

export const setItem = (key: string, value: string | null) => {
  const event = new CustomEvent('localStorage', { detail: { key, value } });
  window.dispatchEvent(event);
};

export const useLocalStorage = (
  key: string,
  defaultValue?: string | null,
): [string | null, (value: string | null) => void] => {
  const [value, setValueFromEvent] = React.useState<string | null>(
    () => localStorage.getItem(key) || defaultValue || null,
  );

  React.useEffect(() => {
    const listener = ({
      detail,
    }: {
      detail: { key: string; value: string | null };
    }) => {
      if (detail.key === key && detail.value !== value) {
        if (detail.value === null) localStorage.removeItem(key);
        else localStorage.setItem(key, detail.value);
        setValueFromEvent(detail.value);
      }
    };

    window.addEventListener('localStorage', listener as () => void);
    return () =>
      window.removeEventListener('localStorage', listener as () => void);
  }, [key, value, setValueFromEvent]);

  const setValue = (value: string | null) => setItem(key, value);

  return [value, setValue];
};
