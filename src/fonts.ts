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
        family: 'MicrosoftBlack',
        fontStyle: 'normal',
        fontWeight: 'normal',
        name: 'MicrosoftBlack',
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
