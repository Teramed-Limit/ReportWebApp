import React, { useEffect, useState } from 'react';

import Konva from 'konva';

import ColorPickerButton from '../ColorPickerButton/ColorPickerButton';
import BaseCheckbox from '../UI/BaseCheckbox/BaseCheckbox';
import BaseNumber from '../UI/BaseNumber/BaseNumber';
import BaseTextInput from '../UI/BaseTextInput/BaseTextInput';
import classes from './MarkerAttribute.module.scss';

const AttributeMapper = {
    number: BaseNumber,
    string: BaseTextInput,
    boolean: BaseCheckbox,
};

const filterAttribute = [
    'width',
    'height',
    'text',
    'fill',
    'stroke',
    'fontSize',
    'radius',
    'strokeWidth',
    'pointerLength',
    'pointerWidth',
    'scaleX',
    'scaleY',
    'rotation',
    'x',
    'y',
    'dashEnabled',
];

interface Props {
    id: number;
    attribute: Konva.ShapeConfig;
    setAttribute: (attrName: string, attrValue: number | string | boolean) => void;
}

const MarkerAttribute = ({ id, attribute, setAttribute }: Props) => {
    const [sortAttribute, setSortAttribute] = useState<Konva.ShapeConfig>(attribute);
    useEffect(() => {
        const newAttribute = {};
        const keys = Object.keys(attribute);
        let i;
        const len = keys.length;

        keys.sort();

        for (i = 0; i < len; i++) {
            const k = keys[i];
            newAttribute[k] = attribute[k];
        }
        setSortAttribute(newAttribute);
    }, [attribute]);

    return (
        <div className={classes.attributeContainer}>
            <div className={classes.title}>Attribute</div>
            {Object.keys(sortAttribute).map((key) => {
                const RenderComponent =
                    key === 'fill' || key === 'stroke'
                        ? ColorPickerButton
                        : AttributeMapper[typeof sortAttribute[key]];

                if (filterAttribute.includes(key)) {
                    return (
                        <div className={classes.attributeColumn} key={key}>
                            <div className={classes.attributeName}>{key}</div>
                            <RenderComponent
                                customClass={classes.attributeValue}
                                id={id.toString()}
                                value={sortAttribute[key]}
                                onValueChange={(value: number | string | boolean) => {
                                    setAttribute(key, value);
                                }}
                            />
                        </div>
                    );
                }
                return null;
            })}
        </div>
    );
};

export default React.memo(MarkerAttribute);
