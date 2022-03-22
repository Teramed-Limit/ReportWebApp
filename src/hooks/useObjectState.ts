import React, { useEffect, useState } from 'react';

export function useObjectState<T>(object: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [value, setValue] = useState<T>(object);

    useEffect(() => {
        if (JSON.stringify(value) !== JSON.stringify(object)) {
            setValue(object);
        }
    }, [object, value]);

    return [value, setValue];
}
