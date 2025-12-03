import { createContext, useCallback, useContext, useState } from 'react';

const ModalContext = createContext(null);

export default function ModalProvider({ children }) {
  const [openModals, setOpenModals] = useState({});
  const [message, setMessage] = useState(''); // ✅ 추가

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

  // ✅ message 관련 함수 추가
  const showMessage = useCallback((msg) => {
    setMessage(msg);
  }, []);

  const clearMessage = useCallback(() => {
    setMessage('');
  }, []);

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        closeModal,
        openModal,
        message,
        showMessage,
        clearMessage,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('반드시 ModalProvider 안에서 사용해야 합니다.');
  }
  return context;
}
