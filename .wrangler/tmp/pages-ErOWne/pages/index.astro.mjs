globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, d as createAstro, m as maybeRenderHead, e as addAttribute, b as renderTemplate, j as renderSlot, r as renderComponent, F as Fragment, a as renderScript } from '../chunks/astro/server_QlrBW5xk.mjs';
/* empty css                                 */
import { $ as $$Image } from '../chunks/_astro_assets_B0-JMAFI.mjs';
import { a as $$Icon, $ as $$BaseLayout } from '../chunks/BaseLayout_A4ggbcpe.mjs';
export { renderers } from '../renderers.mjs';

const MyImage = new Proxy({"src":"/_astro/myImage.CA8fuqj9.png","width":300,"height":300,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "/Users/vivek/Desktop/self/myPortfolio/src/icons/myImage.png";
							}
							
							return target[name];
						}
					});

const $$Astro$3 = createAstro();
const $$ButtonPrimary = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$ButtonPrimary;
  const { value, href } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")} class="relative flex h-11 w-auto items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:border before:border-transparent before:bg-blue-purple-gradient before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"> <span class="relative text-white"> ${value} </span> </a>`;
}, "/Users/vivek/Desktop/self/myPortfolio/src/components/ButtonPrimary.astro", void 0);

const $$Astro$2 = createAstro();
const $$ButtonSecondary = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$ButtonSecondary;
  const { value, href } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")} class="relative gap-1 rounded-full border-2 border-solid border-neutral-border bg-black px-5 py-2.5 text-center before:absolute before:inset-0 before:rounded-full before:bg-black before:transition before:duration-300
  hover:before:scale-105 hover:before:border-2 hover:before:border-solid
  hover:before:border-white active:duration-75 active:before:scale-100 sm:w-max"> <span class="relative text-white"> ${value} </span> </a>`;
}, "/Users/vivek/Desktop/self/myPortfolio/src/components/ButtonSecondary.astro", void 0);

const $$Astro$1 = createAstro();
const $$Card = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Card;
  const { cardTitle, cardWidth, cardHeight, cardFooter } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<article${addAttribute(`${cardWidth} ${cardHeight}`, "class")}> <div${addAttribute(`h-full ${cardWidth} ${cardHeight} cursor-pointer ring-1 ring-neutral-border bg-neutral rounded-xl p-2 xl:p-4`, "class")}> ${!!cardTitle?.length && renderTemplate`<h1 class="mb-4 text-center text-2xl font-semibold tracking-tight"> ${cardTitle} </h1>`} ${renderSlot($$result, $$slots["default"])} </div> ${!!cardFooter?.length && renderTemplate`<h1 class="mt-4 truncate text-center text-lg font-semibold tracking-tight"> ${cardFooter} </h1>`} </article>`;
}, "/Users/vivek/Desktop/self/myPortfolio/src/components/Card.astro", void 0);

const $$Astro = createAstro();
const $$ListItem = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ListItem;
  const { imageObject, orgName, position, tenure } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<li class="flex list-none justify-between py-3"> <div class="flex"> ${renderComponent($$result, "Icon", $$Icon, { "name": imageObject, "class": "mx-3 h-10 w-10 transform transition duration-300 hover:text-color-red focus:text-color-red" })} <div class="ml-4"> <p class="font-sm mb-1 uppercase leading-snug tracking-[2px] text-white"> ${orgName} </p> <p class="text-xs text-white">${position}</p> </div> </div> <div class="w-32"> <p class="text-xs text-white">${tenure}</p> </div> </li>`;
}, "/Users/vivek/Desktop/self/myPortfolio/src/components/ListItem.astro", void 0);

