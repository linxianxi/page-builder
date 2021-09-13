import {
  Box,
  BoxProps,
  Flex,
  FormLabel,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react";
import { useNode } from "@craftjs/core";
import React, { FC, ReactNode } from "react";
import { SketchPicker } from "react-color";
import { FaWindowClose } from "react-icons/fa";

export interface ColorPickerProps {
  label: ReactNode;
  propName: string;
  layout?: "vertical" | "horizontal";
  allowClear?: boolean;
  size?: BoxProps["w"];
}

export const ColorPicker: FC<ColorPickerProps> = ({
  label,
  propName,
  layout = "horizontal",
  allowClear = true,
  size = 8,
}) => {
  const {
    actions: { setProp },
    propValue,
  } = useNode((node) => ({
    propValue: node.data.props[propName],
  }));

  return (
    <Flex
      direction={layout === "horizontal" ? "row" : "column"}
      justify={layout === "horizontal" && "space-between"}
      align={layout === "horizontal" && "center"}
    >
      {layout === "horizontal" && <FormLabel mb={0}>{label}</FormLabel>}
      <Popover>
        <PopoverTrigger>
          <Box
            pos="relative"
            tabIndex={0}
            w={size}
            h={size}
            borderRadius="md"
            boxShadow="inset 0 0 0 1px rgba(0, 0, 0, 0.07), inset 0 1px 3px 0 rgba(0, 0, 0, 0.15)"
            cursor="pointer"
            {...(propValue
              ? { bg: propValue }
              : {
                  bgPos: "0 0,6px 6px",
                  bgSize: "13px 13px",
                  bgImage:
                    "linear-gradient(45deg,#dfe3e8 25%,transparent 0,transparent 75%,#dfe3e8 0,#dfe3e8),linear-gradient(45deg,#dfe3e8 25%,#fff 0,#fff 75%,#dfe3e8 0,#dfe3e8)",
                })}
          >
            {allowClear && propValue && (
              <IconButton
                aria-label="删除"
                icon={<FaWindowClose />}
                h="15px"
                width="16px"
                minW="unset"
                _hover={{
                  opacity: 0.8,
                }}
                style={{ position: "absolute", top: -4, right: -4 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setProp((props) => {
                    props[propName] = "";
                  });
                }}
              />
            )}
          </Box>
        </PopoverTrigger>
        <Portal>
          <PopoverContent w="unset" _focus={{ boxShadow: "none" }}>
            <PopoverBody p="0">
              {
                <SketchPicker
                  color={propValue || "transparent"}
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
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
      {layout === "vertical" && (
        <FormLabel m={0} mt={1}>
          {label}
        </FormLabel>
      )}
    </Flex>
  );
};
