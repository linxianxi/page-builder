import { useEditor, useNode, UserComponent } from "@craftjs/core";
import React, { FC, useCallback } from "react";
import { Button } from "@chakra-ui/react";
import { Patch } from "immer";
import { Column } from "./Column";
import styled from "@emotion/styled";

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
    connectors: { connect, drag },
  } = useNode();

  return (
    <Wrapper
      ref={(ref: HTMLDivElement) => connect(drag(ref))}
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
      const { width } = query.node(item).get().data.props;

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

      actions.history.ignore().setProp(item, (props) => {
        props.width = newWidth;
      });
    });

    const node = query
      .parseFreshNode({
        data: {
          type: Column,
          isCanvas: true,
          props: {
            width: newWidth,
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
    canDrop: (targetNode, currentNode) => {
      if (
        targetNode.data.name === currentNode.data.name ||
        targetNode.data.name === "Column"
      ) {
        return false;
      }
      return true;
    },
  },
  related: {
    inputPanel: RowSettings,
  },
};
