import { ROOT_NODE, useEditor, useNode, UserComponent } from "@craftjs/core";
import React, { FC, useCallback } from "react";
import { Button } from "antd";
import { Patch } from "immer";
import { Column } from "./Column";
import styled from "styled-components";

// import { ColumnSettings } from "./ColumnSettings";

const Wrapper = styled.div`
  display: flex;
  width: 100%;

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

interface RowProps {
  padding?: [
    string | number,
    string | number,
    string | number,
    string | number
  ];
  margin?: [string | number, string | number, string | number, string | number];
}

export const Row: UserComponent<RowProps> = ({ children, padding, margin }) => {
  const {
    connectors: { connect },
  } = useNode();

  return (
    <Wrapper
      ref={connect}
      style={{
        padding: padding?.map((item) => `${item || "0"}px`).join(" "),
        margin: margin?.map((item) => `${item || "0"}px`).join(" "),
      }}
    >
      {children}
    </Wrapper>
  );
};

const RowSettings: FC = () => {
  const { actions, query, store, nodes } = useEditor((state) => ({
    nodes: state.nodes,
  }));

  const { children, id } = useNode((node) => ({
    children: node.data.nodes,
  }));

  const addColumn = useCallback(() => {
    const newWidth = `${100 / (children.length + 1)}%`;
    const newPatches: Patch[] = [];
    const oldPatches: Patch[] = [];

    // 遍历原来的 Column，平分宽度
    children.forEach((item) => {
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

    const node = query
      .parseFreshNode({
        data: {
          type: Column,
          isCanvas: true,
          props: {
            columnWidth: newWidth,
          },
        },
      })
      .toNode();
    actions.history.ignore().add(node, id);

    node.data.parent = id;

    store.history.add(
      [
        { op: "add", path: ["nodes", node.id], value: node },
        {
          op: "replace",
          path: ["nodes", id, "data", "nodes"],
          value: nodes[id].data.nodes.concat(node.id),
        },
        ...newPatches,
      ],
      [
        { op: "remove", path: ["nodes", node.id] },
        {
          op: "replace",
          path: ["nodes", id, "data", "nodes"],
          value: nodes[id].data.nodes,
        },
        ...oldPatches,
      ]
    );
  }, [actions.history, children, id, nodes, query, store.history]);

  return <Button onClick={addColumn}>+</Button>;
};

Row.craft = {
  displayName: "行",
  isCanvas: true,
  defaultProps: {
    padding: [10, 10, 10, 10],
    margin: [0, 0, 0, 0],
  },
  rules: {
    // 最多嵌套两个 Row
    canDrop: (targetNode, _, helpers) => {
      // 最外层，直接返回 true
      if (targetNode.id === ROOT_NODE) {
        return true;
      }

      // 查找所有祖先 name 为 Row 的
      const rowArr = helpers(targetNode.id)
        .ancestors(true)
        .filter((nodeId) => helpers(nodeId).get().data.name === "Row");

      return rowArr.length < 2;
    },
    // 不能将东西拖动到 Row 里
    canMoveIn: (incomingNode, currentNode) => {
      // Column 的 parent 等于当前 Row，Column 可以在当前 Row 拖动
      if (incomingNode[0].data.parent === currentNode.id) {
        return true;
      }
      return false;
    },
  },
  related: {
    inputPanel: RowSettings,
  },
};
