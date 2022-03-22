import React, { useCallback, useEffect } from 'react';

import { observer } from 'mobx-react';

import { ColonQualityA, ColonQualityB, ColonQualityC, ColonQualityD } from '../../assets';
import { Field } from '../../interface/field';
import { useReportDataStore } from '../../models/useStore';
import Button from '../UI/Button/Button';
import Item from './Item/Item';
import classes from './QualityBowelScore.module.scss';
import RadioGroup from './RadioGroup/RadioGroup';

const optionList = [
    { value: '3', label: '3' },
    { value: '2', label: '2' },
    { value: '1', label: '1' },
    { value: '0', label: '0' },
    { value: '-1', label: 'N/A' },
];

const convertMinusToZero = (num: number) => {
    if (!num || Number.isNaN(num)) {
        return 0;
    }
    return num < 0 ? 0 : num;
};

interface Props {
    field: Field;
    disabled: boolean;
}

const QualityBowelScore = ({ field, disabled }: Props) => {
    const { valueChanged, formData } = useReportDataStore();

    const calculateScore = useCallback(() => {
        const totalScore =
            convertMinusToZero(formData.get('BBPS_Right')) +
            convertMinusToZero(formData.get('BBPS_Transverse')) +
            convertMinusToZero(formData.get('BBPS_Left'));

        valueChanged('QualityBowelScore', totalScore || 0);
    }, [formData, valueChanged]);

    useEffect(() => {
        calculateScore();
    }, [calculateScore]);

    const adequateChanged = formData.get('QualityOfBowelPreparation');
    useEffect(() => {
        calculateScore();
    }, [adequateChanged, calculateScore]);

    const onRadioChange = (id: string, value: string) => {
        valueChanged(id, +value);
        calculateScore();
    };

    const onClear = () => {
        valueChanged('BBPS_Right', 0);
        valueChanged('BBPS_Transverse', 0);
        valueChanged('BBPS_Left', 0);
        // adequate or inadequate
        valueChanged('QualityOfBowelPreparation', '');
        calculateScore();
    };

    return (
        <>
            <div id={field.id} className={classes.container}>
                <div className={classes.header}>
                    Boston Bowel Preparation Scale (Optional)
                    <Button disabled={disabled} theme="primary" onClick={onClear}>
                        Clear
                    </Button>
                </div>
                <div className={classes.gridContainer}>
                    {/* Col-1 */}
                    <Item />
                    <Item comp={<img src={ColonQualityD} alt="" />} />
                    <Item comp={<img src={ColonQualityC} alt="" />} />
                    <Item comp={<img src={ColonQualityB} alt="" />} />
                    <Item comp={<img src={ColonQualityA} alt="" />} />
                    <Item />
                    {/* Col-2 */}
                    <Item>Right</Item>
                    <RadioGroup
                        id="BBPS_Right"
                        disabled={disabled}
                        optionList={optionList}
                        value={String(formData.get('BBPS_Right'))}
                        onChange={(value) => onRadioChange('BBPS_Right', value)}
                    />
                    {/* Col-3 */}
                    <Item>Transverse</Item>
                    <RadioGroup
                        id="BBPS_Transverse"
                        disabled={disabled}
                        optionList={optionList}
                        value={String(formData.get('BBPS_Transverse'))}
                        onChange={(value) => onRadioChange('BBPS_Transverse', value)}
                    />
                    {/* Col-4 */}
                    <Item>Left</Item>
                    <RadioGroup
                        id="BBPS_Left"
                        disabled={disabled}
                        optionList={optionList}
                        value={String(formData.get('BBPS_Left'))}
                        onChange={(value) => onRadioChange('BBPS_Left', value)}
                    />
                </div>
            </div>
            <div className={classes.footer}>Total Score: {formData.get('QualityBowelScore')}</div>
        </>
    );
};

export default observer(QualityBowelScore);
