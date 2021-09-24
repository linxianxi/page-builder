import { UserComponent, useNode } from "@craftjs/core";
import React from "react";
import styled from "@emotion/styled";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  border: 1px solid #ccc;
`;

export const Container: UserComponent = ({ children }) => {
  const {
    connectors: { connect },
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  return <div ref={connect}>{children || <Wrapper>+ Add Block</Wrapper>}</div>;
};

Container.craft = {
  displayName: "页面",
  isCanvas: true,
  rules: {
    canDrag: () => false,
  },
};
