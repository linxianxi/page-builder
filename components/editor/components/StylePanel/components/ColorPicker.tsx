import { useNode } from "@craftjs/core";
import { Input, Popover } from "antd";
import React, { FC, ReactNode } from "react";
import { SketchPicker } from "react-color";

export interface ColorPickerProps {
  label: ReactNode;
  propName: string;
  layout?: "vertical" | "horizontal";
  allowClear?: boolean;
}

const ColorPicker: FC<ColorPickerProps> = ({ label, propName }) => {
  const {
    actions: { setProp },
    propValue,
  } = useNode((node) => ({
    propValue: node.data.props[propName],
  }));

  return (
    <div>
      <Input
        value={propValue}
        onChange={(e) =>
          setProp((props) => {
            props[propName] = e.target.value;
          }, 500)
        }
        suffix={
          <Popover
            trigger="click"
            content={
              <SketchPicker
                color={propValue || "transparent"}
                styles={{
                  default: {
                    picker: {
                      boxShadow: "none",
                      padding: 0,
                    },
                  },
                }}
                onChange={(colorState) => {
                  if (
                    colorState.source === "hex" ||
                    colorState.source === "hsv" ||
                    colorState.source === "hsl"
                  ) {
                    setProp((props) => {
                      props[propName] = colorState.hex;
                    });
                  } else if (colorState.source === "rgb") {
                    const color = `rgba(${colorState.rgb.r},${colorState.rgb.g},${colorState.rgb.b},${colorState.rgb.a})`;
                    setProp((props) => {
                      props[propName] = color;
                    });
                  }
                }}
              />
            }
          >
            <div
              className="w-5 h-5 rounded box-content cursor-pointer"
              style={
                propValue
                  ? { backgroundColor: propValue }
                  : {
                      backgroundPosition: "0 0, 4px 4px",
                      backgroundSize: "8px 8px",
                      border: "1px solid #d9d9d9",
                      backgroundImage:
                        "linear-gradient(45deg,#dfe3e8 25%,transparent 0,transparent 75%,#dfe3e8 0,#dfe3e8),linear-gradient(45deg,#dfe3e8 25%,#fff 0,#fff 75%,#dfe3e8 0,#dfe3e8)",
                    }
              }
            />
          </Popover>
        }
      ></Input>
    </div>
  );
};

export default ColorPicker;
