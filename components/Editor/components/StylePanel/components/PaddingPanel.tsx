import { FormControl, FormLabel, SimpleGrid } from "@chakra-ui/react";
import { ToolBarInput } from "../../ToolBar/ToolBarInput";
import React, { FC } from "react";

export const PaddingPanel: FC = () => {
  return (
    <SimpleGrid columns={2} spacing={4}>
      <FormControl>
        <FormLabel fontSize="sm">上</FormLabel>
        <ToolBarInput name="paddingTop" />
      </FormControl>

      <FormControl>
        <FormLabel fontSize="sm">下</FormLabel>
        <ToolBarInput name="paddingBottom" />
      </FormControl>

      <FormControl>
        <FormLabel fontSize="sm">左</FormLabel>
        <ToolBarInput name="paddingLeft" />
      </FormControl>

      <FormControl>
        <FormLabel fontSize="sm">右</FormLabel>
        <ToolBarInput name="paddingRight" />
      </FormControl>
    </SimpleGrid>
  );
};
