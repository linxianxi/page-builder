import { UserComponent } from "@craftjs/core";
import React from "react";
import { Resizer } from "./components/Resizer";
import { Box } from "@chakra-ui/react";
import { StylePanel } from "../../Editor/components/StylePanel";

export const Cell: UserComponent = ({ children }) => (
  <Resizer>
    {children || (
      <Box color="gray.400" textAlign="center" py={5}>
        这里是空的，请拖拽内容到这里
      </Box>
    )}
  </Resizer>
);

Cell.craft = {
  displayName: "列",
  defaultProps: {
    width: "100%",
  },
  rules: {
    canDrag: () => false,
  },
  related: {
    stylePanel: () => (
      <StylePanel
        configs={[
          {
            label: "尺寸",
            inputs: [
              { type: "input", label: "高度", propName: "height" },
              { type: "input", label: "最小高度", propName: "minHeight" },
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
          {
            label: "颜色",
            inputs: [
              {
                type: "color",
                label: "文字颜色",
                propName: "color",
                colSpan: 2,
              },
              {
                type: "color",
                label: "背景颜色",
                propName: "backgroundColor",
                colSpan: 2,
              },
            ],
          },
          {
            label: "边框",
            inputs: [
              {
                type: "select",
                label: "风格",
                propName: "borderStyle",
                options: [
                  { label: "solid", value: "solid" },
                  { label: "dotted", value: "dotted" },
                  { label: "dashed", value: "dashed" },
                ],
                colSpan: 2,
              },
              {
                type: "input",
                label: "宽度",
                propName: "borderWidth",
                layout: "horizontal",
                colSpan: 2,
              },
              {
                type: "color",
                label: "颜色",
                propName: "borderColor",
                colSpan: 2,
              },
            ],
          },
        ]}
      />
    ),
  },
};
