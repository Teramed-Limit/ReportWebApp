import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';

import InfoIcon from '@mui/icons-material/Info';
import { observer } from 'mobx-react';
import { first } from 'rxjs/operators';

import { fetchDiagram } from '../../../axios/api';
import ImagePositionMarkerCanvas from '../../../components/ImagePositionMarkerCanvas/ImagePositionMarkerCanvas';
import Button from '../../../components/UI/Button/Button';
import { ModalContext } from '../../../context/modal-context';
import { useResize } from '../../../hooks/useResize';
import { CanvasHandle } from '../../../interface/konva-stage-event';
import { useReportDataStore, useReportImageStore } from '../../../models/useStore';
import { isEmptyOrNil } from '../../../utils/general';
import DiagramSelectModal from '../../Modals/DiagramSelectModal/DiagramSelectModal';
import ImageCanvasModal from '../../Modals/ImageCanvasModal/ImageCanvasModal';
import classes from './ReportImage.module.scss';

const ReportImage = () => {
    const [imageSrc, setImageSrc] = useState<string>('');
    const [containerHeight, setContainerHeight] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);

    const { valueChanged, modifiable, reportTemplate, diagramData } = useReportDataStore();
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
        (ers: string) => {
            fetchDiagram(ers)
                .pipe(first())
                .subscribe((res) => {
                    onImageStateInitialize();
                    if (res.data.length === 1) {
                        valueChanged('DiagramData', res.data[0].DiagramData);
                        return;
                    }
                    setModal(<DiagramSelectModal diagramList={res.data} />);
                });

            return () => setModal(null);
        },
        [onImageStateInitialize, setModal, valueChanged],
    );

    useEffect(() => {
        if (!isEmptyOrNil(diagramData)) {
            setImageSrc(`data:image/jpeg;base64, ${diagramData}`);
            return;
        }
        if (isEmptyOrNil(reportTemplate)) {
            fetchReportDiagram('BLANK');
            return;
        }
        fetchReportDiagram(reportTemplate);
    }, [diagramData, reportTemplate, fetchReportDiagram]);

    useEffect(() => {
        if (containerRef === null || containerRef.current === null) return;
        setContainerWidth(containerRef.current.offsetWidth);
        setContainerHeight(containerRef.current.offsetHeight);
    }, []);

    const onBlankDiagram = () => {
        fetchReportDiagram('BLANK');
    };

    const onNewDiagram = () => {
        fetchReportDiagram(reportTemplate);
    };

    const onEditDiagram = () => {
        setModal(<ImageCanvasModal imageSrc={imageSrc} />);
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
                    ref={(canvasHandle: CanvasHandle) => registerDiagramCanvas(canvasHandle)}
                    src={imageSrc}
                    markers={imageMarkers}
                    containerWidth={containerWidth}
                    containerHeight={containerHeight}
                    disabled={!modifiable}
                    onMarkerPlace={onMarkerPlace}
                    onMarkerDelete={onMarkerDelete}
                />
            </div>
            <div className={classes['bottom-container']}>
                <Button disabled={!modifiable} theme="primary" onClick={onBlankDiagram}>
                    Blank Diagram
                </Button>
                <Button disabled={!modifiable} theme="primary" onClick={onNewDiagram}>
                    New Diagram
                </Button>
                <Button disabled={!modifiable} theme="primary" onClick={onEditDiagram}>
                    Edit Diagram
                </Button>
            </div>
        </>
    );
};

export default observer(ReportImage);
