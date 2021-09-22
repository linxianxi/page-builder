import {
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Tooltip,
  Stack,
  PopoverContent,
  PopoverBody,
  Popover,
  PopoverTrigger,
} from "@chakra-ui/react";
import { useEditor } from "@craftjs/core";
import React from "react";

import {
  FaMobileAlt,
  FaArrowLeft,
  FaDesktop,
  FaRedo,
  FaUndo,
  FaTabletAlt,
} from "react-icons/fa";
import { usePreviewMode } from "../../hooks/usePreviewMode";

const previewModeOptions = [
  { name: "桌面", icon: <FaDesktop />, value: "desktop" },
  { name: "平板", icon: <FaTabletAlt />, value: "tablet" },
  { name: "移动", icon: <FaMobileAlt />, value: "mobile" },
];

export const TopBar = () => {
  const { query, canUndo, canRedo, actions } = useEditor((state, query) => ({
    enabled: state.options.enabled,
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));

  const [previewMode, setPreviewMode] = usePreviewMode();

  return (
    <Flex
      align="center"
      justify="space-between"
      height={14}
      borderBottomWidth={1}
      borderBottomColor="gray.200"
      px={4}
    >
      <Stack>
        <IconButton
          aria-label="退出"
          icon={<FaArrowLeft />}
          onClick={() => actions.history.undo()}
        />
      </Stack>

      <ButtonGroup>
        <Popover>
          <PopoverTrigger>
            <IconButton
              aria-label="预览模式"
              icon={
                previewModeOptions.find((item) => item.value === previewMode)
                  ?.icon
              }
            />
          </PopoverTrigger>
          <PopoverContent width={36}>
            <PopoverBody>
              <Stack direction="column">
                {previewModeOptions.map((item) => (
                  <Button
                    key={item.name}
                    justifyContent="flex-start"
                    leftIcon={item.icon}
                    onClick={() => setPreviewMode(item.value)}
                  >
                    {item.name}
                  </Button>
                ))}
              </Stack>
            </PopoverBody>
          </PopoverContent>
        </Popover>

        <Tooltip label="撤销">
          <IconButton
            aria-label="撤销"
            isDisabled={!canUndo}
            icon={<FaUndo />}
            onClick={() => actions.history.undo()}
          />
        </Tooltip>
        <Tooltip label="重做">
          <IconButton
            aria-label="重做"
            isDisabled={!canRedo}
            icon={<FaRedo />}
            onClick={() => actions.history.redo()}
          />
        </Tooltip>
        <Button
          onClick={() => {
            const data = query.serialize();
            localStorage.setItem("data", data);
            console.log(data);
          }}
        >
          保存
        </Button>
      </ButtonGroup>
    </Flex>
  );
};
