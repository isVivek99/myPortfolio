globalThis.process ??= {}; globalThis.process.env ??= {};
import { z as decodeKey } from './chunks/astro/server_QlrBW5xk.mjs';
import './chunks/astro-designed-error-pages_C4pJJTiQ.mjs';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/noop-middleware_Cnd2MIX_.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/vivek/Desktop/self/myPortfolio/","cacheDir":"file:///Users/vivek/Desktop/self/myPortfolio/node_modules/.astro/","outDir":"file:///Users/vivek/Desktop/self/myPortfolio/dist/","srcDir":"file:///Users/vivek/Desktop/self/myPortfolio/src/","publicDir":"file:///Users/vivek/Desktop/self/myPortfolio/public/","buildClientDir":"file:///Users/vivek/Desktop/self/myPortfolio/dist/","buildServerDir":"file:///Users/vivek/Desktop/self/myPortfolio/dist/_worker.js/","adapterName":"@astrojs/cloudflare","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/.pnpm/@astrojs+cloudflare@12.5.2_@types+node@22.15.3_astro@5.7.4_@netlify+blobs@8.2.0_@types+_e74d27dc494c79ee059327101ff7c4eb/node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/blogs.ZVuX1xv6.css"}],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/blogs.ZVuX1xv6.css"}],"routeData":{"route":"/blogs","isIndex":false,"type":"page","pattern":"^\\/blogs\\/?$","segments":[[{"content":"blogs","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/blogs.astro","pathname":"/blogs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/blogs.ZVuX1xv6.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["/Users/vivek/Desktop/self/myPortfolio/src/pages/blogs.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/blogs@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["/Users/vivek/Desktop/self/myPortfolio/src/pages/blogs/[slug].astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/blogs/[slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["/Users/vivek/Desktop/self/myPortfolio/src/pages/404.astro",{"propagation":"none","containsHead":true}],["/Users/vivek/Desktop/self/myPortfolio/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astro-page:node_modules/.pnpm/@astrojs+cloudflare@12.5.2_@types+node@22.15.3_astro@5.7.4_@netlify+blobs@8.2.0_@types+_e74d27dc494c79ee059327101ff7c4eb/node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/404@_@astro":"pages/404.astro.mjs","\u0000@astro-page:src/pages/blogs/[slug]@_@astro":"pages/blogs/_slug_.astro.mjs","\u0000@astro-page:src/pages/blogs@_@astro":"pages/blogs.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"index.js","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_DLhqOebB.mjs","/Users/vivek/Desktop/self/myPortfolio/node_modules/.pnpm/unstorage@1.16.0_@netlify+blobs@8.2.0/node_modules/unstorage/drivers/cloudflare-kv-binding.mjs":"chunks/cloudflare-kv-binding_DMly_2Gl.mjs","/Users/vivek/Desktop/self/myPortfolio/.astro/content-assets.mjs":"chunks/content-assets_Lo7R-q0t.mjs","/Users/vivek/Desktop/self/myPortfolio/.astro/content-modules.mjs":"chunks/content-modules_Bvq7llv8.mjs","/Users/vivek/Desktop/self/myPortfolio/node_modules/.pnpm/astro@5.7.4_@netlify+blobs@8.2.0_@types+node@22.15.3_jiti@1.21.7_rollup@4.40.1_typescript@5.8.3_yaml@2.7.1/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_CSSE_8-f.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_zvctE0gs.mjs","/Users/vivek/Desktop/self/myPortfolio/src/pages/404.astro?astro&type=script&index=0&lang.ts":"_astro/404.astro_astro_type_script_index_0_lang.l0sNRNKZ.js","/Users/vivek/Desktop/self/myPortfolio/src/components/NavbarMobile.astro?astro&type=script&index=0&lang.ts":"_astro/NavbarMobile.astro_astro_type_script_index_0_lang.CYMelti3.js","/Users/vivek/Desktop/self/myPortfolio/src/pages/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.Ci2KRMwk.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/Users/vivek/Desktop/self/myPortfolio/src/pages/404.astro?astro&type=script&index=0&lang.ts",""],["/Users/vivek/Desktop/self/myPortfolio/src/components/NavbarMobile.astro?astro&type=script&index=0&lang.ts","const e=document.querySelector(\".overlay\"),a=document.querySelector(\".menu\"),s=document.querySelector(\".nav-links\");a.addEventListener(\"click\",t=>{s.classList.toggle(\"hidden\"),t.stopPropagation(),s.classList.contains(\"hidden\")?(e.classList.remove(\"bg-black/60\"),e.classList.remove(\"pointer-events-auto\"),e.classList.remove(\"md:pointer-events-none\"),e.classList.add(\"pointer-events-none\")):(e.classList.add(\"bg-black/60\"),e.classList.add(\"pointer-events-auto\"),e.classList.add(\"md:pointer-events-none\"))});e.addEventListener(\"click\",t=>{const n=t.relatedTarget;s.contains(n)||(s.classList.add(\"hidden\"),e.classList.remove(\"bg-black/60\"),e.classList.remove(\"pointer-events-auto\"),e.classList.remove(\"md:pointer-events-none\"),e.classList.add(\"pointer-events-none\"))});"]],"assets":["/_astro/myImage.CA8fuqj9.png","/_astro/myImage-2.BmXx2IYx.jpg","/_astro/myGradient.QSScO5Tz.jpeg","/_astro/img-1.Dji-5EKx.jpeg","/_astro/cover-4.Bvr2iquK.svg","/_astro/img-4.cLFh3ago.png","/_astro/img-3.CBpCP0OL.png","/_astro/img-3.OyDLVPms.png","/_astro/img-2.XZm3Ra8g.png","/_astro/img-2.BYW8UHPp.png","/_astro/img-1.B9FylZgI.jpeg","/_astro/img-5.yQM2O3Xv.png","/_astro/img-4.CLFfm2wk.png","/_astro/img-3.CD_xLwhH.png","/_astro/img-1.BuHQZ9dy.jpeg","/_astro/img-7.lGnH6BvX.png","/_astro/cover-3.DUSvsGXI.svg","/_astro/img-2.Cb_neWDX.png","/_astro/img-5._pFz6TsE.png","/_astro/cover-5.Dwz0KzzU.svg","/_astro/img-8.CGDQjGyO.png","/_astro/img-9.DFrma0PD.webp","/_astro/img-6.CEAa-Ied.gif","/_astro/img-3.dD46bTsN.png","/_astro/img-2.DsZnEnE8.webp","/_astro/img-5.CPTcMdp6.webp","/_astro/cover-2.B6gX_Z1C.svg","/_astro/img-4.D6vkjjnC.webp","/_astro/img-4.B-K6LAT2.gif","/_astro/img-9.CAHRrZmY.webp","/_astro/img-1.C8BBGdYj.webp","/_astro/img-7.DM88jFxc.webp","/_astro/img-3.BpraL8Ee.webp","/_astro/img-8.BzygR3tF.webp","/_astro/cover-1.BHmZGZRv.svg","/_astro/blogs.ZVuX1xv6.css","/_astro/index.astro_astro_type_script_index_0_lang.Ci2KRMwk.js","/_worker.js/_@astrojs-ssr-adapter.mjs","/_worker.js/_astro-internal_middleware.mjs","/_worker.js/_noop-actions.mjs","/_worker.js/index.js","/_worker.js/renderers.mjs","/fonts/Inter-Black.ttf","/fonts/Inter-Bold.ttf","/fonts/Inter-ExtraBold.ttf","/fonts/Inter-ExtraLight.ttf","/fonts/Inter-Light.ttf","/fonts/Inter-Medium.ttf","/fonts/Inter-Regular.ttf","/fonts/Inter-SemiBold.ttf","/fonts/Inter-Thin.ttf","/_worker.js/_astro/blogs.ZVuX1xv6.css","/_worker.js/_astro/cover-1.BHmZGZRv.svg","/_worker.js/_astro/cover-2.B6gX_Z1C.svg","/_worker.js/_astro/cover-3.DUSvsGXI.svg","/_worker.js/_astro/cover-4.Bvr2iquK.svg","/_worker.js/_astro/cover-5.Dwz0KzzU.svg","/_worker.js/_astro/img-1.B9FylZgI.jpeg","/_worker.js/_astro/img-1.BuHQZ9dy.jpeg","/_worker.js/_astro/img-1.C8BBGdYj.webp","/_worker.js/_astro/img-1.Dji-5EKx.jpeg","/_worker.js/_astro/img-2.BYW8UHPp.png","/_worker.js/_astro/img-2.Cb_neWDX.png","/_worker.js/_astro/img-2.DsZnEnE8.webp","/_worker.js/_astro/img-2.XZm3Ra8g.png","/_worker.js/_astro/img-3.BpraL8Ee.webp","/_worker.js/_astro/img-3.CBpCP0OL.png","/_worker.js/_astro/img-3.CD_xLwhH.png","/_worker.js/_astro/img-3.OyDLVPms.png","/_worker.js/_astro/img-3.dD46bTsN.png","/_worker.js/_astro/img-4.B-K6LAT2.gif","/_worker.js/_astro/img-4.CLFfm2wk.png","/_worker.js/_astro/img-4.D6vkjjnC.webp","/_worker.js/_astro/img-4.cLFh3ago.png","/_worker.js/_astro/img-5.CPTcMdp6.webp","/_worker.js/_astro/img-5._pFz6TsE.png","/_worker.js/_astro/img-5.yQM2O3Xv.png","/_worker.js/_astro/img-6.CEAa-Ied.gif","/_worker.js/_astro/img-7.DM88jFxc.webp","/_worker.js/_astro/img-7.lGnH6BvX.png","/_worker.js/_astro/img-8.BzygR3tF.webp","/_worker.js/_astro/img-8.CGDQjGyO.png","/_worker.js/_astro/img-9.CAHRrZmY.webp","/_worker.js/_astro/img-9.DFrma0PD.webp","/_worker.js/_astro/myGradient.QSScO5Tz.jpeg","/_worker.js/_astro/myImage-2.BmXx2IYx.jpg","/_worker.js/_astro/myImage.CA8fuqj9.png","/_worker.js/chunks/BaseLayout_B1xBAUFV.mjs","/_worker.js/chunks/UTCDateStringToReadable_DSX-ETDw.mjs","/_worker.js/chunks/_@astrojs-ssr-adapter_Du6eajJj.mjs","/_worker.js/chunks/_astro_assets_B0-JMAFI.mjs","/_worker.js/chunks/_astro_data-layer-content_zvctE0gs.mjs","/_worker.js/chunks/astro-designed-error-pages_C4pJJTiQ.mjs","/_worker.js/chunks/astro_JfxVdTwa.mjs","/_worker.js/chunks/cloudflare-kv-binding_DMly_2Gl.mjs","/_worker.js/chunks/content-assets_Lo7R-q0t.mjs","/_worker.js/chunks/content-modules_Bvq7llv8.mjs","/_worker.js/chunks/index_CxGlcw8S.mjs","/_worker.js/chunks/noop-middleware_Cnd2MIX_.mjs","/_worker.js/chunks/parse_EttCPxrw.mjs","/_worker.js/chunks/path_C-ZOwaTP.mjs","/_worker.js/chunks/sharp_CSSE_8-f.mjs","/_worker.js/pages/404.astro.mjs","/_worker.js/pages/_image.astro.mjs","/_worker.js/pages/blogs.astro.mjs","/_worker.js/pages/index.astro.mjs","/_worker.js/chunks/astro/server_QlrBW5xk.mjs","/_worker.js/pages/blogs/_slug_.astro.mjs"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"J/DwMYLqybdZrvaCrF6ZpTIKRJ1MxMPZRSOdSmz8LUU=","sessionConfig":{"driver":"cloudflare-kv-binding","options":{"binding":"SESSION"}}});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => import('./chunks/cloudflare-kv-binding_DMly_2Gl.mjs');

export { manifest };
