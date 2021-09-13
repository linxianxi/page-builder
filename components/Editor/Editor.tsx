import React, { FC } from "react";
import { Editor as CraftEditor } from "@craftjs/core";

import { RenderBlock } from "./components/RenderBlock";
import { EditorContent } from "./EditorContent";

import { Code } from "../blocks/Code";
import { Container } from "../blocks/Container";
import { Image } from "../blocks/Image";
import { Box } from "../blocks/Box";
import { Column, Cell } from "../blocks/Column";
import { Button } from "../blocks/Button";

export const Editor: FC = ({ children }) => {
  return (
    <CraftEditor
      resolver={{
        Box,
        Code,
        Container,
        Image,
        Column,
        Cell,
        Button,
      }}
      onRender={RenderBlock}
    >
      <EditorContent>{children}</EditorContent>
    </CraftEditor>
  );
};
