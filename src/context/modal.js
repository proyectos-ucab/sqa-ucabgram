import React, { createContext } from 'react';
import { useModal } from '../hooks';
import { Modal } from '../components';

export const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const { modal, handleModal, modalContent } = useModal();

  return (
    <ModalContext.Provider value={{ modal, handleModal, modalContent }}>
      <Modal />
      {children}
    </ModalContext.Provider>
  );
};
