import React, { ReactNode, useLayoutEffect, useRef } from 'react';
import css from './ModalDialog.module.css';

interface ModalDialogProps {
  onClose: () => void;
  children: ReactNode;
  buttons?: ReactNode;
}

export function ModalDialog(props: ModalDialogProps): ReactNode {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => dialogRef.current!.showModal(), []);

  return (
    <dialog
      ref={dialogRef}
      onClose={props.onClose}
      className={css.ModalDialog}
    >
      {props.children}

      <div className={css.Buttons}>
        {props.buttons}

        <button onClick={() => dialogRef.current!.close()}>{'Close'}</button>
      </div>
    </dialog>
  );
}
