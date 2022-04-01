import React from 'react';

import {
    Modify,
    Photos,
    Preview,
    Print,
    Query,
    reporting,
    Save,
    SignOff,
    SignOffBlue,
} from '../../../assets';

const fontIconCodes = {
    save: Save,
    modify: Modify,
    print: Print,
    query: Query,
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
