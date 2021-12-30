import React, { FC } from "react";
import { Editor as CraftEditor, Element } from "@craftjs/core";
import { Code } from "../blocks/Code";
import { Container } from "../blocks/Container";
import { Image } from "../blocks/Image";
import { Box as UserBox } from "../blocks/Box";
import { Column, Row } from "../blocks/Row";
import { Button } from "../blocks/Button";
import { RenderBlock } from "./components/RenderBlock";
import { EditorContent } from "./EditorContent";
import { OpsTemplate } from "../templates/ops-template";
import { TopBanner } from "../templates/ops-template/components/TopBanner";
import { HeaderLogo } from "../templates/ops-template/components/HeaderLogo";
import { Products } from "../templates/ops-template/components/Products";

export const Editor: FC = () => (
  <CraftEditor
    resolver={{
      Box: UserBox,
      Code,
      Container,
      Image,
      Column,
      Row,
      Button,
      OpsTemplate,
      TopBanner,
      HeaderLogo,
      Products,
    }}
    onRender={RenderBlock}
  >
    <EditorContent>{/* <OpsTemplate /> */}</EditorContent>
  </CraftEditor>
);
