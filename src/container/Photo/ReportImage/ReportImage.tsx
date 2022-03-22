import React, { useCallback, useContext, useEffect, useState } from 'react';

import { observer } from 'mobx-react';
import { first } from 'rxjs/operators';

import { fetchDiagram } from '../../../axios/api';
import MarkerCanvas from '../../../components/MarkerCanvas/MarkerCanvas';
import Button from '../../../components/UI/Button/Button';
import { ModalContext } from '../../../context/modal-context';
import { useReportDataStore, useReportImageStore } from '../../../models/useStore';
import { isEmptyOrNil } from '../../../utils/general';
import DiagramSelectModal from '../../Modals/DiagramSelectModal/DiagramSelectModal';
import ImageCanvasModal from '../../Modals/ImageCanvasModal/ImageCanvasModal';
import classes from './ReportImage.module.scss';

const ReportImage = () => {
    const [imageSrc, setImageSrc] = useState<string>('');
    const { valueChanged, reportDisabled, ersType, diagramData } = useReportDataStore();
    const {
        imageMarkers,
        onMarkerDelete,
        onMarkerPlace,
        onImageStateInitialize,
    } = useReportImageStore();

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
            setImageSrc(`data:image/jpg;base64, ${diagramData}`);
            return;
        }
        if (isEmptyOrNil(ersType)) {
            return;
        }
        fetchReportDiagram(ersType);
    }, [diagramData, ersType, fetchReportDiagram]);

    const onBlankDiagram = () => {
        fetchReportDiagram('BLANK');
    };

    const onNewDiagram = () => {
        fetchReportDiagram(ersType);
    };

    const onEditDiagram = () => {
        setModal(<ImageCanvasModal imageSrc={imageSrc} />);
    };

    return (
        <>
            <div className={classes['image-container']}>
                <MarkerCanvas
                    src={imageSrc}
                    alt=""
                    reportMarkers={imageMarkers}
                    onDeleteMarker={onMarkerDelete}
                    onAddMarker={onMarkerPlace}
                    disabled={reportDisabled}
                />
            </div>
            <div className={classes['bottom-container']}>
                <Button disabled={reportDisabled} theme="primary" onClick={onBlankDiagram}>
                    Blank Diagram
                </Button>
                <Button disabled={reportDisabled} theme="primary" onClick={onNewDiagram}>
                    New Diagram
                </Button>
                <Button disabled={reportDisabled} theme="primary" onClick={onEditDiagram}>
                    Edit Diagram
                </Button>
            </div>
        </>
    );
};

export default observer(ReportImage);
