import { useNode, UserComponent } from "@craftjs/core";
import styled from "@emotion/styled";
import React, { FC } from "react";
import logo1 from "../../../../../public/headerLogo/logo1.png";
import logo2 from "../../../../../public/headerLogo/logo2.png";
import logo3 from "../../../../../public/headerLogo/logo3.png";
import logo4 from "../../../../../public/headerLogo/logo4.png";
import logo5 from "../../../../../public/headerLogo/logo5.png";
import logo6 from "../../../../../public/headerLogo/logo6.png";
import Image from "next/image";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  background-color: #f2f2f2;
  padding-top: 56px;
`;

const HeaderLogoContainer = styled.div`
  border: 1px solid #8c8c8c;
  border-radius: 6px;
  display: flex;
  height: 88px;
  position: relative;
  width: 620px;
`;

const Content = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
`;

const Title = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  background-color: #f2f2f2;
  left: 50%;
  padding: 0 8px;
  text-align: center;
  top: 0;
  transform: translate(-50%, -50%);

  svg {
    margin-right: 8px;
  }

  span {
    color: #222;
    font-size: 20px;
  }
`;

const Separate = styled.div`
  background-color: #b1b1b1;
  height: 50px;
  width: 1px;
`;

export const HeaderLogo: UserComponent = ({}) => {
  const {
    connectors: { connect },
  } = useNode();

  return (
    <Wrapper ref={connect} onClick={() => console.log("111")}>
      <HeaderLogoContainer>
        <Content>
          <Image src={logo1} alt="" width={84} height={34} />
          <Image src={logo2} alt="" width={78} height={34} />
          <Separate />
          <Image src={logo3} alt="" width={94} height={34} />
          <Image src={logo4} alt="" width={30} height={42} />
          <Image src={logo5} alt="" width={70} height={26} />
          <Image src={logo6} alt="" width={46} height={48} />
        </Content>
        <Title>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 166.74 197.99"
            width="18"
            height="22"
          >
            <g>
              <g>
                <path d="M162.81,27.87A13,13,0,0,0,154,24.49h-.93c-.2,0-2.25.2-5.43.2A112.82,112.82,0,0,1,122,21.88c-12.73-3-27.52-17-31.83-19.83a13.69,13.69,0,0,0-7.11-2A14.16,14.16,0,0,0,76,2.05c-.55.37-15.9,16.27-30.88,19.83a116.42,116.42,0,0,1-25.82,2.81c-3.38,0-5.43-.2-5.61-.2h-.74a12.55,12.55,0,0,0-8.79,3.38,12,12,0,0,0-4.12,9V67.91C0,182.44,77.66,197.23,80.84,197.79a12.7,12.7,0,0,0,4.49,0c3.36-.56,81.41-15.35,81.41-129.88v-31A12.52,12.52,0,0,0,162.81,27.87ZM83.37,158.33A59.34,59.34,0,1,1,142.7,99,59.33,59.33,0,0,1,83.37,158.33Z"></path>
                <path d="M83.37,49.55A49.45,49.45,0,1,0,132.81,99,49.45,49.45,0,0,0,83.37,49.55Zm25.75,38.11L79.45,117.32a4.94,4.94,0,0,1-7,0L57.62,102.49a4.95,4.95,0,0,1,7-7L76,106.84l26.17-26.18a4.95,4.95,0,0,1,7,7Z"></path>
              </g>
            </g>
          </svg>
          <span>Secure Checkout</span>
        </Title>
      </HeaderLogoContainer>
    </Wrapper>
  );
};

const HeaderLogoSetting: FC = () => {
  return <div>设置</div>;
};

HeaderLogo.craft = {
  displayName: "顶部图标",
  related: {
    inputPanel: () => <HeaderLogoSetting />,
  },
};
