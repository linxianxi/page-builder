import styled from "@emotion/styled";
import React, { FC } from "react";
import Image from "next/image";
import BannerImg from "../../../../../public/banner.png";
import { useNode, UserComponent } from "@craftjs/core";
import { ColorPickerInput, Input } from "@ahri-ui/core";
import { FormLabel } from "@chakra-ui/react";

const Title = styled.div<{ backgroundColor: string }>`
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: #fff;
  font-size: 20px;
  height: 44px;
  line-height: 44px;
  text-align: center;
`;

export const TopBanner: UserComponent = ({ title, backgroundColor }) => {
  const {
    connectors: { connect },
  } = useNode();

  return (
    <header ref={connect}>
      <Title backgroundColor={backgroundColor}>{title}</Title>
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
      <FormLabel>文字</FormLabel>
      <Input
        value={nodeProps.title}
        onChange={(e) =>
          setProp((props) => {
            props.title = e.target.value;
          }, 500)
        }
      />
      <FormLabel>背景颜色</FormLabel>
      <ColorPickerInput
        value={nodeProps.backgroundColor}
        onChange={(color) =>
          setProp((props) => {
            props.backgroundColor = color;
          })
        }
      />
    </>
  );
};

TopBanner.craft = {
  displayName: "顶部栏",
  props: {
    title: "Your 50% OFF Discount Has Been Applied!",
    backgroundColor: "#30bd51",
  },
  related: {
    inputPanel: () => <TopBannerSetting />,
  },
};
