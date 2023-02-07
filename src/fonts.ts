import ArialBold from './fonts/Arial-Bold.ttf';
import Arial from './fonts/Arial.ttf';
import MicrosoftBlack from './fonts/MicrosoftBlack.ttf';
import MicrosoftBlackBold from './fonts/MicrosoftBlackBold.ttf';

export default [
    {
        family: 'Arial',
        fontStyle: 'normal',
        fontWeight: 'normal',
        name: 'Arial',
        fonts: [
            {
                src: Arial,
            },
            {
                src: ArialBold,
                fontWeight: 'bold',
            },
        ],
    },
    {
        family: 'Microsoft JhengHei',
        fontStyle: 'normal',
        fontWeight: 'normal',
        name: 'Microsoft JhengHei',
        fonts: [
            {
                src: MicrosoftBlack,
            },
            {
                src: MicrosoftBlackBold,
                fontWeight: 'bold',
            },
        ],
    },
];
