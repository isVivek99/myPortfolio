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
    title: "Totapuri - Vedantic Teacher of Sri Ramakrishna",
    author: "Debashish Chittaranjan Roy",
    url: "https://www.vedanta.com/store/totapuri-vedantic-teacher-of-sri-ramakrishna-details.html",
  },
  {
    title: "Yuga Shift: The End of the Kali Yuga & The Impending Planetary Transformation",
    author: "Bibhu Dev Misra",
    url: "https://www.amazon.in/Yuga-Shift-Impending-Planetary-Transformation/dp/B0CPJVYQG4",
  },
];

// export const recommendations: Book[] = [
//   {
//     title: "TODO: Book Title",
//     author: "TODO: Author Name",
//     why: "TODO: One-line reason why you recommend this.",
//     url: "https://example.com",
//   },
//   {
//     title: "TODO: Book Title",
//     author: "TODO: Author Name",
//     why: "TODO: One-line reason why you recommend this.",
//     url: "https://example.com",
//   },
// ];

export const videoRecommendations: Video[] = [
  {
    title: '"Who Am I?" according to Mandukya Upanishad - Part 1',
    creator: "Swami Sarvapriyananda at IITK",
    url: "https://www.youtube.com/watch?v=eGKFTUuJppU",
  },
  {
    title: '"Who Am I?" according to Mandukya Upanishad - Part 2',
    creator: "Swami Sarvapriyananda at IITK",
    url: "https://www.youtube.com/watch?v=F0dugc4TrlE",
  },
];

export const currentStatus: CurrentStatus = {
  text: "talkEncrypted",
  href: "https://github.com/talkencrypted-maker/talkEncrypted",
};
