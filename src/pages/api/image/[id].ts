import satori from 'satori';
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';
import interRegularFont from '/public/fonts/Inter-Regular.ttf';
import type { APIRoute } from 'astro';
import { getSortedBlogs } from '../../../utils/contentCollecion';

export const GET: APIRoute = async ({ params }) => {

    const { id } = params;
    
    // Fetch blog posts and find the specific post
    const blogPosts = await getSortedBlogs();
    const post = blogPosts.find(blog => blog.slug === id);
    
    // Default values or post-specific data
    const title = post.data.title || 'Blog Post';
    const subheading = post.data.subheading || 'Vivek Lokhande - Full Stack Developer';
    const tags:Array<string> = post.data.tags || ['development'];


    
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
        ${tags.map(tag => `
          <span style="background: rgb(59,130,246); color: white; padding: 6px 18px; border-radius: 999px; font-size: 18px; font-weight: 500; display: flex; align-items: center;">
            #${tag}
          </span>
        `).join('')}
      </div>
    </div>
    
    <!-- Bottom accent -->
    <div style="display: flex; height: 4px; background: linear-gradient(90deg, rgb(59,130,246) 0%, rgb(147,51,234) 100%); border-radius: 2px; margin-top: 40px;"></div>
  </div>
`);

  let svg = await satori(out, {
    fonts: [
      {
        name: 'Inter',
        data: Buffer.from(interRegularFont),
        style: 'normal'
      }
    ],
    height: 630,
    width: 1200
  });

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 1200
    }
  });

  const image = resvg.render();

  return new Response(image.asPng(), {
    headers: {
      'Content-Type': 'image/png',
      // optional
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  })
}