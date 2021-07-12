import React from "react";
import { Element } from "@craftjs/core";
import { Container } from "../components/blocks/Container";
import { Editor } from "../components/Editor";

export default function App() {
  return (
    <Editor>
      <Element canvas is={Container} custom={{ displayName: "Page" }}></Element>
    </Editor>
  );
}
