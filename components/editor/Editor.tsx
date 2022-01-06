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

export const Editor: FC = ({ children }) => (
  <CraftEditor
    resolver={{
      Box: UserBox,
      Code,
      Container,
      Image,
      Column,
      Row,
      Button,
    }}
    onRender={RenderBlock}
  >
    <EditorContent>{children}</EditorContent>
  </CraftEditor>
);
