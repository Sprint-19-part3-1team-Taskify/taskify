import AuthProvider from '@/context/authProvider';
import ModalProvider from '@/context/modalProvider';

export function Providers({ children }) {
  return (
    <AuthProvider>
      <ModalProvider>{children}</ModalProvider>
    </AuthProvider>
  );
}

export default function App({ children }) {
  return <Providers>{children}</Providers>;
}
