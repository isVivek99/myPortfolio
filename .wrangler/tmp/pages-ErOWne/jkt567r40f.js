// <define:__ROUTES__>
var define_ROUTES_default = {
  version: 1,
  include: [
    "/*"
  ],
  exclude: [
    "/_astro/*",
    "/fonts/*",
    "/blogs/classes-in-js",
    "/blogs/this-bind-arrow-fns-js",
    "/blogs/prototypical-inheritance-js",
    "/blogs/reducing-bundle-size-in-react",
    "/blogs/remix-better-forms-for-better-ux-and-dx"
  ]
};

// node_modules/.pnpm/wrangler@4.13.2_@cloudflare+workers-types@4.20250430.0/node_modules/wrangler/templates/pages-dev-pipeline.ts
import worker from "/Users/vivek/Desktop/self/myPortfolio/.wrangler/tmp/pages-ErOWne/bundledWorker-0.47445462357112755.mjs";
import { isRoutingRuleMatch } from "/Users/vivek/Desktop/self/myPortfolio/node_modules/.pnpm/wrangler@4.13.2_@cloudflare+workers-types@4.20250430.0/node_modules/wrangler/templates/pages-dev-util.ts";
export * from "/Users/vivek/Desktop/self/myPortfolio/.wrangler/tmp/pages-ErOWne/bundledWorker-0.47445462357112755.mjs";
var routes = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env, context) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env.ASSETS.fetch(request);
      }
    }
    for (const include of routes.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        const workerAsHandler = worker;
        if (workerAsHandler.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return workerAsHandler.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};
export {
  pages_dev_pipeline_default as default
};
//# sourceMappingURL=jkt567r40f.js.map
