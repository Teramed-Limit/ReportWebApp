import React, { useEffect, useRef, useState } from 'react';

import { observer } from 'mobx-react';
import { Subject } from 'rxjs';
import { debounceTime, filter, finalize, map, switchMap, tap } from 'rxjs/operators';

import { getHKCTTAlias } from '../../../../axios/api';
import BaseLexiconInput from '../../../../components/UI/BaseLexiconInput/BaseLexiconInput';
import { HkcctCode } from '../../../../interface/hkcct';
import { AsyncLexiconField } from '../../../../interface/report-field/lexicon-field';
import { useReportDataStore } from '../../../../models/useStore';
import { trim } from '../../../../utils/general';

interface Props {
    field: AsyncLexiconField<'Diagnosis' | 'Procedure'>;
    value: string;
    onValueChange: (value: string) => void;
    disabled: boolean;
}

const AsyncLexiconInput = React.forwardRef(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ field, value, onValueChange, disabled }: Props, ref) => {
        const { valueChanged } = useReportDataStore();
        const [options, setOptions] = useState<HkcctCode[]>([]);
        const [, setLoading] = useState<boolean>(false);
        const formatKey = useRef<string>(field.optionSource.labelKey || 'Name');
        const optionKey = useRef<string>(field.optionSource.key || 'Code');
        const stopSearch = useRef<boolean>(false);
        const searchTextSubject$ = useRef(new Subject<string>());

        useEffect(() => {
            const subscription = searchTextSubject$.current
                .pipe(
                    debounceTime(400),
                    tap((searchStr) => (searchStr.length <= 2 ? setOptions([]) : null)),
                    filter((searchStr) => searchStr.length > 2),
                    tap(() => setLoading(true)),
                    switchMap((text: string) => getHKCTTAlias(text, field.optionSource.params)),
                    map((res) => res.data),
                    finalize(() => setLoading(false)),
                )
                .subscribe((fetchedOptions) => {
                    setLoading(false);
                    setOptions(fetchedOptions);
                });
            return () => subscription.unsubscribe();
        }, [field, setLoading]);

        const setSelectedOption = (text: string) => {
            const selectedOption = options.find((str) => str.Name === text);
            onValueChange(trim(text));
            stopSearch.current = true;
            // term id
            if (!selectedOption) {
                valueChanged(field.termId, '');
                return;
            }
            valueChanged(field.termId, selectedOption.TermID);
        };

        const onInputChange = (text: string) => {
            if (stopSearch.current) {
                stopSearch.current = false;
                return;
            }
            searchTextSubject$.current.next(text);
        };

        return (
            <BaseLexiconInput
                id={field.id}
                disabled={disabled || field.readOnly}
                value={value}
                valueKey={formatKey.current}
                optionKey={optionKey.current}
                freeText={false}
                maxLength={field.maxLength}
                getOptionLabel={(option) => option[formatKey.current]}
                onValueChange={setSelectedOption}
                onInputChange={onInputChange}
                initialLexiconList={options}
                filterable={false}
                clearable
            />
        );
    },
);

export default observer(AsyncLexiconInput);
