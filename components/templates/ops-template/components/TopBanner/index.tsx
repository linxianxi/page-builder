import styled from "@emotion/styled";
import React, { FC } from "react";
import Image from "next/image";
import BannerImg from "../../../../../public/banner.png";
import { useNode, UserComponent } from "@craftjs/core";
import { Input } from "@ahri-ui/core";
import { Text } from "@chakra-ui/react";

const Title = styled.div`
  background-color: #30bd51;
  color: #fff;
  font-size: 20px;
  height: 44px;
  line-height: 44px;
  text-align: center;
`;

export const TopBanner: UserComponent = ({ title }) => {
  const {
    connectors: { connect },
  } = useNode();

  return (
    <header ref={connect}>
      <Title>{title}</Title>
      <Image src={BannerImg} alt="" />
    </header>
  );
};

const TopBannerSetting: FC = () => {
  const {
    actions: { setProp },
    nodeProps,
  } = useNode((node) => ({
    nodeProps: node.data.props,
  }));

  return (
    <>
      <Text>文字</Text>
      <Input
        value={nodeProps.title}
        onChange={(e) =>
          setProp((props) => {
            props.title = e.target.value;
          })
        }
      />
    </>
  );
};

TopBanner.craft = {
  displayName: "顶部栏",
  defaultProps: {
    title: "Your 50% OFF Discount Has Been Applied!",
  },
  related: {
    inputPanel: () => <TopBannerSetting />,
  },
};
