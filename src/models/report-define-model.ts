import { AxiosResponse } from 'axios';
import { flow, getEnv, types } from 'mobx-state-tree';

import { ReportDefineModal } from './model-type/report-define-type-modal';
import { fetchReportDefine, fetchReportHistoryDefine } from '../axios/api';
import { FormDefine, FormDefineMap, FormHistoryDefine } from '../interface/define';
import { DocumentData } from '../interface/document-data';
import { Field } from '../interface/report-field/field';
import { SRTextField } from '../interface/report-field/sr-text-field';
import { RepPage } from '../interface/report-generator/rep-page';
import { RootService } from '../interface/root-service';
import { SRTreeNode } from '../interface/sr-tree';
import { initRepPage } from '../logic/report-define/report-define-service';
import { isEmptyOrNil } from '../utils/general';

export const DefineModel: ReportDefineModal = types
    .model('define', {
        loading: types.optional(types.boolean, true),
        formDefineMap: types.frozen<FormDefineMap>({}),
        formDefine: types.optional(types.frozen<FormDefine>(), { sections: [] }),
        imageDefine: types.optional(types.frozen<Field[]>(), []),
        headerDefine: types.optional(types.frozen<RepPage>(), initRepPage('header')),
        footerDefine: types.optional(types.frozen<RepPage>(), initRepPage('footer')),
        normalizeFields: types.frozen<{ [props: string]: Field }>(),
        normalizeSRFields: types.frozen<{ [props: string]: Field }>(),
    })
    /* eslint-disable no-param-reassign */
    .actions((self) => {
        const fetchDefineSuccess = (res: AxiosResponse<FormDefineMap>) => {
            self.loading = false;
            self.formDefineMap = res.data;

            const { reportDefineService } = getEnv<RootService>(self);
            reportDefineService.registerFormDefine(res.data);
        };

        const fetchHistoryDefineSuccess = (res: AxiosResponse<FormHistoryDefine>) => {
            self.loading = false;
            self.formDefine = JSON.parse(res.data.ReportDefine) as FormDefine;
        };

        const fetchError = (error: unknown) => {
            console.error('Failed to fetch report define', error);
            self.loading = false;
        };

        return {
            fetchDefine: flow(function* fetchProjects() {
                try {
                    const res = yield fetchReportDefine().toPromise();
                    fetchDefineSuccess(res);
                } catch (error) {
                    fetchError(error);
                }
            }),
            fetchHistoryDefine: flow(function* fetchProjects({ studyInstanceUID, version }) {
                try {
                    const res = yield fetchReportHistoryDefine(
                        studyInstanceUID,
                        version,
                    ).toPromise();

                    fetchHistoryDefineSuccess(res);
                } catch (error) {
                    fetchError(error);
                }
            }),
            setFormDefine: (formData: DocumentData) => {
                const { reportDefineService } = getEnv<RootService>(self);
                const {
                    formDefine,
                    imageDefine,
                    fields,
                    structureReportFields,
                    headerDefine,
                    footerDefine,
                } = reportDefineService.getFormDefine(formData?.ReportTemplate || 'Blank');

                self.formDefine = formDefine;
                self.imageDefine = imageDefine;
                self.headerDefine = isEmptyOrNil(headerDefine)
                    ? initRepPage('header')
                    : headerDefine;
                self.footerDefine = isEmptyOrNil(footerDefine)
                    ? initRepPage('footer')
                    : footerDefine;
                // 正規化
                self.normalizeFields = fields;
                // 判斷是否有SR Field
                self.normalizeSRFields = structureReportFields;
            },
            parseSR: (treeNode: SRTreeNode) => {
                const structureReportData = {};

                if (isEmptyOrNil(self.normalizeSRFields)) return {};

                function findTargetNode(
                    root: SRTreeNode,
                    path: string,
                ): { node: SRTreeNode; valueKey: string } | null {
                    // 切割路徑為各階層
                    const segments = path.split('\\');

                    // 遞迴函數用於遍歷樹結構
                    function traverse(
                        node: SRTreeNode,
                        index: number,
                    ): { node: SRTreeNode; valueKey: string } | null | null {
                        if (index >= segments.length) return null;

                        // 處理當前階層的節點
                        const segment = segments[index];
                        const [code, condition] = segment.split('|');

                        const isTargetNode = code.includes('#');
                        const actualCode = code.replace(/#.*/, '');

                        if (node.Value.Code === actualCode) {
                            // 如果有條件，則檢查條件是否滿足
                            if (condition && node.Children[0]) {
                                const firstChildNode = node.Children[0];
                                const [childCode, value] = condition.split('=');
                                if (
                                    firstChildNode.Value.Code !== childCode ||
                                    firstChildNode.Value.Value !== value
                                )
                                    return null;
                            }

                            // 如果是目標節點，則返回
                            if (isTargetNode) {
                                const match = code.match(/#(.*)/);
                                return { node, valueKey: match ? match[1] : '' };
                            }

                            // 否則繼續遍歷子節點
                            for (const child of node.Children) {
                                const result = traverse(child, index + 1);
                                if (result) return result;
                            }
                        }

                        return null;
                    }

                    return traverse(root, 0);
                }

                Object.entries(self?.normalizeSRFields).forEach(([key, value]) => {
                    if (!(value as SRTextField)?.structureReportPath) return;

                    const result = findTargetNode(
                        treeNode,
                        (value as SRTextField)?.structureReportPath || '',
                    );

                    if (result) structureReportData[key] = result.node.Value[result.valueKey];
                });

                return structureReportData;
            },
        };
    });
