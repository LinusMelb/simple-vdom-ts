import { ElementChildren, ElementProp, VElement } from "./element";

/**
 * We will use DFS to compare old and new vDOM
 * Time complexity is O(n) where n is the number of nodes in vDOM
 *
 * each element in old vDOM will be assigned with an index number, we will walk through
 * both old and new vDOMs to find differences and apply patches to the old vDOM
 */

interface PropPatchesMap {
  remove: string[];
  add: ElementProp[];
}

type PatchAction = "updateText" | "updateProps" | "replace" | "remove" | "add";
interface PatchState {
  action: PatchAction;
  context: VElement | PropPatchesMap | string;
}
interface VDomPatchState {
  [index: number]: PatchState[];
}

const diffVDom = (oldDom: VElement, newDom: VElement) => {
  let index = 0;
  let patches = {};
  dfsWalk(oldDom, newDom, index, patches);
  return patches;
};

const dfsWalk = (
  oldEle: VElement | string,
  newEle: VElement | string,
  index: number,
  domPatches: VDomPatchState
) => {
  // to store the applicable patches for current old vElement
  const currentPatches: PatchState[] = [];

  if (oldEle && newEle === null) {
    // need to remove it from old DOM
    // this is handled by diffVChildren
  } else if (
    typeof oldEle === "string" &&
    typeof newEle === "string" &&
    newEle !== oldEle
  ) {
    currentPatches.push({
      action: "updateText",
      context: newEle,
    });
    // Elements are the same, compare their props and children
  } else if (
    oldEle instanceof VElement &&
    newEle instanceof VElement &&
    oldEle.tagName === newEle.tagName
  ) {
    // compare props
    const propPatches = diffProps(oldEle.props, newEle.props);
    if (propPatches.add.length > 0 || propPatches.remove.length > 0) {
      currentPatches.push({
        action: "updateProps",
        context: propPatches,
      });
    }
    console.log(index, "compare children");
    // compare children
    diffVChildren(
      oldEle.children,
      newEle.children,
      index,
      domPatches,
      currentPatches
    );
  }
  // both old and new child is the same text
  // both old and new child is the same vElement
  else if (
    oldEle === newEle ||
    (oldEle instanceof VElement && (oldEle as VElement).toEqual(newEle))
  ) {
  }
  // elements are different, replace old one with the new one
  else {
    currentPatches.push({
      action: "replace",
      context: newEle,
    });
  }

  // attach patches of current old velement to overall domPatch object
  if (currentPatches.length > 0) {
    domPatches[index] = currentPatches;
  }
};

const diffProps = (oldProps: ElementProp, newProps: ElementProp) => {
  const propPatches: PropPatchesMap = {
    remove: [],
    add: [],
  };

  // find props that are removed in new element
  for (const propKey in oldProps) {
    if (!newProps.hasOwnProperty(propKey)) {
      propPatches.remove.push(propKey);
    }
  }

  // find props that has changed in new element
  for (const propKey in newProps) {
    if (oldProps[propKey] !== newProps[propKey]) {
      propPatches.add.push({ [propKey]: newProps[propKey] });
    }
  }

  return propPatches;
};

const diffVChildren = (
  oldChildren: ElementChildren,
  newChildren: ElementChildren,
  index: number,
  domPatches: VDomPatchState,
  curPatches: PatchState[]
) => {
  const maxChildrenNum = Math.max(oldChildren.length, newChildren.length);

  // comapre children
  for (let i = 0; i < maxChildrenNum; i++) {
    // add new child if it's missing in old children
    if (oldChildren[i] === undefined && newChildren[i]) {
      curPatches.push({
        action: "add",
        context: newChildren[i],
      });
    }
    // remove old child if it's missing in new children
    else if (newChildren[i] === undefined && oldChildren[i]) {
      curPatches.push({
        action: "remove",
        context: oldChildren[i],
      });
    }
    // both old and new child is the same text
    // both old and new child is the same vElement
    else if (
      oldChildren[i] === newChildren[i] ||
      (oldChildren[i] instanceof VElement &&
        (oldChildren[i] as VElement).toEqual(newChildren[i]))
    ) {
      continue;
    } else {
      // replace old child with new child
      // this is handled in dfsWalk
    }
  }

  let prevChild: VElement | string = null;
  let curChildIndex = index;
  // continue walking through each old child to see if it's updated
  oldChildren.forEach((oldChild, iindex) => {
    // how to calculate index?
    // suppose we have 3 children A,B,C, index starts with 1, and each of them have two sub-children
    // index of A,B,C are 1, (1+2)+1=4, (4+2)+1=7 respectively
    // hence formula is: prevChildIndex + numer of prevChild's children + 1
    if (typeof prevChild === "string") {
      curChildIndex = curChildIndex + 1;
    } else {
      curChildIndex =
        prevChild && prevChild.count
          ? curChildIndex + prevChild.count + 1
          : curChildIndex + 1;
    }
    dfsWalk(oldChild, newChildren[iindex], curChildIndex, domPatches);
    // when next loop starts, current child will become the prev child of next child
    prevChild = oldChild;
  });
};

export { diffProps, diffVDom };
