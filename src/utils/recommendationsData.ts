export interface Book {
  title: string;
  author: string;
  progress?: number;
  why?: string;
  url?: string;
}

export interface Video {
  title: string;
  creator: string;
  why?: string;
  url?: string;
}

export interface CurrentStatus {
  text: string;
  href?: string;
}

export const currentlyReading: Book[] = [
  {
    title: "Totapuri Mahraj the vedic teacher of Sri Ramakrishna",
    author: "",
    url: "https://example.com",
  },
  {
    title: "Yuga Shift",
    author: "Bibhu Dev Mishra",
    url: "https://example.com",
  },
];

export const recommendations: Book[] = [
  {
    title: "TODO: Book Title",
    author: "TODO: Author Name",
    why: "TODO: One-line reason why you recommend this.",
    url: "https://example.com",
  },
  {
    title: "TODO: Book Title",
    author: "TODO: Author Name",
    why: "TODO: One-line reason why you recommend this.",
    url: "https://example.com",
  },
];

export const videoRecommendations: Video[] = [
  {
    title: "TODO: Video Title",
    creator: "TODO: Creator/Channel Name",
    why: "TODO: One-line reason why you recommend this.",
    url: "https://example.com",
  },
  {
    title: "TODO: Video Title",
    creator: "TODO: Creator/Channel Name",
    why: "TODO: One-line reason why you recommend this.",
    url: "https://example.com",
  },
];

export const currentStatus: CurrentStatus = {
  text: "TODO: short description of what you're working on",
  href: undefined,
};
