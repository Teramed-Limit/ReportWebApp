import { MarkerType } from '../../../interface/canvas-maker-attribute';
import ArrowMarker from './ArrowMarker/ArrowMarker';
import CircleMarker from './CircleMarker/CircleMarker';
import FreeDrawLineMarker from './FreeDrawLineMarker/FreeDrawLineMarker';
import SquareMarker from './SquareMarker/SquareMarker';
import TextMarker from './TextMarker/TextMarker';

export const MarkerMapper = {
    [MarkerType.Text]: TextMarker,
    [MarkerType.Circle]: CircleMarker,
    [MarkerType.Square]: SquareMarker,
    [MarkerType.Arrow]: ArrowMarker,
    [MarkerType.FreeDraw]: FreeDrawLineMarker,
};

export const NodeEnableMapper = {
    [MarkerType.None]: false,
    [MarkerType.Text]: true,
    [MarkerType.Circle]: true,
    [MarkerType.Square]: true,
    [MarkerType.Arrow]: true,
    [MarkerType.FreeDraw]: false,
};
