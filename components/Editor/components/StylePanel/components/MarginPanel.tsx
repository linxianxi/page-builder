import { FormControl, FormLabel, SimpleGrid } from "@chakra-ui/react";
import { ToolBarInput } from "../../ToolBar/ToolBarInput";
import React, { FC } from "react";

export const MarginPanel: FC = () => {
  return (
    <SimpleGrid columns={2} spacing={4}>
      <FormControl>
        <FormLabel fontSize="sm">上</FormLabel>
        <ToolBarInput name="marginTop" />
      </FormControl>

      <FormControl>
        <FormLabel fontSize="sm">下</FormLabel>
        <ToolBarInput name="marginBottom" />
      </FormControl>

      <FormControl>
        <FormLabel fontSize="sm">左</FormLabel>
        <ToolBarInput name="marginLeft" />
      </FormControl>

      <FormControl>
        <FormLabel fontSize="sm">右</FormLabel>
        <ToolBarInput name="marginRight" />
      </FormControl>
    </SimpleGrid>
  );
};
