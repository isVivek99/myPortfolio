import { type CollectionEntry, getCollection } from "astro:content";

export const getSortedBlogs = async (): Promise<CollectionEntry<"blogs">[]> => {
  const blogs: CollectionEntry<"blogs">[] = await getCollection("blogs");
  const blogsposts = blogs.sort(
    (a, b) =>
      new Date(b.data.publishedAt).valueOf() -
      new Date(a.data.publishedAt).valueOf(),
  );

  return blogsposts;
};
