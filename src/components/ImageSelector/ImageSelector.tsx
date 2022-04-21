import React from 'react';

import { Badge, Checkbox } from '@mui/material';
import { FaMapMarkerAlt } from 'react-icons/all';

import { OptionSource } from '../../interface/selection-field';
import BaseLexiconInput from '../UI/BaseLexiconInput/BaseLexiconInput';
import classes from './ImageSelector.module.scss';

interface ImageSelectorProps {
    id: string;
    index: number;
    size: number;
    src: string;
    checked?: boolean;
    findings: string;
    options: any[];
    optionSource: OptionSource<any>;
    markerMappingNumber: number;
    disabled: boolean;
    onImageCheck: (sopInsUid: string, check: boolean) => void;
    onFindingsChange: (sopInsUid: string, findings: string) => void;
    onImageReorder: (fromIdx: number, toIdx: number) => void;
}

const ImageSelector = ({
    id,
    index,
    size,
    src,
    checked,
    findings,
    markerMappingNumber,
    onImageCheck,
    onFindingsChange,
    options,
    optionSource,
    disabled,
    onImageReorder,
}: ImageSelectorProps) => {
    return (
        <div
            style={{ width: `${size}%`, height: `${size}%` }}
            className={classes.container}
            draggable={!disabled}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
                event.preventDefault();
                if (disabled) return;
                onImageReorder(+event.dataTransfer.getData('index'), index);
            }}
        >
            <div className={classes.floatWrapper}>
                <Checkbox
                    disableRipple
                    className={classes.checkboxRoot}
                    disabled={disabled}
                    checked={checked}
                    size="small"
                    onChange={(event) => onImageCheck(id, event.target.checked)}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                />
                {markerMappingNumber === 0 ? null : (
                    <Badge color="secondary" badgeContent={markerMappingNumber}>
                        <FaMapMarkerAlt className={classes.icon} />
                    </Badge>
                )}
            </div>

            <img
                className={classes.image}
                id={id}
                loading="lazy"
                src={src}
                alt=""
                draggable={!disabled}
                onDragStart={(event) => {
                    event.dataTransfer.setData('sopInsUid', id);
                    event.dataTransfer.setData('index', index.toString());
                }}
            />

            <label className={classes.label}>
                <span>Findings:</span>
                <BaseLexiconInput
                    id={id}
                    disabled={disabled}
                    cssClass={{
                        container: classes['lexicon-container'],
                        input: classes['lexicon-input'],
                    }}
                    value={findings}
                    valueKey={optionSource.labelKey || 'Name'}
                    optionKey={optionSource.key || 'Code'}
                    onValueChange={(str) => onFindingsChange(id, str)}
                    initialLexiconList={options}
                    getOptionLabel={(option) => option[optionSource.labelKey || 'Name']}
                />
            </label>
        </div>
    );
};

export default React.memo(ImageSelector);
