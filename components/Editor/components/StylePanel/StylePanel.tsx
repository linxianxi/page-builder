import React, { FC } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Text,
} from "@chakra-ui/react";

import { SizePanel } from "./components/SizePanel";
import { PaddingPanel } from "./components/PaddingPanel";
import { MarginPanel } from "./components/MarginPanel";

export const StylePanel: FC = () => {
  return (
    <Accordion defaultIndex={[0, 1, 2]} allowMultiple>
      <AccordionItem mx={-4} _first={{ mt: -4, borderTopWidth: 0 }}>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            <Text fontWeight="bold">尺寸</Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel pb={4}>
          <SizePanel />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem mx={-4} _first={{ mt: -4, borderTopWidth: 0 }}>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            <Text fontWeight="bold">外边距</Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel pb={4}>
          <MarginPanel />
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem mx={-4} _first={{ mt: -4, borderTopWidth: 0 }}>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            <Text fontWeight="bold">内边距</Text>
          </Box>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel pb={4}>
          <PaddingPanel />
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
