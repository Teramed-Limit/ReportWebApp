import React from 'react';

import { Badge, Checkbox } from '@mui/material';
import { FaMapMarkerAlt } from 'react-icons/fa';

import { CodeList } from '../../interface/code-list';
import BaseLexiconInput from '../UI/BaseLexiconInput/BaseLexiconInput';
import classes from './ImageSelector.module.scss';

interface ImageSelectorProps {
    id: string;
    index: number;
    size: number;
    src: string;
    checked?: boolean;
    sites: string;
    findings: string;
    findingsOptions: CodeList[];
    sitesOptions: CodeList[];
    markerMappingNumber: number;
    disabled: boolean;
    onImageCheck: (sopInsUid: string, check: boolean) => void;
    onFindingsChange: (sopInsUid: string, findings: string) => void;
    onSitesChange: (sopInsUid: string, sites: string) => void;
    onImageReorder: (fromIdx: number, toIdx: number) => void;
}

const ImageSelector = ({
    id,
    index,
    size,
    src,
    checked,
    sites,
    findings,
    markerMappingNumber,
    onImageCheck,
    onFindingsChange,
    onSitesChange,
    findingsOptions,
    sitesOptions,
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
                <span>Sites:</span>
                <BaseLexiconInput
                    id={id}
                    cssClass={{
                        container: classes['lexicon-container'],
                        input: classes['lexicon-input'],
                    }}
                    disabled={disabled}
                    value={sites}
                    valueKey="Value"
                    optionKey="Id"
                    onValueChange={(str) => onSitesChange(id, str)}
                    initialLexiconList={sitesOptions}
                    getOptionLabel={(option: CodeList) => option.Value}
                    showTooltip={false}
                />
            </label>
            <label className={classes.label}>
                <span>Findings:</span>
                <BaseLexiconInput
                    id={id}
                    cssClass={{
                        container: classes['lexicon-container'],
                        input: classes['lexicon-input'],
                    }}
                    disabled={disabled}
                    value={findings}
                    valueKey="Value"
                    optionKey="Id"
                    onValueChange={(str) => onFindingsChange(id, str)}
                    initialLexiconList={findingsOptions}
                    getOptionLabel={(option: CodeList) => option.Value}
                    showTooltip={false}
                />
            </label>
        </div>
    );
};

export default React.memo(ImageSelector);
