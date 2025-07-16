// Utility functions for SEO optimization

/**
 * Generates proper meta description from content
 * @param content - Raw content string
 * @param maxLength - Maximum length for description (default: 160)
 * @returns Truncated and cleaned description
 */
export function generateMetaDescription(content: string, maxLength: number = 160): string {
  // Remove HTML tags and clean up content
  const cleanContent = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }
  
  // Truncate at word boundary
  const truncated = cleanContent.substr(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 
    ? truncated.substr(0, lastSpace) + '...'
    : truncated + '...';
}

/**
 * Generates proper title with site name
 * @param title - Page title
 * @param siteName - Site name (default: "Vivek Lokhande")
 * @param separator - Separator between title and site name (default: " | ")
 * @returns Formatted title
 */
export function generatePageTitle(
  title: string, 
  siteName: string = "Vivek Lokhande", 
  separator: string = " | "
): string {
  return title === siteName ? title : `${title}${separator}${siteName}`;
}

/**
 * Generates keywords from tags and content
 * @param tags - Array of tags
 * @param additionalKeywords - Additional keywords to include
 * @returns Comma-separated keywords string
 */
export function generateKeywords(
  tags: string[] = [], 
  additionalKeywords: string[] = []
): string {
  const baseKeywords = [
    "Vivek Lokhande",
    "Full Stack Developer", 
    "Web Development",
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js"
  ];
  
  const allKeywords = [...new Set([...baseKeywords, ...tags, ...additionalKeywords])];
  return allKeywords.join(", ");
}

/**
 * Generates canonical URL
 * @param path - Page path
 * @param baseUrl - Base URL (default: "https://viveklokhande.com")
 * @returns Canonical URL
 */
export function generateCanonicalUrl(
  path: string, 
  baseUrl: string = "https://viveklokhande.com"
): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Estimates reading time for content
 * @param content - Content string
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Reading time in minutes
 */
export function estimateReadingTime(content: string, wordsPerMinute: number = 200): number {
  const cleanContent = content.replace(/<[^>]*>/g, '');
  const words = cleanContent.trim().split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);
  return Math.max(1, readingTime); // Minimum 1 minute
}

/**
 * Converts local cover image path to public URL for social media sharing
 * @param coverPath - The local cover image filename (e.g., "cover-1.svg")
 * @param baseUrl - Base URL (default: "https://viveklokhande.com")
 * @returns Public URL for the cover image
 */
export function generateCoverImageUrl(
  coverPath: string, 
  baseUrl: string = "https://viveklokhande.com"
): string {
  // If coverPath is already just a filename, use it directly
  // Otherwise extract filename from path
  const filename = coverPath.includes('/') 
    ? coverPath.split('/').pop() || 'cover-1.svg'
    : coverPath;
  
  // Return public URL
  return `${baseUrl}/covers/${filename}`;
}
