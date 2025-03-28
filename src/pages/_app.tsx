import '@/styles/index.css'
import type { AppProps } from "next/app";
import '@/styles/globals.css'
import 'tailwindcss/tailwind.css';
export default function App({ Component, pageProps }: AppProps) {
  return (
   
      <Component {...pageProps} />
  );
}

