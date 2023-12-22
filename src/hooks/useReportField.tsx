import React from 'react';

import * as R from 'ramda';
import { useRecoilState, useSetRecoilState } from 'recoil';

import {
    previousSelectedAttributePathAtom,
    selectedAttributeAtom,
    selectedAttributePathAtom,
    selectedAttributeTypeAtom,
    selectedDefineType,
    selectedFieldsAtom,
    selectedReportDefine,
} from '../atom/report-generator';
import { FieldAttributeMapper } from '../container/ReportGenerator/ReportDefine/Attribute/report-define-attributes-mapper';
import { FormDefine, Section } from '../interface/define';
import { Field } from '../interface/report-field/field';

interface Props {
    path: (string | number)[];
    field: Field;
}

export function useReportField({ path, field }: Props) {
    const setAttributePath = useSetRecoilState(selectedAttributePathAtom);
    const [previousAttributePath, setPreviousAttributePath] = useRecoilState(
        previousSelectedAttributePathAtom,
    );
    const setSelectedAttribute = useSetRecoilState(selectedAttributeAtom);
    const setSelectedFields = useSetRecoilState(selectedFieldsAtom);
    const setSelectedAttributeType = useSetRecoilState(selectedAttributeTypeAtom);
    const setDefineType = useSetRecoilState(selectedDefineType);
    const [formDefine, setFormDefine] = useRecoilState(selectedReportDefine);

    // 函式來找到起始和結束路徑之間的所有fields陣列的路徑
    const findFieldPathsBetween = (
        data: FormDefine,
        startPath: (string | number)[],
        endPath: (string | number)[],
    ): (string | number)[][] => {
        // 用於存儲結果的陣列
        const result: (string | number)[][] = [];

        // 遞迴函數：遍歷所有 sections 和 subSections 以找到 fields
        const recursiveFind = (sections: Section[], currentPath: (string | number)[]) => {
            for (let i = 0; i < sections.length; i++) {
                const section = sections[i];
                for (let j = 0; j < section.subSections.length; j++) {
                    const subSection = section.subSections[j];
                    for (let k = 0; k < subSection.fields.length; k++) {
                        // 創建當前 field 的完整路徑
                        const fieldPath = [
                            ...currentPath,
                            'sections',
                            i,
                            'subSections',
                            j,
                            'fields',
                            k,
                        ];

                        // 檢查當前路徑是否在指定的起始和結束路徑之間
                        if (
                            comparePaths(fieldPath, startPath) >= 0 &&
                            comparePaths(fieldPath, endPath) <= 0
                        ) {
                            result.push(fieldPath);
                        }
                    }
                }
            }
        };

        // 比較兩個路徑的函數
        const comparePaths = (path1: (string | number)[], path2: (string | number)[]) => {
            for (let i = 0; i < Math.min(path1.length, path2.length); i++) {
                if (path1[i] < path2[i]) return -1;
                if (path1[i] > path2[i]) return 1;
            }
            return 0;
        };

        recursiveFind(data.sections, []);
        return result;
    };
    const onSetAttributePath = (e: React.MouseEvent<any>) => {
        e.preventDefault();
        e.stopPropagation();

        setDefineType('FormDefine');

        // Ctrl多選
        if (e.ctrlKey) {
            setSelectedFields((prev) => {
                const fieldPathList = new Set(prev);
                fieldPathList.add(JSON.stringify(path));
                return fieldPathList;
            });
        }
        // Shift多選
        else if (e.shiftKey) {
            const fieldPathList = findFieldPathsBetween(formDefine, previousAttributePath, path);
            setSelectedFields(new Set(fieldPathList.map((p) => JSON.stringify(p))));
        }
        // 單選
        else {
            setSelectedFields(new Set<string>().add(JSON.stringify(path)));
            setPreviousAttributePath(path);
        }

        // 基於ReportDefine的路徑
        // 例如：['sections', 0, 'subsections', 0, 'fields', 0]
        setAttributePath(path);
        const attributeInstance = FieldAttributeMapper[field.type](field);
        setSelectedAttribute(attributeInstance);
        setSelectedAttributeType(field.type);
    };

    const onDelete = (e) => {
        e.stopPropagation();
        setAttributePath([]);
        setFormDefine((prev) => R.dissocPath(path, prev));
    };

    const copyField = (e) => {
        e.stopPropagation();
        setFormDefine((prev) => {
            // 找到要複製的子部分
            const copiedField = R.path<Field>(path, prev);
            // 找到子部分列表的路徑
            const fieldListPath = R.dropLast(1, path);
            // 獲取子部分列表
            const fieldList = R.path<Field[]>(fieldListPath, prev);

            // 確保子部分列表和要複製的子部分存在
            if (!fieldList || !copiedField) return prev;

            // 更新複製子部分的 ID
            const updatedFields = {
                ...copiedField,
                id: `Field${fieldList.length + 1}`,
            };
            // 插入新的子部分到列表
            const newFieldList = R.insert(fieldList.length, updatedFields, fieldList);

            return R.assocPath(fieldListPath, newFieldList, prev);
        });
    };

    return { onSetAttributePath, onDelete, copyField };
}
