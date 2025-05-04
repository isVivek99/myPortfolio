import { type CollectionEntry } from "astro:content";
export type BlogCollection = CollectionEntry<"blogs">[];
export type FilteredPostsProps = {
  filteredPosts: BlogCollection;
};
