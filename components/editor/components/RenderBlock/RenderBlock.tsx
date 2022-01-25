import { useNode, useEditor, ROOT_NODE } from "@craftjs/core";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Patch } from "immer";
import { useCallback } from "react";
import { useIsScrolling } from "../../hooks/useIsScrolling";
import { usePreviewMode } from "../../hooks/usePreviewMode";
import { useRect } from "@reach/rect";
import { Modal, Tooltip, Form, Input } from "antd";
import getCloneTree from "../../utils/getCloneTree";
import {
  CopyOutlined,
  DeleteOutlined,
  DragOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useTemplates } from "../../hooks/useTemplates";
import { useLocalStorage } from "react-use";
import fromEntries from "../../utils/fromEntries";

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

  const [form] = Form.useForm();
  const [templateModalVisible, setTemplateModalVisible] = useState(false);
  const currentRef = useRef<HTMLDivElement>();

  const ref = useRef(dom);
  const rect = useRect(ref, { observe: !!ref.current });

  const [previewMode] = usePreviewMode();
  const [isScrolling] = useIsScrolling();
  const [templates, setTemplates] = useTemplates();
  const [localTemplates, setLocalTemplates] = useLocalStorage("templates", {});

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

  const handleCopy = useCallback(() => {
    const tree = query.node(id).toNodeTree();
    const { rootNodeId, nodes: newNodes } = getCloneTree(tree, query);

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
  }, [actions, id, name, query, store.history]);

  const handleDelete = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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
    const data = JSON.parse(localStorage.getItem("templates"));
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
    const tree = { rootNodeId: data.rootNodeId, nodes: fromEntries(nodePairs) };
    const newTree = getCloneTree(tree, query);

    // 添加到你想要的地方
    actions.addNodeTree(newTree, ROOT_NODE, 0);
    actions.selectNode(newTree.rootNodeId);
  }, [actions, query]);

  const handleSaveTemplate = useCallback(
    (values) => {
      setTemplateModalVisible(false);
      const tree = query.node(id).toNodeTree();
      const nodePairs = Object.keys(tree.nodes).map((id) => [
        id,
        query.node(id).toSerializedNode(),
      ]);
      const serializedNodesJSON = JSON.stringify(fromEntries(nodePairs));
      const saveData = {
        rootNodeId: tree.rootNodeId,
        nodes: serializedNodesJSON,
      };
      setTemplates((prev) => ({ ...prev, [values.name]: saveData }));
      setLocalTemplates({ ...localTemplates, [values.name]: saveData });
    },
    [id, localTemplates, query, setLocalTemplates, setTemplates]
  );

  return (
    <>
      {(isHover || isActive) && !isScrolling && rect
        ? ReactDOM.createPortal(
            <>
              {id !== ROOT_NODE && (
                <div
                  className="flex absolute overflow-hidden items-center rounded text-white"
                  style={{
                    zIndex: 999,
                    left: getPos(dom).left,
                    top: getPos(dom).top,
                    height: 28,
                    marginTop: -27,
                  }}
                  ref={currentRef}
                >
                  <div className="flex bg-gray-800 rounded items-center overflow-hidden">
                    <span className="px-3">{displayName}</span>
                    {isActive && (
                      <>
                        {moveable && (
                          <Tooltip title="拖拽">
                            <div
                              ref={drag}
                              draggable
                              className="hover:bg-gray-700 cursor-pointer h-7 w-7 flex justify-center items-center"
                            >
                              <DragOutlined />
                            </div>
                          </Tooltip>
                        )}

                        {deletable && (
                          <Tooltip title="删除">
                            <div
                              onClick={handleDelete}
                              className="hover:bg-gray-700 cursor-pointer h-7 w-7 flex justify-center items-center"
                            >
                              <DeleteOutlined />
                            </div>
                          </Tooltip>
                        )}

                        <Tooltip title="拷贝">
                          <div
                            onClick={handleCopy}
                            className="hover:bg-gray-700 cursor-pointer h-7 w-7 flex justify-center items-center"
                          >
                            <CopyOutlined />
                          </div>
                        </Tooltip>
                        <Tooltip title="保存为模版">
                          <div
                            className="hover:bg-gray-700 cursor-pointer h-7 w-7 flex justify-center items-center"
                            onClick={() => {
                              setTemplateModalVisible(true);
                              form.resetFields();
                            }}
                          >
                            <SaveOutlined />
                          </div>
                        </Tooltip>
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
                  </div>
                </div>
              )}

              {name !== "Column" && (
                <div
                  className={`absolute z-10 pointer-events-none after:content-'' after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:border-2 after:border-blue-400 ${
                    isActive ? "after:border-dashed" : "after:border-solid"
                  }`}
                  style={{
                    top: rect.top,
                    width: rect.width,
                    height: rect.height,
                    left: rect.left,
                  }}
                />
              )}

              <Modal
                title="保存为模版"
                visible={templateModalVisible}
                onCancel={() => setTemplateModalVisible(false)}
                onOk={form.submit}
              >
                <Form
                  form={form}
                  onFinish={handleSaveTemplate}
                  layout="vertical"
                >
                  <Form.Item
                    style={{ marginBottom: 0 }}
                    name="name"
                    label="模块名称"
                    rules={[
                      { required: true, message: "请输入模版名称" },
                      {
                        validator: (_, value) => {
                          if (Object.keys(templates).includes(value)) {
                            return Promise.reject(
                              new Error("此模版名称已存在！")
                            );
                          } else {
                            return Promise.resolve();
                          }
                        },
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Form>
              </Modal>
            </>,
            document.querySelector(".page-container")
          )
        : null}
      {render}
    </>
  );
};
