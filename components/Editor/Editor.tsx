import React, { FC } from "react";
import { Editor as CraftEditor } from "@craftjs/core";

import { RenderBlock } from "./components/RenderBlock";

import { Grid as UserGrid } from "../blocks/Grid";
import { Container as UserContainer } from "../blocks/Container";
import { Image as UserImage } from "../blocks/Image";
import { EditorContent } from "./EditorContent";

export const Editor: FC = ({ children }) => {
  return (
    <CraftEditor
      resolver={{
        UserContainer,
        UserGrid,
        UserImage,
      }}
      onRender={RenderBlock}
    >
      <EditorContent>{children}</EditorContent>
    </CraftEditor>
  );
};
