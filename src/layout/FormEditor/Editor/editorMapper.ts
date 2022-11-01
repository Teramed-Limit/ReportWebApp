import CheckboxEdit from './CheckboxEdit/CheckboxEdit';
import DateRangeSelector from './DateRangePicker/DateRangeSelector';
import ImageSelectEdit from './ImageSelectEdit/ImageSelectEdit';
import MultiSelect from './MultiSelect/MultiSelect';
import NumberEdit from './NumberEdit/NumberEdit';
import SingleSelect from './SingleSelect/SingleSelect';
import TextareaEdit from './TextareaEdit/TextareaEdit';
import TextEdit from './TextEdit/TextEdit';

export const EditorMapper = {
    Text: TextEdit,
    Number: NumberEdit,
    Textarea: TextareaEdit,
    DataRange: DateRangeSelector,
    ImageSelect: ImageSelectEdit,
    Checkbox: CheckboxEdit,
    SingleSelect,
    MultiSelect,
};

export const EditorDefaultValue = {
    Text: '',
    Number: 0,
    Textarea: '',
    DataRange: '',
    Checkbox: '',
    MultiSelect: [],
    SingleSelect: '',
    ImageSelect: '',
};
