import React from 'react';
import ReactDom from 'react-dom';
import { ModalContext } from '../context';

export function Modal() {
  const { modalContent, handleModal, modal } = React.useContext(ModalContext);

  if (modal) {
    return ReactDom.createPortal(
      <div
        className="fixed top-0 left-0 h-screen w-full  z-10"
        style={{ background: 'rgba(0,0,0,0.8)' }}
      >
        <div className="relative top-0 left-0 h-screen w-full flex items-center justify-center">
          <button
            className="absolute top-0 right-0 font-bold self-end"
            onClick={() => handleModal()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div
            className="bg-white relative shadow-lg rounded"
            style={{ width: '40%', height: '70%', minWidth: '500px' }}
          >
            <div className="w-full h-full">{modalContent}</div>
          </div>
        </div>
      </div>,
      document.querySelector('#modal-root')
    );
  } else return null;
}
