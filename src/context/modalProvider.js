import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const ModalContext = createContext(null);

export default function ModalProvider({ children }) {
  const [openModals, setOpenModals] = useState({});

  const openModal = useCallback((id) => {
    setOpenModals((prev) => ({ ...prev, [id]: true }));
  }, []);

  const closeModal = useCallback((id) => {
    setOpenModals((prev) => ({ ...prev, [id]: false }));
  }, []);

  const isOpen = useCallback(
    (id) => {
      return !!openModals[id];
    },
    [openModals],
  );

  return (
    <ModalContext.Provider value={{ isOpen, closeModal, openModal }}>
      {children}
    </ModalContext.Provider>
  );
}
export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('반드시 ModalProvider안에서 사용해야합니다.');
  }

  return context;
}
