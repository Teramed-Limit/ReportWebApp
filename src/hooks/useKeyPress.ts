import { RefObject, useCallback } from 'react';

import { useEventListener } from './useEventListener';

export const useKeyPress = (
    key: string,
    callback: (event: KeyboardEvent) => void,
    element?: RefObject<Element> | Document | Window | null,
): void => {
    const handleKeydown = useCallback(
        (event) => {
            if (event.key === key) {
                callback(event);
            }
        },
        [callback, key],
    );

    useEventListener({
        type: 'keydown',
        listener: handleKeydown,
        element,
    });
};
