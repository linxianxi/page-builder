import { useNode, useEditor, Node, ROOT_NODE, NodeTree } from "@craftjs/core";
import { getRandomId } from "@craftjs/utils";
import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { Patch } from "immer";
import {
  FaArrowsAlt,
  FaTrash,
  FaCopy,
  FaCloudDownloadAlt,
} from "react-icons/fa";
import { useCallback } from "react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import memoize from "@emotion/memoize";
import stylisPluginExtraScope from "stylis-plugin-extra-scope";
import { useIsScrolling } from "../../hooks/useIsScrolling";
import { Flex, IconButton, Tooltip, Text, Box } from "@chakra-ui/react";
import { usePreviewMode } from "../../hooks/usePreviewMode";
import { useRect } from "@reach/rect";

let memoizedCreateCacheWithScope = memoize((scope) => {
  return createCache({
    key: "render-block",
    stylisPlugins: [stylisPluginExtraScope(scope)],
  });
});

const fromEntries = (pairs) => {
  if (Object.fromEntries) {
    return Object.fromEntries(pairs);
  }
  return pairs.reduce(
    (accum, [id, value]) => ({
      ...accum,
      [id]: value,
    }),
    {}
  );
};

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
    nodeChildren,
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
    nodeChildren: node.data.nodes,
  }));

  const currentRef = useRef<HTMLDivElement>();

  const ref = useRef(dom);
  const rect = useRect(ref, { observe: !!ref.current });

  const [previewMode] = usePreviewMode();
  const [isScrolling] = useIsScrolling();

  const getPos = useCallback((dom: HTMLElement) => {
    const { top, left, bottom } = dom
      ? dom.getBoundingClientRect()
      : { top: 0, left: 0, bottom: 0 };

    return {
      top: `${top > 30 ? top : bottom + 30}px`,
      left: `${left}px`,
    };
  }, []);

  const computePos = useCallback(() => {
    const { current: currentDOM } = currentRef;
    if (!currentDOM) return;
    const { top, left } = getPos(dom);
    currentDOM.style.top = top;
    currentDOM.style.left = left;
  }, [dom, getPos]);

  // 显示模式变化重新计算
  useEffect(() => {
    computePos();
  }, [previewMode, computePos]);

  useEffect(() => {
    window.addEventListener("resize", computePos);

    return () => {
      window.removeEventListener("resize", computePos);
    };
  }, [computePos]);

  useEffect(() => {
    if (dom) {
      ref.current = dom;

      if (isActive || isHover) {
        if (name === "Column") {
          const children = dom.parentElement.children;
          for (let i = 0; i < children.length; i += 1) {
            if (isActive) {
              children[i].classList.add("component-selected-active");
            } else {
              children[i].classList.add("component-selected");
            }
          }
          query
            .node(parent)
            .childNodes()
            .forEach((item) => {
              actions.history.ignore().setProp(item, (props) => {
                props.showHandle = true;
              });
            });
        }
      } else if (name === "Column") {
        let selected = false;
        // 查询所有 Column 是否有被 selected 选中的，如果有就不删除
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
        // 如果下一个 hover 的和当前离开的 Column 是同一个 parent，不删除
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

        const children = dom.parentElement?.children;
        for (let i = 0; i < children?.length; i += 1) {
          children[i].classList.remove(
            "component-selected",
            "component-selected-active"
          );
        }
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

  const getCloneTree = useCallback(
    (tree: NodeTree) => {
      const newNodes = {};
      const changeNodeId = (node: Node, newParentId?: string) => {
        const newNodeId = getRandomId();
        const childNodes = node.data.nodes.map((childId) =>
          changeNodeId(tree.nodes[childId], newNodeId)
        );
        const linkedNodes = Object.keys(node.data.linkedNodes).reduce(
          (acc, id) => {
            const newLinkedNodeId = changeNodeId(
              tree.nodes[node.data.linkedNodes[id]],
              newNodeId
            );
            return {
              ...acc,
              [id]: newLinkedNodeId,
            };
          },
          {}
        );

        let tmpNode = {
          ...node,
          id: newNodeId,
          data: {
            ...node.data,
            parent: newParentId || node.data.parent,
            nodes: childNodes,
            linkedNodes,
          },
        };
        let freshNode = query.parseFreshNode(tmpNode).toNode();
        newNodes[newNodeId] = freshNode;
        return newNodeId;
      };

      const rootNodeId = changeNodeId(tree.nodes[tree.rootNodeId]);
      return {
        rootNodeId,
        nodes: newNodes,
      };
    },
    [query]
  );

  const handleCopy = useCallback(() => {
    const tree = query.node(id).toNodeTree();
    const { rootNodeId, nodes: newNodes } = getCloneTree(tree);

    const theNode = query.node(id).get();
    const parentNode = query.node(theNode.data.parent).get();
    const indexToAdd = parentNode.data.nodes.indexOf(id);

    // 如果是 Column 拷贝，需要修改宽度，比较复杂
    if (name === "Column") {
      const newPatches: Patch[] = [];
      const oldPatches: Patch[] = [];
      const rowChildren = parentNode.data.nodes;
      const newWidth = `${100 / (rowChildren.length + 1)}%`;
      newNodes[rootNodeId].data.props.columnWidth = newWidth;
      // 遍历原来的 Column，平分宽度
      rowChildren.forEach((item) => {
        const { columnWidth } = query.node(item).get().data.props;
        newPatches.push({
          op: "replace",
          path: ["nodes", item, "data", "props", "columnWidth"],
          value: newWidth,
        });
        oldPatches.push({
          op: "replace",
          path: ["nodes", item, "data", "props", "columnWidth"],
          value: columnWidth,
        });
        actions.history.ignore().setProp(item, (props) => {
          props.columnWidth = newWidth;
        });
      });

      actions.history.ignore().addNodeTree(
        {
          rootNodeId,
          nodes: newNodes,
        },
        parentNode.id,
        indexToAdd + 1
      );

      store.history.add(
        [
          ...(Object.keys(newNodes).map((key) => ({
            op: "add",
            path: ["nodes", key],
            value: newNodes[key],
          })) as Patch[]),
          {
            op: "replace",
            path: ["nodes", parentNode.id, "data", "nodes"],
            value: parentNode.data.nodes.concat(rootNodeId),
          },
          ...newPatches,
        ],
        [
          ...(Object.keys(newNodes).map((key) => ({
            op: "remove",
            path: ["nodes", key],
          })) as Patch[]),
          {
            op: "replace",
            path: ["nodes", parentNode.id, "data", "nodes"],
            value: parentNode.data.nodes,
          },
          ...oldPatches,
        ]
      );
    } else {
      actions.addNodeTree(
        {
          rootNodeId,
          nodes: newNodes,
        },
        parentNode.id,
        indexToAdd + 1
      );
    }

    actions.selectNode(rootNodeId);
  }, [actions, getCloneTree, id, name, query, store.history]);

  const handleDelete = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      if (name === "Column") {
        // 剩下的 Column
        const otherChildrenArr = query
          .node(parent)
          .childNodes()
          .filter((item) => item !== id);
        // 如果就一个，直接把 Column 删掉
        if (otherChildrenArr.length === 0) {
          actions.delete(parent);
        } else {
          const newPatches: Patch[] = [];
          const oldPatches: Patch[] = [];

          // 一层一层遍历下去删除，要把 Column 里包含的一个个删除
          if (nodeChildren.length) {
            const deleteNode = (childrenNodes: string[]) => {
              childrenNodes.forEach((item) => {
                newPatches.push({
                  op: "remove",
                  path: ["nodes", item],
                });
                oldPatches.push({
                  op: "add",
                  path: ["nodes", item],
                  value: nodes[item],
                });
                const childNodes = query.node(item).childNodes();
                if (childNodes.length) {
                  deleteNode(childNodes);
                }
              });
            };
            deleteNode(nodeChildren);
          }

          // 其余的 Column 设置宽度
          otherChildrenArr.forEach((item) => {
            const { columnWidth } = query.node(item).get().data.props;
            const newWidth = `${
              parseFloat(columnWidth) +
              parseFloat(nodeProps?.columnWidth) / otherChildrenArr.length
            }%`;

            newPatches.push({
              op: "replace",
              path: ["nodes", item, "data", "props", "columnWidth"],
              value: newWidth,
            });
            oldPatches.push({
              op: "replace",
              path: ["nodes", item, "data", "props", "columnWidth"],
              value: columnWidth,
            });

            actions.history.ignore().setProp(item, (prop) => {
              prop.columnWidth = newWidth;
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
    [
      actions,
      id,
      name,
      nodeChildren,
      nodeProps?.columnWidth,
      nodes,
      parent,
      query,
      store.history,
    ]
  );

  const handleAdd = useCallback(() => {
    const data = JSON.parse(localStorage.getItem("template"));
    const newNodes = JSON.parse(data.nodes);
    const nodePairs = Object.keys(newNodes).map((id) => {
      let nodeId = id;

      return [
        nodeId,
        query
          .parseSerializedNode(newNodes[id])
          .toNode((node) => (node.id = nodeId)),
      ];
    });
    const tree = { rootNodeId: data.rootNodeID, nodes: fromEntries(nodePairs) };
    const newTree = getCloneTree(tree);

    // 添加到你想要的地方
    actions.addNodeTree(newTree, ROOT_NODE, 0);
    actions.selectNode(newTree.rootNodeId);
  }, [actions, getCloneTree, query]);

  const handleSaveTemplate = useCallback(() => {
    const tree = query.node(id).toNodeTree();
    const nodePairs = Object.keys(tree.nodes).map((id) => [
      id,
      query.node(id).toSerializedNode(),
    ]);
    const serializedNodesJSON = JSON.stringify(fromEntries(nodePairs));
    const saveData = {
      rootNodeID: tree.rootNodeId,
      nodes: serializedNodesJSON,
    };
    localStorage.setItem("template", JSON.stringify(saveData));
  }, [id, query]);

  return (
    <>
      {(isHover || isActive) && !isScrolling && rect
        ? ReactDOM.createPortal(
            <CacheProvider value={memoizedCreateCacheWithScope("#root")}>
              {id !== ROOT_NODE && (
                <Flex
                  pos="absolute"
                  align="center"
                  h="30px"
                  mt="-29px"
                  borderRadius="md"
                  zIndex={999}
                  overflow="hidden"
                  color="#fff"
                  ref={currentRef}
                  left={getPos(dom).left}
                  top={getPos(dom).top}
                >
                  <Flex bg="blackAlpha.900" borderRadius="md" align="center">
                    <Text color="#fff" px={3} py={2}>
                      {displayName}
                    </Text>
                    {isActive && (
                      <>
                        {moveable && (
                          <Tooltip label="拖拽">
                            <IconButton
                              colorScheme="black"
                              ref={drag}
                              h="30px"
                              _hover={{ bg: "#464850" }}
                              aria-label="drag"
                              icon={<FaArrowsAlt />}
                            />
                          </Tooltip>
                        )}

                        {deletable && (
                          <Tooltip label="删除">
                            <IconButton
                              colorScheme="black"
                              aria-label="delete"
                              h="30px"
                              _hover={{ bg: "#464850" }}
                              onClick={handleDelete}
                              icon={<FaTrash />}
                            />
                          </Tooltip>
                        )}

                        <Tooltip label="拷贝">
                          <IconButton
                            colorScheme="black"
                            aria-label="copy"
                            h="30px"
                            _hover={{ bg: "#464850" }}
                            onClick={handleCopy}
                            icon={<FaCopy />}
                          />
                        </Tooltip>
                        {/* <Tooltip label="保存为模版">
                          <IconButton
                            colorScheme="black"
                            aria-label="save as template"
                            h="30px"
                            _hover={{ bg: "#464850" }}
                            onClick={handleSaveTemplate}
                            icon={<FaCloudDownloadAlt />}
                          />
                        </Tooltip> */}
                      </>
                    )}

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
                  </Flex>
                </Flex>
              )}

              {name !== "Column" && (
                <Box
                  pos="absolute"
                  zIndex="docked"
                  style={{
                    top: rect.top,
                    width: rect.width,
                    height: rect.height,
                    left: rect.left,
                  }}
                  pointerEvents="none"
                  sx={{
                    "&:after": {
                      pos: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      content: '""',
                      borderStyle: isActive ? "dashed" : "solid",
                      borderWidth: "2px",
                      borderColor: "blue.500",
                    },
                  }}
                ></Box>
              )}
            </CacheProvider>,
            document.querySelector(".page-container")
          )
        : null}
      {render}
    </>
  );
};
