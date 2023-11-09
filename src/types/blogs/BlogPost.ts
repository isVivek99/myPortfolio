export type BlogPost = {
  node: {
    [x: string]: any;
    author: {
      username: string;
      id: string;
      name: string;
    };
    url: string;
    title: string;
    subtitle: string;
    slug: string;
    canonicalUrl: string | null;
    readTimeInMinutes: number;
    publishedAt: string;
    coverImage: {
      url: string;
      attribution: string | null;
      photographer: string | null;
    } | null;
  };
};
