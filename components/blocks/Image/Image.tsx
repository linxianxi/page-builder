import { UserComponent, useNode } from "@craftjs/core";
import {
  Image as BaseImage,
  ImageProps as BaseImageProps,
} from "@chakra-ui/react";
import React from "react";

import { ToolBar } from "../../editor/components/ToolBar";
import { StylePanel } from "../../editor/components/StylePanel";

export interface ImageProps extends BaseImageProps {}

export const Image: UserComponent<ImageProps> = ({ src, ...otherProps }) => {
  const {
    connectors: { connect },
  } = useNode();

  return (
    <BaseImage
      ref={connect}
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
    inputPanel: () => {
      return (
        <ToolBar
          inputs={[
            {
              type: "string",
              name: "地址",
              prop: "src",
            },
          ]}
        />
      );
    },
    stylePanel: () => (
      <StylePanel
        configs={[
          {
            label: "尺寸",
            inputs: [
              { type: "input", label: "宽度", propName: "width" },
              { type: "input", label: "高度", propName: "height" },
              { type: "input", label: "最小宽度", propName: "minWidth" },
              { type: "input", label: "最小高度", propName: "minHeight" },
              { type: "input", label: "最大宽度", propName: "maxWidth" },
              { type: "input", label: "最大高度", propName: "maxHeight" },
            ],
          },
          {
            label: "外边距",
            inputs: [
              { type: "input", label: "上", propName: "marginTop" },
              { type: "input", label: "下", propName: "marginBottom" },
              { type: "input", label: "左", propName: "marginLeft" },
              { type: "input", label: "右", propName: "marginRight" },
            ],
          },
          {
            label: "内边距",
            inputs: [
              { type: "input", label: "上", propName: "paddingTop" },
              { type: "input", label: "下", propName: "paddingBottom" },
              { type: "input", label: "左", propName: "paddingLeft" },
              { type: "input", label: "右", propName: "paddingRight" },
            ],
          },
        ]}
      />
    ),
  },
};
