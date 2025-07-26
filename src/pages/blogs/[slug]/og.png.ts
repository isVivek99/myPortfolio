import { getEntry, type CollectionEntry } from "astro:content";
import { ImageResponse } from "workers-og";
// Import fonts using the rawFonts plugin - these will be converted to buffers
import InterBoldData from "../../../../public/fonts/Inter-Bold.ttf";
import InterRegularData from "../../../../public/fonts/Inter-Regular.ttf";

interface Props {
  params: { slug: string };
  props: { post: CollectionEntry<"blogs"> };
}



export async function GET({ params }: Props) {
  // Get the slug from the incoming server request
  const { slug } = params;
  
  if (!slug) {
    return new Response("Slug parameter is required", { status: 400 });
  }

  // Query for the entry directly using the request slug
  const post = await getEntry("blogs", slug);
  
  // Return 404 if the post doesn't exist
  if (!post) {
    return new Response("Blog post not found", { status: 404 });
  }

  // Font data is already processed as buffers by the rawFonts plugin
  // No need to convert to Buffer again
  const InterBold = InterBoldData;
  const InterRegular = InterRegularData;

  const { title } = post.data;
  // Astro doesn't support tsx endpoints so usign React-element objects
  const html = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; width: 100vw; font-family: 'Inter', sans-serif; background: #160f29">
      <div style="display: flex; width: 100vw; padding: 40px; color: white;">
        <h1 style="font-size: 60px; font-weight: 700; margin: 0; font-family: 'Inter', sans-serif;">${title}</h1>
      </div>
    </div>
   `;

  return new ImageResponse(html, {
    width: 1200,
    height: 600,
    fonts: [
      {
        name: "Inter",
        data: InterBold,
        style: "normal",
        weight: 700,
      },
      {
        name: "Inter",
        data: InterRegular,
        style: "normal",
        weight: 400,
      },
    ],
  });
}
