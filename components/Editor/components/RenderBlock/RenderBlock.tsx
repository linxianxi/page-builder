import { useNode, useEditor, ROOT_NODE } from "@craftjs/core";
import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { FaArrowsAlt, FaPlus, FaTrash } from "react-icons/fa";
import { useRect } from "@reach/rect";

export const RenderBlock = ({ render }) => {
  const { id } = useNode();

  const { actions, query, isActive } = useEditor((state) => ({
    isActive: state.nodes[id].events.selected,
  }));

  const {
    isHover,
    dom,
    moveable,
    deletable,
    name,
    connectors: { drag },
  } = useNode((node) => ({
    isHover: node.events.hovered,
    dom: node.dom,
    name: node.data?.custom.displayName || node.data.displayName,
    moveable: query.node(node.id).isDraggable(),
    deletable: query.node(node.id).isDeletable(),
    parent: node.data.parent,
    props: node.data.props,
  }));

  const ref = useRef(dom);
  const rect = useRect(ref);

  useEffect(() => {
    if (dom) {
      ref.current = dom;
    }
  }, [dom]);

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
              {isActive ? (
                <Box
                  pos="fixed"
                  zIndex="docked"
                  boxShadow="lg"
                  borderRadius="md"
                  style={{
                    left: rect.x,
                    top: rect.y === 0 ? rect.y + rect.height : rect.y - 32,
                  }}
                >
                  <ButtonGroup isAttached colorScheme="blue" size="sm">
                    {moveable ? <Button ref={drag}>{name}</Button> : null}

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
                          aria-label="删除"
                          onClick={(event) => {
                            console.log("删除", id);
                            event.stopPropagation();
                            actions.delete(id);
                          }}
                          icon={<FaTrash />}
                        />
                      </Tooltip>
                    ) : null}
                  </ButtonGroup>
                </Box>
              ) : null}

              {isActive && id !== ROOT_NODE ? (
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
              ) : null}

              <Box
                pos="absolute"
                borderTopColor="blue.500"
                borderTopWidth={isActive ? 2 : 1}
                borderTopStyle={isActive ? "dashed" : "solid"}
                style={{
                  top: 0,
                  left: 0,
                  width: rect.width,
                }}
              />

              <Box
                pos="absolute"
                borderLeftColor="blue.500"
                borderLeftWidth={isActive ? 2 : 1}
                borderLeftStyle={isActive ? "dashed" : "solid"}
                style={{
                  top: 0,
                  left: 0,
                  height: rect.height,
                }}
              />

              <Box
                pos="absolute"
                borderBottomColor="blue.500"
                borderBottomWidth={isActive ? 2 : 1}
                borderBottomStyle={isActive ? "dashed" : "solid"}
                style={{
                  top: rect.height - (isActive ? 2 : 1),
                  left: 0,
                  width: rect.width,
                }}
              />

              <Box
                pos="absolute"
                borderRightColor="blue.500"
                borderRightWidth={isActive ? 2 : 1}
                borderRightStyle={isActive ? "dashed" : "solid"}
                style={{
                  top: 0,
                  left: rect.width - (isActive ? 2 : 1),
                  height: rect.height,
                }}
              />
            </Box>,
            document.querySelector(".page-container")
          )
        : null}
      {render}
    </>
  );
};
