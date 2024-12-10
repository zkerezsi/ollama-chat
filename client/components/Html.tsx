import { useMemo, JSXNode, createElement, Fragment } from "npm:hono/jsx/dom";

function nodeToJSXNode(node: Node): JSXNode {
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return createElement(Fragment, null, node.nodeValue);
  }

  const element = node as Element;

  const props: Record<string, string> = {};
  for (const attr of element.attributes) {
    props[attr.name] = attr.value;
  }

  const children = [];
  for (const childNode of element.childNodes) {
    children.push(nodeToJSXNode(childNode));
  }

  return createElement(element.nodeName.toLowerCase(), props, ...children);
}

export function Html({ content }: { content: string }) {
  const children = useMemo(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const jsxNodes = [];
    for (const child of doc.body.children) {
      jsxNodes.push(nodeToJSXNode(child));
    }
    return jsxNodes;
  }, [content]);

  return <>{...children}</>;
}
