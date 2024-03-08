import React, { useContext, useRef } from 'react';

import AutorenewIcon from '@mui/icons-material/Autorenew';
import FormatPaintIcon from '@mui/icons-material/FormatPaint';
import { Badge, Checkbox, IconButton } from '@mui/material';
import Konva from 'konva';
import { FaMapMarkerAlt } from 'react-icons/fa';

import classes from './ImageSelector.module.scss';
import ImageCanvasModal from '../../container/Modals/ImageCanvasModal/ImageCanvasModal';
import MessageModal from '../../container/Modals/MessageModal/MessageModal';
import { ReportActionContext } from '../../container/Report/Context/reportActionProvider';
import InputFieldContainer from '../../container/Report/Layout/InputFieldContainer/InputFieldContainer';
import { ModalContext } from '../../context/modal-context';
import { useElementSize } from '../../hooks/useElementSize';
import { CanvasMarker } from '../../interface/canvas-maker-attribute';
import { ReportImageData } from '../../interface/document-data';
import { Field } from '../../interface/report-field/field';
import ImagePositionMarkerCanvas from '../ImagePositionMarkerCanvas/ImagePositionMarkerCanvas';

interface ImageSelectorProps {
    id: string;
    fields: Field[];
    imageData: ReportImageData;
    index: number;
    size: number;
    src: string;
    disabled: boolean;
    lockReorder: boolean;
    onImageCheck: (sopInsUid: string, check: boolean) => void;
    onAddImageMark: (
        sopInsUid: string,
        base64: string,
        canvasMarkers: CanvasMarker<Konva.ShapeConfig>[],
    ) => void;
    onClearImageMark: (sopInsUid: string) => void;
    onValueChanged: (sopInsUid: string, id: string, value: any) => void;
    onValueGetter: (sopInsUid: string, id: string) => string;
    onImageReorder: (fromIdx: number, toIdx: number) => void;
}
const ImageSelector = ({
    id,
    index,
    fields,
    imageData,
    size,
    src,
    onImageCheck,
    onAddImageMark,
    onClearImageMark,
    disabled,
    lockReorder,
    onImageReorder,
    onValueChanged,
}: ImageSelectorProps) => {
    const setModal = useContext(ModalContext);

    const containerRef = useRef<HTMLDivElement>(null);
    const { width: containerHeight, height: containerWidth } = useElementSize(containerRef);

    const onEditDiagram = () => {
        if (disabled) return;
        setModal(
            <ImageCanvasModal
                imageSrc={imageData.thumbnailImageSrc}
                initMarkers={imageData?.ImageMarkers || []}
                onExportCanvas={(canvasMarkers, base64) => {
                    onAddImageMark(id, base64, canvasMarkers);
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
                    id={`checkbox_${id}`}
                    disableRipple
                    className={classes.checkboxRoot}
                    disabled={disabled}
                    checked={imageData.IsAttachInReport}
                    size="small"
                    onChange={(event) => onImageCheck(id, event.target.checked)}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                />
                {imageData.MappingNumber === 0 ? null : (
                    <Badge color="secondary" badgeContent={imageData.MappingNumber}>
                        <FaMapMarkerAlt className={classes.icon} />
                    </Badge>
                )}
            </div>
            <div className={classes.floatWrapperTopRight}>
                {!disabled && (
                    <>
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
                    </>
                )}
            </div>
            <div
                ref={containerRef}
                id={id}
                style={{
                    flex: '1 1 auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                draggable={!disabled}
                onClick={onEditDiagram}
                onDragStart={(event) => {
                    event.dataTransfer.setData('sopInsUid', id);
                    event.dataTransfer.setData('index', index.toString());
                }}
            >
                <ImagePositionMarkerCanvas
                    src={src}
                    canvasMarkers={imageData.ImageMarkers || []}
                    imagePositionMarkers={[]}
                    containerWidth={containerWidth}
                    containerHeight={containerHeight}
                    onMarkerPlace={() => {}}
                    onMarkerDelete={() => {}}
                    disabled
                />
            </div>
            {fields.map((field) => {
                return (
                    <InputFieldContainer
                        key={field.id}
                        field={{ ...field, id: `${field.id}_${id}` }}
                        orientation={field.orientation}
                        customValueChange={(_, text: string) => onValueChanged(id, field.id, text)}
                        customValue={imageData[field.id]}
                        actionContext={ReportActionContext}
                    />
                );
            })}
        </div>
    );
};

export default React.memo(ImageSelector);
