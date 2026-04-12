import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { remarkGpxMapDirective } from "@/lib/remark-gpx-map-directive";
import GpxMap from "@/app/components/gpx-map";

type GpxMapMarkdownProps = {
  src?: unknown;
  height?: unknown;
};

const markdownComponents = {
  "gpx-map": ({ src, height }: GpxMapMarkdownProps) => (
    <GpxMap
      src={typeof src === "string" ? src : ""}
      height={typeof height === "number" ? height : Number(height ?? 420)}
    />
  ),
} as unknown as Components;

type RenderPostMarkdownProps = {
  content: string;
};

export function RenderPostMarkdown({ content }: RenderPostMarkdownProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkDirective, remarkGpxMapDirective]}
      rehypePlugins={[rehypeRaw]}
      components={markdownComponents}
    >
      {content}
    </ReactMarkdown>
  );
}
