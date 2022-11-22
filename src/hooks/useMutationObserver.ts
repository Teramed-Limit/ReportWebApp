import { RefObject, useEffect, useMemo } from 'react';

import { getRefElement, isSSR } from '../utils/general';

interface Props {
    target?: RefObject<Element>;
    options?: MutationObserverInit;
    callback?: MutationCallback;
}

export const useMutationObserver = ({ target, options = {}, callback }: Props): void => {
    const observer = useMemo(
        () =>
            !isSSR
                ? new MutationObserver((mutationRecord, mutationObserver) => {
                      callback?.(mutationRecord, mutationObserver);
                  })
                : null,
        [callback],
    );

    useEffect(() => {
        const element = getRefElement(target);

        if (observer && element) {
            observer.observe(element, options);
            return () => observer.disconnect();
        }
    }, [target, observer, options]);
};
