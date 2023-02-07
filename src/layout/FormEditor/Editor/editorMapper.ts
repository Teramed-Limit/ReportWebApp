import { FormFieldEditorType } from '../../../interface/form-editor-define';
import CheckboxEdit from './CheckboxEdit/CheckboxEdit';
import DateRangeSelector from './DateRangePicker/DateRangeSelector';
import ImageSelectEdit from './ImageSelectEdit/ImageSelectEdit';
import MultiSelect from './MultiSelect/MultiSelect';
import NumberEdit from './NumberEdit/NumberEdit';
import SingleSelect from './SingleSelect/SingleSelect';
import TextareaEdit from './TextareaEdit/TextareaEdit';
import TextEdit from './TextEdit/TextEdit';

export const EditorMapper = {
    [FormFieldEditorType.Text]: TextEdit,
    [FormFieldEditorType.Number]: NumberEdit,
    [FormFieldEditorType.TextArea]: TextareaEdit,
    [FormFieldEditorType.DataRange]: DateRangeSelector,
    [FormFieldEditorType.ImageSelect]: ImageSelectEdit,
    [FormFieldEditorType.Checkbox]: CheckboxEdit,
    [FormFieldEditorType.SingleSelect]: SingleSelect,
    [FormFieldEditorType.MultiSelect]: MultiSelect,
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
