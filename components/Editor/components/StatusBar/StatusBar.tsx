import { FC } from "react";
import { useEditor } from "@craftjs/core";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Text,
} from "@chakra-ui/react";
import React from "react";

export const StatusBar: FC = () => {
  const { actions, selected, selectedAncestorNodes } = useEditor(
    (state, query) => ({
      selected: state.events.selected,
      selectedAncestorNodes: state.events.selected
        ? [
            query.node(state.events.selected).get(),
            ...query
              .node(state.events.selected)
              .ancestors()
              .map((id) => query.node(id).get()),
          ].reverse()
        : [],
    })
  );

  return (
    <Flex
      align="center"
      justify="space-between"
      px={4}
      width="full"
      height={8}
      borderTopColor="gray.200"
      borderTopWidth={1}
      borderLeftWidth={1}
      borderRightWidth={1}
    >
      {selectedAncestorNodes.length > 0 ? (
        <Breadcrumb fontWeight="medium" fontSize="xs">
          {selectedAncestorNodes.map((node) => {
            return (
              <BreadcrumbItem
                key={node.id}
                isCurrentPage={node.id === "selected"}
              >
                <BreadcrumbLink onClick={() => actions.selectNode(node.id)}>
                  {node.data?.custom.displayName || node.data.displayName}
                </BreadcrumbLink>
              </BreadcrumbItem>
            );
          })}
        </Breadcrumb>
      ) : (
        <Text fontSize="xs" color="gray">
          没有选中的模块
        </Text>
      )}
    </Flex>
  );
};
