import { useEditor, useNode, UserComponent } from "@craftjs/core";
import React, { FC, useCallback } from "react";
import { Button, Flex } from "@chakra-ui/react";
import { Patch } from "immer";
import { Cell } from "./Cell";

// import { ColumnSettings } from "./ColumnSettings";

interface ColumnProps {
  padding?: [
    string | number,
    string | number,
    string | number,
    string | number
  ];
  margin?: [string | number, string | number, string | number, string | number];
}

export const Column: UserComponent<ColumnProps> = ({
  children,
  padding,
  margin,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <Flex
      w="100%"
      sx={{
        "@media(max-width: 768px)": {
          flexWrap: "wrap",
        },
      }}
      ref={(ref: HTMLDivElement) => connect(drag(ref))}
      style={{
        padding: padding?.map((item) => `${item || "0"}px`).join(" "),
        margin: margin?.map((item) => `${item || "0"}px`).join(" "),
      }}
    >
      {children}
    </Flex>
  );
};

const ColumnSettings: FC = () => {
  const { actions, query, store, nodes } = useEditor((state) => ({
    nodes: state.nodes,
  }));

  const { children, id } = useNode((node) => ({
    children: node.data.nodes,
  }));

  const addCell = useCallback(() => {
    const newPatches: Patch[] = [];
    const oldPatches: Patch[] = [];

    const percent = children.length / (children.length + 1);
    // 遍历原来的 Cell，设置宽度
    children.forEach((item) => {
      const { width } = query.node(item).get().data.props;
      const newWidth = `${parseFloat(width) * percent}%`;

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
          type: Cell,
          isCanvas: true,
          props: {
            width: `${100 / (children.length + 1)}%`,
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

  return <Button onClick={addCell}>+</Button>;
};

Column.craft = {
  displayName: "网格",
  isCanvas: true,
  defaultProps: {
    padding: [10, 10, 10, 10],
    margin: [0, 0, 0, 0],
  },
  rules: {
    canDrop: (targetNode, currentNode) => {
      if (
        targetNode.data.name === currentNode.data.name ||
        targetNode.data.name === "Cell"
      ) {
        return false;
      }
      return true;
    },
  },
  related: {
    inputPanel: ColumnSettings,
  },
};
