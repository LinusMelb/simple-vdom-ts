import { PatchState, VDomPatchState } from "./diff";
import { VElement } from "./element";

const dfsWalk = (
  node: Element | Node,
  index: number,
  domPatches: VDomPatchState
) => {
  let curIndex = index;
  node.childNodes.forEach((childNode) => {
    curIndex += 1;
    dfsWalk(childNode, curIndex, domPatches);
    curIndex += childNode.childNodes.length;
  });

  if (domPatches[index] && domPatches[index].length > 0) {
    applyPatches(node, domPatches[index]);
  }
};

const patch = (dom: Node, domPatches: VDomPatchState) => {
  let index = 0;
  dfsWalk(dom, index, domPatches);
};

const applyPatches = (node: Node | HTMLElement, patches: PatchState[]) => {
  patches.forEach((patchOp) => {
    const newNode =
      patchOp.context instanceof VElement
        ? patchOp.context.render()
        : document.createTextNode(patchOp.context);

    if (patchOp.action === "updateText") {
      node.textContent = patchOp.context.toString();
    } else if (patchOp.action === "replace") {
      node.parentNode.replaceChild(newNode, node);
    } else if (patchOp.action === "add") {
      node.parentNode.appendChild(newNode);
    } else if (patchOp.action === "remove") {
      node.childNodes[patchOp.index] && node.childNodes[patchOp.index].remove();
    } else if (patchOp.action === "updateProps") {
      const addProps = patchOp.propPatches.add;
      const removeProps = patchOp.propPatches.remove;
      removeProps.forEach((prop) => {
        node instanceof HTMLElement && node.removeAttribute(prop);
      });
      addProps.forEach((prop) => {
        if (prop[0] && prop[1]) {
          node instanceof HTMLElement && node.setAttribute(prop[0], prop[1]);
        }
      });
    }
  });
};

export { patch };
