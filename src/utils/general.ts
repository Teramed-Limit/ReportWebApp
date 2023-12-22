import { RefObject } from 'react';

import { format, parse } from 'date-fns';
import * as R from 'ramda';

import ConfigService from '../service/config-service';

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

export const getRefElement = (element?: RefObject<Element>): Element | undefined | null => {
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

export const isNotEmptyOrNil = (value: any) => {
    return !R.isEmpty(value) && !R.isNil(value);
};

export const isEmptyList = (value: any[] | undefined) => {
    if (!value) return false;
    return value?.length === 0;
};

export const isNotEmptyList = (value: any[] | undefined) => {
    if (!value) return false;
    return value?.length > 0;
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

export const stringFormatDate = (value: string, fromFormat: string): Date => {
    return parse(value, fromFormat, new Date());
};

export const convertToDateTime = (
    value: string | Date,
    fromFormat: string = ConfigService.getDateTimeFormat(),
) => {
    try {
        if (value instanceof Date) {
            return format(value, fromFormat);
        }
        return format(new Date(value), fromFormat);
    } catch {
        return '';
    }
};

export const convertToDate = (
    value: string | Date,
    fromFormat: string = ConfigService.getDateFormat(),
) => {
    try {
        if (value instanceof Date) {
            return format(value, fromFormat);
        }
        return format(new Date(value), fromFormat);
    } catch {
        return '';
    }
};

export const emptyBaseImage = () =>
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';

export const convertFileToBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
            reject(error);
        };
    });
};

export const convertUrlToBase64 = async (url): Promise<string> => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const base64data = reader.result as string;
            resolve(base64data);
        };
    });
};
export function camelize(str) {
    return str.replace(/^\w|[A-Z]|\b\w|\s+/g, (match, index) => {
        if (+match === 0) return ''; // or if (/\s+/.test(match)) for white spaces
        return index === 0 ? match.toUpperCase() : match.toUpperCase();
    });
}

export const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export const readBase64 = (file): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};
