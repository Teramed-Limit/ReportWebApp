import React, { CSSProperties, useEffect, useRef, useState } from 'react';

import { RepLabelComponent } from '../../../../../interface/rep-report';

interface Props {
    style: CSSProperties;
    component: RepLabelComponent;
    onClick: (e: React.MouseEvent) => void;
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent) => void;
    onMouseEnter: (e: React.MouseEvent) => void;
    onMouseLeave: (e: React.MouseEvent) => void;
    onValueChanged: (uuid: string, value: string) => void;
}

const options = [
    { label: 'Patient Id', value: '{PatientId}' },
    { label: 'Patient Name', value: '{PatientName}' },
    { label: 'Patient Birth', value: '{PatientBirth}' },
    { label: 'Patient Sex', value: '{PatientSex}' },
    { label: 'Accession Number', value: '{AccessionNumber}' },
    { label: 'Study Date', value: '{StudyDate}' },
    { label: 'Study Time', value: '{StudyTime}' },
    { label: 'Study Description', value: '{StudyDescription}' },
    { label: 'Modality', value: '{Modality}' },
    { label: 'Performing Physicians Name', value: '{PerformingPhysiciansName}' },
    { label: 'Name of Physicians Reading', value: '{NameofPhysiciansReading}' },
];

const ReportDynamicLabelComponent = React.forwardRef<HTMLSelectElement, Props>(
    (
        {
            style,
            component,
            onClick,
            onMouseDown,
            onMouseMove,
            onMouseUp,
            onMouseEnter,
            onMouseLeave,
            onValueChanged,
        }: Props,
        ref,
    ) => {
        const autoWidthSelect = useRef<HTMLSelectElement | null>(null);

        const [selectedOpt, setSelectedOpt] = useState<string>(component.value);
        const [autoWidth, setAutoWidth] = useState<number>(0);

        useEffect(() => {
            if (!autoWidthSelect.current) return;
            setAutoWidth(autoWidthSelect.current?.offsetWidth);
        }, []);

        return (
            <>
                <select
                    ref={ref}
                    style={{
                        ...style,
                        border: '0',
                        width: autoWidth,
                        lineHeight: `${component.fontSize}px`,
                        fontSize: `${component.fontSize}px`,
                        fontFamily: component.fontName || 'Microsoft JhengHei',
                        fontWeight: component.fontWeight,
                        fontStyle: component.fontStyle,
                        color: component.fontColor,
                    }}
                    onClick={onClick}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    value={selectedOpt}
                    onContextMenu={(e) => e.preventDefault()}
                    onChange={(e) => {
                        e.stopPropagation();
                        setSelectedOpt(e.target.value);
                        onValueChanged(component.uuid, e.target.value);
                        setTimeout(() => {
                            if (!autoWidthSelect.current) return;
                            setAutoWidth(autoWidthSelect.current?.offsetWidth);
                        });
                    }}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <select
                    ref={autoWidthSelect}
                    style={{
                        width: 'fit-content',
                        visibility: 'hidden',
                        lineHeight: component.fontSize,
                        fontSize: component.fontSize,
                        fontFamily: component.fontName,
                        fontStyle: component.fontStyle,
                        color: component.fontColor,
                    }}
                    value={selectedOpt}
                    onChange={(e) => {
                        e.stopPropagation();
                    }}
                >
                    {options
                        .filter((opt) => opt.value === selectedOpt)
                        .map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                </select>
            </>
        );
    },
);

export default React.memo(ReportDynamicLabelComponent);
