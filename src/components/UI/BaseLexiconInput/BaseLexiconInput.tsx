import React, { useEffect, useReducer } from 'react';

import { Tooltip } from '@mui/material';
import classNames from 'classnames/bind';
import { MdClear } from 'react-icons/md';
import { RiBook3Line as BookIcon } from 'react-icons/ri';

import { useKeyPress } from '../../../hooks/useKeyPress';
import { generateUUID } from '../../../utils/general';
import classes from './BaseLexiconInput.module.scss';
import MenuGroup from './MenuGroup/MenuGroup';
import MenuOption from './MenuOption/MenuOption';
import NoneOption from './NoneOption/NoneOption';
import {
    onArrowDownPress,
    onArrowUpPress,
    onBlur,
    onEnterPress,
    onEscapePress,
    onMenuOpen,
    onOptionSelect,
    onUpdateText,
    syncOptions,
    syncText,
} from './store/action';
import { LexiconReducer } from './store/reducer';

interface Props {
    id?: string;
    cssClass?: { container: string; input: string };
    initialLexiconList: any[];
    value: string;
    freeText?: boolean;
    valueKey: string;
    optionKey: string;
    disabled?: boolean;
    maxLength?: number;
    filterable?: boolean;
    onValueChange: (str: string) => void;
    onInputChange?: (str: string) => void;
    getOptionLabel?: (option) => string;
    maxMenuGroupHeight?: number;
    minMenuGroupWidth?: number;
    singleMenuHeight?: number;
    showTooltip?: boolean;
    clearable?: boolean;
}

const cx = classNames.bind(classes);

const BaseLexiconInput = ({
    id,
    cssClass,
    value = '',
    valueKey = '',
    optionKey = '',
    freeText = true,
    disabled = false,
    maxLength = 256,
    onValueChange,
    onInputChange = () => {},
    filterable = true,
    initialLexiconList = [],
    getOptionLabel = (option) => option.label,
    maxMenuGroupHeight = 330,
    minMenuGroupWidth = 400,
    singleMenuHeight = 33,
    showTooltip = true,
    clearable = false,
}: Props) => {
    const inputRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;

    const [
        { currentInputText, selectedOption, isMenuOpen, filteredOptions, focusOptionIdx },
        dispatch,
    ] = useReducer(LexiconReducer, {
        currentInputText: value,
        valueKey,
        isMenuOpen: false,
        options: initialLexiconList,
        selectedOption: undefined,
        filteredOptions: initialLexiconList.map((option) => ({ ...option, id: generateUUID() })),
        focusOptionIdx: -1,
        filterable,
    });

    useEffect(() => {
        dispatch(
            syncOptions(initialLexiconList.map((option) => ({ ...option, id: generateUUID() }))),
        );
    }, [initialLexiconList]);

    useEffect(() => {
        dispatch(syncText(value));
    }, [value]);

    const onEnter = (event) => {
        event.preventDefault();
        if (event.keyCode === 229 || !isMenuOpen) {
            // ignore the keydown event from an Input Method Editor(IME)
            // ref. https://www.w3.org/TR/uievents/#determine-keydown-keyup-keyCode
            return;
        }
        dispatch(onEnterPress());
        if (selectedOption) {
            onValueChange(selectedOption[valueKey]);
            onInputChange(selectedOption[valueKey]);
        }

        if (!freeText && !selectedOption) {
            dispatch(syncText(value));
        }
    };

    const onEscape = (event) => {
        event.preventDefault();
        dispatch(onEscapePress());
    };

    const onArrowDown = (event) => {
        event.preventDefault();
        dispatch(onArrowDownPress());
    };

    const onArrowUp = (event) => {
        event.preventDefault();
        dispatch(onArrowUpPress());
    };

    const onSelectedOptionChange = (text: string) => {
        dispatch(onOptionSelect(text));
        onValueChange(text);
        onInputChange(text);
    };

    const onTextInputChange = (event) => {
        const spiltStr = event.target.value.substring(0, maxLength);
        dispatch(onUpdateText(spiltStr));
        dispatch(onMenuOpen());
        onInputChange(spiltStr);
        if (freeText) {
            onValueChange(spiltStr);
        }
    };

    const onBlurTrigger = () => {
        dispatch(onBlur());
        if (!freeText) {
            dispatch(syncText(value));
        }
    };

    const onFocusTrigger = () => {
        if (!freeText) {
            inputRef.current.select();
        }
    };

    // Event listener
    useKeyPress('Escape', onEscape, inputRef);
    useKeyPress('ArrowUp', onArrowUp, inputRef);
    useKeyPress('ArrowDown', onArrowDown, inputRef);
    useKeyPress('Enter', onEnter, inputRef);

    let displayMenuOption = filteredOptions.map((lexicon, idIndex) => (
        <MenuOption
            key={lexicon[optionKey]}
            lexiconText={getOptionLabel(lexicon)}
            focus={idIndex === focusOptionIdx}
            onSelectedOptionChange={onSelectedOptionChange}
        />
    ));

    if (filteredOptions.length === 0) {
        displayMenuOption = [<NoneOption key="none" />];
    }

    const inputHtml = (
        <input
            id={id}
            autoComplete="off"
            ref={inputRef}
            disabled={disabled}
            className={cx(cssClass?.input, { 'text-input': !cssClass?.input })}
            type="text"
            tabIndex={0}
            maxLength={maxLength}
            value={currentInputText}
            onChange={onTextInputChange}
            onFocus={onFocusTrigger}
            onBlur={onBlurTrigger}
            onDrag={(e) => e.stopPropagation()}
        />
    );

    return (
        <div className={cx(cssClass?.container, { container: !cssClass?.container })}>
            {showTooltip ? (
                <Tooltip title={currentInputText} arrow disableFocusListener disableTouchListener>
                    {inputHtml}
                </Tooltip>
            ) : (
                inputHtml
            )}

            {clearable ? (
                <MdClear
                    className={cx(`${classes.icon} ${classes.clickable}`, {
                        noEvent: disabled,
                    })}
                    onClick={() => onValueChange('')}
                />
            ) : null}
            <BookIcon className={classes.icon} />

            {isMenuOpen && (
                <MenuGroup
                    anchorElement={inputRef?.current}
                    maxMenuGroupHeight={maxMenuGroupHeight}
                    minMenuGroupWidth={minMenuGroupWidth}
                    singleMenuHeight={singleMenuHeight}
                    optionsLength={filteredOptions.length || 1}
                    focusOptionIndex={focusOptionIdx}
                >
                    {displayMenuOption}
                </MenuGroup>
            )}
        </div>
    );
};

export default BaseLexiconInput;
