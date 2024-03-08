import Konva from 'konva';
import { ModelProperties } from 'mobx-state-tree/dist/types/complex-types/model';
import { IArrayType, IModelType, Instance, ISimpleType, IType } from 'mst-effect';

import { CanvasMarker } from '../../interface/canvas-maker-attribute';
import { ReportImageData, ReportMark } from '../../interface/document-data';
import { CanvasHandle } from '../../interface/konva-stage-event';

interface ImageTypeOfModal extends ModelProperties {
    images: IArrayType<IType<ReportImageData, ReportImageData, ReportImageData>>;
    diagramHandle: IType<CanvasHandle, CanvasHandle, CanvasHandle>;
    diagramChanged: ISimpleType<unknown>;
}

interface ImageTypeOfActions {
    readonly imageMarkers: ReportMark[];
    readonly imageSelectCount: number;
    readonly selectedImage: ReportImageData[];
    initImages: (reportImageDataset: ReportImageData[]) => void;
    onMarkerDelete: (marker: ReportMark) => void;
    onImageCheck: (sopInsUid: string, check: boolean) => void;
    onImageReorder: (fromIdx: number, toIdx: number) => void;
    exportDiagramUrl: () => string;
    onImageMark: (
        sopInsUid: string,
        base64: string,
        canvasMarkers: CanvasMarker<Konva.ShapeConfig>[],
    ) => void;
    onValueChanged: (sopInsUid: string, id: string, value: any) => void;
    onValueGetter: (sopInsUid: string, id: string) => any;
    selectAllImage: () => void;
    registerDiagramCanvas: (canvasHandle: CanvasHandle) => void;
    deselectAllImage: () => void;
    setReportImage: (imageDatasets: ReportImageData[]) => void;
}

export type ImageTypeOfModel = ImageTypeOfModal & ImageTypeOfActions;

export type ImagesModal = IModelType<ImageTypeOfModal, ImageTypeOfActions, any, any>;

export type ImageStore = Instance<ImagesModal>;
