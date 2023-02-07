import React from 'react';

import ReactPDF from '@react-pdf/renderer';

import { ReportComponentType } from '../../../container/ReportGenerator/ReportComponent/report-component-mapper';
import { RepComponent, RepImageComponent, RepLabelComponent } from '../../../interface/rep-report';
import { styles } from '../styles/style';

interface Props {
    components: Record<string, RepComponent>;
    children?: React.ReactNode;
}

const PDFCustomHeader = ({ components, children }: Props) => {
    return (
        <>
            <ReactPDF.View
                style={{
                    position: 'relative',
                    width: '100%',
                    minHeight: '105px',
                }}
                fixed
            >
                {Object.entries(components).map(([uuid, component]) => {
                    switch (component.componentType) {
                        case ReportComponentType.Image:
                            const imageCom = component as RepImageComponent;
                            return (
                                <ReactPDF.Image
                                    key={uuid}
                                    style={{
                                        position: 'absolute',
                                        objectFit: 'contain',
                                        width: imageCom.width / 1.979831932773109,
                                        height: imageCom.height / 1.979831932773109,
                                        left: component.x / 1.979831932773109,
                                        top: component.y / 1.979831932773109,
                                    }}
                                    src={component.value}
                                />
                            );
                        case ReportComponentType.Label:
                            const labelCom = component as RepLabelComponent;
                            return (
                                <ReactPDF.Text
                                    key={uuid}
                                    style={{
                                        position: 'absolute',
                                        fontSize: labelCom.fontSize / 1.979831932773109,
                                        fontFamily: labelCom.fontName,
                                        fontWeight: labelCom.fontWeight,
                                        color: labelCom.fontColor,
                                        left: component.x / 1.979831932773109,
                                        top: component.y / 1.979831932773109,
                                    }}
                                >
                                    {component.value}
                                </ReactPDF.Text>
                            );
                        default:
                            return <></>;
                    }
                })}
            </ReactPDF.View>
            <ReactPDF.View style={styles.dividerContainer} fixed>
                <ReactPDF.View style={styles.divider} />
            </ReactPDF.View>
            <ReactPDF.View fixed>{children}</ReactPDF.View>
        </>
    );
};

export default React.memo(PDFCustomHeader);
