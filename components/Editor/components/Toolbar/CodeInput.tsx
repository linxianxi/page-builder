import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useNode } from "@craftjs/core";
import React, { FC } from "react";
import Editor from "@monaco-editor/react";

export interface CodeInputProps {
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

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <FormControl key={input.name}>
      <FormLabel>{input.name}</FormLabel>

      <Button isFullWidth onClick={onOpen}>
        编辑代码
      </Button>

      <Modal size="6xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>编辑代码</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
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
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </FormControl>
  );
};
