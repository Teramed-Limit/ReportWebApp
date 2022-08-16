import React, { createContext, ReactNode, useState } from 'react';

import { ReportFinding } from '../../../../interface/report-finding';

interface Props {
    children: ReactNode;
}

export const FindingTemplateContext = createContext<{
    edit: boolean;
    setEdit: React.Dispatch<React.SetStateAction<boolean>>;
    findingList: ReportFinding[];
    setFindingList: React.Dispatch<React.SetStateAction<ReportFinding[]>>;
    activeIndex: number;
    setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
    backupFindingList: ReportFinding[];
    setBackupFindingList: React.Dispatch<React.SetStateAction<ReportFinding[]>>;
}>({
    edit: false,
    setEdit: () => {},
    findingList: [],
    setFindingList: () => {},
    activeIndex: -1,
    setActiveIndex: () => {},
    backupFindingList: [],
    setBackupFindingList: () => {},
});

export function FindingTemplateProvider(props: Props) {
    const [edit, setEdit] = useState(false);
    const [backupFindingList, setBackupFindingList] = useState<ReportFinding[]>([]);
    const [findingList, setFindingList] = useState<ReportFinding[]>([]);
    const [activeIndex, setActiveIndex] = useState<number>(-1);

    return (
        <FindingTemplateContext.Provider
            value={{
                edit,
                setEdit,
                findingList,
                setFindingList,
                activeIndex,
                setActiveIndex,
                backupFindingList,
                setBackupFindingList,
            }}
        >
            {props.children}
        </FindingTemplateContext.Provider>
    );
}
