import ButtonCell from './ButtonCell/ButtonCell';
import CheckboxCell from './CheckboxCell/CheckboxCell';
import ChipCell from './ChipCell/ChipCell';
import DeleteRowCell from './DeleteRowCell/DeleteRowCell';
import EditRowCell from './EditRowCell/EditRowCell';
import FileCell from './FileCell/FileCell';
import IconButtonCell from './IconButtonCell/IconButtonCell';
import IconCell from './IconCell/IconCell';
import ImageCell from './ImageCell/ImageCell';
import LinkCell from './LinkCell/LinkCell';
import MultilineTooltipCell from './MultilineTooltipCell/MultilineTooltipCell';
import StatusChipCell from './StatusChipCell/StatusChipCell';
import TooltipCell from './TooltipCell/TooltipCell';

export const CellMapper = {
    icon: IconCell,
    file: FileCell,
    tooltip: TooltipCell,
    multilineTooltip: MultilineTooltipCell,
    chipRenderer: ChipCell,
    checkboxRenderer: CheckboxCell,
    buttonRenderer: ButtonCell,
    iconButtonRenderer: IconButtonCell,
    linkRenderer: LinkCell,
    statusRenderer: StatusChipCell,
    editRowRenderer: EditRowCell,
    deleteRowRenderer: DeleteRowCell,
    imageRowRenderer: ImageCell,
};
