import { Dispatch, useCallback, useEffect, useState } from 'react';

export default function useLocalStorage(
    key: string,
    initialValue = '',
): { value: string; setItem: Dispatch<string> } {
    const [value, setValue] = useState(() => window.localStorage.getItem(key) || '');
    const setItem = (newValue: string) => {
        setValue(newValue);
        window.localStorage.setItem(key, newValue);
    };

    useEffect(() => {
        const newValue = window.localStorage.getItem(key);
        if (value !== newValue) {
            setValue(newValue || initialValue);
        }
    }, [key, value, initialValue]);

    const handleStorage = useCallback(
        (event: StorageEvent) => {
            if (event.key === key && event.newValue !== value) {
                setValue(event.newValue || initialValue);
            }
        },
        [initialValue, key, value],
    );

    useEffect(() => {
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, [handleStorage]);

    return { value, setItem };
}
