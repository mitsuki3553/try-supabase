import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

import { Footer } from "src/components/layouts/footer";
import { Header } from "src/components/layouts/header";
import { Tabs } from "src/components/headless_ui/tabs";
type Props = {
  children: ReactNode;
};
export const LayoutWrapper = (props: Props) => {
  return (
    <div className="bg-gray-300">
      <div
        className="container mx-auto grid
        grid-rows-[auto,1fr,auto] min-h-screen"
      >
        <Header />
        <main>
          <Tabs />
          <div className="px-4 text-gray-600 bg-gray-100">{props.children}</div>
        </main>
        <Footer />
      </div>
      <Toaster />
    </div>
  );
};
