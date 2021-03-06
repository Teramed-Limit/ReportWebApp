import ButtonCell from './ButtonCell/ButtonCell';
import CheckboxCell from './CheckboxCell/CheckboxCell';
import ChipCell from './ChipCell/ChipCell';
import DeleteRowCell from './DeleteRowCell/DeleteRowCell';
import EditRowCell from './EditRowCell/EditRowCell';
import FileCell from './FileCell/FileCell';
import IconCell from './IconCell/IconCell';
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
    linkRenderer: LinkCell,
    statusRenderer: StatusChipCell,
    editRowRenderer: EditRowCell,
    deleteRowRenderer: DeleteRowCell,
};
