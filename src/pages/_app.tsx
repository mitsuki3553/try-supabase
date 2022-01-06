import "tailwindcss/tailwind.css";
import type { AppProps } from "next/app";
//aaaaaaa
function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
