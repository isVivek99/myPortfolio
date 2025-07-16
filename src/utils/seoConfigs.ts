// SEO configurations for different page types
import { generateCoverImageUrl } from "./seoUtils";

export interface SEOConfig {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

// Homepage SEO
export const homeSEO: SEOConfig = {
  title: "Vivek Lokhande - Full Stack Developer & Software Engineer",
  description: "Portfolio of Vivek Lokhande - Full Stack Developer specializing in React, Node.js, TypeScript, and modern web technologies. Explore my projects, blog posts, and technical expertise.",
  image: "/myImage.png",
  imageAlt: "Vivek Lokhande - Full Stack Developer Portfolio",
  type: "website"
};

// Blog listing page SEO
export const blogListSEO: SEOConfig = {
  title: "Blog - Vivek Lokhande | Web Development & Programming Insights",
  description: "Read my latest blog posts about web development, JavaScript, React, Node.js, and software engineering best practices. Learn from real-world experiences and technical insights.",
  image: "/myImage.png",
  imageAlt: "Vivek Lokhande Blog - Web Development Articles",
  type: "website"
};

// 404 page SEO
export const notFoundSEO: SEOConfig = {
  title: "Page Not Found - Vivek Lokhande",
  description: "The page you're looking for doesn't exist. Navigate back to explore my portfolio, blog posts, and projects.",
  image: "/myImage.png",
  imageAlt: "404 Page Not Found",
  type: "website",
  noindex: true
};

// Generate blog post SEO configuration
export function generateBlogSEO(data: {
  title: string;
  subheading: string;
  cover: string;
  publishedAt: Date;
  tags: string[];
  slug: string;
}): SEOConfig {
  return {
    title: `${data.title} | Vivek Lokhande Blog`,
    description: data.subheading,
    image: generateCoverImageUrl(data.cover),
    imageAlt: data.title,
    type: "article",
    publishedTime: data.publishedAt.toISOString(),
    tags: data.tags,
    canonical: `https://viveklokhande.com/blogs/${data.slug}`
  };
}

// Generate tag page SEO configuration
export function generateTagSEO(tag: string, postCount: number): SEOConfig {
  return {
    title: `${tag} Articles - Vivek Lokhande Blog`,
    description: `Explore ${postCount} blog posts about ${tag}. Learn about web development, programming concepts, and technical insights related to ${tag}.`,
    image: "/myImage.png",
    imageAlt: `${tag} related articles by Vivek Lokhande`,
    type: "website"
  };
}
