import React from 'react';

import cx from 'classnames';

import classes from './MenuOption.module.scss';

interface Props {
    focus: boolean;
    onSelectedOptionChange: (lexiconText: string) => void;
    lexiconText: string;
}

const MenuOption = ({ focus, lexiconText, onSelectedOptionChange }: Props) => {
    return (
        <div
            id="report__option"
            onMouseDown={(event) => {
                event.stopPropagation();
                onSelectedOptionChange(lexiconText);
            }}
            className={cx(classes.menuOption, {
                [classes.focus]: focus,
            })}
        >
            {lexiconText}
        </div>
    );
};

export default React.memo(MenuOption);