const $$TechStackMain = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${maybeRenderHead()}<h1 class="text-center text-4xl font-bold leading-none tracking-tight">
My Tech Stack
</h1><div class="relative mt-8 flex items-center justify-center"><div class="mx-auto h-[480px] w-[1px] border border-neutral-border"></div><div class="absolute mx-auto h-[1px] w-full max-w-[1130px] border border-neutral-border"></div><div class="absolute mx-auto grid w-full max-w-[1130px] grid-cols-2"><div class="flex h-[200px] w-full items-center justify-center">${renderComponent($$result2, "Card", $$Card, { "cardFooter": "frontend", "cardWidth": "w-[150px] sm:w-[240px] xl:w-[480px]" }, { "default": ($$result3) => renderTemplate`<div class="mx-auto grid grid-cols-2 justify-center sm:flex">${renderComponent($$result3, "Icon", $$Icon, { "name": "react", "class": "svgRotate mx-2 my-1 h-10 w-10 sm:mx-4 sm:my-0" })}${renderComponent($$result3, "Icon", $$Icon, { "name": "remix", "class": "svgRotate mx-2 my-1 h-10 w-10 sm:mx-4 sm:my-0" })}${renderComponent($$result3, "Icon", $$Icon, { "name": "astro_logo_figma", "class": "svgRotate mx-2 my-1 h-10 w-10 sm:mx-4 sm:my-0" })}${renderComponent($$result3, "Icon", $$Icon, { "name": "tailwind", "class": "svgRotate mx-2 my-1 h-10 w-10 sm:mx-4 sm:my-0" })}</div>` })}</div><div class="flex h-[200px] w-full items-center justify-center">${renderComponent($$result2, "Card", $$Card, { "cardFooter": "backend", "cardWidth": "w-[150px] sm:w-[240px] xl:w-[480px]" }, { "default": ($$result3) => renderTemplate`<div class="mx-auto grid grid-cols-2 justify-center sm:flex">${renderComponent($$result3, "Icon", $$Icon, { "name": "nodejs", "class": "svgRotate mx-2 my-1 h-10 w-10 sm:mx-4 sm:my-0" })}${renderComponent($$result3, "Icon", $$Icon, { "name": "mongodb", "class": "svgRotate mx-2 my-1 h-10 w-10 sm:mx-4 sm:my-0" })}${renderComponent($$result3, "Icon", $$Icon, { "name": "mysql", "class": "svgRotate mx-2 my-1 h-10 w-10 sm:mx-4 sm:my-0" })}</div>` })}</div><div class="flex h-[200px] w-full items-center justify-center">${renderComponent($$result2, "Card", $$Card, { "cardFooter": "deployment & CI/CD", "cardWidth": "w-[150px] sm:w-[240px] xl:w-[480px]" }, { "default": ($$result3) => renderTemplate`<div class="mx-auto grid grid-cols-2 justify-center sm:flex">${renderComponent($$result3, "Icon", $$Icon, { "name": "gitlab", "class": "svgRotate mx-2 my-1 h-10 w-10 sm:mx-4 sm:my-0" })}${renderComponent($$result3, "Icon", $$Icon, { "name": "railway", "class": "svgRotate mx-2 my-1 h-10 w-10 sm:mx-4 sm:my-0" })}${renderComponent($$result3, "Icon", $$Icon, { "name": "github-mark-white", "class": "svgRotate mx-2 my-1 h-10 w-10 sm:mx-4 sm:my-0" })}${renderComponent($$result3, "Icon", $$Icon, { "name": "vercel", "class": "svgRotate mx-2 my-1 h-10 w-10 sm:mx-4 sm:my-0" })}</div>` })}</div><div class="flex h-[200px] w-full items-center justify-center">${renderComponent($$result2, "Card", $$Card, { "cardFooter": "notes & ideation \u{1F4A1}", "cardWidth": "w-[150px] sm:w-[240px] xl:w-[480px]" }, { "default": ($$result3) => renderTemplate`<div class="mx-auto grid grid-cols-2 justify-center sm:flex">${renderComponent($$result3, "Icon", $$Icon, { "name": "notion", "class": "svgRotate mx-2 my-1 h-10 w-10 sm:mx-4 sm:my-0" })}${renderComponent($$result3, "Icon", $$Icon, { "name": "excalidraw", "class": "svgRotate mx-2 my-1 h-10 w-10 sm:mx-4 sm:my-0" })}</div>` })}</div></div></div>` })}`;
}, "/Users/vivek/Desktop/self/myPortfolio/src/components/TechStackMain.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "pageTitle": "viveks portfolio homepage" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="section-1 relative min-h-screen w-full snap-start pt-20 md:min-h-fit md:pt-32"> <div class="mb-24 flex flex-col lg:flex-row lg:justify-between"> <div class="order-2 max-w-2xl lg:order-1"> <div> <h1 class="letters mt-10 cursor-pointer text-header font-bold leading-none tracking-tight xl:mt-0">
Hi there,<br class="block sm:hidden"> I&apos;m <br class="hidden sm:block"> <div class="hidden md:block"> <span class="letters__one -mr-[12px] hidden md:inline-block">V</span> <span class="letters__two -mr-[12px] hidden md:inline-block">i</span> <span class="letters__three -mr-[12px] hidden md:inline-block">v</span> <span class="letters__four -mr-[12px] hidden md:inline-block">e</span> <span class="letters__five -mr-[12px] hidden md:inline-block">k</span> <span class="letters__five -mr-[12px] hidden md:inline-block">&nbsp;</span> <span class="letters__six -mr-[12px] hidden md:inline-block">L</span> <span class="letters__seven -mr-[12px] hidden md:inline-block">o</span> <span class="letters__eight -mr-[12px] hidden md:inline-block">k</span> <span class="letters__nine -mr-[12px] hidden md:inline-block">h</span> <span class="letters__ten -mr-[12px] hidden md:inline-block">a</span> <span class="letters__eleven -mr-[12px] hidden md:inline-block">n</span> <span class="letters__twelve -mr-[12px] hidden md:inline-block">d</span> <span class="letters__thirteen hidden md:inline-block">e</span> <span>.</span> </div> <span class="block md:hidden">Vivek Lokhande.</span> </h1> <p class="mt-10">
I like tinkering with open source. Experimenting with new
            frameworks.
