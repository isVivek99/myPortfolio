export interface TechIcon {
  icon: string;
  label: string;
}

export interface Product {
  name: string;
  description: string;
  tech: TechIcon[];
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

export interface CurrentStatus {
  text: string;
  href?: string;
}

export const currentStatus: CurrentStatus = {
  text: "talkEncrypted",
  href: "https://github.com/talkencrypted-maker/talkEncrypted",
};

export const products: Product[] = [
  {
    name: "Talk Encrypted",
    description:
      "End to end encrypted messaging app, self hosted and open source.",
    tech: [
      { icon: "ruby", label: "Ruby" },
      { icon: "flutter", label: "Flutter" },
      { icon: "postgresql", label: "PostgreSQL" },
    ],
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
