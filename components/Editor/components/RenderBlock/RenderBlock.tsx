import { useNode, useEditor } from "@craftjs/core";
import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { Box, Button, ButtonGroup } from "@chakra-ui/react";
import { FaArrowsAlt, FaTrash } from "react-icons/fa";
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
    connectors: { drag },
  } = useNode((node) => ({
    isHover: node.events.hovered,
    dom: node.dom,
    name: node.data.custom.displayName || node.data.displayName,
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
                  __css={{
                    mt: -8,
                  }}
                  style={{
                    left: rect.x + rect.width / 4,
                    top: rect.y === 0 ? rect.y + rect.height : rect.y,
                  }}
                >
                  <ButtonGroup isAttached size="sm">
                    {moveable ? (
                      <Button ref={drag}>
                        <FaArrowsAlt />
                      </Button>
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
                      <Button
                        ref={drag}
                        onClick={(event) => {
                          event.stopPropagation();
                          actions.delete(id);
                        }}
                      >
                        <FaTrash />
                      </Button>
                    ) : null}
                  </ButtonGroup>
                </Box>
              ) : null}

              <Box
                pos="absolute"
                borderTopColor="blue"
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
                borderLeftColor="blue"
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
                borderBottomColor="blue"
                borderBottomWidth={isActive ? 2 : 1}
                borderBottomStyle={isActive ? "dashed" : "solid"}
                style={{
                  top: rect.height,
                  left: 0,
                  width: rect.width,
                }}
              />

              <Box
                pos="absolute"
                borderRightColor="blue"
                borderRightWidth={isActive ? 2 : 1}
                borderRightStyle={isActive ? "dashed" : "solid"}
                style={{
                  top: 0,
                  left: rect.width,
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
