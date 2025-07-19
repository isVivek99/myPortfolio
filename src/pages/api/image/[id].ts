import satori from "satori";
import { html } from "satori-html";
import type { APIRoute } from "astro";
import { getSortedBlogs } from "../../../utils/contentCollecion";
import { routes } from "../../../utils/const";
import { initialize, svg2png } from "svg2png-wasm";

export const GET: APIRoute = async ({ params, request }) => {
  const { id } = params;
  const url = new URL(request.url);

  try {
    // Initialize WebAssembly for svg2png-wasm
    await initialize(
      fetch(
        new URL(
          "/svg2png_wasm_bg.wasm",
          import.meta.env.DEV ? routes.local : routes.production,
        ),
      ),
    );

    // Fetch blog posts and find the specific post
    const blogPosts = await getSortedBlogs();
    const post = blogPosts.find((blog) => blog.slug === id);

    if (!post) {
      return new Response("Blog post not found", { status: 404 });
    }

    // Default values or post-specific data
    const title = post.data.title || "Blog Post";
    const subheading =
      post.data.subheading || "Vivek Lokhande - Full Stack Developer";
    const tags: Array<string> = post.data.tags || ["development"];

    // Load fonts via fetch from your public folder
    const baseUrl = import.meta.env.DEV ? routes.local : routes.production;
    const interRegularFontUrl = new URL("/fonts/Inter-Regular.ttf", baseUrl)
      .href;
    const interBoldFontUrl = new URL("/fonts/Inter-Bold.ttf", baseUrl).href;

    // Fetch the fonts
    const [interRegular, interBold] = await Promise.all([
      fetch(interRegularFontUrl).then((res) => res.arrayBuffer()),
      fetch(interBoldFontUrl).then((res) => res.arrayBuffer()),
    ]);

    // Create the HTML template for the OG image
    const out = html(`
      <div style="height: 100%; width: 100%; display: flex; flex-direction: column; background: linear-gradient(135deg, rgb(30,30,30) 0%, rgb(10,10,10) 100%); padding: 60px;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
          <div style="color: white; font-size: 28px; font-weight: 700;">Vivek Lokhande</div>
          <div style="color: rgb(96,165,250); font-size: 20px; font-weight: 500;">viveklokhande.com</div>
        </div>
        
        <!-- Main Content -->
        <div style="display: flex; flex-direction: column; justify-content: center; flex: 1;">
          <!-- Title -->
          <div style="color: white; font-size: 56px; font-weight: 700; line-height: 1.1; margin-bottom: 20px;">
            ${title}
          </div>
          
          <!-- Subtitle -->
          <div style="color: rgb(156,163,175); font-size: 24px; font-weight: 400; margin-bottom: 40px;">
            ${subheading}
          </div>
          
          <!-- Tags -->
          <div style="display: flex; gap: 12px;">
            ${tags
              .map(
                (tag) => `
              <span style="background: rgb(59,130,246); color: white; padding: 6px 18px; border-radius: 999px; font-size: 18px; font-weight: 500; display: flex; align-items: center;">
                #${tag}
              </span>
            `,
              )
              .join("")}
          </div>
        </div>
        
        <!-- Bottom accent -->
        <div style="display: flex; height: 4px; background: linear-gradient(90deg, rgb(59,130,246) 0%, rgb(147,51,234) 100%); border-radius: 2px; margin-top: 40px;"></div>
      </div>
    `);

    // Generate SVG with satori
    const svgString = await satori(out, {
      fonts: [
        {
          name: "Inter",
          data: interRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Inter",
          data: interBold,
          weight: 700,
          style: "normal",
        },
      ],
      height: 630,
      width: 1200,
    });

    // Convert SVG to PNG using svg2png-wasm
    const pngBuffer = await svg2png(svgString, {
      scale: 1, // You can adjust scale for higher resolution
    });

    // Return PNG response
    return new Response(pngBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error generating image:", error);
    // Return a fallback SVG on error
    return new Response(
      `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#0f172a"/>
        <text x="50%" y="50%" font-family="system-ui" font-size="48" fill="white" text-anchor="middle">
          ${id || "Blog Post"}
        </text>
      </svg>`,
      {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "no-cache",
        },
      },
    );
  }
};
