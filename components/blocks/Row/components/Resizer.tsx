import { useEditor, useNode } from "@craftjs/core";
import { Resizable, ResizableProps } from "re-resizable";
import React, { FC, useMemo, useRef } from "react";
import { useCallback } from "react";
import omit from "lodash/omit";
import styled from "styled-components";

const StyledResizable = styled(Resizable as any)`
  @media (max-width: 768px) {
    width: 100% !important;
    max-width: 100% !important;

    .column-resize-handle {
      display: none;
    }
  }
`;

const getElementWidth = (element: HTMLElement): number => {
  const computedStyle = getComputedStyle(element);

  let width = element.clientWidth;

  width -=
    parseFloat(computedStyle.paddingLeft) +
    parseFloat(computedStyle.paddingRight);

  return width;
};

export const Resizer: FC<ResizableProps> = ({ children }) => {
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
    if (nextId && dom && dom.parentElement) {
      // 本格和下一格所占的百分比
      const totalPercent =
        parseFloat(nodeProps.columnWidth) +
        parseFloat(query.node(nextId).get().data.props.columnWidth);
      // 本格和下一格所占的 px
      const result = (getElementWidth(dom.parentElement) * totalPercent) / 100;
      return result;
    }
    return null;
  }, [dom, nextId, nodeProps.columnWidth, query]);

  const startWidth = useRef(null);

  const handleResize = useCallback(() => {
    if (dom) {
      // 重新计算 totalWidth，否则用上面计算的 totalWidth 的话在这里刚 resize 的时候是上一次旧的
      const totalPercent =
        parseFloat(nodeProps.columnWidth) +
        parseFloat(query.node(nextId).get().data.props.columnWidth);
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
        props.columnWidth = currentWidth;
      });

      actions.history.ignore().setProp(nextId, (prop) => {
        prop.columnWidth = nextWidth;
      });
    }
  }, [actions.history, dom, id, nextId, nodeProps.columnWidth, query]);

  const handleResizeStart = useCallback(
    (
      e:
        | React.MouseEvent<HTMLElement, MouseEvent>
        | React.TouchEvent<HTMLElement>
    ) => {
      e.preventDefault();
      e.stopPropagation();
      startWidth.current = {
        currentWidth: nodeProps.columnWidth,
        nextWidth: query.node(nextId).get().data.props.columnWidth,
      };
    },
    [nextId, nodeProps.columnWidth, query]
  );

  const handleResizeStop = useCallback(() => {
    if (dom) {
      // 重新计算 totalWidth，否则用上面计算的 totalWidth 的话在这里刚 resize 的时候是上一次旧的
      const totalPercent =
        parseFloat(nodeProps.columnWidth) +
        parseFloat(query.node(nextId).get().data.props.columnWidth);
      // 本格和下一格所占的 px
      const result = (getElementWidth(dom.parentElement) * totalPercent) / 100;

      const currentWidth = `${
        (getElementWidth(dom) / getElementWidth(dom.parentElement)) * 100
      }%`;

      const nextWidth = `${
        ((result - getElementWidth(dom)) / getElementWidth(dom.parentElement)) *
        100
      }%`;

      const timelinePath = ["nodes", id, "data", "props", "columnWidth"];
      const nextTimelinePath = [
        "nodes",
        nextId,
        "data",
        "props",
        "columnWidth",
      ];

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
  }, [dom, id, nextId, nodeProps.columnWidth, query, store.history]);

  return (
    <StyledResizable
      ref={(ref) => {
        if (ref) {
          resizable.current = ref;
          connect(resizable.current.resizable);
        }
      }}
      enable={{ right: !!nextId && nodeProps.showHandle }}
      handleStyles={{
        right: { width: 5, right: -2.5, background: "#3182ce", zIndex: 10 },
      }}
      handleWrapperClass="column-resize-handle"
      maxWidth={totalWidth ? totalWidth - 20 : "none"}
      minWidth={1}
      size={{ width: nodeProps.columnWidth, height: "auto" }}
      onResize={handleResize}
      onResizeStart={handleResizeStart}
      onResizeStop={handleResizeStop}
    >
      <div style={omit(nodeProps, ["columnWidth", "showHandle"])}>
        {children}
      </div>
    </StyledResizable>
  );
};
