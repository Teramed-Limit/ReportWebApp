import { filterOptions } from '../utils';
import { ACTION_TYPES } from './action-types';

type State = {
    currentInputText: string;
    valueKey: string;
    isMenuOpen: boolean;
    options: any[];
    selectedOption: any;
    filteredOptions: any[];
    focusOptionIdx: number;
    filterable: boolean;
};

const initialState: State = {
    currentInputText: '',
    valueKey: '',
    isMenuOpen: false,
    options: [],
    selectedOption: undefined,
    filteredOptions: [],
    focusOptionIdx: -1,
    filterable: false,
};

export const LexiconReducer = (state = initialState, action: any) => {
    let focusOptionIdx = -1;
    let filteredOptions;

    switch (action.type) {
        case ACTION_TYPES.menuClose:
            return {
                ...state,
                isMenuOpen: false,
                options: [],
                selectedOption: undefined,
                filteredOptions: [],
                focusOptionIdx: -1,
            };
        case ACTION_TYPES.menuOpen:
            return {
                ...state,
                isMenuOpen: true,
            };
        case ACTION_TYPES.syncText:
            return {
                ...state,
                currentInputText: action.text,
            };
        case ACTION_TYPES.syncOptions:
            filteredOptions = state.filterable
                ? filterOptions([...action.options], state.valueKey, state.currentInputText)
                : [...action.options];

            return {
                ...state,
                options: [...action.options],
                focusOptionIdx: 0,
                selectedOption: filteredOptions[0],
                filteredOptions,
            };
        case ACTION_TYPES.blur:
            return {
                ...state,
                isMenuOpen: false,
                focusOptionIdx: -1,
                selectedOption: undefined,
            };
        case ACTION_TYPES.optionSelect:
            return {
                ...state,
                isMenuOpen: false,
                // options: [],
                selectedOption: undefined,
                filteredOptions: [],
                focusOptionIdx: -1,
                currentInputText: action.text,
            };
        case ACTION_TYPES.updateText:
            filteredOptions = state.filterable
                ? filterOptions(state.options, state.valueKey, action.text)
                : state.options;

            return {
                ...state,
                isMenuOpen: true,
                currentInputText: action.text,
                focusOptionIdx: 0,
                selectedOption: filteredOptions[0],
                filteredOptions,
            };
        case ACTION_TYPES.escapePress:
            return {
                ...state,
                isMenuOpen: false,
                focusOptionIdx: -1,
                selectedOption: undefined,
            };
        case ACTION_TYPES.arrowDownPress:
            focusOptionIdx =
                state.focusOptionIdx === state.filteredOptions.length - 1
                    ? 0
                    : state.focusOptionIdx + 1;

            if (state.isMenuOpen) {
                return {
                    ...state,
                    focusOptionIdx,
                    selectedOption: state.filteredOptions[focusOptionIdx],
                };
            }
            return {
                ...state,
                isMenuOpen: true,
                focusOptionIdx: 0,
                selectedOption: state.filteredOptions[0],
            };
        case ACTION_TYPES.arrowUpPress:
            focusOptionIdx =
                state.focusOptionIdx === 0
                    ? state.filteredOptions.length - 1
                    : state.focusOptionIdx - 1;

            if (state.isMenuOpen) {
                return {
                    ...state,
                    focusOptionIdx,
                    selectedOption: state.filteredOptions[focusOptionIdx],
                };
            }
            return {
                ...state,
                isMenuOpen: true,
                focusOptionIdx: 0,
                selectedOption: state.filteredOptions[0],
            };
        case ACTION_TYPES.enterPress:
            if (!state.isMenuOpen || state.filteredOptions.length === 0 || !state.selectedOption) {
                return {
                    ...state,
                    isMenuOpen: false,
                    focusOptionIdx: -1,
                    selectedOption: undefined,
                };
            }

            return {
                ...state,
                isMenuOpen: false,
                focusOptionIdx: -1,
                currentInputText: state.selectedOption[state.valueKey],
                selectedOption: state.selectedOption,
                filteredOptions: state.filterable
                    ? filterOptions(
                          state.options,
                          state.valueKey,
                          state.selectedOption[state.valueKey],
                      )
                    : state.options,
            };
        default:
            return state;
    }
};
