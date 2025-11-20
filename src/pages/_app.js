import Header from '@/components/layout/Header/Header';
import '@/styles/globals.scss';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header type="default" />
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}
