globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, d as createAstro, m as maybeRenderHead, e as addAttribute, r as renderComponent, b as renderTemplate } from '../chunks/astro/server_QlrBW5xk.mjs';
/* empty css                                 */
import { f as formatDate, m as myGradient, g as getCollection } from '../chunks/UTCDateStringToReadable_DSX-ETDw.mjs';
import { $ as $$Image } from '../chunks/_astro_assets_B0-JMAFI.mjs';
import { $ as $$BaseLayout } from '../chunks/BaseLayout_B1xBAUFV.mjs';
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$BlogCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$BlogCard;
  const {
    cardTitle,
    cardSubtitle,
    dateTime,
    imageUrl,
    readTimeInMinutes,
    postUrl
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(`/blogs/${postUrl}`, "href")}> <article class="group relative flex h-[450px] w-auto transform cursor-pointer flex-col rounded-xl bg-neutral ring-1 ring-neutral-border ring-offset-black transition duration-300 hover:outline-none hover:ring-2 hover:ring-color-yellow hover:ring-offset-4"> <div class="realtive h-48 w-auto"> ${renderComponent($$result, "Image", $$Image, { "src": myGradient, "height": 100, "width": 100, "alt": "my picture", "class": "m h-full w-full rounded-t-xl mix-blend-soft-light" })} ${renderComponent($$result, "Image", $$Image, { "src": imageUrl, "height": 100, "width": 100, "alt": "my picture", "class": "absolute top-0 h-48 w-full transform rounded-t-xl object-cover opacity-80 transition duration-300 group-hover:opacity-100", "loading": "lazy" })} </div> <div class="flex basis-full flex-col justify-between p-2 text-left xl:p-4"> <div> <p class="mt-6 text-lg font-semibold tracking-tight"> ${cardTitle} </p> <p class="mt-2 h-10 text-sm tracking-tight"> ${cardSubtitle} </p> </div> <p class="pt-2 text-xs text-neutral-border"> ${formatDate(dateTime)} — ${readTimeInMinutes} min read
</p> </div> </article> </a>`;
}, "/Users/vivek/Desktop/self/myPortfolio/src/components/blogs/BlogCard.astro", void 0);

const $$Blogs = createComponent(async ($$result, $$props, $$slots) => {
  const blogPosts = await getCollection("blogs");
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "pageTitle": "viveks portfolio blog" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="section-1 flex flex-col items-center justify-center px-8 pb-20 pt-40 text-center md:h-1/2 md:pb-0 md:pt-20 2xl:px-32"> <h1 class="text-5xl font-semibold leading-tight tracking-tight">My blog</h1> <p class="mt-7 max-w-2xl text-lg font-medium leading-relaxed">
I like to write about software development 🚀 & open source 🥑.
</p> </section> <section class="relative mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3"> ${blogPosts.map((blog) => renderTemplate`${renderComponent($$result2, "BlogCard", $$BlogCard, { "cardTitle": blog.data.title, "cardSubtitle": blog.data.subheading, "dateTime": blog.data.publishedAt, "imageUrl": blog.data.cover, "readTimeInMinutes": blog.data.readingTimeInMins, "postUrl": blog.slug })}`)} </section> <section class="h-32" aria-hidden="true"></section> ` })}`;
}, "/Users/vivek/Desktop/self/myPortfolio/src/pages/blogs.astro", void 0);

const $$file = "/Users/vivek/Desktop/self/myPortfolio/src/pages/blogs.astro";
const $$url = "/blogs";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Blogs,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
