import React from 'react';

import {
    Consumable,
    Drug,
    Lab,
    Modify,
    Photos,
    Preview,
    Print,
    reporting,
    Save,
    SignOff,
    SignOffBlue,
} from '../../../assets';

const fontIconCodes = {
    save: Save,
    modify: Modify,
    print: Print,
    lab: Lab,
    drug: Drug,
    consumable: Consumable,
    reporting,
    preview: Preview,
    signOff: SignOff,
    signOffBlue: SignOffBlue,
    photos: Photos,
};

interface IconProps {
    type: string;
    size: number;
}

const Icon = ({ type, size }: IconProps) => {
    const style = {
        width: size,
    };

    return <img style={style} src={fontIconCodes?.[type]} alt="None" />;
};

export default Icon;
