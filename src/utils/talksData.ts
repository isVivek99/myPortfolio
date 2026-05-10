import type { ImageMetadata } from "astro";
import cover from "../assets/talks/talk_1_react_pune/cover.jpeg";
import gallery1 from "../assets/talks/talk_1_react_pune/gallery_1.jpeg";
import gallery2 from "../assets/talks/talk_1_react_pune/gallery_2.jpeg";
import gallery3 from "../assets/talks/talk_1_react_pune/gallery_3.jpeg";

export interface Talk {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  cover: ImageMetadata;
  gallery: ImageMetadata[];
  githubUrl?: string;
  eventUrl?: string;
  eventName?: string;
}

// Add talks here. Cover and gallery images must be static imports from
// src/assets/talks/<slug>/ so Astro can optimize them at build time.
export const talks: Talk[] = [
  {
    slug: "react-pune-astro",
    title: "Astro islands architecture",
    subtitle:
      "we discussed about how astro islands inject data into the client side and how it works under the hood.",
    date: "2025-05-10",
    cover: cover,
    gallery: [gallery1, gallery2, gallery3],
    githubUrl: "https://github.com/isVivek99/react-pune-astro",
    eventUrl: "https://www.meetup.com/reactjs-and-friends/",
    eventName: "react pune",
  },
];
