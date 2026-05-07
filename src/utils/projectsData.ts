export interface Project {
  name: string;
  description: string;
  tech: string[];
  year: string;
  url: string;
}

export interface PR {
  number: number;
  title: string;
  repo: string;
  date: string;
  url: string;
}

export const projects: Project[] = [
  {
    name: "Talk Encrypted",
    description:
      "End to end encrypted messaging app, self hosted and open source.",
    tech: ["ruby", "flutter", "postgresql"],
    year: "2025",
    url: "https://github.com/talkencrypted-maker/talkEncrypted",
  },
];

export const ossPRs: PR[] = [
  {
    number: 13872,
    title: "Fixes rendering of the download attribute",
    repo: "withastro/astro",
    date: "Jun 2, 2025",
    url: "https://github.com/withastro/astro/pull/13872",
  },
  {
    number: 13909,
    title: "Added support for HTML boolean attributes",
    repo: "withastro/astro",
    date: "Jun 20, 2025",
    url: "https://github.com/withastro/astro/pull/13909",
  },
  {
    number: 13990,
    title: "Fixed client/server config changes",
    repo: "withastro/astro",
    date: "Jun 25, 2025",
    url: "https://github.com/withastro/astro/pull/13990",
  },
];
