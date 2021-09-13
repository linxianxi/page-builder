import { FC } from "react";
import { Element, useEditor } from "@craftjs/core";
import { Text, SimpleGrid, Button } from "@chakra-ui/react";
import React from "react";

import { Image as UserImage } from "../../../blocks/Image";
import { Container as UserContainer } from "../../../blocks/Container";
import { Box as UserBox } from "../../../blocks/Box";
import { Code as UserCode } from "../../../blocks/Code";
import { Cell, Column as UserColumn } from "../../../blocks/Column";
import { Button as UserButton } from "../../../blocks/Button";
import { FaCode, FaColumns, FaImage, FaRegSquare } from "react-icons/fa";

const elements = [
  {
    component: UserButton,
    icon: <FaRegSquare size={25} />,
  },
  {
    component: UserBox,
    icon: <FaRegSquare size={25} />,
  },
  {
    component: UserCode,
    icon: <FaCode size={25} />,
  },
  {
    component: UserContainer,
    icon: <FaRegSquare size={25} />,
  },
  {
    component: UserImage,
    icon: <FaImage size={25} />,
  },
  {
    component: UserColumn,
    icon: <FaColumns size={25} />,
  },
];

export const InsertPanel: FC = () => {
  const {
    connectors: { create },
  } = useEditor();

  return (
    <SimpleGrid columns={3} spacing={4}>
      {elements.map((element, index) => {
        return (
          <Button
            key={index}
            h="70px"
            flexDirection="column"
            ref={(ref) => {
              if (element.component === UserColumn) {
                return create(
                  ref,
                  <Element
                    canvas={element.component.craft.isCanvas}
                    is={element.component}
                  >
                    <Element canvas is={Cell} />
                  </Element>
                );
              }
              return create(
                ref,
                <Element
                  canvas={element.component.craft.isCanvas}
                  is={element.component}
                />
              );
            }}
          >
            {element.icon}
            <Text mt="5px">{element.component.craft.displayName}</Text>
          </Button>
        );
      })}
    </SimpleGrid>
  );
};
