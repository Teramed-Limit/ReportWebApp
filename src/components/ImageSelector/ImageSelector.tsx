import React, { useContext } from 'react';

import AutorenewIcon from '@mui/icons-material/Autorenew';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';
import { Badge, Checkbox, IconButton } from '@mui/material';
import { FaMapMarkerAlt } from 'react-icons/fa';

import classes from './ImageSelector.module.scss';
import ImageCanvasModal from '../../container/Modals/ImageCanvasModal/ImageCanvasModal';
import MessageModal from '../../container/Modals/MessageModal/MessageModal';
import { ModalContext } from '../../context/modal-context';
import { CodeList } from '../../interface/code-list';
import BaseLexiconInput from '../UI/BaseLexiconInput/BaseLexiconInput';

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
    onImageMark: (sopInsUid: string, base64: string) => void;
    onClearImageMark: (sopInsUid: string) => void;
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
    onImageMark,
    onClearImageMark,
    onFindingsChange,
    onSitesChange,
    findingsOptions,
    sitesOptions,
    disabled,
    onImageReorder,
}: ImageSelectorProps) => {
    const setModal = useContext(ModalContext);

    const onEditDiagram = () => {
        setModal(
            <ImageCanvasModal
                imageSrc={src}
                initMarkers={[]}
                onExportCanvas={(canvasMarkers, base64) => {
                    onImageMark(id, base64);
                }}
            />,
        );
    };

    const onClearImage = () => {
        setModal(
            <MessageModal
                headerTitle="Message"
                bodyContent="The operation cannot return, are you sure to redraw the image?"
                onConfirmCallback={() => onClearImageMark(id)}
            />,
        );
    };

    return (
        <div
            style={{ width: `calc(${size}% - 4px)`, height: `calc(${size}% - 4px)` }}
            className={classes.container}
            draggable={!disabled}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
                event.preventDefault();
                if (disabled) return;
                onImageReorder(+event.dataTransfer.getData('index'), index);
            }}
        >
            <div className={classes.floatWrapperTopLeft}>
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
            <div className={classes.floatWrapperTopRight}>
                <IconButton
                    style={{ display: disabled ? 'none' : 'unset' }}
                    onClick={onEditDiagram}
                >
                    <FormatPaintIcon color="primary" />
                </IconButton>
                <IconButton
                    style={{ display: disabled ? 'none' : 'unset' }}
                    onClick={() => onClearImage()}
                >
                    <AutorenewIcon color="warning" />
                </IconButton>
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
