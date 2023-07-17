import { Font } from '@react-pdf/renderer';

import ArialBold from './fonts/Arial-Bold.ttf';
import Arial from './fonts/Arial.ttf';
import MicrosoftBlack from './fonts/MicrosoftBlack.ttf';
import MicrosoftBlackBold from './fonts/MicrosoftBlackBold.ttf';
import NotoSansTCBold from './fonts/NotoSansTC-Bold.otf';
import NotoSansTCRegular from './fonts/NotoSansTC-Regular.otf';

// Register asynchronous loaded fronts before rendering anything.
export const registerFont = () => {
    // Arial
    Font.register({
        family: 'Arial',
        fonts: [{ src: Arial }, { src: ArialBold, fontWeight: 'bold' }],
    });
    // Microsoft JhengHei
    Font.register({
        family: 'Microsoft JhengHei',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fonts: [{ src: MicrosoftBlack }, { src: MicrosoftBlackBold, fontWeight: 'bold' }],
    });
    // NotoSansTC
    Font.register({
        family: 'Arial',
        fontStyle: 'normal',
        fontWeight: 'normal',
        fonts: [{ src: NotoSansTCRegular }, { src: NotoSansTCBold, fontWeight: 'bold' }],
    });
};
