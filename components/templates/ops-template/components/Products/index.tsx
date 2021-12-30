import { Input } from "@ahri-ui/core";
import { FormLabel } from "@chakra-ui/react";
import { useNode, UserComponent, Element } from "@craftjs/core";
import styled from "@emotion/styled";
import React, { FC } from "react";
import { useProducts } from "../../../../../hooks";
import { Plug } from "../Plug";

const Wrapper = styled.div`
  background-color: #f2f2f2;
  padding-top: 32px;
  position: relative;
`;

export const Products: UserComponent = () => {
  const {
    connectors: { connect },
    nodeProps,
  } = useNode((node) => ({ nodeProps: node.data.props }));

  const { data } = useProducts();

  return (
    <Wrapper ref={connect}>
      <Plug variants={data?.variants || []} title={nodeProps.title} />
    </Wrapper>
  );
};

const ProductsSetting: FC = () => {
  const {
    actions: { setProp },
    nodeProps,
  } = useNode((node) => ({
    nodeProps: node.data.props,
  }));

  return (
    <>
      <FormLabel>文字</FormLabel>
      <Input
        value={nodeProps.title}
        onChange={(e) =>
          setProp((props) => {
            props.title = e.target.value;
          }, 500)
        }
      />
    </>
  );
};

Products.craft = {
  displayName: "商品",
  props: {
    title: "PLEASE SELECT THE TYPE OF PLUG YOU NEED",
  },
  related: {
    inputPanel: () => <ProductsSetting />,
  },
};
