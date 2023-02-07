import { Section, SubSection } from '../../../interface/define';

export class SectionAttribute implements Section {
    id: string;
    hide: boolean;
    label: string;
    type: string;
    maxWidth: string;
    isHeader: boolean;
    subSections: SubSection[];

    constructor(section: Section) {
        this.id = section.id;
        this.hide = section.hide || false;
        this.label = section.label || '';
        this.type = section.type;
        this.maxWidth = section.maxWidth || '';
        this.isHeader = section.isHeader || false;
        this.subSections = section.subSections;
    }
}
