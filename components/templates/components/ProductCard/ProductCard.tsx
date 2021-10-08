import { useNode, UserComponent } from "@craftjs/core";
import React from "react";
import { ProductsModal } from "./components/ProductsModal";
import { useProduct } from "../../../../hooks";

export const ProductCard: UserComponent = (props) => {
  const {
    connectors: { connect },
    nodeProps,
  } = useNode((node) => ({
    nodeProps: node.data.props,
  }));

  const { data, isFetching } = useProduct(
    {
      id: nodeProps.productId,
    },
    { enabled: !!nodeProps.productId }
  );

  //   console.log(node.data.props);

  return (
    <div ref={connect}>
      <img
        //   layout="fill"
        //   objectFit="contain"
        alt=""
        width={200}
        height={200}
        // src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        src={data?.image}
      />
      <p>{data?.title}</p>
    </div>
  );
};

ProductCard.craft = {
  displayName: "产品卡片",
  related: {
    inputPanel: () => {
      return <ProductsModal />;
    },
  },
};
