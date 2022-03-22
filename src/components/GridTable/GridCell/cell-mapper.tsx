import FileCell from './FileCell/FileCell';
import IconCell from './IconCell/IconCell';
import MultilineTooltipCell from './MultilineTooltipCell/MultilineTooltipCell';
import TooltipCell from './TooltipCell/TooltipCell';

export const CellMapper = {
    icon: IconCell,
    file: FileCell,
    tooltip: TooltipCell,
    multilineTooltip: MultilineTooltipCell,
};
