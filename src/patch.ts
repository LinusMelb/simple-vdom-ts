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
  patches.forEach((patch) => {
    const newNode =
      patch.context instanceof VElement
        ? patch.context.render()
        : document.createTextNode(patch.context);

    if (patch.action === "updateText") {
      node.textContent = patch.context.toString();
    } else if (patch.action === "replace") {
      node.parentNode.replaceChild(newNode, node);
    } else if (patch.action === "add") {
      node.parentNode.appendChild(newNode);
    } else if (patch.action === "remove") {
      node.childNodes[patch.index] && node.childNodes[patch.index].remove();
    } else if (patch.action === "updateProps") {
      const addProps = patch.propPatches.add;
      const removeProps = patch.propPatches.remove;
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
