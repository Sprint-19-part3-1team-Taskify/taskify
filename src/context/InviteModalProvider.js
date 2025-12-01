import { createContext, useContext, useState } from 'react';

const InviteModalContext = createContext(null);

export function InviteModalProvider({ children }) {
  const [isInviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState('');

  const openInvite = () => setInviteOpen(true);
  const closeInvite = () => {
    setInviteOpen(false);
    setEmail('');
  };

  return (
    <InviteModalContext.Provider
      value={{
        isInviteOpen,
        openInvite,
        closeInvite,
        email,
        setEmail,
      }}
    >
      {children}
    </InviteModalContext.Provider>
  );
}

export function useInviteModal() {
  return useContext(InviteModalContext);
}
