import '@/styles/index.css'
import type { AppProps } from "next/app";
import '@/styles/globals.css'
import 'tailwindcss/tailwind.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ToastContainer
 position="top-right"
        autoClose={2500}
        limit={3}
        closeOnClick
        pauseOnHover
        draggable
        theme="light" />
      <Component {...pageProps} />
    </>
  );
}

