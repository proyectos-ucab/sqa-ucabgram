import React, { useState } from 'react';

export function useModal() {
  const [modal, setModal] = useState(false);
  const [modalContent, setModalContent] = useState("I'm the modal content");

  const handleModal = (content = false) => {
    setModal(!modal);
    if (content) {
      setModalContent(content);
    }
  };

  return { modal, handleModal, modalContent };
}
