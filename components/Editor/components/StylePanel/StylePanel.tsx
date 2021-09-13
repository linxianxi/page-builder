import React, { FC, ReactNode } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Grid,
  GridItem,
  Text,
} from "@chakra-ui/react";

import { Input, InputProps as BaseInputProps } from "./components/Input";
import { ColorPicker, ColorPickerProps } from "./components/ColorPicker";
import { Select, SelectProps as BaseSelectProps } from "./components/Select";
interface BaseInput {
  colSpan?: number;
}

interface ColorProps extends BaseInput, ColorPickerProps {
  type: "color";
}
interface InputProps extends BaseInput, BaseInputProps {
  type: "input";
}

interface SelectProps extends BaseInput, BaseSelectProps {
  type: "select";
}

interface StylePanelProps {
  configs: Array<{
    label: ReactNode;
    inputs: (InputProps | SelectProps | ColorProps)[];
  }>;
}

export const StylePanel: FC<StylePanelProps> = ({ configs = [] }) => {
  return (
    <Accordion defaultIndex={configs.map((_, index) => index)} allowMultiple>
      {configs.map((item, index) => (
        <AccordionItem
          key={index}
          mx={-4}
          _first={{ mt: -4, borderTopWidth: 0 }}
        >
          <AccordionButton>
            <Box flex="1" textAlign="left">
              <Text fontWeight="bold">{item.label}</Text>
            </Box>
            <AccordionIcon />
          </AccordionButton>

          <AccordionPanel pb={4}>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              {item.inputs.map(({ type, colSpan, ...rest }, idx) => {
                switch (type) {
                  case "input":
                    return (
                      <GridItem colSpan={colSpan} key={idx}>
                        <Input {...(rest as InputProps)} />
                      </GridItem>
                    );

                  case "color":
                    return (
                      <GridItem colSpan={colSpan} key={idx}>
                        <ColorPicker {...rest} />
                      </GridItem>
                    );

                  case "select":
                    return (
                      <GridItem colSpan={colSpan} key={idx}>
                        <Select {...rest} />
                      </GridItem>
                    );

                  default:
                    return null;
                }
              })}
            </Grid>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
