import Menu from "@/components/menu";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head> <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </Head>
      <body className="antialiased">
        <Menu />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
