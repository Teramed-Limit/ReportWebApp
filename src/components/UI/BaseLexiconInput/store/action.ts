import { ACTION_TYPES } from './action-types';

export const onMenuClose = () => ({
    type: ACTION_TYPES.menuClose,
});

export const onMenuOpen = () => ({
    type: ACTION_TYPES.menuOpen,
});

export const onUpdateText = (text: string): { type: string; text: string } => ({
    type: ACTION_TYPES.updateText,
    text,
});

export const onOptionSelect = (text: string) => ({
    type: ACTION_TYPES.optionSelect,
    text,
});

export const onEscapePress = () => ({
    type: ACTION_TYPES.escapePress,
});

export const onEnterPress = () => ({
    type: ACTION_TYPES.enterPress,
});

export const onArrowDownPress = () => ({
    type: ACTION_TYPES.arrowDownPress,
});

export const onArrowUpPress = () => ({
    type: ACTION_TYPES.arrowUpPress,
});

export const onBlur = () => ({
    type: ACTION_TYPES.blur,
});

export const syncOptions = (lexiconList: any[]) => ({
    type: ACTION_TYPES.syncOptions,
    options: lexiconList,
});

export const syncText = (text: string) => ({
    type: ACTION_TYPES.syncText,
    text,
});
