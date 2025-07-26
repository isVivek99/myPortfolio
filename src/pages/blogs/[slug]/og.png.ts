import { getCollection, type CollectionEntry } from "astro:content";
import { ImageResponse } from "workers-og";
// Import fonts directly using the rawFonts plugin
import InterBoldData from "../../../lib/fonts/Inter-Bold.ttf";
import InterRegularData from "../../../lib/fonts/Inter-Regular.ttf";

interface Props {
  params: { slug: string };
  props: { post: CollectionEntry<"blogs"> };
}

export const prerender = true;

export async function GET({ params }: Props) {
  const blogPosts = await getCollection("blogs");
  const post = blogPosts.find((p: any) => p.slug === params.slug);

  // using custom font files
  // Convert the imported font data to Buffer format
  const InterBold = Buffer.from(InterBoldData);
  const InterRegular = Buffer.from(InterRegularData);

  const { title } = post;
  // Astro doesn't support tsx endpoints so usign React-element objects
  const html = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; width: 100vw; font-family: sans-serif; background: #160f29">
      <div style="display: flex; width: 100vw; padding: 40px; color: white;">
        <h1 style="font-size: 60px; font-weight: 600; margin: 0; font-family: 'Bitter'; font-weight: 500">${title}</h1>
      </div>
    </div>
   `;

  return new ImageResponse(html, {
    width: 1200,
    height: 600,
    fonts: [
      {
        name: "Inter Bold",
        data: InterBold,
        style: "normal",
      },
      {
        name: "Inter Regular",
        data: InterRegular,
        style: "normal",
      },
    ],
  });
}

export async function getStaticPaths() {
  const blogPosts = await getCollection("blogs");

  // Return an array of paths and props for each post
  return blogPosts.map((post: CollectionEntry<"blogs">) => ({
    params: { slug: post.slug }, // Using the slug field for dynamic routing
  }));
}
