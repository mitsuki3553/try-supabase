import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

import { Footer } from "src/components/molecules/layouts/footer";
import { Header } from "src/components/molecules/layouts/header";
import { Tabs } from "../headless_ui/tabs";
// import { Tabs } from "src/components/headless_ui/tabs";
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
          <Tabs>{props.children}</Tabs>
        </main>
        <Footer />
      </div>
      <Toaster />
    </div>
  );
};
