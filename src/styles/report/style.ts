// Report Page
export const fieldGutter = '2px';
export const compositeFieldSpacing = '4px';
export const labelWidth = '35%';
export const valueWidth = '65%';

// Report Page
export const reportPage = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
};

// Report Section
export const reportSection = {
    width: '100%',
    maxWidth: '100%',
    display: 'inline-flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
};

// Report Subsection
export const reportSubsection = {
    width: '100%',
    maxWidth: '100%',
};

// Field Array
export const fieldArrayContainer = {
    display: 'flex',
};

// Field Section
export const fieldFlex = {
    label: { row: { flex: `0 0 ${labelWidth}` }, column: {} },
    value: { row: { flex: `1 1 ${valueWidth}` }, column: {} },
};

export const fieldSectionContainer = {
    display: 'flex',
    width: '100%',
    flexWrap: 'no-wrap',
};

export const fieldSectionLabel = {
    wordBreak: 'break-word',
    fontWeight: 'bold',
    color: '#3a464d',
    alignSelf: 'flex-start',
};

export const fieldSectionValue = {
    width: '100%',
    display: 'flex',
};

export const fieldButtonBar = {
    display: 'flex',
    alignItems: 'end',
    marginTop: '2px',
};
