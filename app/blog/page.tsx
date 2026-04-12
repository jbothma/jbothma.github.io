import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "Blog | JD Bothma",
  description: "Posts from JD Bothma",
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>
      <ul className="space-y-6">
        {posts.map((post) => (
          <li key={post.slug} className="border-b border-black/10 dark:border-white/20 pb-6">
            <h2 className="text-2xl font-semibold">
              <Link href={`/blog/${post.slug}`} className="hover:underline">
                {post.title}
              </Link>
            </h2>
            <p className="text-sm opacity-70 mt-1">{post.date}</p>
            {post.excerpt ? <p className="mt-2">{post.excerpt}</p> : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
