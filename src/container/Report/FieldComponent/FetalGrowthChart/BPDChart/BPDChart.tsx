import React from 'react';

import {
    CartesianGrid,
    ComposedChart,
    Line,
    ResponsiveContainer,
    Scatter,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import { convertDaysToWeeks, fetalGrowthDataTransform } from '../utils';

const percentile25 =
    '15,2.9@*@16,3.2@*@17,3.5@*@18,3.9@*@19,4.2@*@20,4.5@*@21,4.7@*@22,5@*@23,5.3@*@24,5.6@*@25,5.9@*@26,6.2@*@27,6.5@*@28,6.8@*@29,7.1@*@30,7.3@*@31,7.6@*@32,7.8@*@33,8@*@34,8.2@*@35,8.3@*@36,8.5@*@37,8.6@*@38,8.7@*@39,8.8@*@40,8.9@*@';

const percentile50 =
    '15,3.3@*@16,3.6@*@17,3.9@*@18,4.3@*@19,4.6@*@20,4.9@*@21,5.2@*@22,5.5@*@23,5.8@*@24,6.1@*@25,6.4@*@26,6.7@*@27,7@*@28,7.3@*@29,7.5@*@30,7.8@*@31,8@*@32,8.2@*@33,8.4@*@34,8.6@*@35,8.8@*@36,9@*@37,9.1@*@38,9.2@*@39,9.3@*@40,9.3@*@';

const percentile75 =
    '15,3.6@*@16,3.9@*@17,4.3@*@18,4.6@*@19,5@*@20,5.3@*@21,5.6@*@22,5.9@*@23,6.2@*@24,6.5@*@25,6.8@*@26,7.1@*@27,7.4@*@28,7.7@*@29,8@*@30,8.2@*@31,8.5@*@32,8.7@*@33,8.9@*@34,9.1@*@35,9.2@*@36,9.4@*@37,9.5@*@38,9.6@*@39,9.7@*@40,9.7@*@';

let data = fetalGrowthDataTransform({ percentile25, percentile50, percentile75 });

interface Props {
    value: string;
    children?: React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BPDChart = React.forwardRef(({ value, children }: Props, ref) => {
    const specificData = [{ days: 150, value: 4.99 }];
    data = [...data, ...specificData];

    return (
        <>
            {children}
            <ResponsiveContainer>
                <ComposedChart data={data} margin={{ bottom: 15, left: -15 }}>
                    <XAxis
                        dataKey="days"
                        type="number"
                        tickCount={10}
                        label={{
                            value: 'Gestational Age (in weeks)',
                            position: 'insideBottom',
                            offset: -10,
                        }}
                        tickFormatter={(d: any) => convertDaysToWeeks(d)}
                        domain={[12, 40].map((v) => v * 7)}
                        ticks={[12, 16, 20, 24, 28, 32, 36, 40, 44].map((v) => v * 7)}
                    />
                    <YAxis
                        dataKey="value"
                        type="number"
                        label={{
                            value: 'BPD (cm)',
                            angle: -90,
                            position: 'insideLeft',
                            offset: 20,
                        }}
                        tickCount={10}
                        domain={[1, 12]}
                    />
                    <Tooltip
                        labelFormatter={(label: any) => convertDaysToWeeks(label) + ' weeks'}
                    />
                    {/*<Legend verticalAlign="top" height={36} />*/}
                    <CartesianGrid strokeDasharray="3 3" />
                    <Line
                        isAnimationActive={false}
                        type="monotone"
                        dot={false}
                        dataKey="percentile25"
                        name="Percentile 25"
                        data={data}
                        stroke="red"
                        strokeWidth={3}
                    />
                    <Line
                        isAnimationActive={false}
                        type="monotone"
                        dot={false}
                        dataKey="percentile50"
                        name="Mean"
                        data={data}
                        stroke="green"
                        strokeWidth={3}
                    ></Line>
                    <Line
                        isAnimationActive={false}
                        type="monotone"
                        dot={false}
                        dataKey="percentile75"
                        name="Percentile 75"
                        data={data}
                        stroke="red"
                        strokeWidth={3}
                    ></Line>
                    <Scatter
                        name="Value"
                        isAnimationActive={false}
                        dataKey={'value'}
                        fill="blue"
                    ></Scatter>
                </ComposedChart>
            </ResponsiveContainer>
        </>
    );
});

export default BPDChart;
