import { useNode, useEditor, ROOT_NODE } from "@craftjs/core";
import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { Global } from "@emotion/react";
import { Patch } from "immer";
import { Box, IconButton, Tooltip, Text, Flex } from "@chakra-ui/react";
import { FaArrowsAlt, FaTrash } from "react-icons/fa";
import { useRect } from "@reach/rect";
import { useCallback } from "react";

export const RenderBlock = ({ render }) => {
  const { actions, query, hoveredNodeId, nodes, store } = useEditor(
    (state, query) => {
      const currentlyHoveredNodeId = query.getEvent("hovered").first();

      return {
        hoveredNodeId: currentlyHoveredNodeId,
        nodes: state.nodes,
      };
    }
  );

  const {
    id,
    isHover,
    isActive,
    parent,
    dom,
    moveable,
    deletable,
    name,
    displayName,
    nodeProps,
    connectors: { drag },
  } = useNode((node) => ({
    isActive: node.events.selected,
    isHover: node.events.hovered,
    dom: node.dom,
    displayName: node.data.displayName,
    name: node.data.name,
    moveable: query.node(node.id).isDraggable(),
    deletable: query.node(node.id).isDeletable(),
    parent: node.data.parent,
    nodeProps: node.data.props,
  }));

  const ref = useRef(dom);
  const rect = useRect(ref);

  useEffect(() => {
    if (dom) {
      ref.current = dom;

      if (isActive || isHover) {
        if (name === "Cell") {
          const children = dom.parentElement?.children as HTMLCollection;
          for (let i = 0; i < children?.length; i += 1) {
            children[i].classList.add("component-selected");
          }
          query
            .node(parent)
            .childNodes()
            .forEach((item) => {
              actions.history.ignore().setProp(item, (props) => {
                props.showHandle = true;
              });
            });
        } else {
          dom.classList.add("component-selected");
        }
      } else if (name === "Cell") {
        let selected = false;
        // 查询所有 Cell 是否有被 selected 选中的，如果有就不删除
        query
          .node(parent)
          .childNodes()
          .forEach((item) => {
            if (query.node(item).get().events.selected) {
              selected = true;
            }
          });
        if (selected) {
          return;
        }
        // 如果下一个 hover 的和当前离开的 Cell 是同一个 parent，不删除
        if (
          hoveredNodeId &&
          query.node(hoveredNodeId).get().data.parent === parent
        ) {
          return;
        }
        query
          .node(parent)
          .childNodes()
          .forEach((item) => {
            actions.history.ignore().setProp(item, (props) => {
              props.showHandle = false;
            });
          });
        const children = dom.parentElement?.children as HTMLCollection;
        for (let i = 0; i < children?.length; i += 1) {
          children[i].classList.remove("component-selected");
        }
      } else {
        dom.classList.remove("component-selected");
      }
    }
  }, [
    actions.history,
    dom,
    hoveredNodeId,
    isActive,
    isHover,
    name,
    parent,
    query,
  ]);

  const handleDelete = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      if (name === "Cell") {
        const childrenArr = query
          .node(query.node(id).get().data.parent)
          .childNodes()
          .filter((item) => item !== id);
        // 如果就一个，直接把 Column 删掉
        if (childrenArr.length === 0) {
          actions.delete(parent);
        } else {
          // 删除一个 Cell，其余的平分
          const newPatches: Patch[] = [];
          const oldPatches: Patch[] = [];
          childrenArr.forEach((item) => {
            const { width } = query.node(item).get().data.props;
            const newWidth = `${
              parseFloat(width) +
              parseFloat(nodeProps.width) / childrenArr.length
            }%`;

            newPatches.push({
              op: "replace",
              path: ["nodes", item, "data", "props", "width"],
              value: newWidth,
            });
            oldPatches.push({
              op: "replace",
              path: ["nodes", item, "data", "props", "width"],
              value: width,
            });

            actions.history.ignore().setProp(item, (prop) => {
              // eslint-disable-next-line no-param-reassign
              prop.width = newWidth;
            });
          });
          actions.history.ignore().delete(id);
          const timelinePath = ["nodes", id];
          store.history.add(
            [
              {
                op: "remove",
                path: timelinePath,
              },
              {
                op: "replace",
                path: ["nodes", parent, "data", "nodes"],
                value: nodes[parent].data.nodes.filter((i) => i !== id),
              },
              ...newPatches,
            ],
            [
              {
                op: "add",
                path: timelinePath,
                value: nodes[id],
              },
              {
                op: "replace",
                path: ["nodes", parent, "data", "nodes"],
                value: nodes[parent].data.nodes,
              },
              ...oldPatches,
            ]
          );
        }
      } else {
        actions.delete(id);
      }
    },
    [actions, id, name, nodeProps.width, nodes, parent, query, store.history]
  );

  return (
    <>
      {rect && (isHover || isActive)
        ? ReactDOM.createPortal(
            <Box
              pos="fixed"
              zIndex="docked"
              style={{
                left: rect.x,
                top: rect.y,
              }}
            >
              <Global
                styles={{
                  ".component-selected": {
                    position: "relative",
                  },
                  ".component-selected::after": {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    display: "block",
                    content: "''",
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    border: "2px dashed var(--chakra-colors-blue-500)",
                  },
                }}
              />
              {isActive ? (
                <Box
                  pos="fixed"
                  zIndex="docked"
                  boxShadow="lg"
                  borderRadius="md"
                  style={{
                    left: rect.x,
                    top: rect.y === 0 ? rect.y + rect.height : rect.y - 40,
                  }}
                >
                  <Flex bg="blue.500" borderRadius="md" align="center">
                    <Text color="#fff" px={3} py={2}>
                      {displayName}
                    </Text>
                    {moveable ? (
                      <Tooltip label="拖拽">
                        <IconButton
                          colorScheme="blue"
                          ref={drag}
                          aria-label="拖拽"
                          icon={<FaArrowsAlt />}
                        />
                      </Tooltip>
                    ) : null}

                    {/* {id !== ROOT_NODE && (
                  <Button
                    ref={drag}
                    aria-label="Drag"
                    icon={<FaAngleUp />}
                    onClick={() => {
                      actions.selectNode(parent);
                    }}
                  />
                )} */}

                    {deletable ? (
                      <Tooltip label="删除">
                        <IconButton
                          colorScheme="blue"
                          aria-label="删除"
                          onClick={handleDelete}
                          icon={<FaTrash />}
                        />
                      </Tooltip>
                    ) : null}
                  </Flex>
                </Box>
              ) : null}

              {/* {isActive &&
              id !== ROOT_NODE &&
              name !== "Button" &&
              name !== "Column" ? (
                <Tooltip label="在这里插入模块">
                  <IconButton
                    isRound
                    colorScheme="blue"
                    aria-label="插入模块"
                    size="sm"
                    pos="fixed"
                    zIndex="docked"
                    icon={<FaPlus />}
                    style={{
                      left: rect.x + rect.width - 48,
                      top: rect.y + rect.height - 16,
                    }}
                  />
                </Tooltip>
              ) : null} */}
            </Box>,
            document.querySelector(".page-container")
          )
        : null}
      {render}
    </>
  );
};
