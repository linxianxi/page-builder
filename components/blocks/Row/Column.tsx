import { UserComponent } from "@craftjs/core";
import React from "react";
import { Resizer } from "./components/Resizer";
import { StylePanel } from "../../editor/components/StylePanel";
import styled from "@emotion/styled";

const Empty = styled.div`
  color: #ccc;
  text-align: center;
  padding: 20px 0;
`;

export const Column: UserComponent = ({ children }) => (
  <Resizer>{children || <Empty>+ add block</Empty>}</Resizer>
);

Column.craft = {
  displayName: "列",
  defaultProps: {
    columnWidth: "50%",
  },
  rules: {
    // 只能在当前列里交换位置
    canDrop: (dropTarget, current) => {
      if (dropTarget.id === current.data.parent) {
        return true;
      }

      return false;
    },
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
              { type: "input", label: "宽度", propName: "width" },
              { type: "input", label: "最小宽度", propName: "minWidth" },
              { type: "input", label: "最大宽度", propName: "maxWidth" },
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
