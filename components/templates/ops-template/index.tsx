import { UserComponent, Element } from "@craftjs/core";
import React from "react";
import { Container } from "../../blocks/Container";
import { HeaderLogo } from "./components/HeaderLogo";
import { Products } from "./components/Products";
import { TopBanner } from "./components/TopBanner";

export const OpsTemplate: UserComponent = () => {
  return (
    <Element id="page" is={Container}>
      <Element id="topBanner" is={TopBanner} />
      <Element id="headerLogo" is={HeaderLogo} />
      <Element id="products" is={Products} />
    </Element>
  );
};

OpsTemplate.craft = {
  displayName: "模版",
  isCanvas: true,
};
