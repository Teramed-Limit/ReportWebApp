import React from 'react';

import { Image, Text, View } from '@react-pdf/renderer';
import { observer } from 'mobx-react';

import { DocumentData } from '../../../interface/document-data';
import { StudyData } from '../../../interface/study-data';
import { calculateAge, formatDate } from '../../../utils/general';
import { styles } from '../styles/style';

interface Props {
    formData: DocumentData;
    logoUrl: string;
    reportName: string;
    activeStudy: Partial<StudyData>;
}

const PDFHeader = ({ formData, logoUrl, reportName, activeStudy }: Props) => {
    return (
        <View fixed>
            <View style={styles.header}>
                <View style={styles.header_leftContent}>
                    {logoUrl && <Image style={styles.hospitalLogo} src={logoUrl} />}
                    <Text>{reportName}</Text>
                </View>
                <View style={styles.header_rightContent}>
                    <View style={styles.header_patientInfo}>
                        <View>
                            <Text style={{ fontWeight: 'bold' }}>{activeStudy?.PatientsName}</Text>
                            <Text>{activeStudy?.OtherPatientNames}</Text>
                            <Text>
                                {activeStudy?.PatientsSex}/
                                {calculateAge(activeStudy?.PatientsBirthDate)}
                            </Text>
                        </View>
                        <View>
                            <Text style={{ fontWeight: 'bold' }}>{activeStudy?.PatientId}</Text>
                            <Text style={{ fontWeight: 'bold' }}>
                                {activeStudy?.AccessionNumber}
                            </Text>
                        </View>
                        <View>
                            <Text>
                                {`DOB : ${formatDate(
                                    activeStudy?.PatientsBirthDate,
                                    'yyyyMMdd',
                                    'dd-MMM-yyyy',
                                )}`}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.divider} />
            <View style={{ ...styles.subSection, flexDirection: 'row' }}>
                <View
                    style={{
                        ...styles.fieldSection,
                        flexDirection: 'row',
                    }}
                >
                    {/* Label */}
                    <Text
                        style={{
                            ...styles.label,
                            ...styles.labelHorizontal,
                            fontSize: 12,
                        }}
                    >
                        Procedure Date
                    </Text>
                    {/* Value */}
                    <Text
                        style={{
                            ...styles.textValue,
                            ...styles.textValueHorizontal,
                            fontSize: 12,
                        }}
                    >
                        {formatDate(activeStudy?.StudyDate, 'yyyyMMdd', 'dd-MMM-yyyy')}
                    </Text>
                </View>
                <View
                    style={{
                        ...styles.fieldSection,
                        flexDirection: 'row',
                    }}
                >
                    {/* Label */}
                    <Text
                        style={{
                            ...styles.label,
                            ...styles.labelHorizontal,
                            fontSize: 12,
                        }}
                    >
                        Time Start
                    </Text>
                    {/* Value */}
                    <Text
                        style={{
                            ...styles.textValue,
                            ...styles.textValueHorizontal,
                            fontSize: 12,
                        }}
                    >
                        {`${formData.StartTimeHour}:${formData.StartTimeMin}`}
                    </Text>
                </View>
            </View>
            <View style={styles.divider} />
        </View>
    );
};

export default observer(PDFHeader);
