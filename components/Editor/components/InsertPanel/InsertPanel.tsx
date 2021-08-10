import { FC } from "react";
import { Element, useEditor } from "@craftjs/core";
import { Box, VStack, Text, StackDivider } from "@chakra-ui/react";
import React from "react";

import { Image as UserImage } from "../../../blocks/Image";
import { Grid as UserGrid } from "../../../blocks/Grid";
import { Container as UserContainer } from "../../../blocks/Container";
import { Box as UserBox } from "../../../blocks/Box";
import { Code as UserCode } from "../../../blocks/Code";

const elements = [
  {
    component: UserBox,
  },
  {
    component: UserCode,
  },
  {
    component: UserContainer,
  },
  {
    component: UserGrid,
  },
  {
    component: UserImage,
  },
];

export const InsertPanel: FC = () => {
  const {
    enabled,
    connectors: { create },
  } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  return (
    <VStack
      divider={<StackDivider borderColor="gray.200" />}
      spacing={2}
      align="stretch"
    >
      {elements.map((element, index) => {
        return (
          <Box
            cursor="move"
            key={index}
            ref={(ref) =>
              create(
                ref,
                <Element<any>
                  canvas={element.component.craft.isCanvas}
                  is={element.component}
                />
              )
            }
          >
            <Text>{element.component.craft.displayName}</Text>
          </Box>
        );
      })}
    </VStack>
  );
};
