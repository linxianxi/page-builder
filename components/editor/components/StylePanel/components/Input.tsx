import { Input as BaseInput, InputProps as BaseInputProps } from "antd";
import { useNode } from "@craftjs/core";
import React, { FC } from "react";
import { ReactNode } from "react";

export interface InputProps extends BaseInputProps {
  label: ReactNode;
  propName: string;
}

export const Input: FC<InputProps> = ({ label, propName, ...props }) => {
  const {
    actions: { setProp },
    propValue,
  } = useNode((node) => ({
    propValue: node.data.props[propName],
  }));

  return (
    <div>
      <div>{label}</div>
      <BaseInput
        value={propValue || ""}
        onChange={(event) => {
          setProp((props) => {
            props[propName] = event.target.value;
          }, 500);
        }}
        {...props}
      />
    </div>
  );
};
