import { RefObject } from 'react';

import moment from 'moment';
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

export const isLocalhost = (): boolean => {
    if (!isSSR) {
        const { hostname } = window.location;
        return Boolean(
            hostname === 'localhost' ||
                hostname === '[::1]' ||
                hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/),
        );
    }

    return false;
};
export const trim = (str: string) => str.replace(/^\s+|\s+$/gm, '');

export const spiltDateTime = (value: string) => {
    if (!value) {
        return '';
    }

    const trimValue = trim(value);
    const date = trimValue.substring(0, 8);
    const time = trimValue.substring(8, trimValue.length);
    return `${date} ${time}`;
};

export const formatDateTime = (format: string, value: string) => {
    if (!value) {
        return '';
    }

    const formatStr = moment(value).format(format);
    if (formatStr === 'Invalid date') {
        console.error(`Date Time string error: ${value}`);
        return '';
    }
    return formatStr;
};

export const dobToAge = (dobStr: string) => {
    if (!dobStr) {
        return '';
    }

    const dob = new Date(formatDateTime('YYYY-MM-DD HH:mm:ss', spiltDateTime(dobStr)));
    // calculate month difference from current date in time
    const monthDiff = Date.now() - dob.getTime();

    // convert the calculated difference in date format
    const ageDiff = new Date(monthDiff);

    // extract year from date
    const year = ageDiff.getUTCFullYear();

    // now calculate the age of the user
    return Math.abs(year - 1970).toString();
};

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
