type TagName = keyof HTMLElementTagNameMap;
type ElementChildren = (VElement | string)[];
interface ElementProp {
    style?: string;
    id?: string;
    class?: string;
}

class VElement {

    tagName: TagName;
    props: ElementProp;
    children: ElementChildren = [];
    count: number = 0;

    constructor(tagName : TagName, props?: ElementProp, children?: ElementChildren) {
        console.log('....element....');
        this.tagName = tagName;
        this.props = props;
        this.processChildren(children);
    }

    private processChildren(children: ElementChildren) {
        if (!children) {
            return;
        }

        this.children = children;
        // to store the total number of velement in children (including their children)
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
            const childEl = child instanceof VElement ? child.render() : document.createTextNode(child);
            el.appendChild(childEl);
        }
        
        return el;
    }
}

export const vEl = (tagName : TagName, props?: ElementProp, children?: ElementChildren) => {
    return new VElement(tagName, props, children);
}
