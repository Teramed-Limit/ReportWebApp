import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { defer, Observable } from 'rxjs';

// 創建一個 Observable 來監視 Axios 請求
export function createObservable<T, D = any>(
    axiosInstance: AxiosInstance,
    config: D | undefined = undefined,
): Observable<AxiosResponse<T>> {
    return new Observable<AxiosResponse<T>>((observer) => {
        const source = axios.CancelToken.source();
        const cancelToken = source.token;
        const subscription = defer(() =>
            axiosInstance.request({ ...config, cancelToken }),
        ).subscribe(observer);

        return () => {
            source.cancel();
            subscription.unsubscribe();
        };
    });
}
