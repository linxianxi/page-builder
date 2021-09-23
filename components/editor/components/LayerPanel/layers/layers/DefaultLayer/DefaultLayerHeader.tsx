import {
  FaAngleDown,
  FaAngleRight,
  FaEye,
  FaEyeSlash,
  FaLink,
} from "react-icons/fa";

import { useEditor } from "@craftjs/core";
import React from "react";

import { EditableLayerName } from "./EditableLayerName";

import { useLayer } from "../useLayer";
import { Box, Flex, IconButton } from "@chakra-ui/react";

export const DefaultLayerHeader: React.FC = () => {
  const {
    id,
    depth,
    expanded,
    children,
    connectors: { drag, layerHeader },
    actions: { toggleLayer },
  } = useLayer((layer) => {
    return {
      expanded: layer.expanded,
    };
  });

  const { hidden, actions, selected, topLevel } = useEditor((state, query) => {
    const selected = query.getEvent("selected").first() === id;

    return {
      hidden: state.nodes[id] && state.nodes[id].data.hidden,
      selected,
      topLevel: query.node(id).isTopLevelCanvas(),
    };
  });

  return (
    <Flex
      ref={drag}
      background={selected ? "blue.100" : "transparent"}
      borderRadius="md"
      pl={`${depth}em`}
      height={8}
      align="center"
    >
      {children?.length ? (
        <IconButton
          size="sm"
          colorScheme="blackAlpha"
          variant="ghost"
          aria-label="expanded"
          icon={expanded ? <FaAngleDown /> : <FaAngleRight />}
          onMouseDown={() => toggleLayer()}
        />
      ) : (
        <Box width={8}></Box>
      )}

      <Flex flex={1} ref={layerHeader}>
        {topLevel ? <FaLink /> : null}

        <Flex flex={1} align="center">
          <EditableLayerName />
        </Flex>

        <IconButton
          size="sm"
          colorScheme="blackAlpha"
          variant="ghost"
          aria-label="hidden"
          icon={hidden ? <FaEyeSlash /> : <FaEye />}
          onClick={() => actions.setHidden(id, !hidden)}
        />
      </Flex>
    </Flex>
  );
};
