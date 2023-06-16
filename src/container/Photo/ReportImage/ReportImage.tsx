import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';

import InfoIcon from '@mui/icons-material/Info';
import { observer } from 'mobx-react';
import { first } from 'rxjs/operators';

import classes from './ReportImage.module.scss';
import { fetchDiagram } from '../../../axios/api';
import ImagePositionMarkerCanvas from '../../../components/ImagePositionMarkerCanvas/ImagePositionMarkerCanvas';
import Button from '../../../components/UI/Button/Button';
import { ModalContext } from '../../../context/modal-context';
import { useResize } from '../../../hooks/useResize';
import { CanvasHandle } from '../../../interface/konva-stage-event';
import { useReportDataStore, useReportImageStore } from '../../../models/useStore';
import { convertUrlToBase64, isEmptyOrNil } from '../../../utils/general';
import DiagramSelectModal from '../../Modals/DiagramSelectModal/DiagramSelectModal';
import ImageCanvasModal from '../../Modals/ImageCanvasModal/ImageCanvasModal';

const ReportImage = () => {
    const [imageSrc, setImageSrc] = useState<string>('');
    const [containerHeight, setContainerHeight] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);

    const { valueChanged, modifiable, reportTemplate, diagramData, diagramMarkers } =
        useReportDataStore();
    const {
        imageMarkers,
        onMarkerDelete,
        onMarkerPlace,
        onImageStateInitialize,
        registerDiagramCanvas,
    } = useReportImageStore();

    useResize(() => {
        if (containerRef === null || containerRef.current === null) return;
        setContainerWidth(containerRef.current.offsetWidth);
        setContainerHeight(containerRef.current.offsetHeight);
    });

    const containerRef = useRef<HTMLDivElement>(null);

    const setModal = useContext(ModalContext);

    const fetchReportDiagram = useCallback(
        (openModal: boolean) => {
            fetchDiagram(reportTemplate)
                .pipe(first())
                .subscribe(async (res) => {
                    onImageStateInitialize();
                    if (res.data.length === 1) {
                        const diagramBase64 = await convertUrlToBase64(res.data[0].DiagramUrl);
                        valueChanged('DiagramData', diagramBase64);
                        valueChanged('DiagramMarkers', []);
                        return;
                    }
                    if (openModal) setModal(<DiagramSelectModal diagramList={res.data} />);
                });

            return () => setModal(null);
        },
        [onImageStateInitialize, reportTemplate, setModal, valueChanged],
    );

    useEffect(() => {
        if (!isEmptyOrNil(diagramData)) {
            setImageSrc(diagramData);
            return;
        }
        if (isEmptyOrNil(reportTemplate)) {
            return;
        }
        fetchReportDiagram(false);
    }, [diagramData, reportTemplate, fetchReportDiagram]);

    useEffect(() => {
        if (containerRef === null || containerRef.current === null) return;
        setContainerWidth(containerRef.current.offsetWidth);
        setContainerHeight(containerRef.current.offsetHeight);
    }, []);

    const onNewDiagram = () => {
        fetchReportDiagram(true);
    };

    const onEditDiagram = () => {
        setModal(
            <ImageCanvasModal
                imageSrc={imageSrc}
                initMarkers={diagramMarkers}
                onExportCanvas={(canvasMarkers) => {
                    valueChanged('DiagramMarkers', canvasMarkers);
                }}
            />,
        );
    };

    return (
        <>
            <div className={classes.header}>Report Diagram</div>
            <span className={classes.hint}>
                <InfoIcon />
                Position by dragging the image
            </span>
            <div ref={containerRef} className={classes['image-container']}>
                <ImagePositionMarkerCanvas
                    ref={(canvasHandle: CanvasHandle) => {
                        registerDiagramCanvas(canvasHandle);
                    }}
                    src={imageSrc}
                    canvasMarkers={diagramMarkers}
                    imagePositionMarkers={imageMarkers}
                    containerWidth={containerWidth}
                    containerHeight={containerHeight}
                    disabled={!modifiable}
                    onMarkerPlace={onMarkerPlace}
                    onMarkerDelete={onMarkerDelete}
                />
            </div>
            <div className={classes['bottom-container']}>
                <Button disabled={!modifiable} theme="primary" onClick={onNewDiagram}>
                    Select Diagram
                </Button>
                <Button disabled={!modifiable} theme="primary" onClick={onEditDiagram}>
                    Edit Diagram
                </Button>
            </div>
        </>
    );
};

export default observer(ReportImage);
