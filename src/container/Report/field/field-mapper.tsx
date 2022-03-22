import QualityBowelScore from '../../../components/QualityBowelScore/QualityBowelScore';
import AsyncLexiconInput from './AsyncLexiconInput/AsyncLexiconInput';
import Checkbox from './Checkbox/Checkbox';
import { FormFieldType } from './field-type';
import LexiconInput from './LexiconInput/LexiconInput';
import NumberInput from './NumberInput/NumberInput';
import Radio from './Radio/Radio';
import Selection from './Selection/Selection';
import TextArea from './TextArea/TextArea';
import TextInput from './TextInput/TextInput';

export const FieldMapper = {
    [FormFieldType.Text]: TextInput,
    [FormFieldType.TextArea]: TextArea,
    [FormFieldType.Selection]: Selection,
    [FormFieldType.Lexicon]: LexiconInput,
    [FormFieldType.AsyncLexicon]: AsyncLexiconInput,
    [FormFieldType.Radio]: Radio,
    [FormFieldType.Number]: NumberInput,
    [FormFieldType.Checkbox]: Checkbox,
    [FormFieldType.QualityBowelScore]: QualityBowelScore,
};
