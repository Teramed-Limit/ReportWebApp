import React, { useEffect, useState } from 'react';

import UndoIcon from '@mui/icons-material/Undo';
import { IconButton, Stack } from '@mui/material';
import * as R from 'ramda';

import classes from './AttributeList.module.scss';
import BaseCheckbox from '../UI/BaseCheckbox/BaseCheckbox';
import BaseNumber from '../UI/BaseNumber/BaseNumber';
import BaseTextInput from '../UI/BaseTextInput/BaseTextInput';

const AttributeMapper = {
    number: BaseNumber,
    string: BaseTextInput,
    boolean: BaseCheckbox,
};

export interface AttributeProps {
    showTitle?: boolean;
    title?: string;
    attribute: any;
    attributeComponentMapper?: {
        [prop: string]: { name: string; component: (...props) => JSX.Element; props?: any }[];
    };
    attributeConstructorMapper?: {
        [prop: string]: any;
    };
    filterType?: 'include' | 'exclude' | 'none';
    includeAttribute?: string[];
    excludeAttribute?: string[];
    setAttribute: (attrName: (string | number)[], attrValue: any) => void;
}

const AttributeList = ({
    showTitle = true,
    title = 'Attribute',
    attribute,
    attributeComponentMapper,
    attributeConstructorMapper,
    filterType = 'none',
    includeAttribute,
    excludeAttribute,
    setAttribute,
}: AttributeProps) => {
    const [currentLayer, setLayer] = useState<number>(0);
    const [rootAttribute, setRootAttribute] = useState<any>(attribute);
    const [currentAttribute, setCurrentAttribute] = useState<any>(attribute);
    const [currentPath, setCurrentPath] = useState<(string | number)[]>([]);

    useEffect(() => {
        const newAttribute = {};
        const attributeKeys = Object.keys(attribute);
        const len = attributeKeys.length;

        // sorted
        attributeKeys.sort();
        for (let i = 0; i < len; i++) {
            const k = attributeKeys[i];
            newAttribute[k] = attribute[k];
        }

        if (currentLayer !== 0) {
            // 是空的就回到第一層
            if (!R.path(currentPath, newAttribute)) {
                setRootAttribute(newAttribute);
                setCurrentAttribute(newAttribute);
                setCurrentPath([]);
                setLayer(0);
                return;
            }
            setRootAttribute(newAttribute);
            setCurrentAttribute(R.path(currentPath, newAttribute) || {});
        } else {
            setRootAttribute(newAttribute);
            setCurrentAttribute(newAttribute);
            setLayer(0);
        }
    }, [attribute, currentLayer, currentPath]);

    const nextLayer = (key: string | number) => {
        const parsed: string | number = Number.isNaN(key) ? key : Number(key);
        const path = R.append(parsed, currentPath);
        if (!R.path(path, rootAttribute)) return;
        setLayer((prev) => prev + 1);
        setCurrentPath(path);
        setCurrentAttribute(R.path(path, rootAttribute));
    };

    const previousLayer = () => {
        const path = R.dropLast(1, currentPath);
        setLayer((prev) => prev - 1);
        setCurrentPath(path);
        setCurrentAttribute(R.path(path, rootAttribute));
    };

    return (
        <>
            {showTitle && (
                <Stack flexDirection="row" className={classes.title}>
                    <div>{title}</div>
                    {currentLayer > 0 && (
                        <IconButton
                            className={classes.absolute_l_t}
                            size="small"
                            color="primary"
                            onClick={() => previousLayer()}
                        >
                            <UndoIcon />
                        </IconButton>
                    )}
                </Stack>
            )}
            {Object.keys(currentAttribute).map((key) => {
                let renderProps: any;
                let RenderComponent;

                // 多層的名字判斷
                const compKey = R.append(key, currentPath).join('.');

                // 客製化欄位
                if (attributeComponentMapper?.[key]) {
                    const listOfRenderComp = attributeComponentMapper?.[key];
                    const defaultComp = listOfRenderComp?.find((x) => x.name === '');

                    // 預設
                    if (defaultComp) {
                        RenderComponent = defaultComp.component;
                        renderProps = { ...defaultComp?.props, currentPath } || {};
                    }

                    // 上層的名字對應
                    const lastElement = currentPath[currentPath.length - 1];
                    const targetComp = listOfRenderComp?.find((x) => x.name === lastElement);
                    if (targetComp) {
                        RenderComponent = targetComp.component;
                        renderProps = { ...targetComp?.props, currentPath } || {};
                    }
                }
                // 客製化欄位建構
                else if (attributeConstructorMapper?.[compKey] && !currentAttribute[key]) {
                    RenderComponent = () => (
                        <button
                            type="button"
                            onClick={() => {
                                const constructAttribute = attributeConstructorMapper[compKey];
                                setLayer((prev) => prev + 1);
                                setCurrentPath([key]);
                                setCurrentAttribute(constructAttribute);
                                setAttribute([...currentPath, key], constructAttribute);
                            }}
                        >
                            Construct
                        </button>
                    );
                }
                // 沒有宣告客製化的欄位且形態為Object
                else if (typeof currentAttribute[key] === 'object') {
                    RenderComponent = () => (
                        <button type="button" onClick={() => nextLayer(key)}>
                            Details
                        </button>
                    );
                }
                // 一般欄位
                else {
                    RenderComponent = AttributeMapper[typeof currentAttribute[key]];
                }

                const comp = (
                    <div className={classes.attributeColumn} key={key}>
                        <div className={classes.attributeName}>{key}</div>
                        {RenderComponent && (
                            <div className={classes.attributeValue}>
                                <RenderComponent
                                    {...renderProps}
                                    value={currentAttribute[key]}
                                    onValueChange={(value: any) => {
                                        setCurrentAttribute((prev) => {
                                            return R.assocPath([key], value, prev);
                                        });
                                        setAttribute([...currentPath, key], value);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                );

                if (includeAttribute && excludeAttribute) {
                    console.warn('include 和 exclude 不能同時擁有');
                    return null;
                }

                if (filterType === 'none') return comp;
                if (filterType === 'include') {
                    if (includeAttribute?.includes(key)) return comp;
                } else if (filterType === 'exclude') {
                    if (!excludeAttribute?.includes(key)) return comp;
                }

                return null;
            })}
        </>
    );
};

export default React.memo(AttributeList);
