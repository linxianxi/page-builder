import { FormControl, FormLabel, SimpleGrid } from "@chakra-ui/react";
import { ToolBarInput } from "../../ToolBar/ToolBarInput";
import React, { FC } from "react";

export const SizePanel: FC = () => {
  return (
    <SimpleGrid columns={2} spacing={4}>
      <FormControl>
        <FormLabel fontSize="sm">宽度</FormLabel>
        <ToolBarInput name="width" />
      </FormControl>

      <FormControl>
        <FormLabel fontSize="sm">高度</FormLabel>
        <ToolBarInput name="height" />
      </FormControl>

      <FormControl>
        <FormLabel fontSize="sm">最小宽度</FormLabel>
        <ToolBarInput name="minWidth" />
      </FormControl>

      <FormControl>
        <FormLabel fontSize="sm">最小高度</FormLabel>
        <ToolBarInput name="minHeight" />
      </FormControl>

      <FormControl>
        <FormLabel fontSize="sm">最大宽度</FormLabel>
        <ToolBarInput name="maxWidth" />
      </FormControl>

      <FormControl>
        <FormLabel fontSize="sm">最大高度</FormLabel>
        <ToolBarInput name="maxHeight" />
      </FormControl>
    </SimpleGrid>
  );
};
