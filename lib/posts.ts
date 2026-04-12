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

function dateFromFrontMatter(value: unknown, fallback = ""): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  return ensureString(value, fallback);
}

function isDatedMarkdownFile(fileName: string): boolean {
  return /^\d{4}-\d{2}-\d{2}-.+\.md$/.test(fileName);
}

async function getDatedFileSlugs(): Promise<string[]> {
  return (await fs.readdir(postsDirectory))
    .filter((file) => isDatedMarkdownFile(file))
    .map((file) => file.replace(/\.md$/, ""));
}

async function readPostFromFileSlug(fileSlug: string): Promise<Post> {
  const fullPath = path.join(postsDirectory, `${fileSlug}.md`);
  const fileContents = await fs.readFile(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug: fileSlug,
    title: ensureString(data.title, fileSlug),
    date: dateFromFrontMatter(data.date),
    excerpt: ensureString(data.excerpt),
    content,
  };
}

export async function getPostSlugs(): Promise<string[]> {
  const fileSlugs = await getDatedFileSlugs();

  const posts = await Promise.all(fileSlugs.map((fileSlug) => readPostFromFileSlug(fileSlug)));
  return posts.map((post) => post.slug);
}

export async function getAllPosts(): Promise<PostSummary[]> {
  const fileSlugs = await getDatedFileSlugs();

  const posts = await Promise.all(
    fileSlugs.map(async (fileSlug) => {
      const post = await readPostFromFileSlug(fileSlug);

      return {
        slug: post.slug,
        title: post.title,
        date: post.date,
        excerpt: post.excerpt,
      } satisfies PostSummary;
    }),
  );

  return posts.sort((a, b) => (a.slug < b.slug ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<Post> {
  return readPostFromFileSlug(slug);
}
