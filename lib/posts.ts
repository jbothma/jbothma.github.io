import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/posts");

export type PostSummary = {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
};

export type Post = PostSummary & {
  content: string;
};

function ensureString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export async function getPostSlugs(): Promise<string[]> {
  const files = await fs.readdir(postsDirectory);
  return files.filter((file) => file.endsWith(".md")).map((file) => file.replace(/\.md$/, ""));
}

export async function getAllPosts(): Promise<PostSummary[]> {
  const slugs = await getPostSlugs();

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const fullPath = path.join(postsDirectory, `${slug}.md`);
      const fileContents = await fs.readFile(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug,
        title: ensureString(data.title, slug),
        date: ensureString(data.date, "1970-01-01"),
        excerpt: ensureString(data.excerpt),
      } satisfies PostSummary;
    }),
  );

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = await fs.readFile(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: ensureString(data.title, slug),
    date: ensureString(data.date, "1970-01-01"),
    excerpt: ensureString(data.excerpt),
    content,
  };
}
