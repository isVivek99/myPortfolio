import { defineCollection, z } from "astro:content";

const blogs = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      subheading: z.string(),
      cover: image(),
      coverAlt: z.string().optional(),
      publishedAt: z.coerce.date(),
      readingTimeInMins: z.number().int().min(1),
      tags: z.array(z.string()),
      slug: z.string().optional(),
      description: z.string().max(160).optional(),
      keywords: z.array(z.string()).optional(),
    }),
});

export const collections = {
  blogs,
};
