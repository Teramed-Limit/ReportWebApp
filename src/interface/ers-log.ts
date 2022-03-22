export interface ListEpisodeNoStatusDto {
    StudyDescription: string;
    CreateDateTime: string;
    ModifiedDateTime: string;
    SignOffsDateTime: string;
    PDFFilePath: string;
    Author: string;
    StudyInstanceUID: string;
    END001_Status: string;
    END001_Message: string;
    END002_Status: string;
    END002_Message: string;
    END003_Status: string;
    END003_Message: string;
    END004_Status: string;
    END004_Message: string;
    END005_Status: string;
    END005_Message: string;
}

export interface ERSLog {
    ListEpisodeNoStatusDto: ListEpisodeNoStatusDto[];
}

export interface SignatureData {
    UserID: string;
    SignatureBase64: string;
    SignatureImage: string;
    Qualification: string;
}