<br class="hidden lg:block"> Lately getting interested in creating
            useful products which
<br class="hidden lg:block"> people can use.On my journey to become
            a fullstack dev.
</p> </div> <div class="mt-20 flex flex-col gap-4 px-4 sm:flex-row md:px-0"> ${renderComponent($$result2, "ButtonPrimary", $$ButtonPrimary, { "value": "Read my blogs", "href": "/blogs" })} ${renderComponent($$result2, "ButtonSecondary", $$ButtonSecondary, { "value": "Resume", "href": "https://flowcv.com/resume/sn0nv3i4u3" })} </div> </div> <div class="imageCard group relative order-1 w-fit lg:order-2"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "circle", "class": "h-[150px] w-[150px] animate-spin-slow group-hover:animate-spin lg:h-[340px] lg:w-[340px]" })} ${renderComponent($$result2, "Image", $$Image, { "loading": "eager", "src": MyImage, "alt": "my picture", "class": "imageCard__image absolute left-2 top-2.5 h-[132px] w-[132px] cursor-pointer opacity-0 ease-in-out lg:left-5 lg:top-5 lg:h-[300px] lg:w-[300px]" })} </div> </div> <div class="item mb-24 hidden flex-col gap-8 lg:flex-row xl:flex xl:justify-between"> ${renderComponent($$result2, "Card", $$Card, { "cardTitle": "About Me", "cardWidth": "xl:basis-2/3 basis-full", "cardHeight": "" }, { "default": ($$result3) => renderTemplate` <p class="mt-4 tracking-tight">
Hi there, I am Vivek, I am passionate about <strong>OSS</strong> and writing
          clean code.
</p> <p class="mt-4 tracking-tight">
My journey started as an engineer from a non-core background. I have
          transitioned into a <strong>CS</strong> background through my interest
          in robotics, motion graphics, video editing, programming, and now I work
          as an <strong>SWE</strong>.
</p> <p class="mt-4 tracking-tight">
I have completed my undergrad from Pune University. Most of the things
          I build or learn are still driven by my curiosity. I love talking
          about frontend development and attend various tech events where I gain
          more insights and get to interact with like-minded folks.
</p> <p class="mt-4 tracking-tight">
Feel free to reach out if you'd like to discuss anything related to
          frontend development, open-source projects, or just have a friendly
          chat about tech!
</p> ` })} ${renderComponent($$result2, "Card", $$Card, { "cardTitle": "Experience", "cardWidth": "basis-full w-full xl:basis-1/3", "cardHeight": "" }, { "default": ($$result3) => renderTemplate` <ul> ${renderComponent($$result3, "ListItem", $$ListItem, { "imageObject": "browserstack", "orgName": "BrowserStack", "position": "software engineer", "tenure": "March 2024 \u2010 Present" })} ${renderComponent($$result3, "ListItem", $$ListItem, { "imageObject": "geekyants_logo", "orgName": "GEEKYANTS", "position": "software engineer-III", "tenure": "Dec 2023 \u2010 March 2024" })} ${renderComponent($$result3, "ListItem", $$ListItem, { "imageObject": "geekyants_logo", "orgName": "GEEKYANTS", "position": "software engineer-II", "tenure": "Aug 2022 \u2010 Dec 2023" })} ${renderComponent($$result3, "ListItem", $$ListItem, { "imageObject": "geekyants_logo", "orgName": "GEEKYANTS", "position": "software engineer-I", "tenure": "Aug 2021 \u2010 Aug 2022" })} ${renderComponent($$result3, "ListItem", $$ListItem, { "imageObject": "geekyants_logo", "orgName": "Biencaps", "position": "motion graphics designer", "tenure": "June 2020 - Aug 2020" })} </ul> ` })} </div> </section> <section class="item mb-24 flex min-h-screen snap-start flex-col items-center justify-center gap-8 md:min-h-fit md:items-baseline lg:flex-row xl:hidden xl:justify-between"> ${renderComponent($$result2, "Card", $$Card, { "cardTitle": "About Me", "cardWidth": "xl:basis-2/3 basis-full", "cardHeight": "" }, { "default": ($$result3) => renderTemplate` <p class="mt-4 tracking-tight">
Hi there, I am vivek, I am passionate about OSS and writing clean code.
</p> <p class="mt-4 tracking-tight">
My journey started as a engineer from a non-core background. I have
        transitioned into a CS background through my interest in robotics,
        motion graphics, video editing, programming, and now I work as a SWE.
</p> <p class="mt-4 tracking-tight">
I have completed my undergrad from Pune University.Most of the things I
        build or learn is still driven by my curiosity. I love talking about
        frontend development and attend various tech events where I gain more
        insights and get to interact with like minded folks.
</p> <p class="mt-4 tracking-tight">
Feel free to reach out if you'd like to discuss anything related to
        frontend development, open-source projects, or just have a friendly chat
        about tech!
</p> ` })} ${renderComponent($$result2, "Card", $$Card, { "cardTitle": "Experience", "cardWidth": "basis-full w-full xl:basis-1/3", "cardHeight": "h-full" }, { "default": ($$result3) => renderTemplate` <ul> ${renderComponent($$result3, "ListItem", $$ListItem, { "imageObject": "browserstack", "orgName": "BROWSERSTACK", "position": "software engineer", "tenure": "Mar 2024 \u2010 Present" })} ${renderComponent($$result3, "ListItem", $$ListItem, { "imageObject": "geekyants_logo", "orgName": "GEEKYANTS", "position": "software engineer-III", "tenure": "Dec 2023 \u2010 Mar 2024" })} ${renderComponent($$result3, "ListItem", $$ListItem, { "imageObject": "geekyants_logo", "orgName": "GEEKYANTS", "position": "software engineer-II", "tenure": "Aug 2022 \u2010 Dec 2023" })} ${renderComponent($$result3, "ListItem", $$ListItem, { "imageObject": "geekyants_logo", "orgName": "GEEKYANTS", "position": "software engineer-I", "tenure": "Aug 2021 \u2010 Aug 2022" })} ${renderComponent($$result3, "ListItem", $$ListItem, { "imageObject": "biencaps_logo", "orgName": "Biencaps", "position": "motion graphics designer", "tenure": "June 2020 - Aug 2020" })} </ul> ` })} </section> <section class="section-2 relative mb-32 mt-20 w-full snap-start"> ${renderComponent($$result2, "TechStackMain", $$TechStackMain, {})} </section> ` })} ${renderScript($$result, "/Users/vivek/Desktop/self/myPortfolio/src/pages/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/vivek/Desktop/self/myPortfolio/src/pages/index.astro", void 0);

const $$file = "/Users/vivek/Desktop/self/myPortfolio/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
	__proto__: null,
	default: $$Index,
	file: $$file,
	url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
