import styled from "@emotion/styled";
import React, { FC } from "react";
import Image from "next/image";

const Title = styled.h1`
  border-bottom: 1px solid #d8d8d8;
  color: #222;
  font-family: Roboto;
  font-size: 26px;
  font-weight: 700;
  line-height: 26px;
  margin: 0;
  padding: 58px 0 30px;
  text-align: center;
`;

const PlugContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
`;

const Item = styled.div`
  cursor: pointer;
  margin-left: 12px;

  :first-child {
    margin-left: 0;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  height: 78px;
  width: 148px;
  object-fit: contain;
  background-color: #fff;
  border-radius: 30px;
`;

const Text = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Roboto;
  font-size: 16px;
  font-weight: 500;
  line-height: 16px;
  margin-top: 20px;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 70px;
  height: 78px;
`;

interface PlugProps {
  title: string;
  variants: any[];
}

export const Plug: FC<PlugProps> = ({ variants, title }) => {
  console.log(variants);
  return (
    <div>
      <Title>{title}</Title>
      <PlugContainer>
        {variants.map((item) => (
          <Item key={item.ID}>
            <ImageContainer>
              <div>123</div>
              <ImageWrapper>
                <Image
                  src={item.image}
                  alt=""
                  layout="fill"
                  objectFit="contain"
                />
              </ImageWrapper>
            </ImageContainer>
            <Text>{item.attrs[0].value}</Text>
          </Item>
        ))}
      </PlugContainer>
    </div>
  );
};
