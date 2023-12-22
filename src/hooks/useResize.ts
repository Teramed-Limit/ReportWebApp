import { useEffect } from 'react';

import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export const useResize = (callback: () => void, delay = 250): void => {
    useEffect(() => {
        const resizeObservable = fromEvent(window, 'resize')
            .pipe(
                debounceTime(delay), // 加上 debounceTime 以減少事件觸發次數
            )
            .subscribe(() => {
                callback();
            });

        return () => {
            resizeObservable.unsubscribe(); // 清除 RxJS 的訂閱
        };
    }, [callback, delay]);
};
