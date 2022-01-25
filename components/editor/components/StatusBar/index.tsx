import { FC } from "react";
import { useEditor } from "@craftjs/core";
import React from "react";
import { Breadcrumb } from "antd";

const StatusBar: FC = () => {
  const { actions, selectedAncestorNodes } = useEditor((_, query) => {
    const currentlySelectedNodeId = query.getEvent("selected").first();

    return {
      selected: currentlySelectedNodeId,
      selectedAncestorNodes: currentlySelectedNodeId
        ? [
            query.node(currentlySelectedNodeId).get(),
            ...query
              .node(currentlySelectedNodeId)
              .ancestors(true)
              .map((id) => query.node(id).get()),
          ].reverse()
        : [],
    };
  });

  return (
    <div className="flex items-center justify-between px-4 h-8 border-b border-gray-300">
      {selectedAncestorNodes.length > 0 ? (
        <Breadcrumb>
          {selectedAncestorNodes.map((node, index) => {
            const displayName =
              node.data.custom.displayName || node.data.displayName;

            return (
              <Breadcrumb.Item
                key={node.id}
                onClick={() => {
                  if (index + 1 < selectedAncestorNodes.length) {
                    actions.selectNode(node.id);
                  }
                }}
              >
                {index + 1 < selectedAncestorNodes.length ? (
                  <a>{displayName}</a>
                ) : (
                  displayName
                )}
              </Breadcrumb.Item>
            );
          })}
        </Breadcrumb>
      ) : (
        <span className="text-gray-500">没有选中的模块</span>
      )}
    </div>
  );
};

export default StatusBar;
