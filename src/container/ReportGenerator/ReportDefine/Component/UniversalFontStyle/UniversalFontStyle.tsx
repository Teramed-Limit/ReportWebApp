import React, { useState } from 'react';

import { Button, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { observer } from 'mobx-react';
import { useSetRecoilState } from 'recoil';

import classes from './UniversalFontStyle.module.scss';
import {
    selectedReportDefine,
    selectedReportImageDefine,
} from '../../../../../atom/report-generator';
import ColorPickerButton from '../../../../../components/ColorPickerButton/ColorPickerButton';
import BaseNumber from '../../../../../components/UI/BaseNumber/BaseNumber';
import { deepCopy } from '../../../../../utils/general';
import FontNameSelection from '../../Attribute/Common/FontNameSelection/FontNameSelection';
import FontWeightSelection from '../../Attribute/Common/FontWeightSelection/FontWeightSelection';

interface Props {
    title: string;
    styleKey: string;
}

const UniversalFontStyle = ({ title, styleKey }: Props) => {
    const setFormDefine = useSetRecoilState(selectedReportDefine);
    const setImageDefine = useSetRecoilState(selectedReportImageDefine);
    const [fontStyle, setFontStyle] = useState({
        fontFamily: 'Noto Sans TC',
        fontSize: '10',
        fontWeight: 'bold',
        color: 'black',
    });

    function updateValueStyleId(obj, prop, value) {
        if (Array.isArray(obj)) {
            for (let i = 0; i < obj.length; i++) {
                updateValueStyleId(obj[i], prop, value);
            }
        } else if (typeof obj === 'object' && obj !== null) {
            if (obj?.hasOwnProperty(styleKey)) {
                obj[styleKey][prop] = value;
            }

            // 遍歷物件的其他屬性
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    updateValueStyleId(obj[key], prop, value);
                }
            }
        }
        return obj;
    }

    const setGlobalFontStyle = (prop: string, value: any) => {
        setFontStyle((prev) => {
            return { ...prev, [prop]: value };
        });
        setFormDefine((prev) => {
            return updateValueStyleId(deepCopy(prev), prop, value);
        });
        setImageDefine((prev) => {
            return updateValueStyleId(deepCopy(prev), prop, value);
        });
    };

    return (
        <Stack direction="column" spacing="2px">
            <Typography variant="h6" component="div">
                {title}
                <Button
                    sx={{ marginLeft: '10px' }}
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        setGlobalFontStyle('fontFamily', fontStyle.fontFamily);
                        setGlobalFontStyle('fontSize', fontStyle.fontSize);
                        setGlobalFontStyle('fontWeight', fontStyle.fontWeight);
                        setGlobalFontStyle('color', fontStyle.color);
                    }}
                >
                    Apply
                </Button>
            </Typography>
            <Stack direction="row" spacing="4px">
                <div style={{ width: '150px' }} className={classes.input}>
                    <FontNameSelection
                        value={fontStyle.fontFamily}
                        onValueChange={(val) => setGlobalFontStyle('fontFamily', val)}
                    ></FontNameSelection>
                </div>

                <div style={{ width: '50px' }} className={classes.input}>
                    <BaseNumber
                        value={fontStyle.fontSize}
                        onValueChange={(val) => setGlobalFontStyle('fontSize', val)}
                    />
                </div>

                <div style={{ width: '100px' }} className={classes.input}>
                    <FontWeightSelection
                        value={fontStyle.fontWeight}
                        onValueChange={(val) => setGlobalFontStyle('fontWeight', val)}
                    ></FontWeightSelection>
                </div>

                <div style={{ width: '70px' }} className={classes.input}>
                    <ColorPickerButton
                        key="color"
                        value={fontStyle.color}
                        onValueChange={(val) => setGlobalFontStyle('color', val)}
                    />
                </div>
            </Stack>
        </Stack>
    );
};

export default observer(UniversalFontStyle);
