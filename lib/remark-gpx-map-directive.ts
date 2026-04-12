import { visit } from "unist-util-visit";
import type { Node } from "unist";

type DirectiveNode = Node & {
  type: "leafDirective" | "textDirective" | "containerDirective";
  name?: string;
  attributes?: Record<string, unknown>;
  data?: Record<string, unknown>;
};

function isDirectiveNode(node: Node): node is DirectiveNode {
  return (
    node.type === "leafDirective" ||
    node.type === "textDirective" ||
    node.type === "containerDirective"
  );
}

function ensureString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function remarkGpxMapDirective() {
  return (tree: Node) => {
    visit(tree, (node) => {
      if (!isDirectiveNode(node) || node.name !== "gpx-map") {
        return;
      }

      const src = ensureString(node.attributes?.src);
      const height = ensureString(node.attributes?.height, "420");

      node.data = {
        ...(node.data ?? {}),
        hName: "gpx-map",
        hProperties: {
          src,
          height,
        },
      };
    });
  };
}
