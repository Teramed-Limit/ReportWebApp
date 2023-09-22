import React, { useContext } from 'react';

import AutorenewIcon from '@mui/icons-material/Autorenew';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';
import { Badge, Checkbox, IconButton } from '@mui/material';
import { FaMapMarkerAlt } from 'react-icons/fa';

import classes from './ImageSelector.module.scss';
import ImageCanvasModal from '../../container/Modals/ImageCanvasModal/ImageCanvasModal';
import MessageModal from '../../container/Modals/MessageModal/MessageModal';
import { ReportActionContext } from '../../container/Report/Context/reportActionProvider';
import InputFieldContainer from '../../container/Report/Layout/InputFieldContainer/InputFieldContainer';
import { ModalContext } from '../../context/modal-context';
import { Field } from '../../interface/report-field/field';

interface ImageSelectorProps {
    id: string;
    fields: Field[];
    index: number;
    size: number;
    src: string;
    checked?: boolean;
    markerMappingNumber: number;
    disabled: boolean;
    lockReorder: boolean;
    onImageCheck: (sopInsUid: string, check: boolean) => void;
    onImageMark: (sopInsUid: string, base64: string) => void;
    onClearImageMark: (sopInsUid: string) => void;
    onValueChanged: (sopInsUid: string, id: string, value: any) => void;
    onValueGetter: (sopInsUid: string, id: string) => string;
    onImageReorder: (fromIdx: number, toIdx: number) => void;
}
const ImageSelector = ({
    id,
    index,
    fields,
    size,
    src,
    checked,
    markerMappingNumber,
    onImageCheck,
    onImageMark,
    onClearImageMark,
    disabled,
    lockReorder,
    onImageReorder,
    onValueChanged,
    onValueGetter,
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
            style={{ width: `calc(${size}%)`, height: `calc(${size}%)` }}
            className={classes.container}
            draggable={false}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
                event.preventDefault();
                if (disabled) return;
                if (lockReorder) return;
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
                style={{ maxHeight: `calc(100% - 36px * ${fields.length})` }}
                className={classes.image}
                id={id}
                loading="lazy"
                src={src}
                alt=""
                draggable={!disabled}
                onClick={onEditDiagram}
                onDragStart={(event) => {
                    event.dataTransfer.setData('sopInsUid', id);
                    event.dataTransfer.setData('index', index.toString());
                }}
            />
            {fields.map((field) => {
                return (
                    <InputFieldContainer
                        key={field.id}
                        field={field}
                        orientation={field.orientation}
                        customValueChange={(_, text: string) => onValueChanged(id, field.id, text)}
                        customValueGetter={(_) => onValueGetter(id, field.id)}
                        actionContext={ReportActionContext}
                    />
                );
            })}
        </div>
    );
};

export default React.memo(ImageSelector);
