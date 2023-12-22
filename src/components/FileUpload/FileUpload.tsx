import React from 'react';

interface Props {
    uiComponent: JSX.Element;
    accept: string;
    onFileChange: (file: File) => void;
}

const FileUpload = ({ uiComponent, accept, onFileChange }: Props) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    return (
        <>
            {React.cloneElement(uiComponent, {
                onClick: (e) => {
                    e.stopPropagation();
                    fileInputRef?.current?.click();
                },
            })}
            <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                accept={accept}
                onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef?.current?.click();
                }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (!e.target.files || e.target.files.length === 0) return;
                    onFileChange(e.target.files[0]);
                    (e as any).target.value = null;
                }}
            />
        </>
    );
};

export default FileUpload;
