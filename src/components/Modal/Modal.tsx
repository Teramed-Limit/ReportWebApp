import React, { CSSProperties } from 'react';
import { createPortal } from 'react-dom';

import classes from './Modal.module.scss';

interface Props {
    open: boolean;
    onClose: () => void;
    headerTitle: string;
    body: JSX.Element;
    bodyCSS?: CSSProperties;
    footer: JSX.Element;
    width?: string;
    height?: string;
    overflow?: string;
}

const Modal = ({
    open,
    headerTitle,
    body,
    bodyCSS,
    footer,
    width = '80%',
    height = '80%',
    overflow = 'auto',
}: Props) => {
    return open
        ? createPortal(
              <div className={classes.container}>
                  <div className={classes.overlay} />
                  <div style={{ width, height }} className={classes.modal}>
                      <div className={classes.header}>{headerTitle}</div>
                      <div style={{ ...bodyCSS, overflow }} className={classes.body}>
                          {body}
                      </div>
                      <div className={classes.footer}>{footer}</div>
                  </div>
              </div>,
              document.body,
          )
        : null;
};

export default Modal;
