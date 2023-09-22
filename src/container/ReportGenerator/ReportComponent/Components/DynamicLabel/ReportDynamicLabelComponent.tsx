import React, { CSSProperties, useEffect, useRef, useState } from 'react';

import { RepLabelComponent } from '../../../../../interface/report-generator/component/rep-label-component';

interface Props {
    style: CSSProperties;
    scale: number;
    component: RepLabelComponent;
    onClick: (e: React.MouseEvent) => void;
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent) => void;
    onMouseEnter: (e: React.MouseEvent) => void;
    onMouseLeave: (e: React.MouseEvent) => void;
    onValueChanged: (uuid: string, attrPath: (string | number)[], value: string) => void;
}

const options = [
    { label: 'Patient Id', value: 'PatientId' },
    { label: 'Patient Name', value: 'PatientsName' },
    { label: 'Patient Birth', value: 'PatientsBirthDate' },
    { label: 'Patient Age', value: 'PatientsAge' },
    { label: 'Patient Sex', value: 'PatientsSex' },
    { label: 'Accession Number', value: 'AccessionNumber' },
    { label: 'Study Date', value: 'StudyDate' },
    { label: 'Study Description', value: 'StudyDescription' },
    { label: 'Modality', value: 'Modality' },
    { label: 'Performing Physician Name', value: 'PerformingPhysiciansName' },
    { label: 'Name of Physician Reading', value: 'NameofPhysiciansReading' },
    { label: 'Referring Physicians Name', value: 'ReferringPhysiciansName' },
    { label: 'Author', value: 'Author' },
    { label: 'ReportTemplate', value: 'ReportTemplate' },
    { label: 'Doctor Name', value: 'DoctorEName' },
    { label: 'Summary', value: 'Summary' },
    { label: 'Title', value: 'Title' },
    { label: 'JobTitle', value: 'JobTitle' },
];

const ReportDynamicLabelComponent = React.forwardRef<HTMLSelectElement, Props>(
    // 接收傳遞進來的 props 和 ref
    (
        {
            style,
            scale,
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
        // 使用 useRef 創建一個 autoWidthSelect ref
        const autoWidthSelect = useRef<HTMLSelectElement | null>(null);

        const [selectedOpt, setSelectedOpt] = useState<string>(component.value); // 儲存選擇的選項值
        const [autoWidth, setAutoWidth] = useState<number>(0); // 儲存動態計算的寬度

        // 計算動態寬度
        useEffect(() => {
            if (!autoWidthSelect.current) return;
            setAutoWidth(autoWidthSelect.current?.offsetWidth);
        }, []);

        return (
            <>
                {/* 第一個 select 是主要顯示用的下拉選單 */}
                <select
                    ref={ref}
                    style={{
                        ...style,
                        border: '0',
                        width: autoWidth,
                        fontSize: `${component.fontSize * scale}px`,
                        fontFamily: component.fontName || 'Arial',
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
                        onValueChanged(component.uuid, ['value'], e.target.value);
                        setTimeout(() => {
                            if (!autoWidthSelect.current) return;
                            setAutoWidth(autoWidthSelect.current?.offsetWidth);
                        });
                    }}
                >
                    {/* 根據 options 陣列動態生成下拉選單的選項 */}
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {/* 第二個 select 是為了計算動態寬度而隱藏的下拉選單 */}
                <select
                    ref={autoWidthSelect}
                    style={{
                        width: 'fit-content',
                        visibility: 'hidden',
                        lineHeight: component.fontSize,
                        fontSize: component.fontSize * scale,
                        fontFamily: component.fontName,
                        fontStyle: component.fontStyle,
                        color: component.fontColor,
                    }}
                    value={selectedOpt}
                    onChange={(e) => {
                        e.stopPropagation();
                    }}
                >
                    {/* 根據選擇的選項值在這裡動態生成選項 */}
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
