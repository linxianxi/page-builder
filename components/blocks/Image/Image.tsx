import { UserComponent, useNode } from "@craftjs/core";
import {
  Box,
  Image as BaseImage,
  ImageProps as BaseImageProps,
} from "@chakra-ui/react";
import React from "react";

import { Toolbar } from "../../Editor/components/Toolbar/Toolbar";

export interface ImageProps extends BaseImageProps {}

export const Image: UserComponent<ImageProps> = ({ src, ...otherProps }) => {
  const {
    connectors: { connect, drag },
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  return (
    <BaseImage
      ref={(ref) => connect(drag(ref))}
      maxWidth="full"
      src={src || "https://cdn.pagefly.io/static/images/placeholder-square.svg"}
      {...otherProps}
    />
  );
};

Image.craft = {
  displayName: "图片",
  props: {},
  related: {
    toolbar: () => {
      return (
        <Toolbar
          config={[
            {
              name: "图片",
              toolbars: [
                {
                  name: "图片",
                  prop: "src",
                  type: "input",
                },
              ],
            },
          ]}
        />
      );
    },
  },
};
