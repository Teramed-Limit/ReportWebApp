import React from 'react';

import classes from './Button.module.scss';
import Icon from '../Icon/Icon';

interface ButtonProps {
    id?: string;
    children?: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    // icon style
    icon?: string;
    iconPosition?: 'top' | 'left';
    iconSize?: number;
    // button style
    fontSize?: number;
    color?: string;
    backgroundColor?: string;
    customClass?: string;
    theme?: string;
}

const buttonTheme: { [props: string]: React.CSSProperties } = {
    primary: { backgroundColor: '#4082dd', color: 'white', border: '1px solid #4082dd' },
    reversePrimary: { backgroundColor: 'white', color: '#4082dd', border: '1px solid #4082dd' },
    error: {
        backgroundColor: '#f50057',
        color: 'white',
        border: '1px solid #f50057',
    },
};

const Button = ({
    id,
    children,
    disabled,
    onClick = () => null,
    icon,
    iconPosition = 'top',
    iconSize = 40,
    color = 'white',
    fontSize = 14,
    backgroundColor = 'transparent',
    theme = '',
    customClass = '',
}: ButtonProps) => {
    const styles = {
        flexDirection: iconPosition === 'top' ? 'column' : 'row',
        fontSize: `${fontSize}px`,
        color,
        backgroundColor,
        ...buttonTheme[theme],
    };

    const iconElement = icon ? <Icon type={icon} size={iconSize} /> : null;

    return (
        <>
            <button
                id={id}
                type="button"
                style={styles as React.CSSProperties}
                className={`${classes.default} ${customClass}`}
                onClick={(event) => onClick(event)}
                disabled={disabled}
            >
                {iconElement}
                {children}
            </button>
        </>
    );
};

export default Button;
