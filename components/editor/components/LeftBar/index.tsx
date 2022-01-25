import { FC, useState } from "react";
import { Element, useEditor } from "@craftjs/core";
import React from "react";
import { Image as UserImage } from "../../../blocks/Image";
import { Box as UserBox } from "../../../blocks/Box";
import { Code as UserCode } from "../../../blocks/Code";
import { Column, Row } from "../../../blocks/Row";
import { Button as UserButton } from "../../../blocks/Button";
import {
  CodeOutlined,
  FileImageOutlined,
  InboxOutlined,
  PlusCircleOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { Button, Space } from "antd";
import { useTemplates } from "../../hooks/useTemplates";
import getCloneTree from "../../utils/getCloneTree";
import fromEntries from "../../utils/fromEntries";
import { useEffect } from "react";

const elements = [
  {
    component: UserButton,
    icon: <PlusCircleOutlined />,
  },
  {
    component: UserBox,
    icon: <InboxOutlined />,
  },
  {
    component: UserCode,
    icon: <CodeOutlined />,
  },
  {
    component: UserImage,
    icon: <FileImageOutlined />,
  },
  {
    component: Row,
    icon: <TableOutlined />,
  },
];

const LeftBar: FC = () => {
  const {
    connectors: { create },
    query,
  } = useEditor();

  const [templates] = useTemplates();

  const [states, setStates] = useState({});

  useEffect(() => {
    setStates(templates);
  }, [templates]);

  return (
    <Space
      direction="vertical"
      size={12}
      style={{ width: 200 }}
      className="p-3"
    >
      {elements.map((element, index) => {
        return (
          <Button
            key={index}
            block
            size="large"
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "move",
            }}
            ref={(ref) => {
              if (element.component === Row) {
                return create(
                  ref,
                  <Element
                    canvas={element.component.craft.isCanvas}
                    is={element.component}
                  >
                    <Element canvas is={Column} />
                    <Element canvas is={Column} />
                  </Element>
                );
              }
              return create(
                ref,
                <Element
                  canvas={element.component.craft.isCanvas}
                  is={element.component}
                />
              );
            }}
          >
            {element.icon}
            <span className="ml-2">{element.component.craft.displayName}</span>
          </Button>
        );
      })}
      {Object.keys(states).length > 0 && (
        <>
          <div>模版</div>
          {Object.keys(states).map((key) => (
            <Button
              key={key}
              block
              size="large"
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "move",
              }}
              ref={(ref) => {
                return create(ref, () => {
                  const newNodes = JSON.parse(templates[key].nodes);
                  const nodePairs = Object.keys(newNodes).map((id) => {
                    let nodeId = id;

                    return [
                      nodeId,
                      query
                        .parseSerializedNode(newNodes[id])
                        .toNode((node) => (node.id = nodeId)),
                    ];
                  });
                  const tree = {
                    rootNodeId: templates[key].rootNodeId,
                    nodes: fromEntries(nodePairs),
                  };
                  const newTree = getCloneTree(tree, query);

                  return newTree;
                });
              }}
            >
              {key}
            </Button>
          ))}
        </>
      )}
    </Space>
  );
};

export default LeftBar;
