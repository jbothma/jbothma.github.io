import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { RenderPostMarkdown } from "@/lib/render-post-markdown";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const post = await getPostBySlug(slug).catch(() => null);

  if (!post) {
    return {
      title: "Post not found | JD Bothma",
    };
  }

  return {
    title: `${post.title} | JD Bothma`,
    description: post.excerpt ?? undefined,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  const post = await getPostBySlug(slug).catch(() => null);
  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <article className="post-content">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <p className="text-sm opacity-70 mb-8">{post.date}</p>
        <RenderPostMarkdown content={post.content} />
      </article>
    </main>
  );
}
