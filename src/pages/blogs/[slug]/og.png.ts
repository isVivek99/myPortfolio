import { getEntry, type CollectionEntry } from "astro:content";
import { ImageResponse } from "workers-og";
// Import fonts using the rawFonts plugin - these will be converted to buffers
import InterBoldData from '../../../assets/fonts/Inter-Bold.ttf'
import InterRegularData from '../../../assets/fonts/Inter-Regular.ttf'

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

  // Font data is now properly loaded as Uint8Array by the rawFonts plugin
  const InterBold = (InterBoldData as any).buffer || InterBoldData;
  const InterRegular = (InterRegularData as any).buffer || InterRegularData;

  const { title } = post.data;
  
  // Create a more robust HTML structure for OG image
  const html = `
    <div style="
      display: flex;
      width: 1200px;
      height: 600px;
      background: linear-gradient(135deg, #160f29 0%, #1a1325 100%);
      padding: 60px;
      box-sizing: border-box;
      align-items: center;
      justify-content: center;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    ">
      <div style="
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: flex-start;
      ">
        <div style="
          display: flex;
          background: rgba(255, 255, 255, 0.05);
          padding: 8px 16px;
          border-radius: 6px;
          margin-bottom: 24px;
          font-size: 16px;
          color: #a855f7;
          font-weight: 500;
        ">
          Blog Post
        </div>
        <div style="
          display: flex;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 48px;
          font-weight: 700;
          line-height: 1.1;
          color: #ffffff;
          margin: 0;
          max-width: 100%;
          word-wrap: break-word;
        ">${title}</div>
        <div style="
          display: flex;
          align-items: center;
          margin-top: 40px;
          color: #9ca3af;
          font-size: 18px;
        ">
          <div style="
            display: flex;
            width: 40px;
            height: 40px;
            background: linear-gradient(45deg, #a855f7, #ec4899);
            border-radius: 50%;
            margin-right: 16px;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            color: white;
          ">
            VL
          </div>
          <div style="display: flex;">Vivek Lokhande</div>
        </div>
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
      {
        name: "Inter",
        data: InterRegular,
        style: "normal",
        weight: 500,
      },
    ],
    debug: false, // Set to true if you want to see debug info
  });
}
