import { defineCollection, z } from "astro:content";

const blogs = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subheading: z.string(),
      cover: image(),
      publishedAt: z.coerce.date(),
      readingTimeInMins: z.number().int().min(1),
      tags: z.array(z.string()), // Added tags as an array of strings
    }),
});

export const collections = {
  blogs,
};
