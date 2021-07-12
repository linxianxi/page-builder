import { FC, useState } from "react";
import { Element, useEditor } from "@craftjs/core";
import {
  Box,
  Flex,
  VStack,
  IconButton,
  Drawer,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Tooltip,
  Text,
  StackDivider,
} from "@chakra-ui/react";
import React from "react";

import { FaPlus } from "react-icons/fa";
import { Image as UserImage } from "../../../blocks/Image";
import { Grid as UserGrid } from "../../../blocks/Grid";
import { Container as UserContainer } from "../../../blocks/Container";

const elements = [
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

export const Toolbox: FC = () => {
  const {
    enabled,
    connectors: { create },
  } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [mouseDown, setMouseDown] = useState(false);

  return (
    <>
      <Flex
        basis={14}
        direction="column"
        align="center"
        py={1.5}
        borderRightColor="gray.300"
        borderRightWidth={1}
      >
        <VStack>
          <Tooltip label="添加元素">
            <IconButton
              aria-label="添加元素"
              icon={<FaPlus />}
              onClick={onOpen}
            />
          </Tooltip>
        </VStack>
      </Flex>

      <Drawer placement="left" isOpen={isOpen} onClose={onClose}>
        <DrawerContent>
          <DrawerCloseButton />

          <DrawerHeader>添加元素</DrawerHeader>

          <DrawerBody>
            <VStack
              divider={<StackDivider borderColor="gray.300" />}
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
                        <Element
                          canvas={element.component.craft.isCanvas}
                          is={element.component}
                        ></Element>
                      )
                    }
                    onMouseDown={() => {
                      setMouseDown(true);
                    }}
                    onMouseMove={() => {
                      if (mouseDown) {
                        setMouseDown(false);
                        setTimeout(onClose, 500);
                      }
                    }}
                  >
                    <Text>{element.component.craft.displayName}</Text>
                  </Box>
                );
              })}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
