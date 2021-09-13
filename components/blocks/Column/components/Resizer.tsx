import { useEditor, useNode } from "@craftjs/core";
import { Resizable, ResizableProps } from "re-resizable";
import React, { FC, useMemo, useRef } from "react";
import useMedia from "react-use/lib/useMedia";
import { Box } from "@chakra-ui/react";
import { useCallback } from "react";
import omit from "lodash/omit";

const getElementWidth = (element: HTMLElement): number => {
  const computedStyle = getComputedStyle(element);

  let width = element.clientWidth;

  width -=
    parseFloat(computedStyle.paddingLeft) +
    parseFloat(computedStyle.paddingRight);

  return width;
};

export const Resizer: FC<ResizableProps> = ({ children, ...rest }) => {
  const { actions, query, store } = useEditor();

  const {
    parentId,
    id,
    connectors: { connect },
    dom,
    nodeProps,
  } = useNode((node) => ({
    dom: node.dom,
    parentId: node.data.parent,
    nodeProps: node.data.props,
  }));

  const isWide = useMedia("(max-width: 768px)");

  // 当前这个格子是列里的第几个
  const index = useMemo(
    () =>
      query
        .node(parentId)
        .descendants()
        .findIndex((item) => item === id),
    [id, parentId, query]
  );

  // 下一个格子的 id
  const nextId = useMemo(() => {
    if (query.node(parentId).descendants().length === index + 1) {
      return null;
    }
    return query.node(parentId).descendants()[index + 1];
  }, [index, parentId, query]);

  const resizable = useRef<any>(null);

  // // 计算本格和下一格所占的 px， 这个 totalWidth 有延迟，不能用在 onResize 上(刚 resize 的 totalWidth 是上一次旧的)，用在 maxWidth 上没什么影响
  const totalWidth = useMemo(() => {
    if (nextId && dom?.parentElement) {
      // 本格和下一格所占的百分比
      const totalPercent =
        parseFloat(nodeProps.width) +
        parseFloat(query.node(nextId).get().data.props.width);
      // 本格和下一格所占的 px
      const result = (getElementWidth(dom.parentElement) * totalPercent) / 100;
      return result;
    }
    return null;
  }, [dom?.parentElement, nextId, nodeProps.width, query]);

  const startWidth = useRef(null);

  const handleResize = useCallback(() => {
    if (dom) {
      // 重新计算 totalWidth，否则用上面计算的 totalWidth 的话在这里刚 resize 的时候是上一次旧的
      const totalPercent =
        parseFloat(nodeProps.width) +
        parseFloat(query.node(nextId).get().data.props.width);
      // 本格和下一格所占的 px
      const result = (getElementWidth(dom.parentElement) * totalPercent) / 100;

      const currentWidth = `${
        (getElementWidth(dom) / getElementWidth(dom.parentElement)) * 100
      }%`;

      const nextWidth = `${
        ((result - getElementWidth(dom)) / getElementWidth(dom.parentElement)) *
        100
      }%`;

      actions.history.ignore().setProp(id, (props) => {
        props.width = currentWidth;
      });

      actions.history.ignore().setProp(nextId, (prop) => {
        prop.width = nextWidth;
      });
    }
  }, [actions.history, dom, id, nextId, nodeProps.width, query]);

  const handleResizeStart = useCallback(
    (
      e:
        | React.MouseEvent<HTMLElement, MouseEvent>
        | React.TouchEvent<HTMLElement>
    ) => {
      e.preventDefault();
      e.stopPropagation();
      startWidth.current = {
        currentWidth: nodeProps.width,
        nextWidth: query.node(nextId).get().data.props.width,
      };
    },
    [nextId, nodeProps.width, query]
  );

  const handleResizeStop = useCallback(() => {
    if (dom) {
      // 重新计算 totalWidth，否则用上面计算的 totalWidth 的话在这里刚 resize 的时候是上一次旧的
      const totalPercent =
        parseFloat(nodeProps.width) +
        parseFloat(query.node(nextId).get().data.props.width);
      // 本格和下一格所占的 px
      const result = (getElementWidth(dom.parentElement) * totalPercent) / 100;

      const currentWidth = `${
        (getElementWidth(dom) / getElementWidth(dom.parentElement)) * 100
      }%`;

      const nextWidth = `${
        ((result - getElementWidth(dom)) / getElementWidth(dom.parentElement)) *
        100
      }%`;

      const timelinePath = ["nodes", id, "data", "props", "width"];
      const nextTimelinePath = ["nodes", nextId, "data", "props", "width"];

      store.history.add(
        [
          {
            op: "replace",
            path: timelinePath,
            value: currentWidth,
          },
          {
            op: "replace",
            path: nextTimelinePath,
            value: nextWidth,
          },
        ],
        [
          {
            op: "replace",
            path: timelinePath,
            value: startWidth.current.currentWidth,
          },
          {
            op: "replace",
            path: nextTimelinePath,
            value: startWidth.current.nextWidth,
          },
        ]
      );
    }
  }, [dom, id, nextId, nodeProps.width, query, store.history]);

  return (
    <Resizable
      ref={(ref) => {
        if (ref) {
          resizable.current = ref;
          connect(resizable.current.resizable);
        }
      }}
      enable={{ right: isWide ? false : !!nextId && nodeProps.showHandle }}
      handleComponent={
        nodeProps.showHandle
          ? {
              right: (
                <Box
                  pos="absolute"
                  top="50%"
                  zIndex={2}
                  width="10px"
                  height="10px"
                  mt="-5px"
                  bg="#fff"
                  borderWidth="2px"
                  borderColor="blue.500"
                />
              ),
            }
          : {}
      }
      maxWidth={isWide ? "100%" : totalWidth ? totalWidth - 20 : "none"}
      minWidth={1}
      size={{ width: isWide ? "100%" : nodeProps.width, height: "auto" }}
      onResize={handleResize}
      onResizeStart={handleResizeStart}
      onResizeStop={handleResizeStop}
      style={omit(nodeProps, ["width", "showHandle"])}
    >
      {children}
    </Resizable>
  );
};
