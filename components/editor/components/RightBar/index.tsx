import React, { FC } from "react";

import { Tabs } from "antd";
import { useEditor } from "@craftjs/core";
import OptionPanel from "../OptionPanel";
import { Layers } from "@craftjs/layers";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 280px;

  h2 {
    margin: 0;
  }
`;

const RightBar: FC = () => {
  const { active, related } = useEditor((state, query) => {
    const currentlySelectedNodeId = query.getEvent("selected").first();
    return {
      active: currentlySelectedNodeId,
      related:
        currentlySelectedNodeId && state.nodes[currentlySelectedNodeId].related,
    };
  });

  return (
    <Wrapper>
      <Tabs defaultActiveKey="1" tabBarStyle={{ padding: "0 20px", margin: 0 }}>
        <Tabs.TabPane tab="选项" key="1" style={{ padding: 20 }}>
          <OptionPanel />
        </Tabs.TabPane>
        <Tabs.TabPane tab="样式" key="2">
          {active &&
            related.stylePanel &&
            React.createElement(related.stylePanel)}
          {!active && (
            <div className="flex justify-center text-gray-500 p-5">
              请选择一个元素来编辑它的样式
            </div>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="图层" key="3" style={{ padding: 20 }}>
          <Layers expandRootOnLoad />
        </Tabs.TabPane>
      </Tabs>
    </Wrapper>
  );
};

export default RightBar;
