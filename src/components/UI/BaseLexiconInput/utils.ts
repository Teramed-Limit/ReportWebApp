export function getBoundingClientObj(element: HTMLElement | undefined) {
    if (!element) {
        return {
            bottom: 0,
            height: 0,
            left: 0,
            right: 0,
            top: 0,
            width: 0,
        };
    }

    const rect = element.getBoundingClientRect();
    return {
        bottom: rect.bottom,
        height: rect.height,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        width: rect.width,
    };
}
export type RectType = {
    left: number;
    right: number;
    bottom: number;
    height: number;
    width: number;
};

export const filterOptions = (options, valueKey, text) => {
    return options.filter((str) => str[valueKey].toUpperCase().includes(text.toUpperCase()));
};
