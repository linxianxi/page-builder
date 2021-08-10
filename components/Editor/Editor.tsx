import React, { FC } from "react";
import { Editor as CraftEditor } from "@craftjs/core";

import { RenderBlock } from "./components/RenderBlock";
import { EditorContent } from "./EditorContent";

import { Grid } from "../blocks/Grid";
import { Code } from "../blocks/Code";
import { Container } from "../blocks/Container";
import { Image } from "../blocks/Image";
import { Box } from "../blocks/Box";

export const Editor: FC = ({ children }) => {
  return (
    <CraftEditor
      resolver={{
        Box,
        Code,
        Container,
        Grid,
        Image,
      }}
      onRender={RenderBlock}
    >
      <EditorContent>{children}</EditorContent>
    </CraftEditor>
  );
};
