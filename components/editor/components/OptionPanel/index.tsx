import { useEditor } from "@craftjs/core";
import React, { FC } from "react";

const OptionPanel: FC = () => {
  const { active, related } = useEditor((state, query) => {
    const currentlySelectedNodeId = query.getEvent("selected").first();
    return {
      active: currentlySelectedNodeId,
      related:
        currentlySelectedNodeId && state.nodes[currentlySelectedNodeId].related,
    };
  });

  return (
    <div>
      {active && related.inputPanel && React.createElement(related.inputPanel)}
      {!active && (
        <div className="flex justify-center text-gray-500">
          请选择一个元素来编辑它的选项
        </div>
      )}
    </div>
  );
};

export default OptionPanel;
