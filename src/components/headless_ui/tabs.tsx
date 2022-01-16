import { Tab } from "@headlessui/react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
}

export const Tabs =(props:Props) => {
  return (
    <Tab.Group >
      <Tab.List>
        <Tab>全体</Tab>
        <Tab>個人</Tab>
        <Tab>Tab 3</Tab>
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel>Content 1</Tab.Panel>
        <Tab.Panel>Content 2</Tab.Panel>
        <Tab.Panel>Content 3</Tab.Panel>
        {props.children}
      </Tab.Panels>
    </Tab.Group>
  );
}
