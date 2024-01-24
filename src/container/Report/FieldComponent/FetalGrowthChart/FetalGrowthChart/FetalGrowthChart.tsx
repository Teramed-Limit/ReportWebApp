import React from 'react';

import { Stack } from '@mui/material';
import Box from '@mui/material/Box';
import { observer } from 'mobx-react';
import { useGenerateImage } from 'recharts-to-png';

import { CurveChartField } from '../../../../../interface/report-field/curve-chart-field';
import { useReportDataStore } from '../../../../../models/useStore';
import BPDChart from '../BPDChart/BPDChart';

interface Props {
    field: CurveChartField;
    value: string;
    onValueChange: (value: string) => void;
    disabled: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FetalGrowthChart = React.forwardRef(({ field, value, onValueChange }: Props, ref) => {
    const { formData } = useReportDataStore();

    const [getDivJpeg, { ref: divRef }] = useGenerateImage<HTMLDivElement>({
        quality: 0.8,
        type: 'image/jpeg',
    });

    // useEffect(() => {
    //     if (divRef.current) {
    //         getDivJpeg().then((data) => {
    //             console.log(data);
    //         });
    //     }
    // }, [divRef, getDivJpeg]);

    return (
        <Stack ref={divRef} alignItems={'center'} sx={{ width: field.width, height: field.height }}>
            <Box sx={{ fontSize: 18, mb: '2px' }}>AC</Box>
            <BPDChart value={formData.get('')}></BPDChart>
            {/*<ACChart value={formData.get('')}></ACChart>*/}
        </Stack>
    );
});

export default observer(FetalGrowthChart);
