import '@/styles/index.css';
import type { AppProps } from "next/app";
import '@/styles/globals.css';
import 'tailwindcss/tailwind.css';
import 'react-toastify/dist/ReactToastify.css';

import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          const isAdmin = router.pathname.startsWith('/admin');
          Cookies.remove(isAdmin ? 'token_cms' : 'token_portal');
          router.push('/login');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <>
      <Component {...pageProps} />
      <ToastContainer
        position="top-right"
        autoClose={2500}
        limit={5}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        newestOnTop
      />
    </>
  );
}
