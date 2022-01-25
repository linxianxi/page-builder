import { NodeTree, Node } from "@craftjs/core";
import { useInternalEditorReturnType } from "@craftjs/core/lib/editor/useInternalEditor";
import { Delete, getRandomId } from "@craftjs/utils";

const getCloneTree = (
  tree: NodeTree,
  query: Delete<useInternalEditorReturnType["query"], "deserialize">
) => {
  const newNodes = {};
  const changeNodeId = (node: Node, newParentId?: string) => {
    const newNodeId = getRandomId();
    const childNodes = node.data.nodes.map((childId) =>
      changeNodeId(tree.nodes[childId], newNodeId)
    );
    const linkedNodes = Object.keys(node.data.linkedNodes).reduce((acc, id) => {
      const newLinkedNodeId = changeNodeId(
        tree.nodes[node.data.linkedNodes[id]],
        newNodeId
      );
      return {
        ...acc,
        [id]: newLinkedNodeId,
      };
    }, {});

    let tmpNode = {
      ...node,
      id: newNodeId,
      data: {
        ...node.data,
        parent: newParentId || node.data.parent,
        nodes: childNodes,
        linkedNodes,
      },
    };
    let freshNode = query.parseFreshNode(tmpNode).toNode();
    newNodes[newNodeId] = freshNode;
    return newNodeId;
  };

  const rootNodeId = changeNodeId(tree.nodes[tree.rootNodeId]);
  return {
    rootNodeId,
    nodes: newNodes,
  };
};

export default getCloneTree;
