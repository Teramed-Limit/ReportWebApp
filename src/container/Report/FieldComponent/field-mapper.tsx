import AsyncLexiconInput from './AsyncLexiconInput/AsyncLexiconInput';
import Checkbox from './Checkbox/Checkbox';
import CodeListLexiconInput from './CodeListLexiconInput/CodeListLexiconInput';
import CodeListSelection from './CodeListSelection/CodeListSelection';
import DatePicker from './DatePicker/DatePicker';
import FetalGrowthChart from './FetalGrowthChart/FetalGrowthChart/FetalGrowthChart';
import { FormFieldType } from './field-type';
import NumberInput from './NumberInput/NumberInput';
import Radio from './Radio/Radio';
import ReportDiagram from './ReportDiagram/ReportDiagram';
import SRConfigTextInput from './SRConfigTextInput/SRConfigTextInput';
import SRTextInput from './SRTextInput/SRTextInput';
import TextArea from './TextArea/TextArea';
import TextInput from './TextInput/TextInput';
import TimePicker from './TimePicker/TimePicker';
import QualityBowelScore from '../../../components/QualityBowelScore/QualityBowelScore';

export const FieldMapper = {
    [FormFieldType.Text]: TextInput,
    [FormFieldType.TextArea]: TextArea,
    [FormFieldType.CodeListSelection]: CodeListSelection,
    [FormFieldType.CodeListLexicon]: CodeListLexiconInput,
    [FormFieldType.AsyncLexicon]: AsyncLexiconInput,
    [FormFieldType.Radio]: Radio,
    [FormFieldType.Number]: NumberInput,
    [FormFieldType.Checkbox]: Checkbox,
    [FormFieldType.QualityBowelScore]: QualityBowelScore,
    [FormFieldType.ReportDiagram]: ReportDiagram,
    [FormFieldType.DatePicker]: DatePicker,
    [FormFieldType.TimePicker]: TimePicker,
    [FormFieldType.SRText]: SRTextInput,
    [FormFieldType.OBGYNChart]: FetalGrowthChart,
};

export const ReportGeneratorFieldMapper = {
    ...FieldMapper,
    [FormFieldType.SRText]: SRConfigTextInput,
};