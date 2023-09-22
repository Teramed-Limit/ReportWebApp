import React, { useEffect } from 'react';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { httpReq } from '../axios/axios';
import { staticOptionType } from '../constant/static-options';

export interface OptionRetriever {
    retrieve: (source) => Observable<any[]>;
}

const OptionRetrieverMapper: { [props: string]: OptionRetriever } = {
    http: {
        retrieve: (source) =>
            httpReq<any>()({
                method: 'get',
                url: `api/${source}`,
            }).pipe(map((res) => res.data)),
    },
    customUrl: {
        retrieve: (source) =>
            httpReq<any>()({
                method: 'get',
                url: source,
            }).pipe(map((res) => res.data)),
    },
    static: {
        retrieve: (source) => of(staticOptionType[source]),
    },
};

export const useSelectOptions = (type: string, source: string) => {
    const [options, setOptions] = React.useState<any[]>([]);

    useEffect(() => {
        const optionRetriever = OptionRetrieverMapper[type];
        const subscription = optionRetriever.retrieve(source).subscribe({
            next: setOptions,
        });
        return () => subscription.unsubscribe();
    }, [source, type]);

    return { options };
};
