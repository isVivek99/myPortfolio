import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    subheading: z.string(),
  }),
});

export const collections = {
  blog,
};
