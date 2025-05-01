globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createComponent, r as renderComponent, a as renderScript, b as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_QlrBW5xk.mjs';
/* empty css                                 */
import { $ as $$BaseLayout } from '../chunks/BaseLayout_A4ggbcpe.mjs';
export { renderers } from '../renderers.mjs';

const $$404 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "pageTitle": "404 page" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="section-1 relative flex min-h-screen w-full snap-start pt-20 md:min-h-fit md:pt-32"> <p class="m-auto px-3 font-semibold">
This page is still work in progress...
</p> </section> ` })} ${renderScript($$result, "/Users/vivek/Desktop/self/myPortfolio/src/pages/404.astro?astro&type=script&index=0&lang.ts")}`;
}, "/Users/vivek/Desktop/self/myPortfolio/src/pages/404.astro", void 0);

const $$file = "/Users/vivek/Desktop/self/myPortfolio/src/pages/404.astro";
const $$url = "/404";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$404,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
