import React, { CSSProperties } from 'react';

import cx from 'classnames';
import { observer } from 'mobx-react';

import classes from './FieldsetTemplate.module.scss';

interface Props {
    id: string;
    style: CSSProperties;
    showGuideLine: boolean;
    isFocus: boolean;
    onClick: (e) => void;
    legendComp: React.ReactNode;
    children: React.ReactNode;
}

const FieldsetTemplate = ({
    id,
    style,
    showGuideLine,
    isFocus,
    onClick,
    legendComp,
    children,
}: Props) => {
    const ref = React.useRef<HTMLFieldSetElement>(null);
    const [elementWidth, setElementWidth] = React.useState(0);

    // 使用effect來監控ref並設置寬度
    React.useEffect(() => {
        if (ref.current) {
            // 獲取ref元素的寬度
            const width = ref.current.offsetWidth;
            // 更新狀態
            // 獲取左右兩側的 padding 和 border
            const computedStyle = window.getComputedStyle(ref.current);
            const paddingLeft = parseFloat(computedStyle.paddingLeft);
            const paddingRight = parseFloat(computedStyle.paddingRight);
            const borderLeft = parseFloat(computedStyle.borderLeftWidth);
            const borderRight = parseFloat(computedStyle.borderRightWidth);
            setElementWidth(width - paddingLeft - paddingRight - borderLeft - borderRight);
        }
    }, []);

    return (
        <fieldset
            ref={ref}
            id={id}
            style={style}
            className={cx(classes.fieldset, {
                [classes.focus]: isFocus,
                [classes.guideLine]: !showGuideLine,
            })}
            onClick={(e) => {
                ref?.current?.focus();
                onClick(e);
            }}
        >
            {showGuideLine && <legend style={{ maxWidth: elementWidth }}>{legendComp}</legend>}
            {children}
        </fieldset>
    );
};

export default observer(FieldsetTemplate);
