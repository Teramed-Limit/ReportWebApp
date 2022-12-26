import { getRoot, Instance, types } from 'mst-effect';
import * as R from 'ramda';

import { ReportImageData, ReportMark } from '../interface/document-data';
import { CanvasHandle } from '../interface/konva-stage-event';
import { MarkerPoint } from '../interface/marker';
import { isEmptyOrNil } from '../utils/general';
import { DataStore } from './report-data-model';

const maxSelection = 50;
export const ImageModel = types
    .model('image', {
        images: types.array(types.frozen<ReportImageData>()),
        diagramChanged: types.boolean,
        diagramHandle: types.frozen<CanvasHandle>(),
    })
    .views((self) => {
        return {
            get imageMarkers(): ReportMark[] {
                return self.images.reduce((filtered, item) => {
                    if (item.ReportMark) {
                        filtered.push({
                            ...item.ReportMark,
                            SOPInstanceUID: item.SOPInstanceUID,
                        });
                    }
                    return filtered;
                }, [] as ReportMark[]);
            },
            get imageSelectCount(): number {
                return self.images.filter((image) => {
                    return image.IsAttachInReport;
                }).length;
            },
            get selectedImage(): ReportImageData[] {
                return self.images.filter((image) => {
                    return image.IsAttachInReport;
                });
            },
        };
    })
    /* eslint-disable no-param-reassign */
    .actions((self) => {
        const initImages = (reportImageDataset: ReportImageData[]) => {
            self.images.replace(reportImageDataset);
        };

        const registerDiagramCanvas = (canvasHandle: CanvasHandle) => {
            self.diagramHandle = canvasHandle;
        };

        const exportDiagramUrl = () => {
            if (!self?.diagramHandle) console.warn('Diagram handle not found.');
            if (!self.diagramChanged) return;
            const { valueChanged } = getRoot<any>(self).dataStore as DataStore;
            valueChanged('DiagramData', self.diagramHandle.onExport());
        };

        const deleteMarker = (marker: Partial<ReportMark>): ReportImageData[] => {
            return self.images.map((item) => {
                const deletedMappingNum = +(marker.MappingNumber || 0);
                if (item.SOPInstanceUID === marker.SOPInstanceUID) {
                    return {
                        ...item,
                        IsAttachInReport: false,
                        MappingNumber: 0,
                        ReportMark: undefined,
                    };
                }

                if (item.MappingNumber > deletedMappingNum && item.ReportMark) {
                    return {
                        ...item,
                        MappingNumber: item.MappingNumber - 1,
                        ReportMark: {
                            ...item.ReportMark,
                            MappingNumber: item.MappingNumber - 1,
                        },
                    };
                }
                return item;
            });
        };

        const onMarkerDelete = (marker: ReportMark) => {
            self.diagramChanged = true;
            setReportImage(deleteMarker(marker));
        };

        const onMarkerPlace = (marker: MarkerPoint, sopInstanceUID: string) => {
            self.diagramChanged = true;
            const targetImageIsAttach = self.images.find(
                (image) => image.SOPInstanceUID === sopInstanceUID,
            )?.IsAttachInReport;

            if (
                self.images.filter((image) => image.IsAttachInReport).length >= maxSelection &&
                !targetImageIsAttach
            ) {
                return;
            }

            setReportImage(
                self.images.map((item) => {
                    if (item.SOPInstanceUID === sopInstanceUID) {
                        const newNumber = self.imageMarkers.length + 1;
                        const mappingNumber =
                            item.MappingNumber !== 0 ? item.MappingNumber : newNumber;
                        return {
                            ...item,
                            MappingNumber: mappingNumber,
                            ReportMark: {
                                ...marker,
                                SOPInstanceUID: item.SOPInstanceUID,
                                MappingNumber: mappingNumber,
                            },
                            IsAttachInReport: true,
                        };
                    }
                    return item;
                }),
            );
        };

        const selectAllImage = () => {
            setReportImage(
                self.images.map((image, index) => {
                    // Max selection 50
                    if (index >= maxSelection) {
                        return { ...image };
                    }
                    return { ...image, IsAttachInReport: true };
                }),
            );
        };

        const deselectAllImage = () => {
            setReportImage(
                self.images.map((image) => ({
                    ...image,
                    MappingNumber: 0,
                    ReportMark: undefined,
                    IsAttachInReport: false,
                })),
            );
        };

        const onImageCheck = (sopInsUid: string, check: boolean) => {
            if (
                self.images.filter((image) => image.IsAttachInReport).length >= maxSelection &&
                check
            ) {
                return;
            }

            let updateImage = [...self.images];

            if (!check) {
                const foundImage = updateImage.find((item) => item.SOPInstanceUID === sopInsUid);
                if (
                    foundImage &&
                    foundImage.MappingNumber !== 0 &&
                    !isEmptyOrNil(foundImage.ReportMark)
                ) {
                    updateImage = deleteMarker({
                        SOPInstanceUID: foundImage.SOPInstanceUID,
                        MappingNumber: foundImage.MappingNumber,
                    });
                }
            }
            setReportImage(
                updateImage.map((image) => {
                    if (image.SOPInstanceUID === sopInsUid) {
                        return {
                            ...image,
                            MappingNumber: 0,
                            ReportMark: undefined,
                            IsAttachInReport: check,
                        };
                    }
                    return image;
                }),
            );
        };

        const onFindingsChanged = (sopInsUid: string, findings: string) => {
            setReportImage(
                self.images.map((image) => {
                    if (image.SOPInstanceUID === sopInsUid) {
                        return {
                            ...image,
                            DescriptionOfFindings: findings,
                        };
                    }
                    return image;
                }),
            );
        };

        const onSitesChanged = (sopInsUid: string, sites: string) => {
            setReportImage(
                self.images.map((image) => {
                    if (image.SOPInstanceUID === sopInsUid) {
                        return {
                            ...image,
                            DescriptionOfSites: sites,
                        };
                    }
                    return image;
                }),
            );
        };

        const onImageReorder = (fromIdx: number, toIdx: number) => {
            if (!fromIdx && !toIdx) {
                return;
            }
            setReportImage(R.move(fromIdx, toIdx, self.images));
        };

        const onImageMark = (sopInsUid: string, base64: string) => {
            setReportImage(
                self.images.map((image) => {
                    if (image.SOPInstanceUID === sopInsUid) {
                        return {
                            ...image,
                            EditedImageSrc: base64,
                        };
                    }
                    return image;
                }),
            );
        };

        const onClearImageMark = (sopInsUid: string) => {
            setReportImage(
                self.images.map((image) => {
                    if (image.SOPInstanceUID === sopInsUid) {
                        return {
                            ...image,
                            EditedImageSrc: '',
                        };
                    }
                    return image;
                }),
            );
        };

        const onImageStateInitialize = () => {
            setReportImage(
                self.images.map((item) => ({
                    ...item,
                    IsAttachInReport: false,
                    ReportMark: undefined,
                    MappingNumber: 0,
                })),
            );
        };

        const setReportImage = (imageDatasets: ReportImageData[]) => {
            self.diagramChanged = true;
            self.images.replace(imageDatasets);
            const { valueChanged } = getRoot<any>(self).dataStore as DataStore;
            valueChanged('ReportImageData', imageDatasets);
        };

        return {
            initImages,
            onMarkerDelete,
            onMarkerPlace,
            onImageCheck,
            onImageMark,
            onClearImageMark,
            onFindingsChanged,
            onSitesChanged,
            onImageStateInitialize,
            selectAllImage,
            deselectAllImage,
            onImageReorder,
            setReportImage,
            registerDiagramCanvas,
            exportDiagramUrl,
        };
    });

export type ImageStore = Instance<typeof ImageModel>;
