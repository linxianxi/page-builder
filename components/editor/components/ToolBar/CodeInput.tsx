import { Button, Modal } from "antd";
import { useNode } from "@craftjs/core";
import React, { FC, useState } from "react";
import Editor from "@monaco-editor/react";

interface CodeInputProps {
  input: {
    name: string;
    prop: string;
  };
}

export const CodeInput: FC<CodeInputProps> = ({ input }) => {
  const {
    actions: { setProp },
    propValue,
  } = useNode((node) => ({
    propValue: node.data.props[input.prop],
  }));

  const [visible, setVisible] = useState(false);

  return (
    <>
      <>{input.name}</>

      <Button block onClick={() => setVisible(true)}>
        编辑代码
      </Button>

      <Modal
        title="编辑代码"
        visible={visible}
        onCancel={() => setVisible(false)}
      >
        <Editor
          options={{ minimap: { enabled: false } }}
          height="70vh"
          defaultLanguage="html"
          value={propValue}
          onChange={(value) => {
            setProp((props: any) => {
              props[input.prop] = value;
            }, 500);
          }}
        />
      </Modal>
    </>
  );
};
