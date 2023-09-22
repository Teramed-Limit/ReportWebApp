import * as R from 'ramda';
import { useRecoilCallback, useSetRecoilState } from 'recoil';

import {
    selectedAttributePathAtom,
    selectedAttributeTypeAtom,
    selectedReportDefine,
} from '../atom/report-generator';

export function useReportLayout<T>(attrPath: (number | string)[], entityName: string) {
    const setAttributeType = useSetRecoilState(selectedAttributeTypeAtom);
    const setAttributePath = useSetRecoilState(selectedAttributePathAtom);
    const setFormDefine = useSetRecoilState(selectedReportDefine);
    const moveEntity = useRecoilCallback(({ snapshot, set }) => (increment: -1 | 1) => {
        const currentFormDefine = snapshot.getLoadable(selectedReportDefine).contents;

        // 定位到 Sections
        const path = attrPath.slice(0, attrPath.length - 1);
        const childEntity = R.path<T[]>(path, currentFormDefine) || [];
        const activeIdx = attrPath[attrPath.length - 1] as number;

        // 如果索引已是最後一個，則返回
        if (increment > 0 && activeIdx === childEntity.length - 1) {
            return;
        }

        // 如果索引為0，則返回，第一個元素不能向上移動
        if (increment < 0 && activeIdx === 0) {
            return;
        }

        // 移動索引位置
        const adjustedSections = R.move(activeIdx, activeIdx + increment, childEntity);

        // Set the updated data back to the state.
        set(selectedAttributePathAtom, [...path, activeIdx + increment]);
        set(selectedReportDefine, R.assocPath(path, adjustedSections, currentFormDefine));
    });

    const copyEntity = () => {
        setFormDefine((currentFormDefine) => {
            // 定位到 SubSections
            const sectionsPath = attrPath.slice(0, attrPath.length - 1);
            const sections = R.path<T[]>(sectionsPath, currentFormDefine) || [];

            // 複製 SubSection
            const origin = R.path<T>(attrPath, currentFormDefine);
            const copied = {
                ...origin,
                id: `${entityName}-${sections.length + 1}`,
            };

            // 將複製的
            const updated = [...sections, copied];

            // 回傳更新後的 FormDefine
            return R.assocPath(sectionsPath, updated, currentFormDefine);
        });
    };

    const deleteEntity = () => {
        setFormDefine((currentFormDefine) => {
            return R.dissocPath(attrPath, currentFormDefine);
        });
        setAttributeType(undefined);
        setAttributePath([]);
    };

    return { moveEntity, copyEntity, deleteEntity };
}
