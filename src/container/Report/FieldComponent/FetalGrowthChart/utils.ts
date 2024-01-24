export const fetalGrowthDataTransform = ({ percentile25, percentile50, percentile75 }) => {
    const percentile25Array = percentile25.split('@*@');
    const percentile50Array = percentile50.split('@*@');
    const percentile75Array = percentile75.split('@*@');

    // 创建一个空的结果数组
    const data: any[] = [];

    // 循环遍历每个分割后的字符串数组
    for (let i = 0; i < percentile25Array.length; i++) {
        // 将每个字符串按逗号分割成数组
        const percentile25Data = percentile25Array[i].split(',');
        const percentile50Data = percentile50Array[i].split(',');
        const percentile75Data = percentile75Array[i].split(',');

        // 创建包含所需数据的对象
        const dataObject = {
            // weeks: parseInt(percentile25Data[0]),
            days: parseInt(percentile25Data[0]) * 7,
            percentile25: parseFloat(percentile25Data[1]),
            percentile50: parseFloat(percentile50Data[1]),
            percentile75: parseFloat(percentile75Data[1]),
        };

        if (Number.isNaN(dataObject.days)) {
            continue;
        }

        // 将对象添加到结果数组中
        data.push(dataObject);
    }
    return data;
};

export const convertDaysToWeeks = (days): string => Math.round(days / 7).toString();
