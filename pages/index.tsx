import React from "react";
import { Element } from "@craftjs/core";
import { Container } from "../components/blocks/Container";
import { Editor } from "../components/editor";

export default function App() {
  return (
    <Editor>
      <Element<any> canvas is={Container} custom={{ displayName: "页面" }} />
    </Editor>
  );
}
