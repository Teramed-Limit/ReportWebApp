import React, { CSSProperties, useState } from 'react';

import { RepComponent } from '../../../../../interface/report-generator/component/rep-component';
import { RepImageComponent } from '../../../../../interface/report-generator/component/rep-image-component';
import { readBase64 } from '../../../../../utils/general';

interface Props {
    style: CSSProperties;
    scale: number;
    component: RepImageComponent;
    onClick: (e: React.MouseEvent) => void;
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent) => void;
    onMouseEnter: (e: React.MouseEvent) => void;
    onMouseLeave: (e: React.MouseEvent) => void;
    onValueChanged: (uuid: string, attrPath: (string | number)[], value: string) => void;
    onActive: (comp: RepComponent, deactivateOthers: boolean) => void;
}

const ReportImageComponent = React.forwardRef<HTMLImageElement, Props>(
    (
        {
            style,
            scale,
            component,
            onClick,
            onMouseDown,
            onMouseMove,
            onMouseUp,
            onMouseEnter,
            onMouseLeave,
            onValueChanged,
            onActive,
        }: Props,
        ref,
    ) => {
        const hiddenFileInput = React.useRef<HTMLInputElement>(null);
        const [imageSrc, setImageSrc] = useState<string>(component.src);

        const uploadFile = (e) => {
            stopPropagation(e);
            onActive(component, true);
            hiddenFileInput?.current?.click();
        };

        const handleFileChange = (event) => {
            const fileSelected = event.target.files[0];
            if (!fileSelected) return;
            readBase64(fileSelected).then((base64Str) => {
                setImageSrc(base64Str);
                onValueChanged(component.uuid, ['src'], base64Str);
            });
        };

        const stopPropagation = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };

        return (
            <>
                <img
                    draggable="false"
                    ref={ref}
                    style={{
                        ...style,
                        width: component.width * scale,
                        height: component.height * scale,
                        objectFit: 'contain',
                    }}
                    onClick={onClick}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    src={imageSrc}
                    alt=""
                />
                <input
                    ref={hiddenFileInput}
                    type="file"
                    accept="image/*"
                    multiple={false}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
                <button
                    type="button"
                    onClick={uploadFile}
                    onMouseDown={stopPropagation}
                    onMouseUp={stopPropagation}
                    style={{
                        left: style.left,
                        top: style.top,
                        position: style.position,
                        zIndex: 1000,
                    }}
                >
                    ...
                </button>
            </>
        );
    },
);

export default ReportImageComponent;
