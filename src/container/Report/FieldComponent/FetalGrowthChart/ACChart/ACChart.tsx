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
    '15,6.7@*@16,7.5@*@17,8.6@*@18,9.8@*@19,10.8@*@20,11.8@*@21,12.8@*@22,13.8@*@23,14.8@*@24,15.8@*@25,16.8@*@26,17.8@*@27,18.7@*@28,19.7@*@29,20.7@*@30,21.7@*@31,22.6@*@32,23.6@*@33,24.6@*@34,25.5@*@35,26.5@*@36,27.4@*@37,28.4@*@38,29.3@*@39,30.3@*@40,31.2@*@';

const percentile50 =
    '15,9.6@*@16,10.4@*@17,11.6@*@18,12.6@*@19,13.6@*@20,14.6@*@21,15.6@*@22,16.6@*@23,17.6@*@24,18.6@*@25,19.6@*@26,20.6@*@27,21.6@*@28,22.6@*@29,23.5@*@30,24.5@*@31,25.5@*@32,26.4@*@33,27.4@*@34,28.4@*@35,29.3@*@36,30.3@*@37,31.2@*@38,32.2@*@39,33.1@*@40,34@*@';

const percentile75 =
    '15,12.4@*@16,13.2@*@17,14.4@*@18,15.4@*@19,16.4@*@20,17.5@*@21,18.5@*@22,19.5@*@23,20.5@*@24,21.5@*@25,22.5@*@26,23.4@*@27,24.5@*@28,25.4@*@29,26.4@*@30,27.4@*@31,28.4@*@32,29.3@*@33,30.2@*@34,31.2@*@35,32.1@*@36,33.1@*@37,34@*@38,35@*@39,35.9@*@40,36.9@*@';

const data = fetalGrowthDataTransform({ percentile25, percentile50, percentile75 });

interface Props {
    value: string;
    children?: React.ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ACChart = React.forwardRef(({ value, children }: Props, ref) => {
    const specificData = [{ days: 134, value: 16 }];

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
                            value: 'AC (cm)',
                            angle: -90,
                            position: 'insideLeft',
                            offset: 20,
                        }}
                        tickCount={8}
                        domain={[4, 40]}
                    />
                    <Tooltip />
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
                    <Scatter name="Value" isAnimationActive={false} dataKey={'value'} fill="blue">
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    </Scatter>
                </ComposedChart>
            </ResponsiveContainer>
        </>
    );
});

export default ACChart;
