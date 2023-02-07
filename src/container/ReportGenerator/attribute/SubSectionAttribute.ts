import { SubSection } from '../../../interface/define';
import { Field } from '../../../interface/field';

export class SubSectionAttribute implements SubSection {
    id: string;
    maxWidth?: string;
    fields: Field[];

    constructor(subSection: SubSection) {
        this.id = subSection.id;
        this.maxWidth = subSection.maxWidth || '';
        this.fields = subSection.fields || [];
    }
}
