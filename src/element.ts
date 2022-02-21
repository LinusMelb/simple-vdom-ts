type TagName = keyof HTMLElementTagNameMap;
export type ElementChildren = (VElement | string)[];
export interface ElementProp {
  [name: string]: string;
}

export class VElement {
  tagName: TagName;
  props: ElementProp;
  children: ElementChildren = [];
  count: number = 0;

  constructor(
    tagName: TagName,
    props?: ElementProp,
    children?: ElementChildren
  ) {
    this.tagName = tagName;
    this.props = props;
    this.processChildren(children);
  }

  private processChildren(children: ElementChildren) {
    if (!children) {
      return;
    }

    this.children = children;
    // to track the total number of velements among all children
    let count = 0;

    children.forEach((child, index) => {
      if (child instanceof VElement) {
        count += child.count;
      } else {
        // append as normal text
        this.children[index] = child.toString();
      }
      count++;
    });

    this.count = count;
  }

  public render() {
    const el = document.createElement(this.tagName);
    const props = this.props;
    const children = this.children;

    for (const prop of Object.keys(props)) {
      el.setAttribute(prop, props[prop]);
    }

    for (const child of children) {
      // child is either VElement or Text String
      const childEl =
        child instanceof VElement
          ? child.render()
          : document.createTextNode(child);
      el.appendChild(childEl);
    }

    return el;
  }

  public toEqual(vEle: VElement | string) {
    // tech debt: should compare props too
    if (typeof vEle === "string" || vEle === undefined) {
      return false;
    }
    if (vEle.tagName !== this.tagName || vEle.count !== this.count) {
      return false;
    }
    return true;
  }
}

export const vEl = (
  tagName: TagName,
  props?: ElementProp,
  children?: ElementChildren
) => {
  return new VElement(tagName, props, children);
};
