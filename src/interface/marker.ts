export interface ImageMarker extends MarkerPoint, MarkerPosition {
    id: string;
    markerText: string;
}

export interface MarkerPoint {
    PointX: number;
    PointY: number;
    PointInImageX: number;
    PointInImageY: number;
}

export interface MarkerPosition {
    top: number;
    left: number;
}

export type ImagePosition = {
    top: number;
    left: number;
    width: number;
    height: number;
};

export type MousePosition = {
    clientX: number;
    pageY: number;
};
