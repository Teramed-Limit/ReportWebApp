import { RefObject } from 'react';

import { differenceInYears, format, parse } from 'date-fns';
import * as R from 'ramda';

export const generateUUID = () => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};

export const coerceArray = (ary: string | any[]) => {
    if (Array.isArray(ary)) {
        return ary;
    }
    return [ary];
};

export const getRefElement = <T>(
    element?: RefObject<Element> | T,
): Element | T | undefined | null => {
    if (element && 'current' in element) {
        return element.current;
    }

    return element;
};

export const isSSR = !(typeof window !== 'undefined' && window.document?.createElement);

export const isProduction: boolean = process.env.NODE_ENV === 'production';

export const trim = (str: string) => str.replace(/^\s+|\s+$/gm, '');

export const isEmptyOrNil = (value: any) => {
    return R.isEmpty(value) || R.isNil(value);
};

export function uniqBy(list: any[], key) {
    const seen = {};
    return list.filter((item) => {
        const k = key(item);
        return Object.prototype.hasOwnProperty.call(seen, k) ? false : (seen[k] = true);
    });
}

export const reorder = <T>(list: Array<T>, startIndex, endIndex): Array<T> => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result.slice();
};

export const calculateAge = (dob): string => {
    if (!dob) return '';
    const date = parse(dob, 'yyyyMMdd', new Date());
    return `${differenceInYears(new Date(), date)}y`;
};

export const stringFormatDate = (value, fromFormat): Date => {
    return parse(value, fromFormat, new Date());
};

export const dataFormatString = (value, fromFormat, toFormat): string => {
    if (!value) return '';
    const date = parse(value, fromFormat, new Date());
    return format(date, toFormat);
};

export const emptyBaseImage = () =>
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';
