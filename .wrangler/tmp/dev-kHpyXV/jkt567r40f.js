var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// wrangler-modules-watch:wrangler:modules-watch
var init_wrangler_modules_watch = __esm({
  "wrangler-modules-watch:wrangler:modules-watch"() {
    init_modules_watch_stub();
  }
});

// node_modules/.pnpm/wrangler@4.13.2_@cloudflare+workers-types@4.20250430.0/node_modules/wrangler/templates/modules-watch-stub.js
var init_modules_watch_stub = __esm({
  "node_modules/.pnpm/wrangler@4.13.2_@cloudflare+workers-types@4.20250430.0/node_modules/wrangler/templates/modules-watch-stub.js"() {
    init_wrangler_modules_watch();
  }
});

// .wrangler/tmp/pages-ErOWne/chunks/astro/server_QlrBW5xk.mjs
function normalizeLF(code) {
  return code.replace(/\r\n|\r(?!\n)|\n/g, "\n");
}
function codeFrame(src, loc) {
  if (!loc || loc.line === void 0 || loc.column === void 0) {
    return "";
  }
  const lines = normalizeLF(src).split("\n").map((ln) => ln.replace(/\t/g, "  "));
  const visibleLines = [];
  for (let n2 = -2; n2 <= 2; n2++) {
    if (lines[loc.line + n2]) visibleLines.push(loc.line + n2);
  }
  let gutterWidth = 0;
  for (const lineNo of visibleLines) {
    let w = `> ${lineNo}`;
    if (w.length > gutterWidth) gutterWidth = w.length;
  }
  let output = "";
  for (const lineNo of visibleLines) {
    const isFocusedLine = lineNo === loc.line - 1;
    output += isFocusedLine ? "> " : "  ";
    output += `${lineNo + 1} | ${lines[lineNo]}
`;
    if (isFocusedLine)
      output += `${Array.from({ length: gutterWidth }).join(" ")}  | ${Array.from({
        length: loc.column
      }).join(" ")}^
`;
  }
  return output;
}
function validateArgs(args) {
  if (args.length !== 3) return false;
  if (!args[0] || typeof args[0] !== "object") return false;
  return true;
}
function baseCreateComponent(cb, moduleId, propagation) {
  const name = moduleId?.split("/").pop()?.replace(".astro", "") ?? "";
  const fn = /* @__PURE__ */ __name((...args) => {
    if (!validateArgs(args)) {
      throw new AstroError({
        ...InvalidComponentArgs,
        message: InvalidComponentArgs.message(name)
      });
    }
    return cb(...args);
  }, "fn");
  Object.defineProperty(fn, "name", { value: name, writable: false });
  fn.isAstroComponentFactory = true;
  fn.moduleId = moduleId;
  fn.propagation = propagation;
  return fn;
}
function createComponentWithOptions(opts) {
  const cb = baseCreateComponent(opts.factory, opts.moduleId, opts.propagation);
  return cb;
}
function createComponent(arg1, moduleId, propagation) {
  if (typeof arg1 === "function") {
    return baseCreateComponent(arg1, moduleId, propagation);
  } else {
    return createComponentWithOptions(arg1);
  }
}
function createAstroGlobFn() {
  const globHandler = /* @__PURE__ */ __name((importMetaGlobResult) => {
    console.warn(`Astro.glob is deprecated and will be removed in a future major version of Astro.
Use import.meta.glob instead: https://vitejs.dev/guide/features.html#glob-import`);
    if (typeof importMetaGlobResult === "string") {
      throw new AstroError({
        ...AstroGlobUsedOutside,
        message: AstroGlobUsedOutside.message(JSON.stringify(importMetaGlobResult))
      });
    }
    let allEntries = [...Object.values(importMetaGlobResult)];
    if (allEntries.length === 0) {
      throw new AstroError({
        ...AstroGlobNoMatch,
        message: AstroGlobNoMatch.message(JSON.stringify(importMetaGlobResult))
      });
    }
    return Promise.all(allEntries.map((fn) => fn()));
  }, "globHandler");
  return globHandler;
}
function createAstro(site) {
  return {
    // TODO: this is no longer necessary for `Astro.site`
    // but it somehow allows working around caching issues in content collections for some tests
    site: void 0,
    generator: `Astro v${ASTRO_VERSION}`,
    glob: createAstroGlobFn()
  };
}
function init(x, y2) {
  let rgx = new RegExp(`\\x1b\\[${y2}m`, "g");
  let open = `\x1B[${x}m`, close = `\x1B[${y2}m`;
  return function(txt) {
    if (!$.enabled || txt == null) return txt;
    return open + (!!~("" + txt).indexOf(close) ? txt.replace(rgx, close + open) : txt) + close;
  };
}
async function renderEndpoint(mod, context, isPrerendered, logger) {
  const { request, url } = context;
  const method = request.method.toUpperCase();
  let handler = mod[method] ?? mod["ALL"];
  if (!handler && method === "HEAD" && mod["GET"]) {
    handler = mod["GET"];
  }
  if (isPrerendered && !["GET", "HEAD"].includes(method)) {
    logger.warn(
      "router",
      `${url.pathname} ${bold(
        method
      )} requests are not available in static endpoints. Mark this page as server-rendered (\`export const prerender = false;\`) or update your config to \`output: 'server'\` to make all your pages server-rendered by default.`
    );
  }
  if (handler === void 0) {
    logger.warn(
      "router",
      `No API Route handler exists for the method "${method}" for the route "${url.pathname}".
Found handlers: ${Object.keys(mod).map((exp) => JSON.stringify(exp)).join(", ")}
` + ("all" in mod ? `One of the exported handlers is "all" (lowercase), did you mean to export 'ALL'?
` : "")
    );
    return new Response(null, { status: 404 });
  }
  if (typeof handler !== "function") {
    logger.error(
      "router",
      `The route "${url.pathname}" exports a value for the method "${method}", but it is of the type ${typeof handler} instead of a function.`
    );
    return new Response(null, { status: 500 });
  }
  let response = await handler.call(mod, context);
  if (!response || response instanceof Response === false) {
    throw new AstroError(EndpointDidNotReturnAResponse);
  }
  if (REROUTABLE_STATUS_CODES.includes(response.status)) {
    try {
      response.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
    } catch (err) {
      if (err.message?.includes("immutable")) {
        response = new Response(response.body, response);
        response.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
      } else {
        throw err;
      }
    }
  }
  if (method === "HEAD") {
    return new Response(null, response);
  }
  return response;
}
function isPromise(value) {
  return !!value && typeof value === "object" && "then" in value && typeof value.then === "function";
}
async function* streamAsyncIterator(stream) {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return;
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}
function isHTMLString(value) {
  return Object.prototype.toString.call(value) === "[object HTMLString]";
}
function markHTMLBytes(bytes) {
  return new HTMLBytes(bytes);
}
function hasGetReader(obj) {
  return typeof obj.getReader === "function";
}
async function* unescapeChunksAsync(iterable) {
  if (hasGetReader(iterable)) {
    for await (const chunk of streamAsyncIterator(iterable)) {
      yield unescapeHTML(chunk);
    }
  } else {
    for await (const chunk of iterable) {
      yield unescapeHTML(chunk);
    }
  }
}
function* unescapeChunks(iterable) {
  for (const chunk of iterable) {
    yield unescapeHTML(chunk);
  }
}
function unescapeHTML(str) {
  if (!!str && typeof str === "object") {
    if (str instanceof Uint8Array) {
      return markHTMLBytes(str);
    } else if (str instanceof Response && str.body) {
      const body = str.body;
      return unescapeChunksAsync(body);
    } else if (typeof str.then === "function") {
      return Promise.resolve(str).then((value) => {
        return unescapeHTML(value);
      });
    } else if (str[Symbol.for("astro:slot-string")]) {
      return str;
    } else if (Symbol.iterator in str) {
      return unescapeChunks(str);
    } else if (Symbol.asyncIterator in str || hasGetReader(str)) {
      return unescapeChunksAsync(str);
    }
  }
  return markHTMLString(str);
}
function createRenderInstruction(instruction) {
  return Object.defineProperty(instruction, RenderInstructionSymbol, {
    value: true
  });
}
function isRenderInstruction(chunk) {
  return chunk && typeof chunk === "object" && chunk[RenderInstructionSymbol];
}
function r(e2) {
  var t2, f2, n2 = "";
  if ("string" == typeof e2 || "number" == typeof e2) n2 += e2;
  else if ("object" == typeof e2) if (Array.isArray(e2)) {
    var o2 = e2.length;
    for (t2 = 0; t2 < o2; t2++) e2[t2] && (f2 = r(e2[t2])) && (n2 && (n2 += " "), n2 += f2);
  } else for (f2 in e2) e2[f2] && (n2 && (n2 += " "), n2 += f2);
  return n2;
}
function clsx() {
  for (var e2, t2, f2 = 0, n2 = "", o2 = arguments.length; f2 < o2; f2++) (e2 = arguments[f2]) && (t2 = r(e2)) && (n2 && (n2 += " "), n2 += t2);
  return n2;
}
function serializeArray(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = value.map((v) => {
    return convertToSerializedForm(v, metadata, parents);
  });
  parents.delete(value);
  return serialized;
}
function serializeObject(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = Object.fromEntries(
    Object.entries(value).map(([k, v]) => {
      return [k, convertToSerializedForm(v, metadata, parents)];
    })
  );
  parents.delete(value);
  return serialized;
}
function convertToSerializedForm(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  const tag = Object.prototype.toString.call(value);
  switch (tag) {
    case "[object Date]": {
      return [PROP_TYPE.Date, value.toISOString()];
    }
    case "[object RegExp]": {
      return [PROP_TYPE.RegExp, value.source];
    }
    case "[object Map]": {
      return [PROP_TYPE.Map, serializeArray(Array.from(value), metadata, parents)];
    }
    case "[object Set]": {
      return [PROP_TYPE.Set, serializeArray(Array.from(value), metadata, parents)];
    }
    case "[object BigInt]": {
      return [PROP_TYPE.BigInt, value.toString()];
    }
    case "[object URL]": {
      return [PROP_TYPE.URL, value.toString()];
    }
    case "[object Array]": {
      return [PROP_TYPE.JSON, serializeArray(value, metadata, parents)];
    }
    case "[object Uint8Array]": {
      return [PROP_TYPE.Uint8Array, Array.from(value)];
    }
    case "[object Uint16Array]": {
      return [PROP_TYPE.Uint16Array, Array.from(value)];
    }
    case "[object Uint32Array]": {
      return [PROP_TYPE.Uint32Array, Array.from(value)];
    }
    default: {
      if (value !== null && typeof value === "object") {
        return [PROP_TYPE.Value, serializeObject(value, metadata, parents)];
      }
      if (value === Infinity) {
        return [PROP_TYPE.Infinity, 1];
      }
      if (value === -Infinity) {
        return [PROP_TYPE.Infinity, -1];
      }
      if (value === void 0) {
        return [PROP_TYPE.Value];
      }
      return [PROP_TYPE.Value, value];
    }
  }
}
function serializeProps(props, metadata) {
  const serialized = JSON.stringify(serializeObject(props, metadata));
  return serialized;
}
function extractDirectives(inputProps, clientDirectives) {
  let extracted = {
    isPage: false,
    hydration: null,
    props: {},
    propsWithoutTransitionAttributes: {}
  };
  for (const [key, value] of Object.entries(inputProps)) {
    if (key.startsWith("server:")) {
      if (key === "server:root") {
        extracted.isPage = true;
      }
    }
    if (key.startsWith("client:")) {
      if (!extracted.hydration) {
        extracted.hydration = {
          directive: "",
          value: "",
          componentUrl: "",
          componentExport: { value: "" }
        };
      }
      switch (key) {
        case "client:component-path": {
          extracted.hydration.componentUrl = value;
          break;
        }
        case "client:component-export": {
          extracted.hydration.componentExport.value = value;
          break;
        }
        // This is a special prop added to prove that the client hydration method
        // was added statically.
        case "client:component-hydration": {
          break;
        }
        case "client:display-name": {
          break;
        }
        default: {
          extracted.hydration.directive = key.split(":")[1];
          extracted.hydration.value = value;
          if (!clientDirectives.has(extracted.hydration.directive)) {
            const hydrationMethods = Array.from(clientDirectives.keys()).map((d2) => `client:${d2}`).join(", ");
            throw new Error(
              `Error: invalid hydration directive "${key}". Supported hydration methods: ${hydrationMethods}`
            );
          }
          if (extracted.hydration.directive === "media" && typeof extracted.hydration.value !== "string") {
            throw new AstroError(MissingMediaQueryDirective);
          }
          break;
        }
      }
    } else {
      extracted.props[key] = value;
      if (!transitionDirectivesToCopyOnIsland.includes(key)) {
        extracted.propsWithoutTransitionAttributes[key] = value;
      }
    }
  }
  for (const sym of Object.getOwnPropertySymbols(inputProps)) {
    extracted.props[sym] = inputProps[sym];
    extracted.propsWithoutTransitionAttributes[sym] = inputProps[sym];
  }
  return extracted;
}
async function generateHydrateScript(scriptOptions, metadata) {
  const { renderer: renderer2, result, astroId, props, attrs } = scriptOptions;
  const { hydrate, componentUrl, componentExport } = metadata;
  if (!componentExport.value) {
    throw new AstroError({
      ...NoMatchingImport,
      message: NoMatchingImport.message(metadata.displayName)
    });
  }
  const island = {
    children: "",
    props: {
      // This is for HMR, probably can avoid it in prod
      uid: astroId
    }
  };
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      island.props[key] = escapeHTML(value);
    }
  }
  island.props["component-url"] = await result.resolve(decodeURI(componentUrl));
  if (renderer2.clientEntrypoint) {
    island.props["component-export"] = componentExport.value;
    island.props["renderer-url"] = await result.resolve(
      decodeURI(renderer2.clientEntrypoint.toString())
    );
    island.props["props"] = escapeHTML(serializeProps(props, metadata));
  }
  island.props["ssr"] = "";
  island.props["client"] = hydrate;
  let beforeHydrationUrl = await result.resolve("astro:scripts/before-hydration.js");
  if (beforeHydrationUrl.length) {
    island.props["before-hydration-url"] = beforeHydrationUrl;
  }
  island.props["opts"] = escapeHTML(
    JSON.stringify({
      name: metadata.displayName,
      value: metadata.hydrateArgs || ""
    })
  );
  transitionDirectivesToCopyOnIsland.forEach((name) => {
    if (typeof props[name] !== "undefined") {
      island.props[name] = props[name];
    }
  });
  return island;
}
function bitwise(str) {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i2 = 0; i2 < str.length; i2++) {
    const ch = str.charCodeAt(i2);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}
function shorthash(text) {
  let num;
  let result = "";
  let integer = bitwise(text);
  const sign = integer < 0 ? "Z" : "";
  integer = Math.abs(integer);
  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    result = dictionary[num] + result;
  }
  if (integer > 0) {
    result = dictionary[integer] + result;
  }
  return sign + result;
}
function isAstroComponentFactory(obj) {
  return obj == null ? false : obj.isAstroComponentFactory === true;
}
function isAPropagatingComponent(result, factory) {
  let hint = factory.propagation || "none";
  if (factory.moduleId && result.componentMetadata.has(factory.moduleId) && hint === "none") {
    hint = result.componentMetadata.get(factory.moduleId).propagation;
  }
  return hint === "in-tree" || hint === "self";
}
function isHeadAndContent(obj) {
  return typeof obj === "object" && obj !== null && !!obj[headAndContentSym];
}
function createHeadAndContent(head, content) {
  return {
    [headAndContentSym]: true,
    head,
    content
  };
}
function determineIfNeedsHydrationScript(result) {
  if (result._metadata.hasHydrationScript) {
    return false;
  }
  return result._metadata.hasHydrationScript = true;
}
function determinesIfNeedsDirectiveScript(result, directive) {
  if (result._metadata.hasDirectives.has(directive)) {
    return false;
  }
  result._metadata.hasDirectives.add(directive);
  return true;
}
function getDirectiveScriptText(result, directive) {
  const clientDirectives = result.clientDirectives;
  const clientDirective = clientDirectives.get(directive);
  if (!clientDirective) {
    throw new Error(`Unknown directive: ${directive}`);
  }
  return clientDirective;
}
function getPrescripts(result, type, directive) {
  switch (type) {
    case "both":
      return `${ISLAND_STYLES}<script>${getDirectiveScriptText(result, directive)};${astro_island_prebuilt_default}<\/script>`;
    case "directive":
      return `<script>${getDirectiveScriptText(result, directive)}<\/script>`;
  }
  return "";
}
function defineScriptVars(vars) {
  let output = "";
  for (const [key, value] of Object.entries(vars)) {
    output += `const ${toIdent(key)} = ${JSON.stringify(value)?.replace(
      /<\/script>/g,
      "\\x3C/script>"
    )};
`;
  }
  return markHTMLString(output);
}
function formatList(values) {
  if (values.length === 1) {
    return values[0];
  }
  return `${values.slice(0, -1).join(", ")} or ${values[values.length - 1]}`;
}
function addAttribute(value, key, shouldEscape = true) {
  if (value == null) {
    return "";
  }
  if (STATIC_DIRECTIVES.has(key)) {
    console.warn(`[astro] The "${key}" directive cannot be applied dynamically at runtime. It will not be rendered as an attribute.

Make sure to use the static attribute syntax (\`${key}={value}\`) instead of the dynamic spread syntax (\`{...{ "${key}": value }}\`).`);
    return "";
  }
  if (key === "class:list") {
    const listValue = toAttributeString(clsx(value), shouldEscape);
    if (listValue === "") {
      return "";
    }
    return markHTMLString(` ${key.slice(0, -5)}="${listValue}"`);
  }
  if (key === "style" && !(value instanceof HTMLString)) {
    if (Array.isArray(value) && value.length === 2) {
      return markHTMLString(
        ` ${key}="${toAttributeString(`${toStyleString(value[0])};${value[1]}`, shouldEscape)}"`
      );
    }
    if (typeof value === "object") {
      return markHTMLString(` ${key}="${toAttributeString(toStyleString(value), shouldEscape)}"`);
    }
  }
  if (key === "className") {
    return markHTMLString(` class="${toAttributeString(value, shouldEscape)}"`);
  }
  if (typeof value === "string" && value.includes("&") && isHttpUrl(value)) {
    return markHTMLString(` ${key}="${toAttributeString(value, false)}"`);
  }
  if (htmlBooleanAttributes.test(key)) {
    return markHTMLString(value ? ` ${key}` : "");
  }
  if (value === "") {
    return markHTMLString(` ${key}`);
  }
  return markHTMLString(` ${key}="${toAttributeString(value, shouldEscape)}"`);
}
function internalSpreadAttributes(values, shouldEscape = true) {
  let output = "";
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, shouldEscape);
  }
  return markHTMLString(output);
}
function renderElement$1(name, { props: _props, children = "" }, shouldEscape = true) {
  const { lang: _, "data-astro-id": astroId, "define:vars": defineVars, ...props } = _props;
  if (defineVars) {
    if (name === "style") {
      delete props["is:global"];
      delete props["is:scoped"];
    }
    if (name === "script") {
      delete props.hoist;
      children = defineScriptVars(defineVars) + "\n" + children;
    }
  }
  if ((children == null || children == "") && voidElementNames.test(name)) {
    return `<${name}${internalSpreadAttributes(props, shouldEscape)}>`;
  }
  return `<${name}${internalSpreadAttributes(props, shouldEscape)}>${children}</${name}>`;
}
function createBufferedRenderer(destination, renderFunction) {
  return new BufferedRenderer(destination, renderFunction);
}
function promiseWithResolvers() {
  let resolve, reject;
  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  return {
    promise,
    resolve,
    reject
  };
}
function isHttpUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return VALID_PROTOCOLS.includes(parsedUrl.protocol);
  } catch {
    return false;
  }
}
function renderAllHeadContent(result) {
  result._metadata.hasRenderedHead = true;
  const styles = Array.from(result.styles).filter(uniqueElements).map(
    (style) => style.props.rel === "stylesheet" ? renderElement$1("link", style) : renderElement$1("style", style)
  );
  result.styles.clear();
  const scripts = Array.from(result.scripts).filter(uniqueElements).map((script) => {
    if (result.userAssetsBase) {
      script.props.src = (result.base === "/" ? "" : result.base) + result.userAssetsBase + script.props.src;
    }
    return renderElement$1("script", script, false);
  });
  const links = Array.from(result.links).filter(uniqueElements).map((link) => renderElement$1("link", link, false));
  let content = styles.join("\n") + links.join("\n") + scripts.join("\n");
  if (result._metadata.extraHead.length > 0) {
    for (const part of result._metadata.extraHead) {
      content += part;
    }
  }
  return markHTMLString(content);
}
function renderHead() {
  return createRenderInstruction({ type: "head" });
}
function maybeRenderHead() {
  return createRenderInstruction({ type: "maybe-head" });
}
function encodeHexUpperCase(data) {
  let result = "";
  for (let i2 = 0; i2 < data.length; i2++) {
    result += alphabetUpperCase[data[i2] >> 4];
    result += alphabetUpperCase[data[i2] & 15];
  }
  return result;
}
function decodeHex(data) {
  if (data.length % 2 !== 0) {
    throw new Error("Invalid hex string");
  }
  const result = new Uint8Array(data.length / 2);
  for (let i2 = 0; i2 < data.length; i2 += 2) {
    if (!(data[i2] in decodeMap)) {
      throw new Error("Invalid character");
    }
    if (!(data[i2 + 1] in decodeMap)) {
      throw new Error("Invalid character");
    }
    result[i2 / 2] |= decodeMap[data[i2]] << 4;
    result[i2 / 2] |= decodeMap[data[i2 + 1]];
  }
  return result;
}
function encodeBase64(bytes) {
  return encodeBase64_internal(bytes, base64Alphabet, EncodingPadding.Include);
}
function encodeBase64_internal(bytes, alphabet, padding) {
  let result = "";
  for (let i2 = 0; i2 < bytes.byteLength; i2 += 3) {
    let buffer = 0;
    let bufferBitSize = 0;
    for (let j2 = 0; j2 < 3 && i2 + j2 < bytes.byteLength; j2++) {
      buffer = buffer << 8 | bytes[i2 + j2];
      bufferBitSize += 8;
    }
    for (let j2 = 0; j2 < 4; j2++) {
      if (bufferBitSize >= 6) {
        result += alphabet[buffer >> bufferBitSize - 6 & 63];
        bufferBitSize -= 6;
      } else if (bufferBitSize > 0) {
        result += alphabet[buffer << 6 - bufferBitSize & 63];
        bufferBitSize = 0;
      } else if (padding === EncodingPadding.Include) {
        result += "=";
      }
    }
  }
  return result;
}
function decodeBase64(encoded) {
  return decodeBase64_internal(encoded, base64DecodeMap, DecodingPadding.Required);
}
function decodeBase64_internal(encoded, decodeMap2, padding) {
  const result = new Uint8Array(Math.ceil(encoded.length / 4) * 3);
  let totalBytes = 0;
  for (let i2 = 0; i2 < encoded.length; i2 += 4) {
    let chunk = 0;
    let bitsRead = 0;
    for (let j2 = 0; j2 < 4; j2++) {
      if (padding === DecodingPadding.Required && encoded[i2 + j2] === "=") {
        continue;
      }
      if (padding === DecodingPadding.Ignore && (i2 + j2 >= encoded.length || encoded[i2 + j2] === "=")) {
        continue;
      }
      if (j2 > 0 && encoded[i2 + j2 - 1] === "=") {
        throw new Error("Invalid padding");
      }
      if (!(encoded[i2 + j2] in decodeMap2)) {
        throw new Error("Invalid character");
      }
      chunk |= decodeMap2[encoded[i2 + j2]] << (3 - j2) * 6;
      bitsRead += 6;
    }
    if (bitsRead < 24) {
      let unused;
      if (bitsRead === 12) {
        unused = chunk & 65535;
      } else if (bitsRead === 18) {
        unused = chunk & 255;
      } else {
        throw new Error("Invalid padding");
      }
      if (unused !== 0) {
        throw new Error("Invalid padding");
      }
    }
    const byteLength = Math.floor(bitsRead / 8);
    for (let i3 = 0; i3 < byteLength; i3++) {
      result[totalBytes] = chunk >> 16 - i3 * 8 & 255;
      totalBytes++;
    }
  }
  return result.slice(0, totalBytes);
}
async function decodeKey(encoded) {
  const bytes = decodeBase64(encoded);
  return crypto.subtle.importKey("raw", bytes, ALGORITHM, true, ["encrypt", "decrypt"]);
}
async function encryptString(key, raw) {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH / 2));
  const data = encoder$1.encode(raw);
  const buffer = await crypto.subtle.encrypt(
    {
      name: ALGORITHM,
      iv
    },
    key,
    data
  );
  return encodeHexUpperCase(iv) + encodeBase64(new Uint8Array(buffer));
}
async function decryptString(key, encoded) {
  const iv = decodeHex(encoded.slice(0, IV_LENGTH));
  const dataArray = decodeBase64(encoded.slice(IV_LENGTH));
  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: ALGORITHM,
      iv
    },
    key,
    dataArray
  );
  const decryptedString = decoder$1.decode(decryptedBuffer);
  return decryptedString;
}
function isRenderTemplateResult(obj) {
  return typeof obj === "object" && obj !== null && !!obj[renderTemplateResultSym];
}
function renderTemplate(htmlParts, ...expressions) {
  return new RenderTemplateResult(htmlParts, expressions);
}
function isSlotString(str) {
  return !!str[slotString];
}
function renderSlot(result, slotted, fallback) {
  if (!slotted && fallback) {
    return renderSlot(result, fallback);
  }
  return {
    async render(destination) {
      await renderChild(destination, typeof slotted === "function" ? slotted(result) : slotted);
    }
  };
}
async function renderSlotToString(result, slotted, fallback) {
  let content = "";
  let instructions = null;
  const temporaryDestination = {
    write(chunk) {
      if (chunk instanceof SlotString) {
        content += chunk;
        if (chunk.instructions) {
          instructions ??= [];
          instructions.push(...chunk.instructions);
        }
      } else if (chunk instanceof Response) return;
      else if (typeof chunk === "object" && "type" in chunk && typeof chunk.type === "string") {
        if (instructions === null) {
          instructions = [];
        }
        instructions.push(chunk);
      } else {
        content += chunkToString(result, chunk);
      }
    }
  };
  const renderInstance = renderSlot(result, slotted, fallback);
  await renderInstance.render(temporaryDestination);
  return markHTMLString(new SlotString(content, instructions));
}
async function renderSlots(result, slots = {}) {
  let slotInstructions = null;
  let children = {};
  if (slots) {
    await Promise.all(
      Object.entries(slots).map(
        ([key, value]) => renderSlotToString(result, value).then((output) => {
          if (output.instructions) {
            if (slotInstructions === null) {
              slotInstructions = [];
            }
            slotInstructions.push(...output.instructions);
          }
          children[key] = output;
        })
      )
    );
  }
  return { slotInstructions, children };
}
function createSlotValueFromString(content) {
  return function() {
    return renderTemplate`${unescapeHTML(content)}`;
  };
}
function containsServerDirective(props) {
  return "server:component-directive" in props;
}
function safeJsonStringify(obj) {
  return JSON.stringify(obj).replace(SCRIPT_RE, SCRIPT_REPLACER).replace(COMMENT_RE, COMMENT_REPLACER);
}
function createSearchParams(componentExport, encryptedProps, slots) {
  const params = new URLSearchParams();
  params.set("e", componentExport);
  params.set("p", encryptedProps);
  params.set("s", slots);
  return params;
}
function isWithinURLLimit(pathname, params) {
  const url = pathname + "?" + params.toString();
  const chars = url.length;
  return chars < 2048;
}
function renderServerIsland(result, _displayName, props, slots) {
  return {
    async render(destination) {
      const componentPath = props["server:component-path"];
      const componentExport = props["server:component-export"];
      const componentId = result.serverIslandNameMap.get(componentPath);
      if (!componentId) {
        throw new Error(`Could not find server component name`);
      }
      for (const key2 of Object.keys(props)) {
        if (internalProps.has(key2)) {
          delete props[key2];
        }
      }
      destination.write(createRenderInstruction({ type: "server-island-runtime" }));
      destination.write("<!--[if astro]>server-island-start<![endif]-->");
      const renderedSlots = {};
      for (const name in slots) {
        if (name !== "fallback") {
          const content = await renderSlotToString(result, slots[name]);
          renderedSlots[name] = content.toString();
        } else {
          await renderChild(destination, slots.fallback(result));
        }
      }
      const key = await result.key;
      const propsEncrypted = Object.keys(props).length === 0 ? "" : await encryptString(key, JSON.stringify(props));
      const hostId = crypto.randomUUID();
      const slash2 = result.base.endsWith("/") ? "" : "/";
      let serverIslandUrl = `${result.base}${slash2}_server-islands/${componentId}${result.trailingSlash === "always" ? "/" : ""}`;
      const potentialSearchParams = createSearchParams(
        componentExport,
        propsEncrypted,
        safeJsonStringify(renderedSlots)
      );
      const useGETRequest = isWithinURLLimit(serverIslandUrl, potentialSearchParams);
      if (useGETRequest) {
        serverIslandUrl += "?" + potentialSearchParams.toString();
        destination.write(
          `<link rel="preload" as="fetch" href="${serverIslandUrl}" crossorigin="anonymous">`
        );
      }
      destination.write(`<script type="module" data-astro-rerun data-island-id="${hostId}">${useGETRequest ? (
        // GET request
        `let response = await fetch('${serverIslandUrl}');`
      ) : (
        // POST request
        `let data = {
	componentExport: ${safeJsonStringify(componentExport)},
	encryptedProps: ${safeJsonStringify(propsEncrypted)},
	slots: ${safeJsonStringify(renderedSlots)},
};
let response = await fetch('${serverIslandUrl}', {
	method: 'POST',
	body: JSON.stringify(data),
});`
      )}
replaceServerIsland('${hostId}', response);<\/script>`);
    }
  };
}
function stringifyChunk(result, chunk) {
  if (isRenderInstruction(chunk)) {
    const instruction = chunk;
    switch (instruction.type) {
      case "directive": {
        const { hydration } = instruction;
        let needsHydrationScript = hydration && determineIfNeedsHydrationScript(result);
        let needsDirectiveScript = hydration && determinesIfNeedsDirectiveScript(result, hydration.directive);
        let prescriptType = needsHydrationScript ? "both" : needsDirectiveScript ? "directive" : null;
        if (prescriptType) {
          let prescripts = getPrescripts(result, prescriptType, hydration.directive);
          return markHTMLString(prescripts);
        } else {
          return "";
        }
      }
      case "head": {
        if (result._metadata.hasRenderedHead || result.partial) {
          return "";
        }
        return renderAllHeadContent(result);
      }
      case "maybe-head": {
        if (result._metadata.hasRenderedHead || result._metadata.headInTree || result.partial) {
          return "";
        }
        return renderAllHeadContent(result);
      }
      case "renderer-hydration-script": {
        const { rendererSpecificHydrationScripts } = result._metadata;
        const { rendererName } = instruction;
        if (!rendererSpecificHydrationScripts.has(rendererName)) {
          rendererSpecificHydrationScripts.add(rendererName);
          return instruction.render();
        }
        return "";
      }
      case "server-island-runtime": {
        if (result._metadata.hasRenderedServerIslandRuntime) {
          return "";
        }
        result._metadata.hasRenderedServerIslandRuntime = true;
        return renderServerIslandRuntime();
      }
      default: {
        throw new Error(`Unknown chunk type: ${chunk.type}`);
      }
    }
  } else if (chunk instanceof Response) {
    return "";
  } else if (isSlotString(chunk)) {
    let out = "";
    const c2 = chunk;
    if (c2.instructions) {
      for (const instr of c2.instructions) {
        out += stringifyChunk(result, instr);
      }
    }
    out += chunk.toString();
    return out;
  }
  return chunk.toString();
}
function chunkToString(result, chunk) {
  if (ArrayBuffer.isView(chunk)) {
    return decoder.decode(chunk);
  } else {
    return stringifyChunk(result, chunk);
  }
}
function chunkToByteArray(result, chunk) {
  if (ArrayBuffer.isView(chunk)) {
    return chunk;
  } else {
    const stringified = stringifyChunk(result, chunk);
    return encoder.encode(stringified.toString());
  }
}
function isRenderInstance(obj) {
  return !!obj && typeof obj === "object" && "render" in obj && typeof obj.render === "function";
}
function renderChild(destination, child) {
  if (isPromise(child)) {
    return child.then((x) => renderChild(destination, x));
  }
  if (child instanceof SlotString) {
    destination.write(child);
    return;
  }
  if (isHTMLString(child)) {
    destination.write(child);
    return;
  }
  if (Array.isArray(child)) {
    return renderArray(destination, child);
  }
  if (typeof child === "function") {
    return renderChild(destination, child());
  }
  if (!child && child !== 0) {
    return;
  }
  if (typeof child === "string") {
    destination.write(markHTMLString(escapeHTML(child)));
    return;
  }
  if (isRenderInstance(child)) {
    return child.render(destination);
  }
  if (isRenderTemplateResult(child)) {
    return child.render(destination);
  }
  if (isAstroComponentInstance(child)) {
    return child.render(destination);
  }
  if (ArrayBuffer.isView(child)) {
    destination.write(child);
    return;
  }
  if (typeof child === "object" && (Symbol.asyncIterator in child || Symbol.iterator in child)) {
    if (Symbol.asyncIterator in child) {
      return renderAsyncIterable(destination, child);
    }
    return renderIterable(destination, child);
  }
  destination.write(child);
}
function renderArray(destination, children) {
  const flushers = children.map((c2) => {
    return createBufferedRenderer(destination, (bufferDestination) => {
      return renderChild(bufferDestination, c2);
    });
  });
  const iterator = flushers[Symbol.iterator]();
  const iterate = /* @__PURE__ */ __name(() => {
    for (; ; ) {
      const { value: flusher, done } = iterator.next();
      if (done) {
        break;
      }
      const result = flusher.flush();
      if (isPromise(result)) {
        return result.then(iterate);
      }
    }
  }, "iterate");
  return iterate();
}
function renderIterable(destination, children) {
  const iterator = children[Symbol.iterator]();
  const iterate = /* @__PURE__ */ __name(() => {
    for (; ; ) {
      const { value, done } = iterator.next();
      if (done) {
        break;
      }
      const result = renderChild(destination, value);
      if (isPromise(result)) {
        return result.then(iterate);
      }
    }
  }, "iterate");
  return iterate();
}
async function renderAsyncIterable(destination, children) {
  for await (const value of children) {
    await renderChild(destination, value);
  }
}
function validateComponentProps(props, displayName) {
  if (props != null) {
    for (const prop of Object.keys(props)) {
      if (prop.startsWith("client:")) {
        console.warn(
          `You are attempting to render <${displayName} ${prop} />, but ${displayName} is an Astro component. Astro components do not render in the client and should not have a hydration directive. Please use a framework component for client rendering.`
        );
      }
    }
  }
}
function createAstroComponentInstance(result, displayName, factory, props, slots = {}) {
  validateComponentProps(props, displayName);
  const instance = new AstroComponentInstance(result, props, slots, factory);
  if (isAPropagatingComponent(result, factory)) {
    result._metadata.propagators.add(instance);
  }
  return instance;
}
function isAstroComponentInstance(obj) {
  return typeof obj === "object" && obj !== null && !!obj[astroComponentInstanceSym];
}
async function renderToString(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(
    result,
    componentFactory,
    props,
    children,
    route
  );
  if (templateResult instanceof Response) return templateResult;
  let str = "";
  let renderedFirstPageChunk = false;
  if (isPage) {
    await bufferHeadContent(result);
  }
  const destination = {
    write(chunk) {
      if (isPage && !renderedFirstPageChunk) {
        renderedFirstPageChunk = true;
        if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
          const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
          str += doctype;
        }
      }
      if (chunk instanceof Response) return;
      str += chunkToString(result, chunk);
    }
  };
  await templateResult.render(destination);
  return str;
}
async function renderToReadableStream(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(
    result,
    componentFactory,
    props,
    children,
    route
  );
  if (templateResult instanceof Response) return templateResult;
  let renderedFirstPageChunk = false;
  if (isPage) {
    await bufferHeadContent(result);
  }
  return new ReadableStream({
    start(controller) {
      const destination = {
        write(chunk) {
          if (isPage && !renderedFirstPageChunk) {
            renderedFirstPageChunk = true;
            if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
              const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
              controller.enqueue(encoder.encode(doctype));
            }
          }
          if (chunk instanceof Response) {
            throw new AstroError({
              ...ResponseSentError
            });
          }
          const bytes = chunkToByteArray(result, chunk);
          controller.enqueue(bytes);
        }
      };
      (async () => {
        try {
          await templateResult.render(destination);
          controller.close();
        } catch (e2) {
          if (AstroError.is(e2) && !e2.loc) {
            e2.setLocation({
              file: route?.component
            });
          }
          setTimeout(() => controller.error(e2), 0);
        }
      })();
    },
    cancel() {
      result.cancelled = true;
    }
  });
}
async function callComponentAsTemplateResultOrResponse(result, componentFactory, props, children, route) {
  const factoryResult = await componentFactory(result, props, children);
  if (factoryResult instanceof Response) {
    return factoryResult;
  } else if (isHeadAndContent(factoryResult)) {
    if (!isRenderTemplateResult(factoryResult.content)) {
      throw new AstroError({
        ...OnlyResponseCanBeReturned,
        message: OnlyResponseCanBeReturned.message(
          route?.route,
          typeof factoryResult
        ),
        location: {
          file: route?.component
        }
      });
    }
    return factoryResult.content;
  } else if (!isRenderTemplateResult(factoryResult)) {
    throw new AstroError({
      ...OnlyResponseCanBeReturned,
      message: OnlyResponseCanBeReturned.message(route?.route, typeof factoryResult),
      location: {
        file: route?.component
      }
    });
  }
  return factoryResult;
}
async function bufferHeadContent(result) {
  const iterator = result._metadata.propagators.values();
  while (true) {
    const { value, done } = iterator.next();
    if (done) {
      break;
    }
    const returnValue = await value.init(result);
    if (isHeadAndContent(returnValue)) {
      result._metadata.extraHead.push(returnValue.head);
    }
  }
}
async function renderToAsyncIterable(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(
    result,
    componentFactory,
    props,
    children,
    route
  );
  if (templateResult instanceof Response) return templateResult;
  let renderedFirstPageChunk = false;
  if (isPage) {
    await bufferHeadContent(result);
  }
  let error2 = null;
  let next = null;
  const buffer = [];
  let renderingComplete = false;
  const iterator = {
    async next() {
      if (result.cancelled) return { done: true, value: void 0 };
      if (next !== null) {
        await next.promise;
      } else if (!renderingComplete && !buffer.length) {
        next = promiseWithResolvers();
        await next.promise;
      }
      if (!renderingComplete) {
        next = promiseWithResolvers();
      }
      if (error2) {
        throw error2;
      }
      let length = 0;
      for (let i2 = 0, len = buffer.length; i2 < len; i2++) {
        length += buffer[i2].length;
      }
      let mergedArray = new Uint8Array(length);
      let offset = 0;
      for (let i2 = 0, len = buffer.length; i2 < len; i2++) {
        const item = buffer[i2];
        mergedArray.set(item, offset);
        offset += item.length;
      }
      buffer.length = 0;
      const returnValue = {
        // The iterator is done when rendering has finished
        // and there are no more chunks to return.
        done: length === 0 && renderingComplete,
        value: mergedArray
      };
      return returnValue;
    },
    async return() {
      result.cancelled = true;
      return { done: true, value: void 0 };
    }
  };
  const destination = {
    write(chunk) {
      if (isPage && !renderedFirstPageChunk) {
        renderedFirstPageChunk = true;
        if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
          const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
          buffer.push(encoder.encode(doctype));
        }
      }
      if (chunk instanceof Response) {
        throw new AstroError(ResponseSentError);
      }
      const bytes = chunkToByteArray(result, chunk);
      if (bytes.length > 0) {
        buffer.push(bytes);
        next?.resolve();
      } else if (buffer.length > 0) {
        next?.resolve();
      }
    }
  };
  const renderResult = toPromise(() => templateResult.render(destination));
  renderResult.catch((err) => {
    error2 = err;
  }).finally(() => {
    renderingComplete = true;
    next?.resolve();
  });
  return {
    [Symbol.asyncIterator]() {
      return iterator;
    }
  };
}
function toPromise(fn) {
  try {
    const result = fn();
    return isPromise(result) ? result : Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
}
function componentIsHTMLElement(Component) {
  return typeof HTMLElement !== "undefined" && HTMLElement.isPrototypeOf(Component);
}
async function renderHTMLElement(result, constructor, props, slots) {
  const name = getHTMLElementName(constructor);
  let attrHTML = "";
  for (const attr in props) {
    attrHTML += ` ${attr}="${toAttributeString(await props[attr])}"`;
  }
  return markHTMLString(
    `<${name}${attrHTML}>${await renderSlotToString(result, slots?.default)}</${name}>`
  );
}
function getHTMLElementName(constructor) {
  const definedName = customElements.getName(constructor);
  if (definedName) return definedName;
  const assignedName = constructor.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
  return assignedName;
}
function guessRenderers(componentUrl) {
  const extname = componentUrl?.split(".").pop();
  switch (extname) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/solid-js", "@astrojs/vue (jsx)"];
    case void 0:
    default:
      return [
        "@astrojs/react",
        "@astrojs/preact",
        "@astrojs/solid-js",
        "@astrojs/vue",
        "@astrojs/svelte"
      ];
  }
}
function isFragmentComponent(Component) {
  return Component === Fragment;
}
function isHTMLComponent(Component) {
  return Component && Component["astro:html"] === true;
}
function removeStaticAstroSlot(html, supportsAstroStaticSlot = true) {
  const exp = supportsAstroStaticSlot ? ASTRO_STATIC_SLOT_EXP : ASTRO_SLOT_EXP;
  return html.replace(exp, "");
}
async function renderFrameworkComponent(result, displayName, Component, _props, slots = {}) {
  if (!Component && "client:only" in _props === false) {
    throw new Error(
      `Unable to render ${displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  const { renderers: renderers2, clientDirectives } = result;
  const metadata = {
    astroStaticSlot: true,
    displayName
  };
  const { hydration, isPage, props, propsWithoutTransitionAttributes } = extractDirectives(
    _props,
    clientDirectives
  );
  let html = "";
  let attrs = void 0;
  if (hydration) {
    metadata.hydrate = hydration.directive;
    metadata.hydrateArgs = hydration.value;
    metadata.componentExport = hydration.componentExport;
    metadata.componentUrl = hydration.componentUrl;
  }
  const probableRendererNames = guessRenderers(metadata.componentUrl);
  const validRenderers = renderers2.filter((r3) => r3.name !== "astro:jsx");
  const { children, slotInstructions } = await renderSlots(result, slots);
  let renderer2;
  if (metadata.hydrate !== "only") {
    let isTagged = false;
    try {
      isTagged = Component && Component[Renderer];
    } catch {
    }
    if (isTagged) {
      const rendererName = Component[Renderer];
      renderer2 = renderers2.find(({ name }) => name === rendererName);
    }
    if (!renderer2) {
      let error2;
      for (const r3 of renderers2) {
        try {
          if (await r3.ssr.check.call({ result }, Component, props, children)) {
            renderer2 = r3;
            break;
          }
        } catch (e2) {
          error2 ??= e2;
        }
      }
      if (!renderer2 && error2) {
        throw error2;
      }
    }
    if (!renderer2 && typeof HTMLElement === "function" && componentIsHTMLElement(Component)) {
      const output = await renderHTMLElement(
        result,
        Component,
        _props,
        slots
      );
      return {
        render(destination) {
          destination.write(output);
        }
      };
    }
  } else {
    if (metadata.hydrateArgs) {
      const rendererName = rendererAliases.has(metadata.hydrateArgs) ? rendererAliases.get(metadata.hydrateArgs) : metadata.hydrateArgs;
      if (clientOnlyValues.has(rendererName)) {
        renderer2 = renderers2.find(
          ({ name }) => name === `@astrojs/${rendererName}` || name === rendererName
        );
      }
    }
    if (!renderer2 && validRenderers.length === 1) {
      renderer2 = validRenderers[0];
    }
    if (!renderer2) {
      const extname = metadata.componentUrl?.split(".").pop();
      renderer2 = renderers2.find(({ name }) => name === `@astrojs/${extname}` || name === extname);
    }
  }
  if (!renderer2) {
    if (metadata.hydrate === "only") {
      const rendererName = rendererAliases.has(metadata.hydrateArgs) ? rendererAliases.get(metadata.hydrateArgs) : metadata.hydrateArgs;
      if (clientOnlyValues.has(rendererName)) {
        const plural = validRenderers.length > 1;
        throw new AstroError({
          ...NoMatchingRenderer,
          message: NoMatchingRenderer.message(
            metadata.displayName,
            metadata?.componentUrl?.split(".").pop(),
            plural,
            validRenderers.length
          ),
          hint: NoMatchingRenderer.hint(
            formatList(probableRendererNames.map((r3) => "`" + r3 + "`"))
          )
        });
      } else {
        throw new AstroError({
          ...NoClientOnlyHint,
          message: NoClientOnlyHint.message(metadata.displayName),
          hint: NoClientOnlyHint.hint(
            probableRendererNames.map((r3) => r3.replace("@astrojs/", "")).join("|")
          )
        });
      }
    } else if (typeof Component !== "string") {
      const matchingRenderers = validRenderers.filter(
        (r3) => probableRendererNames.includes(r3.name)
      );
      const plural = validRenderers.length > 1;
      if (matchingRenderers.length === 0) {
        throw new AstroError({
          ...NoMatchingRenderer,
          message: NoMatchingRenderer.message(
            metadata.displayName,
            metadata?.componentUrl?.split(".").pop(),
            plural,
            validRenderers.length
          ),
          hint: NoMatchingRenderer.hint(
            formatList(probableRendererNames.map((r3) => "`" + r3 + "`"))
          )
        });
      } else if (matchingRenderers.length === 1) {
        renderer2 = matchingRenderers[0];
        ({ html, attrs } = await renderer2.ssr.renderToStaticMarkup.call(
          { result },
          Component,
          propsWithoutTransitionAttributes,
          children,
          metadata
        ));
      } else {
        throw new Error(`Unable to render ${metadata.displayName}!

This component likely uses ${formatList(probableRendererNames)},
but Astro encountered an error during server-side rendering.

Please ensure that ${metadata.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
      }
    }
  } else {
    if (metadata.hydrate === "only") {
      html = await renderSlotToString(result, slots?.fallback);
    } else {
      performance.now();
      ({ html, attrs } = await renderer2.ssr.renderToStaticMarkup.call(
        { result },
        Component,
        propsWithoutTransitionAttributes,
        children,
        metadata
      ));
    }
  }
  if (!html && typeof Component === "string") {
    const Tag = sanitizeElementName(Component);
    const childSlots = Object.values(children).join("");
    const renderTemplateResult = renderTemplate`<${Tag}${internalSpreadAttributes(
      props
    )}${markHTMLString(
      childSlots === "" && voidElementNames.test(Tag) ? `/>` : `>${childSlots}</${Tag}>`
    )}`;
    html = "";
    const destination = {
      write(chunk) {
        if (chunk instanceof Response) return;
        html += chunkToString(result, chunk);
      }
    };
    await renderTemplateResult.render(destination);
  }
  if (!hydration) {
    return {
      render(destination) {
        if (slotInstructions) {
          for (const instruction of slotInstructions) {
            destination.write(instruction);
          }
        }
        if (isPage || renderer2?.name === "astro:jsx") {
          destination.write(html);
        } else if (html && html.length > 0) {
          destination.write(
            markHTMLString(removeStaticAstroSlot(html, renderer2?.ssr?.supportsAstroStaticSlot))
          );
        }
      }
    };
  }
  const astroId = shorthash(
    `<!--${metadata.componentExport.value}:${metadata.componentUrl}-->
${html}
${serializeProps(
      props,
      metadata
    )}`
  );
  const island = await generateHydrateScript(
    { renderer: renderer2, result, astroId, props, attrs },
    metadata
  );
  let unrenderedSlots = [];
  if (html) {
    if (Object.keys(children).length > 0) {
      for (const key of Object.keys(children)) {
        let tagName = renderer2?.ssr?.supportsAstroStaticSlot ? !!metadata.hydrate ? "astro-slot" : "astro-static-slot" : "astro-slot";
        let expectedHTML = key === "default" ? `<${tagName}>` : `<${tagName} name="${key}">`;
        if (!html.includes(expectedHTML)) {
          unrenderedSlots.push(key);
        }
      }
    }
  } else {
    unrenderedSlots = Object.keys(children);
  }
  const template2 = unrenderedSlots.length > 0 ? unrenderedSlots.map(
    (key) => `<template data-astro-template${key !== "default" ? `="${key}"` : ""}>${children[key]}</template>`
  ).join("") : "";
  island.children = `${html ?? ""}${template2}`;
  if (island.children) {
    island.props["await-children"] = "";
    island.children += `<!--astro:end-->`;
  }
  return {
    render(destination) {
      if (slotInstructions) {
        for (const instruction of slotInstructions) {
          destination.write(instruction);
        }
      }
      destination.write(createRenderInstruction({ type: "directive", hydration }));
      if (hydration.directive !== "only" && renderer2?.ssr.renderHydrationScript) {
        destination.write(
          createRenderInstruction({
            type: "renderer-hydration-script",
            rendererName: renderer2.name,
            render: renderer2.ssr.renderHydrationScript
          })
        );
      }
      const renderedElement = renderElement$1("astro-island", island, false);
      destination.write(markHTMLString(renderedElement));
    }
  };
}
function sanitizeElementName(tag) {
  const unsafe = /[&<>'"\s]+/;
  if (!unsafe.test(tag)) return tag;
  return tag.trim().split(unsafe)[0].trim();
}
async function renderFragmentComponent(result, slots = {}) {
  const children = await renderSlotToString(result, slots?.default);
  return {
    render(destination) {
      if (children == null) return;
      destination.write(children);
    }
  };
}
async function renderHTMLComponent(result, Component, _props, slots = {}) {
  const { slotInstructions, children } = await renderSlots(result, slots);
  const html = Component({ slots: children });
  const hydrationHtml = slotInstructions ? slotInstructions.map((instr) => chunkToString(result, instr)).join("") : "";
  return {
    render(destination) {
      destination.write(markHTMLString(hydrationHtml + html));
    }
  };
}
function renderAstroComponent(result, displayName, Component, props, slots = {}) {
  if (containsServerDirective(props)) {
    return renderServerIsland(result, displayName, props, slots);
  }
  const instance = createAstroComponentInstance(result, displayName, Component, props, slots);
  return {
    render(destination) {
      return instance.render(destination);
    }
  };
}
function renderComponent(result, displayName, Component, props, slots = {}) {
  if (isPromise(Component)) {
    return Component.catch(handleCancellation).then((x) => {
      return renderComponent(result, displayName, x, props, slots);
    });
  }
  if (isFragmentComponent(Component)) {
    return renderFragmentComponent(result, slots).catch(handleCancellation);
  }
  props = normalizeProps(props);
  if (isHTMLComponent(Component)) {
    return renderHTMLComponent(result, Component, props, slots).catch(handleCancellation);
  }
  if (isAstroComponentFactory(Component)) {
    return renderAstroComponent(result, displayName, Component, props, slots);
  }
  return renderFrameworkComponent(result, displayName, Component, props, slots).catch(
    handleCancellation
  );
  function handleCancellation(e2) {
    if (result.cancelled)
      return {
        render() {
        }
      };
    throw e2;
  }
  __name(handleCancellation, "handleCancellation");
}
function normalizeProps(props) {
  if (props["class:list"] !== void 0) {
    const value = props["class:list"];
    delete props["class:list"];
    props["class"] = clsx(props["class"], value);
    if (props["class"] === "") {
      delete props["class"];
    }
  }
  return props;
}
async function renderComponentToString(result, displayName, Component, props, slots = {}, isPage = false, route) {
  let str = "";
  let renderedFirstPageChunk = false;
  let head = "";
  if (isPage && !result.partial && nonAstroPageNeedsHeadInjection(Component)) {
    head += chunkToString(result, maybeRenderHead());
  }
  try {
    const destination = {
      write(chunk) {
        if (isPage && !result.partial && !renderedFirstPageChunk) {
          renderedFirstPageChunk = true;
          if (!/<!doctype html/i.test(String(chunk))) {
            const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
            str += doctype + head;
          }
        }
        if (chunk instanceof Response) return;
        str += chunkToString(result, chunk);
      }
    };
    const renderInstance = await renderComponent(result, displayName, Component, props, slots);
    await renderInstance.render(destination);
  } catch (e2) {
    if (AstroError.is(e2) && !e2.loc) {
      e2.setLocation({
        file: route?.component
      });
    }
    throw e2;
  }
  return str;
}
function nonAstroPageNeedsHeadInjection(pageComponent) {
  return !!pageComponent?.[needsHeadRenderingSymbol];
}
async function renderJSX(result, vnode) {
  switch (true) {
    case vnode instanceof HTMLString:
      if (vnode.toString().trim() === "") {
        return "";
      }
      return vnode;
    case typeof vnode === "string":
      return markHTMLString(escapeHTML(vnode));
    case typeof vnode === "function":
      return vnode;
    case (!vnode && vnode !== 0):
      return "";
    case Array.isArray(vnode):
      return markHTMLString(
        (await Promise.all(vnode.map((v) => renderJSX(result, v)))).join("")
      );
  }
  return renderJSXVNode(result, vnode);
}
async function renderJSXVNode(result, vnode) {
  if (isVNode(vnode)) {
    switch (true) {
      case !vnode.type: {
        throw new Error(`Unable to render ${result.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`);
      }
      case vnode.type === Symbol.for("astro:fragment"):
        return renderJSX(result, vnode.props.children);
      case vnode.type.isAstroComponentFactory: {
        let props = {};
        let slots = {};
        for (const [key, value] of Object.entries(vnode.props ?? {})) {
          if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
            slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
          } else {
            props[key] = value;
          }
        }
        const str = await renderToString(result, vnode.type, props, slots);
        if (str instanceof Response) {
          throw str;
        }
        const html = markHTMLString(str);
        return html;
      }
      case (!vnode.type && vnode.type !== 0):
        return "";
      case (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder):
        return markHTMLString(await renderElement(result, vnode.type, vnode.props ?? {}));
    }
    if (vnode.type) {
      let extractSlots2 = /* @__PURE__ */ __name(function(child) {
        if (Array.isArray(child)) {
          return child.map((c2) => extractSlots2(c2));
        }
        if (!isVNode(child)) {
          _slots.default.push(child);
          return;
        }
        if ("slot" in child.props) {
          _slots[child.props.slot] = [..._slots[child.props.slot] ?? [], child];
          delete child.props.slot;
          return;
        }
        _slots.default.push(child);
      }, "extractSlots2");
      if (typeof vnode.type === "function" && vnode.props["server:root"]) {
        const output2 = await vnode.type(vnode.props ?? {});
        return await renderJSX(result, output2);
      }
      if (typeof vnode.type === "function") {
        if (vnode.props[hasTriedRenderComponentSymbol]) {
          delete vnode.props[hasTriedRenderComponentSymbol];
          const output2 = await vnode.type(vnode.props ?? {});
          if (output2?.[AstroJSX] || !output2) {
            return await renderJSXVNode(result, output2);
          } else {
            return;
          }
        } else {
          vnode.props[hasTriedRenderComponentSymbol] = true;
        }
      }
      const { children = null, ...props } = vnode.props ?? {};
      const _slots = {
        default: []
      };
      extractSlots2(children);
      for (const [key, value] of Object.entries(props)) {
        if (value?.["$$slot"]) {
          _slots[key] = value;
          delete props[key];
        }
      }
      const slotPromises = [];
      const slots = {};
      for (const [key, value] of Object.entries(_slots)) {
        slotPromises.push(
          renderJSX(result, value).then((output2) => {
            if (output2.toString().trim().length === 0) return;
            slots[key] = () => output2;
          })
        );
      }
      await Promise.all(slotPromises);
      let output;
      if (vnode.type === ClientOnlyPlaceholder && vnode.props["client:only"]) {
        output = await renderComponentToString(
          result,
          vnode.props["client:display-name"] ?? "",
          null,
          props,
          slots
        );
      } else {
        output = await renderComponentToString(
          result,
          typeof vnode.type === "function" ? vnode.type.name : vnode.type,
          vnode.type,
          props,
          slots
        );
      }
      return markHTMLString(output);
    }
  }
  return markHTMLString(`${vnode}`);
}
async function renderElement(result, tag, { children, ...props }) {
  return markHTMLString(
    `<${tag}${spreadAttributes(props)}${markHTMLString(
      (children == null || children == "") && voidElementNames.test(tag) ? `/>` : `>${children == null ? "" : await renderJSX(result, prerenderElementChildren(tag, children))}</${tag}>`
    )}`
  );
}
function prerenderElementChildren(tag, children) {
  if (typeof children === "string" && (tag === "style" || tag === "script")) {
    return markHTMLString(children);
  } else {
    return children;
  }
}
async function renderScript(result, id) {
  if (result._metadata.renderedScripts.has(id)) return;
  result._metadata.renderedScripts.add(id);
  const inlined = result.inlinedScripts.get(id);
  if (inlined != null) {
    if (inlined) {
      return markHTMLString(`<script type="module">${inlined}<\/script>`);
    } else {
      return "";
    }
  }
  const resolved = await result.resolve(id);
  return markHTMLString(
    `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"><\/script>`
  );
}
async function renderPage(result, componentFactory, props, children, streaming, route) {
  if (!isAstroComponentFactory(componentFactory)) {
    result._metadata.headInTree = result.componentMetadata.get(componentFactory.moduleId)?.containsHead ?? false;
    const pageProps = { ...props ?? {}, "server:root": true };
    const str = await renderComponentToString(
      result,
      componentFactory.name,
      componentFactory,
      pageProps,
      {},
      true,
      route
    );
    const bytes = encoder.encode(str);
    return new Response(bytes, {
      headers: new Headers([
        ["Content-Type", "text/html"],
        ["Content-Length", bytes.byteLength.toString()]
      ])
    });
  }
  result._metadata.headInTree = result.componentMetadata.get(componentFactory.moduleId)?.containsHead ?? false;
  let body;
  if (streaming) {
    if (isNode && !isDeno) {
      const nodeBody = await renderToAsyncIterable(
        result,
        componentFactory,
        props,
        children,
        true,
        route
      );
      body = nodeBody;
    } else {
      body = await renderToReadableStream(result, componentFactory, props, children, true, route);
    }
  } else {
    body = await renderToString(result, componentFactory, props, children, true, route);
  }
  if (body instanceof Response) return body;
  const init2 = result.response;
  const headers = new Headers(init2.headers);
  if (!streaming && typeof body === "string") {
    body = encoder.encode(body);
    headers.set("Content-Length", body.byteLength.toString());
  }
  let status = init2.status;
  let statusText = init2.statusText;
  if (route?.route === "/404") {
    status = 404;
    if (statusText === "OK") {
      statusText = "Not Found";
    }
  } else if (route?.route === "/500") {
    status = 500;
    if (statusText === "OK") {
      statusText = "Internal Server Error";
    }
  }
  if (status) {
    return new Response(body, { ...init2, headers, status, statusText });
  } else {
    return new Response(body, { ...init2, headers });
  }
}
function renderScriptElement({ props, children }) {
  return renderElement$1("script", {
    props,
    children
  });
}
function renderUniqueStylesheet(result, sheet) {
  if (sheet.type === "external") {
    if (Array.from(result.styles).some((s2) => s2.props.href === sheet.src)) return "";
    return renderElement$1("link", { props: { rel: "stylesheet", href: sheet.src }, children: "" });
  }
  if (sheet.type === "inline") {
    if (Array.from(result.styles).some((s2) => s2.children.includes(sheet.content))) return "";
    return renderElement$1("style", { props: {}, children: sheet.content });
  }
}
function requireCssesc() {
  if (hasRequiredCssesc) return cssesc_1;
  hasRequiredCssesc = 1;
  var object = {};
  var hasOwnProperty = object.hasOwnProperty;
  var merge = /* @__PURE__ */ __name(function merge2(options, defaults) {
    if (!options) {
      return defaults;
    }
    var result = {};
    for (var key in defaults) {
      result[key] = hasOwnProperty.call(options, key) ? options[key] : defaults[key];
    }
    return result;
  }, "merge");
  var regexAnySingleEscape = /[ -,\.\/:-@\[-\^`\{-~]/;
  var regexSingleEscape = /[ -,\.\/:-@\[\]\^`\{-~]/;
  var regexExcessiveSpaces = /(^|\\+)?(\\[A-F0-9]{1,6})\x20(?![a-fA-F0-9\x20])/g;
  var cssesc = /* @__PURE__ */ __name(function cssesc2(string, options) {
    options = merge(options, cssesc2.options);
    if (options.quotes != "single" && options.quotes != "double") {
      options.quotes = "single";
    }
    var quote = options.quotes == "double" ? '"' : "'";
    var isIdentifier = options.isIdentifier;
    var firstChar = string.charAt(0);
    var output = "";
    var counter = 0;
    var length = string.length;
    while (counter < length) {
      var character = string.charAt(counter++);
      var codePoint = character.charCodeAt();
      var value = void 0;
      if (codePoint < 32 || codePoint > 126) {
        if (codePoint >= 55296 && codePoint <= 56319 && counter < length) {
          var extra = string.charCodeAt(counter++);
          if ((extra & 64512) == 56320) {
            codePoint = ((codePoint & 1023) << 10) + (extra & 1023) + 65536;
          } else {
            counter--;
          }
        }
        value = "\\" + codePoint.toString(16).toUpperCase() + " ";
      } else {
        if (options.escapeEverything) {
          if (regexAnySingleEscape.test(character)) {
            value = "\\" + character;
          } else {
            value = "\\" + codePoint.toString(16).toUpperCase() + " ";
          }
        } else if (/[\t\n\f\r\x0B]/.test(character)) {
          value = "\\" + codePoint.toString(16).toUpperCase() + " ";
        } else if (character == "\\" || !isIdentifier && (character == '"' && quote == character || character == "'" && quote == character) || isIdentifier && regexSingleEscape.test(character)) {
          value = "\\" + character;
        } else {
          value = character;
        }
      }
      output += value;
    }
    if (isIdentifier) {
      if (/^-[-\d]/.test(output)) {
        output = "\\-" + output.slice(1);
      } else if (/\d/.test(firstChar)) {
        output = "\\3" + firstChar + " " + output.slice(1);
      }
    }
    output = output.replace(regexExcessiveSpaces, function($0, $1, $2) {
      if ($1 && $1.length % 2) {
        return $0;
      }
      return ($1 || "") + $2;
    });
    if (!isIdentifier && options.wrap) {
      return quote + output + quote;
    }
    return output;
  }, "cssesc");
  cssesc.options = {
    "escapeEverything": false,
    "isIdentifier": false,
    "quotes": "single",
    "wrap": false
  };
  cssesc.version = "3.0.0";
  cssesc_1 = cssesc;
  return cssesc_1;
}
function spreadAttributes(values = {}, _name, { class: scopedClassName } = {}) {
  let output = "";
  if (scopedClassName) {
    if (typeof values.class !== "undefined") {
      values.class += ` ${scopedClassName}`;
    } else if (typeof values["class:list"] !== "undefined") {
      values["class:list"] = [values["class:list"], scopedClassName];
    } else {
      values.class = scopedClassName;
    }
  }
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, true);
  }
  return markHTMLString(output);
}
function isVNode(vnode) {
  return vnode && typeof vnode === "object" && vnode[AstroJSX];
}
function transformSlots(vnode) {
  if (typeof vnode.type === "string") return vnode;
  const slots = {};
  if (isVNode(vnode.props.children)) {
    const child = vnode.props.children;
    if (!isVNode(child)) return;
    if (!("slot" in child.props)) return;
    const name = toSlotName(child.props.slot);
    slots[name] = [child];
    slots[name]["$$slot"] = true;
    delete child.props.slot;
    delete vnode.props.children;
  } else if (Array.isArray(vnode.props.children)) {
    vnode.props.children = vnode.props.children.map((child) => {
      if (!isVNode(child)) return child;
      if (!("slot" in child.props)) return child;
      const name = toSlotName(child.props.slot);
      if (Array.isArray(slots[name])) {
        slots[name].push(child);
      } else {
        slots[name] = [child];
        slots[name]["$$slot"] = true;
      }
      delete child.props.slot;
      return Empty;
    }).filter((v) => v !== Empty);
  }
  Object.assign(vnode.props, slots);
}
function markRawChildren(child) {
  if (typeof child === "string") return markHTMLString(child);
  if (Array.isArray(child)) return child.map((c2) => markRawChildren(c2));
  return child;
}
function transformSetDirectives(vnode) {
  if (!("set:html" in vnode.props || "set:text" in vnode.props)) return;
  if ("set:html" in vnode.props) {
    const children = markRawChildren(vnode.props["set:html"]);
    delete vnode.props["set:html"];
    Object.assign(vnode.props, { children });
    return;
  }
  if ("set:text" in vnode.props) {
    const children = vnode.props["set:text"];
    delete vnode.props["set:text"];
    Object.assign(vnode.props, { children });
    return;
  }
}
function createVNode(type, props) {
  const vnode = {
    [Renderer]: "astro:jsx",
    [AstroJSX]: true,
    type,
    props: props ?? {}
  };
  transformSetDirectives(vnode);
  transformSlots(vnode);
  return vnode;
}
var AstroError, AstroUserError, ClientAddressNotAvailable, PrerenderClientAddressNotAvailable, StaticClientAddressNotAvailable, NoMatchingStaticPathFound, OnlyResponseCanBeReturned, MissingMediaQueryDirective, NoMatchingRenderer, NoClientOnlyHint, InvalidGetStaticPathsEntry, InvalidGetStaticPathsReturn, GetStaticPathsExpectedParams, GetStaticPathsInvalidRouteParam, GetStaticPathsRequired, ReservedSlotName, NoMatchingImport, InvalidComponentArgs, PageNumberParamNotFound, ImageMissingAlt, InvalidImageService, MissingImageDimension, FailedToFetchRemoteImageDimensions, UnsupportedImageFormat, UnsupportedImageConversion, PrerenderDynamicEndpointPathCollide, ExpectedImage, ExpectedImageOptions, ExpectedNotESMImage, IncompatibleDescriptorOptions, NoImageMetadata, ResponseSentError, MiddlewareNoDataOrNextCalled, MiddlewareNotAResponse, EndpointDidNotReturnAResponse, LocalsNotAnObject, LocalsReassigned, AstroResponseHeadersReassigned, LocalImageUsedWrongly, AstroGlobUsedOutside, AstroGlobNoMatch, MissingSharp, i18nNoLocaleFoundInPath, RewriteWithBodyUsed, ForbiddenRewrite, ExperimentalFontsNotEnabled, FontFamilyNotFound, UnknownContentCollectionError, RenderUndefinedEntryError, ActionsReturnedInvalidDataError, ActionNotFoundError, SessionStorageInitError, SessionStorageSaveError, ASTRO_VERSION, REROUTE_DIRECTIVE_HEADER, REWRITE_DIRECTIVE_HEADER_KEY, REWRITE_DIRECTIVE_HEADER_VALUE, NOOP_MIDDLEWARE_HEADER, ROUTE_TYPE_HEADER, DEFAULT_404_COMPONENT, REDIRECT_STATUS_CODES, REROUTABLE_STATUS_CODES, clientAddressSymbol, originPathnameSymbol, responseSentSymbol, FORCE_COLOR, NODE_DISABLE_COLORS, NO_COLOR, TERM, isTTY, $, bold, dim, red, green, yellow, blue, replace, ca, esca, pe, escape, escapeHTML, HTMLBytes, HTMLString, markHTMLString, RenderInstructionSymbol, PROP_TYPE, transitionDirectivesToCopyOnIsland, dictionary, binary, headAndContentSym, astro_island_prebuilt_default, ISLAND_STYLES, voidElementNames, htmlBooleanAttributes, AMPERSAND_REGEX, DOUBLE_QUOTE_REGEX, STATIC_DIRECTIVES, toIdent, toAttributeString, kebab, toStyleString, noop, BufferedRenderer, isNode, isDeno, VALID_PROTOCOLS, uniqueElements, alphabetUpperCase, decodeMap, EncodingPadding$1, DecodingPadding$1, base64Alphabet, EncodingPadding, DecodingPadding, base64DecodeMap, ALGORITHM, encoder$1, decoder$1, IV_LENGTH, renderTemplateResultSym, RenderTemplateResult, slotString, SlotString, internalProps, SCRIPT_RE, COMMENT_RE, SCRIPT_REPLACER, COMMENT_REPLACER, renderServerIslandRuntime, Fragment, Renderer, encoder, decoder, astroComponentInstanceSym, AstroComponentInstance, DOCTYPE_EXP, needsHeadRenderingSymbol, rendererAliases, clientOnlyValues, ASTRO_SLOT_EXP, ASTRO_STATIC_SLOT_EXP, ClientOnlyPlaceholder, hasTriedRenderComponentSymbol, cssesc_1, hasRequiredCssesc, AstroJSX, Empty, toSlotName;
var init_server_QlrBW5xk = __esm({
  ".wrangler/tmp/pages-ErOWne/chunks/astro/server_QlrBW5xk.mjs"() {
    "use strict";
    init_modules_watch_stub();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    __name(normalizeLF, "normalizeLF");
    __name(codeFrame, "codeFrame");
    AstroError = class extends Error {
      static {
        __name(this, "AstroError");
      }
      loc;
      title;
      hint;
      frame;
      type = "AstroError";
      constructor(props, options) {
        const { name, title, message, stack, location, hint, frame } = props;
        super(message, options);
        this.title = title;
        this.name = name;
        if (message) this.message = message;
        this.stack = stack ? stack : this.stack;
        this.loc = location;
        this.hint = hint;
        this.frame = frame;
      }
      setLocation(location) {
        this.loc = location;
      }
      setName(name) {
        this.name = name;
      }
      setMessage(message) {
        this.message = message;
      }
      setHint(hint) {
        this.hint = hint;
      }
      setFrame(source, location) {
        this.frame = codeFrame(source, location);
      }
      static is(err) {
        return err.type === "AstroError";
      }
    };
    AstroUserError = class extends Error {
      static {
        __name(this, "AstroUserError");
      }
      type = "AstroUserError";
      /**
       * A message that explains to the user how they can fix the error.
       */
      hint;
      name = "AstroUserError";
      constructor(message, hint) {
        super();
        this.message = message;
        this.hint = hint;
      }
      static is(err) {
        return err.type === "AstroUserError";
      }
    };
    ClientAddressNotAvailable = {
      name: "ClientAddressNotAvailable",
      title: "`Astro.clientAddress` is not available in current adapter.",
      message: /* @__PURE__ */ __name((adapterName) => `\`Astro.clientAddress\` is not available in the \`${adapterName}\` adapter. File an issue with the adapter to add support.`, "message")
    };
    PrerenderClientAddressNotAvailable = {
      name: "PrerenderClientAddressNotAvailable",
      title: "`Astro.clientAddress` cannot be used inside prerendered routes.",
      message: /* @__PURE__ */ __name((name) => `\`Astro.clientAddress\` cannot be used inside prerendered route ${name}`, "message")
    };
    StaticClientAddressNotAvailable = {
      name: "StaticClientAddressNotAvailable",
      title: "`Astro.clientAddress` is not available in prerendered pages.",
      message: "`Astro.clientAddress` is only available on pages that are server-rendered.",
      hint: "See https://docs.astro.build/en/guides/on-demand-rendering/ for more information on how to enable SSR."
    };
    NoMatchingStaticPathFound = {
      name: "NoMatchingStaticPathFound",
      title: "No static path found for requested path.",
      message: /* @__PURE__ */ __name((pathName) => `A \`getStaticPaths()\` route pattern was matched, but no matching static path was found for requested path \`${pathName}\`.`, "message"),
      hint: /* @__PURE__ */ __name((possibleRoutes) => `Possible dynamic routes being matched: ${possibleRoutes.join(", ")}.`, "hint")
    };
    OnlyResponseCanBeReturned = {
      name: "OnlyResponseCanBeReturned",
      title: "Invalid type returned by Astro page.",
      message: /* @__PURE__ */ __name((route, returnedValue) => `Route \`${route ? route : ""}\` returned a \`${returnedValue}\`. Only a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) can be returned from Astro files.`, "message"),
      hint: "See https://docs.astro.build/en/guides/on-demand-rendering/#response for more information."
    };
    MissingMediaQueryDirective = {
      name: "MissingMediaQueryDirective",
      title: "Missing value for `client:media` directive.",
      message: 'Media query not provided for `client:media` directive. A media query similar to `client:media="(max-width: 600px)"` must be provided'
    };
    NoMatchingRenderer = {
      name: "NoMatchingRenderer",
      title: "No matching renderer found.",
      message: /* @__PURE__ */ __name((componentName, componentExtension, plural, validRenderersCount) => `Unable to render \`${componentName}\`.

${validRenderersCount > 0 ? `There ${plural ? "are" : "is"} ${validRenderersCount} renderer${plural ? "s" : ""} configured in your \`astro.config.mjs\` file,
but ${plural ? "none were" : "it was not"} able to server-side render \`${componentName}\`.` : `No valid renderer was found ${componentExtension ? `for the \`.${componentExtension}\` file extension.` : `for this file extension.`}`}`, "message"),
      hint: /* @__PURE__ */ __name((probableRenderers) => `Did you mean to enable the ${probableRenderers} integration?

See https://docs.astro.build/en/guides/framework-components/ for more information on how to install and configure integrations.`, "hint")
    };
    NoClientOnlyHint = {
      name: "NoClientOnlyHint",
      title: "Missing hint on client:only directive.",
      message: /* @__PURE__ */ __name((componentName) => `Unable to render \`${componentName}\`. When using the \`client:only\` hydration strategy, Astro needs a hint to use the correct renderer.`, "message"),
      hint: /* @__PURE__ */ __name((probableRenderers) => `Did you mean to pass \`client:only="${probableRenderers}"\`? See https://docs.astro.build/en/reference/directives-reference/#clientonly for more information on client:only`, "hint")
    };
    InvalidGetStaticPathsEntry = {
      name: "InvalidGetStaticPathsEntry",
      title: "Invalid entry inside getStaticPath's return value",
      message: /* @__PURE__ */ __name((entryType) => `Invalid entry returned by getStaticPaths. Expected an object, got \`${entryType}\``, "message"),
      hint: "If you're using a `.map` call, you might be looking for `.flatMap()` instead. See https://docs.astro.build/en/reference/routing-reference/#getstaticpaths for more information on getStaticPaths."
    };
    InvalidGetStaticPathsReturn = {
      name: "InvalidGetStaticPathsReturn",
      title: "Invalid value returned by getStaticPaths.",
      message: /* @__PURE__ */ __name((returnType) => `Invalid type returned by \`getStaticPaths\`. Expected an \`array\`, got \`${returnType}\``, "message"),
      hint: "See https://docs.astro.build/en/reference/routing-reference/#getstaticpaths for more information on getStaticPaths."
    };
    GetStaticPathsExpectedParams = {
      name: "GetStaticPathsExpectedParams",
      title: "Missing params property on `getStaticPaths` route.",
      message: "Missing or empty required `params` property on `getStaticPaths` route.",
      hint: "See https://docs.astro.build/en/reference/routing-reference/#getstaticpaths for more information on getStaticPaths."
    };
    GetStaticPathsInvalidRouteParam = {
      name: "GetStaticPathsInvalidRouteParam",
      title: "Invalid value for `getStaticPaths` route parameter.",
      message: /* @__PURE__ */ __name((key, value, valueType) => `Invalid getStaticPaths route parameter for \`${key}\`. Expected undefined, a string or a number, received \`${valueType}\` (\`${value}\`)`, "message"),
      hint: "See https://docs.astro.build/en/reference/routing-reference/#getstaticpaths for more information on getStaticPaths."
    };
    GetStaticPathsRequired = {
      name: "GetStaticPathsRequired",
      title: "`getStaticPaths()` function required for dynamic routes.",
      message: "`getStaticPaths()` function is required for dynamic routes. Make sure that you `export` a `getStaticPaths` function from your dynamic route.",
      hint: `See https://docs.astro.build/en/guides/routing/#dynamic-routes for more information on dynamic routes.

	If you meant for this route to be server-rendered, set \`export const prerender = false;\` in the page.`
    };
    ReservedSlotName = {
      name: "ReservedSlotName",
      title: "Invalid slot name.",
      message: /* @__PURE__ */ __name((slotName2) => `Unable to create a slot named \`${slotName2}\`. \`${slotName2}\` is a reserved slot name. Please update the name of this slot.`, "message")
    };
    NoMatchingImport = {
      name: "NoMatchingImport",
      title: "No import found for component.",
      message: /* @__PURE__ */ __name((componentName) => `Could not render \`${componentName}\`. No matching import has been found for \`${componentName}\`.`, "message"),
      hint: "Please make sure the component is properly imported."
    };
    InvalidComponentArgs = {
      name: "InvalidComponentArgs",
      title: "Invalid component arguments.",
      message: /* @__PURE__ */ __name((name) => `Invalid arguments passed to${name ? ` <${name}>` : ""} component.`, "message"),
      hint: "Astro components cannot be rendered directly via function call, such as `Component()` or `{items.map(Component)}`."
    };
    PageNumberParamNotFound = {
      name: "PageNumberParamNotFound",
      title: "Page number param not found.",
      message: /* @__PURE__ */ __name((paramName) => `[paginate()] page number param \`${paramName}\` not found in your filepath.`, "message"),
      hint: "Rename your file to `[page].astro` or `[...page].astro`."
    };
    ImageMissingAlt = {
      name: "ImageMissingAlt",
      title: 'Image missing required "alt" property.',
      message: 'Image missing "alt" property. "alt" text is required to describe important images on the page.',
      hint: 'Use an empty string ("") for decorative images.'
    };
    InvalidImageService = {
      name: "InvalidImageService",
      title: "Error while loading image service.",
      message: "There was an error loading the configured image service. Please see the stack trace for more information."
    };
    MissingImageDimension = {
      name: "MissingImageDimension",
      title: "Missing image dimensions",
      message: /* @__PURE__ */ __name((missingDimension, imageURL) => `Missing ${missingDimension === "both" ? "width and height attributes" : `${missingDimension} attribute`} for ${imageURL}. When using remote images, both dimensions are required in order to avoid CLS.`, "message"),
      hint: "If your image is inside your `src` folder, you probably meant to import it instead. See [the Imports guide for more information](https://docs.astro.build/en/guides/imports/#other-assets). You can also use `inferSize={true}` for remote images to get the original dimensions."
    };
    FailedToFetchRemoteImageDimensions = {
      name: "FailedToFetchRemoteImageDimensions",
      title: "Failed to retrieve remote image dimensions",
      message: /* @__PURE__ */ __name((imageURL) => `Failed to get the dimensions for ${imageURL}.`, "message"),
      hint: "Verify your remote image URL is accurate, and that you are not using `inferSize` with a file located in your `public/` folder."
    };
    UnsupportedImageFormat = {
      name: "UnsupportedImageFormat",
      title: "Unsupported image format",
      message: /* @__PURE__ */ __name((format, imagePath, supportedFormats) => `Received unsupported format \`${format}\` from \`${imagePath}\`. Currently only ${supportedFormats.join(
        ", "
      )} are supported by our image services.`, "message"),
      hint: "Using an `img` tag directly instead of the `Image` component might be what you're looking for."
    };
    UnsupportedImageConversion = {
      name: "UnsupportedImageConversion",
      title: "Unsupported image conversion",
      message: "Converting between vector (such as SVGs) and raster (such as PNGs and JPEGs) images is not currently supported."
    };
    PrerenderDynamicEndpointPathCollide = {
      name: "PrerenderDynamicEndpointPathCollide",
      title: "Prerendered dynamic endpoint has path collision.",
      message: /* @__PURE__ */ __name((pathname) => `Could not render \`${pathname}\` with an \`undefined\` param as the generated path will collide during prerendering. Prevent passing \`undefined\` as \`params\` for the endpoint's \`getStaticPaths()\` function, or add an additional extension to the endpoint's filename.`, "message"),
      hint: /* @__PURE__ */ __name((filename) => `Rename \`${filename}\` to \`${filename.replace(/\.(?:js|ts)/, (m2) => `.json` + m2)}\``, "hint")
    };
    ExpectedImage = {
      name: "ExpectedImage",
      title: "Expected src to be an image.",
      message: /* @__PURE__ */ __name((src, typeofOptions, fullOptions) => `Expected \`src\` property for \`getImage\` or \`<Image />\` to be either an ESM imported image or a string with the path of a remote image. Received \`${src}\` (type: \`${typeofOptions}\`).

Full serialized options received: \`${fullOptions}\`.`, "message"),
      hint: "This error can often happen because of a wrong path. Make sure the path to your image is correct. If you're passing an async function, make sure to call and await it."
    };
    ExpectedImageOptions = {
      name: "ExpectedImageOptions",
      title: "Expected image options.",
      message: /* @__PURE__ */ __name((options) => `Expected getImage() parameter to be an object. Received \`${options}\`.`, "message")
    };
    ExpectedNotESMImage = {
      name: "ExpectedNotESMImage",
      title: "Expected image options, not an ESM-imported image.",
      message: "An ESM-imported image cannot be passed directly to `getImage()`. Instead, pass an object with the image in the `src` property.",
      hint: "Try changing `getImage(myImage)` to `getImage({ src: myImage })`"
    };
    IncompatibleDescriptorOptions = {
      name: "IncompatibleDescriptorOptions",
      title: "Cannot set both `densities` and `widths`",
      message: "Only one of `densities` or `widths` can be specified. In most cases, you'll probably want to use only `widths` if you require specific widths.",
      hint: "Those attributes are used to construct a `srcset` attribute, which cannot have both `x` and `w` descriptors."
    };
    NoImageMetadata = {
      name: "NoImageMetadata",
      title: "Could not process image metadata.",
      message: /* @__PURE__ */ __name((imagePath) => `Could not process image metadata${imagePath ? ` for \`${imagePath}\`` : ""}.`, "message"),
      hint: "This is often caused by a corrupted or malformed image. Re-exporting the image from your image editor may fix this issue."
    };
    ResponseSentError = {
      name: "ResponseSentError",
      title: "Unable to set response.",
      message: "The response has already been sent to the browser and cannot be altered."
    };
    MiddlewareNoDataOrNextCalled = {
      name: "MiddlewareNoDataOrNextCalled",
      title: "The middleware didn't return a `Response`.",
      message: "Make sure your middleware returns a `Response` object, either directly or by returning the `Response` from calling the `next` function."
    };
    MiddlewareNotAResponse = {
      name: "MiddlewareNotAResponse",
      title: "The middleware returned something that is not a `Response` object.",
      message: "Any data returned from middleware must be a valid `Response` object."
    };
    EndpointDidNotReturnAResponse = {
      name: "EndpointDidNotReturnAResponse",
      title: "The endpoint did not return a `Response`.",
      message: "An endpoint must return either a `Response`, or a `Promise` that resolves with a `Response`."
    };
    LocalsNotAnObject = {
      name: "LocalsNotAnObject",
      title: "Value assigned to `locals` is not accepted.",
      message: "`locals` can only be assigned to an object. Other values like numbers, strings, etc. are not accepted.",
      hint: "If you tried to remove some information from the `locals` object, try to use `delete` or set the property to `undefined`."
    };
    LocalsReassigned = {
      name: "LocalsReassigned",
      title: "`locals` must not be reassigned.",
      message: "`locals` can not be assigned directly.",
      hint: "Set a `locals` property instead."
    };
    AstroResponseHeadersReassigned = {
      name: "AstroResponseHeadersReassigned",
      title: "`Astro.response.headers` must not be reassigned.",
      message: "Individual headers can be added to and removed from `Astro.response.headers`, but it must not be replaced with another instance of `Headers` altogether.",
      hint: "Consider using `Astro.response.headers.add()`, and `Astro.response.headers.delete()`."
    };
    LocalImageUsedWrongly = {
      name: "LocalImageUsedWrongly",
      title: "Local images must be imported.",
      message: /* @__PURE__ */ __name((imageFilePath) => `\`Image\`'s and \`getImage\`'s \`src\` parameter must be an imported image or an URL, it cannot be a string filepath. Received \`${imageFilePath}\`.`, "message"),
      hint: "If you want to use an image from your `src` folder, you need to either import it or if the image is coming from a content collection, use the [image() schema helper](https://docs.astro.build/en/guides/images/#images-in-content-collections). See https://docs.astro.build/en/guides/images/#src-required for more information on the `src` property."
    };
    AstroGlobUsedOutside = {
      name: "AstroGlobUsedOutside",
      title: "Astro.glob() used outside of an Astro file.",
      message: /* @__PURE__ */ __name((globStr) => `\`Astro.glob(${globStr})\` can only be used in \`.astro\` files. \`import.meta.glob(${globStr})\` can be used instead to achieve a similar result.`, "message"),
      hint: "See Vite's documentation on `import.meta.glob` for more information: https://vite.dev/guide/features.html#glob-import"
    };
    AstroGlobNoMatch = {
      name: "AstroGlobNoMatch",
      title: "Astro.glob() did not match any files.",
      message: /* @__PURE__ */ __name((globStr) => `\`Astro.glob(${globStr})\` did not return any matching files.`, "message"),
      hint: "Check the pattern for typos."
    };
    MissingSharp = {
      name: "MissingSharp",
      title: "Could not find Sharp.",
      message: "Could not find Sharp. Please install Sharp (`sharp`) manually into your project or migrate to another image service.",
      hint: "See Sharp's installation instructions for more information: https://sharp.pixelplumbing.com/install. If you are not relying on `astro:assets` to optimize, transform, or process any images, you can configure a passthrough image service instead of installing Sharp. See https://docs.astro.build/en/reference/errors/missing-sharp for more information.\n\nSee https://docs.astro.build/en/guides/images/#default-image-service for more information on how to migrate to another image service."
    };
    i18nNoLocaleFoundInPath = {
      name: "i18nNoLocaleFoundInPath",
      title: "The path doesn't contain any locale",
      message: "You tried to use an i18n utility on a path that doesn't contain any locale. You can use `pathHasLocale` first to determine if the path has a locale."
    };
    RewriteWithBodyUsed = {
      name: "RewriteWithBodyUsed",
      title: "Cannot use Astro.rewrite after the request body has been read",
      message: "Astro.rewrite() cannot be used if the request body has already been read. If you need to read the body, first clone the request."
    };
    ForbiddenRewrite = {
      name: "ForbiddenRewrite",
      title: "Forbidden rewrite to a static route.",
      message: /* @__PURE__ */ __name((from, to, component) => `You tried to rewrite the on-demand route '${from}' with the static route '${to}', when using the 'server' output. 

The static route '${to}' is rendered by the component
'${component}', which is marked as prerendered. This is a forbidden operation because during the build the component '${component}' is compiled to an
HTML file, which can't be retrieved at runtime by Astro.`, "message"),
      hint: /* @__PURE__ */ __name((component) => `Add \`export const prerender = false\` to the component '${component}', or use a Astro.redirect().`, "hint")
    };
    ExperimentalFontsNotEnabled = {
      name: "ExperimentalFontsNotEnabled",
      title: "Experimental fonts are not enabled",
      message: "The Font component is used but experimental fonts have not been registered in the config.",
      hint: "Check that you have enabled experimental fonts and also configured your preferred fonts."
    };
    FontFamilyNotFound = {
      name: "FontFamilyNotFound",
      title: "Font family not found",
      message: /* @__PURE__ */ __name((family) => `No data was found for the \`"${family}"\` family passed to the \`<Font>\` component.`, "message"),
      hint: "This is often caused by a typo. Check that your Font component is using a `cssVariable` specified in your config."
    };
    UnknownContentCollectionError = {
      name: "UnknownContentCollectionError",
      title: "Unknown Content Collection Error."
    };
    RenderUndefinedEntryError = {
      name: "RenderUndefinedEntryError",
      title: "Attempted to render an undefined content collection entry.",
      hint: "Check if the entry is undefined before passing it to `render()`"
    };
    ActionsReturnedInvalidDataError = {
      name: "ActionsReturnedInvalidDataError",
      title: "Action handler returned invalid data.",
      message: /* @__PURE__ */ __name((error2) => `Action handler returned invalid data. Handlers should return serializable data types like objects, arrays, strings, and numbers. Parse error: ${error2}`, "message"),
      hint: "See the devalue library for all supported types: https://github.com/rich-harris/devalue"
    };
    ActionNotFoundError = {
      name: "ActionNotFoundError",
      title: "Action not found.",
      message: /* @__PURE__ */ __name((actionName) => `The server received a request for an action named \`${actionName}\` but could not find a match. If you renamed an action, check that you've updated your \`actions/index\` file and your calling code to match.`, "message"),
      hint: "You can run `astro check` to detect type errors caused by mismatched action names."
    };
    SessionStorageInitError = {
      name: "SessionStorageInitError",
      title: "Session storage could not be initialized.",
      message: /* @__PURE__ */ __name((error2, driver) => `Error when initializing session storage${driver ? ` with driver \`${driver}\`` : ""}. \`${error2 ?? ""}\``, "message"),
      hint: "For more information, see https://docs.astro.build/en/guides/sessions/"
    };
    SessionStorageSaveError = {
      name: "SessionStorageSaveError",
      title: "Session data could not be saved.",
      message: /* @__PURE__ */ __name((error2, driver) => `Error when saving session data${driver ? ` with driver \`${driver}\`` : ""}. \`${error2 ?? ""}\``, "message"),
      hint: "For more information, see https://docs.astro.build/en/guides/sessions/"
    };
    __name(validateArgs, "validateArgs");
    __name(baseCreateComponent, "baseCreateComponent");
    __name(createComponentWithOptions, "createComponentWithOptions");
    __name(createComponent, "createComponent");
    ASTRO_VERSION = "5.7.4";
    REROUTE_DIRECTIVE_HEADER = "X-Astro-Reroute";
    REWRITE_DIRECTIVE_HEADER_KEY = "X-Astro-Rewrite";
    REWRITE_DIRECTIVE_HEADER_VALUE = "yes";
    NOOP_MIDDLEWARE_HEADER = "X-Astro-Noop";
    ROUTE_TYPE_HEADER = "X-Astro-Route-Type";
    DEFAULT_404_COMPONENT = "astro-default-404.astro";
    REDIRECT_STATUS_CODES = [301, 302, 303, 307, 308, 300, 304];
    REROUTABLE_STATUS_CODES = [404, 500];
    clientAddressSymbol = Symbol.for("astro.clientAddress");
    originPathnameSymbol = Symbol.for("astro.originPathname");
    responseSentSymbol = Symbol.for("astro.responseSent");
    __name(createAstroGlobFn, "createAstroGlobFn");
    __name(createAstro, "createAstro");
    isTTY = true;
    if (typeof process !== "undefined") {
      ({ FORCE_COLOR, NODE_DISABLE_COLORS, NO_COLOR, TERM } = process.env || {});
      isTTY = process.stdout && process.stdout.isTTY;
    }
    $ = {
      enabled: !NODE_DISABLE_COLORS && NO_COLOR == null && TERM !== "dumb" && (FORCE_COLOR != null && FORCE_COLOR !== "0" || isTTY)
    };
    __name(init, "init");
    bold = init(1, 22);
    dim = init(2, 22);
    red = init(31, 39);
    green = init(32, 39);
    yellow = init(33, 39);
    blue = init(34, 39);
    __name(renderEndpoint, "renderEndpoint");
    ({ replace } = "");
    ca = /[&<>'"]/g;
    esca = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;"
    };
    pe = /* @__PURE__ */ __name((m2) => esca[m2], "pe");
    escape = /* @__PURE__ */ __name((es) => replace.call(es, ca, pe), "escape");
    __name(isPromise, "isPromise");
    __name(streamAsyncIterator, "streamAsyncIterator");
    escapeHTML = escape;
    HTMLBytes = class extends Uint8Array {
      static {
        __name(this, "HTMLBytes");
      }
    };
    Object.defineProperty(HTMLBytes.prototype, Symbol.toStringTag, {
      get() {
        return "HTMLBytes";
      }
    });
    HTMLString = class extends String {
      static {
        __name(this, "HTMLString");
      }
      get [Symbol.toStringTag]() {
        return "HTMLString";
      }
    };
    markHTMLString = /* @__PURE__ */ __name((value) => {
      if (value instanceof HTMLString) {
        return value;
      }
      if (typeof value === "string") {
        return new HTMLString(value);
      }
      return value;
    }, "markHTMLString");
    __name(isHTMLString, "isHTMLString");
    __name(markHTMLBytes, "markHTMLBytes");
    __name(hasGetReader, "hasGetReader");
    __name(unescapeChunksAsync, "unescapeChunksAsync");
    __name(unescapeChunks, "unescapeChunks");
    __name(unescapeHTML, "unescapeHTML");
    RenderInstructionSymbol = Symbol.for("astro:render");
    __name(createRenderInstruction, "createRenderInstruction");
    __name(isRenderInstruction, "isRenderInstruction");
    __name(r, "r");
    __name(clsx, "clsx");
    PROP_TYPE = {
      Value: 0,
      JSON: 1,
      // Actually means Array
      RegExp: 2,
      Date: 3,
      Map: 4,
      Set: 5,
      BigInt: 6,
      URL: 7,
      Uint8Array: 8,
      Uint16Array: 9,
      Uint32Array: 10,
      Infinity: 11
    };
    __name(serializeArray, "serializeArray");
    __name(serializeObject, "serializeObject");
    __name(convertToSerializedForm, "convertToSerializedForm");
    __name(serializeProps, "serializeProps");
    transitionDirectivesToCopyOnIsland = Object.freeze([
      "data-astro-transition-scope",
      "data-astro-transition-persist",
      "data-astro-transition-persist-props"
    ]);
    __name(extractDirectives, "extractDirectives");
    __name(generateHydrateScript, "generateHydrateScript");
    dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
    binary = dictionary.length;
    __name(bitwise, "bitwise");
    __name(shorthash, "shorthash");
    __name(isAstroComponentFactory, "isAstroComponentFactory");
    __name(isAPropagatingComponent, "isAPropagatingComponent");
    headAndContentSym = Symbol.for("astro.headAndContent");
    __name(isHeadAndContent, "isHeadAndContent");
    __name(createHeadAndContent, "createHeadAndContent");
    astro_island_prebuilt_default = `(()=>{var A=Object.defineProperty;var g=(i,o,a)=>o in i?A(i,o,{enumerable:!0,configurable:!0,writable:!0,value:a}):i[o]=a;var d=(i,o,a)=>g(i,typeof o!="symbol"?o+"":o,a);{let i={0:t=>m(t),1:t=>a(t),2:t=>new RegExp(t),3:t=>new Date(t),4:t=>new Map(a(t)),5:t=>new Set(a(t)),6:t=>BigInt(t),7:t=>new URL(t),8:t=>new Uint8Array(t),9:t=>new Uint16Array(t),10:t=>new Uint32Array(t),11:t=>1/0*t},o=t=>{let[l,e]=t;return l in i?i[l](e):void 0},a=t=>t.map(o),m=t=>typeof t!="object"||t===null?t:Object.fromEntries(Object.entries(t).map(([l,e])=>[l,o(e)]));class y extends HTMLElement{constructor(){super(...arguments);d(this,"Component");d(this,"hydrator");d(this,"hydrate",async()=>{var b;if(!this.hydrator||!this.isConnected)return;let e=(b=this.parentElement)==null?void 0:b.closest("astro-island[ssr]");if(e){e.addEventListener("astro:hydrate",this.hydrate,{once:!0});return}let c=this.querySelectorAll("astro-slot"),n={},h=this.querySelectorAll("template[data-astro-template]");for(let r of h){let s=r.closest(this.tagName);s!=null&&s.isSameNode(this)&&(n[r.getAttribute("data-astro-template")||"default"]=r.innerHTML,r.remove())}for(let r of c){let s=r.closest(this.tagName);s!=null&&s.isSameNode(this)&&(n[r.getAttribute("name")||"default"]=r.innerHTML)}let p;try{p=this.hasAttribute("props")?m(JSON.parse(this.getAttribute("props"))):{}}catch(r){let s=this.getAttribute("component-url")||"<unknown>",v=this.getAttribute("component-export");throw v&&(s+=\` (export \${v})\`),console.error(\`[hydrate] Error parsing props for component \${s}\`,this.getAttribute("props"),r),r}let u;await this.hydrator(this)(this.Component,p,n,{client:this.getAttribute("client")}),this.removeAttribute("ssr"),this.dispatchEvent(new CustomEvent("astro:hydrate"))});d(this,"unmount",()=>{this.isConnected||this.dispatchEvent(new CustomEvent("astro:unmount"))})}disconnectedCallback(){document.removeEventListener("astro:after-swap",this.unmount),document.addEventListener("astro:after-swap",this.unmount,{once:!0})}connectedCallback(){if(!this.hasAttribute("await-children")||document.readyState==="interactive"||document.readyState==="complete")this.childrenConnectedCallback();else{let e=()=>{document.removeEventListener("DOMContentLoaded",e),c.disconnect(),this.childrenConnectedCallback()},c=new MutationObserver(()=>{var n;((n=this.lastChild)==null?void 0:n.nodeType)===Node.COMMENT_NODE&&this.lastChild.nodeValue==="astro:end"&&(this.lastChild.remove(),e())});c.observe(this,{childList:!0}),document.addEventListener("DOMContentLoaded",e)}}async childrenConnectedCallback(){let e=this.getAttribute("before-hydration-url");e&&await import(e),this.start()}async start(){let e=JSON.parse(this.getAttribute("opts")),c=this.getAttribute("client");if(Astro[c]===void 0){window.addEventListener(\`astro:\${c}\`,()=>this.start(),{once:!0});return}try{await Astro[c](async()=>{let n=this.getAttribute("renderer-url"),[h,{default:p}]=await Promise.all([import(this.getAttribute("component-url")),n?import(n):()=>()=>{}]),u=this.getAttribute("component-export")||"default";if(!u.includes("."))this.Component=h[u];else{this.Component=h;for(let f of u.split("."))this.Component=this.Component[f]}return this.hydrator=p,this.hydrate},e,this)}catch(n){console.error(\`[astro-island] Error hydrating \${this.getAttribute("component-url")}\`,n)}}attributeChangedCallback(){this.hydrate()}}d(y,"observedAttributes",["props"]),customElements.get("astro-island")||customElements.define("astro-island",y)}})();`;
    ISLAND_STYLES = `<style>astro-island,astro-slot,astro-static-slot{display:contents}</style>`;
    __name(determineIfNeedsHydrationScript, "determineIfNeedsHydrationScript");
    __name(determinesIfNeedsDirectiveScript, "determinesIfNeedsDirectiveScript");
    __name(getDirectiveScriptText, "getDirectiveScriptText");
    __name(getPrescripts, "getPrescripts");
    voidElementNames = /^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;
    htmlBooleanAttributes = /^(?:allowfullscreen|async|autofocus|autoplay|checked|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|hidden|inert|loop|nomodule|novalidate|open|playsinline|readonly|required|reversed|scoped|seamless|selected|itemscope)$/i;
    AMPERSAND_REGEX = /&/g;
    DOUBLE_QUOTE_REGEX = /"/g;
    STATIC_DIRECTIVES = /* @__PURE__ */ new Set(["set:html", "set:text"]);
    toIdent = /* @__PURE__ */ __name((k) => k.trim().replace(/(?!^)\b\w|\s+|\W+/g, (match, index) => {
      if (/\W/.test(match)) return "";
      return index === 0 ? match : match.toUpperCase();
    }), "toIdent");
    toAttributeString = /* @__PURE__ */ __name((value, shouldEscape = true) => shouldEscape ? String(value).replace(AMPERSAND_REGEX, "&#38;").replace(DOUBLE_QUOTE_REGEX, "&#34;") : value, "toAttributeString");
    kebab = /* @__PURE__ */ __name((k) => k.toLowerCase() === k ? k : k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`), "kebab");
    toStyleString = /* @__PURE__ */ __name((obj) => Object.entries(obj).filter(([_, v]) => typeof v === "string" && v.trim() || typeof v === "number").map(([k, v]) => {
      if (k[0] !== "-" && k[1] !== "-") return `${kebab(k)}:${v}`;
      return `${k}:${v}`;
    }).join(";"), "toStyleString");
    __name(defineScriptVars, "defineScriptVars");
    __name(formatList, "formatList");
    __name(addAttribute, "addAttribute");
    __name(internalSpreadAttributes, "internalSpreadAttributes");
    __name(renderElement$1, "renderElement$1");
    noop = /* @__PURE__ */ __name(() => {
    }, "noop");
    BufferedRenderer = class {
      static {
        __name(this, "BufferedRenderer");
      }
      chunks = [];
      renderPromise;
      destination;
      /**
       * Determines whether buffer has been flushed
       * to the final destination.
       */
      flushed = false;
      constructor(destination, renderFunction) {
        this.destination = destination;
        this.renderPromise = renderFunction(this);
        if (isPromise(this.renderPromise)) {
          Promise.resolve(this.renderPromise).catch(noop);
        }
      }
      write(chunk) {
        if (this.flushed) {
          this.destination.write(chunk);
        } else {
          this.chunks.push(chunk);
        }
      }
      flush() {
        if (this.flushed) {
          throw new Error("The render buffer has already been flushed.");
        }
        this.flushed = true;
        for (const chunk of this.chunks) {
          this.destination.write(chunk);
        }
        return this.renderPromise;
      }
    };
    __name(createBufferedRenderer, "createBufferedRenderer");
    isNode = typeof process !== "undefined" && Object.prototype.toString.call(process) === "[object process]";
    isDeno = typeof Deno !== "undefined";
    __name(promiseWithResolvers, "promiseWithResolvers");
    VALID_PROTOCOLS = ["http:", "https:"];
    __name(isHttpUrl, "isHttpUrl");
    uniqueElements = /* @__PURE__ */ __name((item, index, all) => {
      const props = JSON.stringify(item.props);
      const children = item.children;
      return index === all.findIndex((i2) => JSON.stringify(i2.props) === props && i2.children == children);
    }, "uniqueElements");
    __name(renderAllHeadContent, "renderAllHeadContent");
    __name(renderHead, "renderHead");
    __name(maybeRenderHead, "maybeRenderHead");
    __name(encodeHexUpperCase, "encodeHexUpperCase");
    __name(decodeHex, "decodeHex");
    alphabetUpperCase = "0123456789ABCDEF";
    decodeMap = {
      "0": 0,
      "1": 1,
      "2": 2,
      "3": 3,
      "4": 4,
      "5": 5,
      "6": 6,
      "7": 7,
      "8": 8,
      "9": 9,
      a: 10,
      A: 10,
      b: 11,
      B: 11,
      c: 12,
      C: 12,
      d: 13,
      D: 13,
      e: 14,
      E: 14,
      f: 15,
      F: 15
    };
    (function(EncodingPadding2) {
      EncodingPadding2[EncodingPadding2["Include"] = 0] = "Include";
      EncodingPadding2[EncodingPadding2["None"] = 1] = "None";
    })(EncodingPadding$1 || (EncodingPadding$1 = {}));
    (function(DecodingPadding2) {
      DecodingPadding2[DecodingPadding2["Required"] = 0] = "Required";
      DecodingPadding2[DecodingPadding2["Ignore"] = 1] = "Ignore";
    })(DecodingPadding$1 || (DecodingPadding$1 = {}));
    __name(encodeBase64, "encodeBase64");
    __name(encodeBase64_internal, "encodeBase64_internal");
    base64Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    __name(decodeBase64, "decodeBase64");
    __name(decodeBase64_internal, "decodeBase64_internal");
    (function(EncodingPadding2) {
      EncodingPadding2[EncodingPadding2["Include"] = 0] = "Include";
      EncodingPadding2[EncodingPadding2["None"] = 1] = "None";
    })(EncodingPadding || (EncodingPadding = {}));
    (function(DecodingPadding2) {
      DecodingPadding2[DecodingPadding2["Required"] = 0] = "Required";
      DecodingPadding2[DecodingPadding2["Ignore"] = 1] = "Ignore";
    })(DecodingPadding || (DecodingPadding = {}));
    base64DecodeMap = {
      "0": 52,
      "1": 53,
      "2": 54,
      "3": 55,
      "4": 56,
      "5": 57,
      "6": 58,
      "7": 59,
      "8": 60,
      "9": 61,
      A: 0,
      B: 1,
      C: 2,
      D: 3,
      E: 4,
      F: 5,
      G: 6,
      H: 7,
      I: 8,
      J: 9,
      K: 10,
      L: 11,
      M: 12,
      N: 13,
      O: 14,
      P: 15,
      Q: 16,
      R: 17,
      S: 18,
      T: 19,
      U: 20,
      V: 21,
      W: 22,
      X: 23,
      Y: 24,
      Z: 25,
      a: 26,
      b: 27,
      c: 28,
      d: 29,
      e: 30,
      f: 31,
      g: 32,
      h: 33,
      i: 34,
      j: 35,
      k: 36,
      l: 37,
      m: 38,
      n: 39,
      o: 40,
      p: 41,
      q: 42,
      r: 43,
      s: 44,
      t: 45,
      u: 46,
      v: 47,
      w: 48,
      x: 49,
      y: 50,
      z: 51,
      "+": 62,
      "/": 63
    };
    ALGORITHM = "AES-GCM";
    __name(decodeKey, "decodeKey");
    encoder$1 = new TextEncoder();
    decoder$1 = new TextDecoder();
    IV_LENGTH = 24;
    __name(encryptString, "encryptString");
    __name(decryptString, "decryptString");
    renderTemplateResultSym = Symbol.for("astro.renderTemplateResult");
    RenderTemplateResult = class {
      static {
        __name(this, "RenderTemplateResult");
      }
      [renderTemplateResultSym] = true;
      htmlParts;
      expressions;
      error;
      constructor(htmlParts, expressions) {
        this.htmlParts = htmlParts;
        this.error = void 0;
        this.expressions = expressions.map((expression) => {
          if (isPromise(expression)) {
            return Promise.resolve(expression).catch((err) => {
              if (!this.error) {
                this.error = err;
                throw err;
              }
            });
          }
          return expression;
        });
      }
      render(destination) {
        const flushers = this.expressions.map((exp) => {
          return createBufferedRenderer(destination, (bufferDestination) => {
            if (exp || exp === 0) {
              return renderChild(bufferDestination, exp);
            }
          });
        });
        let i2 = 0;
        const iterate = /* @__PURE__ */ __name(() => {
          while (i2 < this.htmlParts.length) {
            const html = this.htmlParts[i2];
            const flusher = flushers[i2];
            i2++;
            if (html) {
              destination.write(markHTMLString(html));
            }
            if (flusher) {
              const result = flusher.flush();
              if (isPromise(result)) {
                return result.then(iterate);
              }
            }
          }
        }, "iterate");
        return iterate();
      }
    };
    __name(isRenderTemplateResult, "isRenderTemplateResult");
    __name(renderTemplate, "renderTemplate");
    slotString = Symbol.for("astro:slot-string");
    SlotString = class extends HTMLString {
      static {
        __name(this, "SlotString");
      }
      instructions;
      [slotString];
      constructor(content, instructions) {
        super(content);
        this.instructions = instructions;
        this[slotString] = true;
      }
    };
    __name(isSlotString, "isSlotString");
    __name(renderSlot, "renderSlot");
    __name(renderSlotToString, "renderSlotToString");
    __name(renderSlots, "renderSlots");
    __name(createSlotValueFromString, "createSlotValueFromString");
    internalProps = /* @__PURE__ */ new Set([
      "server:component-path",
      "server:component-export",
      "server:component-directive",
      "server:defer"
    ]);
    __name(containsServerDirective, "containsServerDirective");
    SCRIPT_RE = /<\/script/giu;
    COMMENT_RE = /<!--/gu;
    SCRIPT_REPLACER = "<\\/script";
    COMMENT_REPLACER = "\\u003C!--";
    __name(safeJsonStringify, "safeJsonStringify");
    __name(createSearchParams, "createSearchParams");
    __name(isWithinURLLimit, "isWithinURLLimit");
    __name(renderServerIsland, "renderServerIsland");
    renderServerIslandRuntime = /* @__PURE__ */ __name(() => markHTMLString(
      `
	<script>
		async function replaceServerIsland(id, r) {
			let s = document.querySelector(\`script[data-island-id="\${id}"]\`);
			// If there's no matching script, or the request fails then return
			if (!s || r.status !== 200 || r.headers.get('content-type')?.split(';')[0].trim() !== 'text/html') return;
			// Load the HTML before modifying the DOM in case of errors
			let html = await r.text();
			// Remove any placeholder content before the island script
			while (s.previousSibling && s.previousSibling.nodeType !== 8 && s.previousSibling.data !== '[if astro]>server-island-start<![endif]')
				s.previousSibling.remove();
			s.previousSibling?.remove();
			// Insert the new HTML
			s.before(document.createRange().createContextualFragment(html));
			// Remove the script. Prior to v5.4.2, this was the trick to force rerun of scripts.  Keeping it to minimize change to the existing behavior.
			s.remove();
		}
	<\/script>`.split("\n").map((line) => line.trim()).filter((line) => line && !line.startsWith("//")).join(" ")
    ), "renderServerIslandRuntime");
    Fragment = Symbol.for("astro:fragment");
    Renderer = Symbol.for("astro:renderer");
    encoder = new TextEncoder();
    decoder = new TextDecoder();
    __name(stringifyChunk, "stringifyChunk");
    __name(chunkToString, "chunkToString");
    __name(chunkToByteArray, "chunkToByteArray");
    __name(isRenderInstance, "isRenderInstance");
    __name(renderChild, "renderChild");
    __name(renderArray, "renderArray");
    __name(renderIterable, "renderIterable");
    __name(renderAsyncIterable, "renderAsyncIterable");
    astroComponentInstanceSym = Symbol.for("astro.componentInstance");
    AstroComponentInstance = class {
      static {
        __name(this, "AstroComponentInstance");
      }
      [astroComponentInstanceSym] = true;
      result;
      props;
      slotValues;
      factory;
      returnValue;
      constructor(result, props, slots, factory) {
        this.result = result;
        this.props = props;
        this.factory = factory;
        this.slotValues = {};
        for (const name in slots) {
          let didRender = false;
          let value = slots[name](result);
          this.slotValues[name] = () => {
            if (!didRender) {
              didRender = true;
              return value;
            }
            return slots[name](result);
          };
        }
      }
      init(result) {
        if (this.returnValue !== void 0) {
          return this.returnValue;
        }
        this.returnValue = this.factory(result, this.props, this.slotValues);
        if (isPromise(this.returnValue)) {
          this.returnValue.then((resolved) => {
            this.returnValue = resolved;
          }).catch(() => {
          });
        }
        return this.returnValue;
      }
      render(destination) {
        const returnValue = this.init(this.result);
        if (isPromise(returnValue)) {
          return returnValue.then((x) => this.renderImpl(destination, x));
        }
        return this.renderImpl(destination, returnValue);
      }
      renderImpl(destination, returnValue) {
        if (isHeadAndContent(returnValue)) {
          return returnValue.content.render(destination);
        } else {
          return renderChild(destination, returnValue);
        }
      }
    };
    __name(validateComponentProps, "validateComponentProps");
    __name(createAstroComponentInstance, "createAstroComponentInstance");
    __name(isAstroComponentInstance, "isAstroComponentInstance");
    DOCTYPE_EXP = /<!doctype html/i;
    __name(renderToString, "renderToString");
    __name(renderToReadableStream, "renderToReadableStream");
    __name(callComponentAsTemplateResultOrResponse, "callComponentAsTemplateResultOrResponse");
    __name(bufferHeadContent, "bufferHeadContent");
    __name(renderToAsyncIterable, "renderToAsyncIterable");
    __name(toPromise, "toPromise");
    __name(componentIsHTMLElement, "componentIsHTMLElement");
    __name(renderHTMLElement, "renderHTMLElement");
    __name(getHTMLElementName, "getHTMLElementName");
    needsHeadRenderingSymbol = Symbol.for("astro.needsHeadRendering");
    rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
    clientOnlyValues = /* @__PURE__ */ new Set(["solid-js", "react", "preact", "vue", "svelte"]);
    __name(guessRenderers, "guessRenderers");
    __name(isFragmentComponent, "isFragmentComponent");
    __name(isHTMLComponent, "isHTMLComponent");
    ASTRO_SLOT_EXP = /<\/?astro-slot\b[^>]*>/g;
    ASTRO_STATIC_SLOT_EXP = /<\/?astro-static-slot\b[^>]*>/g;
    __name(removeStaticAstroSlot, "removeStaticAstroSlot");
    __name(renderFrameworkComponent, "renderFrameworkComponent");
    __name(sanitizeElementName, "sanitizeElementName");
    __name(renderFragmentComponent, "renderFragmentComponent");
    __name(renderHTMLComponent, "renderHTMLComponent");
    __name(renderAstroComponent, "renderAstroComponent");
    __name(renderComponent, "renderComponent");
    __name(normalizeProps, "normalizeProps");
    __name(renderComponentToString, "renderComponentToString");
    __name(nonAstroPageNeedsHeadInjection, "nonAstroPageNeedsHeadInjection");
    ClientOnlyPlaceholder = "astro-client-only";
    hasTriedRenderComponentSymbol = Symbol("hasTriedRenderComponent");
    __name(renderJSX, "renderJSX");
    __name(renderJSXVNode, "renderJSXVNode");
    __name(renderElement, "renderElement");
    __name(prerenderElementChildren, "prerenderElementChildren");
    __name(renderScript, "renderScript");
    __name(renderPage, "renderPage");
    __name(renderScriptElement, "renderScriptElement");
    __name(renderUniqueStylesheet, "renderUniqueStylesheet");
    __name(requireCssesc, "requireCssesc");
    requireCssesc();
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_".split("").reduce((v, c2) => (v[c2.charCodeAt(0)] = c2, v), []);
    "-0123456789_".split("").reduce((v, c2) => (v[c2.charCodeAt(0)] = c2, v), []);
    __name(spreadAttributes, "spreadAttributes");
    AstroJSX = "astro:jsx";
    Empty = Symbol("empty");
    toSlotName = /* @__PURE__ */ __name((slotAttr) => slotAttr, "toSlotName");
    __name(isVNode, "isVNode");
    __name(transformSlots, "transformSlots");
    __name(markRawChildren, "markRawChildren");
    __name(transformSetDirectives, "transformSetDirectives");
    __name(createVNode, "createVNode");
  }
});

// .wrangler/tmp/pages-ErOWne/renderers.mjs
async function check(Component, props, { default: children = null, ...slotted } = {}) {
  if (typeof Component !== "function") return false;
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  try {
    const result = await Component({ ...props, ...slots, children });
    return result[AstroJSX];
  } catch (e2) {
    throwEnhancedErrorIfMdxComponent(e2, Component);
  }
  return false;
}
async function renderToStaticMarkup(Component, props = {}, { default: children = null, ...slotted } = {}) {
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  const { result } = this;
  try {
    const html = await renderJSX(result, createVNode(Component, { ...props, ...slots, children }));
    return { html };
  } catch (e2) {
    throwEnhancedErrorIfMdxComponent(e2, Component);
    throw e2;
  }
}
function throwEnhancedErrorIfMdxComponent(error2, Component) {
  if (Component[Symbol.for("mdx-component")]) {
    if (AstroUserError.is(error2)) return;
    error2.title = error2.name;
    error2.hint = `This issue often occurs when your MDX component encounters runtime errors.`;
    throw error2;
  }
}
var slotName, renderer, server_default, renderers;
var init_renderers = __esm({
  ".wrangler/tmp/pages-ErOWne/renderers.mjs"() {
    "use strict";
    init_modules_watch_stub();
    init_server_QlrBW5xk();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    slotName = /* @__PURE__ */ __name((str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase()), "slotName");
    __name(check, "check");
    __name(renderToStaticMarkup, "renderToStaticMarkup");
    __name(throwEnhancedErrorIfMdxComponent, "throwEnhancedErrorIfMdxComponent");
    renderer = {
      name: "astro:jsx",
      check,
      renderToStaticMarkup
    };
    server_default = renderer;
    renderers = [Object.assign({ "name": "astro:jsx", "serverEntrypoint": "file:///Users/vivek/Desktop/self/myPortfolio/node_modules/.pnpm/@astrojs+mdx@4.2.6_astro@5.7.4_@netlify+blobs@8.2.0_@types+node@22.15.3_jiti@1.21.7_rol_2a62237d60b7194289f65749e9d162af/node_modules/@astrojs/mdx/dist/server.js" }, { ssr: server_default })];
  }
});

// .wrangler/tmp/pages-ErOWne/chunks/path_C-ZOwaTP.mjs
function appendForwardSlash(path) {
  return path.endsWith("/") ? path : path + "/";
}
function prependForwardSlash(path) {
  return path[0] === "/" ? path : "/" + path;
}
function collapseDuplicateTrailingSlashes(path, trailingSlash) {
  if (!path) {
    return path;
  }
  return path.replace(MANY_TRAILING_SLASHES, trailingSlash ? "/" : "") || "/";
}
function removeTrailingForwardSlash(path) {
  return path.endsWith("/") ? path.slice(0, path.length - 1) : path;
}
function removeLeadingForwardSlash(path) {
  return path.startsWith("/") ? path.substring(1) : path;
}
function trimSlashes(path) {
  return path.replace(/^\/|\/$/g, "");
}
function isString(path) {
  return typeof path === "string" || path instanceof String;
}
function joinPaths(...paths) {
  return paths.filter(isString).map((path, i2) => {
    if (i2 === 0) {
      return removeTrailingForwardSlash(path);
    } else if (i2 === paths.length - 1) {
      return removeLeadingForwardSlash(path);
    } else {
      return trimSlashes(path);
    }
  }).join("/");
}
function isRemotePath(src) {
  return /^(?:http|ftp|https|ws):?\/\//.test(src) || src.startsWith("data:");
}
function slash(path) {
  return path.replace(/\\/g, "/");
}
function fileExtension(path) {
  const ext = path.split(".").pop();
  return ext !== path ? `.${ext}` : "";
}
function removeBase(path, base) {
  if (path.startsWith(base)) {
    return path.slice(removeTrailingForwardSlash(base).length);
  }
  return path;
}
function hasFileExtension(path) {
  return WITH_FILE_EXT.test(path);
}
var MANY_TRAILING_SLASHES, WITH_FILE_EXT;
var init_path_C_ZOwaTP = __esm({
  ".wrangler/tmp/pages-ErOWne/chunks/path_C-ZOwaTP.mjs"() {
    "use strict";
    init_modules_watch_stub();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    __name(appendForwardSlash, "appendForwardSlash");
    __name(prependForwardSlash, "prependForwardSlash");
    MANY_TRAILING_SLASHES = /\/{2,}$/g;
    __name(collapseDuplicateTrailingSlashes, "collapseDuplicateTrailingSlashes");
    __name(removeTrailingForwardSlash, "removeTrailingForwardSlash");
    __name(removeLeadingForwardSlash, "removeLeadingForwardSlash");
    __name(trimSlashes, "trimSlashes");
    __name(isString, "isString");
    __name(joinPaths, "joinPaths");
    __name(isRemotePath, "isRemotePath");
    __name(slash, "slash");
    __name(fileExtension, "fileExtension");
    __name(removeBase, "removeBase");
    WITH_FILE_EXT = /\/[^/]+\.\w+$/;
    __name(hasFileExtension, "hasFileExtension");
  }
});

// .wrangler/tmp/pages-ErOWne/chunks/parse_EttCPxrw.mjs
function encode64(arraybuffer) {
  const dv = new DataView(arraybuffer);
  let binaryString = "";
  for (let i2 = 0; i2 < arraybuffer.byteLength; i2++) {
    binaryString += String.fromCharCode(dv.getUint8(i2));
  }
  return binaryToAscii(binaryString);
}
function decode64(string) {
  const binaryString = asciiToBinary(string);
  const arraybuffer = new ArrayBuffer(binaryString.length);
  const dv = new DataView(arraybuffer);
  for (let i2 = 0; i2 < arraybuffer.byteLength; i2++) {
    dv.setUint8(i2, binaryString.charCodeAt(i2));
  }
  return arraybuffer;
}
function asciiToBinary(data) {
  if (data.length % 4 === 0) {
    data = data.replace(/==?$/, "");
  }
  let output = "";
  let buffer = 0;
  let accumulatedBits = 0;
  for (let i2 = 0; i2 < data.length; i2++) {
    buffer <<= 6;
    buffer |= KEY_STRING.indexOf(data[i2]);
    accumulatedBits += 6;
    if (accumulatedBits === 24) {
      output += String.fromCharCode((buffer & 16711680) >> 16);
      output += String.fromCharCode((buffer & 65280) >> 8);
      output += String.fromCharCode(buffer & 255);
      buffer = accumulatedBits = 0;
    }
  }
  if (accumulatedBits === 12) {
    buffer >>= 4;
    output += String.fromCharCode(buffer);
  } else if (accumulatedBits === 18) {
    buffer >>= 2;
    output += String.fromCharCode((buffer & 65280) >> 8);
    output += String.fromCharCode(buffer & 255);
  }
  return output;
}
function binaryToAscii(str) {
  let out = "";
  for (let i2 = 0; i2 < str.length; i2 += 3) {
    const groupsOfSix = [void 0, void 0, void 0, void 0];
    groupsOfSix[0] = str.charCodeAt(i2) >> 2;
    groupsOfSix[1] = (str.charCodeAt(i2) & 3) << 4;
    if (str.length > i2 + 1) {
      groupsOfSix[1] |= str.charCodeAt(i2 + 1) >> 4;
      groupsOfSix[2] = (str.charCodeAt(i2 + 1) & 15) << 2;
    }
    if (str.length > i2 + 2) {
      groupsOfSix[2] |= str.charCodeAt(i2 + 2) >> 6;
      groupsOfSix[3] = str.charCodeAt(i2 + 2) & 63;
    }
    for (let j2 = 0; j2 < groupsOfSix.length; j2++) {
      if (typeof groupsOfSix[j2] === "undefined") {
        out += "=";
      } else {
        out += KEY_STRING[groupsOfSix[j2]];
      }
    }
  }
  return out;
}
function parse(serialized, revivers) {
  return unflatten(JSON.parse(serialized), revivers);
}
function unflatten(parsed, revivers) {
  if (typeof parsed === "number") return hydrate(parsed, true);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Invalid input");
  }
  const values = (
    /** @type {any[]} */
    parsed
  );
  const hydrated = Array(values.length);
  function hydrate(index, standalone = false) {
    if (index === UNDEFINED) return void 0;
    if (index === NAN) return NaN;
    if (index === POSITIVE_INFINITY) return Infinity;
    if (index === NEGATIVE_INFINITY) return -Infinity;
    if (index === NEGATIVE_ZERO) return -0;
    if (standalone) throw new Error(`Invalid input`);
    if (index in hydrated) return hydrated[index];
    const value = values[index];
    if (!value || typeof value !== "object") {
      hydrated[index] = value;
    } else if (Array.isArray(value)) {
      if (typeof value[0] === "string") {
        const type = value[0];
        const reviver = revivers?.[type];
        if (reviver) {
          return hydrated[index] = reviver(hydrate(value[1]));
        }
        switch (type) {
          case "Date":
            hydrated[index] = new Date(value[1]);
            break;
          case "Set":
            const set = /* @__PURE__ */ new Set();
            hydrated[index] = set;
            for (let i2 = 1; i2 < value.length; i2 += 1) {
              set.add(hydrate(value[i2]));
            }
            break;
          case "Map":
            const map = /* @__PURE__ */ new Map();
            hydrated[index] = map;
            for (let i2 = 1; i2 < value.length; i2 += 2) {
              map.set(hydrate(value[i2]), hydrate(value[i2 + 1]));
            }
            break;
          case "RegExp":
            hydrated[index] = new RegExp(value[1], value[2]);
            break;
          case "Object":
            hydrated[index] = Object(value[1]);
            break;
          case "BigInt":
            hydrated[index] = BigInt(value[1]);
            break;
          case "null":
            const obj = /* @__PURE__ */ Object.create(null);
            hydrated[index] = obj;
            for (let i2 = 1; i2 < value.length; i2 += 2) {
              obj[value[i2]] = hydrate(value[i2 + 1]);
            }
            break;
          case "Int8Array":
          case "Uint8Array":
          case "Uint8ClampedArray":
          case "Int16Array":
          case "Uint16Array":
          case "Int32Array":
          case "Uint32Array":
          case "Float32Array":
          case "Float64Array":
          case "BigInt64Array":
          case "BigUint64Array": {
            const TypedArrayConstructor = globalThis[type];
            const base64 = value[1];
            const arraybuffer = decode64(base64);
            const typedArray = new TypedArrayConstructor(arraybuffer);
            hydrated[index] = typedArray;
            break;
          }
          case "ArrayBuffer": {
            const base64 = value[1];
            const arraybuffer = decode64(base64);
            hydrated[index] = arraybuffer;
            break;
          }
          default:
            throw new Error(`Unknown type ${type}`);
        }
      } else {
        const array = new Array(value.length);
        hydrated[index] = array;
        for (let i2 = 0; i2 < value.length; i2 += 1) {
          const n2 = value[i2];
          if (n2 === HOLE) continue;
          array[i2] = hydrate(n2);
        }
      }
    } else {
      const object = {};
      hydrated[index] = object;
      for (const key in value) {
        const n2 = value[key];
        object[key] = hydrate(n2);
      }
    }
    return hydrated[index];
  }
  __name(hydrate, "hydrate");
  return hydrate(0);
}
var KEY_STRING, UNDEFINED, HOLE, NAN, POSITIVE_INFINITY, NEGATIVE_INFINITY, NEGATIVE_ZERO;
var init_parse_EttCPxrw = __esm({
  ".wrangler/tmp/pages-ErOWne/chunks/parse_EttCPxrw.mjs"() {
    "use strict";
    init_modules_watch_stub();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    __name(encode64, "encode64");
    __name(decode64, "decode64");
    KEY_STRING = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    __name(asciiToBinary, "asciiToBinary");
    __name(binaryToAscii, "binaryToAscii");
    UNDEFINED = -1;
    HOLE = -2;
    NAN = -3;
    POSITIVE_INFINITY = -4;
    NEGATIVE_INFINITY = -5;
    NEGATIVE_ZERO = -6;
    __name(parse, "parse");
    __name(unflatten, "unflatten");
  }
});

// .wrangler/tmp/pages-ErOWne/chunks/astro-designed-error-pages_C4pJJTiQ.mjs
function is_primitive(thing) {
  return Object(thing) !== thing;
}
function is_plain_object(thing) {
  const proto = Object.getPrototypeOf(thing);
  return proto === Object.prototype || proto === null || Object.getOwnPropertyNames(proto).sort().join("\0") === object_proto_names;
}
function get_type(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function get_escaped_char(char) {
  switch (char) {
    case '"':
      return '\\"';
    case "<":
      return "\\u003C";
    case "\\":
      return "\\\\";
    case "\n":
      return "\\n";
    case "\r":
      return "\\r";
    case "	":
      return "\\t";
    case "\b":
      return "\\b";
    case "\f":
      return "\\f";
    case "\u2028":
      return "\\u2028";
    case "\u2029":
      return "\\u2029";
    default:
      return char < " " ? `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}` : "";
  }
}
function stringify_string(str) {
  let result = "";
  let last_pos = 0;
  const len = str.length;
  for (let i2 = 0; i2 < len; i2 += 1) {
    const char = str[i2];
    const replacement = get_escaped_char(char);
    if (replacement) {
      result += str.slice(last_pos, i2) + replacement;
      last_pos = i2 + 1;
    }
  }
  return `"${last_pos === 0 ? str : result + str.slice(last_pos)}"`;
}
function enumerable_symbols(object) {
  return Object.getOwnPropertySymbols(object).filter(
    (symbol) => Object.getOwnPropertyDescriptor(object, symbol).enumerable
  );
}
function stringify_key(key) {
  return is_identifier.test(key) ? "." + key : "[" + JSON.stringify(key) + "]";
}
function stringify(value, reducers) {
  const stringified = [];
  const indexes = /* @__PURE__ */ new Map();
  const custom = [];
  if (reducers) {
    for (const key of Object.getOwnPropertyNames(reducers)) {
      custom.push({ key, fn: reducers[key] });
    }
  }
  const keys = [];
  let p2 = 0;
  function flatten(thing) {
    if (typeof thing === "function") {
      throw new DevalueError(`Cannot stringify a function`, keys);
    }
    if (indexes.has(thing)) return indexes.get(thing);
    if (thing === void 0) return UNDEFINED;
    if (Number.isNaN(thing)) return NAN;
    if (thing === Infinity) return POSITIVE_INFINITY;
    if (thing === -Infinity) return NEGATIVE_INFINITY;
    if (thing === 0 && 1 / thing < 0) return NEGATIVE_ZERO;
    const index2 = p2++;
    indexes.set(thing, index2);
    for (const { key, fn } of custom) {
      const value2 = fn(thing);
      if (value2) {
        stringified[index2] = `["${key}",${flatten(value2)}]`;
        return index2;
      }
    }
    let str = "";
    if (is_primitive(thing)) {
      str = stringify_primitive(thing);
    } else {
      const type = get_type(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          str = `["Object",${stringify_primitive(thing)}]`;
          break;
        case "BigInt":
          str = `["BigInt",${thing}]`;
          break;
        case "Date":
          const valid = !isNaN(thing.getDate());
          str = `["Date","${valid ? thing.toISOString() : ""}"]`;
          break;
        case "RegExp":
          const { source, flags } = thing;
          str = flags ? `["RegExp",${stringify_string(source)},"${flags}"]` : `["RegExp",${stringify_string(source)}]`;
          break;
        case "Array":
          str = "[";
          for (let i2 = 0; i2 < thing.length; i2 += 1) {
            if (i2 > 0) str += ",";
            if (i2 in thing) {
              keys.push(`[${i2}]`);
              str += flatten(thing[i2]);
              keys.pop();
            } else {
              str += HOLE;
            }
          }
          str += "]";
          break;
        case "Set":
          str = '["Set"';
          for (const value2 of thing) {
            str += `,${flatten(value2)}`;
          }
          str += "]";
          break;
        case "Map":
          str = '["Map"';
          for (const [key, value2] of thing) {
            keys.push(
              `.get(${is_primitive(key) ? stringify_primitive(key) : "..."})`
            );
            str += `,${flatten(key)},${flatten(value2)}`;
            keys.pop();
          }
          str += "]";
          break;
        case "Int8Array":
        case "Uint8Array":
        case "Uint8ClampedArray":
        case "Int16Array":
        case "Uint16Array":
        case "Int32Array":
        case "Uint32Array":
        case "Float32Array":
        case "Float64Array":
        case "BigInt64Array":
        case "BigUint64Array": {
          const typedArray = thing;
          const base64 = encode64(typedArray.buffer);
          str = '["' + type + '","' + base64 + '"]';
          break;
        }
        case "ArrayBuffer": {
          const arraybuffer = thing;
          const base64 = encode64(arraybuffer);
          str = `["ArrayBuffer","${base64}"]`;
          break;
        }
        default:
          if (!is_plain_object(thing)) {
            throw new DevalueError(
              `Cannot stringify arbitrary non-POJOs`,
              keys
            );
          }
          if (enumerable_symbols(thing).length > 0) {
            throw new DevalueError(
              `Cannot stringify POJOs with symbolic keys`,
              keys
            );
          }
          if (Object.getPrototypeOf(thing) === null) {
            str = '["null"';
            for (const key in thing) {
              keys.push(stringify_key(key));
              str += `,${stringify_string(key)},${flatten(thing[key])}`;
              keys.pop();
            }
            str += "]";
          } else {
            str = "{";
            let started = false;
            for (const key in thing) {
              if (started) str += ",";
              started = true;
              keys.push(stringify_key(key));
              str += `${stringify_string(key)}:${flatten(thing[key])}`;
              keys.pop();
            }
            str += "}";
          }
      }
    }
    stringified[index2] = str;
    return index2;
  }
  __name(flatten, "flatten");
  const index = flatten(value);
  if (index < 0) return `${index}`;
  return `[${stringified.join(",")}]`;
}
function stringify_primitive(thing) {
  const type = typeof thing;
  if (type === "string") return stringify_string(thing);
  if (thing instanceof String) return stringify_string(thing.toString());
  if (thing === void 0) return UNDEFINED.toString();
  if (thing === 0 && 1 / thing < 0) return NEGATIVE_ZERO.toString();
  if (type === "bigint") return `["BigInt","${thing}"]`;
  return String(thing);
}
function isActionError(error2) {
  return typeof error2 === "object" && error2 != null && "type" in error2 && error2.type === "AstroActionError";
}
function isInputError(error2) {
  return typeof error2 === "object" && error2 != null && "type" in error2 && error2.type === "AstroActionInputError" && "issues" in error2 && Array.isArray(error2.issues);
}
function getActionQueryString(name) {
  const searchParams = new URLSearchParams({ [ACTION_QUERY_PARAMS$1.actionName]: name });
  return `?${searchParams.toString()}`;
}
function serializeActionResult(res) {
  if (res.error) {
    if (Object.assign(__vite_import_meta_env__, {})?.DEV) {
      actionResultErrorStack.set(res.error.stack);
    }
    let body2;
    if (res.error instanceof ActionInputError) {
      body2 = {
        type: res.error.type,
        issues: res.error.issues,
        fields: res.error.fields
      };
    } else {
      body2 = {
        ...res.error,
        message: res.error.message
      };
    }
    return {
      type: "error",
      status: res.error.status,
      contentType: "application/json",
      body: JSON.stringify(body2)
    };
  }
  if (res.data === void 0) {
    return {
      type: "empty",
      status: 204
    };
  }
  let body;
  try {
    body = stringify(res.data, {
      // Add support for URL objects
      URL: /* @__PURE__ */ __name((value) => value instanceof URL && value.href, "URL")
    });
  } catch (e2) {
    let hint = ActionsReturnedInvalidDataError.hint;
    if (res.data instanceof Response) {
      hint = REDIRECT_STATUS_CODES.includes(res.data.status) ? "If you need to redirect when the action succeeds, trigger a redirect where the action is called. See the Actions guide for server and client redirect examples: https://docs.astro.build/en/guides/actions." : "If you need to return a Response object, try using a server endpoint instead. See https://docs.astro.build/en/guides/endpoints/#server-endpoints-api-routes";
    }
    throw new AstroError({
      ...ActionsReturnedInvalidDataError,
      message: ActionsReturnedInvalidDataError.message(String(e2)),
      hint
    });
  }
  return {
    type: "data",
    status: 200,
    contentType: "application/json+devalue",
    body
  };
}
function deserializeActionResult(res) {
  if (res.type === "error") {
    let json;
    try {
      json = JSON.parse(res.body);
    } catch {
      return {
        data: void 0,
        error: new ActionError({
          message: res.body,
          code: "INTERNAL_SERVER_ERROR"
        })
      };
    }
    if (Object.assign(__vite_import_meta_env__, {})?.PROD) {
      return { error: ActionError.fromJson(json), data: void 0 };
    } else {
      const error2 = ActionError.fromJson(json);
      error2.stack = actionResultErrorStack.get();
      return {
        error: error2,
        data: void 0
      };
    }
  }
  if (res.type === "empty") {
    return { data: void 0, error: void 0 };
  }
  return {
    data: parse(res.body, {
      URL: /* @__PURE__ */ __name((href) => new URL(href), "URL")
    }),
    error: void 0
  };
}
function requireDist() {
  if (hasRequiredDist) return dist;
  hasRequiredDist = 1;
  Object.defineProperty(dist, "__esModule", { value: true });
  dist.parse = parse2;
  dist.serialize = serialize;
  const cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
  const cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
  const domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
  const pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
  const __toString = Object.prototype.toString;
  const NullObject = /* @__PURE__ */ (() => {
    const C = /* @__PURE__ */ __name(function() {
    }, "C");
    C.prototype = /* @__PURE__ */ Object.create(null);
    return C;
  })();
  function parse2(str, options) {
    const obj = new NullObject();
    const len = str.length;
    if (len < 2)
      return obj;
    const dec = options?.decode || decode;
    let index = 0;
    do {
      const eqIdx = str.indexOf("=", index);
      if (eqIdx === -1)
        break;
      const colonIdx = str.indexOf(";", index);
      const endIdx = colonIdx === -1 ? len : colonIdx;
      if (eqIdx > endIdx) {
        index = str.lastIndexOf(";", eqIdx - 1) + 1;
        continue;
      }
      const keyStartIdx = startIndex(str, index, eqIdx);
      const keyEndIdx = endIndex(str, eqIdx, keyStartIdx);
      const key = str.slice(keyStartIdx, keyEndIdx);
      if (obj[key] === void 0) {
        let valStartIdx = startIndex(str, eqIdx + 1, endIdx);
        let valEndIdx = endIndex(str, endIdx, valStartIdx);
        const value = dec(str.slice(valStartIdx, valEndIdx));
        obj[key] = value;
      }
      index = endIdx + 1;
    } while (index < len);
    return obj;
  }
  __name(parse2, "parse");
  function startIndex(str, index, max) {
    do {
      const code = str.charCodeAt(index);
      if (code !== 32 && code !== 9)
        return index;
    } while (++index < max);
    return max;
  }
  __name(startIndex, "startIndex");
  function endIndex(str, index, min) {
    while (index > min) {
      const code = str.charCodeAt(--index);
      if (code !== 32 && code !== 9)
        return index + 1;
    }
    return min;
  }
  __name(endIndex, "endIndex");
  function serialize(name, val, options) {
    const enc = options?.encode || encodeURIComponent;
    if (!cookieNameRegExp.test(name)) {
      throw new TypeError(`argument name is invalid: ${name}`);
    }
    const value = enc(val);
    if (!cookieValueRegExp.test(value)) {
      throw new TypeError(`argument val is invalid: ${val}`);
    }
    let str = name + "=" + value;
    if (!options)
      return str;
    if (options.maxAge !== void 0) {
      if (!Number.isInteger(options.maxAge)) {
        throw new TypeError(`option maxAge is invalid: ${options.maxAge}`);
      }
      str += "; Max-Age=" + options.maxAge;
    }
    if (options.domain) {
      if (!domainValueRegExp.test(options.domain)) {
        throw new TypeError(`option domain is invalid: ${options.domain}`);
      }
      str += "; Domain=" + options.domain;
    }
    if (options.path) {
      if (!pathValueRegExp.test(options.path)) {
        throw new TypeError(`option path is invalid: ${options.path}`);
      }
      str += "; Path=" + options.path;
    }
    if (options.expires) {
      if (!isDate(options.expires) || !Number.isFinite(options.expires.valueOf())) {
        throw new TypeError(`option expires is invalid: ${options.expires}`);
      }
      str += "; Expires=" + options.expires.toUTCString();
    }
    if (options.httpOnly) {
      str += "; HttpOnly";
    }
    if (options.secure) {
      str += "; Secure";
    }
    if (options.partitioned) {
      str += "; Partitioned";
    }
    if (options.priority) {
      const priority = typeof options.priority === "string" ? options.priority.toLowerCase() : void 0;
      switch (priority) {
        case "low":
          str += "; Priority=Low";
          break;
        case "medium":
          str += "; Priority=Medium";
          break;
        case "high":
          str += "; Priority=High";
          break;
        default:
          throw new TypeError(`option priority is invalid: ${options.priority}`);
      }
    }
    if (options.sameSite) {
      const sameSite = typeof options.sameSite === "string" ? options.sameSite.toLowerCase() : options.sameSite;
      switch (sameSite) {
        case true:
        case "strict":
          str += "; SameSite=Strict";
          break;
        case "lax":
          str += "; SameSite=Lax";
          break;
        case "none":
          str += "; SameSite=None";
          break;
        default:
          throw new TypeError(`option sameSite is invalid: ${options.sameSite}`);
      }
    }
    return str;
  }
  __name(serialize, "serialize");
  function decode(str) {
    if (str.indexOf("%") === -1)
      return str;
    try {
      return decodeURIComponent(str);
    } catch (e2) {
      return str;
    }
  }
  __name(decode, "decode");
  function isDate(val) {
    return __toString.call(val) === "[object Date]";
  }
  __name(isDate, "isDate");
  return dist;
}
function template({
  title,
  pathname,
  statusCode = 404,
  tabTitle,
  body
}) {
  return `<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>${tabTitle}</title>
		<style>
			:root {
				--gray-10: hsl(258, 7%, 10%);
				--gray-20: hsl(258, 7%, 20%);
				--gray-30: hsl(258, 7%, 30%);
				--gray-40: hsl(258, 7%, 40%);
				--gray-50: hsl(258, 7%, 50%);
				--gray-60: hsl(258, 7%, 60%);
				--gray-70: hsl(258, 7%, 70%);
				--gray-80: hsl(258, 7%, 80%);
				--gray-90: hsl(258, 7%, 90%);
				--black: #13151A;
				--accent-light: #E0CCFA;
			}

			* {
				box-sizing: border-box;
			}

			html {
				background: var(--black);
				color-scheme: dark;
				accent-color: var(--accent-light);
			}

			body {
				background-color: var(--gray-10);
				color: var(--gray-80);
				font-family: ui-monospace, Menlo, Monaco, "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace", "Source Code Pro", "Fira Mono", "Droid Sans Mono", "Courier New", monospace;
				line-height: 1.5;
				margin: 0;
			}

			a {
				color: var(--accent-light);
			}

			.center {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				height: 100vh;
				width: 100vw;
			}

			h1 {
				margin-bottom: 8px;
				color: white;
				font-family: system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
				font-weight: 700;
				margin-top: 1rem;
				margin-bottom: 0;
			}

			.statusCode {
				color: var(--accent-light);
			}

			.astro-icon {
				height: 124px;
				width: 124px;
			}

			pre, code {
				padding: 2px 8px;
				background: rgba(0,0,0, 0.25);
				border: 1px solid rgba(255,255,255, 0.25);
				border-radius: 4px;
				font-size: 1.2em;
				margin-top: 0;
				max-width: 60em;
			}
		</style>
	</head>
	<body>
		<main class="center">
			<svg class="astro-icon" xmlns="http://www.w3.org/2000/svg" width="64" height="80" viewBox="0 0 64 80" fill="none"> <path d="M20.5253 67.6322C16.9291 64.3531 15.8793 57.4632 17.3776 52.4717C19.9755 55.6188 23.575 56.6157 27.3035 57.1784C33.0594 58.0468 38.7122 57.722 44.0592 55.0977C44.6709 54.7972 45.2362 54.3978 45.9045 53.9931C46.4062 55.4451 46.5368 56.9109 46.3616 58.4028C45.9355 62.0362 44.1228 64.8429 41.2397 66.9705C40.0868 67.8215 38.8669 68.5822 37.6762 69.3846C34.0181 71.8508 33.0285 74.7426 34.403 78.9491C34.4357 79.0516 34.4649 79.1541 34.5388 79.4042C32.6711 78.5705 31.3069 77.3565 30.2674 75.7604C29.1694 74.0757 28.6471 72.2121 28.6196 70.1957C28.6059 69.2144 28.6059 68.2244 28.4736 67.257C28.1506 64.8985 27.0406 63.8425 24.9496 63.7817C22.8036 63.7192 21.106 65.0426 20.6559 67.1268C20.6215 67.2865 20.5717 67.4446 20.5218 67.6304L20.5253 67.6322Z" fill="white"/> <path d="M20.5253 67.6322C16.9291 64.3531 15.8793 57.4632 17.3776 52.4717C19.9755 55.6188 23.575 56.6157 27.3035 57.1784C33.0594 58.0468 38.7122 57.722 44.0592 55.0977C44.6709 54.7972 45.2362 54.3978 45.9045 53.9931C46.4062 55.4451 46.5368 56.9109 46.3616 58.4028C45.9355 62.0362 44.1228 64.8429 41.2397 66.9705C40.0868 67.8215 38.8669 68.5822 37.6762 69.3846C34.0181 71.8508 33.0285 74.7426 34.403 78.9491C34.4357 79.0516 34.4649 79.1541 34.5388 79.4042C32.6711 78.5705 31.3069 77.3565 30.2674 75.7604C29.1694 74.0757 28.6471 72.2121 28.6196 70.1957C28.6059 69.2144 28.6059 68.2244 28.4736 67.257C28.1506 64.8985 27.0406 63.8425 24.9496 63.7817C22.8036 63.7192 21.106 65.0426 20.6559 67.1268C20.6215 67.2865 20.5717 67.4446 20.5218 67.6304L20.5253 67.6322Z" fill="url(#paint0_linear_738_686)"/> <path d="M0 51.6401C0 51.6401 10.6488 46.4654 21.3274 46.4654L29.3786 21.6102C29.6801 20.4082 30.5602 19.5913 31.5538 19.5913C32.5474 19.5913 33.4275 20.4082 33.7289 21.6102L41.7802 46.4654C54.4274 46.4654 63.1076 51.6401 63.1076 51.6401C63.1076 51.6401 45.0197 2.48776 44.9843 2.38914C44.4652 0.935933 43.5888 0 42.4073 0H20.7022C19.5206 0 18.6796 0.935933 18.1251 2.38914C18.086 2.4859 0 51.6401 0 51.6401Z" fill="white"/> <defs> <linearGradient id="paint0_linear_738_686" x1="31.554" y1="75.4423" x2="39.7462" y2="48.376" gradientUnits="userSpaceOnUse"> <stop stop-color="#D83333"/> <stop offset="1" stop-color="#F041FF"/> </linearGradient> </defs> </svg>
			<h1>${statusCode ? `<span class="statusCode">${statusCode}: </span> ` : ""}<span class="statusMessage">${title}</span></h1>
			${body || `
				<pre>Path: ${escape(pathname)}</pre>
			`}
			</main>
	</body>
</html>`;
}
function ensure404Route(manifest2) {
  if (!manifest2.routes.some((route) => route.route === "/404")) {
    manifest2.routes.push(DEFAULT_404_ROUTE);
  }
  return manifest2;
}
async function default404Page({ pathname }) {
  return new Response(
    template({
      statusCode: 404,
      title: "Not found",
      tabTitle: "404: Not Found",
      pathname
    }),
    { status: 404, headers: { "Content-Type": "text/html" } }
  );
}
var ImportType, E, DevalueError, object_proto_names, is_identifier, ACTION_QUERY_PARAMS$1, ACTION_RPC_ROUTE_PATTERN, __vite_import_meta_env__, ACTION_QUERY_PARAMS, codeToStatusMap, statusToCodeMap, ActionError, ActionInputError, actionResultErrorStack, dist, hasRequiredDist, distExports, DEFAULT_404_ROUTE, default404Instance;
var init_astro_designed_error_pages_C4pJJTiQ = __esm({
  ".wrangler/tmp/pages-ErOWne/chunks/astro-designed-error-pages_C4pJJTiQ.mjs"() {
    "use strict";
    init_modules_watch_stub();
    init_server_QlrBW5xk();
    init_parse_EttCPxrw();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    !function(A) {
      A[A.Static = 1] = "Static", A[A.Dynamic = 2] = "Dynamic", A[A.ImportMeta = 3] = "ImportMeta", A[A.StaticSourcePhase = 4] = "StaticSourcePhase", A[A.DynamicSourcePhase = 5] = "DynamicSourcePhase", A[A.StaticDeferPhase = 6] = "StaticDeferPhase", A[A.DynamicDeferPhase = 7] = "DynamicDeferPhase";
    }(ImportType || (ImportType = {}));
    1 === new Uint8Array(new Uint16Array([1]).buffer)[0];
    E = /* @__PURE__ */ __name(() => {
      return A = "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GzYCHAtBAEEAKAKwCkECajYCsAoCQAJAAkACQEEAECkiAUHhAEYNACABQfcARg0BQQAoArAKIQEMAgtBACgCsAoiAUECakHACEEKEC8NAUEGIQIMAgtBACgCsAoiAS8BAkHpAEcNACABLwEEQfQARw0AQQQhAiABLwEGQegARg0BC0EAIAFBfmo2ArAKDwtBACABIAJBAXRqNgKwCgJAQQEQKUH7AEYNAEEAIAE2ArAKDwtBACgCsAoiACECA0BBACACQQJqNgKwCgJAAkACQEEBECkiAkEiRg0AIAJBJ0cNAUEnEBpBAEEAKAKwCkECajYCsApBARApIQIMAgtBIhAaQQBBACgCsApBAmo2ArAKQQEQKSECDAELIAIQLCECCwJAIAJBOkYNAEEAIAE2ArAKDwtBAEEAKAKwCkECajYCsAoCQEEBECkiAkEiRg0AIAJBJ0YNAEEAIAE2ArAKDwsgAhAaQQBBACgCsApBAmo2ArAKAkACQEEBECkiAkEsRg0AIAJB/QBGDQFBACABNgKwCg8LQQBBACgCsApBAmo2ArAKQQEQKUH9AEYNAEEAKAKwCiECDAELC0EAKALwCSIBIAA2AhAgAUEAKAKwCkECajYCDAttAQJ/AkACQANAAkAgAEH//wNxIgFBd2oiAkEXSw0AQQEgAnRBn4CABHENAgsgAUGgAUYNASAAIQIgARAoDQJBACECQQBBACgCsAoiAEECajYCsAogAC8BAiIADQAMAgsLIAAhAgsgAkH//wNxC6sBAQR/AkACQEEAKAKwCiICLwEAIgNB4QBGDQAgASEEIAAhBQwBC0EAIAJBBGo2ArAKQQEQKSECQQAoArAKIQUCQAJAIAJBIkYNACACQSdGDQAgAhAsGkEAKAKwCiEEDAELIAIQGkEAQQAoArAKQQJqIgQ2ArAKC0EBECkhA0EAKAKwCiECCwJAIAIgBUYNACAFIARBACAAIAAgAUYiAhtBACABIAIbEAILIAMLcgEEf0EAKAKwCiEAQQAoArQKIQECQAJAA0AgAEECaiECIAAgAU8NAQJAAkAgAi8BACIDQaR/ag4CAQQACyACIQAgA0F2ag4EAgEBAgELIABBBGohAAwACwtBACACNgKwChAlQQAPC0EAIAI2ArAKQd0AC0kBA39BACEDAkAgAkUNAAJAA0AgAC0AACIEIAEtAAAiBUcNASABQQFqIQEgAEEBaiEAIAJBf2oiAg0ADAILCyAEIAVrIQMLIAMLC+wBAgBBgAgLzgEAAHgAcABvAHIAdABtAHAAbwByAHQAZgBvAHIAZQB0AGEAbwB1AHIAYwBlAHIAbwBtAHUAbgBjAHQAaQBvAG4AcwBzAGUAcgB0AHYAbwB5AGkAZQBkAGUAbABlAGMAbwBuAHQAaQBuAGkAbgBzAHQAYQBuAHQAeQBiAHIAZQBhAHIAZQB0AHUAcgBkAGUAYgB1AGcAZwBlAGEAdwBhAGkAdABoAHIAdwBoAGkAbABlAGkAZgBjAGEAdABjAGYAaQBuAGEAbABsAGUAbABzAABB0AkLEAEAAAACAAAAAAQAAEA5AAA=", "undefined" != typeof Buffer ? Buffer.from(A, "base64") : Uint8Array.from(atob(A), (A2) => A2.charCodeAt(0));
      var A;
    }, "E");
    WebAssembly.compile(E()).then(WebAssembly.instantiate).then(({ exports: A }) => {
    });
    DevalueError = class extends Error {
      static {
        __name(this, "DevalueError");
      }
      /**
       * @param {string} message
       * @param {string[]} keys
       */
      constructor(message, keys) {
        super(message);
        this.name = "DevalueError";
        this.path = keys.join("");
      }
    };
    __name(is_primitive, "is_primitive");
    object_proto_names = /* @__PURE__ */ Object.getOwnPropertyNames(
      Object.prototype
    ).sort().join("\0");
    __name(is_plain_object, "is_plain_object");
    __name(get_type, "get_type");
    __name(get_escaped_char, "get_escaped_char");
    __name(stringify_string, "stringify_string");
    __name(enumerable_symbols, "enumerable_symbols");
    is_identifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
    __name(stringify_key, "stringify_key");
    __name(stringify, "stringify");
    __name(stringify_primitive, "stringify_primitive");
    ACTION_QUERY_PARAMS$1 = {
      actionName: "_action"
    };
    ACTION_RPC_ROUTE_PATTERN = "/_actions/[...path]";
    __vite_import_meta_env__ = { "ASSETS_PREFIX": void 0, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": void 0, "SSR": true };
    ACTION_QUERY_PARAMS = ACTION_QUERY_PARAMS$1;
    codeToStatusMap = {
      // Implemented from tRPC error code table
      // https://trpc.io/docs/server/error-handling#error-codes
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      TIMEOUT: 405,
      CONFLICT: 409,
      PRECONDITION_FAILED: 412,
      PAYLOAD_TOO_LARGE: 413,
      UNSUPPORTED_MEDIA_TYPE: 415,
      UNPROCESSABLE_CONTENT: 422,
      TOO_MANY_REQUESTS: 429,
      CLIENT_CLOSED_REQUEST: 499,
      INTERNAL_SERVER_ERROR: 500
    };
    statusToCodeMap = Object.entries(codeToStatusMap).reduce(
      // reverse the key-value pairs
      (acc, [key, value]) => ({ ...acc, [value]: key }),
      {}
    );
    ActionError = class _ActionError extends Error {
      static {
        __name(this, "ActionError");
      }
      type = "AstroActionError";
      code = "INTERNAL_SERVER_ERROR";
      status = 500;
      constructor(params) {
        super(params.message);
        this.code = params.code;
        this.status = _ActionError.codeToStatus(params.code);
        if (params.stack) {
          this.stack = params.stack;
        }
      }
      static codeToStatus(code) {
        return codeToStatusMap[code];
      }
      static statusToCode(status) {
        return statusToCodeMap[status] ?? "INTERNAL_SERVER_ERROR";
      }
      static fromJson(body) {
        if (isInputError(body)) {
          return new ActionInputError(body.issues);
        }
        if (isActionError(body)) {
          return new _ActionError(body);
        }
        return new _ActionError({
          code: "INTERNAL_SERVER_ERROR"
        });
      }
    };
    __name(isActionError, "isActionError");
    __name(isInputError, "isInputError");
    ActionInputError = class extends ActionError {
      static {
        __name(this, "ActionInputError");
      }
      type = "AstroActionInputError";
      // We don't expose all ZodError properties.
      // Not all properties will serialize from server to client,
      // and we don't want to import the full ZodError object into the client.
      issues;
      fields;
      constructor(issues) {
        super({
          message: `Failed to validate: ${JSON.stringify(issues, null, 2)}`,
          code: "BAD_REQUEST"
        });
        this.issues = issues;
        this.fields = {};
        for (const issue of issues) {
          if (issue.path.length > 0) {
            const key = issue.path[0].toString();
            this.fields[key] ??= [];
            this.fields[key]?.push(issue.message);
          }
        }
      }
    };
    __name(getActionQueryString, "getActionQueryString");
    __name(serializeActionResult, "serializeActionResult");
    __name(deserializeActionResult, "deserializeActionResult");
    actionResultErrorStack = /* @__PURE__ */ (/* @__PURE__ */ __name(function actionResultErrorStackFn() {
      let errorStack;
      return {
        set(stack) {
          errorStack = stack;
        },
        get() {
          return errorStack;
        }
      };
    }, "actionResultErrorStackFn"))();
    dist = {};
    __name(requireDist, "requireDist");
    distExports = requireDist();
    __name(template, "template");
    DEFAULT_404_ROUTE = {
      component: DEFAULT_404_COMPONENT,
      generate: /* @__PURE__ */ __name(() => "", "generate"),
      params: [],
      pattern: /\/404/,
      prerender: false,
      pathname: "/404",
      segments: [[{ content: "404", dynamic: false, spread: false }]],
      type: "page",
      route: "/404",
      fallbackRoutes: [],
      isIndex: false,
      origin: "internal"
    };
    __name(ensure404Route, "ensure404Route");
    __name(default404Page, "default404Page");
    default404Page.isAstroComponentFactory = true;
    default404Instance = {
      default: default404Page
    };
  }
});

// .wrangler/tmp/pages-ErOWne/chunks/index_CxGlcw8S.mjs
function hasContentType(contentType, expected) {
  const type = contentType.split(";")[0].toLowerCase();
  return expected.some((t2) => type === t2);
}
function hasActionPayload(locals) {
  return "_actionPayload" in locals;
}
function createGetActionResult(locals) {
  return (actionFn) => {
    if (!hasActionPayload(locals) || actionFn.toString() !== getActionQueryString(locals._actionPayload.actionName)) {
      return void 0;
    }
    return deserializeActionResult(locals._actionPayload.actionResult);
  };
}
function createCallAction(context) {
  return (baseAction, input) => {
    Reflect.set(context, ACTION_API_CONTEXT_SYMBOL, true);
    const action = baseAction.bind(context);
    return action(input);
  };
}
function shouldAppendForwardSlash(trailingSlash, buildFormat) {
  switch (trailingSlash) {
    case "always":
      return true;
    case "never":
      return false;
    case "ignore": {
      switch (buildFormat) {
        case "directory":
          return true;
        case "preserve":
        case "file":
          return false;
      }
    }
  }
}
function redirectIsExternal(redirect) {
  if (typeof redirect === "string") {
    return redirect.startsWith("http://") || redirect.startsWith("https://");
  } else {
    return redirect.destination.startsWith("http://") || redirect.destination.startsWith("https://");
  }
}
async function renderRedirect(renderContext) {
  const {
    request: { method },
    routeData
  } = renderContext;
  const { redirect, redirectRoute } = routeData;
  const status = redirectRoute && typeof redirect === "object" ? redirect.status : method === "GET" ? 301 : 308;
  const headers = { location: encodeURI(redirectRouteGenerate(renderContext)) };
  if (redirect && redirectIsExternal(redirect)) {
    if (typeof redirect === "string") {
      return Response.redirect(redirect, status);
    } else {
      return Response.redirect(redirect.destination, status);
    }
  }
  return new Response(null, { status, headers });
}
function redirectRouteGenerate(renderContext) {
  const {
    params,
    routeData: { redirect, redirectRoute }
  } = renderContext;
  if (typeof redirectRoute !== "undefined") {
    return redirectRoute?.generate(params) || redirectRoute?.pathname || "/";
  } else if (typeof redirect === "string") {
    if (redirectIsExternal(redirect)) {
      return redirect;
    } else {
      let target = redirect;
      for (const param of Object.keys(params)) {
        const paramValue = params[param];
        target = target.replace(`[${param}]`, paramValue).replace(`[...${param}]`, paramValue);
      }
      return target;
    }
  } else if (typeof redirect === "undefined") {
    return "/";
  }
  return redirect.destination;
}
function badRequest(reason) {
  return new Response(null, {
    status: 400,
    statusText: "Bad request: " + reason
  });
}
async function getRequestData(request) {
  switch (request.method) {
    case "GET": {
      const url = new URL(request.url);
      const params = url.searchParams;
      if (!params.has("s") || !params.has("e") || !params.has("p")) {
        return badRequest("Missing required query parameters.");
      }
      const rawSlots = params.get("s");
      try {
        return {
          componentExport: params.get("e"),
          encryptedProps: params.get("p"),
          slots: JSON.parse(rawSlots)
        };
      } catch {
        return badRequest("Invalid slots format.");
      }
    }
    case "POST": {
      try {
        const raw = await request.text();
        const data = JSON.parse(raw);
        return data;
      } catch {
        return badRequest("Request format is invalid.");
      }
    }
    default: {
      return new Response(null, { status: 405 });
    }
  }
}
function createEndpoint(manifest2) {
  const page5 = /* @__PURE__ */ __name(async (result) => {
    const params = result.params;
    if (!params.name) {
      return new Response(null, {
        status: 400,
        statusText: "Bad request"
      });
    }
    const componentId = params.name;
    const data = await getRequestData(result.request);
    if (data instanceof Response) {
      return data;
    }
    const imp = manifest2.serverIslandMap?.get(componentId);
    if (!imp) {
      return new Response(null, {
        status: 404,
        statusText: "Not found"
      });
    }
    const key = await manifest2.key;
    const encryptedProps = data.encryptedProps;
    const propString = encryptedProps === "" ? "{}" : await decryptString(key, encryptedProps);
    const props = JSON.parse(propString);
    const componentModule = await imp();
    let Component = componentModule[data.componentExport];
    const slots = {};
    for (const prop in data.slots) {
      slots[prop] = createSlotValueFromString(data.slots[prop]);
    }
    result.response.headers.set("X-Robots-Tag", "noindex");
    if (isAstroComponentFactory(Component)) {
      const ServerIsland = Component;
      Component = /* @__PURE__ */ __name(function(...args) {
        return ServerIsland.apply(this, args);
      }, "Component");
      Object.assign(Component, ServerIsland);
      Component.propagation = "self";
    }
    return renderTemplate`${renderComponent(result, "Component", Component, props, slots)}`;
  }, "page");
  page5.isAstroComponentFactory = true;
  const instance = {
    default: page5,
    partial: true
  };
  return instance;
}
function matchRoute(pathname, manifest2) {
  return manifest2.routes.find((route) => {
    return route.pattern.test(pathname) || route.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(pathname));
  });
}
function isRoute404(route) {
  return ROUTE404_RE.test(route);
}
function isRoute500(route) {
  return ROUTE500_RE.test(route);
}
function isRoute404or500(route) {
  return isRoute404(route.route) || isRoute500(route.route);
}
function isRouteServerIsland(route) {
  return route.component === SERVER_ISLAND_COMPONENT;
}
function isRequestServerIsland(request, base = "") {
  const url = new URL(request.url);
  const pathname = base === "/" ? url.pathname.slice(base.length) : url.pathname.slice(base.length + 1);
  return pathname.startsWith(SERVER_ISLAND_BASE_PREFIX);
}
function requestIs404Or500(request, base = "") {
  const url = new URL(request.url);
  const pathname = url.pathname.slice(base.length);
  return isRoute404(pathname) || isRoute500(pathname);
}
function isRouteExternalRedirect(route) {
  return !!(route.type === "redirect" && route.redirect && redirectIsExternal(route.redirect));
}
function requestHasLocale(locales) {
  return function(context) {
    return pathHasLocale(context.url.pathname, locales);
  };
}
function pathHasLocale(path, locales) {
  const segments = path.split("/");
  for (const segment of segments) {
    for (const locale of locales) {
      if (typeof locale === "string") {
        if (normalizeTheLocale(segment) === normalizeTheLocale(locale)) {
          return true;
        }
      } else if (segment === locale.path) {
        return true;
      }
    }
  }
  return false;
}
function getPathByLocale(locale, locales) {
  for (const loopLocale of locales) {
    if (typeof loopLocale === "string") {
      if (loopLocale === locale) {
        return loopLocale;
      }
    } else {
      for (const code of loopLocale.codes) {
        if (code === locale) {
          return loopLocale.path;
        }
      }
    }
  }
  throw new AstroError(i18nNoLocaleFoundInPath);
}
function normalizeTheLocale(locale) {
  return locale.replaceAll("_", "-").toLowerCase();
}
function getAllCodes(locales) {
  const result = [];
  for (const loopLocale of locales) {
    if (typeof loopLocale === "string") {
      result.push(loopLocale);
    } else {
      result.push(...loopLocale.codes);
    }
  }
  return result;
}
function redirectToDefaultLocale({
  trailingSlash,
  format,
  base,
  defaultLocale
}) {
  return function(context, statusCode) {
    if (shouldAppendForwardSlash(trailingSlash, format)) {
      return context.redirect(`${appendForwardSlash(joinPaths(base, defaultLocale))}`, statusCode);
    } else {
      return context.redirect(`${joinPaths(base, defaultLocale)}`, statusCode);
    }
  };
}
function notFound({ base, locales, fallback }) {
  return function(context, response) {
    if (response?.headers.get(REROUTE_DIRECTIVE_HEADER) === "no" && typeof fallback === "undefined") {
      return response;
    }
    const url = context.url;
    const isRoot = url.pathname === base + "/" || url.pathname === base;
    if (!(isRoot || pathHasLocale(url.pathname, locales))) {
      if (response) {
        response.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
        return new Response(response.body, {
          status: 404,
          headers: response.headers
        });
      } else {
        return new Response(null, {
          status: 404,
          headers: {
            [REROUTE_DIRECTIVE_HEADER]: "no"
          }
        });
      }
    }
    return void 0;
  };
}
function redirectToFallback({
  fallback,
  locales,
  defaultLocale,
  strategy,
  base,
  fallbackType
}) {
  return async function(context, response) {
    if (response.status >= 300 && fallback) {
      const fallbackKeys = fallback ? Object.keys(fallback) : [];
      const segments = context.url.pathname.split("/");
      const urlLocale = segments.find((segment) => {
        for (const locale of locales) {
          if (typeof locale === "string") {
            if (locale === segment) {
              return true;
            }
          } else if (locale.path === segment) {
            return true;
          }
        }
        return false;
      });
      if (urlLocale && fallbackKeys.includes(urlLocale)) {
        const fallbackLocale = fallback[urlLocale];
        const pathFallbackLocale = getPathByLocale(fallbackLocale, locales);
        let newPathname;
        if (pathFallbackLocale === defaultLocale && strategy === "pathname-prefix-other-locales") {
          if (context.url.pathname.includes(`${base}`)) {
            newPathname = context.url.pathname.replace(`/${urlLocale}`, ``);
          } else {
            newPathname = context.url.pathname.replace(`/${urlLocale}`, `/`);
          }
        } else {
          newPathname = context.url.pathname.replace(`/${urlLocale}`, `/${pathFallbackLocale}`);
        }
        if (fallbackType === "rewrite") {
          return await context.rewrite(newPathname + context.url.search);
        } else {
          return context.redirect(newPathname + context.url.search);
        }
      }
    }
    return response;
  };
}
function parseLocale(header) {
  if (header === "*") {
    return [{ locale: header, qualityValue: void 0 }];
  }
  const result = [];
  const localeValues = header.split(",").map((str) => str.trim());
  for (const localeValue of localeValues) {
    const split = localeValue.split(";").map((str) => str.trim());
    const localeName = split[0];
    const qualityValue = split[1];
    if (!split) {
      continue;
    }
    if (qualityValue && qualityValue.startsWith("q=")) {
      const qualityValueAsFloat = Number.parseFloat(qualityValue.slice("q=".length));
      if (Number.isNaN(qualityValueAsFloat) || qualityValueAsFloat > 1) {
        result.push({
          locale: localeName,
          qualityValue: void 0
        });
      } else {
        result.push({
          locale: localeName,
          qualityValue: qualityValueAsFloat
        });
      }
    } else {
      result.push({
        locale: localeName,
        qualityValue: void 0
      });
    }
  }
  return result;
}
function sortAndFilterLocales(browserLocaleList, locales) {
  const normalizedLocales = getAllCodes(locales).map(normalizeTheLocale);
  return browserLocaleList.filter((browserLocale) => {
    if (browserLocale.locale !== "*") {
      return normalizedLocales.includes(normalizeTheLocale(browserLocale.locale));
    }
    return true;
  }).sort((a2, b2) => {
    if (a2.qualityValue && b2.qualityValue) {
      return Math.sign(b2.qualityValue - a2.qualityValue);
    }
    return 0;
  });
}
function computePreferredLocale(request, locales) {
  const acceptHeader = request.headers.get("Accept-Language");
  let result = void 0;
  if (acceptHeader) {
    const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
    const firstResult = browserLocaleList.at(0);
    if (firstResult && firstResult.locale !== "*") {
      for (const currentLocale of locales) {
        if (typeof currentLocale === "string") {
          if (normalizeTheLocale(currentLocale) === normalizeTheLocale(firstResult.locale)) {
            result = currentLocale;
            break;
          }
        } else {
          for (const currentCode of currentLocale.codes) {
            if (normalizeTheLocale(currentCode) === normalizeTheLocale(firstResult.locale)) {
              result = currentCode;
              break;
            }
          }
        }
      }
    }
  }
  return result;
}
function computePreferredLocaleList(request, locales) {
  const acceptHeader = request.headers.get("Accept-Language");
  let result = [];
  if (acceptHeader) {
    const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
    if (browserLocaleList.length === 1 && browserLocaleList.at(0).locale === "*") {
      return getAllCodes(locales);
    } else if (browserLocaleList.length > 0) {
      for (const browserLocale of browserLocaleList) {
        for (const loopLocale of locales) {
          if (typeof loopLocale === "string") {
            if (normalizeTheLocale(loopLocale) === normalizeTheLocale(browserLocale.locale)) {
              result.push(loopLocale);
            }
          } else {
            for (const code of loopLocale.codes) {
              if (code === browserLocale.locale) {
                result.push(code);
              }
            }
          }
        }
      }
    }
  }
  return result;
}
function computeCurrentLocale(pathname, locales, defaultLocale) {
  for (const segment of pathname.split("/")) {
    for (const locale of locales) {
      if (typeof locale === "string") {
        if (!segment.includes(locale)) continue;
        if (normalizeTheLocale(locale) === normalizeTheLocale(segment)) {
          return locale;
        }
      } else {
        if (locale.path === segment) {
          return locale.codes.at(0);
        } else {
          for (const code of locale.codes) {
            if (normalizeTheLocale(code) === normalizeTheLocale(segment)) {
              return code;
            }
          }
        }
      }
    }
  }
  for (const locale of locales) {
    if (typeof locale === "string") {
      if (locale === defaultLocale) {
        return locale;
      }
    } else {
      if (locale.path === defaultLocale) {
        return locale.codes.at(0);
      }
    }
  }
}
function attachCookiesToResponse(response, cookies) {
  Reflect.set(response, astroCookiesSymbol, cookies);
}
function getCookiesFromResponse(response) {
  let cookies = Reflect.get(response, astroCookiesSymbol);
  if (cookies != null) {
    return cookies;
  } else {
    return void 0;
  }
}
function* getSetCookiesFromResponse(response) {
  const cookies = getCookiesFromResponse(response);
  if (!cookies) {
    return [];
  }
  for (const headerValue of AstroCookies.consume(cookies)) {
    yield headerValue;
  }
  return [];
}
function createRequest({
  url,
  headers,
  method = "GET",
  body = void 0,
  logger,
  isPrerendered = false,
  routePattern,
  init: init2
}) {
  const headersObj = isPrerendered ? void 0 : headers instanceof Headers ? headers : new Headers(
    // Filter out HTTP/2 pseudo-headers. These are internally-generated headers added to all HTTP/2 requests with trusted metadata about the request.
    // Examples include `:method`, `:scheme`, `:authority`, and `:path`.
    // They are always prefixed with a colon to distinguish them from other headers, and it is an error to add the to a Headers object manually.
    // See https://httpwg.org/specs/rfc7540.html#HttpRequest
    Object.entries(headers).filter(([name]) => !name.startsWith(":"))
  );
  if (typeof url === "string") url = new URL(url);
  if (isPrerendered) {
    url.search = "";
  }
  const request = new Request(url, {
    method,
    headers: headersObj,
    // body is made available only if the request is for a page that will be on-demand rendered
    body: isPrerendered ? null : body,
    ...init2
  });
  if (isPrerendered) {
    let _headers = request.headers;
    const { value, writable, ...headersDesc } = Object.getOwnPropertyDescriptor(request, "headers") || {};
    Object.defineProperty(request, "headers", {
      ...headersDesc,
      get() {
        logger.warn(
          null,
          `\`Astro.request.headers\` was used when rendering the route \`${routePattern}'\`. \`Astro.request.headers\` is not available on prerendered pages. If you need access to request headers, make sure that the page is server-rendered using \`export const prerender = false;\` or by setting \`output\` to \`"server"\` in your Astro config to make all your pages server-rendered by default.`
        );
        return _headers;
      },
      set(newHeaders) {
        _headers = newHeaders;
      }
    });
  }
  return request;
}
function findRouteToRewrite({
  payload,
  routes: routes2,
  request,
  trailingSlash,
  buildFormat,
  base
}) {
  let newUrl = void 0;
  if (payload instanceof URL) {
    newUrl = payload;
  } else if (payload instanceof Request) {
    newUrl = new URL(payload.url);
  } else {
    newUrl = new URL(payload, new URL(request.url).origin);
  }
  let pathname = newUrl.pathname;
  const shouldAppendSlash = shouldAppendForwardSlash(trailingSlash, buildFormat);
  if (base !== "/") {
    const isBasePathRequest = newUrl.pathname === base || newUrl.pathname === removeTrailingForwardSlash(base);
    if (isBasePathRequest) {
      pathname = shouldAppendSlash ? "/" : "";
    } else if (newUrl.pathname.startsWith(base)) {
      pathname = shouldAppendSlash ? appendForwardSlash(newUrl.pathname) : removeTrailingForwardSlash(newUrl.pathname);
      pathname = pathname.slice(base.length);
    }
  }
  if (!pathname.startsWith("/") && shouldAppendSlash && newUrl.pathname.endsWith("/")) {
    pathname = prependForwardSlash(pathname);
  }
  if (pathname === "/" && base !== "/" && !shouldAppendSlash) {
    pathname = "";
  }
  if (base !== "/" && (pathname === "" || pathname === "/") && !shouldAppendSlash) {
    newUrl.pathname = removeTrailingForwardSlash(base);
  } else {
    newUrl.pathname = joinPaths(...[base, pathname].filter(Boolean));
  }
  const decodedPathname = decodeURI(pathname);
  let foundRoute;
  for (const route of routes2) {
    if (route.pattern.test(decodedPathname)) {
      foundRoute = route;
      break;
    }
  }
  if (foundRoute) {
    return {
      routeData: foundRoute,
      newUrl,
      pathname: decodedPathname
    };
  } else {
    const custom404 = routes2.find((route) => route.route === "/404");
    if (custom404) {
      return { routeData: custom404, newUrl, pathname };
    } else {
      return { routeData: DEFAULT_404_ROUTE, newUrl, pathname };
    }
  }
}
function copyRequest(newUrl, oldRequest, isPrerendered, logger, routePattern) {
  if (oldRequest.bodyUsed) {
    throw new AstroError(RewriteWithBodyUsed);
  }
  return createRequest({
    url: newUrl,
    method: oldRequest.method,
    body: oldRequest.body,
    isPrerendered,
    logger,
    headers: isPrerendered ? {} : oldRequest.headers,
    routePattern,
    init: {
      referrer: oldRequest.referrer,
      referrerPolicy: oldRequest.referrerPolicy,
      mode: oldRequest.mode,
      credentials: oldRequest.credentials,
      cache: oldRequest.cache,
      redirect: oldRequest.redirect,
      integrity: oldRequest.integrity,
      signal: oldRequest.signal,
      keepalive: oldRequest.keepalive,
      // https://fetch.spec.whatwg.org/#dom-request-duplex
      // @ts-expect-error It isn't part of the types, but undici accepts it and it allows to carry over the body to a new request
      duplex: "half"
    }
  });
}
function setOriginPathname(request, pathname) {
  Reflect.set(request, originPathnameSymbol, encodeURIComponent(pathname));
}
function getOriginPathname(request) {
  const origin = Reflect.get(request, originPathnameSymbol);
  if (origin) {
    return decodeURIComponent(origin);
  }
  return new URL(request.url).pathname;
}
function getActionContext(context) {
  const callerInfo = getCallerInfo(context);
  const actionResultAlreadySet = Boolean(context.locals._actionPayload);
  let action = void 0;
  if (callerInfo && context.request.method === "POST" && !actionResultAlreadySet) {
    action = {
      calledFrom: callerInfo.from,
      name: callerInfo.name,
      handler: /* @__PURE__ */ __name(async () => {
        const pipeline = Reflect.get(context, apiContextRoutesSymbol);
        const callerInfoName = shouldAppendForwardSlash(
          pipeline.manifest.trailingSlash,
          pipeline.manifest.buildFormat
        ) ? removeTrailingForwardSlash(callerInfo.name) : callerInfo.name;
        const baseAction = await pipeline.getAction(callerInfoName);
        let input;
        try {
          input = await parseRequestBody(context.request);
        } catch (e2) {
          if (e2 instanceof TypeError) {
            return { data: void 0, error: new ActionError({ code: "UNSUPPORTED_MEDIA_TYPE" }) };
          }
          throw e2;
        }
        const omitKeys = ["props", "getActionResult", "callAction", "redirect"];
        const actionAPIContext = Object.create(
          Object.getPrototypeOf(context),
          Object.fromEntries(
            Object.entries(Object.getOwnPropertyDescriptors(context)).filter(
              ([key]) => !omitKeys.includes(key)
            )
          )
        );
        Reflect.set(actionAPIContext, ACTION_API_CONTEXT_SYMBOL, true);
        const handler = baseAction.bind(actionAPIContext);
        return handler(input);
      }, "handler")
    };
  }
  function setActionResult(actionName, actionResult) {
    context.locals._actionPayload = {
      actionResult,
      actionName
    };
  }
  __name(setActionResult, "setActionResult");
  return {
    action,
    setActionResult,
    serializeActionResult,
    deserializeActionResult
  };
}
function getCallerInfo(ctx) {
  if (ctx.routePattern === ACTION_RPC_ROUTE_PATTERN) {
    return { from: "rpc", name: ctx.url.pathname.replace(/^.*\/_actions\//, "") };
  }
  const queryParam = ctx.url.searchParams.get(ACTION_QUERY_PARAMS.actionName);
  if (queryParam) {
    return { from: "form", name: queryParam };
  }
  return void 0;
}
async function parseRequestBody(request) {
  const contentType = request.headers.get("content-type");
  const contentLength = request.headers.get("Content-Length");
  if (!contentType) return void 0;
  if (hasContentType(contentType, formContentTypes)) {
    return await request.clone().formData();
  }
  if (hasContentType(contentType, ["application/json"])) {
    return contentLength === "0" ? void 0 : await request.clone().json();
  }
  throw new TypeError("Unsupported content type");
}
async function callMiddleware(onRequest2, apiContext, responseFunction) {
  let nextCalled = false;
  let responseFunctionPromise = void 0;
  const next = /* @__PURE__ */ __name(async (payload) => {
    nextCalled = true;
    responseFunctionPromise = responseFunction(apiContext, payload);
    return responseFunctionPromise;
  }, "next");
  let middlewarePromise = onRequest2(apiContext, next);
  return await Promise.resolve(middlewarePromise).then(async (value) => {
    if (nextCalled) {
      if (typeof value !== "undefined") {
        if (value instanceof Response === false) {
          throw new AstroError(MiddlewareNotAResponse);
        }
        return value;
      } else {
        if (responseFunctionPromise) {
          return responseFunctionPromise;
        } else {
          throw new AstroError(MiddlewareNotAResponse);
        }
      }
    } else if (typeof value === "undefined") {
      throw new AstroError(MiddlewareNoDataOrNextCalled);
    } else if (value instanceof Response === false) {
      throw new AstroError(MiddlewareNotAResponse);
    } else {
      return value;
    }
  });
}
function validateGetStaticPathsParameter([key, value], route) {
  if (!VALID_PARAM_TYPES.includes(typeof value)) {
    throw new AstroError({
      ...GetStaticPathsInvalidRouteParam,
      message: GetStaticPathsInvalidRouteParam.message(key, value, typeof value),
      location: {
        file: route
      }
    });
  }
}
function validateDynamicRouteModule(mod, {
  ssr,
  route
}) {
  if ((!ssr || route.prerender) && !mod.getStaticPaths) {
    throw new AstroError({
      ...GetStaticPathsRequired,
      location: { file: route.component }
    });
  }
}
function validateGetStaticPathsResult(result, logger, route) {
  if (!Array.isArray(result)) {
    throw new AstroError({
      ...InvalidGetStaticPathsReturn,
      message: InvalidGetStaticPathsReturn.message(typeof result),
      location: {
        file: route.component
      }
    });
  }
  result.forEach((pathObject) => {
    if (typeof pathObject === "object" && Array.isArray(pathObject) || pathObject === null) {
      throw new AstroError({
        ...InvalidGetStaticPathsEntry,
        message: InvalidGetStaticPathsEntry.message(
          Array.isArray(pathObject) ? "array" : typeof pathObject
        )
      });
    }
    if (pathObject.params === void 0 || pathObject.params === null || pathObject.params && Object.keys(pathObject.params).length === 0) {
      throw new AstroError({
        ...GetStaticPathsExpectedParams,
        location: {
          file: route.component
        }
      });
    }
    for (const [key, val] of Object.entries(pathObject.params)) {
      if (!(typeof val === "undefined" || typeof val === "string" || typeof val === "number")) {
        logger.warn(
          "router",
          `getStaticPaths() returned an invalid path param: "${key}". A string, number or undefined value was expected, but got \`${JSON.stringify(
            val
          )}\`.`
        );
      }
      if (typeof val === "string" && val === "") {
        logger.warn(
          "router",
          `getStaticPaths() returned an invalid path param: "${key}". \`undefined\` expected for an optional param, but got empty string.`
        );
      }
    }
  });
}
function stringifyParams(params, route) {
  const validatedParams = Object.entries(params).reduce((acc, next) => {
    validateGetStaticPathsParameter(next, route.component);
    const [key, value] = next;
    if (value !== void 0) {
      acc[key] = typeof value === "string" ? trimSlashes(value) : value.toString();
    }
    return acc;
  }, {});
  return route.generate(validatedParams);
}
function generatePaginateFunction(routeMatch, base) {
  return /* @__PURE__ */ __name(function paginateUtility(data, args = {}) {
    let { pageSize: _pageSize, params: _params, props: _props } = args;
    const pageSize = _pageSize || 10;
    const paramName = "page";
    const additionalParams = _params || {};
    const additionalProps = _props || {};
    let includesFirstPageNumber;
    if (routeMatch.params.includes(`...${paramName}`)) {
      includesFirstPageNumber = false;
    } else if (routeMatch.params.includes(`${paramName}`)) {
      includesFirstPageNumber = true;
    } else {
      throw new AstroError({
        ...PageNumberParamNotFound,
        message: PageNumberParamNotFound.message(paramName)
      });
    }
    const lastPage = Math.max(1, Math.ceil(data.length / pageSize));
    const result = [...Array(lastPage).keys()].map((num) => {
      const pageNum = num + 1;
      const start = pageSize === Infinity ? 0 : (pageNum - 1) * pageSize;
      const end = Math.min(start + pageSize, data.length);
      const params = {
        ...additionalParams,
        [paramName]: includesFirstPageNumber || pageNum > 1 ? String(pageNum) : void 0
      };
      const current = addRouteBase(routeMatch.generate({ ...params }), base);
      const next = pageNum === lastPage ? void 0 : addRouteBase(routeMatch.generate({ ...params, page: String(pageNum + 1) }), base);
      const prev = pageNum === 1 ? void 0 : addRouteBase(
        routeMatch.generate({
          ...params,
          page: !includesFirstPageNumber && pageNum - 1 === 1 ? void 0 : String(pageNum - 1)
        }),
        base
      );
      const first = pageNum === 1 ? void 0 : addRouteBase(
        routeMatch.generate({
          ...params,
          page: includesFirstPageNumber ? "1" : void 0
        }),
        base
      );
      const last = pageNum === lastPage ? void 0 : addRouteBase(routeMatch.generate({ ...params, page: String(lastPage) }), base);
      return {
        params,
        props: {
          ...additionalProps,
          page: {
            data: data.slice(start, end),
            start,
            end: end - 1,
            size: pageSize,
            total: data.length,
            currentPage: pageNum,
            lastPage,
            url: { current, next, prev, first, last }
          }
        }
      };
    });
    return result;
  }, "paginateUtility");
}
function addRouteBase(route, base) {
  let routeWithBase = joinPaths(base, route);
  if (routeWithBase === "") routeWithBase = "/";
  return routeWithBase;
}
async function callGetStaticPaths({
  mod,
  route,
  routeCache,
  logger,
  ssr,
  base
}) {
  const cached = routeCache.get(route);
  if (!mod) {
    throw new Error("This is an error caused by Astro and not your code. Please file an issue.");
  }
  if (cached?.staticPaths) {
    return cached.staticPaths;
  }
  validateDynamicRouteModule(mod, { ssr, route });
  if (ssr && !route.prerender) {
    const entry = Object.assign([], { keyed: /* @__PURE__ */ new Map() });
    routeCache.set(route, { ...cached, staticPaths: entry });
    return entry;
  }
  let staticPaths = [];
  if (!mod.getStaticPaths) {
    throw new Error("Unexpected Error.");
  }
  staticPaths = await mod.getStaticPaths({
    // Q: Why the cast?
    // A: So users downstream can have nicer typings, we have to make some sacrifice in our internal typings, which necessitate a cast here
    paginate: generatePaginateFunction(route, base)
  });
  validateGetStaticPathsResult(staticPaths, logger, route);
  const keyedStaticPaths = staticPaths;
  keyedStaticPaths.keyed = /* @__PURE__ */ new Map();
  for (const sp of keyedStaticPaths) {
    const paramsKey = stringifyParams(sp.params, route);
    keyedStaticPaths.keyed.set(paramsKey, sp);
  }
  routeCache.set(route, { ...cached, staticPaths: keyedStaticPaths });
  return keyedStaticPaths;
}
function findPathItemByKey(staticPaths, params, route, logger) {
  const paramsKey = stringifyParams(params, route);
  const matchedStaticPath = staticPaths.keyed.get(paramsKey);
  if (matchedStaticPath) {
    return matchedStaticPath;
  }
  logger.debug("router", `findPathItemByKey() - Unexpected cache miss looking for ${paramsKey}`);
}
function routeIsRedirect(route) {
  return route?.type === "redirect";
}
function routeIsFallback(route) {
  return route?.type === "fallback";
}
async function getProps(opts) {
  const { logger, mod, routeData: route, routeCache, pathname, serverLike, base } = opts;
  if (!route || route.pathname) {
    return {};
  }
  if (routeIsRedirect(route) || routeIsFallback(route) || route.component === DEFAULT_404_COMPONENT) {
    return {};
  }
  const staticPaths = await callGetStaticPaths({
    mod,
    route,
    routeCache,
    logger,
    ssr: serverLike,
    base
  });
  const params = getParams(route, pathname);
  const matchedStaticPath = findPathItemByKey(staticPaths, params, route, logger);
  if (!matchedStaticPath && (serverLike ? route.prerender : true)) {
    throw new AstroError({
      ...NoMatchingStaticPathFound,
      message: NoMatchingStaticPathFound.message(pathname),
      hint: NoMatchingStaticPathFound.hint([route.component])
    });
  }
  if (mod) {
    validatePrerenderEndpointCollision(route, mod, params);
  }
  const props = matchedStaticPath?.props ? { ...matchedStaticPath.props } : {};
  return props;
}
function getParams(route, pathname) {
  if (!route.params.length) return {};
  const paramsMatch = route.pattern.exec(pathname) || route.fallbackRoutes.map((fallbackRoute) => fallbackRoute.pattern.exec(pathname)).find((x) => x);
  if (!paramsMatch) return {};
  const params = {};
  route.params.forEach((key, i2) => {
    if (key.startsWith("...")) {
      params[key.slice(3)] = paramsMatch[i2 + 1] ? paramsMatch[i2 + 1] : void 0;
    } else {
      params[key] = paramsMatch[i2 + 1];
    }
  });
  return params;
}
function validatePrerenderEndpointCollision(route, mod, params) {
  if (route.type === "endpoint" && mod.getStaticPaths) {
    const lastSegment = route.segments[route.segments.length - 1];
    const paramValues = Object.values(params);
    const lastParam = paramValues[paramValues.length - 1];
    if (lastSegment.length === 1 && lastSegment[0].dynamic && lastParam === void 0) {
      throw new AstroError({
        ...PrerenderDynamicEndpointPathCollide,
        message: PrerenderDynamicEndpointPathCollide.message(route.route),
        hint: PrerenderDynamicEndpointPathCollide.hint(route.component),
        location: {
          file: route.component
        }
      });
    }
  }
}
function getFunctionExpression(slot) {
  if (!slot) return;
  const expressions = slot?.expressions?.filter((e2) => isRenderInstruction(e2) === false);
  if (expressions?.length !== 1) return;
  return expressions[0];
}
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error2) {
    if (options.strict) {
      throw error2;
    }
    return value;
  }
}
function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error2) {
    return Promise.reject(error2);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify$1(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify$1(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c2) => c2.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}
function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey(base);
  return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}
function defineDriver(factory) {
  return factory;
}
function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = /* @__PURE__ */ __name((key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  }, "getMount");
  const getMounts = /* @__PURE__ */ __name((base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  }, "getMounts");
  const onChange = /* @__PURE__ */ __name((event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  }, "onChange");
  const startWatch = /* @__PURE__ */ __name(async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  }, "startWatch");
  const stopWatch = /* @__PURE__ */ __name(async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  }, "stopWatch");
  const runBatch = /* @__PURE__ */ __name((items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = /* @__PURE__ */ __name((mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    }, "getBatch");
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r3) => r3.flat()
    );
  }, "runBatch");
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r3) => r3.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify$1(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify$1(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify$1(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey(key);
          if (!maskedMounts.some((p2) => fullKey.startsWith(p2))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p2) => !p2.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m2) => {
          if (m2.driver.clear) {
            return asyncCall(m2.driver.clear, m2.relativeBase, opts);
          }
          if (m2.driver.removeItem) {
            const keys = await m2.driver.getKeys(m2.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m2.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a2, b2) => b2.length - a2.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey(key) + ":";
      const m2 = getMount(key);
      return {
        driver: m2.driver,
        base: m2.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m2) => ({
        driver: m2.driver,
        base: m2.mountpoint
      }));
    },
    // Aliases
    keys: /* @__PURE__ */ __name((base, opts = {}) => storage.getKeys(base, opts), "keys"),
    get: /* @__PURE__ */ __name((key, opts = {}) => storage.getItem(key, opts), "get"),
    set: /* @__PURE__ */ __name((key, value, opts = {}) => storage.setItem(key, value, opts), "set"),
    has: /* @__PURE__ */ __name((key, opts = {}) => storage.hasItem(key, opts), "has"),
    del: /* @__PURE__ */ __name((key, opts = {}) => storage.removeItem(key, opts), "del"),
    remove: /* @__PURE__ */ __name((key, opts = {}) => storage.removeItem(key, opts), "remove")
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}
async function resolveSessionDriver(driver) {
  if (!driver) {
    return null;
  }
  try {
    if (driver === "fs") {
      return await import.meta.resolve(builtinDrivers.fsLite);
    }
    if (driver in builtinDrivers) {
      return await import.meta.resolve(builtinDrivers[driver]);
    }
  } catch {
    return null;
  }
  return driver;
}
function sequence(...handlers2) {
  const filtered = handlers2.filter((h2) => !!h2);
  const length = filtered.length;
  if (!length) {
    return defineMiddleware((_context, next) => {
      return next();
    });
  }
  return defineMiddleware((context, next) => {
    let carriedPayload = void 0;
    return applyHandle(0, context);
    function applyHandle(i2, handleContext) {
      const handle = filtered[i2];
      const result = handle(handleContext, async (payload) => {
        if (i2 < length - 1) {
          if (payload) {
            let newRequest;
            if (payload instanceof Request) {
              newRequest = payload;
            } else if (payload instanceof URL) {
              newRequest = new Request(payload, handleContext.request);
            } else {
              newRequest = new Request(
                new URL(payload, handleContext.url.origin),
                handleContext.request
              );
            }
            const pipeline = Reflect.get(handleContext, apiContextRoutesSymbol);
            const { routeData, pathname } = await pipeline.tryRewrite(
              payload,
              handleContext.request
            );
            if (pipeline.serverLike === true && handleContext.isPrerendered === false && routeData.prerender === true) {
              throw new AstroError({
                ...ForbiddenRewrite,
                message: ForbiddenRewrite.message(
                  handleContext.url.pathname,
                  pathname,
                  routeData.component
                ),
                hint: ForbiddenRewrite.hint(routeData.component)
              });
            }
            carriedPayload = payload;
            handleContext.request = newRequest;
            handleContext.url = new URL(newRequest.url);
            handleContext.cookies = new AstroCookies(newRequest);
            handleContext.params = getParams(routeData, pathname);
          }
          return applyHandle(i2 + 1, handleContext);
        } else {
          return next(payload ?? carriedPayload);
        }
      });
      return result;
    }
    __name(applyHandle, "applyHandle");
  });
}
function defineMiddleware(fn) {
  return fn;
}
var ACTION_API_CONTEXT_SYMBOL, formContentTypes, SERVER_ISLAND_ROUTE, SERVER_ISLAND_COMPONENT, SERVER_ISLAND_BASE_PREFIX, ROUTE404_RE, ROUTE500_RE, DELETED_EXPIRATION, DELETED_VALUE, responseSentSymbol2, identity, AstroCookie, AstroCookies, astroCookiesSymbol, VALID_PARAM_TYPES, RouteCache, Slots, suspectProtoRx, suspectConstructorRx, JsonSigRx, BASE64_PREFIX, DRIVER_NAME, memory, builtinDrivers, PERSIST_SYMBOL, DEFAULT_COOKIE_NAME, VALID_COOKIE_REGEX, unflatten2, stringify2, AstroSession, apiContextRoutesSymbol, RenderContext;
var init_index_CxGlcw8S = __esm({
  ".wrangler/tmp/pages-ErOWne/chunks/index_CxGlcw8S.mjs"() {
    "use strict";
    init_modules_watch_stub();
    init_astro_designed_error_pages_C4pJJTiQ();
    init_server_QlrBW5xk();
    init_path_C_ZOwaTP();
    init_parse_EttCPxrw();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    ACTION_API_CONTEXT_SYMBOL = Symbol.for("astro.actionAPIContext");
    formContentTypes = ["application/x-www-form-urlencoded", "multipart/form-data"];
    __name(hasContentType, "hasContentType");
    __name(hasActionPayload, "hasActionPayload");
    __name(createGetActionResult, "createGetActionResult");
    __name(createCallAction, "createCallAction");
    __name(shouldAppendForwardSlash, "shouldAppendForwardSlash");
    __name(redirectIsExternal, "redirectIsExternal");
    __name(renderRedirect, "renderRedirect");
    __name(redirectRouteGenerate, "redirectRouteGenerate");
    SERVER_ISLAND_ROUTE = "/_server-islands/[name]";
    SERVER_ISLAND_COMPONENT = "_server-islands.astro";
    SERVER_ISLAND_BASE_PREFIX = "_server-islands";
    __name(badRequest, "badRequest");
    __name(getRequestData, "getRequestData");
    __name(createEndpoint, "createEndpoint");
    __name(matchRoute, "matchRoute");
    ROUTE404_RE = /^\/404\/?$/;
    ROUTE500_RE = /^\/500\/?$/;
    __name(isRoute404, "isRoute404");
    __name(isRoute500, "isRoute500");
    __name(isRoute404or500, "isRoute404or500");
    __name(isRouteServerIsland, "isRouteServerIsland");
    __name(isRequestServerIsland, "isRequestServerIsland");
    __name(requestIs404Or500, "requestIs404Or500");
    __name(isRouteExternalRedirect, "isRouteExternalRedirect");
    __name(requestHasLocale, "requestHasLocale");
    __name(pathHasLocale, "pathHasLocale");
    __name(getPathByLocale, "getPathByLocale");
    __name(normalizeTheLocale, "normalizeTheLocale");
    __name(getAllCodes, "getAllCodes");
    __name(redirectToDefaultLocale, "redirectToDefaultLocale");
    __name(notFound, "notFound");
    __name(redirectToFallback, "redirectToFallback");
    __name(parseLocale, "parseLocale");
    __name(sortAndFilterLocales, "sortAndFilterLocales");
    __name(computePreferredLocale, "computePreferredLocale");
    __name(computePreferredLocaleList, "computePreferredLocaleList");
    __name(computeCurrentLocale, "computeCurrentLocale");
    DELETED_EXPIRATION = /* @__PURE__ */ new Date(0);
    DELETED_VALUE = "deleted";
    responseSentSymbol2 = Symbol.for("astro.responseSent");
    identity = /* @__PURE__ */ __name((value) => value, "identity");
    AstroCookie = class {
      static {
        __name(this, "AstroCookie");
      }
      constructor(value) {
        this.value = value;
      }
      json() {
        if (this.value === void 0) {
          throw new Error(`Cannot convert undefined to an object.`);
        }
        return JSON.parse(this.value);
      }
      number() {
        return Number(this.value);
      }
      boolean() {
        if (this.value === "false") return false;
        if (this.value === "0") return false;
        return Boolean(this.value);
      }
    };
    AstroCookies = class {
      static {
        __name(this, "AstroCookies");
      }
      #request;
      #requestValues;
      #outgoing;
      #consumed;
      constructor(request) {
        this.#request = request;
        this.#requestValues = null;
        this.#outgoing = null;
        this.#consumed = false;
      }
      /**
       * Astro.cookies.delete(key) is used to delete a cookie. Using this method will result
       * in a Set-Cookie header added to the response.
       * @param key The cookie to delete
       * @param options Options related to this deletion, such as the path of the cookie.
       */
      delete(key, options) {
        const {
          // @ts-expect-error
          maxAge: _ignoredMaxAge,
          // @ts-expect-error
          expires: _ignoredExpires,
          ...sanitizedOptions
        } = options || {};
        const serializeOptions = {
          expires: DELETED_EXPIRATION,
          ...sanitizedOptions
        };
        this.#ensureOutgoingMap().set(key, [
          DELETED_VALUE,
          distExports.serialize(key, DELETED_VALUE, serializeOptions),
          false
        ]);
      }
      /**
       * Astro.cookies.get(key) is used to get a cookie value. The cookie value is read from the
       * request. If you have set a cookie via Astro.cookies.set(key, value), the value will be taken
       * from that set call, overriding any values already part of the request.
       * @param key The cookie to get.
       * @returns An object containing the cookie value as well as convenience methods for converting its value.
       */
      get(key, options = void 0) {
        if (this.#outgoing?.has(key)) {
          let [serializedValue, , isSetValue] = this.#outgoing.get(key);
          if (isSetValue) {
            return new AstroCookie(serializedValue);
          } else {
            return void 0;
          }
        }
        const decode = options?.decode ?? decodeURIComponent;
        const values = this.#ensureParsed();
        if (key in values) {
          const value = values[key];
          if (value) {
            return new AstroCookie(decode(value));
          }
        }
      }
      /**
       * Astro.cookies.has(key) returns a boolean indicating whether this cookie is either
       * part of the initial request or set via Astro.cookies.set(key)
       * @param key The cookie to check for.
       * @param _options This parameter is no longer used.
       * @returns
       */
      has(key, _options) {
        if (this.#outgoing?.has(key)) {
          let [, , isSetValue] = this.#outgoing.get(key);
          return isSetValue;
        }
        const values = this.#ensureParsed();
        return values[key] !== void 0;
      }
      /**
       * Astro.cookies.set(key, value) is used to set a cookie's value. If provided
       * an object it will be stringified via JSON.stringify(value). Additionally you
       * can provide options customizing how this cookie will be set, such as setting httpOnly
       * in order to prevent the cookie from being read in client-side JavaScript.
       * @param key The name of the cookie to set.
       * @param value A value, either a string or other primitive or an object.
       * @param options Options for the cookie, such as the path and security settings.
       */
      set(key, value, options) {
        if (this.#consumed) {
          const warning = new Error(
            "Astro.cookies.set() was called after the cookies had already been sent to the browser.\nThis may have happened if this method was called in an imported component.\nPlease make sure that Astro.cookies.set() is only called in the frontmatter of the main page."
          );
          warning.name = "Warning";
          console.warn(warning);
        }
        let serializedValue;
        if (typeof value === "string") {
          serializedValue = value;
        } else {
          let toStringValue = value.toString();
          if (toStringValue === Object.prototype.toString.call(value)) {
            serializedValue = JSON.stringify(value);
          } else {
            serializedValue = toStringValue;
          }
        }
        const serializeOptions = {};
        if (options) {
          Object.assign(serializeOptions, options);
        }
        this.#ensureOutgoingMap().set(key, [
          serializedValue,
          distExports.serialize(key, serializedValue, serializeOptions),
          true
        ]);
        if (this.#request[responseSentSymbol2]) {
          throw new AstroError({
            ...ResponseSentError
          });
        }
      }
      /**
       * Merges a new AstroCookies instance into the current instance. Any new cookies
       * will be added to the current instance, overwriting any existing cookies with the same name.
       */
      merge(cookies) {
        const outgoing = cookies.#outgoing;
        if (outgoing) {
          for (const [key, value] of outgoing) {
            this.#ensureOutgoingMap().set(key, value);
          }
        }
      }
      /**
       * Astro.cookies.header() returns an iterator for the cookies that have previously
       * been set by either Astro.cookies.set() or Astro.cookies.delete().
       * This method is primarily used by adapters to set the header on outgoing responses.
       * @returns
       */
      *headers() {
        if (this.#outgoing == null) return;
        for (const [, value] of this.#outgoing) {
          yield value[1];
        }
      }
      /**
       * Behaves the same as AstroCookies.prototype.headers(),
       * but allows a warning when cookies are set after the instance is consumed.
       */
      static consume(cookies) {
        cookies.#consumed = true;
        return cookies.headers();
      }
      #ensureParsed() {
        if (!this.#requestValues) {
          this.#parse();
        }
        if (!this.#requestValues) {
          this.#requestValues = {};
        }
        return this.#requestValues;
      }
      #ensureOutgoingMap() {
        if (!this.#outgoing) {
          this.#outgoing = /* @__PURE__ */ new Map();
        }
        return this.#outgoing;
      }
      #parse() {
        const raw = this.#request.headers.get("cookie");
        if (!raw) {
          return;
        }
        this.#requestValues = distExports.parse(raw, { decode: identity });
      }
    };
    astroCookiesSymbol = Symbol.for("astro.cookies");
    __name(attachCookiesToResponse, "attachCookiesToResponse");
    __name(getCookiesFromResponse, "getCookiesFromResponse");
    __name(getSetCookiesFromResponse, "getSetCookiesFromResponse");
    __name(createRequest, "createRequest");
    __name(findRouteToRewrite, "findRouteToRewrite");
    __name(copyRequest, "copyRequest");
    __name(setOriginPathname, "setOriginPathname");
    __name(getOriginPathname, "getOriginPathname");
    __name(getActionContext, "getActionContext");
    __name(getCallerInfo, "getCallerInfo");
    __name(parseRequestBody, "parseRequestBody");
    __name(callMiddleware, "callMiddleware");
    VALID_PARAM_TYPES = ["string", "number", "undefined"];
    __name(validateGetStaticPathsParameter, "validateGetStaticPathsParameter");
    __name(validateDynamicRouteModule, "validateDynamicRouteModule");
    __name(validateGetStaticPathsResult, "validateGetStaticPathsResult");
    __name(stringifyParams, "stringifyParams");
    __name(generatePaginateFunction, "generatePaginateFunction");
    __name(addRouteBase, "addRouteBase");
    __name(callGetStaticPaths, "callGetStaticPaths");
    RouteCache = class {
      static {
        __name(this, "RouteCache");
      }
      logger;
      cache = {};
      runtimeMode;
      constructor(logger, runtimeMode = "production") {
        this.logger = logger;
        this.runtimeMode = runtimeMode;
      }
      /** Clear the cache. */
      clearAll() {
        this.cache = {};
      }
      set(route, entry) {
        const key = this.key(route);
        if (this.runtimeMode === "production" && this.cache[key]?.staticPaths) {
          this.logger.warn(null, `Internal Warning: route cache overwritten. (${key})`);
        }
        this.cache[key] = entry;
      }
      get(route) {
        return this.cache[this.key(route)];
      }
      key(route) {
        return `${route.route}_${route.component}`;
      }
    };
    __name(findPathItemByKey, "findPathItemByKey");
    __name(routeIsRedirect, "routeIsRedirect");
    __name(routeIsFallback, "routeIsFallback");
    __name(getProps, "getProps");
    __name(getParams, "getParams");
    __name(validatePrerenderEndpointCollision, "validatePrerenderEndpointCollision");
    __name(getFunctionExpression, "getFunctionExpression");
    Slots = class {
      static {
        __name(this, "Slots");
      }
      #result;
      #slots;
      #logger;
      constructor(result, slots, logger) {
        this.#result = result;
        this.#slots = slots;
        this.#logger = logger;
        if (slots) {
          for (const key of Object.keys(slots)) {
            if (this[key] !== void 0) {
              throw new AstroError({
                ...ReservedSlotName,
                message: ReservedSlotName.message(key)
              });
            }
            Object.defineProperty(this, key, {
              get() {
                return true;
              },
              enumerable: true
            });
          }
        }
      }
      has(name) {
        if (!this.#slots) return false;
        return Boolean(this.#slots[name]);
      }
      async render(name, args = []) {
        if (!this.#slots || !this.has(name)) return;
        const result = this.#result;
        if (!Array.isArray(args)) {
          this.#logger.warn(
            null,
            `Expected second parameter to be an array, received a ${typeof args}. If you're trying to pass an array as a single argument and getting unexpected results, make sure you're passing your array as a item of an array. Ex: Astro.slots.render('default', [["Hello", "World"]])`
          );
        } else if (args.length > 0) {
          const slotValue = this.#slots[name];
          const component = typeof slotValue === "function" ? await slotValue(result) : await slotValue;
          const expression = getFunctionExpression(component);
          if (expression) {
            const slot = /* @__PURE__ */ __name(async () => typeof expression === "function" ? expression(...args) : expression, "slot");
            return await renderSlotToString(result, slot).then((res) => {
              return res;
            });
          }
          if (typeof component === "function") {
            return await renderJSX(result, component(...args)).then(
              (res) => res != null ? String(res) : res
            );
          }
        }
        const content = await renderSlotToString(result, this.#slots[name]);
        const outHTML = chunkToString(result, content);
        return outHTML;
      }
    };
    suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
    suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
    JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
    __name(jsonParseTransform, "jsonParseTransform");
    __name(warnKeyDropped, "warnKeyDropped");
    __name(destr, "destr");
    __name(wrapToPromise, "wrapToPromise");
    __name(asyncCall, "asyncCall");
    __name(isPrimitive, "isPrimitive");
    __name(isPureObject, "isPureObject");
    __name(stringify$1, "stringify$1");
    BASE64_PREFIX = "base64:";
    __name(serializeRaw, "serializeRaw");
    __name(deserializeRaw, "deserializeRaw");
    __name(base64Decode, "base64Decode");
    __name(base64Encode, "base64Encode");
    __name(normalizeKey, "normalizeKey");
    __name(joinKeys, "joinKeys");
    __name(normalizeBaseKey, "normalizeBaseKey");
    __name(filterKeyByDepth, "filterKeyByDepth");
    __name(filterKeyByBase, "filterKeyByBase");
    __name(defineDriver, "defineDriver");
    DRIVER_NAME = "memory";
    memory = defineDriver(() => {
      const data = /* @__PURE__ */ new Map();
      return {
        name: DRIVER_NAME,
        getInstance: /* @__PURE__ */ __name(() => data, "getInstance"),
        hasItem(key) {
          return data.has(key);
        },
        getItem(key) {
          return data.get(key) ?? null;
        },
        getItemRaw(key) {
          return data.get(key) ?? null;
        },
        setItem(key, value) {
          data.set(key, value);
        },
        setItemRaw(key, value) {
          data.set(key, value);
        },
        removeItem(key) {
          data.delete(key);
        },
        getKeys() {
          return [...data.keys()];
        },
        clear() {
          data.clear();
        },
        dispose() {
          data.clear();
        }
      };
    });
    __name(createStorage, "createStorage");
    __name(watch, "watch");
    __name(dispose, "dispose");
    builtinDrivers = {
      "azure-app-configuration": "unstorage/drivers/azure-app-configuration",
      "azureAppConfiguration": "unstorage/drivers/azure-app-configuration",
      "azure-cosmos": "unstorage/drivers/azure-cosmos",
      "azureCosmos": "unstorage/drivers/azure-cosmos",
      "azure-key-vault": "unstorage/drivers/azure-key-vault",
      "azureKeyVault": "unstorage/drivers/azure-key-vault",
      "azure-storage-blob": "unstorage/drivers/azure-storage-blob",
      "azureStorageBlob": "unstorage/drivers/azure-storage-blob",
      "azure-storage-table": "unstorage/drivers/azure-storage-table",
      "azureStorageTable": "unstorage/drivers/azure-storage-table",
      "capacitor-preferences": "unstorage/drivers/capacitor-preferences",
      "capacitorPreferences": "unstorage/drivers/capacitor-preferences",
      "cloudflare-kv-binding": "unstorage/drivers/cloudflare-kv-binding",
      "cloudflareKVBinding": "unstorage/drivers/cloudflare-kv-binding",
      "cloudflare-kv-http": "unstorage/drivers/cloudflare-kv-http",
      "cloudflareKVHttp": "unstorage/drivers/cloudflare-kv-http",
      "cloudflare-r2-binding": "unstorage/drivers/cloudflare-r2-binding",
      "cloudflareR2Binding": "unstorage/drivers/cloudflare-r2-binding",
      "db0": "unstorage/drivers/db0",
      "deno-kv-node": "unstorage/drivers/deno-kv-node",
      "denoKVNode": "unstorage/drivers/deno-kv-node",
      "deno-kv": "unstorage/drivers/deno-kv",
      "denoKV": "unstorage/drivers/deno-kv",
      "fs-lite": "unstorage/drivers/fs-lite",
      "fsLite": "unstorage/drivers/fs-lite",
      "fs": "unstorage/drivers/fs",
      "github": "unstorage/drivers/github",
      "http": "unstorage/drivers/http",
      "indexedb": "unstorage/drivers/indexedb",
      "localstorage": "unstorage/drivers/localstorage",
      "lru-cache": "unstorage/drivers/lru-cache",
      "lruCache": "unstorage/drivers/lru-cache",
      "memory": "unstorage/drivers/memory",
      "mongodb": "unstorage/drivers/mongodb",
      "netlify-blobs": "unstorage/drivers/netlify-blobs",
      "netlifyBlobs": "unstorage/drivers/netlify-blobs",
      "null": "unstorage/drivers/null",
      "overlay": "unstorage/drivers/overlay",
      "planetscale": "unstorage/drivers/planetscale",
      "redis": "unstorage/drivers/redis",
      "s3": "unstorage/drivers/s3",
      "session-storage": "unstorage/drivers/session-storage",
      "sessionStorage": "unstorage/drivers/session-storage",
      "uploadthing": "unstorage/drivers/uploadthing",
      "upstash": "unstorage/drivers/upstash",
      "vercel-blob": "unstorage/drivers/vercel-blob",
      "vercelBlob": "unstorage/drivers/vercel-blob",
      "vercel-kv": "unstorage/drivers/vercel-kv",
      "vercelKV": "unstorage/drivers/vercel-kv"
    };
    PERSIST_SYMBOL = Symbol();
    DEFAULT_COOKIE_NAME = "astro-session";
    VALID_COOKIE_REGEX = /^[\w-]+$/;
    unflatten2 = /* @__PURE__ */ __name((parsed, _) => {
      return unflatten(parsed, {
        URL: /* @__PURE__ */ __name((href) => new URL(href), "URL")
      });
    }, "unflatten");
    stringify2 = /* @__PURE__ */ __name((data, _) => {
      return stringify(data, {
        // Support URL objects
        URL: /* @__PURE__ */ __name((val) => val instanceof URL && val.href, "URL")
      });
    }, "stringify");
    AstroSession = class _AstroSession {
      static {
        __name(this, "AstroSession");
      }
      // The cookies object.
      #cookies;
      // The session configuration.
      #config;
      // The cookie config
      #cookieConfig;
      // The cookie name
      #cookieName;
      // The unstorage object for the session driver.
      #storage;
      #data;
      // The session ID. A v4 UUID.
      #sessionID;
      // Sessions to destroy. Needed because we won't have the old session ID after it's destroyed locally.
      #toDestroy = /* @__PURE__ */ new Set();
      // Session keys to delete. Used for partial data sets to avoid overwriting the deleted value.
      #toDelete = /* @__PURE__ */ new Set();
      // Whether the session is dirty and needs to be saved.
      #dirty = false;
      // Whether the session cookie has been set.
      #cookieSet = false;
      // The local data is "partial" if it has not been loaded from storage yet and only
      // contains values that have been set or deleted in-memory locally.
      // We do this to avoid the need to block on loading data when it is only being set.
      // When we load the data from storage, we need to merge it with the local partial data,
      // preserving in-memory changes and deletions.
      #partial = true;
      static #sharedStorage = /* @__PURE__ */ new Map();
      constructor(cookies, {
        cookie: cookieConfig = DEFAULT_COOKIE_NAME,
        ...config
      }, runtimeMode) {
        this.#cookies = cookies;
        let cookieConfigObject;
        if (typeof cookieConfig === "object") {
          const { name = DEFAULT_COOKIE_NAME, ...rest } = cookieConfig;
          this.#cookieName = name;
          cookieConfigObject = rest;
        } else {
          this.#cookieName = cookieConfig || DEFAULT_COOKIE_NAME;
        }
        this.#cookieConfig = {
          sameSite: "lax",
          secure: runtimeMode === "production",
          path: "/",
          ...cookieConfigObject,
          httpOnly: true
        };
        this.#config = config;
      }
      /**
       * Gets a session value. Returns `undefined` if the session or value does not exist.
       */
      async get(key) {
        return (await this.#ensureData()).get(key)?.data;
      }
      /**
       * Checks if a session value exists.
       */
      async has(key) {
        return (await this.#ensureData()).has(key);
      }
      /**
       * Gets all session values.
       */
      async keys() {
        return (await this.#ensureData()).keys();
      }
      /**
       * Gets all session values.
       */
      async values() {
        return [...(await this.#ensureData()).values()].map((entry) => entry.data);
      }
      /**
       * Gets all session entries.
       */
      async entries() {
        return [...(await this.#ensureData()).entries()].map(([key, entry]) => [key, entry.data]);
      }
      /**
       * Deletes a session value.
       */
      delete(key) {
        this.#data?.delete(key);
        if (this.#partial) {
          this.#toDelete.add(key);
        }
        this.#dirty = true;
      }
      /**
       * Sets a session value. The session is created if it does not exist.
       */
      set(key, value, { ttl } = {}) {
        if (!key) {
          throw new AstroError({
            ...SessionStorageSaveError,
            message: "The session key was not provided."
          });
        }
        let cloned;
        try {
          cloned = unflatten2(JSON.parse(stringify2(value)));
        } catch (err) {
          throw new AstroError(
            {
              ...SessionStorageSaveError,
              message: `The session data for ${key} could not be serialized.`,
              hint: "See the devalue library for all supported types: https://github.com/rich-harris/devalue"
            },
            { cause: err }
          );
        }
        if (!this.#cookieSet) {
          this.#setCookie();
          this.#cookieSet = true;
        }
        this.#data ??= /* @__PURE__ */ new Map();
        const lifetime = ttl ?? this.#config.ttl;
        const expires = typeof lifetime === "number" ? Date.now() + lifetime * 1e3 : lifetime;
        this.#data.set(key, {
          data: cloned,
          expires
        });
        this.#dirty = true;
      }
      /**
       * Destroys the session, clearing the cookie and storage if it exists.
       */
      destroy() {
        this.#destroySafe();
      }
      /**
       * Regenerates the session, creating a new session ID. The existing session data is preserved.
       */
      async regenerate() {
        let data = /* @__PURE__ */ new Map();
        try {
          data = await this.#ensureData();
        } catch (err) {
          console.error("Failed to load session data during regeneration:", err);
        }
        const oldSessionId = this.#sessionID;
        this.#sessionID = crypto.randomUUID();
        this.#data = data;
        await this.#setCookie();
        if (oldSessionId && this.#storage) {
          this.#storage.removeItem(oldSessionId).catch((err) => {
            console.error("Failed to remove old session data:", err);
          });
        }
      }
      // Persists the session data to storage.
      // This is called automatically at the end of the request.
      // Uses a symbol to prevent users from calling it directly.
      async [PERSIST_SYMBOL]() {
        if (!this.#dirty && !this.#toDestroy.size) {
          return;
        }
        const storage = await this.#ensureStorage();
        if (this.#dirty && this.#data) {
          const data = await this.#ensureData();
          this.#toDelete.forEach((key2) => data.delete(key2));
          const key = this.#ensureSessionID();
          let serialized;
          try {
            serialized = stringify2(data);
          } catch (err) {
            throw new AstroError(
              {
                ...SessionStorageSaveError,
                message: SessionStorageSaveError.message(
                  "The session data could not be serialized.",
                  this.#config.driver
                )
              },
              { cause: err }
            );
          }
          await storage.setItem(key, serialized);
          this.#dirty = false;
        }
        if (this.#toDestroy.size > 0) {
          const cleanupPromises = [...this.#toDestroy].map(
            (sessionId) => storage.removeItem(sessionId).catch((err) => {
              console.error(`Failed to clean up session ${sessionId}:`, err);
            })
          );
          await Promise.all(cleanupPromises);
          this.#toDestroy.clear();
        }
      }
      get sessionID() {
        return this.#sessionID;
      }
      /**
       * Loads a session from storage with the given ID, and replaces the current session.
       * Any changes made to the current session will be lost.
       * This is not normally needed, as the session is automatically loaded using the cookie.
       * However it can be used to restore a session where the ID has been recorded somewhere
       * else (e.g. in a database).
       */
      async load(sessionID) {
        this.#sessionID = sessionID;
        this.#data = void 0;
        await this.#setCookie();
        await this.#ensureData();
      }
      /**
       * Sets the session cookie.
       */
      async #setCookie() {
        if (!VALID_COOKIE_REGEX.test(this.#cookieName)) {
          throw new AstroError({
            ...SessionStorageSaveError,
            message: "Invalid cookie name. Cookie names can only contain letters, numbers, and dashes."
          });
        }
        const value = this.#ensureSessionID();
        this.#cookies.set(this.#cookieName, value, this.#cookieConfig);
      }
      /**
       * Attempts to load the session data from storage, or creates a new data object if none exists.
       * If there is existing partial data, it will be merged into the new data object.
       */
      async #ensureData() {
        const storage = await this.#ensureStorage();
        if (this.#data && !this.#partial) {
          return this.#data;
        }
        this.#data ??= /* @__PURE__ */ new Map();
        const raw = await storage.get(this.#ensureSessionID());
        if (!raw) {
          return this.#data;
        }
        try {
          const storedMap = unflatten2(raw);
          if (!(storedMap instanceof Map)) {
            await this.#destroySafe();
            throw new AstroError({
              ...SessionStorageInitError,
              message: SessionStorageInitError.message(
                "The session data was an invalid type.",
                this.#config.driver
              )
            });
          }
          const now = Date.now();
          for (const [key, value] of storedMap) {
            const expired = typeof value.expires === "number" && value.expires < now;
            if (!this.#data.has(key) && !this.#toDelete.has(key) && !expired) {
              this.#data.set(key, value);
            }
          }
          this.#partial = false;
          return this.#data;
        } catch (err) {
          await this.#destroySafe();
          if (err instanceof AstroError) {
            throw err;
          }
          throw new AstroError(
            {
              ...SessionStorageInitError,
              message: SessionStorageInitError.message(
                "The session data could not be parsed.",
                this.#config.driver
              )
            },
            { cause: err }
          );
        }
      }
      /**
       * Safely destroys the session, clearing the cookie and storage if it exists.
       */
      #destroySafe() {
        if (this.#sessionID) {
          this.#toDestroy.add(this.#sessionID);
        }
        if (this.#cookieName) {
          this.#cookies.delete(this.#cookieName, this.#cookieConfig);
        }
        this.#sessionID = void 0;
        this.#data = void 0;
        this.#dirty = true;
      }
      /**
       * Returns the session ID, generating a new one if it does not exist.
       */
      #ensureSessionID() {
        this.#sessionID ??= this.#cookies.get(this.#cookieName)?.value ?? crypto.randomUUID();
        return this.#sessionID;
      }
      /**
       * Ensures the storage is initialized.
       * This is called automatically when a storage operation is needed.
       */
      async #ensureStorage() {
        if (this.#storage) {
          return this.#storage;
        }
        if (_AstroSession.#sharedStorage.has(this.#config.driver)) {
          this.#storage = _AstroSession.#sharedStorage.get(this.#config.driver);
          return this.#storage;
        }
        if (this.#config.driver === "test") {
          this.#storage = this.#config.options.mockStorage;
          return this.#storage;
        }
        if (this.#config.driver === "fs" || this.#config.driver === "fsLite" || this.#config.driver === "fs-lite") {
          this.#config.options ??= {};
          this.#config.driver = "fs-lite";
          this.#config.options.base ??= ".astro/session";
        }
        if (!this.#config?.driver) {
          throw new AstroError({
            ...SessionStorageInitError,
            message: SessionStorageInitError.message(
              "No driver was defined in the session configuration and the adapter did not provide a default driver."
            )
          });
        }
        let driver = null;
        const driverPackage = await resolveSessionDriver(this.#config.driver);
        try {
          if (this.#config.driverModule) {
            driver = (await this.#config.driverModule()).default;
          } else if (driverPackage) {
            driver = (await import(driverPackage)).default;
          }
        } catch (err) {
          if (err.code === "ERR_MODULE_NOT_FOUND") {
            throw new AstroError(
              {
                ...SessionStorageInitError,
                message: SessionStorageInitError.message(
                  err.message.includes(`Cannot find package '${driverPackage}'`) ? "The driver module could not be found." : err.message,
                  this.#config.driver
                )
              },
              { cause: err }
            );
          }
          throw err;
        }
        if (!driver) {
          throw new AstroError({
            ...SessionStorageInitError,
            message: SessionStorageInitError.message(
              "The module did not export a driver.",
              this.#config.driver
            )
          });
        }
        try {
          this.#storage = createStorage({
            driver: driver(this.#config.options)
          });
          _AstroSession.#sharedStorage.set(this.#config.driver, this.#storage);
          return this.#storage;
        } catch (err) {
          throw new AstroError(
            {
              ...SessionStorageInitError,
              message: SessionStorageInitError.message("Unknown error", this.#config.driver)
            },
            { cause: err }
          );
        }
      }
    };
    __name(resolveSessionDriver, "resolveSessionDriver");
    apiContextRoutesSymbol = Symbol.for("context.routes");
    RenderContext = class _RenderContext {
      static {
        __name(this, "RenderContext");
      }
      constructor(pipeline, locals, middleware, actions, pathname, request, routeData, status, clientAddress, cookies = new AstroCookies(request), params = getParams(routeData, pathname), url = new URL(request.url), props = {}, partial = void 0, session = pipeline.manifest.sessionConfig ? new AstroSession(cookies, pipeline.manifest.sessionConfig, pipeline.runtimeMode) : void 0) {
        this.pipeline = pipeline;
        this.locals = locals;
        this.middleware = middleware;
        this.actions = actions;
        this.pathname = pathname;
        this.request = request;
        this.routeData = routeData;
        this.status = status;
        this.clientAddress = clientAddress;
        this.cookies = cookies;
        this.params = params;
        this.url = url;
        this.props = props;
        this.partial = partial;
        this.session = session;
      }
      /**
       * A flag that tells the render content if the rewriting was triggered
       */
      isRewriting = false;
      /**
       * A safety net in case of loops
       */
      counter = 0;
      static async create({
        locals = {},
        middleware,
        pathname,
        pipeline,
        request,
        routeData,
        clientAddress,
        status = 200,
        props,
        partial = void 0,
        actions
      }) {
        const pipelineMiddleware = await pipeline.getMiddleware();
        const pipelineActions = actions ?? await pipeline.getActions();
        setOriginPathname(request, pathname);
        return new _RenderContext(
          pipeline,
          locals,
          sequence(...pipeline.internalMiddleware, middleware ?? pipelineMiddleware),
          pipelineActions,
          pathname,
          request,
          routeData,
          status,
          clientAddress,
          void 0,
          void 0,
          void 0,
          props,
          partial
        );
      }
      /**
       * The main function of the RenderContext.
       *
       * Use this function to render any route known to Astro.
       * It attempts to render a route. A route can be a:
       *
       * - page
       * - redirect
       * - endpoint
       * - fallback
       */
      async render(componentInstance, slots = {}) {
        const { cookies, middleware, pipeline } = this;
        const { logger, serverLike, streaming, manifest: manifest2 } = pipeline;
        const props = Object.keys(this.props).length > 0 ? this.props : await getProps({
          mod: componentInstance,
          routeData: this.routeData,
          routeCache: this.pipeline.routeCache,
          pathname: this.pathname,
          logger,
          serverLike,
          base: manifest2.base
        });
        const actionApiContext = this.createActionAPIContext();
        const apiContext = this.createAPIContext(props, actionApiContext);
        this.counter++;
        if (this.counter === 4) {
          return new Response("Loop Detected", {
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/508
            status: 508,
            statusText: "Astro detected a loop where you tried to call the rewriting logic more than four times."
          });
        }
        const lastNext = /* @__PURE__ */ __name(async (ctx, payload) => {
          if (payload) {
            pipeline.logger.debug("router", "Called rewriting to:", payload);
            const {
              routeData,
              componentInstance: newComponent,
              pathname,
              newUrl
            } = await pipeline.tryRewrite(payload, this.request);
            if (this.pipeline.serverLike === true && this.routeData.prerender === false && routeData.prerender === true) {
              throw new AstroError({
                ...ForbiddenRewrite,
                message: ForbiddenRewrite.message(this.pathname, pathname, routeData.component),
                hint: ForbiddenRewrite.hint(routeData.component)
              });
            }
            this.routeData = routeData;
            componentInstance = newComponent;
            if (payload instanceof Request) {
              this.request = payload;
            } else {
              this.request = copyRequest(
                newUrl,
                this.request,
                // need to send the flag of the previous routeData
                routeData.prerender,
                this.pipeline.logger,
                this.routeData.route
              );
            }
            this.isRewriting = true;
            this.url = new URL(this.request.url);
            this.cookies = new AstroCookies(this.request);
            this.params = getParams(routeData, pathname);
            this.pathname = pathname;
            this.status = 200;
          }
          let response2;
          if (!ctx.isPrerendered) {
            const { action, setActionResult, serializeActionResult: serializeActionResult2 } = getActionContext(ctx);
            if (action?.calledFrom === "form") {
              const actionResult = await action.handler();
              setActionResult(action.name, serializeActionResult2(actionResult));
            }
          }
          switch (this.routeData.type) {
            case "endpoint": {
              response2 = await renderEndpoint(
                componentInstance,
                ctx,
                this.routeData.prerender,
                logger
              );
              break;
            }
            case "redirect":
              return renderRedirect(this);
            case "page": {
              const result = await this.createResult(componentInstance, actionApiContext);
              try {
                response2 = await renderPage(
                  result,
                  componentInstance?.default,
                  props,
                  slots,
                  streaming,
                  this.routeData
                );
              } catch (e2) {
                result.cancelled = true;
                throw e2;
              }
              response2.headers.set(ROUTE_TYPE_HEADER, "page");
              if (this.routeData.route === "/404" || this.routeData.route === "/500") {
                response2.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
              }
              if (this.isRewriting) {
                response2.headers.set(REWRITE_DIRECTIVE_HEADER_KEY, REWRITE_DIRECTIVE_HEADER_VALUE);
              }
              break;
            }
            case "fallback": {
              return new Response(null, { status: 500, headers: { [ROUTE_TYPE_HEADER]: "fallback" } });
            }
          }
          const responseCookies = getCookiesFromResponse(response2);
          if (responseCookies) {
            cookies.merge(responseCookies);
          }
          return response2;
        }, "lastNext");
        if (isRouteExternalRedirect(this.routeData)) {
          return renderRedirect(this);
        }
        const response = await callMiddleware(middleware, apiContext, lastNext);
        if (response.headers.get(ROUTE_TYPE_HEADER)) {
          response.headers.delete(ROUTE_TYPE_HEADER);
        }
        attachCookiesToResponse(response, cookies);
        return response;
      }
      createAPIContext(props, context) {
        const redirect = /* @__PURE__ */ __name((path, status = 302) => new Response(null, { status, headers: { Location: path } }), "redirect");
        Reflect.set(context, apiContextRoutesSymbol, this.pipeline);
        return Object.assign(context, {
          props,
          redirect,
          getActionResult: createGetActionResult(context.locals),
          callAction: createCallAction(context)
        });
      }
      async #executeRewrite(reroutePayload) {
        this.pipeline.logger.debug("router", "Calling rewrite: ", reroutePayload);
        const { routeData, componentInstance, newUrl, pathname } = await this.pipeline.tryRewrite(
          reroutePayload,
          this.request
        );
        if (this.pipeline.serverLike && !this.routeData.prerender && routeData.prerender) {
          throw new AstroError({
            ...ForbiddenRewrite,
            message: ForbiddenRewrite.message(this.pathname, pathname, routeData.component),
            hint: ForbiddenRewrite.hint(routeData.component)
          });
        }
        this.routeData = routeData;
        if (reroutePayload instanceof Request) {
          this.request = reroutePayload;
        } else {
          this.request = copyRequest(
            newUrl,
            this.request,
            // need to send the flag of the previous routeData
            routeData.prerender,
            this.pipeline.logger,
            this.routeData.route
          );
        }
        this.url = new URL(this.request.url);
        this.cookies = new AstroCookies(this.request);
        this.params = getParams(routeData, pathname);
        this.pathname = pathname;
        this.isRewriting = true;
        this.status = 200;
        return await this.render(componentInstance);
      }
      createActionAPIContext() {
        const renderContext = this;
        const { cookies, params, pipeline, url } = this;
        const generator = `Astro v${ASTRO_VERSION}`;
        const rewrite = /* @__PURE__ */ __name(async (reroutePayload) => {
          return await this.#executeRewrite(reroutePayload);
        }, "rewrite");
        return {
          cookies,
          routePattern: this.routeData.route,
          isPrerendered: this.routeData.prerender,
          get clientAddress() {
            return renderContext.getClientAddress();
          },
          get currentLocale() {
            return renderContext.computeCurrentLocale();
          },
          generator,
          get locals() {
            return renderContext.locals;
          },
          set locals(_) {
            throw new AstroError(LocalsReassigned);
          },
          params,
          get preferredLocale() {
            return renderContext.computePreferredLocale();
          },
          get preferredLocaleList() {
            return renderContext.computePreferredLocaleList();
          },
          rewrite,
          request: this.request,
          site: pipeline.site,
          url,
          get originPathname() {
            return getOriginPathname(renderContext.request);
          },
          get session() {
            if (this.isPrerendered) {
              pipeline.logger.warn(
                "session",
                `context.session was used when rendering the route ${green(this.routePattern)}, but it is not available on prerendered routes. If you need access to sessions, make sure that the route is server-rendered using \`export const prerender = false;\` or by setting \`output\` to \`"server"\` in your Astro config to make all your routes server-rendered by default. For more information, see https://docs.astro.build/en/guides/sessions/`
              );
              return void 0;
            }
            if (!renderContext.session) {
              pipeline.logger.warn(
                "session",
                `context.session was used when rendering the route ${green(this.routePattern)}, but no storage configuration was provided. Either configure the storage manually or use an adapter that provides session storage. For more information, see https://docs.astro.build/en/guides/sessions/`
              );
              return void 0;
            }
            return renderContext.session;
          }
        };
      }
      async createResult(mod, ctx) {
        const { cookies, pathname, pipeline, routeData, status } = this;
        const { clientDirectives, inlinedScripts, compressHTML, manifest: manifest2, renderers: renderers2, resolve } = pipeline;
        const { links, scripts, styles } = await pipeline.headElements(routeData);
        const componentMetadata = await pipeline.componentMetadata(routeData) ?? manifest2.componentMetadata;
        const headers = new Headers({ "Content-Type": "text/html" });
        const partial = typeof this.partial === "boolean" ? this.partial : Boolean(mod.partial);
        const actionResult = hasActionPayload(this.locals) ? deserializeActionResult(this.locals._actionPayload.actionResult) : void 0;
        const response = {
          status: actionResult?.error ? actionResult?.error.status : status,
          statusText: actionResult?.error ? actionResult?.error.type : "OK",
          get headers() {
            return headers;
          },
          // Disallow `Astro.response.headers = new Headers`
          set headers(_) {
            throw new AstroError(AstroResponseHeadersReassigned);
          }
        };
        const result = {
          base: manifest2.base,
          userAssetsBase: manifest2.userAssetsBase,
          cancelled: false,
          clientDirectives,
          inlinedScripts,
          componentMetadata,
          compressHTML,
          cookies,
          /** This function returns the `Astro` faux-global */
          createAstro: /* @__PURE__ */ __name((astroGlobal, props, slots) => this.createAstro(result, astroGlobal, props, slots, ctx), "createAstro"),
          links,
          params: this.params,
          partial,
          pathname,
          renderers: renderers2,
          resolve,
          response,
          request: this.request,
          scripts,
          styles,
          actionResult,
          serverIslandNameMap: manifest2.serverIslandNameMap ?? /* @__PURE__ */ new Map(),
          key: manifest2.key,
          trailingSlash: manifest2.trailingSlash,
          _metadata: {
            hasHydrationScript: false,
            rendererSpecificHydrationScripts: /* @__PURE__ */ new Set(),
            hasRenderedHead: false,
            renderedScripts: /* @__PURE__ */ new Set(),
            hasDirectives: /* @__PURE__ */ new Set(),
            hasRenderedServerIslandRuntime: false,
            headInTree: false,
            extraHead: [],
            propagators: /* @__PURE__ */ new Set()
          }
        };
        return result;
      }
      #astroPagePartial;
      /**
       * The Astro global is sourced in 3 different phases:
       * - **Static**: `.generator` and `.glob` is printed by the compiler, instantiated once per process per astro file
       * - **Page-level**: `.request`, `.cookies`, `.locals` etc. These remain the same for the duration of the request.
       * - **Component-level**: `.props`, `.slots`, and `.self` are unique to each _use_ of each component.
       *
       * The page level partial is used as the prototype of the user-visible `Astro` global object, which is instantiated once per use of a component.
       */
      createAstro(result, astroStaticPartial, props, slotValues, apiContext) {
        let astroPagePartial;
        if (this.isRewriting) {
          astroPagePartial = this.#astroPagePartial = this.createAstroPagePartial(
            result,
            astroStaticPartial,
            apiContext
          );
        } else {
          astroPagePartial = this.#astroPagePartial ??= this.createAstroPagePartial(
            result,
            astroStaticPartial,
            apiContext
          );
        }
        const astroComponentPartial = { props, self: null };
        const Astro = Object.assign(
          Object.create(astroPagePartial),
          astroComponentPartial
        );
        let _slots;
        Object.defineProperty(Astro, "slots", {
          get: /* @__PURE__ */ __name(() => {
            if (!_slots) {
              _slots = new Slots(
                result,
                slotValues,
                this.pipeline.logger
              );
            }
            return _slots;
          }, "get")
        });
        return Astro;
      }
      createAstroPagePartial(result, astroStaticPartial, apiContext) {
        const renderContext = this;
        const { cookies, locals, params, pipeline, url } = this;
        const { response } = result;
        const redirect = /* @__PURE__ */ __name((path, status = 302) => {
          if (this.request[responseSentSymbol]) {
            throw new AstroError({
              ...ResponseSentError
            });
          }
          return new Response(null, { status, headers: { Location: path } });
        }, "redirect");
        const rewrite = /* @__PURE__ */ __name(async (reroutePayload) => {
          return await this.#executeRewrite(reroutePayload);
        }, "rewrite");
        const callAction = createCallAction(apiContext);
        return {
          generator: astroStaticPartial.generator,
          glob: astroStaticPartial.glob,
          routePattern: this.routeData.route,
          isPrerendered: this.routeData.prerender,
          cookies,
          get session() {
            if (this.isPrerendered) {
              pipeline.logger.warn(
                "session",
                `Astro.session was used when rendering the route ${green(this.routePattern)}, but it is not available on prerendered pages. If you need access to sessions, make sure that the page is server-rendered using \`export const prerender = false;\` or by setting \`output\` to \`"server"\` in your Astro config to make all your pages server-rendered by default. For more information, see https://docs.astro.build/en/guides/sessions/`
              );
              return void 0;
            }
            if (!renderContext.session) {
              pipeline.logger.warn(
                "session",
                `Astro.session was used when rendering the route ${green(this.routePattern)}, but no storage configuration was provided. Either configure the storage manually or use an adapter that provides session storage. For more information, see https://docs.astro.build/en/guides/sessions/`
              );
              return void 0;
            }
            return renderContext.session;
          },
          get clientAddress() {
            return renderContext.getClientAddress();
          },
          get currentLocale() {
            return renderContext.computeCurrentLocale();
          },
          params,
          get preferredLocale() {
            return renderContext.computePreferredLocale();
          },
          get preferredLocaleList() {
            return renderContext.computePreferredLocaleList();
          },
          locals,
          redirect,
          rewrite,
          request: this.request,
          response,
          site: pipeline.site,
          getActionResult: createGetActionResult(locals),
          get callAction() {
            return callAction;
          },
          url,
          get originPathname() {
            return getOriginPathname(renderContext.request);
          }
        };
      }
      getClientAddress() {
        const { pipeline, request, routeData, clientAddress } = this;
        if (routeData.prerender) {
          throw new AstroError({
            ...PrerenderClientAddressNotAvailable,
            message: PrerenderClientAddressNotAvailable.message(routeData.component)
          });
        }
        if (clientAddress) {
          return clientAddress;
        }
        if (clientAddressSymbol in request) {
          return Reflect.get(request, clientAddressSymbol);
        }
        if (pipeline.adapterName) {
          throw new AstroError({
            ...ClientAddressNotAvailable,
            message: ClientAddressNotAvailable.message(pipeline.adapterName)
          });
        }
        throw new AstroError(StaticClientAddressNotAvailable);
      }
      /**
       * API Context may be created multiple times per request, i18n data needs to be computed only once.
       * So, it is computed and saved here on creation of the first APIContext and reused for later ones.
       */
      #currentLocale;
      computeCurrentLocale() {
        const {
          url,
          pipeline: { i18n },
          routeData
        } = this;
        if (!i18n) return;
        const { defaultLocale, locales, strategy } = i18n;
        const fallbackTo = strategy === "pathname-prefix-other-locales" || strategy === "domains-prefix-other-locales" ? defaultLocale : void 0;
        if (this.#currentLocale) {
          return this.#currentLocale;
        }
        let computedLocale;
        if (isRouteServerIsland(routeData)) {
          let referer = this.request.headers.get("referer");
          if (referer) {
            if (URL.canParse(referer)) {
              referer = new URL(referer).pathname;
            }
            computedLocale = computeCurrentLocale(referer, locales, defaultLocale);
          }
        } else {
          let pathname = routeData.pathname;
          if (!routeData.pattern.test(url.pathname)) {
            for (const fallbackRoute of routeData.fallbackRoutes) {
              if (fallbackRoute.pattern.test(url.pathname)) {
                pathname = fallbackRoute.pathname;
                break;
              }
            }
          }
          pathname = pathname && !isRoute404or500(routeData) ? pathname : url.pathname;
          computedLocale = computeCurrentLocale(pathname, locales, defaultLocale);
        }
        this.#currentLocale = computedLocale ?? fallbackTo;
        return this.#currentLocale;
      }
      #preferredLocale;
      computePreferredLocale() {
        const {
          pipeline: { i18n },
          request
        } = this;
        if (!i18n) return;
        return this.#preferredLocale ??= computePreferredLocale(request, i18n.locales);
      }
      #preferredLocaleList;
      computePreferredLocaleList() {
        const {
          pipeline: { i18n },
          request
        } = this;
        if (!i18n) return;
        return this.#preferredLocaleList ??= computePreferredLocaleList(request, i18n.locales);
      }
    };
    __name(sequence, "sequence");
    __name(defineMiddleware, "defineMiddleware");
  }
});

// .wrangler/tmp/pages-ErOWne/chunks/cloudflare-kv-binding_DMly_2Gl.mjs
var cloudflare_kv_binding_DMly_2Gl_exports = {};
__export(cloudflare_kv_binding_DMly_2Gl_exports, {
  default: () => cloudflareKvBinding
});
function defineDriver2(factory) {
  return factory;
}
function normalizeKey2(key, sep = ":") {
  if (!key) {
    return "";
  }
  return key.replace(/[:/\\]/g, sep).replace(/^[:/\\]|[:/\\]$/g, "");
}
function joinKeys2(...keys) {
  return keys.map((key) => normalizeKey2(key)).filter(Boolean).join(":");
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createError);
  }
  return err;
}
function getBinding(binding) {
  let bindingName = "[binding]";
  if (typeof binding === "string") {
    bindingName = binding;
    binding = globalThis[bindingName] || globalThis.__env__?.[bindingName];
  }
  if (!binding) {
    throw createError(
      "cloudflare",
      `Invalid binding \`${bindingName}\`: \`${binding}\``
    );
  }
  for (const key of ["get", "put", "delete"]) {
    if (!(key in binding)) {
      throw createError(
        "cloudflare",
        `Invalid binding \`${bindingName}\`: \`${key}\` key is missing`
      );
    }
  }
  return binding;
}
function getKVBinding(binding = "STORAGE") {
  return getBinding(binding);
}
var DRIVER_NAME2, cloudflareKvBinding;
var init_cloudflare_kv_binding_DMly_2Gl = __esm({
  ".wrangler/tmp/pages-ErOWne/chunks/cloudflare-kv-binding_DMly_2Gl.mjs"() {
    "use strict";
    init_modules_watch_stub();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    __name(defineDriver2, "defineDriver");
    __name(normalizeKey2, "normalizeKey");
    __name(joinKeys2, "joinKeys");
    __name(createError, "createError");
    __name(getBinding, "getBinding");
    __name(getKVBinding, "getKVBinding");
    DRIVER_NAME2 = "cloudflare-kv-binding";
    cloudflareKvBinding = defineDriver2((opts) => {
      const r3 = /* @__PURE__ */ __name((key = "") => opts.base ? joinKeys2(opts.base, key) : key, "r");
      async function getKeys(base = "") {
        base = r3(base);
        const binding = getKVBinding(opts.binding);
        const keys = [];
        let cursor = void 0;
        do {
          const kvList = await binding.list({ prefix: base || void 0, cursor });
          keys.push(...kvList.keys);
          cursor = kvList.list_complete ? void 0 : kvList.cursor;
        } while (cursor);
        return keys.map((key) => key.name);
      }
      __name(getKeys, "getKeys");
      return {
        name: DRIVER_NAME2,
        options: opts,
        getInstance: /* @__PURE__ */ __name(() => getKVBinding(opts.binding), "getInstance"),
        async hasItem(key) {
          key = r3(key);
          const binding = getKVBinding(opts.binding);
          return await binding.get(key) !== null;
        },
        getItem(key) {
          key = r3(key);
          const binding = getKVBinding(opts.binding);
          return binding.get(key);
        },
        setItem(key, value, topts) {
          key = r3(key);
          const binding = getKVBinding(opts.binding);
          return binding.put(
            key,
            value,
            topts ? {
              expirationTtl: topts?.ttl ? Math.max(topts.ttl, opts.minTTL ?? 60) : void 0,
              ...topts
            } : void 0
          );
        },
        removeItem(key) {
          key = r3(key);
          const binding = getKVBinding(opts.binding);
          return binding.delete(key);
        },
        getKeys(base) {
          return getKeys(base).then(
            (keys) => keys.map((key) => opts.base ? key.slice(opts.base.length) : key)
          );
        },
        async clear(base) {
          const binding = getKVBinding(opts.binding);
          const keys = await getKeys(base);
          await Promise.all(keys.map((key) => binding.delete(key)));
        }
      };
    });
  }
});

// .wrangler/tmp/pages-ErOWne/pages/_image.astro.mjs
var image_astro_exports = {};
__export(image_astro_exports, {
  page: () => page,
  renderers: () => renderers
});
var prerender, GET, _page, page;
var init_image_astro = __esm({
  ".wrangler/tmp/pages-ErOWne/pages/_image.astro.mjs"() {
    "use strict";
    init_modules_watch_stub();
    init_renderers();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    prerender = false;
    GET = /* @__PURE__ */ __name((ctx) => {
      const href = ctx.url.searchParams.get("href");
      if (!href) {
        return new Response("Missing 'href' query parameter", {
          status: 400,
          statusText: "Missing 'href' query parameter"
        });
      }
      return fetch(new URL(href, ctx.url.origin));
    }, "GET");
    _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      GET,
      prerender
    }, Symbol.toStringTag, { value: "Module" }));
    page = /* @__PURE__ */ __name(() => _page, "page");
  }
});

// .wrangler/tmp/pages-ErOWne/chunks/BaseLayout_A4ggbcpe.mjs
function mergeIconTransformations(obj1, obj2) {
  const result = {};
  if (!obj1.hFlip !== !obj2.hFlip) {
    result.hFlip = true;
  }
  if (!obj1.vFlip !== !obj2.vFlip) {
    result.vFlip = true;
  }
  const rotate = ((obj1.rotate || 0) + (obj2.rotate || 0)) % 4;
  if (rotate) {
    result.rotate = rotate;
  }
  return result;
}
function mergeIconData(parent, child) {
  const result = mergeIconTransformations(parent, child);
  for (const key in defaultExtendedIconProps) {
    if (key in defaultIconTransformations) {
      if (key in parent && !(key in result)) {
        result[key] = defaultIconTransformations[key];
      }
    } else if (key in child) {
      result[key] = child[key];
    } else if (key in parent) {
      result[key] = parent[key];
    }
  }
  return result;
}
function getIconsTree(data, names) {
  const icons2 = data.icons;
  const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
  const resolved = /* @__PURE__ */ Object.create(null);
  function resolve(name) {
    if (icons2[name]) {
      return resolved[name] = [];
    }
    if (!(name in resolved)) {
      resolved[name] = null;
      const parent = aliases[name] && aliases[name].parent;
      const value = parent && resolve(parent);
      if (value) {
        resolved[name] = [parent].concat(value);
      }
    }
    return resolved[name];
  }
  __name(resolve, "resolve");
  (names || Object.keys(icons2).concat(Object.keys(aliases))).forEach(resolve);
  return resolved;
}
function internalGetIconData(data, name, tree) {
  const icons2 = data.icons;
  const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
  let currentProps = {};
  function parse2(name2) {
    currentProps = mergeIconData(
      icons2[name2] || aliases[name2],
      currentProps
    );
  }
  __name(parse2, "parse");
  parse2(name);
  tree.forEach(parse2);
  return mergeIconData(data, currentProps);
}
function getIconData(data, name) {
  if (data.icons[name]) {
    return internalGetIconData(data, name, []);
  }
  const tree = getIconsTree(data, [name])[name];
  return tree ? internalGetIconData(data, name, tree) : null;
}
function calculateSize(size, ratio, precision) {
  if (ratio === 1) {
    return size;
  }
  precision = precision || 100;
  if (typeof size === "number") {
    return Math.ceil(size * ratio * precision) / precision;
  }
  if (typeof size !== "string") {
    return size;
  }
  const oldParts = size.split(unitsSplit);
  if (oldParts === null || !oldParts.length) {
    return size;
  }
  const newParts = [];
  let code = oldParts.shift();
  let isNumber = unitsTest.test(code);
  while (true) {
    if (isNumber) {
      const num = parseFloat(code);
      if (isNaN(num)) {
        newParts.push(code);
      } else {
        newParts.push(Math.ceil(num * ratio * precision) / precision);
      }
    } else {
      newParts.push(code);
    }
    code = oldParts.shift();
    if (code === void 0) {
      return newParts.join("");
    }
    isNumber = !isNumber;
  }
}
function splitSVGDefs(content, tag = "defs") {
  let defs = "";
  const index = content.indexOf("<" + tag);
  while (index >= 0) {
    const start = content.indexOf(">", index);
    const end = content.indexOf("</" + tag);
    if (start === -1 || end === -1) {
      break;
    }
    const endEnd = content.indexOf(">", end);
    if (endEnd === -1) {
      break;
    }
    defs += content.slice(start + 1, end).trim();
    content = content.slice(0, index).trim() + content.slice(endEnd + 1);
  }
  return {
    defs,
    content
  };
}
function mergeDefsAndContent(defs, content) {
  return defs ? "<defs>" + defs + "</defs>" + content : content;
}
function wrapSVGContent(body, start, end) {
  const split = splitSVGDefs(body);
  return mergeDefsAndContent(split.defs, start + split.content + end);
}
function iconToSVG(icon, customisations) {
  const fullIcon = {
    ...defaultIconProps,
    ...icon
  };
  const fullCustomisations = {
    ...defaultIconCustomisations,
    ...customisations
  };
  const box = {
    left: fullIcon.left,
    top: fullIcon.top,
    width: fullIcon.width,
    height: fullIcon.height
  };
  let body = fullIcon.body;
  [fullIcon, fullCustomisations].forEach((props) => {
    const transformations = [];
    const hFlip = props.hFlip;
    const vFlip = props.vFlip;
    let rotation = props.rotate;
    if (hFlip) {
      if (vFlip) {
        rotation += 2;
      } else {
        transformations.push(
          "translate(" + (box.width + box.left).toString() + " " + (0 - box.top).toString() + ")"
        );
        transformations.push("scale(-1 1)");
        box.top = box.left = 0;
      }
    } else if (vFlip) {
      transformations.push(
        "translate(" + (0 - box.left).toString() + " " + (box.height + box.top).toString() + ")"
      );
      transformations.push("scale(1 -1)");
      box.top = box.left = 0;
    }
    let tempValue;
    if (rotation < 0) {
      rotation -= Math.floor(rotation / 4) * 4;
    }
    rotation = rotation % 4;
    switch (rotation) {
      case 1:
        tempValue = box.height / 2 + box.top;
        transformations.unshift(
          "rotate(90 " + tempValue.toString() + " " + tempValue.toString() + ")"
        );
        break;
      case 2:
        transformations.unshift(
          "rotate(180 " + (box.width / 2 + box.left).toString() + " " + (box.height / 2 + box.top).toString() + ")"
        );
        break;
      case 3:
        tempValue = box.width / 2 + box.left;
        transformations.unshift(
          "rotate(-90 " + tempValue.toString() + " " + tempValue.toString() + ")"
        );
        break;
    }
    if (rotation % 2 === 1) {
      if (box.left !== box.top) {
        tempValue = box.left;
        box.left = box.top;
        box.top = tempValue;
      }
      if (box.width !== box.height) {
        tempValue = box.width;
        box.width = box.height;
        box.height = tempValue;
      }
    }
    if (transformations.length) {
      body = wrapSVGContent(
        body,
        '<g transform="' + transformations.join(" ") + '">',
        "</g>"
      );
    }
  });
  const customisationsWidth = fullCustomisations.width;
  const customisationsHeight = fullCustomisations.height;
  const boxWidth = box.width;
  const boxHeight = box.height;
  let width;
  let height;
  if (customisationsWidth === null) {
    height = customisationsHeight === null ? "1em" : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
    width = calculateSize(height, boxWidth / boxHeight);
  } else {
    width = customisationsWidth === "auto" ? boxWidth : customisationsWidth;
    height = customisationsHeight === null ? calculateSize(width, boxHeight / boxWidth) : customisationsHeight === "auto" ? boxHeight : customisationsHeight;
  }
  const attributes = {};
  const setAttr = /* @__PURE__ */ __name((prop, value) => {
    if (!isUnsetKeyword(value)) {
      attributes[prop] = value.toString();
    }
  }, "setAttr");
  setAttr("width", width);
  setAttr("height", height);
  const viewBox = [box.left, box.top, boxWidth, boxHeight];
  attributes.viewBox = viewBox.join(" ");
  return {
    attributes,
    viewBox,
    body
  };
}
var icons, defaultIconDimensions, defaultIconTransformations, defaultIconProps, defaultExtendedIconProps, defaultIconSizeCustomisations, defaultIconCustomisations, unitsSplit, unitsTest, isUnsetKeyword, cache, $$Astro$1, $$Icon, $$Navbar, $$Footer, $$NavbarMobile, $$Astro, $$BaseLayout;
var init_BaseLayout_A4ggbcpe = __esm({
  ".wrangler/tmp/pages-ErOWne/chunks/BaseLayout_A4ggbcpe.mjs"() {
    "use strict";
    init_modules_watch_stub();
    init_server_QlrBW5xk();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    icons = { "local": { "prefix": "local", "lastModified": 1746105667, "icons": { "astro_logo_figma": { "body": '<path fill="#FF5D01" d="M26.79 28.1c-1.2 1.027-3.595 1.725-6.353 1.725-3.387 0-6.225-1.053-6.979-2.472-.268.814-.33 1.744-.33 2.337 0 0-.176 2.917 1.852 4.947a1.91 1.91 0 0 1 1.908-1.909c1.805 0 1.804 1.575 1.802 2.854v.115A4.66 4.66 0 0 0 21.562 40a3.9 3.9 0 0 1-.394-1.715c0-1.85 1.087-2.538 2.35-3.338 1.004-.639 2.12-1.345 2.889-2.767a5.23 5.23 0 0 0 .383-4.08M25.918 1c.327.407.494.953.827 2.048l7.28 23.912a30.3 30.3 0 0 0-8.703-2.947L20.583 8a.616.616 0 0 0-1.183.003l-4.683 16.005a30.3 30.3 0 0 0-8.742 2.952L13.29 3.045c.333-1.093.5-1.64.828-2.045a2.7 2.7 0 0 1 1.09-.807C15.692 0 16.262 0 17.405 0h5.225c1.143 0 1.717 0 2.2.195.425.171.8.449 1.088.805"/>' }, "azure": { "body": '<g fill="none"><path fill="url(#a)" d="M37.5 9.055v21.28L28.75 37.5l-13.562-4.937v4.895L7.51 27.425l22.377 1.75V10.013zm-7.46 1.07L17.485 2.5v5.003L5.955 10.89 2.5 15.325v10.073l4.945 2.182V14.673z"/><defs><linearGradient id="a" x1="20" x2="20" y1="37.39" y2="2.565" gradientUnits="userSpaceOnUse"><stop stop-color="#0078D4"/><stop offset=".16" stop-color="#1380DA"/><stop offset=".53" stop-color="#3C91E5"/><stop offset=".82" stop-color="#559CEC"/><stop offset="1" stop-color="#5EA0EF"/></linearGradient></defs></g>' }, "biencaps_logo": { "body": '<mask id="a" width="2599" height="613" x="1025" y="254" fill="#000" maskUnits="userSpaceOnUse"><path fill="#fff" d="M1025 254h2599v613H1025z"/><path d="M1058.2 724.6q-13.2 0-22.2-9t-9-22.2V287.2q0-13.8 9-22.2 9-9 22.2-9h143.4q40.8 0 71.4 16.2 31.2 15.6 48.6 43.8 18 28.2 18 64.8 0 29.4-16.2 53.4-15.6 23.4-43.2 37.2 39.6 9.6 63.6 37.8t24 73.8q0 41.4-19.8 73.2-19.2 31.8-54 50.4-34.8 18-79.8 18zm31.2-276h112.2q34.2 0 55.8-16.8 22.2-16.8 22.2-51t-22.2-50.4q-21.6-16.8-55.8-16.8h-112.2zm0 218.4h124.8q40.8 0 67.2-21 26.4-21.6 26.4-63 0-38.4-26.4-57.6t-67.2-19.2h-124.8zm356 57.6q-13.2 0-22.2-8.4-8.4-9-8.4-22.2V427q0-13.8 8.4-22.2 9-8.4 22.2-8.4 13.8 0 22.2 8.4t8.4 22.2v267q0 13.2-8.4 22.2-8.4 8.4-22.2 8.4m0-381.6q-16.2 0-28.2-11.4-11.4-12-11.4-28.2t11.4-27.6q12-12 28.2-12t27.6 12q12 11.4 12 27.6t-12 28.2q-11.4 11.4-27.6 11.4M1701 727q-49.8 0-88.8-21-38.4-21.6-60.6-58.8-21.6-37.8-21.6-86.4 0-49.2 20.4-86.4 21-37.8 57.6-58.8 36.6-21.6 84-21.6 46.8 0 80.4 21 33.6 20.4 51 57 18 36 18 83.4 0 11.4-7.8 19.2-7.8 7.2-19.8 7.2h-228q6.6 41.4 37.8 67.8 31.8 25.8 77.4 25.8 18.6 0 37.8-6.6 19.8-7.2 31.8-16.2 9-6.6 19.2-6.6 10.8-.6 18.6 6 10.2 9 10.8 19.8t-9.6 18.6q-20.4 16.2-51 26.4-30 10.2-57.6 10.2m-9-281.4q-44.4 0-71.4 24.6t-34.2 63.6h199.8q-5.4-38.4-29.4-63-24-25.2-64.8-25.2m229.1 279.6q-13.2 0-22.2-8.4-8.4-9-8.4-22.2V427q0-13.8 8.4-22.2 9-8.4 22.2-8.4 13.8 0 22.2 8.4t8.4 22.2v6.6q18.6-18.6 45-29.4t57-10.8q41.4 0 73.8 18 33 17.4 51.6 51.6 19.2 34.2 19.2 84v147.6q0 13.2-9 22.2-8.4 8.4-21.6 8.4t-22.2-8.4q-8.4-9-8.4-22.2V547q0-51-27.6-74.4-27-24-67.8-24-25.2 0-45.6 10.2t-32.4 27.6q-12 16.8-12 39v169.2q0 13.2-8.4 22.2-8.4 8.4-22.2 8.4m500.8 1.8q-48 0-85.8-21.6-37.2-22.2-58.8-59.4-21-37.8-21-85.2 0-48.6 21-86.4t57.6-58.8q36.6-21.6 84-21.6 70.8 0 117.6 54 8.4 9.6 6 19.8t-13.2 18q-8.4 6-18.6 4.2-10.2-2.4-18.6-10.8-29.4-31.2-73.2-31.2-46.2 0-75 31.2-28.8 30.6-28.8 81.6 0 32.4 13.2 57.6 13.8 25.2 37.8 40.2 24 14.4 55.8 14.4 40.8 0 66-21 9.6-7.8 19.8-8.4 10.2-1.2 18 5.4 10.2 8.4 11.4 19.2 1.2 10.2-7.2 18.6-43.2 40.2-108 40.2m314.6 0q-43.8 0-78.6-21.6-34.8-22.2-55.2-59.4-19.8-37.8-19.8-85.2t21.6-85.2q22.2-37.8 59.4-59.4 37.8-22.2 84.6-22.2t84 22.2q37.2 21.6 58.8 59.4 22.2 37.8 22.2 85.2v133.8q0 13.2-9 22.2-8.4 8.4-21.6 8.4t-22.2-8.4q-8.4-9-8.4-22.2v-22.2q-21 25.2-51 40.2-29.4 14.4-64.8 14.4m12-54q30.6 0 54.6-14.4 24-15 37.8-40.2 13.8-25.8 13.8-57.6 0-32.4-13.8-57.6-13.8-25.8-37.8-40.2-24-15-54.6-15-30 0-54.6 15-24 14.4-38.4 40.2-13.8 25.2-13.8 57.6 0 31.8 13.8 57.6 14.4 25.2 38.4 40.2 24.6 14.4 54.6 14.4m248.1 192q-13.2 0-22.2-9-8.4-8.4-8.4-21.6V560.8q.6-47.4 22.2-85.2t58.8-59.4q37.2-22.2 84-22.2 47.4 0 84.6 22.2 37.2 21.6 58.8 59.4 22.2 37.8 22.2 85.2t-20.4 85.2q-19.8 37.2-54.6 59.4-34.8 21.6-78.6 21.6-35.4 0-65.4-14.4-29.4-15-50.4-40.2v162q0 13.2-8.4 21.6-8.4 9-22.2 9M3131 673q30.6 0 54.6-14.4 24-15 37.8-40.2 14.4-25.8 14.4-57.6 0-32.4-14.4-57.6-13.8-25.8-37.8-40.2-24-15-54.6-15-30 0-54.6 15-24 14.4-37.8 40.2-13.8 25.2-13.8 57.6 0 31.8 13.8 57.6 13.8 25.2 37.8 40.2Q3101 673 3131 673m362 54q-42 0-78-12.6-35.4-13.2-55.2-33-9-9.6-7.8-21.6 1.8-12.6 12-20.4 12-9.6 23.4-7.8 12 1.2 20.4 10.2 10.2 11.4 32.4 21.6 22.8 9.6 50.4 9.6 34.8 0 52.8-11.4 18.6-11.4 19.2-29.4t-17.4-31.2q-17.4-13.2-64.2-21.6-60.6-12-88.2-36-27-24-27-58.8 0-30.6 18-50.4 18-20.4 46.2-30 28.2-10.2 58.8-10.2 39.6 0 70.2 12.6t48.6 34.8q8.4 9.6 7.8 20.4-.6 10.2-10.2 17.4-9.6 6.6-22.8 4.2t-22.2-10.8q-15-14.4-32.4-19.8t-40.2-5.4q-26.4 0-45 9-18 9-18 26.4 0 10.8 5.4 19.8 6 8.4 22.8 15.6 16.8 6.6 49.2 13.2 67.8 13.2 93.6 37.8 26.4 24 26.4 59.4 0 27.6-15 49.8-14.4 22.2-43.2 35.4-28.2 13.2-70.8 13.2"/></mask><g fill="none"><circle cx="450" cy="450" r="450" fill="#fff"/><path fill="#FF8402" d="M666.772 295.183c-35.859-5.32-52.048 14.366-55.66 24.875l-12.807-64.281c2.955 9.851 19.785 14.284 27.83 15.269 28.372-1.773 38.913 15.352 40.637 24.137M615.3 750.568H472.207l70.438-26.599c51.228-1.576 69.781 17.076 72.655 26.599"/><path fill="#000" d="M556.281 257.255c27.978 55.168 11.657 141.04 0 177.08 71.718-57.73 61.407-146.705 47.287-183.976-49.061-98.712-139.974-107.135-179.297-99.008-91.619 15.763-127.166 101.799-133.488 142.847-8.078 80.979 45.071 133.898 72.655 150.235 33.889 26.402 90.141 31.36 114.031 30.539 81.373 19.506 95.477 90.388 92.357 123.39-13.004 98.318-96.216 112.389-136.196 107.135-74.872-11.822-95.888-79.633-97.037-112.061V506h-45.81v67.241c-2.167 81.373 43.1 131.927 66.005 147.033 82.556 57.139 161.975 23.808 191.365 0 77.63-49.06 72.408-138.167 60.094-176.588-29.554-92.801-112.143-116.001-149.742-116.001-78.221 1.576-111.733-59.601-118.711-90.387-18.52-77.63 39.078-121.666 70.192-133.98 78.221-29.555 130.122 23.643 146.295 53.937"/><circle cx="313.106" cy="458.963" r="26.106" fill="#000"/><circle cx="477.132" cy="276.219" r="29.062" fill="#000"/><path fill="#fff" d="M1058.2 724.6q-13.2 0-22.2-9t-9-22.2V287.2q0-13.8 9-22.2 9-9 22.2-9h143.4q40.8 0 71.4 16.2 31.2 15.6 48.6 43.8 18 28.2 18 64.8 0 29.4-16.2 53.4-15.6 23.4-43.2 37.2 39.6 9.6 63.6 37.8t24 73.8q0 41.4-19.8 73.2-19.2 31.8-54 50.4-34.8 18-79.8 18zm31.2-276h112.2q34.2 0 55.8-16.8 22.2-16.8 22.2-51t-22.2-50.4q-21.6-16.8-55.8-16.8h-112.2zm0 218.4h124.8q40.8 0 67.2-21 26.4-21.6 26.4-63 0-38.4-26.4-57.6t-67.2-19.2h-124.8zm356 57.6q-13.2 0-22.2-8.4-8.4-9-8.4-22.2V427q0-13.8 8.4-22.2 9-8.4 22.2-8.4 13.8 0 22.2 8.4t8.4 22.2v267q0 13.2-8.4 22.2-8.4 8.4-22.2 8.4m0-381.6q-16.2 0-28.2-11.4-11.4-12-11.4-28.2t11.4-27.6q12-12 28.2-12t27.6 12q12 11.4 12 27.6t-12 28.2q-11.4 11.4-27.6 11.4M1701 727q-49.8 0-88.8-21-38.4-21.6-60.6-58.8-21.6-37.8-21.6-86.4 0-49.2 20.4-86.4 21-37.8 57.6-58.8 36.6-21.6 84-21.6 46.8 0 80.4 21 33.6 20.4 51 57 18 36 18 83.4 0 11.4-7.8 19.2-7.8 7.2-19.8 7.2h-228q6.6 41.4 37.8 67.8 31.8 25.8 77.4 25.8 18.6 0 37.8-6.6 19.8-7.2 31.8-16.2 9-6.6 19.2-6.6 10.8-.6 18.6 6 10.2 9 10.8 19.8t-9.6 18.6q-20.4 16.2-51 26.4-30 10.2-57.6 10.2m-9-281.4q-44.4 0-71.4 24.6t-34.2 63.6h199.8q-5.4-38.4-29.4-63-24-25.2-64.8-25.2m229.1 279.6q-13.2 0-22.2-8.4-8.4-9-8.4-22.2V427q0-13.8 8.4-22.2 9-8.4 22.2-8.4 13.8 0 22.2 8.4t8.4 22.2v6.6q18.6-18.6 45-29.4t57-10.8q41.4 0 73.8 18 33 17.4 51.6 51.6 19.2 34.2 19.2 84v147.6q0 13.2-9 22.2-8.4 8.4-21.6 8.4t-22.2-8.4q-8.4-9-8.4-22.2V547q0-51-27.6-74.4-27-24-67.8-24-25.2 0-45.6 10.2t-32.4 27.6q-12 16.8-12 39v169.2q0 13.2-8.4 22.2-8.4 8.4-22.2 8.4m500.8 1.8q-48 0-85.8-21.6-37.2-22.2-58.8-59.4-21-37.8-21-85.2 0-48.6 21-86.4t57.6-58.8q36.6-21.6 84-21.6 70.8 0 117.6 54 8.4 9.6 6 19.8t-13.2 18q-8.4 6-18.6 4.2-10.2-2.4-18.6-10.8-29.4-31.2-73.2-31.2-46.2 0-75 31.2-28.8 30.6-28.8 81.6 0 32.4 13.2 57.6 13.8 25.2 37.8 40.2 24 14.4 55.8 14.4 40.8 0 66-21 9.6-7.8 19.8-8.4 10.2-1.2 18 5.4 10.2 8.4 11.4 19.2 1.2 10.2-7.2 18.6-43.2 40.2-108 40.2m314.6 0q-43.8 0-78.6-21.6-34.8-22.2-55.2-59.4-19.8-37.8-19.8-85.2t21.6-85.2q22.2-37.8 59.4-59.4 37.8-22.2 84.6-22.2t84 22.2q37.2 21.6 58.8 59.4 22.2 37.8 22.2 85.2v133.8q0 13.2-9 22.2-8.4 8.4-21.6 8.4t-22.2-8.4q-8.4-9-8.4-22.2v-22.2q-21 25.2-51 40.2-29.4 14.4-64.8 14.4m12-54q30.6 0 54.6-14.4 24-15 37.8-40.2 13.8-25.8 13.8-57.6 0-32.4-13.8-57.6-13.8-25.8-37.8-40.2-24-15-54.6-15-30 0-54.6 15-24 14.4-38.4 40.2-13.8 25.2-13.8 57.6 0 31.8 13.8 57.6 14.4 25.2 38.4 40.2 24.6 14.4 54.6 14.4m248.1 192q-13.2 0-22.2-9-8.4-8.4-8.4-21.6V560.8q.6-47.4 22.2-85.2t58.8-59.4q37.2-22.2 84-22.2 47.4 0 84.6 22.2 37.2 21.6 58.8 59.4 22.2 37.8 22.2 85.2t-20.4 85.2q-19.8 37.2-54.6 59.4-34.8 21.6-78.6 21.6-35.4 0-65.4-14.4-29.4-15-50.4-40.2v162q0 13.2-8.4 21.6-8.4 9-22.2 9M3131 673q30.6 0 54.6-14.4 24-15 37.8-40.2 14.4-25.8 14.4-57.6 0-32.4-14.4-57.6-13.8-25.8-37.8-40.2-24-15-54.6-15-30 0-54.6 15-24 14.4-37.8 40.2-13.8 25.2-13.8 57.6 0 31.8 13.8 57.6 13.8 25.2 37.8 40.2Q3101 673 3131 673m362 54q-42 0-78-12.6-35.4-13.2-55.2-33-9-9.6-7.8-21.6 1.8-12.6 12-20.4 12-9.6 23.4-7.8 12 1.2 20.4 10.2 10.2 11.4 32.4 21.6 22.8 9.6 50.4 9.6 34.8 0 52.8-11.4 18.6-11.4 19.2-29.4t-17.4-31.2q-17.4-13.2-64.2-21.6-60.6-12-88.2-36-27-24-27-58.8 0-30.6 18-50.4 18-20.4 46.2-30 28.2-10.2 58.8-10.2 39.6 0 70.2 12.6t48.6 34.8q8.4 9.6 7.8 20.4-.6 10.2-10.2 17.4-9.6 6.6-22.8 4.2t-22.2-10.8q-15-14.4-32.4-19.8t-40.2-5.4q-26.4 0-45 9-18 9-18 26.4 0 10.8 5.4 19.8 6 8.4 22.8 15.6 16.8 6.6 49.2 13.2 67.8 13.2 93.6 37.8 26.4 24 26.4 59.4 0 27.6-15 49.8-14.4 22.2-43.2 35.4-28.2 13.2-70.8 13.2"/><path stroke="#fff" stroke-width="4" d="M1058.2 724.6q-13.2 0-22.2-9t-9-22.2V287.2q0-13.8 9-22.2 9-9 22.2-9h143.4q40.8 0 71.4 16.2 31.2 15.6 48.6 43.8 18 28.2 18 64.8 0 29.4-16.2 53.4-15.6 23.4-43.2 37.2 39.6 9.6 63.6 37.8t24 73.8q0 41.4-19.8 73.2-19.2 31.8-54 50.4-34.8 18-79.8 18zm31.2-276h112.2q34.2 0 55.8-16.8 22.2-16.8 22.2-51t-22.2-50.4q-21.6-16.8-55.8-16.8h-112.2zm0 218.4h124.8q40.8 0 67.2-21 26.4-21.6 26.4-63 0-38.4-26.4-57.6t-67.2-19.2h-124.8zm356 57.6q-13.2 0-22.2-8.4-8.4-9-8.4-22.2V427q0-13.8 8.4-22.2 9-8.4 22.2-8.4 13.8 0 22.2 8.4t8.4 22.2v267q0 13.2-8.4 22.2-8.4 8.4-22.2 8.4Zm0-381.6q-16.2 0-28.2-11.4-11.4-12-11.4-28.2t11.4-27.6q12-12 28.2-12t27.6 12q12 11.4 12 27.6t-12 28.2q-11.4 11.4-27.6 11.4ZM1701 727q-49.8 0-88.8-21-38.4-21.6-60.6-58.8-21.6-37.8-21.6-86.4 0-49.2 20.4-86.4 21-37.8 57.6-58.8 36.6-21.6 84-21.6 46.8 0 80.4 21 33.6 20.4 51 57 18 36 18 83.4 0 11.4-7.8 19.2-7.8 7.2-19.8 7.2h-228q6.6 41.4 37.8 67.8 31.8 25.8 77.4 25.8 18.6 0 37.8-6.6 19.8-7.2 31.8-16.2 9-6.6 19.2-6.6 10.8-.6 18.6 6 10.2 9 10.8 19.8t-9.6 18.6q-20.4 16.2-51 26.4-30 10.2-57.6 10.2Zm-9-281.4q-44.4 0-71.4 24.6t-34.2 63.6h199.8q-5.4-38.4-29.4-63-24-25.2-64.8-25.2Zm229.1 279.6q-13.2 0-22.2-8.4-8.4-9-8.4-22.2V427q0-13.8 8.4-22.2 9-8.4 22.2-8.4 13.8 0 22.2 8.4t8.4 22.2v6.6q18.6-18.6 45-29.4t57-10.8q41.4 0 73.8 18 33 17.4 51.6 51.6 19.2 34.2 19.2 84v147.6q0 13.2-9 22.2-8.4 8.4-21.6 8.4t-22.2-8.4q-8.4-9-8.4-22.2V547q0-51-27.6-74.4-27-24-67.8-24-25.2 0-45.6 10.2t-32.4 27.6q-12 16.8-12 39v169.2q0 13.2-8.4 22.2-8.4 8.4-22.2 8.4Zm500.8 1.8q-48 0-85.8-21.6-37.2-22.2-58.8-59.4-21-37.8-21-85.2 0-48.6 21-86.4t57.6-58.8q36.6-21.6 84-21.6 70.8 0 117.6 54 8.4 9.6 6 19.8t-13.2 18q-8.4 6-18.6 4.2-10.2-2.4-18.6-10.8-29.4-31.2-73.2-31.2-46.2 0-75 31.2-28.8 30.6-28.8 81.6 0 32.4 13.2 57.6 13.8 25.2 37.8 40.2 24 14.4 55.8 14.4 40.8 0 66-21 9.6-7.8 19.8-8.4 10.2-1.2 18 5.4 10.2 8.4 11.4 19.2 1.2 10.2-7.2 18.6-43.2 40.2-108 40.2Zm314.6 0q-43.8 0-78.6-21.6-34.8-22.2-55.2-59.4-19.8-37.8-19.8-85.2t21.6-85.2q22.2-37.8 59.4-59.4 37.8-22.2 84.6-22.2t84 22.2q37.2 21.6 58.8 59.4 22.2 37.8 22.2 85.2v133.8q0 13.2-9 22.2-8.4 8.4-21.6 8.4t-22.2-8.4q-8.4-9-8.4-22.2v-22.2q-21 25.2-51 40.2-29.4 14.4-64.8 14.4Zm12-54q30.6 0 54.6-14.4 24-15 37.8-40.2 13.8-25.8 13.8-57.6 0-32.4-13.8-57.6-13.8-25.8-37.8-40.2-24-15-54.6-15-30 0-54.6 15-24 14.4-38.4 40.2-13.8 25.2-13.8 57.6 0 31.8 13.8 57.6 14.4 25.2 38.4 40.2 24.6 14.4 54.6 14.4Zm248.1 192q-13.2 0-22.2-9-8.4-8.4-8.4-21.6V560.8q.6-47.4 22.2-85.2t58.8-59.4q37.2-22.2 84-22.2 47.4 0 84.6 22.2 37.2 21.6 58.8 59.4 22.2 37.8 22.2 85.2t-20.4 85.2q-19.8 37.2-54.6 59.4-34.8 21.6-78.6 21.6-35.4 0-65.4-14.4-29.4-15-50.4-40.2v162q0 13.2-8.4 21.6-8.4 9-22.2 9ZM3131 673q30.6 0 54.6-14.4 24-15 37.8-40.2 14.4-25.8 14.4-57.6 0-32.4-14.4-57.6-13.8-25.8-37.8-40.2-24-15-54.6-15-30 0-54.6 15-24 14.4-37.8 40.2-13.8 25.2-13.8 57.6 0 31.8 13.8 57.6 13.8 25.2 37.8 40.2Q3101 673 3131 673Zm362 54q-42 0-78-12.6-35.4-13.2-55.2-33-9-9.6-7.8-21.6 1.8-12.6 12-20.4 12-9.6 23.4-7.8 12 1.2 20.4 10.2 10.2 11.4 32.4 21.6 22.8 9.6 50.4 9.6 34.8 0 52.8-11.4 18.6-11.4 19.2-29.4t-17.4-31.2q-17.4-13.2-64.2-21.6-60.6-12-88.2-36-27-24-27-58.8 0-30.6 18-50.4 18-20.4 46.2-30 28.2-10.2 58.8-10.2 39.6 0 70.2 12.6t48.6 34.8q8.4 9.6 7.8 20.4-.6 10.2-10.2 17.4-9.6 6.6-22.8 4.2t-22.2-10.8q-15-14.4-32.4-19.8t-40.2-5.4q-26.4 0-45 9-18 9-18 26.4 0 10.8 5.4 19.8 6 8.4 22.8 15.6 16.8 6.6 49.2 13.2 67.8 13.2 93.6 37.8 26.4 24 26.4 59.4 0 27.6-15 49.8-14.4 22.2-43.2 35.4-28.2 13.2-70.8 13.2Z" mask="url(#a)"/><circle cx="1445" cy="300" r="56" fill="#FF8402"/></g>', "width": 3624, "height": 900 }, "browserstack": { "body": '<defs><radialGradient id="a" cx="50.141%" cy="50.003%" r="50.119%" fx="50.141%" fy="50.003%"><stop offset="0%" stop-color="#797979"/><stop offset="100%" stop-color="#4C4C4C"/></radialGradient></defs><circle cx="127.949" cy="128.603" r="127.397" fill="#F5BB60"/><circle cx="114.961" cy="115.615" r="114.685" fill="#E86F32"/><circle cx="130.16" cy="100.416" r="99.485" fill="#E53D42"/><circle cx="138.174" cy="108.43" r="91.471" fill="#BFD141"/><circle cx="131.542" cy="115.062" r="84.839" fill="#6DB64C"/><circle cx="118.001" cy="101.798" r="71.298" fill="#AFDBE7"/><circle cx="129.607" cy="89.915" r="59.691" fill="#57BADF"/><circle cx="137.069" cy="97.376" r="52.506" fill="#02B2D6"/><circle cx="129.331" cy="104.837" r="44.768" fill="url(#a)"/><circle cx="129.331" cy="104.837" r="44.768" fill="#231F20"/><path fill="#FFF" d="M141.088 98.971c4.439 1.992 10.56-2.016 13.672-8.951s2.036-14.173-2.402-16.164c-4.44-1.992-10.56 2.016-13.672 8.951s-2.037 14.173 2.402 16.164"/>', "width": 256, "height": 256 }, "circle": { "body": '<g fill="none"><path fill="#36A2FE" d="M400.062 233c1.575 0 2.854-1.277 2.828-2.852a169.913 169.913 0 0 0-219.72-159.59c-1.506.461-2.325 2.073-1.838 3.57.487 1.498 2.096 2.315 3.602 1.854a164.208 164.208 0 0 1 212.251 154.166c.027 1.575 1.302 2.852 2.877 2.852"/><path fill="#D03E3F" d="M147.341 376.43c-.808 1.352-.367 3.106.998 3.89a169.92 169.92 0 0 0 215.137-38.477 169.9 169.9 0 0 0 34.538-68.334c.376-1.529-.588-3.059-2.124-3.408-1.535-.35-3.062.612-3.438 2.141a164.2 164.2 0 0 1-94.865 111.733 164.21 164.21 0 0 1-146.323-8.552c-1.366-.784-3.115-.345-3.923 1.007"/><path fill="#FBCC13" d="M153.35 86.148c-.751-1.385-2.484-1.9-3.855-1.126a169.914 169.914 0 0 0-35.53 269.228c1.124 1.103 2.931 1.055 4.016-.088 1.084-1.142 1.035-2.945-.088-4.05a164.21 164.21 0 0 1 34.321-260.076c1.372-.775 1.887-2.504 1.136-3.888"/></g>', "left": 63.09, "top": 63.09, "width": 339.8, "height": 339.83 }, "cover-1": { "body": '<g fill="none"><g filter="url(#a)"><path fill="#FFF7FF" d="M583.592 97.78V228h46.946V97.78zm-.29-12.263h47.526v-41.46h-47.526z"/></g><g fill="#E8F2FF" filter="url(#b)"><path fill-rule="evenodd" d="M193.744 183.947c1.643 21.267 1.643 31.236 1.643 42.118h-48.829c0-2.371.042-4.539.084-6.738.132-6.835.27-13.962-.829-28.356-1.452-21.072-10.457-25.755-27.015-25.755H42v-38.34h79.122c20.915 0 31.372-6.412 31.372-23.387 0-14.926-10.457-23.972-31.372-23.972H42V42h87.836c47.35 0 70.88 22.536 70.88 58.535 0 26.926-16.558 44.486-38.926 47.413 18.882 3.805 29.92 14.634 31.954 35.999" clip-rule="evenodd"/><path d="M42 226.064v-28.581h51.63c8.624 0 10.496 6.445 10.496 10.289v18.292z"/></g><g filter="url(#c)"><path fill="#FFF0F1" d="M782.943 97.524h-48.395l-22.025 30.95-21.444-30.95h-51.873l46.656 63.943-50.714 66.278h48.396l25.792-35.329 25.791 35.329H787l-51.004-68.322z"/></g><g filter="url(#d)"><path fill="#FFFAEA" d="M478.111 119.105c-5.506-15.183-17.388-25.694-40.281-25.694-19.416 0-33.326 8.76-40.281 23.066V96.915h-46.947v130.22h46.947v-63.942c0-19.562 5.506-32.409 20.865-32.409 14.2 0 17.677 9.343 17.677 27.154v69.197h46.947v-63.942c0-19.562 5.216-32.409 20.865-32.409 14.199 0 17.387 9.343 17.387 27.154v69.197h46.947v-81.752c0-27.154-10.433-51.972-46.077-51.972-21.735 0-37.094 11.095-44.049 25.694"/></g><g filter="url(#e)"><path fill="#F1FFF0" d="M301.716 176.598c-4.347 10.22-12.461 14.599-25.212 14.599-14.2 0-25.792-7.591-26.951-23.65h90.705v-13.139c0-35.328-22.893-65.11-66.073-65.11-40.281 0-70.419 29.49-70.419 70.658 0 41.46 29.559 66.57 70.999 66.57 34.196 0 57.959-16.643 64.624-46.424zm-51.583-31.825c1.738-12.263 8.404-21.606 23.473-21.606 13.91 0 21.444 9.927 22.024 21.606z"/></g><defs><filter id="a" width="103.526" height="239.944" x="555.302" y="16.056" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset/><feGaussianBlur stdDeviation="14"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix values="0 0 0 0 0.847059 0 0 0 0 0.231373 0 0 0 0 0.823529 0 0 0 1 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_3_93"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset/><feGaussianBlur stdDeviation="14"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix values="0 0 0 0 0.847059 0 0 0 0 0.231373 0 0 0 0 0.823529 0 0 0 1 0"/><feBlend in2="effect1_dropShadow_3_93" result="effect2_dropShadow_3_93"/><feBlend in="SourceGraphic" in2="effect2_dropShadow_3_93" result="shape"/></filter><filter id="b" width="242.715" height="268.065" x="0" y="0" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset/><feGaussianBlur stdDeviation="21"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix values="0 0 0 0 0.223529 0 0 0 0 0.572549 0 0 0 0 1 0 0 0 1 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_3_93"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset/><feGaussianBlur stdDeviation="14"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix values="0 0 0 0 0.223529 0 0 0 0 0.572549 0 0 0 0 1 0 0 0 0.9 0"/><feBlend in2="effect1_dropShadow_3_93" result="effect2_dropShadow_3_93"/><feBlend in="SourceGraphic" in2="effect2_dropShadow_3_93" result="shape"/></filter><filter id="c" width="215.852" height="194.22" x="603.148" y="65.524" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset/><feGaussianBlur stdDeviation="14"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix values="0 0 0 0 0.960784 0 0 0 0 0.2 0 0 0 0 0.258824 0 0 0 1 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_3_93"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset/><feGaussianBlur stdDeviation="16"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix values="0 0 0 0 0.960784 0 0 0 0 0.2 0 0 0 0 0.258824 0 0 0 1 0"/><feBlend in2="effect1_dropShadow_3_93" result="effect2_dropShadow_3_93"/><feBlend in="SourceGraphic" in2="effect2_dropShadow_3_93" result="shape"/></filter><filter id="d" width="273.635" height="189.724" x="322.602" y="65.411" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset/><feGaussianBlur stdDeviation="14"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix values="0 0 0 0 0.996078 0 0 0 0 0.8 0 0 0 0 0.105882 0 0 0 1 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_3_93"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset/><feGaussianBlur stdDeviation="14"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix values="0 0 0 0 0.996078 0 0 0 0 0.8 0 0 0 0 0.105882 0 0 0 1 0"/><feBlend in2="effect1_dropShadow_3_93" result="effect2_dropShadow_3_93"/><feBlend in="SourceGraphic" in2="effect2_dropShadow_3_93" result="shape"/></filter><filter id="e" width="192.493" height="193.228" x="175.766" y="61.298" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset/><feGaussianBlur stdDeviation="14"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix values="0 0 0 0 0.419608 0 0 0 0 0.85098 0 0 0 0 0.407843 0 0 0 1 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_3_93"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset/><feGaussianBlur stdDeviation="14"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix values="0 0 0 0 0.419608 0 0 0 0 0.85098 0 0 0 0 0.407843 0 0 0 1 0"/><feBlend in2="effect1_dropShadow_3_93" result="effect2_dropShadow_3_93"/><feBlend in="SourceGraphic" in2="effect2_dropShadow_3_93" result="shape"/></filter></defs></g>', "width": 819, "height": 269 }, "cover-2": { "body": '<g fill="#61DAFB"><circle cx="64" cy="64" r="11.4"/><path d="M107.3 45.2c-2.2-.8-4.5-1.6-6.9-2.3.6-2.4 1.1-4.8 1.5-7.1 2.1-13.2-.2-22.5-6.6-26.1-1.9-1.1-4-1.6-6.4-1.6-7 0-15.9 5.2-24.9 13.9-9-8.7-17.9-13.9-24.9-13.9-2.4 0-4.5.5-6.4 1.6-6.4 3.7-8.7 13-6.6 26.1.4 2.3.9 4.7 1.5 7.1-2.4.7-4.7 1.4-6.9 2.3C8.2 50 1.4 56.6 1.4 64s6.9 14 19.3 18.8c2.2.8 4.5 1.6 6.9 2.3-.6 2.4-1.1 4.8-1.5 7.1-2.1 13.2.2 22.5 6.6 26.1 1.9 1.1 4 1.6 6.4 1.6 7.1 0 16-5.2 24.9-13.9 9 8.7 17.9 13.9 24.9 13.9 2.4 0 4.5-.5 6.4-1.6 6.4-3.7 8.7-13 6.6-26.1-.4-2.3-.9-4.7-1.5-7.1 2.4-.7 4.7-1.4 6.9-2.3 12.5-4.8 19.3-11.4 19.3-18.8s-6.8-14-19.3-18.8M92.5 14.7c4.1 2.4 5.5 9.8 3.8 20.3-.3 2.1-.8 4.3-1.4 6.6-5.2-1.2-10.7-2-16.5-2.5-3.4-4.8-6.9-9.1-10.4-13 7.4-7.3 14.9-12.3 21-12.3 1.3 0 2.5.3 3.5.9M81.3 74c-1.8 3.2-3.9 6.4-6.1 9.6-3.7.3-7.4.4-11.2.4-3.9 0-7.6-.1-11.2-.4q-3.3-4.8-6-9.6c-1.9-3.3-3.7-6.7-5.3-10 1.6-3.3 3.4-6.7 5.3-10 1.8-3.2 3.9-6.4 6.1-9.6 3.7-.3 7.4-.4 11.2-.4 3.9 0 7.6.1 11.2.4q3.3 4.8 6 9.6c1.9 3.3 3.7 6.7 5.3 10-1.7 3.3-3.4 6.6-5.3 10m8.3-3.3c1.5 3.5 2.7 6.9 3.8 10.3-3.4.8-7 1.4-10.8 1.9 1.2-1.9 2.5-3.9 3.6-6 1.2-2.1 2.3-4.2 3.4-6.2M64 97.8c-2.4-2.6-4.7-5.4-6.9-8.3 2.3.1 4.6.2 6.9.2s4.6-.1 6.9-.2c-2.2 2.9-4.5 5.7-6.9 8.3m-18.6-15c-3.8-.5-7.4-1.1-10.8-1.9 1.1-3.3 2.3-6.8 3.8-10.3 1.1 2 2.2 4.1 3.4 6.1 1.2 2.2 2.4 4.1 3.6 6.1m-7-25.5c-1.5-3.5-2.7-6.9-3.8-10.3 3.4-.8 7-1.4 10.8-1.9-1.2 1.9-2.5 3.9-3.6 6-1.2 2.1-2.3 4.2-3.4 6.2M64 30.2c2.4 2.6 4.7 5.4 6.9 8.3-2.3-.1-4.6-.2-6.9-.2s-4.6.1-6.9.2c2.2-2.9 4.5-5.7 6.9-8.3m22.2 21-3.6-6c3.8.5 7.4 1.1 10.8 1.9-1.1 3.3-2.3 6.8-3.8 10.3-1.1-2.1-2.2-4.2-3.4-6.2M31.7 35c-1.7-10.5-.3-17.9 3.8-20.3 1-.6 2.2-.9 3.5-.9 6 0 13.5 4.9 21 12.3-3.5 3.8-7 8.2-10.4 13-5.8.5-11.3 1.4-16.5 2.5-.6-2.3-1-4.5-1.4-6.6M7 64c0-4.7 5.7-9.7 15.7-13.4 2-.8 4.2-1.5 6.4-2.1 1.6 5 3.6 10.3 6 15.6-2.4 5.3-4.5 10.5-6 15.5C15.3 75.6 7 69.6 7 64m28.5 49.3c-4.1-2.4-5.5-9.8-3.8-20.3.3-2.1.8-4.3 1.4-6.6 5.2 1.2 10.7 2 16.5 2.5 3.4 4.8 6.9 9.1 10.4 13-7.4 7.3-14.9 12.3-21 12.3-1.3 0-2.5-.3-3.5-.9M96.3 93c1.7 10.5.3 17.9-3.8 20.3-1 .6-2.2.9-3.5.9-6 0-13.5-4.9-21-12.3 3.5-3.8 7-8.2 10.4-13 5.8-.5 11.3-1.4 16.5-2.5.6 2.3 1 4.5 1.4 6.6m9-15.6c-2 .8-4.2 1.5-6.4 2.1-1.6-5-3.6-10.3-6-15.6 2.4-5.3 4.5-10.5 6-15.5 13.8 4 22.1 10 22.1 15.6 0 4.7-5.8 9.7-15.7 13.4"/></g>', "width": 128, "height": 128 }, "excalidraw": { "body": '<g fill="#fff"><path d="M3.875.551a50 50 0 0 0-2.673 2.874l-.683.786.125 1.032c.068.563.193 1.666.27 2.44.086.775.173 1.502.201 1.607.039.141 0 .212-.105.212-.183 0-.193-.06.307 1.876.183.74.356 1.42.375 1.49.02.082.097.117.183.082.087-.047.135-.14.106-.223a.186.186 0 0 1 .096-.223c.106-.046.096-.14-.067-.48-.26-.528-.923-5.033-.962-6.487-.029-1.033-.029-1.044.327-1.63.346-.576 1.144-1.444 2.375-2.546.346-.317.692-.669.789-.786.144-.211.211-.153 1.423 1.42.702.902 1.48 1.83 1.73 2.064l.462.422-.356.915c-.192.493-.971 2.393-1.74 4.2-1.606 3.8-1.28 3.436-3.144 3.472l-1.212.011-.404.563c-.423.599-.48.821-.279 1.197.077.129.135.34.135.469 0 .211.067.246.452.27.24.011.461.047.49.082s.067.762.096 1.619l.039 1.548-.644 1.69C.519 23.33.097 24.621.097 25.043c0 .223.038.41.076.41.096 0 .096-.011 4.01-9.97C6 10.862 7.72 6.51 8.01 5.794c.288-.715.548-1.372.567-1.466.02-.105-.644-.914-1.702-2.052C5.923 1.243 5.087.305 5.01.199c-.221-.328-.548-.222-1.135.352m.327 13.49c-.442 1.044-.462 1.056-1.673 1.126-1.067.07-1.087.059-1.087-.187 0-.141-.038-.329-.086-.423-.058-.105-.02-.293.115-.551l.212-.399h.961c.53-.012 1.135-.059 1.346-.105.212-.047.395-.07.414-.06.02.013-.077.282-.202.6m-.808 1.877c-.077.246-.279.762-.442 1.15-.27.656-.298.68-.365.41-.039-.164-.068-.645-.077-1.08-.01-.855-.03-.844.779-.902l.26-.012z"/><path d="M4.164 3.343c-.174.153-.222.305-.222.692 0 .458.03.528.289.657.26.13.327.117.625-.129.394-.328.404-.41.115-.938-.25-.458-.5-.54-.807-.282m.548.422c.153.329.057.575-.231.575-.26 0-.375-.316-.23-.633.114-.258.336-.235.46.058m5.482 2.217c0 .06-.058.118-.125.118-.058 0-.222.328-.347.727-.384 1.22-4.23 10.499-4.24 10.205 0-.152-.058-.258-.154-.258-.134 0-.154.094-.096.552.058.527.02.645-1.346 3.882-.77 1.842-1.596 3.766-1.837 4.282-.25.54-.442 1.126-.461 1.372-.029.423.01.481.846 1.36.48.517 1.096 1.162 1.365 1.455 1.212 1.35 1.78 1.89 1.933 1.854.23-.047 3.798-4.61 3.808-4.868 0-.117-.173-1.9-.385-3.965-.365-3.519-.711-7.636-.673-8.035.029-.247-.115-1.49-.221-2.03-.087-.422-.048-.598.644-2.521a89 89 0 0 1 1.164-3.097c.22-.563.413-1.056.413-1.091s-.067-.059-.144-.059-.144.047-.144.117M7.98 14.745c.106.821.317 2.792.471 4.375.298 2.91.644 6.135.74 6.956.058.41.02.493-.605 1.338-1.087 1.49-2.24 2.956-2.635 3.33l-.365.353-1.875-2.135c-1.731-1.947-1.875-2.147-1.77-2.381l1.087-2.417a405 405 0 0 0 1.577-3.542c.337-.763.644-1.42.702-1.455.067-.047.087 1.138.067 3.66-.038 3.765-.029 3.777.28 3.695.038 0 .066-1.9.066-4.211v-4.2l1.01-2.463c.558-1.36 1.02-2.451 1.039-2.44s.115.704.211 1.537"/></g>', "width": 11, "height": 32 }, "geekyants_logo": { "body": '<g fill="none"><path fill="#fff" d="M327.261 654.581c180.73 0 327.241-146.511 327.241-327.241C654.502 146.609 507.991.099 327.261.099S.02 146.609.02 327.34c0 180.73 146.511 327.241 327.241 327.241"/><path fill="#C81517" d="M327.32 0C146.549 0 0 146.549 0 327.32c0 140.563 88.617 260.398 213.017 306.772 11.519-37.443 40.466-67.219 77.375-79.924-48.152-16.597-82.789-62.18-82.789-115.963 0-40.821 19.996-76.88 50.661-99.188-17.21-40.722-43.153-77.868-75.636-108.138-6.283 3.932-13.692 6.243-21.635 6.243-22.604 0-40.92-18.316-40.92-40.92 0-22.603 18.316-40.919 40.92-40.919 22.603 0 40.92 18.316 40.92 40.919a40.6 40.6 0 0 1-3.419 16.341c34.499 31.989 62.2 71.15 80.852 114.145 15.55-7.133 32.8-11.203 51.017-11.203 18.237 0 35.467 4.09 51.017 11.203 18.197-41.947 45.049-80.22 78.402-111.774-2.885-5.612-4.545-11.954-4.545-18.692 0-22.604 18.316-40.92 40.92-40.92s40.92 18.316 40.92 40.92-18.316 40.92-40.92 40.92a40.84 40.84 0 0 1-19.442-4.9c-31.831 30.033-57.3 66.685-74.253 106.815 30.646 22.307 50.641 58.367 50.641 99.188 0 53.783-34.656 99.385-82.808 115.963 36.218 12.467 64.788 41.354 76.723 77.809C568.592 584.221 654.68 465.887 654.68 327.36 654.64 146.549 508.091 0 327.32 0"/></g>', "width": 655, "height": 655 }, "github-mark-white": { "body": '<path fill="currentColor" stroke="currentColor" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a47 47 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" class="path-element"/>', "width": 98, "height": 96 }, "gitlab": { "body": '<g fill="none"><path fill="#E24329" d="m39.334 15.831-.056-.15L33.834.932a1.417 1.417 0 0 0-2.226-.608 1.5 1.5 0 0 0-.484.76l-3.676 11.678H12.563L8.886 1.084c-.08-.3-.248-.568-.483-.763A1.42 1.42 0 0 0 6.737.228a1.47 1.47 0 0 0-.56.7L.722 15.673l-.054.15a10.88 10.88 0 0 0-.276 6.646 10.5 10.5 0 0 0 3.63 5.484l.018.015.05.037 8.293 6.448 4.103 3.224 2.5 1.96c.292.23.649.354 1.016.354a1.64 1.64 0 0 0 1.017-.355l2.499-1.959 4.103-3.224 8.343-6.487.021-.017a10.5 10.5 0 0 0 3.621-5.48 10.88 10.88 0 0 0-.272-6.638"/><path fill="#FC6D26" d="m39.334 15.831-.056-.149a18.1 18.1 0 0 0-7.32 3.417L20 28.485c4.072 3.198 7.617 5.977 7.617 5.977l8.343-6.487.021-.017a10.5 10.5 0 0 0 3.626-5.482 10.88 10.88 0 0 0-.273-6.645"/><path fill="#FCA326" d="m12.384 34.462 4.103 3.224 2.5 1.959c.292.23.648.355 1.016.355.367 0 .724-.125 1.016-.355l2.5-1.96 4.102-3.223s-3.549-2.788-7.62-5.977c-4.072 3.19-7.617 5.977-7.617 5.977"/><path fill="#FC6D26" d="M8.04 19.098a18.05 18.05 0 0 0-7.318-3.425l-.054.15a10.88 10.88 0 0 0-.276 6.646 10.5 10.5 0 0 0 3.63 5.484l.018.015.05.037 8.293 6.448L20 28.476z"/></g>' }, "linkedin": { "body": '<path fill="currentColor" stroke="currentColor" d="M5.148 0C.374 0 0 .374 0 5.148v9.704C0 19.626.374 20 5.148 20h9.704C19.626 20 20 19.626 20 14.852V5.18C20 .376 19.624 0 14.82 0zm-.481.667h10.666c3.71 0 4 .29 4 4v10.666c0 3.71-.29 4-4 4H4.667c-3.71 0-4-.29-4-4V4.667c0-3.71.29-4 4-4Zm.584 2.586A1.474 1.474 0 1 0 5.248 6.2a1.474 1.474 0 0 0 .003-2.947Zm7.715 3.908c-1.23 0-2.054.676-2.392 1.316h-.034V7.365H8.115V15.5h2.527v-4.025c0-1.06.2-2.09 1.517-2.09 1.297 0 1.315 1.214 1.315 2.158V15.5H16v-4.462c0-2.19-.474-3.877-3.034-3.877Zm-8.98.204V15.5h2.528V7.365z"/>', "width": 20, "height": 20 }, "mongodb": { "body": '<g fill="none"><g clip-path="url(#a)"><path fill="#599636" d="m19.875.109 1.068 2.005c.24.37.5.697.806 1.002.894.894 1.742 1.83 2.505 2.833 1.809 2.375 3.029 5.012 3.9 7.865.522 1.742.806 3.53.827 5.337.088 5.404-1.765 10.044-5.5 13.9-.61.61-1.262 1.175-1.962 1.678-.37 0-.545-.284-.698-.545a4.5 4.5 0 0 1-.545-1.569c-.13-.654-.217-1.308-.175-1.983v-.305c-.03-.065-.356-30.064-.226-30.218"/><path fill="#6CAC48" d="M19.875.043c-.044-.088-.087-.022-.131.02.021.438-.131.828-.37 1.2-.263.37-.61.655-.959.96-1.937 1.677-3.462 3.703-4.684 5.97-1.625 3.05-2.462 6.318-2.7 9.76-.109 1.24.393 5.62.784 6.884 1.068 3.355 2.985 6.167 5.469 8.607.61.587 1.262 1.132 1.937 1.656.197 0 .218-.175.263-.305q.129-.417.196-.85l.438-3.268z"/><path fill="#C2BFBF" d="M20.942 36.056c.044-.5.284-.915.545-1.328-.262-.11-.457-.325-.61-.567a4 4 0 0 1-.325-.718c-.305-.915-.37-1.875-.457-2.81v-.567c-.109.088-.131.828-.131.938q-.096 1.483-.393 2.941c-.065.392-.109.784-.35 1.133 0 .043 0 .087.021.152.393 1.155.5 2.331.567 3.53v.438c0 .522-.022.412.412.587.175.065.37.088.545.218.131 0 .153-.11.153-.197l-.065-.718v-2.005c-.022-.35.043-.698.087-1.026z"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h40v40H0z"/></clipPath></defs></g>' }, "mysql": { "body": '<g fill="none"><g clip-path="url(#a)"><path fill="#00678C" fill-rule="evenodd" d="M36.845 31.158c-2.176-.06-3.864.162-5.278.757-.407.164-1.061.164-1.115.677.218.215.244.567.435.865.326.54.898 1.27 1.415 1.648l1.74 1.244c1.061.648 2.258 1.027 3.292 1.676.599.379 1.197.865 1.795 1.271.305.217.49.569.871.703v-.082c-.19-.242-.245-.593-.435-.865l-.817-.783c-.788-1.055-1.768-1.974-2.829-2.73-.87-.596-2.774-1.407-3.128-2.406l-.053-.061c.597-.06 1.304-.27 1.876-.433.926-.243 1.769-.19 2.72-.432l1.306-.379v-.242c-.49-.487-.843-1.136-1.36-1.595-1.386-1.19-2.91-2.353-4.489-3.326-.843-.54-1.931-.892-2.829-1.351-.327-.162-.87-.244-1.06-.514-.492-.594-.763-1.378-1.117-2.082l-2.23-4.704c-.49-1.054-.79-2.109-1.387-3.082-2.802-4.596-5.85-7.38-10.529-10.111-1.006-.568-2.203-.812-3.475-1.11l-2.04-.108c-.437-.19-.871-.703-1.252-.947C5.32 1.683 1.322-.426.179 2.353-.556 4.11 1.267 5.84 1.886 6.733c.463.622 1.06 1.325 1.388 2.028.183.459.244.946.435 1.433.435 1.19.843 2.514 1.414 3.623.305.568.625 1.164 1.007 1.677.217.303.598.433.68.92-.382.54-.408 1.35-.626 2.027-.98 3.056-.598 6.84.789 9.09.436.675 1.463 2.163 2.857 1.594 1.224-.486.951-2.027 1.305-3.379.082-.324.027-.54.19-.757v.06l1.116 2.244c.843 1.325 2.313 2.704 3.536 3.624.653.486 1.17 1.325 1.986 1.622v-.082h-.054c-.163-.242-.409-.352-.626-.54-.49-.487-1.034-1.082-1.415-1.623-1.142-1.513-2.148-3.19-3.046-4.92-.436-.838-.817-1.757-1.17-2.595-.164-.325-.164-.812-.435-.974-.409.594-1.007 1.11-1.307 1.839-.517 1.162-.57 2.595-.761 4.082-.11.027-.061 0-.11.06-.87-.215-1.17-1.108-1.495-1.864-.816-1.92-.953-5.002-.246-7.219.19-.568 1.008-2.352.681-2.893-.164-.514-.707-.81-1.007-1.216a11 11 0 0 1-.978-1.73c-.653-1.515-.98-3.19-1.687-4.705-.327-.703-.898-1.433-1.36-2.082-.518-.73-1.088-1.244-1.497-2.108-.136-.303-.326-.784-.108-1.11.054-.216.163-.302.38-.35.353-.304 1.36.08 1.714.242 1.006.406 1.85.784 2.693 1.351.381.27.79.784 1.28.92h.571c.87.189 1.85.06 2.665.303 1.442.46 2.747 1.135 3.918 1.866a24.04 24.04 0 0 1 8.487 9.247c.326.622.462 1.19.762 1.838.572 1.326 1.28 2.677 1.85 3.976.572 1.27 1.116 2.569 1.931 3.623.409.568 2.04.865 2.775 1.162.544.243 1.387.46 1.878.758.924.567 1.849 1.217 2.719 1.838.435.324 1.796 1 1.877 1.54zM9.102 7.664a4.4 4.4 0 0 0-1.115.135v.06h.054c.218.433.599.73.87 1.11l.627 1.297.054-.06c.38-.27.572-.703.572-1.352-.164-.189-.19-.378-.327-.567-.163-.27-.517-.406-.735-.622z" clip-rule="evenodd"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h40v40H0z"/></clipPath></defs></g>' }, "nodejs": { "body": '<g fill="none"><g clip-path="url(#a)"><path fill="#689F63" d="M32.127 40c-.215 0-.428-.056-.616-.165l-1.96-1.166c-.292-.164-.15-.223-.053-.256.39-.137.47-.168.886-.406.044-.025.101-.016.146.01l1.506.898c.054.03.131.03.182 0l5.87-3.405a.19.19 0 0 0 .09-.16v-6.805a.19.19 0 0 0-.091-.163l-5.868-3.401a.18.18 0 0 0-.181 0l-5.866 3.401a.19.19 0 0 0-.094.161v6.806c0 .065.036.127.091.158l1.608.933c.873.439 1.406-.078 1.406-.597v-6.718c0-.096.075-.17.17-.17h.744a.17.17 0 0 1 .17.17v6.72c0 1.17-.636 1.842-1.74 1.842-.339 0-.606 0-1.352-.37l-1.54-.891a1.25 1.25 0 0 1-.616-1.077v-6.806c0-.443.235-.856.616-1.075l5.876-3.406a1.28 1.28 0 0 1 1.234 0l5.869 3.408c.379.22.615.632.615 1.075v6.806c0 .441-.236.853-.615 1.075l-5.87 3.406c-.187.109-.4.165-.618.165"/><path fill="#689F63" d="M33.94 35.31c-2.568 0-3.106-1.184-3.106-2.178a.17.17 0 0 1 .17-.17h.758a.17.17 0 0 1 .167.144c.115.777.456 1.168 2.009 1.168 1.237 0 1.763-.28 1.763-.94 0-.38-.15-.661-2.072-.85-1.607-.16-2.6-.515-2.6-1.807 0-1.19.999-1.899 2.672-1.899 1.88 0 2.811.656 2.929 2.064a.173.173 0 0 1-.17.186h-.763a.17.17 0 0 1-.165-.133c-.184-.816-.627-1.078-1.834-1.078-1.35 0-1.507.473-1.507.827 0 .43.185.555 2.007.798 1.804.24 2.66.58 2.66 1.854 0 1.284-1.066 2.021-2.926 2.021m7.15-7.218h.197c.161 0 .192-.114.192-.18 0-.174-.119-.174-.185-.174h-.203zm-.24-.558h.437c.15 0 .443 0 .443.337 0 .234-.15.283-.24.313.176.011.188.127.211.289.012.102.03.277.066.337h-.269c-.007-.06-.048-.384-.048-.402-.018-.072-.043-.108-.132-.108h-.222v.511h-.246zm-.524.635c0 .528.424.957.946.957.526 0 .95-.438.95-.957a.95.95 0 0 0-.951-.951.947.947 0 0 0-.947.95m2.08.004c0 .626-.509 1.137-1.13 1.137a1.136 1.136 0 0 1 0-2.274c.61 0 1.13.494 1.13 1.137"/><path fill="#333" fill-rule="evenodd" d="M13.95 13.369a.76.76 0 0 0-.376-.656L7.35 9.115a.7.7 0 0 0-.342-.1h-.064a.74.74 0 0 0-.344.1L.376 12.713A.76.76 0 0 0 0 13.37l.014 9.69a.374.374 0 0 0 .559.327l3.7-2.13a.76.76 0 0 0 .376-.655v-4.527c0-.27.143-.52.376-.654l1.575-.912a.74.74 0 0 1 .75 0l1.574.912a.75.75 0 0 1 .377.654v4.527c0 .268.144.516.376.655l3.698 2.128c.116.07.26.07.376 0a.38.38 0 0 0 .186-.327zm29.367 5.046c0 .067-.035.13-.094.163l-2.137 1.238a.19.19 0 0 1-.188 0l-2.138-1.238a.19.19 0 0 1-.094-.163v-2.48a.19.19 0 0 1 .093-.164l2.136-1.24a.19.19 0 0 1 .19 0l2.137 1.24a.19.19 0 0 1 .094.164zM43.895.047a.376.376 0 0 0-.56.33v9.597a.264.264 0 0 1-.394.229L41.382 9.3a.75.75 0 0 0-.751 0l-6.226 3.61a.75.75 0 0 0-.376.653v7.223c0 .27.144.518.376.654l6.226 3.613a.75.75 0 0 0 .752 0l6.225-3.615a.76.76 0 0 0 .377-.654v-18a.76.76 0 0 0-.387-.66zM64.626 15.87a.76.76 0 0 0 .374-.653v-1.75a.76.76 0 0 0-.374-.654L58.44 9.205a.75.75 0 0 0-.754 0l-6.224 3.61a.76.76 0 0 0-.377.653v7.22c0 .272.146.523.38.657l6.184 3.542a.75.75 0 0 0 .738.004l3.74-2.089a.38.38 0 0 0 .004-.657l-6.263-3.611a.38.38 0 0 1-.19-.326v-2.265c0-.135.071-.26.189-.327l1.948-1.13a.37.37 0 0 1 .375 0l1.95 1.13a.38.38 0 0 1 .188.326v1.78a.376.376 0 0 0 .564.326z" clip-rule="evenodd"/><path fill="#689F63" fill-rule="evenodd" d="M57.972 15.532a.14.14 0 0 1 .144 0l1.194.692a.14.14 0 0 1 .072.126v1.386c0 .052-.027.1-.072.125l-1.194.693a.14.14 0 0 1-.144 0l-1.194-.693a.14.14 0 0 1-.073-.125V16.35c0-.052.026-.1.072-.126z" clip-rule="evenodd"/><mask id="b" width="14" height="17" x="17" y="9" maskUnits="userSpaceOnUse" style="mask-type:luminance"><path fill="#fff" d="m23.616 9.24-6.19 3.59a.75.75 0 0 0-.374.651v7.186a.75.75 0 0 0 .374.65l6.19 3.593a.75.75 0 0 0 .749 0l6.19-3.593a.75.75 0 0 0 .373-.65V13.48a.75.75 0 0 0-.375-.65l-6.189-3.59a.75.75 0 0 0-.75 0"/></mask><g mask="url(#b)"><path fill="url(#c)" d="M37.183 12.221 19.74 3.63l-8.944 18.333 17.443 8.592z"/></g><mask id="d" width="14" height="17" x="17" y="9" maskUnits="userSpaceOnUse" style="mask-type:luminance"><path fill="#fff" d="M17.205 21.123a.8.8 0 0 0 .22.194l5.31 3.082.885.511a.75.75 0 0 0 .578.071l6.53-12.012a.7.7 0 0 0-.175-.139L26.5 10.478 24.357 9.24a.8.8 0 0 0-.194-.079z"/></mask><g mask="url(#d)"><path fill="url(#e)" d="m9.663 14.762 12.317 16.75L38.27 19.42 25.951 2.67z"/></g><mask id="f" width="14" height="17" x="17" y="9" maskUnits="userSpaceOnUse" style="mask-type:luminance"><path fill="#fff" d="M23.915 9.144a.75.75 0 0 0-.299.097l-6.173 3.58L24.1 25.002a.7.7 0 0 0 .267-.092l6.19-3.593a.75.75 0 0 0 .361-.513L24.132 9.157a.8.8 0 0 0-.213-.012"/></mask><g mask="url(#f)"><path fill="url(#g)" d="M17.443 9.142v15.86h13.471V9.143z"/></g></g><defs><linearGradient id="c" x1="28.456" x2="19.444" y1="7.912" y2="26.21" gradientUnits="userSpaceOnUse"><stop offset=".3" stop-color="#3E863D"/><stop offset=".5" stop-color="#55934F"/><stop offset=".8" stop-color="#5AAD45"/></linearGradient><linearGradient id="e" x1="15.895" x2="32.24" y1="23.233" y2="11.214" gradientUnits="userSpaceOnUse"><stop offset=".57" stop-color="#3E863D"/><stop offset=".72" stop-color="#619857"/><stop offset="1" stop-color="#76AC64"/></linearGradient><linearGradient id="g" x1="17.447" x2="30.917" y1="17.073" y2="17.073" gradientUnits="userSpaceOnUse"><stop offset=".16" stop-color="#6BBF47"/><stop offset=".38" stop-color="#79B461"/><stop offset=".47" stop-color="#75AC64"/><stop offset=".7" stop-color="#659E5A"/><stop offset=".9" stop-color="#3E863D"/></linearGradient><clipPath id="a"><path fill="#fff" d="M0 0h65v40H0z"/></clipPath></defs></g>', "width": 65 }, "noise": { "body": '<filter id="a" x="0" y="0"><feTurbulence baseFrequency=".65" numOctaves="3" stitchTiles="stitch" type="fractalNoise"/><feBlend mode="screen"/></filter><path fill="currentColor" d="M0 0h500v500H0z" filter="url(#a)" opacity=".5"/>', "width": 500, "height": 500 }, "notion": { "body": '<path fill="#fff" fill-rule="evenodd" d="M4.54 5.104c.845.688 1.163.635 2.751.53l14.977-.9c.318 0 .054-.317-.052-.37l-2.487-1.798c-.477-.37-1.112-.794-2.329-.688L2.898 2.936c-.529.052-.635.317-.424.529zm.899 3.49v15.759c0 .847.423 1.164 1.375 1.111l16.46-.952c.953-.053 1.06-.635 1.06-1.323V7.536c0-.687-.265-1.057-.849-1.004l-17.2 1.004c-.635.054-.846.371-.846 1.059m16.248.846c.106.476 0 .952-.477 1.006l-.793.158v11.634c-.688.37-1.323.581-1.853.581-.847 0-1.059-.264-1.693-1.057l-5.188-8.144v7.88l1.642.37s0 .951-1.325.951l-3.65.212c-.107-.212 0-.74.37-.846l.952-.264V11.503l-1.322-.106c-.107-.476.158-1.163.9-1.217l3.916-.264 5.398 8.25v-7.298l-1.376-.158c-.106-.582.317-1.005.847-1.058zM1.68 1.508 16.765.398c1.852-.16 2.329-.053 3.493.793l4.815 3.384c.795.582 1.06.74 1.06 1.375v18.562c0 1.163-.424 1.851-1.906 1.956L6.71 27.526c-1.113.053-1.642-.105-2.224-.846L.94 22.08c-.636-.848-.9-1.481-.9-2.222v-16.5c0-.95.424-1.744 1.64-1.85" clip-rule="evenodd"/>', "width": 27, "height": 28 }, "railway": { "body": '<g fill="none"><g fill="#fff" clip-path="url(#a)"><path d="M.186 17.116Q.042 18.12 0 19.13h30.383a3.6 3.6 0 0 0-.393-.577c-5.194-6.71-7.988-6.128-11.985-6.299-1.332-.055-2.236-.077-7.54-.077-2.84 0-5.926.008-8.931.016-.39 1.05-.764 2.068-.947 2.896h15.57v2.027zm30.436 4.044H.016q.047.811.155 1.602h28.257c1.26 0 1.965-.715 2.194-1.602M1.758 28.293S6.443 39.796 19.978 40c8.091 0 15.043-4.805 18.2-11.707z"/><path d="M19.979 0C12.499 0 5.989 4.108 2.55 10.18c2.686-.005 7.918-.009 7.918-.009h.001v-.002c6.184 0 6.414.028 7.622.078l.748.028c2.606.087 5.808.367 8.328 2.273 1.368 1.034 3.343 3.316 4.52 4.942 1.088 1.504 1.401 3.233.661 4.89-.68 1.521-2.146 2.43-3.921 2.43H.652s.165.7.413 1.474H38.98A20 20 0 0 0 40 20.01C40 8.959 31.036 0 19.979 0"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h40v40H0z"/></clipPath></defs></g>' }, "react": { "body": '<g fill="none"><g clip-path="url(#a)"><path fill="#61DAFB" d="M23 24.007c2.264 0 4.1-1.794 4.1-4.007s-1.836-4.007-4.1-4.007c-2.265 0-4.1 1.794-4.1 4.007s1.835 4.007 4.1 4.007"/><path stroke="#61DAFB" d="M23 28.21c12.15 0 22-3.676 22-8.21s-9.85-8.21-22-8.21S1 15.466 1 20s9.85 8.21 22 8.21Z"/><path stroke="#61DAFB" d="M15.725 24.105C21.8 34.389 29.982 40.888 34 38.62s2.35-12.442-3.726-22.726C24.2 5.611 16.017-.888 12 1.38s-2.35 12.44 3.725 22.725Z"/><path stroke="#61DAFB" d="M15.725 15.895C9.65 26.18 7.982 36.354 12 38.621c4.017 2.267 12.2-4.232 18.274-14.516S38.017 3.645 34 1.379C29.982-.888 21.8 5.61 15.725 15.895Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h46v40H0z"/></clipPath></defs></g>', "width": 46 }, "remix": { "body": '<g fill="none"><g clip-path="url(#a)"><path fill="#212121" d="M74 0H0v40h74z"/><g fill="#E8F2FF" filter="url(#b)"><path fill-rule="evenodd" d="M23.356 23.09c.101 1.357.101 1.993.101 2.688h-3.01c0-.152.002-.29.005-.43.008-.436.016-.891-.052-1.81-.09-1.343-.644-1.642-1.666-1.642H14V19.45h4.879c1.29 0 1.934-.41 1.934-1.492 0-.952-.645-1.53-1.934-1.53h-4.88v-2.393h5.417c2.92 0 4.371 1.438 4.371 3.734 0 1.718-1.021 2.838-2.4 3.025 1.164.243 1.845.934 1.97 2.297" clip-rule="evenodd"/><path d="M13.999 25.778v-1.824h3.183c.532 0 .648.412.648.657v1.167z"/></g><g filter="url(#c)"><path fill="#FFF0F1" d="M59.69 17.577h-2.985l-1.358 1.975-1.322-1.975h-3.2l2.878 4.08-3.127 4.228h2.984l1.59-2.254 1.591 2.254h3.199l-3.145-4.359z"/></g><g filter="url(#d)"><path fill="#FFFAEA" d="M40.892 18.954c-.34-.969-1.072-1.64-2.484-1.64-1.197 0-2.055.56-2.484 1.473v-1.248h-2.895v8.307h2.895v-4.08c0-1.247.34-2.067 1.287-2.067.875 0 1.09.596 1.09 1.732v4.415h2.895v-4.08c0-1.247.321-2.067 1.286-2.067.876 0 1.073.596 1.073 1.732v4.415h2.895v-5.215c0-1.733-.644-3.316-2.842-3.316-1.34 0-2.287.708-2.716 1.64"/></g><g filter="url(#e)"><path fill="#F1FFF0" d="M30.014 22.622c-.268.652-.768.931-1.554.931-.876 0-1.59-.484-1.662-1.509h5.593v-.838c0-2.253-1.412-4.154-4.074-4.154-2.484 0-4.343 1.882-4.343 4.508 0 2.645 1.823 4.247 4.378 4.247 2.11 0 3.575-1.062 3.985-2.962zm-3.18-2.03c.107-.783.518-1.379 1.447-1.379.858 0 1.322.633 1.358 1.379z"/></g><g filter="url(#f)"><path fill="#FFF7FF" d="M47.396 17.594V25.9h2.895v-8.307zm-.018-.783h2.931v-2.645h-2.93z"/></g></g><defs><filter id="b" width="65.788" height="67.743" x="-14.002" y="-13.965" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset/><feGaussianBlur stdDeviation="14"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix values="0 0 0 0 0.223529 0 0 0 0 0.572549 0 0 0 0 1 0 0 0 0.9 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_40_82"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_40_82" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset/><feGaussianBlur stdDeviation="21"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix values="0 0 0 0 0.223529 0 0 0 0 0.572549 0 0 0 0 1 0 0 0 1 0"/><feBlend in2="shape" result="effect2_innerShadow_40_82"/></filter><filter id="c" width="73.364" height="72.308" x="18.576" y="-14.423" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset/><feGaussianBlur stdDeviation="16"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix values="0 0 0 0 0.960784 0 0 0 0 0.2 0 0 0 0 0.258824 0 0 0 1 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_40_82"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_40_82" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset/><feGaussianBlur stdDeviation="14"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix values="0 0 0 0 0.960784 0 0 0 0 0.2 0 0 0 0 0.258824 0 0 0 1 0"/><feBlend in2="shape" result="effect2_innerShadow_40_82"/></filter><filter id="d" width="69.421" height="64.531" x="5.029" y="-10.685" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset/><feGaussianBlur stdDeviation="14"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix values="0 0 0 0 0.996078 0 0 0 0 0.8 0 0 0 0 0.105882 0 0 0 1 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_40_82"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_40_82" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset/><feGaussianBlur stdDeviation="14"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix values="0 0 0 0 0.996078 0 0 0 0 0.8 0 0 0 0 0.105882 0 0 0 1 0"/><feBlend in2="shape" result="effect2_innerShadow_40_82"/></filter><filter id="e" width="64.417" height="64.754" x="-4.026" y="-10.947" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset/><feGaussianBlur stdDeviation="14"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix values="0 0 0 0 0.419608 0 0 0 0 0.85098 0 0 0 0 0.407843 0 0 0 1 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_40_82"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_40_82" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset/><feGaussianBlur stdDeviation="14"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix values="0 0 0 0 0.419608 0 0 0 0 0.85098 0 0 0 0 0.407843 0 0 0 1 0"/><feBlend in2="shape" result="effect2_innerShadow_40_82"/></filter><filter id="f" width="58.931" height="67.735" x="19.378" y="-13.834" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset/><feGaussianBlur stdDeviation="14"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix values="0 0 0 0 0.847059 0 0 0 0 0.231373 0 0 0 0 0.823529 0 0 0 1 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_40_82"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_40_82" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset/><feGaussianBlur stdDeviation="14"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix values="0 0 0 0 0.847059 0 0 0 0 0.231373 0 0 0 0 0.823529 0 0 0 1 0"/><feBlend in2="shape" result="effect2_innerShadow_40_82"/></filter><clipPath id="a"><path fill="#fff" d="M0 0h74v40H0z"/></clipPath></defs></g>', "width": 74 }, "tailwind": { "body": '<g fill="none"><g clip-path="url(#a)"><mask id="b" width="65" height="40" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:luminance"><path fill="#fff" d="M0 0h65v39.273H0z"/></mask><g mask="url(#b)"><path fill="#38BDF8" fill-rule="evenodd" d="M32.5 0q-13 0-16.25 13.09 4.875-6.545 11.375-4.908c2.472.622 4.24 2.429 6.196 4.428 3.186 3.257 6.874 7.026 14.929 7.026q13 0 16.25-13.09-4.875 6.545-11.375 4.908c-2.472-.621-4.24-2.429-6.196-4.427C44.244 3.77 40.555 0 32.5 0M16.25 19.636q-13 0-16.25 13.091 4.875-6.545 11.375-4.909c2.472.623 4.24 2.43 6.195 4.428 3.187 3.257 6.875 7.027 14.93 7.027q13 0 16.25-13.091-4.875 6.546-11.375 4.909c-2.472-.622-4.24-2.43-6.195-4.428-3.187-3.257-6.875-7.027-14.93-7.027" clip-rule="evenodd"/></g></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h65v40H0z"/></clipPath></defs></g>', "width": 65 }, "twitterx": { "body": '<path fill="#fff" stroke="currentColor" d="M3.333 0A3.34 3.34 0 0 0 0 3.333v13.334A3.34 3.34 0 0 0 3.333 20h13.334A3.34 3.34 0 0 0 20 16.667V3.333A3.34 3.34 0 0 0 16.667 0zm0 .952h13.334c1.32 0 2.38 1.06 2.38 2.381v13.334c0 1.32-1.06 2.38-2.38 2.38H3.333c-1.32 0-2.38-1.06-2.38-2.38V3.333c0-1.32 1.06-2.38 2.38-2.38Zm.994 3.334 4.391 6.24-4.432 5.188h1.19l3.78-4.425 3.114 4.425h3.78l-4.822-6.85 3.91-4.578h-1.19L10.79 8.1 8.106 4.286zm1.823.952h1.459l6.718 9.524h-1.46z"/>', "width": 20, "height": 20 }, "vercel": { "body": '<path fill="#fff" fill-rule="evenodd" d="m20 3.75 18.75 32.5H1.25z" clip-rule="evenodd"/>' } }, "width": 40, "height": 40 } };
    defaultIconDimensions = Object.freeze(
      {
        left: 0,
        top: 0,
        width: 16,
        height: 16
      }
    );
    defaultIconTransformations = Object.freeze({
      rotate: 0,
      vFlip: false,
      hFlip: false
    });
    defaultIconProps = Object.freeze({
      ...defaultIconDimensions,
      ...defaultIconTransformations
    });
    defaultExtendedIconProps = Object.freeze({
      ...defaultIconProps,
      body: "",
      hidden: false
    });
    defaultIconSizeCustomisations = Object.freeze({
      width: null,
      height: null
    });
    defaultIconCustomisations = Object.freeze({
      // Dimensions
      ...defaultIconSizeCustomisations,
      // Transformations
      ...defaultIconTransformations
    });
    __name(mergeIconTransformations, "mergeIconTransformations");
    __name(mergeIconData, "mergeIconData");
    __name(getIconsTree, "getIconsTree");
    __name(internalGetIconData, "internalGetIconData");
    __name(getIconData, "getIconData");
    unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
    unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
    __name(calculateSize, "calculateSize");
    __name(splitSVGDefs, "splitSVGDefs");
    __name(mergeDefsAndContent, "mergeDefsAndContent");
    __name(wrapSVGContent, "wrapSVGContent");
    isUnsetKeyword = /* @__PURE__ */ __name((value) => value === "unset" || value === "undefined" || value === "none", "isUnsetKeyword");
    __name(iconToSVG, "iconToSVG");
    cache = /* @__PURE__ */ new WeakMap();
    $$Astro$1 = createAstro();
    $$Icon = createComponent(($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
      Astro2.self = $$Icon;
      class AstroIconError extends Error {
        static {
          __name(this, "AstroIconError");
        }
        constructor(message) {
          super(message);
          this.hint = "";
        }
      }
      const req = Astro2.request;
      const { name = "", title, desc, "is:inline": inline = false, ...props } = Astro2.props;
      const map = cache.get(req) ?? /* @__PURE__ */ new Map();
      const i2 = map.get(name) ?? 0;
      map.set(name, i2 + 1);
      cache.set(req, map);
      const includeSymbol = !inline && i2 === 0;
      let [setName, iconName] = name.split(":");
      if (!setName && iconName) {
        const err = new AstroIconError(`Invalid "name" provided!`);
        throw err;
      }
      if (!iconName) {
        iconName = setName;
        setName = "local";
        if (!icons[setName]) {
          const err = new AstroIconError('Unable to load the "local" icon set!');
          throw err;
        }
        if (!(iconName in icons[setName].icons)) {
          const err = new AstroIconError(`Unable to locate "${name}" icon!`);
          throw err;
        }
      }
      const collection = icons[setName];
      if (!collection) {
        const err = new AstroIconError(`Unable to locate the "${setName}" icon set!`);
        throw err;
      }
      const iconData = getIconData(collection, iconName ?? setName);
      if (!iconData) {
        const err = new AstroIconError(`Unable to locate "${name}" icon!`);
        throw err;
      }
      const id = `ai:${collection.prefix}:${iconName ?? setName}`;
      if (props.size) {
        props.width = props.size;
        props.height = props.size;
        delete props.size;
      }
      const renderData = iconToSVG(iconData);
      const normalizedProps = { ...renderData.attributes, ...props };
      const normalizedBody = renderData.body;
      const { viewBox } = normalizedProps;
      if (includeSymbol) {
        delete normalizedProps.viewBox;
      }
      return renderTemplate`${maybeRenderHead()}<svg${spreadAttributes(normalizedProps)}${addAttribute(name, "data-icon")}> ${title && renderTemplate`<title>${title}</title>`} ${desc && renderTemplate`<desc>${desc}</desc>`} ${inline ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, { "id": id }, { "default": /* @__PURE__ */ __name(($$result2) => renderTemplate`${unescapeHTML(normalizedBody)}`, "default") })}` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": /* @__PURE__ */ __name(($$result2) => renderTemplate`${includeSymbol && renderTemplate`<symbol${addAttribute(id, "id")}${addAttribute(viewBox, "viewBox")}>${unescapeHTML(normalizedBody)}</symbol>`}<use${addAttribute(`#${id}`, "href")}></use> `, "default") })}`} </svg>`;
    }, "/Users/vivek/Desktop/self/myPortfolio/node_modules/.pnpm/astro-icon@1.1.5/node_modules/astro-icon/components/Icon.astro", void 0);
    $$Navbar = createComponent(($$result, $$props, $$slots) => {
      return renderTemplate`${maybeRenderHead()}<div class="relative mx-auto"> <aside class="container fixed z-40 mx-auto flex w-full justify-end px-2 pt-16 sm:px-8 md:px-4 md:pt-0 lg:px-4"> <nav class="mb-14 mr-4 mt-4 w-fit cursor-pointer rounded-full bg-black px-4 py-2 ring-1 ring-neutral-border"> <a href="/" class="px-3 font-semibold hover:text-white/60">Home</a> <a href="/blogs" class="px-3 font-semibold hover:text-white/60">Blogs</a> <a href="/talks" class="px-3 font-semibold hover:text-white/60">Talks</a> <a href="/projects" class="px-3 font-semibold hover:text-white/60">Projects</a> </nav> <nav class="mb-14 mt-4 flex w-fit cursor-pointer rounded-full bg-black px-4 py-2 ring-1 ring-neutral-border"> <a href="https://www.github.com/isVivek99" aria-label="github redirect"> ${renderComponent($$result, "Icon", $$Icon, { "name": "github-mark-white", "class": "mx-3 h-6 w-6 transform transition duration-300 hover:text-color-red focus:text-color-red" })} </a> <a href="https://twitter.com/VivekLokhande99" aria-label="twitter redirect"> ${renderComponent($$result, "Icon", $$Icon, { "name": "twitterx", "class": "mx-3 h-6 w-6 transform transition duration-300 hover:text-color-yellow focus:text-color-yellow" })}</a> <a href="https://www.linkedin.com/in/vivek-lokhande-737939188/" aria-label="linkedin redirect"> ${renderComponent($$result, "Icon", $$Icon, { "name": "linkedin", "class": "mx-3 h-6 w-6 transform transition duration-300 hover:text-color-blue focus:text-color-blue" })}</a> </nav> </aside> </div>`;
    }, "/Users/vivek/Desktop/self/myPortfolio/src/components/Navbar.astro", void 0);
    $$Footer = createComponent(($$result, $$props, $$slots) => {
      return renderTemplate`${maybeRenderHead()}<footer class="mt-auto bg-footer px-8"> <div class="mx-auto my-auto flex h-28 max-w-[1232px] flex-col items-center justify-center md:flex-row md:justify-between"> <div> <p class="mb-1
      font-thin
      uppercase
      leading-snug
      tracking-[2px]
      text-white">
© Vivek Lokhande.
</p> </div> <div class="flex"> <a href="/blogs" class="mx-3
    mb-1
    font-thin
    leading-snug
    text-white">Blogs</a> <span class="mx-3
    mb-1
    font-thin
    leading-snug
    text-white">Contact</span> <a href="/projects" class="mx-3
    mb-1
    font-thin
    leading-snug
    text-white">Projects</a> <a href="/talks" class="mx-3
    mb-1
    font-thin
    leading-snug
    text-white">Talks</a> </div> </div> </footer>`;
    }, "/Users/vivek/Desktop/self/myPortfolio/src/components/Footer.astro", void 0);
    $$NavbarMobile = createComponent(($$result, $$props, $$slots) => {
      return renderTemplate`${maybeRenderHead()}<div class="overlay fixed inset-0 z-40 transition-colors duration-300 md:bg-transparent"> <aside class="h-full w-full"> <nav class="menu pointer-events-auto absolute right-2 top-3 cursor-pointer rounded-full border-2 border-solid border-neutral-border bg-neutral px-4 py-2"> <span class="font-semibold"> menu</span> <div class="nav-links absolute right-3 top-16 hidden flex-col rounded-md border-2 border-solid border-neutral-border bg-neutral p-1"> <div class="cursor-pointer px-3 py-1 hover:text-color-red focus:text-color-red"> <a class="block w-full" href="/blogs"> <span class="font-semibold">Blogs</span> </a> </div> <div class="cursor-pointer px-3 py-1 hover:text-color-yellow focus:text-color-yellow"> <a class="block w-full" href="/talks"> <span class="font-semibold">Talks</span> </a> </div> <div class="cursor-pointer px-3 py-1 hover:text-color-blue focus:text-color-blue"> <a class="block w-full" href="/projects"> <span class="font-semibold">Projects</span> </a> </div> <div class="flex cursor-pointer px-3 py-2"> <a href="https://www.github.com/isVivek99"> ${renderComponent($$result, "Icon", $$Icon, { "name": "github-mark-white", "class": "mr-3 h-4 w-4 transform transition duration-300 hover:text-color-red focus:text-color-red" })} </a> <a href="https://twitter.com/VivekLokhande99"> ${renderComponent($$result, "Icon", $$Icon, { "name": "twitterx", "class": "mx-3 h-4 w-4 transform transition duration-300 hover:text-color-yellow focus:text-color-yellow" })} </a> <a href="https://www.linkedin.com/in/vivek-lokhande-737939188/"> ${renderComponent($$result, "Icon", $$Icon, { "name": "linkedin", "class": "mx-3 h-4 w-4 transform transition duration-300 hover:text-color-blue focus:text-color-blue" })} </a> </div> </div> </nav> </aside> ${renderScript($$result, "/Users/vivek/Desktop/self/myPortfolio/src/components/NavbarMobile.astro?astro&type=script&index=0&lang.ts")} </div>`;
    }, "/Users/vivek/Desktop/self/myPortfolio/src/components/NavbarMobile.astro", void 0);
    $$Astro = createAstro();
    $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
      Astro2.self = $$BaseLayout;
      const { pageTitle } = Astro2.props;
      return renderTemplate`<html lang="en" id="index" class="bg-black [color-scheme:dark]"> <head><meta charset="utf-8"><link rel="icon" type="image/svg+xml" href="/myImage.webp"><meta name="viewport" content="width=device-width"><meta name="description" content="vivek lokhandes portfolio"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${pageTitle}</title>${renderHead()}</head> <body class="flex min-h-screen flex-col font-sans"> <main class="container mx-auto px-4 pt-16 sm:px-8 md:px-4 md:pt-0 lg:px-2"> <div class="hidden md:block"> ${renderComponent($$result, "Navbar", $$Navbar, {})} </div> <div class="flex justify-end md:hidden"> ${renderComponent($$result, "NavbarMobile", $$NavbarMobile, {})} </div> ${renderSlot($$result, $$slots["default"])} </main> ${renderComponent($$result, "Footer", $$Footer, {})} </body></html>`;
    }, "/Users/vivek/Desktop/self/myPortfolio/src/layout/BaseLayout.astro", void 0);
  }
});

// .wrangler/tmp/pages-ErOWne/pages/404.astro.mjs
var astro_exports = {};
__export(astro_exports, {
  page: () => page2,
  renderers: () => renderers
});
var $$404, $$file, $$url, _page2, page2;
var init_astro = __esm({
  ".wrangler/tmp/pages-ErOWne/pages/404.astro.mjs"() {
    "use strict";
    init_modules_watch_stub();
    init_server_QlrBW5xk();
    init_BaseLayout_A4ggbcpe();
    init_renderers();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    $$404 = createComponent(($$result, $$props, $$slots) => {
      return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "pageTitle": "404 page" }, { "default": /* @__PURE__ */ __name(($$result2) => renderTemplate` ${maybeRenderHead()}<section class="section-1 relative flex min-h-screen w-full snap-start pt-20 md:min-h-fit md:pt-32"> <p class="m-auto px-3 font-semibold">
This page is still work in progress...
</p> </section> `, "default") })} ${renderScript($$result, "/Users/vivek/Desktop/self/myPortfolio/src/pages/404.astro?astro&type=script&index=0&lang.ts")}`;
    }, "/Users/vivek/Desktop/self/myPortfolio/src/pages/404.astro", void 0);
    $$file = "/Users/vivek/Desktop/self/myPortfolio/src/pages/404.astro";
    $$url = "/404";
    _page2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      default: $$404,
      file: $$file,
      url: $$url
    }, Symbol.toStringTag, { value: "Module" }));
    page2 = /* @__PURE__ */ __name(() => _page2, "page");
  }
});

// .wrangler/tmp/pages-ErOWne/pages/blogs/_slug_.astro.mjs
var slug_astro_exports = {};
var init_slug_astro = __esm({
  ".wrangler/tmp/pages-ErOWne/pages/blogs/_slug_.astro.mjs"() {
    "use strict";
    init_modules_watch_stub();
  }
});

// .wrangler/tmp/pages-ErOWne/chunks/sharp_CSSE_8-f.mjs
var sharp_CSSE_8_f_exports = {};
__export(sharp_CSSE_8_f_exports, {
  default: () => sharp_default
});
async function loadSharp() {
  let sharpImport;
  try {
    sharpImport = (await import("sharp")).default;
  } catch {
    throw new AstroError(MissingSharp);
  }
  sharpImport.cache(false);
  return sharpImport;
}
var sharp, qualityTable, fitMap, sharpService, sharp_default;
var init_sharp_CSSE_8_f = __esm({
  ".wrangler/tmp/pages-ErOWne/chunks/sharp_CSSE_8-f.mjs"() {
    "use strict";
    init_modules_watch_stub();
    init_server_QlrBW5xk();
    init_astro_assets_B0_JMAFI();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    qualityTable = {
      low: 25,
      mid: 50,
      high: 80,
      max: 100
    };
    __name(loadSharp, "loadSharp");
    fitMap = {
      fill: "fill",
      contain: "inside",
      cover: "cover",
      none: "outside",
      "scale-down": "inside",
      outside: "outside",
      inside: "inside"
    };
    sharpService = {
      validateOptions: baseService.validateOptions,
      getURL: baseService.getURL,
      parseURL: baseService.parseURL,
      getHTMLAttributes: baseService.getHTMLAttributes,
      getSrcSet: baseService.getSrcSet,
      async transform(inputBuffer, transformOptions, config) {
        if (!sharp) sharp = await loadSharp();
        const transform = transformOptions;
        if (transform.format === "svg") return { data: inputBuffer, format: "svg" };
        const result = sharp(inputBuffer, {
          failOnError: false,
          pages: -1,
          limitInputPixels: config.service.config.limitInputPixels
        });
        result.rotate();
        const withoutEnlargement = Boolean(transform.fit);
        if (transform.width && transform.height && transform.fit) {
          const fit = fitMap[transform.fit] ?? "inside";
          result.resize({
            width: Math.round(transform.width),
            height: Math.round(transform.height),
            fit,
            position: transform.position,
            withoutEnlargement
          });
        } else if (transform.height && !transform.width) {
          result.resize({
            height: Math.round(transform.height),
            withoutEnlargement
          });
        } else if (transform.width) {
          result.resize({
            width: Math.round(transform.width),
            withoutEnlargement
          });
        }
        if (transform.format) {
          let quality = void 0;
          if (transform.quality) {
            const parsedQuality = parseQuality(transform.quality);
            if (typeof parsedQuality === "number") {
              quality = parsedQuality;
            } else {
              quality = transform.quality in qualityTable ? qualityTable[transform.quality] : void 0;
            }
          }
          result.toFormat(transform.format, { quality });
        }
        const { data, info: info2 } = await result.toBuffer({ resolveWithObject: true });
        return {
          data,
          format: info2.format
        };
      }
    };
    sharp_default = sharpService;
  }
});

// .wrangler/tmp/pages-ErOWne/chunks/_astro_assets_B0-JMAFI.mjs
var astro_assets_B0_JMAFI_exports = {};
__export(astro_assets_B0_JMAFI_exports, {
  $: () => $$Image,
  V: () => VALID_INPUT_FORMATS,
  _: () => _astro_assets,
  b: () => baseService,
  p: () => parseQuality
});
function matchPattern(url, remotePattern) {
  return matchProtocol(url, remotePattern.protocol) && matchHostname(url, remotePattern.hostname, true) && matchPort(url, remotePattern.port) && matchPathname(url, remotePattern.pathname, true);
}
function matchPort(url, port) {
  return !port || port === url.port;
}
function matchProtocol(url, protocol) {
  return !protocol || protocol === url.protocol.slice(0, -1);
}
function matchHostname(url, hostname, allowWildcard = false) {
  if (!hostname) {
    return true;
  } else if (!allowWildcard || !hostname.startsWith("*")) {
    return hostname === url.hostname;
  } else if (hostname.startsWith("**.")) {
    const slicedHostname = hostname.slice(2);
    return slicedHostname !== url.hostname && url.hostname.endsWith(slicedHostname);
  } else if (hostname.startsWith("*.")) {
    const slicedHostname = hostname.slice(1);
    const additionalSubdomains = url.hostname.replace(slicedHostname, "").split(".").filter(Boolean);
    return additionalSubdomains.length === 1;
  }
  return false;
}
function matchPathname(url, pathname, allowWildcard = false) {
  if (!pathname) {
    return true;
  } else if (!allowWildcard || !pathname.endsWith("*")) {
    return pathname === url.pathname;
  } else if (pathname.endsWith("/**")) {
    const slicedPathname = pathname.slice(0, -2);
    return slicedPathname !== url.pathname && url.pathname.startsWith(slicedPathname);
  } else if (pathname.endsWith("/*")) {
    const slicedPathname = pathname.slice(0, -1);
    const additionalPathChunks = url.pathname.replace(slicedPathname, "").split("/").filter(Boolean);
    return additionalPathChunks.length === 1;
  }
  return false;
}
function isRemoteAllowed(src, {
  domains,
  remotePatterns
}) {
  if (!URL.canParse(src)) {
    return false;
  }
  const url = new URL(src);
  return domains.some((domain) => matchHostname(url, domain)) || remotePatterns.some((remotePattern) => matchPattern(url, remotePattern));
}
function isESMImportedImage(src) {
  return typeof src === "object" || typeof src === "function" && "src" in src;
}
function isRemoteImage(src) {
  return typeof src === "string";
}
async function resolveSrc(src) {
  if (typeof src === "object" && "then" in src) {
    const resource = await src;
    return resource.default ?? resource;
  }
  return src;
}
function isLocalService(service) {
  if (!service) {
    return false;
  }
  return "transform" in service;
}
function parseQuality(quality) {
  let result = parseInt(quality);
  if (Number.isNaN(result)) {
    return quality;
  }
  return result;
}
function getTargetDimensions(options) {
  let targetWidth = options.width;
  let targetHeight = options.height;
  if (isESMImportedImage(options.src)) {
    const aspectRatio = options.src.width / options.src.height;
    if (targetHeight && !targetWidth) {
      targetWidth = Math.round(targetHeight * aspectRatio);
    } else if (targetWidth && !targetHeight) {
      targetHeight = Math.round(targetWidth / aspectRatio);
    } else if (!targetWidth && !targetHeight) {
      targetWidth = options.src.width;
      targetHeight = options.src.height;
    }
  }
  return {
    targetWidth,
    targetHeight
  };
}
function isImageMetadata(src) {
  return src.fsPath && !("fsPath" in src);
}
function addCSSVarsToStyle(vars, styles) {
  const cssVars = Object.entries(vars).filter(([_, value]) => value !== void 0 && value !== false).map(([key, value]) => `--${key}: ${value};`).join(" ");
  if (!styles) {
    return cssVars;
  }
  const style = typeof styles === "string" ? styles : toStyleString(styles);
  return `${cssVars} ${style}`;
}
function readUInt(input, bits, offset, isBigEndian) {
  offset = offset || 0;
  const endian = isBigEndian ? "BE" : "LE";
  const methodName = "readUInt" + bits + endian;
  return methods[methodName](input, offset);
}
function readBox(buffer, offset) {
  if (buffer.length - offset < 4) return;
  const boxSize = readUInt32BE(buffer, offset);
  if (buffer.length - offset < boxSize) return;
  return {
    name: toUTF8String(buffer, 4 + offset, 8 + offset),
    offset,
    size: boxSize
  };
}
function findBox(buffer, boxName, offset) {
  while (offset < buffer.length) {
    const box = readBox(buffer, offset);
    if (!box) break;
    if (box.name === boxName) return box;
    offset += box.size;
  }
}
function getSizeFromOffset(input, offset) {
  const value = input[offset];
  return value === 0 ? 256 : value;
}
function getImageSize$1(input, imageIndex) {
  const offset = SIZE_HEADER$1 + imageIndex * SIZE_IMAGE_ENTRY;
  return {
    height: getSizeFromOffset(input, offset + 1),
    width: getSizeFromOffset(input, offset)
  };
}
function detectBrands(buffer, start, end) {
  let brandsDetected = {};
  for (let i2 = start; i2 <= end; i2 += 4) {
    const brand = toUTF8String(buffer, i2, i2 + 4);
    if (brand in brandMap) {
      brandsDetected[brand] = 1;
    }
  }
  if ("avif" in brandsDetected) {
    return "avif";
  } else if ("heic" in brandsDetected || "heix" in brandsDetected || "hevc" in brandsDetected || "hevx" in brandsDetected) {
    return "heic";
  } else if ("mif1" in brandsDetected || "msf1" in brandsDetected) {
    return "heif";
  }
}
function readImageHeader(input, imageOffset) {
  const imageLengthOffset = imageOffset + ENTRY_LENGTH_OFFSET;
  return [
    toUTF8String(input, imageOffset, imageLengthOffset),
    readUInt32BE(input, imageLengthOffset)
  ];
}
function getImageSize(type) {
  const size = ICON_TYPE_SIZE[type];
  return { width: size, height: size, type };
}
function isEXIF(input) {
  return toHexString(input, 2, 6) === EXIF_MARKER;
}
function extractSize(input, index) {
  return {
    height: readUInt16BE(input, index),
    width: readUInt16BE(input, index + 2)
  };
}
function extractOrientation(exifBlock, isBigEndian) {
  const idfOffset = 8;
  const offset = EXIF_HEADER_BYTES + idfOffset;
  const idfDirectoryEntries = readUInt(exifBlock, 16, offset, isBigEndian);
  for (let directoryEntryNumber = 0; directoryEntryNumber < idfDirectoryEntries; directoryEntryNumber++) {
    const start = offset + NUM_DIRECTORY_ENTRIES_BYTES + directoryEntryNumber * IDF_ENTRY_BYTES;
    const end = start + IDF_ENTRY_BYTES;
    if (start > exifBlock.length) {
      return;
    }
    const block = exifBlock.slice(start, end);
    const tagNumber = readUInt(block, 16, 0, isBigEndian);
    if (tagNumber === 274) {
      const dataFormat = readUInt(block, 16, 2, isBigEndian);
      if (dataFormat !== 3) {
        return;
      }
      const numberOfComponents = readUInt(block, 32, 4, isBigEndian);
      if (numberOfComponents !== 1) {
        return;
      }
      return readUInt(block, 16, 8, isBigEndian);
    }
  }
}
function validateExifBlock(input, index) {
  const exifBlock = input.slice(APP1_DATA_SIZE_BYTES, index);
  const byteAlign = toHexString(
    exifBlock,
    EXIF_HEADER_BYTES,
    EXIF_HEADER_BYTES + TIFF_BYTE_ALIGN_BYTES
  );
  const isBigEndian = byteAlign === BIG_ENDIAN_BYTE_ALIGN;
  const isLittleEndian = byteAlign === LITTLE_ENDIAN_BYTE_ALIGN;
  if (isBigEndian || isLittleEndian) {
    return extractOrientation(exifBlock, isBigEndian);
  }
}
function validateInput(input, index) {
  if (index > input.length) {
    throw new TypeError("Corrupt JPG, exceeded buffer limits");
  }
}
function parseLength(len) {
  const m2 = unitsReg.exec(len);
  if (!m2) {
    return void 0;
  }
  return Math.round(Number(m2[1]) * (units[m2[2]] || 1));
}
function parseViewbox(viewbox) {
  const bounds = viewbox.split(" ");
  return {
    height: parseLength(bounds[3]),
    width: parseLength(bounds[2])
  };
}
function parseAttributes(root) {
  const width = extractorRegExps.width.exec(root);
  const height = extractorRegExps.height.exec(root);
  const viewbox = extractorRegExps.viewbox.exec(root);
  return {
    height: height && parseLength(height[2]),
    viewbox: viewbox && parseViewbox(viewbox[2]),
    width: width && parseLength(width[2])
  };
}
function calculateByDimensions(attrs) {
  return {
    height: attrs.height,
    width: attrs.width
  };
}
function calculateByViewbox(attrs, viewbox) {
  const ratio = viewbox.width / viewbox.height;
  if (attrs.width) {
    return {
      height: Math.floor(attrs.width / ratio),
      width: attrs.width
    };
  }
  if (attrs.height) {
    return {
      height: attrs.height,
      width: Math.floor(attrs.height * ratio)
    };
  }
  return {
    height: viewbox.height,
    width: viewbox.width
  };
}
function readIFD(input, isBigEndian) {
  const ifdOffset = readUInt(input, 32, 4, isBigEndian);
  return input.slice(ifdOffset + 2);
}
function readValue(input, isBigEndian) {
  const low = readUInt(input, 16, 8, isBigEndian);
  const high = readUInt(input, 16, 10, isBigEndian);
  return (high << 16) + low;
}
function nextTag(input) {
  if (input.length > 24) {
    return input.slice(12);
  }
}
function extractTags(input, isBigEndian) {
  const tags = {};
  let temp = input;
  while (temp && temp.length) {
    const code = readUInt(temp, 16, 0, isBigEndian);
    const type = readUInt(temp, 16, 2, isBigEndian);
    const length = readUInt(temp, 32, 4, isBigEndian);
    if (code === 0) {
      break;
    } else {
      if (length === 1 && (type === 3 || type === 4)) {
        tags[code] = readValue(temp, isBigEndian);
      }
      temp = nextTag(temp);
    }
  }
  return tags;
}
function determineEndianness(input) {
  const signature = toUTF8String(input, 0, 2);
  if ("II" === signature) {
    return "LE";
  } else if ("MM" === signature) {
    return "BE";
  }
}
function calculateExtended(input) {
  return {
    height: 1 + readUInt24LE(input, 7),
    width: 1 + readUInt24LE(input, 4)
  };
}
function calculateLossless(input) {
  return {
    height: 1 + ((input[4] & 15) << 10 | input[3] << 2 | (input[2] & 192) >> 6),
    width: 1 + ((input[2] & 63) << 8 | input[1])
  };
}
function calculateLossy(input) {
  return {
    height: readInt16LE(input, 8) & 16383,
    width: readInt16LE(input, 6) & 16383
  };
}
function detector(input) {
  const byte = input[0];
  const type = firstBytes.get(byte);
  if (type && typeHandlers.get(type).validate(input)) {
    return type;
  }
  return types.find((fileType) => typeHandlers.get(fileType).validate(input));
}
function lookup$1(input) {
  const type = detector(input);
  if (typeof type !== "undefined") {
    if (globalOptions.disabledTypes.includes(type)) {
      throw new TypeError("disabled file type: " + type);
    }
    const size = typeHandlers.get(type).calculate(input);
    if (size !== void 0) {
      size.type = size.type ?? type;
      return size;
    }
  }
  throw new TypeError("unsupported file type: " + type);
}
async function imageMetadata(data, src) {
  let result;
  try {
    result = lookup$1(data);
  } catch {
    throw new AstroError({
      ...NoImageMetadata,
      message: NoImageMetadata.message(src)
    });
  }
  if (!result.height || !result.width || !result.type) {
    throw new AstroError({
      ...NoImageMetadata,
      message: NoImageMetadata.message(src)
    });
  }
  const { width, height, type, orientation } = result;
  const isPortrait = (orientation || 0) >= 5;
  return {
    width: isPortrait ? height : width,
    height: isPortrait ? width : height,
    format: type,
    orientation
  };
}
async function inferRemoteSize(url) {
  const response = await fetch(url);
  if (!response.body || !response.ok) {
    throw new AstroError({
      ...FailedToFetchRemoteImageDimensions,
      message: FailedToFetchRemoteImageDimensions.message(url)
    });
  }
  const reader = response.body.getReader();
  let done, value;
  let accumulatedChunks = new Uint8Array();
  while (!done) {
    const readResult = await reader.read();
    done = readResult.done;
    if (done) break;
    if (readResult.value) {
      value = readResult.value;
      let tmp = new Uint8Array(accumulatedChunks.length + value.length);
      tmp.set(accumulatedChunks, 0);
      tmp.set(value, accumulatedChunks.length);
      accumulatedChunks = tmp;
      try {
        const dimensions = await imageMetadata(accumulatedChunks, url);
        if (dimensions) {
          await reader.cancel();
          return dimensions;
        }
      } catch {
      }
    }
  }
  throw new AstroError({
    ...NoImageMetadata,
    message: NoImageMetadata.message(url)
  });
}
async function getConfiguredImageService() {
  if (!globalThis?.astroAsset?.imageService) {
    const { default: service } = await Promise.resolve().then(() => (init_sharp_CSSE_8_f(), sharp_CSSE_8_f_exports)).catch((e2) => {
      const error2 = new AstroError(InvalidImageService);
      error2.cause = e2;
      throw error2;
    });
    if (!globalThis.astroAsset) globalThis.astroAsset = {};
    globalThis.astroAsset.imageService = service;
    return service;
  }
  return globalThis.astroAsset.imageService;
}
async function getImage$1(options, imageConfig2) {
  if (!options || typeof options !== "object") {
    throw new AstroError({
      ...ExpectedImageOptions,
      message: ExpectedImageOptions.message(JSON.stringify(options))
    });
  }
  if (typeof options.src === "undefined") {
    throw new AstroError({
      ...ExpectedImage,
      message: ExpectedImage.message(
        options.src,
        "undefined",
        JSON.stringify(options)
      )
    });
  }
  if (isImageMetadata(options)) {
    throw new AstroError(ExpectedNotESMImage);
  }
  const service = await getConfiguredImageService();
  const resolvedOptions = {
    ...options,
    src: await resolveSrc(options.src)
  };
  let originalWidth;
  let originalHeight;
  let originalFormat;
  if (options.inferSize && isRemoteImage(resolvedOptions.src) && isRemotePath(resolvedOptions.src)) {
    const result = await inferRemoteSize(resolvedOptions.src);
    resolvedOptions.width ??= result.width;
    resolvedOptions.height ??= result.height;
    originalWidth = result.width;
    originalHeight = result.height;
    originalFormat = result.format;
    delete resolvedOptions.inferSize;
  }
  const originalFilePath = isESMImportedImage(resolvedOptions.src) ? resolvedOptions.src.fsPath : void 0;
  const clonedSrc = isESMImportedImage(resolvedOptions.src) ? (
    // @ts-expect-error - clone is a private, hidden prop
    resolvedOptions.src.clone ?? resolvedOptions.src
  ) : resolvedOptions.src;
  if (isESMImportedImage(clonedSrc)) {
    originalWidth = clonedSrc.width;
    originalHeight = clonedSrc.height;
    originalFormat = clonedSrc.format;
  }
  if (originalWidth && originalHeight) {
    const aspectRatio = originalWidth / originalHeight;
    if (resolvedOptions.height && !resolvedOptions.width) {
      resolvedOptions.width = Math.round(resolvedOptions.height * aspectRatio);
    } else if (resolvedOptions.width && !resolvedOptions.height) {
      resolvedOptions.height = Math.round(resolvedOptions.width / aspectRatio);
    } else if (!resolvedOptions.width && !resolvedOptions.height) {
      resolvedOptions.width = originalWidth;
      resolvedOptions.height = originalHeight;
    }
  }
  resolvedOptions.src = clonedSrc;
  const layout = options.layout ?? imageConfig2.experimentalLayout;
  if (imageConfig2.experimentalResponsiveImages && layout) {
    resolvedOptions.widths ||= getWidths({
      width: resolvedOptions.width,
      layout,
      originalWidth,
      breakpoints: imageConfig2.experimentalBreakpoints?.length ? imageConfig2.experimentalBreakpoints : isLocalService(service) ? LIMITED_RESOLUTIONS : DEFAULT_RESOLUTIONS
    });
    resolvedOptions.sizes ||= getSizesAttribute({ width: resolvedOptions.width, layout });
    if (resolvedOptions.priority) {
      resolvedOptions.loading ??= "eager";
      resolvedOptions.decoding ??= "sync";
      resolvedOptions.fetchpriority ??= "high";
    } else {
      resolvedOptions.loading ??= "lazy";
      resolvedOptions.decoding ??= "async";
      resolvedOptions.fetchpriority ??= "auto";
    }
    delete resolvedOptions.priority;
    delete resolvedOptions.densities;
    if (layout !== "none") {
      resolvedOptions.style = addCSSVarsToStyle(
        {
          w: String(resolvedOptions.width),
          h: String(resolvedOptions.height),
          fit: cssFitValues.includes(resolvedOptions.fit ?? "") && resolvedOptions.fit,
          pos: resolvedOptions.position
        },
        resolvedOptions.style
      );
      resolvedOptions["data-astro-image"] = layout;
    }
  }
  const validatedOptions = service.validateOptions ? await service.validateOptions(resolvedOptions, imageConfig2) : resolvedOptions;
  const srcSetTransforms = service.getSrcSet ? await service.getSrcSet(validatedOptions, imageConfig2) : [];
  let imageURL = await service.getURL(validatedOptions, imageConfig2);
  const matchesOriginal = /* @__PURE__ */ __name((transform) => transform.width === originalWidth && transform.height === originalHeight && transform.format === originalFormat, "matchesOriginal");
  let srcSets = await Promise.all(
    srcSetTransforms.map(async (srcSet) => {
      return {
        transform: srcSet.transform,
        url: matchesOriginal(srcSet.transform) ? imageURL : await service.getURL(srcSet.transform, imageConfig2),
        descriptor: srcSet.descriptor,
        attributes: srcSet.attributes
      };
    })
  );
  if (isLocalService(service) && globalThis.astroAsset.addStaticImage && !(isRemoteImage(validatedOptions.src) && imageURL === validatedOptions.src)) {
    const propsToHash = service.propertiesToHash ?? DEFAULT_HASH_PROPS;
    imageURL = globalThis.astroAsset.addStaticImage(
      validatedOptions,
      propsToHash,
      originalFilePath
    );
    srcSets = srcSetTransforms.map((srcSet) => {
      return {
        transform: srcSet.transform,
        url: matchesOriginal(srcSet.transform) ? imageURL : globalThis.astroAsset.addStaticImage(srcSet.transform, propsToHash, originalFilePath),
        descriptor: srcSet.descriptor,
        attributes: srcSet.attributes
      };
    });
  }
  return {
    rawOptions: resolvedOptions,
    options: validatedOptions,
    src: imageURL,
    srcSet: {
      values: srcSets,
      attribute: srcSets.map((srcSet) => `${srcSet.url} ${srcSet.descriptor}`).join(", ")
    },
    attributes: service.getHTMLAttributes !== void 0 ? await service.getHTMLAttributes(validatedOptions, imageConfig2) : {}
  };
}
function lookup(extn) {
  let tmp = ("" + extn).trim().toLowerCase();
  let idx = tmp.lastIndexOf(".");
  return mimes[!~idx ? tmp : tmp.substring(++idx)];
}
var VALID_INPUT_FORMATS, VALID_SUPPORTED_FORMATS, DEFAULT_OUTPUT_FORMAT, DEFAULT_HASH_PROPS, DEFAULT_RESOLUTIONS, LIMITED_RESOLUTIONS, getWidths, getSizesAttribute, sortNumeric, baseService, cssFitValues, decoder2, toUTF8String, toHexString, readInt16LE, readUInt16BE, readUInt16LE, readUInt24LE, readInt32LE, readUInt32BE, readUInt32LE, methods, BMP, TYPE_ICON, SIZE_HEADER$1, SIZE_IMAGE_ENTRY, ICO, TYPE_CURSOR, CUR, DDS, gifRegexp, GIF, brandMap, HEIF, SIZE_HEADER, FILE_LENGTH_OFFSET, ENTRY_LENGTH_OFFSET, ICON_TYPE_SIZE, ICNS, J2C, JP2, EXIF_MARKER, APP1_DATA_SIZE_BYTES, EXIF_HEADER_BYTES, TIFF_BYTE_ALIGN_BYTES, BIG_ENDIAN_BYTE_ALIGN, LITTLE_ENDIAN_BYTE_ALIGN, IDF_ENTRY_BYTES, NUM_DIRECTORY_ENTRIES_BYTES, JPG, KTX, pngSignature, pngImageHeaderChunkName, pngFriedChunkName, PNG, PNMTypes, handlers, PNM, PSD, svgReg, extractorRegExps, INCH_CM, units, unitsReg, SVG, TGA, signatures, TIFF, WEBP, typeHandlers, types, firstBytes, globalOptions, $$Astro$2, $$Image, mimes, $$Astro$12, $$Picture, $$Astro2, $$Font, imageConfig, getImage, _astro_assets;
var init_astro_assets_B0_JMAFI = __esm({
  ".wrangler/tmp/pages-ErOWne/chunks/_astro_assets_B0-JMAFI.mjs"() {
    "use strict";
    init_modules_watch_stub();
    init_path_C_ZOwaTP();
    init_server_QlrBW5xk();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    VALID_INPUT_FORMATS = [
      "jpeg",
      "jpg",
      "png",
      "tiff",
      "webp",
      "gif",
      "svg",
      "avif"
    ];
    VALID_SUPPORTED_FORMATS = [
      "jpeg",
      "jpg",
      "png",
      "tiff",
      "webp",
      "gif",
      "svg",
      "avif"
    ];
    DEFAULT_OUTPUT_FORMAT = "webp";
    DEFAULT_HASH_PROPS = [
      "src",
      "width",
      "height",
      "format",
      "quality",
      "fit",
      "position"
    ];
    DEFAULT_RESOLUTIONS = [
      640,
      // older and lower-end phones
      750,
      // iPhone 6-8
      828,
      // iPhone XR/11
      960,
      // older horizontal phones
      1080,
      // iPhone 6-8 Plus
      1280,
      // 720p
      1668,
      // Various iPads
      1920,
      // 1080p
      2048,
      // QXGA
      2560,
      // WQXGA
      3200,
      // QHD+
      3840,
      // 4K
      4480,
      // 4.5K
      5120,
      // 5K
      6016
      // 6K
    ];
    LIMITED_RESOLUTIONS = [
      640,
      // older and lower-end phones
      750,
      // iPhone 6-8
      828,
      // iPhone XR/11
      1080,
      // iPhone 6-8 Plus
      1280,
      // 720p
      1668,
      // Various iPads
      2048,
      // QXGA
      2560
      // WQXGA
    ];
    getWidths = /* @__PURE__ */ __name(({
      width,
      layout,
      breakpoints = DEFAULT_RESOLUTIONS,
      originalWidth
    }) => {
      const smallerThanOriginal = /* @__PURE__ */ __name((w) => !originalWidth || w <= originalWidth, "smallerThanOriginal");
      if (layout === "full-width") {
        return breakpoints.filter(smallerThanOriginal);
      }
      if (!width) {
        return [];
      }
      const doubleWidth = width * 2;
      const maxSize = originalWidth ? Math.min(doubleWidth, originalWidth) : doubleWidth;
      if (layout === "fixed") {
        return originalWidth && width > originalWidth ? [originalWidth] : [width, maxSize];
      }
      if (layout === "responsive") {
        return [
          // Always include the image at 1x and 2x the specified width
          width,
          doubleWidth,
          ...breakpoints
        ].filter((w) => w <= maxSize).sort((a2, b2) => a2 - b2);
      }
      return [];
    }, "getWidths");
    getSizesAttribute = /* @__PURE__ */ __name(({
      width,
      layout
    }) => {
      if (!width || !layout) {
        return void 0;
      }
      switch (layout) {
        // If screen is wider than the max size then image width is the max size,
        // otherwise it's the width of the screen
        case `responsive`:
          return `(min-width: ${width}px) ${width}px, 100vw`;
        // Image is always the same width, whatever the size of the screen
        case `fixed`:
          return `${width}px`;
        // Image is always the width of the screen
        case `full-width`:
          return `100vw`;
        case "none":
        default:
          return void 0;
      }
    }, "getSizesAttribute");
    __name(matchPattern, "matchPattern");
    __name(matchPort, "matchPort");
    __name(matchProtocol, "matchProtocol");
    __name(matchHostname, "matchHostname");
    __name(matchPathname, "matchPathname");
    __name(isRemoteAllowed, "isRemoteAllowed");
    __name(isESMImportedImage, "isESMImportedImage");
    __name(isRemoteImage, "isRemoteImage");
    __name(resolveSrc, "resolveSrc");
    __name(isLocalService, "isLocalService");
    __name(parseQuality, "parseQuality");
    sortNumeric = /* @__PURE__ */ __name((a2, b2) => a2 - b2, "sortNumeric");
    baseService = {
      validateOptions(options) {
        if (!options.src || !isRemoteImage(options.src) && !isESMImportedImage(options.src)) {
          throw new AstroError({
            ...ExpectedImage,
            message: ExpectedImage.message(
              JSON.stringify(options.src),
              typeof options.src,
              JSON.stringify(options, (_, v) => v === void 0 ? null : v)
            )
          });
        }
        if (!isESMImportedImage(options.src)) {
          if (options.src.startsWith("/@fs/") || !isRemotePath(options.src) && !options.src.startsWith("/")) {
            throw new AstroError({
              ...LocalImageUsedWrongly,
              message: LocalImageUsedWrongly.message(options.src)
            });
          }
          let missingDimension;
          if (!options.width && !options.height) {
            missingDimension = "both";
          } else if (!options.width && options.height) {
            missingDimension = "width";
          } else if (options.width && !options.height) {
            missingDimension = "height";
          }
          if (missingDimension) {
            throw new AstroError({
              ...MissingImageDimension,
              message: MissingImageDimension.message(missingDimension, options.src)
            });
          }
        } else {
          if (!VALID_SUPPORTED_FORMATS.includes(options.src.format)) {
            throw new AstroError({
              ...UnsupportedImageFormat,
              message: UnsupportedImageFormat.message(
                options.src.format,
                options.src.src,
                VALID_SUPPORTED_FORMATS
              )
            });
          }
          if (options.widths && options.densities) {
            throw new AstroError(IncompatibleDescriptorOptions);
          }
          if (options.src.format === "svg") {
            options.format = "svg";
          }
          if (options.src.format === "svg" && options.format !== "svg" || options.src.format !== "svg" && options.format === "svg") {
            throw new AstroError(UnsupportedImageConversion);
          }
        }
        if (!options.format) {
          options.format = DEFAULT_OUTPUT_FORMAT;
        }
        if (options.width) options.width = Math.round(options.width);
        if (options.height) options.height = Math.round(options.height);
        if (options.layout && options.width && options.height) {
          options.fit ??= "cover";
          delete options.layout;
        }
        if (options.fit === "none") {
          delete options.fit;
        }
        return options;
      },
      getHTMLAttributes(options) {
        const { targetWidth, targetHeight } = getTargetDimensions(options);
        const {
          src,
          width,
          height,
          format,
          quality,
          densities,
          widths,
          formats,
          layout,
          priority,
          fit,
          position,
          ...attributes
        } = options;
        return {
          ...attributes,
          width: targetWidth,
          height: targetHeight,
          loading: attributes.loading ?? "lazy",
          decoding: attributes.decoding ?? "async"
        };
      },
      getSrcSet(options) {
        const { targetWidth, targetHeight } = getTargetDimensions(options);
        const aspectRatio = targetWidth / targetHeight;
        const { widths, densities } = options;
        const targetFormat = options.format ?? DEFAULT_OUTPUT_FORMAT;
        let transformedWidths = (widths ?? []).sort(sortNumeric);
        let imageWidth = options.width;
        let maxWidth = Infinity;
        if (isESMImportedImage(options.src)) {
          imageWidth = options.src.width;
          maxWidth = imageWidth;
          if (transformedWidths.length > 0 && transformedWidths.at(-1) > maxWidth) {
            transformedWidths = transformedWidths.filter((width) => width <= maxWidth);
            transformedWidths.push(maxWidth);
          }
        }
        transformedWidths = Array.from(new Set(transformedWidths));
        const {
          width: transformWidth,
          height: transformHeight,
          ...transformWithoutDimensions
        } = options;
        let allWidths = [];
        if (densities) {
          const densityValues = densities.map((density) => {
            if (typeof density === "number") {
              return density;
            } else {
              return parseFloat(density);
            }
          });
          const densityWidths = densityValues.sort(sortNumeric).map((density) => Math.round(targetWidth * density));
          allWidths = densityWidths.map((width, index) => ({
            width,
            descriptor: `${densityValues[index]}x`
          }));
        } else if (transformedWidths.length > 0) {
          allWidths = transformedWidths.map((width) => ({
            width,
            descriptor: `${width}w`
          }));
        }
        return allWidths.map(({ width, descriptor }) => {
          const height = Math.round(width / aspectRatio);
          const transform = { ...transformWithoutDimensions, width, height };
          return {
            transform,
            descriptor,
            attributes: {
              type: `image/${targetFormat}`
            }
          };
        });
      },
      getURL(options, imageConfig2) {
        const searchParams = new URLSearchParams();
        if (isESMImportedImage(options.src)) {
          searchParams.append("href", options.src.src);
        } else if (isRemoteAllowed(options.src, imageConfig2)) {
          searchParams.append("href", options.src);
        } else {
          return options.src;
        }
        const params = {
          w: "width",
          h: "height",
          q: "quality",
          f: "format",
          fit: "fit",
          position: "position"
        };
        Object.entries(params).forEach(([param, key]) => {
          options[key] && searchParams.append(param, options[key].toString());
        });
        const imageEndpoint = joinPaths("/", imageConfig2.endpoint.route);
        return `${imageEndpoint}?${searchParams}`;
      },
      parseURL(url) {
        const params = url.searchParams;
        if (!params.has("href")) {
          return void 0;
        }
        const transform = {
          src: params.get("href"),
          width: params.has("w") ? parseInt(params.get("w")) : void 0,
          height: params.has("h") ? parseInt(params.get("h")) : void 0,
          format: params.get("f"),
          quality: params.get("q"),
          fit: params.get("fit"),
          position: params.get("position") ?? void 0
        };
        return transform;
      }
    };
    __name(getTargetDimensions, "getTargetDimensions");
    __name(isImageMetadata, "isImageMetadata");
    cssFitValues = ["fill", "contain", "cover", "scale-down"];
    __name(addCSSVarsToStyle, "addCSSVarsToStyle");
    decoder2 = new TextDecoder();
    toUTF8String = /* @__PURE__ */ __name((input, start = 0, end = input.length) => decoder2.decode(input.slice(start, end)), "toUTF8String");
    toHexString = /* @__PURE__ */ __name((input, start = 0, end = input.length) => input.slice(start, end).reduce((memo, i2) => memo + ("0" + i2.toString(16)).slice(-2), ""), "toHexString");
    readInt16LE = /* @__PURE__ */ __name((input, offset = 0) => {
      const val = input[offset] + input[offset + 1] * 2 ** 8;
      return val | (val & 2 ** 15) * 131070;
    }, "readInt16LE");
    readUInt16BE = /* @__PURE__ */ __name((input, offset = 0) => input[offset] * 2 ** 8 + input[offset + 1], "readUInt16BE");
    readUInt16LE = /* @__PURE__ */ __name((input, offset = 0) => input[offset] + input[offset + 1] * 2 ** 8, "readUInt16LE");
    readUInt24LE = /* @__PURE__ */ __name((input, offset = 0) => input[offset] + input[offset + 1] * 2 ** 8 + input[offset + 2] * 2 ** 16, "readUInt24LE");
    readInt32LE = /* @__PURE__ */ __name((input, offset = 0) => input[offset] + input[offset + 1] * 2 ** 8 + input[offset + 2] * 2 ** 16 + (input[offset + 3] << 24), "readInt32LE");
    readUInt32BE = /* @__PURE__ */ __name((input, offset = 0) => input[offset] * 2 ** 24 + input[offset + 1] * 2 ** 16 + input[offset + 2] * 2 ** 8 + input[offset + 3], "readUInt32BE");
    readUInt32LE = /* @__PURE__ */ __name((input, offset = 0) => input[offset] + input[offset + 1] * 2 ** 8 + input[offset + 2] * 2 ** 16 + input[offset + 3] * 2 ** 24, "readUInt32LE");
    methods = {
      readUInt16BE,
      readUInt16LE,
      readUInt32BE,
      readUInt32LE
    };
    __name(readUInt, "readUInt");
    __name(readBox, "readBox");
    __name(findBox, "findBox");
    BMP = {
      validate: /* @__PURE__ */ __name((input) => toUTF8String(input, 0, 2) === "BM", "validate"),
      calculate: /* @__PURE__ */ __name((input) => ({
        height: Math.abs(readInt32LE(input, 22)),
        width: readUInt32LE(input, 18)
      }), "calculate")
    };
    TYPE_ICON = 1;
    SIZE_HEADER$1 = 2 + 2 + 2;
    SIZE_IMAGE_ENTRY = 1 + 1 + 1 + 1 + 2 + 2 + 4 + 4;
    __name(getSizeFromOffset, "getSizeFromOffset");
    __name(getImageSize$1, "getImageSize$1");
    ICO = {
      validate(input) {
        const reserved = readUInt16LE(input, 0);
        const imageCount = readUInt16LE(input, 4);
        if (reserved !== 0 || imageCount === 0) return false;
        const imageType = readUInt16LE(input, 2);
        return imageType === TYPE_ICON;
      },
      calculate(input) {
        const nbImages = readUInt16LE(input, 4);
        const imageSize = getImageSize$1(input, 0);
        if (nbImages === 1) return imageSize;
        const imgs = [imageSize];
        for (let imageIndex = 1; imageIndex < nbImages; imageIndex += 1) {
          imgs.push(getImageSize$1(input, imageIndex));
        }
        return {
          height: imageSize.height,
          images: imgs,
          width: imageSize.width
        };
      }
    };
    TYPE_CURSOR = 2;
    CUR = {
      validate(input) {
        const reserved = readUInt16LE(input, 0);
        const imageCount = readUInt16LE(input, 4);
        if (reserved !== 0 || imageCount === 0) return false;
        const imageType = readUInt16LE(input, 2);
        return imageType === TYPE_CURSOR;
      },
      calculate: /* @__PURE__ */ __name((input) => ICO.calculate(input), "calculate")
    };
    DDS = {
      validate: /* @__PURE__ */ __name((input) => readUInt32LE(input, 0) === 542327876, "validate"),
      calculate: /* @__PURE__ */ __name((input) => ({
        height: readUInt32LE(input, 12),
        width: readUInt32LE(input, 16)
      }), "calculate")
    };
    gifRegexp = /^GIF8[79]a/;
    GIF = {
      validate: /* @__PURE__ */ __name((input) => gifRegexp.test(toUTF8String(input, 0, 6)), "validate"),
      calculate: /* @__PURE__ */ __name((input) => ({
        height: readUInt16LE(input, 8),
        width: readUInt16LE(input, 6)
      }), "calculate")
    };
    brandMap = {
      avif: "avif",
      mif1: "heif",
      msf1: "heif",
      // hief-sequence
      heic: "heic",
      heix: "heic",
      hevc: "heic",
      // heic-sequence
      hevx: "heic"
      // heic-sequence
    };
    __name(detectBrands, "detectBrands");
    HEIF = {
      validate(buffer) {
        const ftype = toUTF8String(buffer, 4, 8);
        const brand = toUTF8String(buffer, 8, 12);
        return "ftyp" === ftype && brand in brandMap;
      },
      calculate(buffer) {
        const metaBox = findBox(buffer, "meta", 0);
        const iprpBox = metaBox && findBox(buffer, "iprp", metaBox.offset + 12);
        const ipcoBox = iprpBox && findBox(buffer, "ipco", iprpBox.offset + 8);
        const ispeBox = ipcoBox && findBox(buffer, "ispe", ipcoBox.offset + 8);
        if (ispeBox) {
          return {
            height: readUInt32BE(buffer, ispeBox.offset + 16),
            width: readUInt32BE(buffer, ispeBox.offset + 12),
            type: detectBrands(buffer, 8, metaBox.offset)
          };
        }
        throw new TypeError("Invalid HEIF, no size found");
      }
    };
    SIZE_HEADER = 4 + 4;
    FILE_LENGTH_OFFSET = 4;
    ENTRY_LENGTH_OFFSET = 4;
    ICON_TYPE_SIZE = {
      ICON: 32,
      "ICN#": 32,
      // m => 16 x 16
      "icm#": 16,
      icm4: 16,
      icm8: 16,
      // s => 16 x 16
      "ics#": 16,
      ics4: 16,
      ics8: 16,
      is32: 16,
      s8mk: 16,
      icp4: 16,
      // l => 32 x 32
      icl4: 32,
      icl8: 32,
      il32: 32,
      l8mk: 32,
      icp5: 32,
      ic11: 32,
      // h => 48 x 48
      ich4: 48,
      ich8: 48,
      ih32: 48,
      h8mk: 48,
      // . => 64 x 64
      icp6: 64,
      ic12: 32,
      // t => 128 x 128
      it32: 128,
      t8mk: 128,
      ic07: 128,
      // . => 256 x 256
      ic08: 256,
      ic13: 256,
      // . => 512 x 512
      ic09: 512,
      ic14: 512,
      // . => 1024 x 1024
      ic10: 1024
    };
    __name(readImageHeader, "readImageHeader");
    __name(getImageSize, "getImageSize");
    ICNS = {
      validate: /* @__PURE__ */ __name((input) => toUTF8String(input, 0, 4) === "icns", "validate"),
      calculate(input) {
        const inputLength = input.length;
        const fileLength = readUInt32BE(input, FILE_LENGTH_OFFSET);
        let imageOffset = SIZE_HEADER;
        let imageHeader = readImageHeader(input, imageOffset);
        let imageSize = getImageSize(imageHeader[0]);
        imageOffset += imageHeader[1];
        if (imageOffset === fileLength) return imageSize;
        const result = {
          height: imageSize.height,
          images: [imageSize],
          width: imageSize.width
        };
        while (imageOffset < fileLength && imageOffset < inputLength) {
          imageHeader = readImageHeader(input, imageOffset);
          imageSize = getImageSize(imageHeader[0]);
          imageOffset += imageHeader[1];
          result.images.push(imageSize);
        }
        return result;
      }
    };
    J2C = {
      // TODO: this doesn't seem right. SIZ marker doesn't have to be right after the SOC
      validate: /* @__PURE__ */ __name((input) => toHexString(input, 0, 4) === "ff4fff51", "validate"),
      calculate: /* @__PURE__ */ __name((input) => ({
        height: readUInt32BE(input, 12),
        width: readUInt32BE(input, 8)
      }), "calculate")
    };
    JP2 = {
      validate(input) {
        if (readUInt32BE(input, 4) !== 1783636e3 || readUInt32BE(input, 0) < 1) return false;
        const ftypBox = findBox(input, "ftyp", 0);
        if (!ftypBox) return false;
        return readUInt32BE(input, ftypBox.offset + 4) === 1718909296;
      },
      calculate(input) {
        const jp2hBox = findBox(input, "jp2h", 0);
        const ihdrBox = jp2hBox && findBox(input, "ihdr", jp2hBox.offset + 8);
        if (ihdrBox) {
          return {
            height: readUInt32BE(input, ihdrBox.offset + 8),
            width: readUInt32BE(input, ihdrBox.offset + 12)
          };
        }
        throw new TypeError("Unsupported JPEG 2000 format");
      }
    };
    EXIF_MARKER = "45786966";
    APP1_DATA_SIZE_BYTES = 2;
    EXIF_HEADER_BYTES = 6;
    TIFF_BYTE_ALIGN_BYTES = 2;
    BIG_ENDIAN_BYTE_ALIGN = "4d4d";
    LITTLE_ENDIAN_BYTE_ALIGN = "4949";
    IDF_ENTRY_BYTES = 12;
    NUM_DIRECTORY_ENTRIES_BYTES = 2;
    __name(isEXIF, "isEXIF");
    __name(extractSize, "extractSize");
    __name(extractOrientation, "extractOrientation");
    __name(validateExifBlock, "validateExifBlock");
    __name(validateInput, "validateInput");
    JPG = {
      validate: /* @__PURE__ */ __name((input) => toHexString(input, 0, 2) === "ffd8", "validate"),
      calculate(input) {
        input = input.slice(4);
        let orientation;
        let next;
        while (input.length) {
          const i2 = readUInt16BE(input, 0);
          if (input[i2] !== 255) {
            input = input.slice(i2);
            continue;
          }
          if (isEXIF(input)) {
            orientation = validateExifBlock(input, i2);
          }
          validateInput(input, i2);
          next = input[i2 + 1];
          if (next === 192 || next === 193 || next === 194) {
            const size = extractSize(input, i2 + 5);
            if (!orientation) {
              return size;
            }
            return {
              height: size.height,
              orientation,
              width: size.width
            };
          }
          input = input.slice(i2 + 2);
        }
        throw new TypeError("Invalid JPG, no size found");
      }
    };
    KTX = {
      validate: /* @__PURE__ */ __name((input) => {
        const signature = toUTF8String(input, 1, 7);
        return ["KTX 11", "KTX 20"].includes(signature);
      }, "validate"),
      calculate: /* @__PURE__ */ __name((input) => {
        const type = input[5] === 49 ? "ktx" : "ktx2";
        const offset = type === "ktx" ? 36 : 20;
        return {
          height: readUInt32LE(input, offset + 4),
          width: readUInt32LE(input, offset),
          type
        };
      }, "calculate")
    };
    pngSignature = "PNG\r\n\n";
    pngImageHeaderChunkName = "IHDR";
    pngFriedChunkName = "CgBI";
    PNG = {
      validate(input) {
        if (pngSignature === toUTF8String(input, 1, 8)) {
          let chunkName = toUTF8String(input, 12, 16);
          if (chunkName === pngFriedChunkName) {
            chunkName = toUTF8String(input, 28, 32);
          }
          if (chunkName !== pngImageHeaderChunkName) {
            throw new TypeError("Invalid PNG");
          }
          return true;
        }
        return false;
      },
      calculate(input) {
        if (toUTF8String(input, 12, 16) === pngFriedChunkName) {
          return {
            height: readUInt32BE(input, 36),
            width: readUInt32BE(input, 32)
          };
        }
        return {
          height: readUInt32BE(input, 20),
          width: readUInt32BE(input, 16)
        };
      }
    };
    PNMTypes = {
      P1: "pbm/ascii",
      P2: "pgm/ascii",
      P3: "ppm/ascii",
      P4: "pbm",
      P5: "pgm",
      P6: "ppm",
      P7: "pam",
      PF: "pfm"
    };
    handlers = {
      default: /* @__PURE__ */ __name((lines) => {
        let dimensions = [];
        while (lines.length > 0) {
          const line = lines.shift();
          if (line[0] === "#") {
            continue;
          }
          dimensions = line.split(" ");
          break;
        }
        if (dimensions.length === 2) {
          return {
            height: parseInt(dimensions[1], 10),
            width: parseInt(dimensions[0], 10)
          };
        } else {
          throw new TypeError("Invalid PNM");
        }
      }, "default"),
      pam: /* @__PURE__ */ __name((lines) => {
        const size = {};
        while (lines.length > 0) {
          const line = lines.shift();
          if (line.length > 16 || line.charCodeAt(0) > 128) {
            continue;
          }
          const [key, value] = line.split(" ");
          if (key && value) {
            size[key.toLowerCase()] = parseInt(value, 10);
          }
          if (size.height && size.width) {
            break;
          }
        }
        if (size.height && size.width) {
          return {
            height: size.height,
            width: size.width
          };
        } else {
          throw new TypeError("Invalid PAM");
        }
      }, "pam")
    };
    PNM = {
      validate: /* @__PURE__ */ __name((input) => toUTF8String(input, 0, 2) in PNMTypes, "validate"),
      calculate(input) {
        const signature = toUTF8String(input, 0, 2);
        const type = PNMTypes[signature];
        const lines = toUTF8String(input, 3).split(/[\r\n]+/);
        const handler = handlers[type] || handlers.default;
        return handler(lines);
      }
    };
    PSD = {
      validate: /* @__PURE__ */ __name((input) => toUTF8String(input, 0, 4) === "8BPS", "validate"),
      calculate: /* @__PURE__ */ __name((input) => ({
        height: readUInt32BE(input, 14),
        width: readUInt32BE(input, 18)
      }), "calculate")
    };
    svgReg = /<svg\s([^>"']|"[^"]*"|'[^']*')*>/;
    extractorRegExps = {
      height: /\sheight=(['"])([^%]+?)\1/,
      root: svgReg,
      viewbox: /\sviewBox=(['"])(.+?)\1/i,
      width: /\swidth=(['"])([^%]+?)\1/
    };
    INCH_CM = 2.54;
    units = {
      in: 96,
      cm: 96 / INCH_CM,
      em: 16,
      ex: 8,
      m: 96 / INCH_CM * 100,
      mm: 96 / INCH_CM / 10,
      pc: 96 / 72 / 12,
      pt: 96 / 72,
      px: 1
    };
    unitsReg = new RegExp(
      `^([0-9.]+(?:e\\d+)?)(${Object.keys(units).join("|")})?$`
    );
    __name(parseLength, "parseLength");
    __name(parseViewbox, "parseViewbox");
    __name(parseAttributes, "parseAttributes");
    __name(calculateByDimensions, "calculateByDimensions");
    __name(calculateByViewbox, "calculateByViewbox");
    SVG = {
      // Scan only the first kilo-byte to speed up the check on larger files
      validate: /* @__PURE__ */ __name((input) => svgReg.test(toUTF8String(input, 0, 1e3)), "validate"),
      calculate(input) {
        const root = extractorRegExps.root.exec(toUTF8String(input));
        if (root) {
          const attrs = parseAttributes(root[0]);
          if (attrs.width && attrs.height) {
            return calculateByDimensions(attrs);
          }
          if (attrs.viewbox) {
            return calculateByViewbox(attrs, attrs.viewbox);
          }
        }
        throw new TypeError("Invalid SVG");
      }
    };
    TGA = {
      validate(input) {
        return readUInt16LE(input, 0) === 0 && readUInt16LE(input, 4) === 0;
      },
      calculate(input) {
        return {
          height: readUInt16LE(input, 14),
          width: readUInt16LE(input, 12)
        };
      }
    };
    __name(readIFD, "readIFD");
    __name(readValue, "readValue");
    __name(nextTag, "nextTag");
    __name(extractTags, "extractTags");
    __name(determineEndianness, "determineEndianness");
    signatures = [
      // '492049', // currently not supported
      "49492a00",
      // Little endian
      "4d4d002a"
      // Big Endian
      // '4d4d002a', // BigTIFF > 4GB. currently not supported
    ];
    TIFF = {
      validate: /* @__PURE__ */ __name((input) => signatures.includes(toHexString(input, 0, 4)), "validate"),
      calculate(input) {
        const isBigEndian = determineEndianness(input) === "BE";
        const ifdBuffer = readIFD(input, isBigEndian);
        const tags = extractTags(ifdBuffer, isBigEndian);
        const width = tags[256];
        const height = tags[257];
        if (!width || !height) {
          throw new TypeError("Invalid Tiff. Missing tags");
        }
        return { height, width };
      }
    };
    __name(calculateExtended, "calculateExtended");
    __name(calculateLossless, "calculateLossless");
    __name(calculateLossy, "calculateLossy");
    WEBP = {
      validate(input) {
        const riffHeader = "RIFF" === toUTF8String(input, 0, 4);
        const webpHeader = "WEBP" === toUTF8String(input, 8, 12);
        const vp8Header = "VP8" === toUTF8String(input, 12, 15);
        return riffHeader && webpHeader && vp8Header;
      },
      calculate(input) {
        const chunkHeader = toUTF8String(input, 12, 16);
        input = input.slice(20, 30);
        if (chunkHeader === "VP8X") {
          const extendedHeader = input[0];
          const validStart = (extendedHeader & 192) === 0;
          const validEnd = (extendedHeader & 1) === 0;
          if (validStart && validEnd) {
            return calculateExtended(input);
          } else {
            throw new TypeError("Invalid WebP");
          }
        }
        if (chunkHeader === "VP8 " && input[0] !== 47) {
          return calculateLossy(input);
        }
        const signature = toHexString(input, 3, 6);
        if (chunkHeader === "VP8L" && signature !== "9d012a") {
          return calculateLossless(input);
        }
        throw new TypeError("Invalid WebP");
      }
    };
    typeHandlers = /* @__PURE__ */ new Map([
      ["bmp", BMP],
      ["cur", CUR],
      ["dds", DDS],
      ["gif", GIF],
      ["heif", HEIF],
      ["icns", ICNS],
      ["ico", ICO],
      ["j2c", J2C],
      ["jp2", JP2],
      ["jpg", JPG],
      ["ktx", KTX],
      ["png", PNG],
      ["pnm", PNM],
      ["psd", PSD],
      ["svg", SVG],
      ["tga", TGA],
      ["tiff", TIFF],
      ["webp", WEBP]
    ]);
    types = Array.from(typeHandlers.keys());
    firstBytes = /* @__PURE__ */ new Map([
      [56, "psd"],
      [66, "bmp"],
      [68, "dds"],
      [71, "gif"],
      [73, "tiff"],
      [77, "tiff"],
      [82, "webp"],
      [105, "icns"],
      [137, "png"],
      [255, "jpg"]
    ]);
    __name(detector, "detector");
    globalOptions = {
      disabledTypes: []
    };
    __name(lookup$1, "lookup$1");
    __name(imageMetadata, "imageMetadata");
    __name(inferRemoteSize, "inferRemoteSize");
    __name(getConfiguredImageService, "getConfiguredImageService");
    __name(getImage$1, "getImage$1");
    $$Astro$2 = createAstro();
    $$Image = createComponent(async ($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
      Astro2.self = $$Image;
      const props = Astro2.props;
      if (props.alt === void 0 || props.alt === null) {
        throw new AstroError(ImageMissingAlt);
      }
      if (typeof props.width === "string") {
        props.width = parseInt(props.width);
      }
      if (typeof props.height === "string") {
        props.height = parseInt(props.height);
      }
      const layout = props.layout ?? imageConfig.experimentalLayout ?? "none";
      const useResponsive = imageConfig.experimentalResponsiveImages && layout !== "none";
      if (useResponsive) {
        props.layout ??= imageConfig.experimentalLayout;
        props.fit ??= imageConfig.experimentalObjectFit ?? "cover";
        props.position ??= imageConfig.experimentalObjectPosition ?? "center";
      }
      const image = await getImage(props);
      const additionalAttributes = {};
      if (image.srcSet.values.length > 0) {
        additionalAttributes.srcset = image.srcSet.attribute;
      }
      const { class: className, ...attributes } = { ...additionalAttributes, ...image.attributes };
      return renderTemplate`${maybeRenderHead()}<img${addAttribute(image.src, "src")}${spreadAttributes(attributes)}${addAttribute(className, "class")}>`;
    }, "/Users/vivek/Desktop/self/myPortfolio/node_modules/.pnpm/astro@5.7.4_@netlify+blobs@8.2.0_@types+node@22.15.3_jiti@1.21.7_rollup@4.40.1_typescript@5.8.3_yaml@2.7.1/node_modules/astro/components/Image.astro", void 0);
    mimes = {
      "3g2": "video/3gpp2",
      "3gp": "video/3gpp",
      "3gpp": "video/3gpp",
      "3mf": "model/3mf",
      "aac": "audio/aac",
      "ac": "application/pkix-attr-cert",
      "adp": "audio/adpcm",
      "adts": "audio/aac",
      "ai": "application/postscript",
      "aml": "application/automationml-aml+xml",
      "amlx": "application/automationml-amlx+zip",
      "amr": "audio/amr",
      "apng": "image/apng",
      "appcache": "text/cache-manifest",
      "appinstaller": "application/appinstaller",
      "appx": "application/appx",
      "appxbundle": "application/appxbundle",
      "asc": "application/pgp-keys",
      "atom": "application/atom+xml",
      "atomcat": "application/atomcat+xml",
      "atomdeleted": "application/atomdeleted+xml",
      "atomsvc": "application/atomsvc+xml",
      "au": "audio/basic",
      "avci": "image/avci",
      "avcs": "image/avcs",
      "avif": "image/avif",
      "aw": "application/applixware",
      "bdoc": "application/bdoc",
      "bin": "application/octet-stream",
      "bmp": "image/bmp",
      "bpk": "application/octet-stream",
      "btf": "image/prs.btif",
      "btif": "image/prs.btif",
      "buffer": "application/octet-stream",
      "ccxml": "application/ccxml+xml",
      "cdfx": "application/cdfx+xml",
      "cdmia": "application/cdmi-capability",
      "cdmic": "application/cdmi-container",
      "cdmid": "application/cdmi-domain",
      "cdmio": "application/cdmi-object",
      "cdmiq": "application/cdmi-queue",
      "cer": "application/pkix-cert",
      "cgm": "image/cgm",
      "cjs": "application/node",
      "class": "application/java-vm",
      "coffee": "text/coffeescript",
      "conf": "text/plain",
      "cpl": "application/cpl+xml",
      "cpt": "application/mac-compactpro",
      "crl": "application/pkix-crl",
      "css": "text/css",
      "csv": "text/csv",
      "cu": "application/cu-seeme",
      "cwl": "application/cwl",
      "cww": "application/prs.cww",
      "davmount": "application/davmount+xml",
      "dbk": "application/docbook+xml",
      "deb": "application/octet-stream",
      "def": "text/plain",
      "deploy": "application/octet-stream",
      "dib": "image/bmp",
      "disposition-notification": "message/disposition-notification",
      "dist": "application/octet-stream",
      "distz": "application/octet-stream",
      "dll": "application/octet-stream",
      "dmg": "application/octet-stream",
      "dms": "application/octet-stream",
      "doc": "application/msword",
      "dot": "application/msword",
      "dpx": "image/dpx",
      "drle": "image/dicom-rle",
      "dsc": "text/prs.lines.tag",
      "dssc": "application/dssc+der",
      "dtd": "application/xml-dtd",
      "dump": "application/octet-stream",
      "dwd": "application/atsc-dwd+xml",
      "ear": "application/java-archive",
      "ecma": "application/ecmascript",
      "elc": "application/octet-stream",
      "emf": "image/emf",
      "eml": "message/rfc822",
      "emma": "application/emma+xml",
      "emotionml": "application/emotionml+xml",
      "eps": "application/postscript",
      "epub": "application/epub+zip",
      "exe": "application/octet-stream",
      "exi": "application/exi",
      "exp": "application/express",
      "exr": "image/aces",
      "ez": "application/andrew-inset",
      "fdf": "application/fdf",
      "fdt": "application/fdt+xml",
      "fits": "image/fits",
      "g3": "image/g3fax",
      "gbr": "application/rpki-ghostbusters",
      "geojson": "application/geo+json",
      "gif": "image/gif",
      "glb": "model/gltf-binary",
      "gltf": "model/gltf+json",
      "gml": "application/gml+xml",
      "gpx": "application/gpx+xml",
      "gram": "application/srgs",
      "grxml": "application/srgs+xml",
      "gxf": "application/gxf",
      "gz": "application/gzip",
      "h261": "video/h261",
      "h263": "video/h263",
      "h264": "video/h264",
      "heic": "image/heic",
      "heics": "image/heic-sequence",
      "heif": "image/heif",
      "heifs": "image/heif-sequence",
      "hej2": "image/hej2k",
      "held": "application/atsc-held+xml",
      "hjson": "application/hjson",
      "hlp": "application/winhlp",
      "hqx": "application/mac-binhex40",
      "hsj2": "image/hsj2",
      "htm": "text/html",
      "html": "text/html",
      "ics": "text/calendar",
      "ief": "image/ief",
      "ifb": "text/calendar",
      "iges": "model/iges",
      "igs": "model/iges",
      "img": "application/octet-stream",
      "in": "text/plain",
      "ini": "text/plain",
      "ink": "application/inkml+xml",
      "inkml": "application/inkml+xml",
      "ipfix": "application/ipfix",
      "iso": "application/octet-stream",
      "its": "application/its+xml",
      "jade": "text/jade",
      "jar": "application/java-archive",
      "jhc": "image/jphc",
      "jls": "image/jls",
      "jp2": "image/jp2",
      "jpe": "image/jpeg",
      "jpeg": "image/jpeg",
      "jpf": "image/jpx",
      "jpg": "image/jpeg",
      "jpg2": "image/jp2",
      "jpgm": "image/jpm",
      "jpgv": "video/jpeg",
      "jph": "image/jph",
      "jpm": "image/jpm",
      "jpx": "image/jpx",
      "js": "text/javascript",
      "json": "application/json",
      "json5": "application/json5",
      "jsonld": "application/ld+json",
      "jsonml": "application/jsonml+json",
      "jsx": "text/jsx",
      "jt": "model/jt",
      "jxl": "image/jxl",
      "jxr": "image/jxr",
      "jxra": "image/jxra",
      "jxrs": "image/jxrs",
      "jxs": "image/jxs",
      "jxsc": "image/jxsc",
      "jxsi": "image/jxsi",
      "jxss": "image/jxss",
      "kar": "audio/midi",
      "ktx": "image/ktx",
      "ktx2": "image/ktx2",
      "less": "text/less",
      "lgr": "application/lgr+xml",
      "list": "text/plain",
      "litcoffee": "text/coffeescript",
      "log": "text/plain",
      "lostxml": "application/lost+xml",
      "lrf": "application/octet-stream",
      "m1v": "video/mpeg",
      "m21": "application/mp21",
      "m2a": "audio/mpeg",
      "m2t": "video/mp2t",
      "m2ts": "video/mp2t",
      "m2v": "video/mpeg",
      "m3a": "audio/mpeg",
      "m4a": "audio/mp4",
      "m4p": "application/mp4",
      "m4s": "video/iso.segment",
      "ma": "application/mathematica",
      "mads": "application/mads+xml",
      "maei": "application/mmt-aei+xml",
      "man": "text/troff",
      "manifest": "text/cache-manifest",
      "map": "application/json",
      "mar": "application/octet-stream",
      "markdown": "text/markdown",
      "mathml": "application/mathml+xml",
      "mb": "application/mathematica",
      "mbox": "application/mbox",
      "md": "text/markdown",
      "mdx": "text/mdx",
      "me": "text/troff",
      "mesh": "model/mesh",
      "meta4": "application/metalink4+xml",
      "metalink": "application/metalink+xml",
      "mets": "application/mets+xml",
      "mft": "application/rpki-manifest",
      "mid": "audio/midi",
      "midi": "audio/midi",
      "mime": "message/rfc822",
      "mj2": "video/mj2",
      "mjp2": "video/mj2",
      "mjs": "text/javascript",
      "mml": "text/mathml",
      "mods": "application/mods+xml",
      "mov": "video/quicktime",
      "mp2": "audio/mpeg",
      "mp21": "application/mp21",
      "mp2a": "audio/mpeg",
      "mp3": "audio/mpeg",
      "mp4": "video/mp4",
      "mp4a": "audio/mp4",
      "mp4s": "application/mp4",
      "mp4v": "video/mp4",
      "mpd": "application/dash+xml",
      "mpe": "video/mpeg",
      "mpeg": "video/mpeg",
      "mpf": "application/media-policy-dataset+xml",
      "mpg": "video/mpeg",
      "mpg4": "video/mp4",
      "mpga": "audio/mpeg",
      "mpp": "application/dash-patch+xml",
      "mrc": "application/marc",
      "mrcx": "application/marcxml+xml",
      "ms": "text/troff",
      "mscml": "application/mediaservercontrol+xml",
      "msh": "model/mesh",
      "msi": "application/octet-stream",
      "msix": "application/msix",
      "msixbundle": "application/msixbundle",
      "msm": "application/octet-stream",
      "msp": "application/octet-stream",
      "mtl": "model/mtl",
      "mts": "video/mp2t",
      "musd": "application/mmt-usd+xml",
      "mxf": "application/mxf",
      "mxmf": "audio/mobile-xmf",
      "mxml": "application/xv+xml",
      "n3": "text/n3",
      "nb": "application/mathematica",
      "nq": "application/n-quads",
      "nt": "application/n-triples",
      "obj": "model/obj",
      "oda": "application/oda",
      "oga": "audio/ogg",
      "ogg": "audio/ogg",
      "ogv": "video/ogg",
      "ogx": "application/ogg",
      "omdoc": "application/omdoc+xml",
      "onepkg": "application/onenote",
      "onetmp": "application/onenote",
      "onetoc": "application/onenote",
      "onetoc2": "application/onenote",
      "opf": "application/oebps-package+xml",
      "opus": "audio/ogg",
      "otf": "font/otf",
      "owl": "application/rdf+xml",
      "oxps": "application/oxps",
      "p10": "application/pkcs10",
      "p7c": "application/pkcs7-mime",
      "p7m": "application/pkcs7-mime",
      "p7s": "application/pkcs7-signature",
      "p8": "application/pkcs8",
      "pdf": "application/pdf",
      "pfr": "application/font-tdpfr",
      "pgp": "application/pgp-encrypted",
      "pkg": "application/octet-stream",
      "pki": "application/pkixcmp",
      "pkipath": "application/pkix-pkipath",
      "pls": "application/pls+xml",
      "png": "image/png",
      "prc": "model/prc",
      "prf": "application/pics-rules",
      "provx": "application/provenance+xml",
      "ps": "application/postscript",
      "pskcxml": "application/pskc+xml",
      "pti": "image/prs.pti",
      "qt": "video/quicktime",
      "raml": "application/raml+yaml",
      "rapd": "application/route-apd+xml",
      "rdf": "application/rdf+xml",
      "relo": "application/p2p-overlay+xml",
      "rif": "application/reginfo+xml",
      "rl": "application/resource-lists+xml",
      "rld": "application/resource-lists-diff+xml",
      "rmi": "audio/midi",
      "rnc": "application/relax-ng-compact-syntax",
      "rng": "application/xml",
      "roa": "application/rpki-roa",
      "roff": "text/troff",
      "rq": "application/sparql-query",
      "rs": "application/rls-services+xml",
      "rsat": "application/atsc-rsat+xml",
      "rsd": "application/rsd+xml",
      "rsheet": "application/urc-ressheet+xml",
      "rss": "application/rss+xml",
      "rtf": "text/rtf",
      "rtx": "text/richtext",
      "rusd": "application/route-usd+xml",
      "s3m": "audio/s3m",
      "sbml": "application/sbml+xml",
      "scq": "application/scvp-cv-request",
      "scs": "application/scvp-cv-response",
      "sdp": "application/sdp",
      "senmlx": "application/senml+xml",
      "sensmlx": "application/sensml+xml",
      "ser": "application/java-serialized-object",
      "setpay": "application/set-payment-initiation",
      "setreg": "application/set-registration-initiation",
      "sgi": "image/sgi",
      "sgm": "text/sgml",
      "sgml": "text/sgml",
      "shex": "text/shex",
      "shf": "application/shf+xml",
      "shtml": "text/html",
      "sieve": "application/sieve",
      "sig": "application/pgp-signature",
      "sil": "audio/silk",
      "silo": "model/mesh",
      "siv": "application/sieve",
      "slim": "text/slim",
      "slm": "text/slim",
      "sls": "application/route-s-tsid+xml",
      "smi": "application/smil+xml",
      "smil": "application/smil+xml",
      "snd": "audio/basic",
      "so": "application/octet-stream",
      "spdx": "text/spdx",
      "spp": "application/scvp-vp-response",
      "spq": "application/scvp-vp-request",
      "spx": "audio/ogg",
      "sql": "application/sql",
      "sru": "application/sru+xml",
      "srx": "application/sparql-results+xml",
      "ssdl": "application/ssdl+xml",
      "ssml": "application/ssml+xml",
      "stk": "application/hyperstudio",
      "stl": "model/stl",
      "stpx": "model/step+xml",
      "stpxz": "model/step-xml+zip",
      "stpz": "model/step+zip",
      "styl": "text/stylus",
      "stylus": "text/stylus",
      "svg": "image/svg+xml",
      "svgz": "image/svg+xml",
      "swidtag": "application/swid+xml",
      "t": "text/troff",
      "t38": "image/t38",
      "td": "application/urc-targetdesc+xml",
      "tei": "application/tei+xml",
      "teicorpus": "application/tei+xml",
      "text": "text/plain",
      "tfi": "application/thraud+xml",
      "tfx": "image/tiff-fx",
      "tif": "image/tiff",
      "tiff": "image/tiff",
      "toml": "application/toml",
      "tr": "text/troff",
      "trig": "application/trig",
      "ts": "video/mp2t",
      "tsd": "application/timestamped-data",
      "tsv": "text/tab-separated-values",
      "ttc": "font/collection",
      "ttf": "font/ttf",
      "ttl": "text/turtle",
      "ttml": "application/ttml+xml",
      "txt": "text/plain",
      "u3d": "model/u3d",
      "u8dsn": "message/global-delivery-status",
      "u8hdr": "message/global-headers",
      "u8mdn": "message/global-disposition-notification",
      "u8msg": "message/global",
      "ubj": "application/ubjson",
      "uri": "text/uri-list",
      "uris": "text/uri-list",
      "urls": "text/uri-list",
      "vcard": "text/vcard",
      "vrml": "model/vrml",
      "vtt": "text/vtt",
      "vxml": "application/voicexml+xml",
      "war": "application/java-archive",
      "wasm": "application/wasm",
      "wav": "audio/wav",
      "weba": "audio/webm",
      "webm": "video/webm",
      "webmanifest": "application/manifest+json",
      "webp": "image/webp",
      "wgsl": "text/wgsl",
      "wgt": "application/widget",
      "wif": "application/watcherinfo+xml",
      "wmf": "image/wmf",
      "woff": "font/woff",
      "woff2": "font/woff2",
      "wrl": "model/vrml",
      "wsdl": "application/wsdl+xml",
      "wspolicy": "application/wspolicy+xml",
      "x3d": "model/x3d+xml",
      "x3db": "model/x3d+fastinfoset",
      "x3dbz": "model/x3d+binary",
      "x3dv": "model/x3d-vrml",
      "x3dvz": "model/x3d+vrml",
      "x3dz": "model/x3d+xml",
      "xaml": "application/xaml+xml",
      "xav": "application/xcap-att+xml",
      "xca": "application/xcap-caps+xml",
      "xcs": "application/calendar+xml",
      "xdf": "application/xcap-diff+xml",
      "xdssc": "application/dssc+xml",
      "xel": "application/xcap-el+xml",
      "xenc": "application/xenc+xml",
      "xer": "application/patch-ops-error+xml",
      "xfdf": "application/xfdf",
      "xht": "application/xhtml+xml",
      "xhtml": "application/xhtml+xml",
      "xhvml": "application/xv+xml",
      "xlf": "application/xliff+xml",
      "xm": "audio/xm",
      "xml": "text/xml",
      "xns": "application/xcap-ns+xml",
      "xop": "application/xop+xml",
      "xpl": "application/xproc+xml",
      "xsd": "application/xml",
      "xsf": "application/prs.xsf+xml",
      "xsl": "application/xml",
      "xslt": "application/xml",
      "xspf": "application/xspf+xml",
      "xvm": "application/xv+xml",
      "xvml": "application/xv+xml",
      "yaml": "text/yaml",
      "yang": "application/yang",
      "yin": "application/yin+xml",
      "yml": "text/yaml",
      "zip": "application/zip"
    };
    __name(lookup, "lookup");
    $$Astro$12 = createAstro();
    $$Picture = createComponent(async ($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$Astro$12, $$props, $$slots);
      Astro2.self = $$Picture;
      const defaultFormats = ["webp"];
      const defaultFallbackFormat = "png";
      const specialFormatsFallback = ["gif", "svg", "jpg", "jpeg"];
      const { formats = defaultFormats, pictureAttributes = {}, fallbackFormat, ...props } = Astro2.props;
      if (props.alt === void 0 || props.alt === null) {
        throw new AstroError(ImageMissingAlt);
      }
      const scopedStyleClass = props.class?.match(/\bastro-\w{8}\b/)?.[0];
      if (scopedStyleClass) {
        if (pictureAttributes.class) {
          pictureAttributes.class = `${pictureAttributes.class} ${scopedStyleClass}`;
        } else {
          pictureAttributes.class = scopedStyleClass;
        }
      }
      const layout = props.layout ?? imageConfig.experimentalLayout ?? "none";
      const useResponsive = imageConfig.experimentalResponsiveImages && layout !== "none";
      if (useResponsive) {
        props.layout ??= imageConfig.experimentalLayout;
        props.fit ??= imageConfig.experimentalObjectFit ?? "cover";
        props.position ??= imageConfig.experimentalObjectPosition ?? "center";
      }
      for (const key in props) {
        if (key.startsWith("data-astro-cid")) {
          pictureAttributes[key] = props[key];
        }
      }
      const originalSrc = await resolveSrc(props.src);
      const optimizedImages = await Promise.all(
        formats.map(
          async (format) => await getImage({
            ...props,
            src: originalSrc,
            format,
            widths: props.widths,
            densities: props.densities
          })
        )
      );
      let resultFallbackFormat = fallbackFormat ?? defaultFallbackFormat;
      if (!fallbackFormat && isESMImportedImage(originalSrc) && specialFormatsFallback.includes(originalSrc.format)) {
        resultFallbackFormat = originalSrc.format;
      }
      const fallbackImage = await getImage({
        ...props,
        format: resultFallbackFormat,
        widths: props.widths,
        densities: props.densities
      });
      const imgAdditionalAttributes = {};
      const sourceAdditionalAttributes = {};
      if (props.sizes) {
        sourceAdditionalAttributes.sizes = props.sizes;
      }
      if (fallbackImage.srcSet.values.length > 0) {
        imgAdditionalAttributes.srcset = fallbackImage.srcSet.attribute;
      }
      const { class: className, ...attributes } = {
        ...imgAdditionalAttributes,
        ...fallbackImage.attributes
      };
      return renderTemplate`${maybeRenderHead()}<picture${spreadAttributes(pictureAttributes)}> ${Object.entries(optimizedImages).map(([_, image]) => {
        const srcsetAttribute = props.densities || !props.densities && !props.widths && !useResponsive ? `${image.src}${image.srcSet.values.length > 0 ? ", " + image.srcSet.attribute : ""}` : image.srcSet.attribute;
        return renderTemplate`<source${addAttribute(srcsetAttribute, "srcset")}${addAttribute(lookup(image.options.format ?? image.src) ?? `image/${image.options.format}`, "type")}${spreadAttributes(sourceAdditionalAttributes)}>`;
      })}  <img${addAttribute(fallbackImage.src, "src")}${spreadAttributes(attributes)}${addAttribute(className, "class")}> </picture>`;
    }, "/Users/vivek/Desktop/self/myPortfolio/node_modules/.pnpm/astro@5.7.4_@netlify+blobs@8.2.0_@types+node@22.15.3_jiti@1.21.7_rollup@4.40.1_typescript@5.8.3_yaml@2.7.1/node_modules/astro/components/Picture.astro", void 0);
    $$Astro2 = createAstro();
    $$Font = createComponent(async ($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$Astro2, $$props, $$slots);
      Astro2.self = $$Font;
      const { fontsData } = await import("virtual:astro:assets/fonts/internal").catch(() => {
        throw new AstroError(ExperimentalFontsNotEnabled);
      });
      const { cssVariable, preload = false } = Astro2.props;
      const data = fontsData.get(cssVariable);
      if (!data) {
        throw new AstroError({
          ...FontFamilyNotFound,
          message: FontFamilyNotFound.message(cssVariable)
        });
      }
      return renderTemplate`${preload && data.preloadData.map(({ url, type }) => renderTemplate`<link rel="preload"${addAttribute(url, "href")} as="font"${addAttribute(`font/${type}`, "type")} crossorigin>`)}<style>${unescapeHTML(data.css)}</style>`;
    }, "/Users/vivek/Desktop/self/myPortfolio/node_modules/.pnpm/astro@5.7.4_@netlify+blobs@8.2.0_@types+node@22.15.3_jiti@1.21.7_rollup@4.40.1_typescript@5.8.3_yaml@2.7.1/node_modules/astro/components/Font.astro", void 0);
    imageConfig = { "endpoint": { "route": "/_image", "entrypoint": "@astrojs/cloudflare/image-endpoint" }, "service": { "entrypoint": "astro/assets/services/sharp", "config": {} }, "domains": [], "remotePatterns": [], "experimentalResponsiveImages": false };
    getImage = /* @__PURE__ */ __name(async (options) => await getImage$1(options, imageConfig), "getImage");
    _astro_assets = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      Image: $$Image,
      getConfiguredImageService,
      getImage,
      imageConfig,
      inferRemoteSize,
      isLocalService
    }, Symbol.toStringTag, { value: "Module" }));
  }
});

// .wrangler/tmp/pages-ErOWne/chunks/_astro_data-layer-content_zvctE0gs.mjs
var astro_data_layer_content_zvctE0gs_exports = {};
__export(astro_data_layer_content_zvctE0gs_exports, {
  default: () => _astro_dataLayerContent
});
var _astro_dataLayerContent;
var init_astro_data_layer_content_zvctE0gs = __esm({
  ".wrangler/tmp/pages-ErOWne/chunks/_astro_data-layer-content_zvctE0gs.mjs"() {
    "use strict";
    init_modules_watch_stub();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    _astro_dataLayerContent = [["Map", 1, 2, 9, 10], "meta::meta", ["Map", 3, 4, 5, 6, 7, 8], "astro-version", "5.7.4", "content-config-digest", "af9e361b9c7ead47", "astro-config-digest", '{"root":{},"srcDir":{},"publicDir":{},"outDir":{},"cacheDir":{},"compressHTML":true,"base":"/","trailingSlash":"ignore","output":"server","scopedStyleStrategy":"attribute","build":{"format":"directory","client":{},"server":{},"assets":"_astro","serverEntry":"index.js","redirects":false,"inlineStylesheets":"auto","concurrency":1},"server":{"open":false,"host":false,"port":4321,"streaming":true,"allowedHosts":[]},"redirects":{},"image":{"endpoint":{"route":"/_image","entrypoint":"@astrojs/cloudflare/image-endpoint"},"service":{"entrypoint":"astro/assets/services/sharp","config":{}},"domains":[],"remotePatterns":[]},"devToolbar":{"enabled":true},"markdown":{"syntaxHighlight":{"type":"shiki","excludeLangs":["math"]},"shikiConfig":{"langs":[],"langAlias":{},"theme":"github-dark","themes":{},"wrap":false,"transformers":[]},"remarkPlugins":[],"rehypePlugins":[],"remarkRehype":{},"gfm":true,"smartypants":true},"security":{"checkOrigin":true},"env":{"schema":{},"validateSecrets":false},"experimental":{"clientPrerender":false,"contentIntellisense":false,"responsiveImages":false,"headingIdCompat":false,"preserveScriptOrder":false},"legacy":{"collections":false},"session":{"driver":"cloudflare-kv-binding","options":{"binding":"SESSION"}}}', "blogs", ["Map", 11, 12, 55, 56, 97, 98, 141, 142, 203, 204], "classes-in-js", { id: 11, data: 13, body: 19, filePath: 20, assetImports: 21, digest: 27, rendered: 28, legacyId: 54 }, { title: 14, subheading: 15, cover: 16, publishedAt: 17, readingTimeInMins: 18 }, "Debunking Classes in JavaScript.", "In this blog we discuss how instance of a class and a function in JavaScript are very similar", "__ASTRO_IMAGE_../../icons/cover-4.svg", ["Date", "2021-05-22T00:00:00.000Z"], 4, '**TL;DR** ECMAScript6 introduced _classes_ as a syntactical sugar for creating prototype constructors. It is said to improve code readability. This blog focuses on how everything worked before classes .\n\n> JavaScript is a high-level, dynamic, and loosely-typed programming language. It is highly object-oriented to the core with its prototype-based model, inspired by Self programming language.\n\n## Points to remember\n\n- **ECMAScript6** had introduced class keyword as syntactic sugar on top of the (existing) prototype-based programming model, and there hasn\'t happened any change to this model.\n\n![blog-2.jpeg](../../../src/assets/blogs/classes-in-js/img-1.jpeg)\n\n### Class Terminology\n\n- class : A type of a blueprint used for making objects.\n- object : Acts as an instance of a class. Multiple instances of a class can be created.\n- method : The functions which lie inside of classes are called as methods of a class.\n- constructor : A special function which is called implicitly once we create an object of a class.\n\n### ES6 class component and its pre ES6 equivalent\n\n```javascript\nclass Dev {\n  constructor(x, y) {\n    this.x = x;\n    this.y = y;\n  }\n\n  code() {\n    console.log("this:", this);\n    return this.x + this.y;\n  }\n}\nvar vivek = new Dev(1, 2); /*create instance of class Dev*/\nvar sum = vivek.code(); /*call method sum on the object vivek*/\nconsole.log(sum); /*prints 3*/\nconsole.log(vivek instanceof Dev); /*returns true*/\n```\n\n\\*Let me also show the **console** \\*\n\n![1st-pic.png](../../../src/assets/blogs/classes-in-js/img-2.png)\n\nLet me explain the code here in stepwise manner..\n\n1. first I declared a class.\n2. then I instantiate the class with object name vivek passing the constructor 2 integers.\n3. on opening the console, we can see all the outputs\n\nBut, let\'s examine the object `vivek` in more detail. When we expand it in the console, we might see something like this:\n\n```javascript\nvivek: {\n  x: 1,\n  y: 2,\n  [[Prototype]]: Object\n}\n```\n\nNotice that the object has three properties:\n\n- The values `x` and `y` we passed to the constructor\n- A special `[[Prototype]]` property (displayed as `__proto__` in some browsers)\n\nWhen we expand the `[[Prototype]]` property, we find:\n\n```javascript\n[[Prototype]]: {\n  code: \u0192(),\n  constructor: class Dev,\n  [[Prototype]]: Object\n}\n```\n\nThis reveals something interesting: the `code()` method we defined in our class isn\'t stored directly on the object itself, but rather on its prototype! This is a key insight into how JavaScript classes actually work under the hood.\n\n---\n\n```javascript\nfunction Dev(x, y) {\n  this.x = x;\n  this.y = y;\n}\n\nDev.prototype.code = function () {\n  /*code is a function which is added to prototype of Dev function*/\n  console.log("this:", this);\n  return this.x + this.y;\n};\n\nvar vivek = new Dev(1, 2); /*instantiate a new object*/\nvar sum = vivek.code(); /*call the method on the instance*/\nconsole.log(sum); /*prints the return value*/\nconsole.log(vivek); /*prints the vivek object*/\n```\n\n\\*lets look at the \\*\\*console \\*_as well_\n\n![2nd-pic.png](../../../src/assets/blogs/classes-in-js/img-3.png)\n\nLet\'s click on the **drop down** and now see the **MAGIC!!**\n\n![5th-pic.png](../../../src/assets/blogs/classes-in-js/img-5.png)\n\nFirst let\'s just go over the **code**..\n\n1. declare a function. Here it can also be called a constructor function because it instantiates an object.\n2. next create a function called \\*\\*code \\*\\* and assign it to **Dev.prototype**\n3. now, instantiate the object called **vivek** and call the method inside it.\n\n<img src="../../../src/assets/blogs/classes-in-js/img-4.gif" alt="img-6.gif" class="mx-auto" />\n\nThe console output for this function constructor approach is remarkably similar to the class example. Let\'s break down the `vivek` object created using the function constructor:\n\nWhen we inspect the `vivek` object, we see its own properties (`x` and `y`) and its internal `[[Prototype]]` link:\n\n## Inspecting the Function Constructor Object\n\nThe object structure here mirrors what we saw with the **class-based** object:\n\nWhen examining the object in your browser\'s console, you\'ll notice:\n\n1. **Instance properties** - Direct properties like `x`, `y` appear at the top level\n2. **Prototype chain** - Expanding the [[Prototype]] dropdown reveals:\n   - The `code()` method we added via `Developer.prototype.code`\n   - The constructor reference pointing back to our `Developer` function\n\nThis structure confirms that function constructors and ES6 classes create identical prototype chains behind the scenes.\n\n> Doesn\'t it totally resemble the class? The answer is quite clear and a huge **YES!!**\n\nThe function constructor pattern in pre-ES6 JavaScript is equivalent to class declarations in ES6. We can see that:\n\n- Instance variables are declared on `this` in the Function object\n- Methods are defined on the Function.prototype object\n- A reference is created automatically between Function and Function.prototype objects through the prototype chain during instantiation with the `new` keyword\n\n> Doesn\'t it totally resemble the class ? The answer is quite clear and a huge **YESS!!**\n\nThe code snippet above shows declaration of Function Constructor in pre-ES6 (equivalent to class declaration in ES6). We can see that instance variables are declared on this in Function object, and the methods are defined on Function.prototype object. There will be a reference created automatically between Function and Function.prototype objects through \\_ _proto_ \\_\\_\\_\\_\\_\\_\\_\\_ property on Function object during instantiation using new keyword. The methods on Function.prototype will be called on the instance object.\n\n### Prototypical chain\n\nhere\'s how the prototypical chain for syntax\'s would look like\n\n<img src="../../../src/assets/blogs/classes-in-js/img-6.png" alt="img-6.gif" class="mx-auto" />\n\nEssentially, we get the same prototype chain on class and Function Constructor declarations.\n\n<img src="../../../src/assets/blogs/classes-in-js/img-7.gif" alt="gif-7.gif" class="mx-auto" />\n\n**_Result_**\n\n1. properties defined on constructor in ES6 can be mapped to properties defined on Function object in ES5.\n2. methods defined on classes in ES6 can be mapped to properties (methods) declared on Function.prototype object in ES5.\n3. class in ES6 can be thought of as an instruction to JavaScript compiler to automatically populate the prototype object\n\n<img src="../../../src/assets/blogs/classes-in-js/img-8.webp" alt="gif-7.gif" class="mx-auto" />\n\nWith this written we officially come to the end of the b**log.** Hope you enjoyed reading it as much as i enjoyed writing it.I hope i have made these concepts clear to you . If you have any doubt\'s or want to criticise any point you can comment below.', "src/content/blogs/my-fourth-blog.md", [22, 23, 24, 25, 26], "../../../src/assets/blogs/classes-in-js/img-1.jpeg", "../../../src/assets/blogs/classes-in-js/img-2.png", "../../../src/assets/blogs/classes-in-js/img-3.png", "../../../src/assets/blogs/classes-in-js/img-5.png", "../../icons/cover-4.svg", "3a0fcc7ef8dc1a0c", { html: 29, metadata: 30 }, '<p><strong>TL;DR</strong> ECMAScript6 introduced <em>classes</em> as a syntactical sugar for creating prototype constructors. It is said to improve code readability. This blog focuses on how everything worked before classes .</p>\n<blockquote>\n<p>JavaScript is a high-level, dynamic, and loosely-typed programming language. It is highly object-oriented to the core with its prototype-based model, inspired by Self programming language.</p>\n</blockquote>\n<h2 id="points-to-remember">Points to remember</h2>\n<ul>\n<li><strong>ECMAScript6</strong> had introduced class keyword as syntactic sugar on top of the (existing) prototype-based programming model, and there hasn\u2019t happened any change to this model.</li>\n</ul>\n<p><img __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;../../../src/assets/blogs/classes-in-js/img-1.jpeg&#x22;,&#x22;alt&#x22;:&#x22;blog-2.jpeg&#x22;,&#x22;index&#x22;:0}"></p>\n<h3 id="class-terminology">Class Terminology</h3>\n<ul>\n<li>class : A type of a blueprint used for making objects.</li>\n<li>object : Acts as an instance of a class. Multiple instances of a class can be created.</li>\n<li>method : The functions which lie inside of classes are called as methods of a class.</li>\n<li>constructor : A special function which is called implicitly once we create an object of a class.</li>\n</ul>\n<h3 id="es6-class-component-and-its-pre-es6-equivalent">ES6 class component and its pre ES6 equivalent</h3>\n<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="javascript"><code><span class="line"><span style="color:#F97583">class</span><span style="color:#B392F0"> Dev</span><span style="color:#E1E4E8"> {</span></span>\n<span class="line"><span style="color:#F97583">  constructor</span><span style="color:#E1E4E8">(</span><span style="color:#FFAB70">x</span><span style="color:#E1E4E8">, </span><span style="color:#FFAB70">y</span><span style="color:#E1E4E8">) {</span></span>\n<span class="line"><span style="color:#79B8FF">    this</span><span style="color:#E1E4E8">.x </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> x;</span></span>\n<span class="line"><span style="color:#79B8FF">    this</span><span style="color:#E1E4E8">.y </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> y;</span></span>\n<span class="line"><span style="color:#E1E4E8">  }</span></span>\n<span class="line"></span>\n<span class="line"><span style="color:#B392F0">  code</span><span style="color:#E1E4E8">() {</span></span>\n<span class="line"><span style="color:#E1E4E8">    console.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"this:"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">this</span><span style="color:#E1E4E8">);</span></span>\n<span class="line"><span style="color:#F97583">    return</span><span style="color:#79B8FF"> this</span><span style="color:#E1E4E8">.x </span><span style="color:#F97583">+</span><span style="color:#79B8FF"> this</span><span style="color:#E1E4E8">.y;</span></span>\n<span class="line"><span style="color:#E1E4E8">  }</span></span>\n<span class="line"><span style="color:#E1E4E8">}</span></span>\n<span class="line"><span style="color:#F97583">var</span><span style="color:#E1E4E8"> vivek </span><span style="color:#F97583">=</span><span style="color:#F97583"> new</span><span style="color:#B392F0"> Dev</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">/*create instance of class Dev*/</span></span>\n<span class="line"><span style="color:#F97583">var</span><span style="color:#E1E4E8"> sum </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> vivek.</span><span style="color:#B392F0">code</span><span style="color:#E1E4E8">(); </span><span style="color:#6A737D">/*call method sum on the object vivek*/</span></span>\n<span class="line"><span style="color:#E1E4E8">console.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(sum); </span><span style="color:#6A737D">/*prints 3*/</span></span>\n<span class="line"><span style="color:#E1E4E8">console.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(vivek </span><span style="color:#F97583">instanceof</span><span style="color:#B392F0"> Dev</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">/*returns true*/</span></span></code></pre>\n<p>*Let me also show the <strong>console</strong> *</p>\n<p><img __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;../../../src/assets/blogs/classes-in-js/img-2.png&#x22;,&#x22;alt&#x22;:&#x22;1st-pic.png&#x22;,&#x22;index&#x22;:0}"></p>\n<p>Let me explain the code here in stepwise manner..</p>\n<ol>\n<li>first I declared a class.</li>\n<li>then I instantiate the class with object name vivek passing the constructor 2 integers.</li>\n<li>on opening the console, we can see all the outputs</li>\n</ol>\n<p>But, let\u2019s examine the object <code>vivek</code> in more detail. When we expand it in the console, we might see something like this:</p>\n<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="javascript"><code><span class="line"><span style="color:#B392F0">vivek</span><span style="color:#E1E4E8">: {</span></span>\n<span class="line"><span style="color:#B392F0">  x</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">,</span></span>\n<span class="line"><span style="color:#B392F0">  y</span><span style="color:#E1E4E8">: </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">,</span></span>\n<span class="line"><span style="color:#E1E4E8">  [[Prototype]]: Object</span></span>\n<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>\n<p>Notice that the object has three properties:</p>\n<ul>\n<li>The values <code>x</code> and <code>y</code> we passed to the constructor</li>\n<li>A special <code>[[Prototype]]</code> property (displayed as <code>__proto__</code> in some browsers)</li>\n</ul>\n<p>When we expand the <code>[[Prototype]]</code> property, we find:</p>\n<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="javascript"><code><span class="line"><span style="color:#E1E4E8">[[Prototype]]: {</span></span>\n<span class="line"><span style="color:#E1E4E8">  code: </span><span style="color:#B392F0">\u0192</span><span style="color:#E1E4E8">(),</span></span>\n<span class="line"><span style="color:#E1E4E8">  constructor: </span><span style="color:#F97583">class</span><span style="color:#B392F0"> Dev</span><span style="color:#E1E4E8">,</span></span>\n<span class="line"><span style="color:#E1E4E8">  [[</span><span style="color:#B392F0">Prototype</span><span style="color:#E1E4E8">]]: </span><span style="color:#B392F0">Object</span></span>\n<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>\n<p>This reveals something interesting: the <code>code()</code> method we defined in our class isn\u2019t stored directly on the object itself, but rather on its prototype! This is a key insight into how JavaScript classes actually work under the hood.</p>\n<hr>\n<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="javascript"><code><span class="line"><span style="color:#F97583">function</span><span style="color:#B392F0"> Dev</span><span style="color:#E1E4E8">(</span><span style="color:#FFAB70">x</span><span style="color:#E1E4E8">, </span><span style="color:#FFAB70">y</span><span style="color:#E1E4E8">) {</span></span>\n<span class="line"><span style="color:#79B8FF">  this</span><span style="color:#E1E4E8">.x </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> x;</span></span>\n<span class="line"><span style="color:#79B8FF">  this</span><span style="color:#E1E4E8">.y </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> y;</span></span>\n<span class="line"><span style="color:#E1E4E8">}</span></span>\n<span class="line"></span>\n<span class="line"><span style="color:#79B8FF">Dev</span><span style="color:#E1E4E8">.</span><span style="color:#79B8FF">prototype</span><span style="color:#E1E4E8">.</span><span style="color:#B392F0">code</span><span style="color:#F97583"> =</span><span style="color:#F97583"> function</span><span style="color:#E1E4E8"> () {</span></span>\n<span class="line"><span style="color:#6A737D">  /*code is a function which is added to prototype of Dev function*/</span></span>\n<span class="line"><span style="color:#E1E4E8">  console.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"this:"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">this</span><span style="color:#E1E4E8">);</span></span>\n<span class="line"><span style="color:#F97583">  return</span><span style="color:#79B8FF"> this</span><span style="color:#E1E4E8">.x </span><span style="color:#F97583">+</span><span style="color:#79B8FF"> this</span><span style="color:#E1E4E8">.y;</span></span>\n<span class="line"><span style="color:#E1E4E8">};</span></span>\n<span class="line"></span>\n<span class="line"><span style="color:#F97583">var</span><span style="color:#E1E4E8"> vivek </span><span style="color:#F97583">=</span><span style="color:#F97583"> new</span><span style="color:#B392F0"> Dev</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">/*instantiate a new object*/</span></span>\n<span class="line"><span style="color:#F97583">var</span><span style="color:#E1E4E8"> sum </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> vivek.</span><span style="color:#B392F0">code</span><span style="color:#E1E4E8">(); </span><span style="color:#6A737D">/*call the method on the instance*/</span></span>\n<span class="line"><span style="color:#E1E4E8">console.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(sum); </span><span style="color:#6A737D">/*prints the return value*/</span></span>\n<span class="line"><span style="color:#E1E4E8">console.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(vivek); </span><span style="color:#6A737D">/*prints the vivek object*/</span></span></code></pre>\n<p>*lets look at the **console *<em>as well</em></p>\n<p><img __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;../../../src/assets/blogs/classes-in-js/img-3.png&#x22;,&#x22;alt&#x22;:&#x22;2nd-pic.png&#x22;,&#x22;index&#x22;:0}"></p>\n<p>Let\u2019s click on the <strong>drop down</strong> and now see the <strong>MAGIC!!</strong></p>\n<p><img __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;../../../src/assets/blogs/classes-in-js/img-5.png&#x22;,&#x22;alt&#x22;:&#x22;5th-pic.png&#x22;,&#x22;index&#x22;:0}"></p>\n<p>First let\u2019s just go over the <strong>code</strong>..</p>\n<ol>\n<li>declare a function. Here it can also be called a constructor function because it instantiates an object.</li>\n<li>next create a function called **code ** and assign it to <strong>Dev.prototype</strong></li>\n<li>now, instantiate the object called <strong>vivek</strong> and call the method inside it.</li>\n</ol>\n<img src="../../../src/assets/blogs/classes-in-js/img-4.gif" alt="img-6.gif" class="mx-auto">\n<p>The console output for this function constructor approach is remarkably similar to the class example. Let\u2019s break down the <code>vivek</code> object created using the function constructor:</p>\n<p>When we inspect the <code>vivek</code> object, we see its own properties (<code>x</code> and <code>y</code>) and its internal <code>[[Prototype]]</code> link:</p>\n<h2 id="inspecting-the-function-constructor-object">Inspecting the Function Constructor Object</h2>\n<p>The object structure here mirrors what we saw with the <strong>class-based</strong> object:</p>\n<p>When examining the object in your browser\u2019s console, you\u2019ll notice:</p>\n<ol>\n<li><strong>Instance properties</strong> - Direct properties like <code>x</code>, <code>y</code> appear at the top level</li>\n<li><strong>Prototype chain</strong> - Expanding the [[Prototype]] dropdown reveals:\n<ul>\n<li>The <code>code()</code> method we added via <code>Developer.prototype.code</code></li>\n<li>The constructor reference pointing back to our <code>Developer</code> function</li>\n</ul>\n</li>\n</ol>\n<p>This structure confirms that function constructors and ES6 classes create identical prototype chains behind the scenes.</p>\n<blockquote>\n<p>Doesn\u2019t it totally resemble the class? The answer is quite clear and a huge <strong>YES!!</strong></p>\n</blockquote>\n<p>The function constructor pattern in pre-ES6 JavaScript is equivalent to class declarations in ES6. We can see that:</p>\n<ul>\n<li>Instance variables are declared on <code>this</code> in the Function object</li>\n<li>Methods are defined on the Function.prototype object</li>\n<li>A reference is created automatically between Function and Function.prototype objects through the prototype chain during instantiation with the <code>new</code> keyword</li>\n</ul>\n<blockquote>\n<p>Doesn\u2019t it totally resemble the class ? The answer is quite clear and a huge <strong>YESS!!</strong></p>\n</blockquote>\n<p>The code snippet above shows declaration of Function Constructor in pre-ES6 (equivalent to class declaration in ES6). We can see that instance variables are declared on this in Function object, and the methods are defined on Function.prototype object. There will be a reference created automatically between Function and Function.prototype objects through _ <em>proto</em> ________ property on Function object during instantiation using new keyword. The methods on Function.prototype will be called on the instance object.</p>\n<h3 id="prototypical-chain">Prototypical chain</h3>\n<p>here\u2019s how the prototypical chain for syntax\u2019s would look like</p>\n<img src="../../../src/assets/blogs/classes-in-js/img-6.png" alt="img-6.gif" class="mx-auto">\n<p>Essentially, we get the same prototype chain on class and Function Constructor declarations.</p>\n<img src="../../../src/assets/blogs/classes-in-js/img-7.gif" alt="gif-7.gif" class="mx-auto">\n<p><strong><em>Result</em></strong></p>\n<ol>\n<li>properties defined on constructor in ES6 can be mapped to properties defined on Function object in ES5.</li>\n<li>methods defined on classes in ES6 can be mapped to properties (methods) declared on Function.prototype object in ES5.</li>\n<li>class in ES6 can be thought of as an instruction to JavaScript compiler to automatically populate the prototype object</li>\n</ol>\n<img src="../../../src/assets/blogs/classes-in-js/img-8.webp" alt="gif-7.gif" class="mx-auto">\n<p>With this written we officially come to the end of the b<strong>log.</strong> Hope you enjoyed reading it as much as i enjoyed writing it.I hope i have made these concepts clear to you . If you have any doubt\u2019s or want to criticise any point you can comment below.</p>', { headings: 31, localImagePaths: 49, remoteImagePaths: 50, frontmatter: 51, imagePaths: 53 }, [32, 36, 40, 43, 46], { depth: 33, slug: 34, text: 35 }, 2, "points-to-remember", "Points to remember", { depth: 37, slug: 38, text: 39 }, 3, "class-terminology", "Class Terminology", { depth: 37, slug: 41, text: 42 }, "es6-class-component-and-its-pre-es6-equivalent", "ES6 class component and its pre ES6 equivalent", { depth: 33, slug: 44, text: 45 }, "inspecting-the-function-constructor-object", "Inspecting the Function Constructor Object", { depth: 37, slug: 47, text: 48 }, "prototypical-chain", "Prototypical chain", [22, 23, 24, 25], [], { title: 14, subheading: 15, slug: 11, publishedAt: 52, readingTimeInMins: 18, cover: 26 }, ["Date", "2021-05-22T00:00:00.000Z"], [22, 23, 24, 25], "my-fourth-blog.md", "this-bind-arrow-fns-js", { id: 55, data: 57, body: 62, filePath: 63, assetImports: 64, digest: 70, rendered: 71, legacyId: 96 }, { title: 58, subheading: 59, cover: 60, publishedAt: 61, readingTimeInMins: 18 }, "Connecting dots between 'this' keyword , bind() and arrow function in JavaScript class.", "This blog explains the most common problem react developer's face while using class-based components of binding methods to objects.", "__ASTRO_IMAGE_../../icons/cover-3.svg", ["Date", "2021-05-25T00:00:00.000Z"], "If you have ever written classes in react (now people use hooks) . Before React came up with hooks to make things simpler it had class-based components and very few functional components. Even so, the function-based components were looked down upon because their utility was far less. But now the times have changed. Maybe for the good because everywhere I go, I hear praises for functional components because,\n\n1. they have a simpler syntax\n2. they are less verbose\n3. easy to understand I might just start writing about functional components, let's stop and change our course..\n\n> **TL: DR** This blog explains the most common problem react developer's face while using class-based components of binding methods to objects. Why does the problem occur and how can it be solved\n\nEven though it may look like a **react** problem that is not the case, It is a javascript problem and here is how u can understand it better.\n\n## this Keyword\n\nWhat is more important to understand about the **this** keyword is that it very much depends upon the context in which it lies. It is very different to the likes of other **OOP** languages as **JAVA** or **C++**.\n\n![blog-3.jpg](../../../src/assets/blogs/this-bind-arrow-fns-js/img-1.jpeg)\n\n```javascript\nclass Dev {\n  constructor(x, y) {\n    this.x = x;\n    this.y = y;\n  }\n\n  code() {\n    console.log(this);\n    console.log(this.x + this.y);\n  }\n}\nvar vivek = new Dev(1, 2); /*create instance of class Dev*/\nvivek.code(); /*calling method of the instance*/\n```\n\nlet me also show the **console**..\n\n![1st-pic.png](../../../src/assets/blogs/this-bind-arrow-fns-js/img-2.png)\n\nHere we can see the output, where first line prints the object `vivek` ; we can recognize is since its shows the value we had passed to the object when we instantiated it. the next line prints the sum of the values we had passed.\n\nNow, lets add couple of lines, to the code..\n\n```javascript\nclass Dev {\n  constructor(x, y) {\n    this.x = x;\n    this.y = y;\n  }\n\n  code() {\n    console.log(this);\n    console.log(this.x + this.y);\n  }\n}\nvar vivek = new Dev(1, 2); /*create instance of class Dev*/\nvivek.code(); /*calling method of the instance*/\nvar call =\n  vivek.code; /*assigning the instance's method to another variable, undefined*/\ncall(); /*TypeError: Cannot read property 'x' of undefined*/\n```\n\nlet's checkout the output..\n\n![pic-2.png](../../../src/assets/blogs/this-bind-arrow-fns-js/img-3.png)\n\nThe output prints\n\n1. `undefined` on first line.\n2. TypeError: Cannot read property 'x' of undefined\n\n**Why does this happen?**  \nlet's see what we did,\n\n1. First we declare a `var` named `call` and assign it the value `vivek.code`i.e the method inside the instance object.\n2. Then we invoke the `call` variable. As i said earlier the `this` keyword works under context, and here we have assigned the function the the variable **call** without any context. Hence , the function acts as a stand-alone function. This is the most confusing part and took me time to understand because i was comparing it to other **OOP** languages.  \n   **READ IT AGAIN**  \n   The variable `call` contains a stand-alone function which doesn't have any parent or any other context hence when I print `this` it prints `undefined`. And that is the reason why we get the next **error** that says `TypeError: Cannot read property 'x' of undefined`, since we are calling `x` on `undefined`.\n\n# Solution to above problem\n\n## using bind()\n\nLet me add a single line to the code..\n\n```javascript\nclass Dev {\n  constructor(x, y) {\n    this.x = x;\n    this.y = y;\n    this.code = this.code.bind(this); /*bind the method to the object*/\n  }\n\n  code() {\n    console.log(this);\n    console.log(this.x + this.y);\n  }\n}\nvar vivek = new Dev(1, 2); /*create instance of class Dev*/\nvivek.code(); /*calling method of the instance*/\nvar call = vivek.code; /*assigning the instance's method to another variable*/\ncall(); /*calling the method*/\n```\n\nBy adding **bind** we have added the `code()` method as an object property\n\n![pic3.png](../../../src/assets/blogs/this-bind-arrow-fns-js/img-4.png)\n\nNow, if you compare the previous images and the current image of the **console** you may see that , the object has **three properties** now inside the curly brackets `{}` compared to before where there were only **two properties**. Hence, the variable `call` will not give any error on invoking as the method it is being assigned a context of the instantiated object.(here **vivek**)\n\n## using fat arrow (ES6 syntax)\n\nlet me change the syntax of the code() method..\n\n```javascript\nclass Dev {\n  constructor(x, y) {\n    this.x = x;\n    this.y = y;\n    //this.code = this.code.bind(this);\n  }\n\n  code = () => {\n    console.log(this);\n    console.log(this.x + this.y);\n  };\n}\nvar vivek = new Dev(1, 2); /*create instance of class Dev*/\nvivek.code(); /*calling method of the instance*/\nvar call = vivek.code; /*assigning the instance's method to another variable*/\ncall(); /*calling the method*/\n```\n\nThe **fat arrow** method is a ES6 property of JS. The \\*\\*fat arrow \\*\\* function doesn't have a this property in itself it always refers to the outside context for binding.Hence, we do not need to bind the method, `code()` to the object , binding happens implicitly (by itself)..\n\nthe **console** output is similar to above output..\n\n### Results\n\nThis blog has comprehensively dealt with the problem of binding, why it occurs which provides a better understanding of the issue if one faces it.\n\nWith this written we officially come to the end of the blog. Hope you enjoyed reading it as much as i enjoyed writing it.I hope i have made these concepts clear to you.", "src/content/blogs/my-third-blog.md", [65, 66, 67, 68, 69], "../../../src/assets/blogs/this-bind-arrow-fns-js/img-1.jpeg", "../../../src/assets/blogs/this-bind-arrow-fns-js/img-2.png", "../../../src/assets/blogs/this-bind-arrow-fns-js/img-3.png", "../../../src/assets/blogs/this-bind-arrow-fns-js/img-4.png", "../../icons/cover-3.svg", "74dcecc0b4b53b43", { html: 72, metadata: 73 }, `<p>If you have ever written classes in react (now people use hooks) . Before React came up with hooks to make things simpler it had class-based components and very few functional components. Even so, the function-based components were looked down upon because their utility was far less. But now the times have changed. Maybe for the good because everywhere I go, I hear praises for functional components because,</p>
<ol>
<li>they have a simpler syntax</li>
<li>they are less verbose</li>
<li>easy to understand I might just start writing about functional components, let\u2019s stop and change our course..</li>
</ol>
<blockquote>
<p><strong>TL: DR</strong> This blog explains the most common problem react developer\u2019s face while using class-based components of binding methods to objects. Why does the problem occur and how can it be solved</p>
</blockquote>
<p>Even though it may look like a <strong>react</strong> problem that is not the case, It is a javascript problem and here is how u can understand it better.</p>
<h2 id="this-keyword">this Keyword</h2>
<p>What is more important to understand about the <strong>this</strong> keyword is that it very much depends upon the context in which it lies. It is very different to the likes of other <strong>OOP</strong> languages as <strong>JAVA</strong> or <strong>C++</strong>.</p>
<p><img __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;../../../src/assets/blogs/this-bind-arrow-fns-js/img-1.jpeg&#x22;,&#x22;alt&#x22;:&#x22;blog-3.jpg&#x22;,&#x22;index&#x22;:0}"></p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="javascript"><code><span class="line"><span style="color:#F97583">class</span><span style="color:#B392F0"> Dev</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">  constructor</span><span style="color:#E1E4E8">(</span><span style="color:#FFAB70">x</span><span style="color:#E1E4E8">, </span><span style="color:#FFAB70">y</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#79B8FF">    this</span><span style="color:#E1E4E8">.x </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> x;</span></span>
<span class="line"><span style="color:#79B8FF">    this</span><span style="color:#E1E4E8">.y </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> y;</span></span>
<span class="line"><span style="color:#E1E4E8">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">  code</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#E1E4E8">    console.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">this</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    console.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">this</span><span style="color:#E1E4E8">.x </span><span style="color:#F97583">+</span><span style="color:#79B8FF"> this</span><span style="color:#E1E4E8">.y);</span></span>
<span class="line"><span style="color:#E1E4E8">  }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#F97583">var</span><span style="color:#E1E4E8"> vivek </span><span style="color:#F97583">=</span><span style="color:#F97583"> new</span><span style="color:#B392F0"> Dev</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">/*create instance of class Dev*/</span></span>
<span class="line"><span style="color:#E1E4E8">vivek.</span><span style="color:#B392F0">code</span><span style="color:#E1E4E8">(); </span><span style="color:#6A737D">/*calling method of the instance*/</span></span></code></pre>
<p>let me also show the <strong>console</strong>..</p>
<p><img __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;../../../src/assets/blogs/this-bind-arrow-fns-js/img-2.png&#x22;,&#x22;alt&#x22;:&#x22;1st-pic.png&#x22;,&#x22;index&#x22;:0}"></p>
<p>Here we can see the output, where first line prints the object <code>vivek</code> ; we can recognize is since its shows the value we had passed to the object when we instantiated it. the next line prints the sum of the values we had passed.</p>
<p>Now, lets add couple of lines, to the code..</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="javascript"><code><span class="line"><span style="color:#F97583">class</span><span style="color:#B392F0"> Dev</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">  constructor</span><span style="color:#E1E4E8">(</span><span style="color:#FFAB70">x</span><span style="color:#E1E4E8">, </span><span style="color:#FFAB70">y</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#79B8FF">    this</span><span style="color:#E1E4E8">.x </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> x;</span></span>
<span class="line"><span style="color:#79B8FF">    this</span><span style="color:#E1E4E8">.y </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> y;</span></span>
<span class="line"><span style="color:#E1E4E8">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">  code</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#E1E4E8">    console.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">this</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    console.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">this</span><span style="color:#E1E4E8">.x </span><span style="color:#F97583">+</span><span style="color:#79B8FF"> this</span><span style="color:#E1E4E8">.y);</span></span>
<span class="line"><span style="color:#E1E4E8">  }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#F97583">var</span><span style="color:#E1E4E8"> vivek </span><span style="color:#F97583">=</span><span style="color:#F97583"> new</span><span style="color:#B392F0"> Dev</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">/*create instance of class Dev*/</span></span>
<span class="line"><span style="color:#E1E4E8">vivek.</span><span style="color:#B392F0">code</span><span style="color:#E1E4E8">(); </span><span style="color:#6A737D">/*calling method of the instance*/</span></span>
<span class="line"><span style="color:#F97583">var</span><span style="color:#E1E4E8"> call </span><span style="color:#F97583">=</span></span>
<span class="line"><span style="color:#E1E4E8">  vivek.code; </span><span style="color:#6A737D">/*assigning the instance's method to another variable, undefined*/</span></span>
<span class="line"><span style="color:#B392F0">call</span><span style="color:#E1E4E8">(); </span><span style="color:#6A737D">/*TypeError: Cannot read property 'x' of undefined*/</span></span></code></pre>
<p>let\u2019s checkout the output..</p>
<p><img __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;../../../src/assets/blogs/this-bind-arrow-fns-js/img-3.png&#x22;,&#x22;alt&#x22;:&#x22;pic-2.png&#x22;,&#x22;index&#x22;:0}"></p>
<p>The output prints</p>
<ol>
<li><code>undefined</code> on first line.</li>
<li>TypeError: Cannot read property \u2018x\u2019 of undefined</li>
</ol>
<p><strong>Why does this happen?</strong><br>
let\u2019s see what we did,</p>
<ol>
<li>First we declare a <code>var</code> named <code>call</code> and assign it the value <code>vivek.code</code>i.e the method inside the instance object.</li>
<li>Then we invoke the <code>call</code> variable. As i said earlier the <code>this</code> keyword works under context, and here we have assigned the function the the variable <strong>call</strong> without any context. Hence , the function acts as a stand-alone function. This is the most confusing part and took me time to understand because i was comparing it to other <strong>OOP</strong> languages.<br>
<strong>READ IT AGAIN</strong><br>
The variable <code>call</code> contains a stand-alone function which doesn\u2019t have any parent or any other context hence when I print <code>this</code> it prints <code>undefined</code>. And that is the reason why we get the next <strong>error</strong> that says <code>TypeError: Cannot read property 'x' of undefined</code>, since we are calling <code>x</code> on <code>undefined</code>.</li>
</ol>
<h1 id="solution-to-above-problem">Solution to above problem</h1>
<h2 id="using-bind">using bind()</h2>
<p>Let me add a single line to the code..</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="javascript"><code><span class="line"><span style="color:#F97583">class</span><span style="color:#B392F0"> Dev</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">  constructor</span><span style="color:#E1E4E8">(</span><span style="color:#FFAB70">x</span><span style="color:#E1E4E8">, </span><span style="color:#FFAB70">y</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#79B8FF">    this</span><span style="color:#E1E4E8">.x </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> x;</span></span>
<span class="line"><span style="color:#79B8FF">    this</span><span style="color:#E1E4E8">.y </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> y;</span></span>
<span class="line"><span style="color:#79B8FF">    this</span><span style="color:#E1E4E8">.code </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> this</span><span style="color:#E1E4E8">.code.</span><span style="color:#B392F0">bind</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">this</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">/*bind the method to the object*/</span></span>
<span class="line"><span style="color:#E1E4E8">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">  code</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#E1E4E8">    console.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">this</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    console.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">this</span><span style="color:#E1E4E8">.x </span><span style="color:#F97583">+</span><span style="color:#79B8FF"> this</span><span style="color:#E1E4E8">.y);</span></span>
<span class="line"><span style="color:#E1E4E8">  }</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#F97583">var</span><span style="color:#E1E4E8"> vivek </span><span style="color:#F97583">=</span><span style="color:#F97583"> new</span><span style="color:#B392F0"> Dev</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">/*create instance of class Dev*/</span></span>
<span class="line"><span style="color:#E1E4E8">vivek.</span><span style="color:#B392F0">code</span><span style="color:#E1E4E8">(); </span><span style="color:#6A737D">/*calling method of the instance*/</span></span>
<span class="line"><span style="color:#F97583">var</span><span style="color:#E1E4E8"> call </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> vivek.code; </span><span style="color:#6A737D">/*assigning the instance's method to another variable*/</span></span>
<span class="line"><span style="color:#B392F0">call</span><span style="color:#E1E4E8">(); </span><span style="color:#6A737D">/*calling the method*/</span></span></code></pre>
<p>By adding <strong>bind</strong> we have added the <code>code()</code> method as an object property</p>
<p><img __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;../../../src/assets/blogs/this-bind-arrow-fns-js/img-4.png&#x22;,&#x22;alt&#x22;:&#x22;pic3.png&#x22;,&#x22;index&#x22;:0}"></p>
<p>Now, if you compare the previous images and the current image of the <strong>console</strong> you may see that , the object has <strong>three properties</strong> now inside the curly brackets <code>{}</code> compared to before where there were only <strong>two properties</strong>. Hence, the variable <code>call</code> will not give any error on invoking as the method it is being assigned a context of the instantiated object.(here <strong>vivek</strong>)</p>
<h2 id="using-fat-arrow-es6-syntax">using fat arrow (ES6 syntax)</h2>
<p>let me change the syntax of the code() method..</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="javascript"><code><span class="line"><span style="color:#F97583">class</span><span style="color:#B392F0"> Dev</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">  constructor</span><span style="color:#E1E4E8">(</span><span style="color:#FFAB70">x</span><span style="color:#E1E4E8">, </span><span style="color:#FFAB70">y</span><span style="color:#E1E4E8">) {</span></span>
<span class="line"><span style="color:#79B8FF">    this</span><span style="color:#E1E4E8">.x </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> x;</span></span>
<span class="line"><span style="color:#79B8FF">    this</span><span style="color:#E1E4E8">.y </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> y;</span></span>
<span class="line"><span style="color:#6A737D">    //this.code = this.code.bind(this);</span></span>
<span class="line"><span style="color:#E1E4E8">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">  code</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> () </span><span style="color:#F97583">=></span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    console.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">this</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#E1E4E8">    console.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">this</span><span style="color:#E1E4E8">.x </span><span style="color:#F97583">+</span><span style="color:#79B8FF"> this</span><span style="color:#E1E4E8">.y);</span></span>
<span class="line"><span style="color:#E1E4E8">  };</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#F97583">var</span><span style="color:#E1E4E8"> vivek </span><span style="color:#F97583">=</span><span style="color:#F97583"> new</span><span style="color:#B392F0"> Dev</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">1</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">); </span><span style="color:#6A737D">/*create instance of class Dev*/</span></span>
<span class="line"><span style="color:#E1E4E8">vivek.</span><span style="color:#B392F0">code</span><span style="color:#E1E4E8">(); </span><span style="color:#6A737D">/*calling method of the instance*/</span></span>
<span class="line"><span style="color:#F97583">var</span><span style="color:#E1E4E8"> call </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> vivek.code; </span><span style="color:#6A737D">/*assigning the instance's method to another variable*/</span></span>
<span class="line"><span style="color:#B392F0">call</span><span style="color:#E1E4E8">(); </span><span style="color:#6A737D">/*calling the method*/</span></span></code></pre>
<p>The <strong>fat arrow</strong> method is a ES6 property of JS. The **fat arrow ** function doesn\u2019t have a this property in itself it always refers to the outside context for binding.Hence, we do not need to bind the method, <code>code()</code> to the object , binding happens implicitly (by itself)..</p>
<p>the <strong>console</strong> output is similar to above output..</p>
<h3 id="results">Results</h3>
<p>This blog has comprehensively dealt with the problem of binding, why it occurs which provides a better understanding of the issue if one faces it.</p>
<p>With this written we officially come to the end of the blog. Hope you enjoyed reading it as much as i enjoyed writing it.I hope i have made these concepts clear to you.</p>`, { headings: 74, localImagePaths: 91, remoteImagePaths: 92, frontmatter: 93, imagePaths: 95 }, [75, 78, 82, 85, 88], { depth: 33, slug: 76, text: 77 }, "this-keyword", "this Keyword", { depth: 79, slug: 80, text: 81 }, 1, "solution-to-above-problem", "Solution to above problem", { depth: 33, slug: 83, text: 84 }, "using-bind", "using bind()", { depth: 33, slug: 86, text: 87 }, "using-fat-arrow-es6-syntax", "using fat arrow (ES6 syntax)", { depth: 37, slug: 89, text: 90 }, "results", "Results", [65, 66, 67, 68], [], { title: 58, subheading: 59, slug: 55, publishedAt: 94, readingTimeInMins: 18, cover: 69 }, ["Date", "2021-05-25T00:00:00.000Z"], [65, 66, 67, 68], "my-third-blog.md", "prototypical-inheritance-js", { id: 97, data: 99, body: 105, filePath: 106, assetImports: 107, digest: 118, rendered: 119, legacyId: 140 }, { title: 100, subheading: 101, cover: 102, publishedAt: 103, readingTimeInMins: 104 }, "Prototype's & Prototypical Inheritance in JavaScript.", "Understand how inheritance works in JS with very simple examples.", "__ASTRO_IMAGE_./cover-5.svg", ["Date", "2023-06-15T00:00:00.000Z"], 5, 'Hello guys, this is the first time I\'m writing a blog. I decided to write this blog a day ago but couldn\'t find any topic. It\'s just so difficult to choose just one topic when all of them are interconnected to each other. It really becomes difficult to draw a line. Anyway, I\'ve decided to write on prototypes and prototypical Inheritance in JavaScript. Hope I do justice to this topic. Let\'s start!! But, first time for a meme.\n\n![blog1_meme_1.jpeg](../../../src/assets/blogs/prototypical-inheritance/img-1.jpeg)\n\n---\n\n**About JavaScript**,\n\n> JavaScript is a high-level, dynamic, and loosely-typed programming language. It is highly object-oriented to the core with its prototype-based model, inspired by\xA0 \\[Self\\](https://en.wikipedia.org/wiki/Self\\_(programming\\_language) \xA0programming language.\n\nOK the last point is **highly object-oriented to the core with its prototype-based model** let\'s focus on that\n\n# JavaScript Objects\n\nYou must\'ve heard everything in JavaScript is an object. The JavaScript Object is different from what you would call an object in **Java** or **C++**. The javascript object is basically a key-value pair. Let me show you an example.\n\n```javascript\nobj1 = {\n  name: "vivek" /*here name is the key and vivek is the value*/,\n};\n```\n\n![pic2.png](../../../src/assets/blogs/prototypical-inheritance/img-2.png)\n\n# JavaScript Prototype\'s\n\nNow, if we go to the console and print the object you can see that there is a **drop down**. Let\'s click on that. Once you click on the drop down you will see the object properties.\n\n1. key-value pair\n2. \\_ _proto_ \\_\n\n**What is the proto property and how did it come here? We did not add the property, So how did this happen?**  \nWould you believe me if I said that JavaScript added this property to the object **obj1** of ours by itself, and it does the same thing for every different kind of object we declare? Yes it\'s true, we don\'t have anything to do with the property and it was added by JavaScript itself. Now if we click the **drop-down** corresponding to the \\_ _proto_ \\_ property we will see this..\n\n![pic1.png](../../../src/assets/blogs/prototypical-inheritance/img-3.png)\n\nThese are all the properties of the object \\_ _proto_ \\_\\_\\_\\_ . By object i mean the key  \n\\_ _proto_ \\_\\_\\_\\_ has all these listed properties which you can see right now in the corresponding picture.  \nWe can use these properties on our object **obj1** by using the **" . "** operator. Try this code in your editor\n\n```javascript\nobj1 = {\n  name: "vivek" /*here name is the key and vivek is the value*/,\n};\nconst obj1Copy = obj1.valueOf();\nconsole.log(obj1Copy);\n```\n\nOr you can directly try and access the properties on the **console**.\n\n![pic3.png](../../../src/assets/blogs/prototypical-inheritance/img-4.png)\n\nI hope i am clear about the prototype Object and the part in which you might feel that how can our object access these properties from the prototype ; we refer to a concept called prototypical inheritance in javascript.\n\n# Prototypical Inheritance in JavaScript\n\n![flowchart_1.png](../../../src/assets/blogs/prototypical-inheritance/img-5.png)\n\nThe above image will help me as I go about explaining this part called **Prototypical Inheritance in JavaScript**\n\nLet\'s go stepwise:\n\n1. I declare an object **obj1**.\n2. I will try to access its property name by using the following code\n\n```javascript\nobj1 = {\n  name: "vivek" /*here name is the key and vivek is the value*/,\n};\nconsole.log(obj1.name); /*prints vivek*/\n```\n\n1. Similarly if I want to check the value of my object I will write this code.\n\n```javascript\nobj1 = {\n  name: "vivek" /*here name is the key and vivek is the value*/,\n};\nconsole.log(obj1.name); /*prints vivek*/\nconsole.log(obj1.valueOf()); /*prints value of obj1*/\n```\n\n1. This property **valueOf()** was not declared in the object but was inherited from the **Object. prototype** object .\n2. when I asked for the value of the object in the **3rd statement**, the JavaScript execution engine first looked in the **current object\'s** i.e **obj1** properties and since it didn\'t find the property in the object it went to find it in **object. prototype**.\n\n---\n\n(Remember **Object. prototype** is simplicity i.e automatically linked to our object **obj1** without us doing anything. It is default JS behaviour)\n\n---\n\n1. This is where it found the property **valueOf()** and we could use it.\n2. As simple as that!!\n\n![](../../../src/assets/blogs/prototypical-inheritance/img-6.gif)\n\n# Example\n\nNow you understand how inheritance works in JS let\'s take one more example to make you more familiar with this concept.\n\n```javascript\nvar person1 = {\n  name: "alphonso",\n  getIntro: function () {\n    console.log(`My name is ${name} and i am from ${city}`);\n  },\n};\n\nvar person2 = {\n  name: "vivek",\n  city: "pune",\n  getIntro: function () {\n    console.log(`My name is ${name} and i am from ${city}`);\n  },\n};\n\nperson1.__proto__ = person2;\n```\n\nWhat we have done here is that assigned the property \\_ _proto_ \\_ of **person1** to **person2** and now the chain would look somewhat like this...\n\n![flowchart_2.png](../../../src/assets/blogs/prototypical-inheritance/img-7.png)\n\nNow, lets try to access the properties of **person1**,\n\n```javascript\nvar person1 = {\n  name: "alphonso",\n  getIntro: function () {\n    return `My name is ${this.name} and i am from ${this.city}`;\n  },\n};\n\nvar person2 = {\n  name: "vivek",\n  city: "pune",\n  getIntro: function () {\n    return `My name is ${this.name} and i am from ${this.city}`;\n  },\n};\n\nperson1.__proto__ = person2;\n\nconsole.log(person1.name); /*alphonso*/\nconsole.log(person1.city); /*pune*/\nconsole.log(person1.getIntro()); /*My name is alphonso and i am from pune*/\n```\n\nOR, you can also print it on the **console**..\n\n![pic-4.png](../../../src/assets/blogs/prototypical-inheritance/img-8.png)\n\nLets see what happened here:\n\n1. first I declared an object **person1** with properties name and **getIntro()**\n2. then I declared an object **person2** with properties **name,** **city** and **getIntro()**\n3. I linked the **proto** property of person1 with object **person2**.\n4. That\'s why when i print the city of **person1** JavaScript Exec Engine first looks in \\*\\*person1 \\*\\* and since it is not able to find it inside **person1** , it goes to person1.prototype where it finds **person2 and as a consequence finds the property person2.city**\n\n![img-9.webp](../../../src/assets/blogs/prototypical-inheritance/img-9.webp)', "src/content/blogs/my-fifth-blog.md", [108, 109, 110, 111, 112, 113, 114, 115, 116, 117], "../../../src/assets/blogs/prototypical-inheritance/img-1.jpeg", "../../../src/assets/blogs/prototypical-inheritance/img-2.png", "../../../src/assets/blogs/prototypical-inheritance/img-3.png", "../../../src/assets/blogs/prototypical-inheritance/img-4.png", "../../../src/assets/blogs/prototypical-inheritance/img-5.png", "../../../src/assets/blogs/prototypical-inheritance/img-6.gif", "../../../src/assets/blogs/prototypical-inheritance/img-7.png", "../../../src/assets/blogs/prototypical-inheritance/img-8.png", "../../../src/assets/blogs/prototypical-inheritance/img-9.webp", "./cover-5.svg", "75cc9339e1f031ac", { html: 120, metadata: 121 }, '<p>Hello guys, this is the first time I\u2019m writing a blog. I decided to write this blog a day ago but couldn\u2019t find any topic. It\u2019s just so difficult to choose just one topic when all of them are interconnected to each other. It really becomes difficult to draw a line. Anyway, I\u2019ve decided to write on prototypes and prototypical Inheritance in JavaScript. Hope I do justice to this topic. Let\u2019s start!! But, first time for a meme.</p>\n<p><img __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;../../../src/assets/blogs/prototypical-inheritance/img-1.jpeg&#x22;,&#x22;alt&#x22;:&#x22;blog1_meme_1.jpeg&#x22;,&#x22;index&#x22;:0}"></p>\n<hr>\n<p><strong>About JavaScript</strong>,</p>\n<blockquote>\n<p>JavaScript is a high-level, dynamic, and loosely-typed programming language. It is highly object-oriented to the core with its prototype-based model, inspired by\xA0 [Self](<a href="https://en.wikipedia.org/wiki/Self%5C_(programming%5C_language)">https://en.wikipedia.org/wiki/Self\\_(programming\\_language)</a> \xA0programming language.</p>\n</blockquote>\n<p>OK the last point is <strong>highly object-oriented to the core with its prototype-based model</strong> let\u2019s focus on that</p>\n<h1 id="javascript-objects">JavaScript Objects</h1>\n<p>You must\u2019ve heard everything in JavaScript is an object. The JavaScript Object is different from what you would call an object in <strong>Java</strong> or <strong>C++</strong>. The javascript object is basically a key-value pair. Let me show you an example.</p>\n<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="javascript"><code><span class="line"><span style="color:#E1E4E8">obj1 </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> {</span></span>\n<span class="line"><span style="color:#E1E4E8">  name: </span><span style="color:#9ECBFF">"vivek"</span><span style="color:#6A737D"> /*here name is the key and vivek is the value*/</span><span style="color:#E1E4E8">,</span></span>\n<span class="line"><span style="color:#E1E4E8">};</span></span></code></pre>\n<p><img __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;../../../src/assets/blogs/prototypical-inheritance/img-2.png&#x22;,&#x22;alt&#x22;:&#x22;pic2.png&#x22;,&#x22;index&#x22;:0}"></p>\n<h1 id="javascript-prototypes">JavaScript Prototype\u2019s</h1>\n<p>Now, if we go to the console and print the object you can see that there is a <strong>drop down</strong>. Let\u2019s click on that. Once you click on the drop down you will see the object properties.</p>\n<ol>\n<li>key-value pair</li>\n<li>_ <em>proto</em> _</li>\n</ol>\n<p><strong>What is the proto property and how did it come here? We did not add the property, So how did this happen?</strong><br>\nWould you believe me if I said that JavaScript added this property to the object <strong>obj1</strong> of ours by itself, and it does the same thing for every different kind of object we declare? Yes it\u2019s true, we don\u2019t have anything to do with the property and it was added by JavaScript itself. Now if we click the <strong>drop-down</strong> corresponding to the _ <em>proto</em> _ property we will see this..</p>\n<p><img __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;../../../src/assets/blogs/prototypical-inheritance/img-3.png&#x22;,&#x22;alt&#x22;:&#x22;pic1.png&#x22;,&#x22;index&#x22;:0}"></p>\n<p>These are all the properties of the object _ <em>proto</em> ____ . By object i mean the key<br>\n_ <em>proto</em> ____ has all these listed properties which you can see right now in the corresponding picture.<br>\nWe can use these properties on our object <strong>obj1</strong> by using the <strong>\u201D . \u201D</strong> operator. Try this code in your editor</p>\n<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="javascript"><code><span class="line"><span style="color:#E1E4E8">obj1 </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> {</span></span>\n<span class="line"><span style="color:#E1E4E8">  name: </span><span style="color:#9ECBFF">"vivek"</span><span style="color:#6A737D"> /*here name is the key and vivek is the value*/</span><span style="color:#E1E4E8">,</span></span>\n<span class="line"><span style="color:#E1E4E8">};</span></span>\n<span class="line"><span style="color:#F97583">const</span><span style="color:#79B8FF"> obj1Copy</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> obj1.</span><span style="color:#B392F0">valueOf</span><span style="color:#E1E4E8">();</span></span>\n<span class="line"><span style="color:#E1E4E8">console.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(obj1Copy);</span></span></code></pre>\n<p>Or you can directly try and access the properties on the <strong>console</strong>.</p>\n<p><img __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;../../../src/assets/blogs/prototypical-inheritance/img-4.png&#x22;,&#x22;alt&#x22;:&#x22;pic3.png&#x22;,&#x22;index&#x22;:0}"></p>\n<p>I hope i am clear about the prototype Object and the part in which you might feel that how can our object access these properties from the prototype ; we refer to a concept called prototypical inheritance in javascript.</p>\n<h1 id="prototypical-inheritance-in-javascript">Prototypical Inheritance in JavaScript</h1>\n<p><img __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;../../../src/assets/blogs/prototypical-inheritance/img-5.png&#x22;,&#x22;alt&#x22;:&#x22;flowchart_1.png&#x22;,&#x22;index&#x22;:0}"></p>\n<p>The above image will help me as I go about explaining this part called <strong>Prototypical Inheritance in JavaScript</strong></p>\n<p>Let\u2019s go stepwise:</p>\n<ol>\n<li>I declare an object <strong>obj1</strong>.</li>\n<li>I will try to access its property name by using the following code</li>\n</ol>\n<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="javascript"><code><span class="line"><span style="color:#E1E4E8">obj1 </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> {</span></span>\n<span class="line"><span style="color:#E1E4E8">  name: </span><span style="color:#9ECBFF">"vivek"</span><span style="color:#6A737D"> /*here name is the key and vivek is the value*/</span><span style="color:#E1E4E8">,</span></span>\n<span class="line"><span style="color:#E1E4E8">};</span></span>\n<span class="line"><span style="color:#E1E4E8">console.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(obj1.name); </span><span style="color:#6A737D">/*prints vivek*/</span></span></code></pre>\n<ol>\n<li>Similarly if I want to check the value of my object I will write this code.</li>\n</ol>\n<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="javascript"><code><span class="line"><span style="color:#E1E4E8">obj1 </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> {</span></span>\n<span class="line"><span style="color:#E1E4E8">  name: </span><span style="color:#9ECBFF">"vivek"</span><span style="color:#6A737D"> /*here name is the key and vivek is the value*/</span><span style="color:#E1E4E8">,</span></span>\n<span class="line"><span style="color:#E1E4E8">};</span></span>\n<span class="line"><span style="color:#E1E4E8">console.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(obj1.name); </span><span style="color:#6A737D">/*prints vivek*/</span></span>\n<span class="line"><span style="color:#E1E4E8">console.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(obj1.</span><span style="color:#B392F0">valueOf</span><span style="color:#E1E4E8">()); </span><span style="color:#6A737D">/*prints value of obj1*/</span></span></code></pre>\n<ol>\n<li>This property <strong>valueOf()</strong> was not declared in the object but was inherited from the <strong>Object. prototype</strong> object .</li>\n<li>when I asked for the value of the object in the <strong>3rd statement</strong>, the JavaScript execution engine first looked in the <strong>current object\u2019s</strong> i.e <strong>obj1</strong> properties and since it didn\u2019t find the property in the object it went to find it in <strong>object. prototype</strong>.</li>\n</ol>\n<hr>\n<p>(Remember <strong>Object. prototype</strong> is simplicity i.e automatically linked to our object <strong>obj1</strong> without us doing anything. It is default JS behaviour)</p>\n<hr>\n<ol>\n<li>This is where it found the property <strong>valueOf()</strong> and we could use it.</li>\n<li>As simple as that!!</li>\n</ol>\n<p><img __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;../../../src/assets/blogs/prototypical-inheritance/img-6.gif&#x22;,&#x22;alt&#x22;:&#x22;&#x22;,&#x22;index&#x22;:0}"></p>\n<h1 id="example">Example</h1>\n<p>Now you understand how inheritance works in JS let\u2019s take one more example to make you more familiar with this concept.</p>\n<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="javascript"><code><span class="line"><span style="color:#F97583">var</span><span style="color:#E1E4E8"> person1 </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> {</span></span>\n<span class="line"><span style="color:#E1E4E8">  name: </span><span style="color:#9ECBFF">"alphonso"</span><span style="color:#E1E4E8">,</span></span>\n<span class="line"><span style="color:#B392F0">  getIntro</span><span style="color:#E1E4E8">: </span><span style="color:#F97583">function</span><span style="color:#E1E4E8"> () {</span></span>\n<span class="line"><span style="color:#E1E4E8">    console.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">`My name is ${</span><span style="color:#E1E4E8">name</span><span style="color:#9ECBFF">} and i am from ${</span><span style="color:#E1E4E8">city</span><span style="color:#9ECBFF">}`</span><span style="color:#E1E4E8">);</span></span>\n<span class="line"><span style="color:#E1E4E8">  },</span></span>\n<span class="line"><span style="color:#E1E4E8">};</span></span>\n<span class="line"></span>\n<span class="line"><span style="color:#F97583">var</span><span style="color:#E1E4E8"> person2 </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> {</span></span>\n<span class="line"><span style="color:#E1E4E8">  name: </span><span style="color:#9ECBFF">"vivek"</span><span style="color:#E1E4E8">,</span></span>\n<span class="line"><span style="color:#E1E4E8">  city: </span><span style="color:#9ECBFF">"pune"</span><span style="color:#E1E4E8">,</span></span>\n<span class="line"><span style="color:#B392F0">  getIntro</span><span style="color:#E1E4E8">: </span><span style="color:#F97583">function</span><span style="color:#E1E4E8"> () {</span></span>\n<span class="line"><span style="color:#E1E4E8">    console.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">`My name is ${</span><span style="color:#E1E4E8">name</span><span style="color:#9ECBFF">} and i am from ${</span><span style="color:#E1E4E8">city</span><span style="color:#9ECBFF">}`</span><span style="color:#E1E4E8">);</span></span>\n<span class="line"><span style="color:#E1E4E8">  },</span></span>\n<span class="line"><span style="color:#E1E4E8">};</span></span>\n<span class="line"></span>\n<span class="line"><span style="color:#E1E4E8">person1.</span><span style="color:#79B8FF">__proto__</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> person2;</span></span></code></pre>\n<p>What we have done here is that assigned the property _ <em>proto</em> _ of <strong>person1</strong> to <strong>person2</strong> and now the chain would look somewhat like this\u2026</p>\n<p><img __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;../../../src/assets/blogs/prototypical-inheritance/img-7.png&#x22;,&#x22;alt&#x22;:&#x22;flowchart_2.png&#x22;,&#x22;index&#x22;:0}"></p>\n<p>Now, lets try to access the properties of <strong>person1</strong>,</p>\n<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="javascript"><code><span class="line"><span style="color:#F97583">var</span><span style="color:#E1E4E8"> person1 </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> {</span></span>\n<span class="line"><span style="color:#E1E4E8">  name: </span><span style="color:#9ECBFF">"alphonso"</span><span style="color:#E1E4E8">,</span></span>\n<span class="line"><span style="color:#B392F0">  getIntro</span><span style="color:#E1E4E8">: </span><span style="color:#F97583">function</span><span style="color:#E1E4E8"> () {</span></span>\n<span class="line"><span style="color:#F97583">    return</span><span style="color:#9ECBFF"> `My name is ${</span><span style="color:#79B8FF">this</span><span style="color:#9ECBFF">.</span><span style="color:#E1E4E8">name</span><span style="color:#9ECBFF">} and i am from ${</span><span style="color:#79B8FF">this</span><span style="color:#9ECBFF">.</span><span style="color:#E1E4E8">city</span><span style="color:#9ECBFF">}`</span><span style="color:#E1E4E8">;</span></span>\n<span class="line"><span style="color:#E1E4E8">  },</span></span>\n<span class="line"><span style="color:#E1E4E8">};</span></span>\n<span class="line"></span>\n<span class="line"><span style="color:#F97583">var</span><span style="color:#E1E4E8"> person2 </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> {</span></span>\n<span class="line"><span style="color:#E1E4E8">  name: </span><span style="color:#9ECBFF">"vivek"</span><span style="color:#E1E4E8">,</span></span>\n<span class="line"><span style="color:#E1E4E8">  city: </span><span style="color:#9ECBFF">"pune"</span><span style="color:#E1E4E8">,</span></span>\n<span class="line"><span style="color:#B392F0">  getIntro</span><span style="color:#E1E4E8">: </span><span style="color:#F97583">function</span><span style="color:#E1E4E8"> () {</span></span>\n<span class="line"><span style="color:#F97583">    return</span><span style="color:#9ECBFF"> `My name is ${</span><span style="color:#79B8FF">this</span><span style="color:#9ECBFF">.</span><span style="color:#E1E4E8">name</span><span style="color:#9ECBFF">} and i am from ${</span><span style="color:#79B8FF">this</span><span style="color:#9ECBFF">.</span><span style="color:#E1E4E8">city</span><span style="color:#9ECBFF">}`</span><span style="color:#E1E4E8">;</span></span>\n<span class="line"><span style="color:#E1E4E8">  },</span></span>\n<span class="line"><span style="color:#E1E4E8">};</span></span>\n<span class="line"></span>\n<span class="line"><span style="color:#E1E4E8">person1.</span><span style="color:#79B8FF">__proto__</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> person2;</span></span>\n<span class="line"></span>\n<span class="line"><span style="color:#E1E4E8">console.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(person1.name); </span><span style="color:#6A737D">/*alphonso*/</span></span>\n<span class="line"><span style="color:#E1E4E8">console.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(person1.city); </span><span style="color:#6A737D">/*pune*/</span></span>\n<span class="line"><span style="color:#E1E4E8">console.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(person1.</span><span style="color:#B392F0">getIntro</span><span style="color:#E1E4E8">()); </span><span style="color:#6A737D">/*My name is alphonso and i am from pune*/</span></span></code></pre>\n<p>OR, you can also print it on the <strong>console</strong>..</p>\n<p><img __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;../../../src/assets/blogs/prototypical-inheritance/img-8.png&#x22;,&#x22;alt&#x22;:&#x22;pic-4.png&#x22;,&#x22;index&#x22;:0}"></p>\n<p>Lets see what happened here:</p>\n<ol>\n<li>first I declared an object <strong>person1</strong> with properties name and <strong>getIntro()</strong></li>\n<li>then I declared an object <strong>person2</strong> with properties <strong>name,</strong> <strong>city</strong> and <strong>getIntro()</strong></li>\n<li>I linked the <strong>proto</strong> property of person1 with object <strong>person2</strong>.</li>\n<li>That\u2019s why when i print the city of <strong>person1</strong> JavaScript Exec Engine first looks in **person1 ** and since it is not able to find it inside <strong>person1</strong> , it goes to person1.prototype where it finds <strong>person2 and as a consequence finds the property person2.city</strong></li>\n</ol>\n<p><img __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;../../../src/assets/blogs/prototypical-inheritance/img-9.webp&#x22;,&#x22;alt&#x22;:&#x22;img-9.webp&#x22;,&#x22;index&#x22;:0}"></p>', { headings: 122, localImagePaths: 135, remoteImagePaths: 136, frontmatter: 137, imagePaths: 139 }, [123, 126, 129, 132], { depth: 79, slug: 124, text: 125 }, "javascript-objects", "JavaScript Objects", { depth: 79, slug: 127, text: 128 }, "javascript-prototypes", "JavaScript Prototype\u2019s", { depth: 79, slug: 130, text: 131 }, "prototypical-inheritance-in-javascript", "Prototypical Inheritance in JavaScript", { depth: 79, slug: 133, text: 134 }, "example", "Example", [108, 109, 110, 111, 112, 113, 114, 115, 116], [], { title: 100, subheading: 101, slug: 97, publishedAt: 138, readingTimeInMins: 104, cover: 117 }, ["Date", "2023-06-15T00:00:00.000Z"], [108, 109, 110, 111, 112, 113, 114, 115, 116], "my-fifth-blog.md", "reducing-bundle-size-in-react", { id: 141, data: 143, body: 149, filePath: 150, assetImports: 151, digest: 156, rendered: 157, legacyId: 202 }, { title: 144, subheading: 145, cover: 146, publishedAt: 147, readingTimeInMins: 148 }, "Running React without Create React App", "This blog details out, how you can run react without Create React App (CRA)", "__ASTRO_IMAGE_../../icons/cover-2.svg", ["Date", "2022-06-20T00:00:00.000Z"], 7, 'Recently while working on a client project, we faced the problem of having to analyze and reduce the bundle size, improve SEO metrics like FCP and LCP, and improve the loading time for the build. The project used Webpacks for configuring `npm` packages, Babel for `jsx` and converting es6 javascript to browser-compatible JavaScript. During the run of the project, I was very surprised when I saw the control a developer can have while building a website as it was my first encounter with Webpack and I was blown away by the efficiency with which it happens.\n\n  <img src="../../../src/assets/blogs/reducing-bundle-size-in-react/img-1.gif" alt="wwe-john-cena-surprised.gif" class="mx-auto" />\n\n# About Webpack\n\n**Webpack** is a static module bundler which processes your app by starting from the list of modules defined in its configuration file (`webpack.config.js`). Starting from these entry points, Webpack recursively builds a dependency graph that includes every module your application needs and then proceeds to bundling all of those modules into a small number of bundles - often, only one( `bundle[hash].js`) - to be loaded by the browser in your `index.html` file.\n\nBut, let us not sway away from the topic! In this article, we will see all about Webpack and in the second instalment of this blog, we will proceed to go in-depth into the topic to explore all the functionalities of this technology.\n\n### Prerequisites:\n\nTo follow the instructions in this article, you will require:\n\n- Beginner to intermediate knowledge of React\n- Basic knowledge of hooks and class-based components\n- es-modules [import](https://flaviocopes.com/es-modules/) and [exports](https://flaviocopes.com/es-modules/)\n\n# The Coding:\n\nNow that we have a slight hint of what we\'re going to learn, let\'s start with the basic building block of our application:\n\n## `React.createElement`\n\nLet\'s first go over how we can render `jsx` on the browser. I\'m sure you know how to do this, but let us revise this topic. Here are some observations:\n\n1. In this step, the `jsx` that we write is converted to `React.createElement` objects.\n2. These objects are a part of the virtual dom (VDOM).\n3. The virtual dom (VDOM) is always in sync with the actual DOM.\n4. React uses a [diffing](https://reactjs.org/docs/reconciliation.html) algorithm to update the real DOM&gt;\n\n`React.createElement` will be our building block of choice here since we want to avoid `jsx` elements(We also have to avoid Babel since it compiees `jsx` to JavaScript objects)\n\nHere is the diagramatic representation for the `React.createElement`:\n\n![jsx-dom-flow.drawio.png](../../../src/assets/blogs/reducing-bundle-size-in-react/img-2.)\n\nEnter the following code snippet into your console:\n\n```javascript\n//eg.\nReact.createElement("h1", {}, "Hello World");\n```\n\nLogging the above code on the console would give us the following result:\n\n![Screenshot 2022-06-16 at 6.42.01 PM.png](../../../src/assets/blogs/reducing-bundle-size-in-react/img-3.png)\n\n1. The first argument here is the type of the element eg. `div`, `h1`, etc.\n2. The second would be the props or attributes, eg. `classname`.\n3. The third is the children, eg. `text` or any other `element`.\n\n## `codesandbox`:\n\nHere is the [link](https://codesandbox.io/s/react-without-cra-uyw93j?file=/functionalComp/homepage.js) for you to experiment with this tech stack.\n\n> Note: We are going to use both class-based and functional components since I am assuming that you might be comfortable with either or both of them.\n\n## Setting up `index.html`\n\nYou can use any code editor of your choice, I would recommend `vs-code`. Enter the following snippet into your console:\n\n```javascript\n<html>\n  <head>\n    <title>React Hello World</title>\n    <link\n      rel="stylesheet"\n      href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css"\n      integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"\n      crossorigin="anonymous"\n    />\n    <script\n      src="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js"\n      integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"\n      crossorigin="anonymous"\n    ><\/script>\n    <script\n      src="https://unpkg.com/react@18/umd/react.development.js"\n      crossorigin\n    ><\/script>\n    <script\n      src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"\n      crossorigin\n    ><\/script>\n  </head>\n  <style>\n    .text {\n      text-align: center;\n    }\n  </style>\n  <body>\n    <div id="like_button_container"></div>\n    <div id="homepage"></div>\n\n    <script type="module" src="./functionalComp/homepage.js"><\/script>\n    <!-- <script type="module" src="./classBasedComp/homepage.js"><\/script> -->\n  </body>\n</html>\n```\n\n- We are using `react` and `react-dom` libraries for the react development setup and Bootstrap for CSS (You can remove and provide styles in the style tag option).\n- As `react` and `react-dom` libraries are required out-of-the-box if we are going to use `react-hooks` or any React class-based components, `react-dom` can be the equivalent for the virtual dom (VDOM).\n- Bootstrap is a library that provides styles out-of-the-box. You simply have to use the class names provided by Bootstrap in your elements to apply styles.\n- I am using a `CDN` for these dependencies, but we could also initialize the repo using `npm init` and then install these as `npm libraries`(I would you to try my approach).\n- We also have a `div` element which we will use to create our root for the React app.\n- We will be linking our `homepage.js` to the script tag as it has an attribute of the type given which is assigned as a `module` element.\n\n> It is important that we give the `homepage.js` script tag an attribute of the module since it tells the compiler that the `homepage.js` is an `es-module`. This indicates whether we can import or export JavaScript files as `es-modules` according to our liking, or else it will give us an error message. Read more about `es-modules` [here](https://flaviocopes.com/es-modules/)\n\n# Setting up our homepage\n\nOur homepage that we are going to reference here is a React class-based component. Since I am not using `jsx`, I will instead use `React.createElement` to set up the homepage.\n\n- Use the following snippet to create class-based components:\n\n```javascript\nimport LikeButton from "./like_button.js";\nconst e = React.createElement;\n\nclass HomePage extends React.Component {\n  constructor(props) {\n    super(props);\n  }\n\n  render() {\n    return e(\n      "div",\n      { className: "col-8 m-auto" },\n      "",\n      e(LikeButton),\n      e("h1", { className: "text" }, "react without CRA, babel and webpack"),\n      e(\n        "p",\n        { className: "text-center" },\n        " Hello Worlds of React and Webpack!",\n      ),\n      e("a", { href: "dynamic.html" }, "dynamic"),\n      e("hr", null),\n      e("p", { className: "text-right" }, " made with \u2764\uFE0F by Vivek Lokhande"),\n    );\n  }\n}\n\nconst domContainer = document.querySelector("#homepage");\nconst root = ReactDOM.createRoot(domContainer);\nroot.render(e(HomePage));\n```\n\n- Use the following snippet to create functional components:\n\n```javascript\nimport LikeButton from "./like_button.js";\nconst e = React.createElement;\nfunction HomePage() {\n  return e(\n    "div",\n    { className: "col-8 m-auto" },\n    "",\n    e(LikeButton),\n    e("h1", { className: "text" }, "react without CRA, babel and webpack"),\n    e("p", { className: "text-center" }, " Hello Worlds of React and Webpack!"),\n    e("a", { href: "dynamic.html" }, "dynamic"),\n    e("hr", null),\n    e("p", { className: "text-right" }, " made with \u2764\uFE0F by Vivek Lokhande"),\n  );\n}\n\nconst domContainer = document.querySelector("#homepage");\nconst root = ReactDOM.createRoot(domContainer);\nroot.render(e(HomePage));\n```\n\nAt a first glance, you can notice that:\n\n1. We are able to use `es-modules` import/exports since the `homepage.js` file is a module.\n2. The given component is stateless.\n3. We are nesting our components inside a `div` element.\n4. As I mentioned before, we are going to use homepage as our root element.\n\n## Setting up our `likeButton` component\n\nUse the code given below to implement class-based components:\n\n```javascript\nconst e = React.createElement;\n\nclass LikeButton extends React.Component {\n  constructor(props) {\n    super(props);\n    this.state = { liked: false };\n  }\n\n  render() {\n    if (this.state.liked) {\n      return e("p", {}, "You liked this.");\n    }\n\n    return e(\n      "button",\n      { onClick: () => this.setState({ liked: true }) },\n      "Like",\n    );\n  }\n}\nexport default LikeButton;\n```\n\nUse the code given below to implement functional components:\n\n```javascript\nconst e = React.createElement;\nfunction LikeButton() {\n  const [liked, setLiked] = React.useState(false);\n\n  if (liked) {\n    return e("h5", {}, "You liked this.");\n  } else {\n    return e("button", { onClick: () => setLiked((prev) => !prev) }, "Like");\n  }\n}\n\nexport default LikeButton;\n```\n\nAt first glance, you can notice that:\n\n1. The given component has states.\n2. We are using the state for conditionally rendering the UI.\n\n## Adding the `dynamic.html` page\n\nCope-paste the code that is given below for your reference:\n\n```javascript\n<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Document</title>\n  </head>\n  <body>\n    dynamic\n  </body>\n</html>\n```\n\nNow let\'s look at how everything will function when put together. While working, I have opened the `index.html` file on my browser. Here\'s a picture given below for your reference:\n\n![react-without-cra-webpack-working.gif](../../../src/assets/blogs/reducing-bundle-size-in-react/img-4.gif)\n\n# Additional notes\n\nUse the following code to pass multiple children to `React.createElement`:\n\n```javascript\nReact.createElement(\n  "div",\n  { className: "parent__div" },\n  React.createElement(\n    "h1",\n    { className: "text" },\n    "react without CRA, babel and webpack",\n  ),\n  React.createElement(\n    "p",\n    { className: "text" },\n    "Hello Worlds of React and Webpack!",\n  ),\n);\n```\n\nYou can pass as many elements as you want. Using this syntax, you can nest elements to your liking.\n\n# Takeaways\n\n- The gif shows that since we do not have a `build.js` file and all files are fetched separately, taking away the scalability factor.\n- We can see that as we write more and more code for `jsx`, it keeps on getting cumbersome to the eye.\n- This process also goes on to show how far we have come when it comes to developing applications by setting up pipelines for apps with just one command eg. CRA (`create-react-app`)\n- As we go on increasing the complexity of the application, we will face bigger problems. For example: I tried to add `react-router` here for navigation, but had to give up on the idea in the end because of the complexity involved.\n\n# Sources\n\n[React.createElement-1](https://learn.co/lessons/react-create-element), [React.createElement-2](https://symfonycasts.com/screencast/reactjs/react-create-element), [esmodules](https://flaviocopes.com/es-modules/), [common-js modules](https://flaviocopes.com/commonjs/), [React without jsx](https://reactjs.org/docs/react-without-jsx.html), [Add React to a website](https://reactjs.org/docs/add-react-to-a-website.html)', "src/content/blogs/my-second-blog.md", [152, 153, 154, 155], "../../../src/assets/blogs/reducing-bundle-size-in-react/img-2.", "../../../src/assets/blogs/reducing-bundle-size-in-react/img-3.png", "../../../src/assets/blogs/reducing-bundle-size-in-react/img-4.gif", "../../icons/cover-2.svg", "c0976391c66c8f13", { html: 158, metadata: 159 }, '<p>Recently while working on a client project, we faced the problem of having to analyze and reduce the bundle size, improve SEO metrics like FCP and LCP, and improve the loading time for the build. The project used Webpacks for configuring <code>npm</code> packages, Babel for <code>jsx</code> and converting es6 javascript to browser-compatible JavaScript. During the run of the project, I was very surprised when I saw the control a developer can have while building a website as it was my first encounter with Webpack and I was blown away by the efficiency with which it happens.</p>\n  <img src="../../../src/assets/blogs/reducing-bundle-size-in-react/img-1.gif" alt="wwe-john-cena-surprised.gif" class="mx-auto">\n<h1 id="about-webpack">About Webpack</h1>\n<p><strong>Webpack</strong> is a static module bundler which processes your app by starting from the list of modules defined in its configuration file (<code>webpack.config.js</code>). Starting from these entry points, Webpack recursively builds a dependency graph that includes every module your application needs and then proceeds to bundling all of those modules into a small number of bundles - often, only one( <code>bundle[hash].js</code>) - to be loaded by the browser in your <code>index.html</code> file.</p>\n<p>But, let us not sway away from the topic! In this article, we will see all about Webpack and in the second instalment of this blog, we will proceed to go in-depth into the topic to explore all the functionalities of this technology.</p>\n<h3 id="prerequisites">Prerequisites:</h3>\n<p>To follow the instructions in this article, you will require:</p>\n<ul>\n<li>Beginner to intermediate knowledge of React</li>\n<li>Basic knowledge of hooks and class-based components</li>\n<li>es-modules <a href="https://flaviocopes.com/es-modules/">import</a> and <a href="https://flaviocopes.com/es-modules/">exports</a></li>\n</ul>\n<h1 id="the-coding">The Coding:</h1>\n<p>Now that we have a slight hint of what we\u2019re going to learn, let\u2019s start with the basic building block of our application:</p>\n<h2 id="reactcreateelement"><code>React.createElement</code></h2>\n<p>Let\u2019s first go over how we can render <code>jsx</code> on the browser. I\u2019m sure you know how to do this, but let us revise this topic. Here are some observations:</p>\n<ol>\n<li>In this step, the <code>jsx</code> that we write is converted to <code>React.createElement</code> objects.</li>\n<li>These objects are a part of the virtual dom (VDOM).</li>\n<li>The virtual dom (VDOM) is always in sync with the actual DOM.</li>\n<li>React uses a <a href="https://reactjs.org/docs/reconciliation.html">diffing</a> algorithm to update the real DOM></li>\n</ol>\n<p><code>React.createElement</code> will be our building block of choice here since we want to avoid <code>jsx</code> elements(We also have to avoid Babel since it compiees <code>jsx</code> to JavaScript objects)</p>\n<p>Here is the diagramatic representation for the <code>React.createElement</code>:</p>\n<p><img __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;../../../src/assets/blogs/reducing-bundle-size-in-react/img-2.&#x22;,&#x22;alt&#x22;:&#x22;jsx-dom-flow.drawio.png&#x22;,&#x22;index&#x22;:0}"></p>\n<p>Enter the following code snippet into your console:</p>\n<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="javascript"><code><span class="line"><span style="color:#6A737D">//eg.</span></span>\n<span class="line"><span style="color:#E1E4E8">React.</span><span style="color:#B392F0">createElement</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"h1"</span><span style="color:#E1E4E8">, {}, </span><span style="color:#9ECBFF">"Hello World"</span><span style="color:#E1E4E8">);</span></span></code></pre>\n<p>Logging the above code on the console would give us the following result:</p>\n<p><img __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;../../../src/assets/blogs/reducing-bundle-size-in-react/img-3.png&#x22;,&#x22;alt&#x22;:&#x22;Screenshot 2022-06-16 at 6.42.01 PM.png&#x22;,&#x22;index&#x22;:0}"></p>\n<ol>\n<li>The first argument here is the type of the element eg. <code>div</code>, <code>h1</code>, etc.</li>\n<li>The second would be the props or attributes, eg. <code>classname</code>.</li>\n<li>The third is the children, eg. <code>text</code> or any other <code>element</code>.</li>\n</ol>\n<h2 id="codesandbox"><code>codesandbox</code>:</h2>\n<p>Here is the <a href="https://codesandbox.io/s/react-without-cra-uyw93j?file=/functionalComp/homepage.js">link</a> for you to experiment with this tech stack.</p>\n<blockquote>\n<p>Note: We are going to use both class-based and functional components since I am assuming that you might be comfortable with either or both of them.</p>\n</blockquote>\n<h2 id="setting-up-indexhtml">Setting up <code>index.html</code></h2>\n<p>You can use any code editor of your choice, I would recommend <code>vs-code</code>. Enter the following snippet into your console:</p>\n<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="javascript"><code><span class="line"><span style="color:#E1E4E8">&#x3C;</span><span style="color:#85E89D">html</span><span style="color:#E1E4E8">></span></span>\n<span class="line"><span style="color:#E1E4E8">  &#x3C;</span><span style="color:#85E89D">head</span><span style="color:#E1E4E8">></span></span>\n<span class="line"><span style="color:#E1E4E8">    &#x3C;</span><span style="color:#85E89D">title</span><span style="color:#E1E4E8">>React Hello World&#x3C;/</span><span style="color:#85E89D">title</span><span style="color:#E1E4E8">></span></span>\n<span class="line"><span style="color:#E1E4E8">    &#x3C;</span><span style="color:#85E89D">link</span></span>\n<span class="line"><span style="color:#B392F0">      rel</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"stylesheet"</span></span>\n<span class="line"><span style="color:#B392F0">      href</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css"</span></span>\n<span class="line"><span style="color:#B392F0">      integrity</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"</span></span>\n<span class="line"><span style="color:#B392F0">      crossorigin</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"anonymous"</span></span>\n<span class="line"><span style="color:#E1E4E8">    /></span></span>\n<span class="line"><span style="color:#E1E4E8">    &#x3C;</span><span style="color:#85E89D">script</span></span>\n<span class="line"><span style="color:#B392F0">      src</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js"</span></span>\n<span class="line"><span style="color:#B392F0">      integrity</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"</span></span>\n<span class="line"><span style="color:#B392F0">      crossorigin</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"anonymous"</span></span>\n<span class="line"><span style="color:#E1E4E8">    >&#x3C;/</span><span style="color:#85E89D">script</span><span style="color:#E1E4E8">></span></span>\n<span class="line"><span style="color:#E1E4E8">    &#x3C;</span><span style="color:#85E89D">script</span></span>\n<span class="line"><span style="color:#B392F0">      src</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"https://unpkg.com/react@18/umd/react.development.js"</span></span>\n<span class="line"><span style="color:#B392F0">      crossorigin</span></span>\n<span class="line"><span style="color:#E1E4E8">    >&#x3C;/</span><span style="color:#85E89D">script</span><span style="color:#E1E4E8">></span></span>\n<span class="line"><span style="color:#E1E4E8">    &#x3C;</span><span style="color:#85E89D">script</span></span>\n<span class="line"><span style="color:#B392F0">      src</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"https://unpkg.com/react-dom@18/umd/react-dom.development.js"</span></span>\n<span class="line"><span style="color:#B392F0">      crossorigin</span></span>\n<span class="line"><span style="color:#E1E4E8">    >&#x3C;/</span><span style="color:#85E89D">script</span><span style="color:#E1E4E8">></span></span>\n<span class="line"><span style="color:#E1E4E8">  &#x3C;/</span><span style="color:#85E89D">head</span><span style="color:#E1E4E8">></span></span>\n<span class="line"><span style="color:#E1E4E8">  &#x3C;</span><span style="color:#85E89D">style</span><span style="color:#E1E4E8">></span></span>\n<span class="line"><span style="color:#E1E4E8">    .text {</span></span>\n<span class="line"><span style="color:#E1E4E8">      text</span><span style="color:#F97583">-</span><span style="color:#E1E4E8">align: center;</span></span>\n<span class="line"><span style="color:#E1E4E8">    }</span></span>\n<span class="line"><span style="color:#E1E4E8">  &#x3C;/</span><span style="color:#85E89D">style</span><span style="color:#E1E4E8">></span></span>\n<span class="line"><span style="color:#E1E4E8">  &#x3C;</span><span style="color:#85E89D">body</span><span style="color:#E1E4E8">></span></span>\n<span class="line"><span style="color:#E1E4E8">    &#x3C;</span><span style="color:#85E89D">div</span><span style="color:#B392F0"> id</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"like_button_container"</span><span style="color:#E1E4E8">>&#x3C;/</span><span style="color:#85E89D">div</span><span style="color:#E1E4E8">></span></span>\n<span class="line"><span style="color:#E1E4E8">    &#x3C;</span><span style="color:#85E89D">div</span><span style="color:#B392F0"> id</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"homepage"</span><span style="color:#E1E4E8">>&#x3C;/</span><span style="color:#85E89D">div</span><span style="color:#E1E4E8">></span></span>\n<span class="line"></span>\n<span class="line"><span style="color:#E1E4E8">    &#x3C;</span><span style="color:#85E89D">script</span><span style="color:#B392F0"> type</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"module"</span><span style="color:#B392F0"> src</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"./functionalComp/homepage.js"</span><span style="color:#E1E4E8">>&#x3C;/</span><span style="color:#85E89D">script</span><span style="color:#E1E4E8">></span></span>\n<span class="line"><span style="color:#E1E4E8">    &#x3C;!-- &#x3C;</span><span style="color:#85E89D">script</span><span style="color:#B392F0"> type</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"module"</span><span style="color:#B392F0"> src</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"./classBasedComp/homepage.js"</span><span style="color:#E1E4E8">>&#x3C;/</span><span style="color:#85E89D">script</span><span style="color:#E1E4E8">> --></span></span>\n<span class="line"><span style="color:#E1E4E8">  &#x3C;/</span><span style="color:#85E89D">body</span><span style="color:#E1E4E8">></span></span>\n<span class="line"><span style="color:#E1E4E8">&#x3C;/</span><span style="color:#85E89D">html</span><span style="color:#E1E4E8">></span></span></code></pre>\n<ul>\n<li>We are using <code>react</code> and <code>react-dom</code> libraries for the react development setup and Bootstrap for CSS (You can remove and provide styles in the style tag option).</li>\n<li>As <code>react</code> and <code>react-dom</code> libraries are required out-of-the-box if we are going to use <code>react-hooks</code> or any React class-based components, <code>react-dom</code> can be the equivalent for the virtual dom (VDOM).</li>\n<li>Bootstrap is a library that provides styles out-of-the-box. You simply have to use the class names provided by Bootstrap in your elements to apply styles.</li>\n<li>I am using a <code>CDN</code> for these dependencies, but we could also initialize the repo using <code>npm init</code> and then install these as <code>npm libraries</code>(I would you to try my approach).</li>\n<li>We also have a <code>div</code> element which we will use to create our root for the React app.</li>\n<li>We will be linking our <code>homepage.js</code> to the script tag as it has an attribute of the type given which is assigned as a <code>module</code> element.</li>\n</ul>\n<blockquote>\n<p>It is important that we give the <code>homepage.js</code> script tag an attribute of the module since it tells the compiler that the <code>homepage.js</code> is an <code>es-module</code>. This indicates whether we can import or export JavaScript files as <code>es-modules</code> according to our liking, or else it will give us an error message. Read more about <code>es-modules</code> <a href="https://flaviocopes.com/es-modules/">here</a></p>\n</blockquote>\n<h1 id="setting-up-our-homepage">Setting up our homepage</h1>\n<p>Our homepage that we are going to reference here is a React class-based component. Since I am not using <code>jsx</code>, I will instead use <code>React.createElement</code> to set up the homepage.</p>\n<ul>\n<li>Use the following snippet to create class-based components:</li>\n</ul>\n<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="javascript"><code><span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> LikeButton </span><span style="color:#F97583">from</span><span style="color:#9ECBFF"> "./like_button.js"</span><span style="color:#E1E4E8">;</span></span>\n<span class="line"><span style="color:#F97583">const</span><span style="color:#79B8FF"> e</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> React.createElement;</span></span>\n<span class="line"></span>\n<span class="line"><span style="color:#F97583">class</span><span style="color:#B392F0"> HomePage</span><span style="color:#F97583"> extends</span><span style="color:#B392F0"> React</span><span style="color:#E1E4E8">.</span><span style="color:#B392F0">Component</span><span style="color:#E1E4E8"> {</span></span>\n<span class="line"><span style="color:#F97583">  constructor</span><span style="color:#E1E4E8">(</span><span style="color:#FFAB70">props</span><span style="color:#E1E4E8">) {</span></span>\n<span class="line"><span style="color:#79B8FF">    super</span><span style="color:#E1E4E8">(props);</span></span>\n<span class="line"><span style="color:#E1E4E8">  }</span></span>\n<span class="line"></span>\n<span class="line"><span style="color:#B392F0">  render</span><span style="color:#E1E4E8">() {</span></span>\n<span class="line"><span style="color:#F97583">    return</span><span style="color:#B392F0"> e</span><span style="color:#E1E4E8">(</span></span>\n<span class="line"><span style="color:#9ECBFF">      "div"</span><span style="color:#E1E4E8">,</span></span>\n<span class="line"><span style="color:#E1E4E8">      { className: </span><span style="color:#9ECBFF">"col-8 m-auto"</span><span style="color:#E1E4E8"> },</span></span>\n<span class="line"><span style="color:#9ECBFF">      ""</span><span style="color:#E1E4E8">,</span></span>\n<span class="line"><span style="color:#B392F0">      e</span><span style="color:#E1E4E8">(LikeButton),</span></span>\n<span class="line"><span style="color:#B392F0">      e</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"h1"</span><span style="color:#E1E4E8">, { className: </span><span style="color:#9ECBFF">"text"</span><span style="color:#E1E4E8"> }, </span><span style="color:#9ECBFF">"react without CRA, babel and webpack"</span><span style="color:#E1E4E8">),</span></span>\n<span class="line"><span style="color:#B392F0">      e</span><span style="color:#E1E4E8">(</span></span>\n<span class="line"><span style="color:#9ECBFF">        "p"</span><span style="color:#E1E4E8">,</span></span>\n<span class="line"><span style="color:#E1E4E8">        { className: </span><span style="color:#9ECBFF">"text-center"</span><span style="color:#E1E4E8"> },</span></span>\n<span class="line"><span style="color:#9ECBFF">        " Hello Worlds of React and Webpack!"</span><span style="color:#E1E4E8">,</span></span>\n<span class="line"><span style="color:#E1E4E8">      ),</span></span>\n<span class="line"><span style="color:#B392F0">      e</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"a"</span><span style="color:#E1E4E8">, { href: </span><span style="color:#9ECBFF">"dynamic.html"</span><span style="color:#E1E4E8"> }, </span><span style="color:#9ECBFF">"dynamic"</span><span style="color:#E1E4E8">),</span></span>\n<span class="line"><span style="color:#B392F0">      e</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hr"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">null</span><span style="color:#E1E4E8">),</span></span>\n<span class="line"><span style="color:#B392F0">      e</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"p"</span><span style="color:#E1E4E8">, { className: </span><span style="color:#9ECBFF">"text-right"</span><span style="color:#E1E4E8"> }, </span><span style="color:#9ECBFF">" made with \u2764\uFE0F by Vivek Lokhande"</span><span style="color:#E1E4E8">),</span></span>\n<span class="line"><span style="color:#E1E4E8">    );</span></span>\n<span class="line"><span style="color:#E1E4E8">  }</span></span>\n<span class="line"><span style="color:#E1E4E8">}</span></span>\n<span class="line"></span>\n<span class="line"><span style="color:#F97583">const</span><span style="color:#79B8FF"> domContainer</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> document.</span><span style="color:#B392F0">querySelector</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"#homepage"</span><span style="color:#E1E4E8">);</span></span>\n<span class="line"><span style="color:#F97583">const</span><span style="color:#79B8FF"> root</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> ReactDOM.</span><span style="color:#B392F0">createRoot</span><span style="color:#E1E4E8">(domContainer);</span></span>\n<span class="line"><span style="color:#E1E4E8">root.</span><span style="color:#B392F0">render</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">e</span><span style="color:#E1E4E8">(HomePage));</span></span></code></pre>\n<ul>\n<li>Use the following snippet to create functional components:</li>\n</ul>\n<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="javascript"><code><span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> LikeButton </span><span style="color:#F97583">from</span><span style="color:#9ECBFF"> "./like_button.js"</span><span style="color:#E1E4E8">;</span></span>\n<span class="line"><span style="color:#F97583">const</span><span style="color:#79B8FF"> e</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> React.createElement;</span></span>\n<span class="line"><span style="color:#F97583">function</span><span style="color:#B392F0"> HomePage</span><span style="color:#E1E4E8">() {</span></span>\n<span class="line"><span style="color:#F97583">  return</span><span style="color:#B392F0"> e</span><span style="color:#E1E4E8">(</span></span>\n<span class="line"><span style="color:#9ECBFF">    "div"</span><span style="color:#E1E4E8">,</span></span>\n<span class="line"><span style="color:#E1E4E8">    { className: </span><span style="color:#9ECBFF">"col-8 m-auto"</span><span style="color:#E1E4E8"> },</span></span>\n<span class="line"><span style="color:#9ECBFF">    ""</span><span style="color:#E1E4E8">,</span></span>\n<span class="line"><span style="color:#B392F0">    e</span><span style="color:#E1E4E8">(LikeButton),</span></span>\n<span class="line"><span style="color:#B392F0">    e</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"h1"</span><span style="color:#E1E4E8">, { className: </span><span style="color:#9ECBFF">"text"</span><span style="color:#E1E4E8"> }, </span><span style="color:#9ECBFF">"react without CRA, babel and webpack"</span><span style="color:#E1E4E8">),</span></span>\n<span class="line"><span style="color:#B392F0">    e</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"p"</span><span style="color:#E1E4E8">, { className: </span><span style="color:#9ECBFF">"text-center"</span><span style="color:#E1E4E8"> }, </span><span style="color:#9ECBFF">" Hello Worlds of React and Webpack!"</span><span style="color:#E1E4E8">),</span></span>\n<span class="line"><span style="color:#B392F0">    e</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"a"</span><span style="color:#E1E4E8">, { href: </span><span style="color:#9ECBFF">"dynamic.html"</span><span style="color:#E1E4E8"> }, </span><span style="color:#9ECBFF">"dynamic"</span><span style="color:#E1E4E8">),</span></span>\n<span class="line"><span style="color:#B392F0">    e</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"hr"</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">null</span><span style="color:#E1E4E8">),</span></span>\n<span class="line"><span style="color:#B392F0">    e</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"p"</span><span style="color:#E1E4E8">, { className: </span><span style="color:#9ECBFF">"text-right"</span><span style="color:#E1E4E8"> }, </span><span style="color:#9ECBFF">" made with \u2764\uFE0F by Vivek Lokhande"</span><span style="color:#E1E4E8">),</span></span>\n<span class="line"><span style="color:#E1E4E8">  );</span></span>\n<span class="line"><span style="color:#E1E4E8">}</span></span>\n<span class="line"></span>\n<span class="line"><span style="color:#F97583">const</span><span style="color:#79B8FF"> domContainer</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> document.</span><span style="color:#B392F0">querySelector</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"#homepage"</span><span style="color:#E1E4E8">);</span></span>\n<span class="line"><span style="color:#F97583">const</span><span style="color:#79B8FF"> root</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> ReactDOM.</span><span style="color:#B392F0">createRoot</span><span style="color:#E1E4E8">(domContainer);</span></span>\n<span class="line"><span style="color:#E1E4E8">root.</span><span style="color:#B392F0">render</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">e</span><span style="color:#E1E4E8">(HomePage));</span></span></code></pre>\n<p>At a first glance, you can notice that:</p>\n<ol>\n<li>We are able to use <code>es-modules</code> import/exports since the <code>homepage.js</code> file is a module.</li>\n<li>The given component is stateless.</li>\n<li>We are nesting our components inside a <code>div</code> element.</li>\n<li>As I mentioned before, we are going to use homepage as our root element.</li>\n</ol>\n<h2 id="setting-up-our-likebutton-component">Setting up our <code>likeButton</code> component</h2>\n<p>Use the code given below to implement class-based components:</p>\n<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="javascript"><code><span class="line"><span style="color:#F97583">const</span><span style="color:#79B8FF"> e</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> React.createElement;</span></span>\n<span class="line"></span>\n<span class="line"><span style="color:#F97583">class</span><span style="color:#B392F0"> LikeButton</span><span style="color:#F97583"> extends</span><span style="color:#B392F0"> React</span><span style="color:#E1E4E8">.</span><span style="color:#B392F0">Component</span><span style="color:#E1E4E8"> {</span></span>\n<span class="line"><span style="color:#F97583">  constructor</span><span style="color:#E1E4E8">(</span><span style="color:#FFAB70">props</span><span style="color:#E1E4E8">) {</span></span>\n<span class="line"><span style="color:#79B8FF">    super</span><span style="color:#E1E4E8">(props);</span></span>\n<span class="line"><span style="color:#79B8FF">    this</span><span style="color:#E1E4E8">.state </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> { liked: </span><span style="color:#79B8FF">false</span><span style="color:#E1E4E8"> };</span></span>\n<span class="line"><span style="color:#E1E4E8">  }</span></span>\n<span class="line"></span>\n<span class="line"><span style="color:#B392F0">  render</span><span style="color:#E1E4E8">() {</span></span>\n<span class="line"><span style="color:#F97583">    if</span><span style="color:#E1E4E8"> (</span><span style="color:#79B8FF">this</span><span style="color:#E1E4E8">.state.liked) {</span></span>\n<span class="line"><span style="color:#F97583">      return</span><span style="color:#B392F0"> e</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"p"</span><span style="color:#E1E4E8">, {}, </span><span style="color:#9ECBFF">"You liked this."</span><span style="color:#E1E4E8">);</span></span>\n<span class="line"><span style="color:#E1E4E8">    }</span></span>\n<span class="line"></span>\n<span class="line"><span style="color:#F97583">    return</span><span style="color:#B392F0"> e</span><span style="color:#E1E4E8">(</span></span>\n<span class="line"><span style="color:#9ECBFF">      "button"</span><span style="color:#E1E4E8">,</span></span>\n<span class="line"><span style="color:#E1E4E8">      { </span><span style="color:#B392F0">onClick</span><span style="color:#E1E4E8">: () </span><span style="color:#F97583">=></span><span style="color:#79B8FF"> this</span><span style="color:#E1E4E8">.</span><span style="color:#B392F0">setState</span><span style="color:#E1E4E8">({ liked: </span><span style="color:#79B8FF">true</span><span style="color:#E1E4E8"> }) },</span></span>\n<span class="line"><span style="color:#9ECBFF">      "Like"</span><span style="color:#E1E4E8">,</span></span>\n<span class="line"><span style="color:#E1E4E8">    );</span></span>\n<span class="line"><span style="color:#E1E4E8">  }</span></span>\n<span class="line"><span style="color:#E1E4E8">}</span></span>\n<span class="line"><span style="color:#F97583">export</span><span style="color:#F97583"> default</span><span style="color:#E1E4E8"> LikeButton;</span></span></code></pre>\n<p>Use the code given below to implement functional components:</p>\n<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="javascript"><code><span class="line"><span style="color:#F97583">const</span><span style="color:#79B8FF"> e</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> React.createElement;</span></span>\n<span class="line"><span style="color:#F97583">function</span><span style="color:#B392F0"> LikeButton</span><span style="color:#E1E4E8">() {</span></span>\n<span class="line"><span style="color:#F97583">  const</span><span style="color:#E1E4E8"> [</span><span style="color:#79B8FF">liked</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">setLiked</span><span style="color:#E1E4E8">] </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> React.</span><span style="color:#B392F0">useState</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">false</span><span style="color:#E1E4E8">);</span></span>\n<span class="line"></span>\n<span class="line"><span style="color:#F97583">  if</span><span style="color:#E1E4E8"> (liked) {</span></span>\n<span class="line"><span style="color:#F97583">    return</span><span style="color:#B392F0"> e</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"h5"</span><span style="color:#E1E4E8">, {}, </span><span style="color:#9ECBFF">"You liked this."</span><span style="color:#E1E4E8">);</span></span>\n<span class="line"><span style="color:#E1E4E8">  } </span><span style="color:#F97583">else</span><span style="color:#E1E4E8"> {</span></span>\n<span class="line"><span style="color:#F97583">    return</span><span style="color:#B392F0"> e</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"button"</span><span style="color:#E1E4E8">, { </span><span style="color:#B392F0">onClick</span><span style="color:#E1E4E8">: () </span><span style="color:#F97583">=></span><span style="color:#B392F0"> setLiked</span><span style="color:#E1E4E8">((</span><span style="color:#FFAB70">prev</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">=></span><span style="color:#F97583"> !</span><span style="color:#E1E4E8">prev) }, </span><span style="color:#9ECBFF">"Like"</span><span style="color:#E1E4E8">);</span></span>\n<span class="line"><span style="color:#E1E4E8">  }</span></span>\n<span class="line"><span style="color:#E1E4E8">}</span></span>\n<span class="line"></span>\n<span class="line"><span style="color:#F97583">export</span><span style="color:#F97583"> default</span><span style="color:#E1E4E8"> LikeButton;</span></span></code></pre>\n<p>At first glance, you can notice that:</p>\n<ol>\n<li>The given component has states.</li>\n<li>We are using the state for conditionally rendering the UI.</li>\n</ol>\n<h2 id="adding-the-dynamichtml-page">Adding the <code>dynamic.html</code> page</h2>\n<p>Cope-paste the code that is given below for your reference:</p>\n<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="javascript"><code><span class="line"><span style="color:#F97583">&#x3C;!</span><span style="color:#79B8FF">DOCTYPE</span><span style="color:#E1E4E8"> html</span><span style="color:#F97583">></span></span>\n<span class="line"><span style="color:#E1E4E8">&#x3C;</span><span style="color:#85E89D">html</span><span style="color:#B392F0"> lang</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"en"</span><span style="color:#E1E4E8">></span></span>\n<span class="line"><span style="color:#E1E4E8">  &#x3C;</span><span style="color:#85E89D">head</span><span style="color:#E1E4E8">></span></span>\n<span class="line"><span style="color:#E1E4E8">    &#x3C;</span><span style="color:#85E89D">meta</span><span style="color:#B392F0"> charset</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"UTF-8"</span><span style="color:#E1E4E8"> /></span></span>\n<span class="line"><span style="color:#E1E4E8">    &#x3C;</span><span style="color:#85E89D">meta</span><span style="color:#B392F0"> http-equiv</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"X-UA-Compatible"</span><span style="color:#B392F0"> content</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"IE=edge"</span><span style="color:#E1E4E8"> /></span></span>\n<span class="line"><span style="color:#E1E4E8">    &#x3C;</span><span style="color:#85E89D">meta</span><span style="color:#B392F0"> name</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"viewport"</span><span style="color:#B392F0"> content</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"width=device-width, initial-scale=1.0"</span><span style="color:#E1E4E8"> /></span></span>\n<span class="line"><span style="color:#E1E4E8">    &#x3C;</span><span style="color:#85E89D">title</span><span style="color:#E1E4E8">>Document&#x3C;/</span><span style="color:#85E89D">title</span><span style="color:#E1E4E8">></span></span>\n<span class="line"><span style="color:#E1E4E8">  &#x3C;/</span><span style="color:#85E89D">head</span><span style="color:#E1E4E8">></span></span>\n<span class="line"><span style="color:#E1E4E8">  &#x3C;</span><span style="color:#85E89D">body</span><span style="color:#E1E4E8">></span></span>\n<span class="line"><span style="color:#E1E4E8">    dynamic</span></span>\n<span class="line"><span style="color:#E1E4E8">  &#x3C;/</span><span style="color:#85E89D">body</span><span style="color:#E1E4E8">></span></span>\n<span class="line"><span style="color:#E1E4E8">&#x3C;/</span><span style="color:#85E89D">html</span><span style="color:#E1E4E8">></span></span></code></pre>\n<p>Now let\u2019s look at how everything will function when put together. While working, I have opened the <code>index.html</code> file on my browser. Here\u2019s a picture given below for your reference:</p>\n<p><img __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;../../../src/assets/blogs/reducing-bundle-size-in-react/img-4.gif&#x22;,&#x22;alt&#x22;:&#x22;react-without-cra-webpack-working.gif&#x22;,&#x22;index&#x22;:0}"></p>\n<h1 id="additional-notes">Additional notes</h1>\n<p>Use the following code to pass multiple children to <code>React.createElement</code>:</p>\n<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="javascript"><code><span class="line"><span style="color:#E1E4E8">React.</span><span style="color:#B392F0">createElement</span><span style="color:#E1E4E8">(</span></span>\n<span class="line"><span style="color:#9ECBFF">  "div"</span><span style="color:#E1E4E8">,</span></span>\n<span class="line"><span style="color:#E1E4E8">  { className: </span><span style="color:#9ECBFF">"parent__div"</span><span style="color:#E1E4E8"> },</span></span>\n<span class="line"><span style="color:#E1E4E8">  React.</span><span style="color:#B392F0">createElement</span><span style="color:#E1E4E8">(</span></span>\n<span class="line"><span style="color:#9ECBFF">    "h1"</span><span style="color:#E1E4E8">,</span></span>\n<span class="line"><span style="color:#E1E4E8">    { className: </span><span style="color:#9ECBFF">"text"</span><span style="color:#E1E4E8"> },</span></span>\n<span class="line"><span style="color:#9ECBFF">    "react without CRA, babel and webpack"</span><span style="color:#E1E4E8">,</span></span>\n<span class="line"><span style="color:#E1E4E8">  ),</span></span>\n<span class="line"><span style="color:#E1E4E8">  React.</span><span style="color:#B392F0">createElement</span><span style="color:#E1E4E8">(</span></span>\n<span class="line"><span style="color:#9ECBFF">    "p"</span><span style="color:#E1E4E8">,</span></span>\n<span class="line"><span style="color:#E1E4E8">    { className: </span><span style="color:#9ECBFF">"text"</span><span style="color:#E1E4E8"> },</span></span>\n<span class="line"><span style="color:#9ECBFF">    "Hello Worlds of React and Webpack!"</span><span style="color:#E1E4E8">,</span></span>\n<span class="line"><span style="color:#E1E4E8">  ),</span></span>\n<span class="line"><span style="color:#E1E4E8">);</span></span></code></pre>\n<p>You can pass as many elements as you want. Using this syntax, you can nest elements to your liking.</p>\n<h1 id="takeaways">Takeaways</h1>\n<ul>\n<li>The gif shows that since we do not have a <code>build.js</code> file and all files are fetched separately, taking away the scalability factor.</li>\n<li>We can see that as we write more and more code for <code>jsx</code>, it keeps on getting cumbersome to the eye.</li>\n<li>This process also goes on to show how far we have come when it comes to developing applications by setting up pipelines for apps with just one command eg. CRA (<code>create-react-app</code>)</li>\n<li>As we go on increasing the complexity of the application, we will face bigger problems. For example: I tried to add <code>react-router</code> here for navigation, but had to give up on the idea in the end because of the complexity involved.</li>\n</ul>\n<h1 id="sources">Sources</h1>\n<p><a href="https://learn.co/lessons/react-create-element">React.createElement-1</a>, <a href="https://symfonycasts.com/screencast/reactjs/react-create-element">React.createElement-2</a>, <a href="https://flaviocopes.com/es-modules/">esmodules</a>, <a href="https://flaviocopes.com/commonjs/">common-js modules</a>, <a href="https://reactjs.org/docs/react-without-jsx.html">React without jsx</a>, <a href="https://reactjs.org/docs/add-react-to-a-website.html">Add React to a website</a></p>', { headings: 160, localImagePaths: 197, remoteImagePaths: 198, frontmatter: 199, imagePaths: 201 }, [161, 164, 167, 170, 173, 176, 179, 182, 185, 188, 191, 194], { depth: 79, slug: 162, text: 163 }, "about-webpack", "About Webpack", { depth: 37, slug: 165, text: 166 }, "prerequisites", "Prerequisites:", { depth: 79, slug: 168, text: 169 }, "the-coding", "The Coding:", { depth: 33, slug: 171, text: 172 }, "reactcreateelement", "React.createElement", { depth: 33, slug: 174, text: 175 }, "codesandbox", "codesandbox:", { depth: 33, slug: 177, text: 178 }, "setting-up-indexhtml", "Setting up index.html", { depth: 79, slug: 180, text: 181 }, "setting-up-our-homepage", "Setting up our homepage", { depth: 33, slug: 183, text: 184 }, "setting-up-our-likebutton-component", "Setting up our likeButton component", { depth: 33, slug: 186, text: 187 }, "adding-the-dynamichtml-page", "Adding the dynamic.html page", { depth: 79, slug: 189, text: 190 }, "additional-notes", "Additional notes", { depth: 79, slug: 192, text: 193 }, "takeaways", "Takeaways", { depth: 79, slug: 195, text: 196 }, "sources", "Sources", [152, 153, 154], [], { title: 144, subheading: 145, slug: 141, publishedAt: 200, readingTimeInMins: 148, cover: 155 }, ["Date", "2022-06-20T00:00:00.000Z"], [152, 153, 154], "my-second-blog.md", "remix-better-forms-for-better-ux-and-dx", { id: 203, data: 205, body: 211, filePath: 212, assetImports: 213, digest: 224, rendered: 225, legacyId: 286 }, { title: 206, subheading: 207, cover: 208, publishedAt: 209, readingTimeInMins: 210 }, "Remix Better Forms for Better UX and DX", "Discover how Remix is revolutionizing form development for better user experience (UX) and developer experience (DX).", "__ASTRO_IMAGE_../../icons/cover-1.svg", ["Date", "2023-06-15T00:00:00.000Z"], 11, '## **Introduction**\n\nRecently I gave a talk on how things are changing around the web ecosystem, especially with React. I also explored how we can adopt better practices with writing forms.\n\nPersonally, I have been using Remix in one of the open-source products I have been working on with some talented folks at RealDevSquad. I have been loving the Remix approach with forms and what they have brought in with the [**loaders**](https://remix.run/docs/en/main/route/loader) and [**actions**](https://remix.run/docs/en/1.15.0/components/form#action)**.** It is very intuitive to the way that web was around the time of MPAs (Multi-page apps).\n\nBut why did I choose to explore this further?\n\n![image (1).jpeg](../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-1.webp)\n\nI was browsing Twitter, and I saw this tweet by Dan Abramov. I was working on a Remix app that also recommends uncontrolled forms. It was a topic worth exploring. So I started my voyage to see what is the issue at hand, which approach is better, and why it is better.\n\n## **TLDR**\n\n### What is Remix?\n\n[Remix](https://remix.run/), which is also a React framework, was co-founded by ex-Twitter engineer **Michael Jackson along with Ryan Florence** in 2020. Before this, the two had been working together for years to create open-source tools based on the [JavaScript](https://analyticsindiamag.com/the-javascript-framework-that-solves-the-annoying-feature-speed-paradox/) library React that is used to build app UIs.They are also core members of the react-router team.\n\n### Some Technical Terms\n\n1. MPA\n\n   **A Multi-Page Application (MPA)** is a website consisting of multiple HTML pages, mostly rendered on a server. When you navigate to a new page, your browser requests a new page of HTML from the server.\n\n2. SPA\n\n   **A Single-Page Application (SPA)** is a website consisting of a single JavaScript application that loads in the user\'s browser and then renders HTML locally. SPAs may _also_ generate HTML on the server, but SPAs are unique in their ability to run your website as a JavaScript application in the browser to render a new page of HTML when you navigate. [Next.js](https://geekyants.com/hire-next-js-developers/), Nuxt.js, SvelteKit, Remix, Gatsby, and Create React App are all examples of SPA frameworks.\n\n3. PESPA\n\n   A **PESPA (Progressively enhanced Single Page App)** is a term coined by **_Kent C. Dodds_** in one of his blogs called [the webs next transition](https://www.epicweb.dev/the-webs-next-transition), where he describes a PESPA as a mix of both SPA and the MPA world which brings the best of both worlds to improve UX and DX.\n\n   ### We have divided this blog into three parts in the same way:\n\n   1. _MPA_\n   2. _SPA_\n   3. _PESPA_\n\n## **What are We Going to Cover in This Blog?**\n\nForms have existed from the time the web has existed. Over this period, we have come to write forms in multiple ways. There were a lot of things about forms that evolved with time as well, in terms of both DX (developer experience) and [UX (user experience)](https://geekyants.com/ui-ux-design-services/). For users, it was validations of the fields, clicking on focus etc. For developers, it was how easy it is to write cumbersome validations and where they should be maintaining state etc. This blog covers how we evolved w.r.t to writing and viewing forms and how Remix might be changing the way we write forms going forward.\n\n## **What are Forms?**\n\n> **_Forms are a navigation event -_** [**_Ryan Florence_**](https://reactresources.com/people/ryan-florence)\n\nIf you take a closer look at forms, they are similar to anchor tags. The only difference between the form and the anchor tag is that with the form, we can send some data to the server, whereas an anchor tag just does redirection/navigation for us.\n\n## **How Did Forms Work in the Past?**\n\nIf you see at the inception of the web when everything just happened on the server and we used to get pre-rendered HTML from the server, a form would look something like this.\n\n```html\n<form action="http://localhost:4130/posts" method="POST">\n  <div class="flex flex-col">\n    <input type="hidden" name="intent" value="createPost" />\n    <label for="input-1"><h3>title</h3></label>\n    <input\n      type="text"\n      id="input-1"\n      name="title"\n      placeholder="title"\n      class="w-100"\n    />\n    <label for="input-2"><h3>description</h3></label>\n    <input type="text" id="input-2" name="description" class="w-100" />\n    <label for="input-3"><h3>content</h3></label>\n    <textarea\n      name="content"\n      id="input-3"\n      cols="30"\n      rows="10"\n      name="content"\n    ></textarea>\n  </div>\n  <div class="flex justify-end">\n    <input type="submit" value="Submit" />\n  </div>\n</form>\n```\n\nThis is a very simple implementation of a form, no JavaScript. I could just link this HTML page with some CSS if I want to correspond to the class names, but that is it, I would not require much configuration. Once I make the `POST` request, I can expect the server to get the data from the database and return the data with a redirect response to the client. We can expect the responses to be in this order:\n\n- `POST` request triggers a redirect response from the server.\n- `redirect` causes the client to refresh and get the data from the server.\n\n![Screenshot 2023-06-14 at 12.04.18 PM.png](../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-2.webp)\n\n![image (18).png](../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-3.webp)\n\n[**Source (article by Kent C.Dodds)**](https://www.epicweb.dev/the-webs-next-transition)\uFEFF\n\nYou can refer to the code [**here**](https://github.com/isVivek99/forms-framework-Debate/tree/master/01-mpa).\n\n### **Pros of the Approach**\n\n1. We have a simple mental model.\n2. We do not need to lot of code to write a simple form.\n3. We can add built-in HTML validations.\n4. We can expect the browser the create and send the payload over the wire to the server when we click on submit.\n\n### **Cons of the Approach**\n\n1. We cannot have custom error validations.\n2. Full page refresh is triggered on every post request.\n3. We cannot have an optimistic UI, although we can show pending UI with CSS, but we can face some limitations.\n\n## **How Did Forms Look During the SPA Era?**\n\nWe could have a debate based on the fact alone that we are past the SPA phase. I think that this would need context, and I think we are in a transition phase with different frameworks around. But I assume there is a common consensus that there was a period when we used SPAs heavily, so considering that, we are going to look at React and how we handle forms in React.\n\nWith React, we can get the state, which we can use for controlling input fields, we can easily show optimistic UI or a pending UI and we can also prevent whole page re-renders because we can use JavaScript to append data to the state.\n\nA form in React would look like this.\n\n```typescript\nimport React from "react";\nimport { useForm, Resolver } from "react-hook-form";\nimport "./blog.css";\n\ntype Post = { id: string; title: string; desc: string; content: string };\n\ntype FormValues = {\n  title: string;\n  desc: string;\n  content: string;\n};\n\nconst resolver: Resolver<FormValues> = async (values) => {\n\n  return {\n    values: values.title ? values : {},\n    errors: !values.title\n      ? {\n          title: {\n            type: "required",\n            message: "This is required.",\n          },\n        }\n      : !values.desc\n      ? {\n          desc: {\n            type: "required",\n            message: "This is required.",\n          },\n        }\n      : !values.content\n      ? {\n          content: {\n            type: "required",\n            message: "This is required.",\n          },\n        }\n      : {},\n  };\n};\nlet renderCount = 0;\nconst Posts = () => {\n  const [posts, setPosts] = React.useState<Array<Post>>([]);\n  const [statuses, setStatuses] = React.useState<{\n    loadingPosts: "idle" | "loading";\n    creatingPost: "idle" | "loading";\n  }>({\n    loadingPosts: "loading",\n    creatingPost: "idle",\n  });\n  const {\n    register,\n    handleSubmit,\n    formState: { errors },\n  } = useForm({ resolver });\n\n  renderCount++;\n\n  // initial load of posts\n  React.useEffect(() => {\n    fetch("http://localhost:4131/api/posts")\n      .then((res) => res.json())\n      .then(({ posts }) => {\n        setPosts(posts);\n        setStatuses((old) => ({ ...old, loadingTodos: "idle" }));\n      });\n  }, []);\n\n  return (\n    <div className=\' m-auto\'>\n      renderCount:{renderCount}\n      <div className=\'flex\'>\n        <div className=\'flex-basis-1-3\'>\n          <ul hidden={!posts.length}>\n            {posts.map((post, i) => (\n              <li key={i}>\n                <p className=\'bold my-1\'>{post.title}</p>\n                <p className=\'bold my-1\'>{post.desc}</p>\n              </li>\n            ))}\n          </ul>\n        </div>\n        <div className=\'border-r-2 px-2 mx-2\'></div>\n\n        <div className=\'flex-basis-2-3\'>\n          <div className=\'border-b-2 border-color-brown\'>\n            <h1>My Blog</h1>\n          </div>\n          <form\n            onSubmit={handleSubmit((data, e) => {\n              const { title, desc, content } = data;\n              e?.target.reset();\n\n              setPosts([\n                ...posts,\n                { title, desc, content, id: Math.random().toFixed(2) },\n              ]);\n\n              setStatuses((old) => ({ ...old, creatingPost: "loading" }));\n              fetch(`http://localhost:4131/api/posts`, {\n                method: "POST",\n                headers: { "Content-Type": "application/json" },\n                body: JSON.stringify({ title, desc, content }),\n              })\n                .then((res) => res.json())\n                .then((data) => {\n                  setPosts((prev) => {\n                    prev[prev.length - 1] = data.post;\n                    console.log(posts);\n                    return prev;\n                  });\n\n                  setStatuses((old) => ({ ...old, creatingPost: "idle" }));\n                });\n            })}\n          >\n            <div className=\'flex flex-col\'>\n              <label htmlFor=\'input-1\'>\n                <h3>title</h3>\n              </label>\n              <input\n                id=\'input-1\'\n                className={`w-100 ${\n                  errors.title?.message ? "input-error" : ""\n                }`}\n                data-pending={statuses.creatingPost === "loading"}\n                {...register("title", { required: "this field is required." })}\n              />\n\n              <p className=\'error\'>{errors.title?.message}</p>\n              <label htmlFor=\'input-2\'>\n                <h3>desc</h3>\n              </label>\n              <input\n                id=\'input-2\'\n                className={`w-100 ${errors.desc?.message ? "input-error" : ""}`}\n                data-pending={statuses.creatingPost === "loading"}\n                {...register("desc", {\n                  required: "this field is required.",\n                })}\n              />\n              <p className=\'error\'>{errors.desc?.message}</p>\n              <label htmlFor=\'input-3\'>\n                <h3>content</h3>\n              </label>\n              <textarea\n                id=\'input-3\'\n                cols={30}\n                rows={10}\n                className={`w-100 ${\n                  errors.content?.message ? "input-error" : ""\n                }`}\n                {...register("content", {\n                  required: "this filed is also required.",\n                })}\n                data-pending={statuses.creatingPost === "loading"}\n              ></textarea>\n              <p className=\'error\'>{errors.content?.message}</p>\n            </div>\n            <div className=\'flex justify-end\'>\n              <button\n                type=\'submit\'\n                disabled={statuses.creatingPost === "loading"}\n              >\n                create post\n              </button>\n            </div>\n          </form>\n        </div>\n      </div>\n    </div>\n  );\n};\n```\n\nYou can notice that I am not using any controlled input field. Instead, I am using a library called\xA0`react-hook-form`**,**\xA0which uses refs instead of state, which means we are considerably reducing the re-renders that we would have gotten with using controlled forms.\n\nWe can expect the responses to be in this order:\n\n- `POST` request triggers a status `OK`, the response from the server.\n- the received response can be added to the posts list on success. Else we can show an error alert.\n\n![Screenshot 2023-06-14 at 12.04.52 PM.png](../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-4.webp)\n\nThis is how the form would work in the case of our SPA.\n\n![image (19).png](../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-5.webp)\n\nYou can refer to the code [**here**](../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-6.webp)**.**\n\n### **Pros of the Approach**\n\n1. We can add optimistic UI.\n2. We can add pending UI.\n3. We can add built-in HTML validations.\n\n### **Cons of the Approach**\n\n1. We don\'t have a simple mental model.\n2. We have to create a request, prevent the default behavior of the browser and send data to a URL by creating the payload, which the browser can also do, but we hijack it and make it more difficult.\n3. We have to write a lot of code for the form to work (130 lines here).\n\n## **A Better Way to Write Forms?**\n\nTill now, we have seen two different ways of writing forms, and both have their pros and cons. But what if I tell you that we can use the pros which we have seen at both places, plus add type safety and server-side validations in case your javascript has not loaded yet on the client? Would you believe me?\n\nWell, that is where Remix mental modal for forms comes into the picture.\n\nWith Remix, you have a function that runs on the server for different HTTP calls.\n\n![image (3).jpeg](../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-7.webp)\n\nThis is a\xA0`loader` function, which runs on the server for every\xA0`GET`\xA0call.\n\n![image (4).jpeg](../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-8.webp)\n\nThis is an\xA0`action`\xA0function which runs on the server when we make a\xA0`POST/ PUT/ DELETE`\xA0call to the server.\n\nThis is how the form would look like.\n\n```typescript\nexport default function Posts() {\n  // get data when the loader function runs on the mount of the                 component\n  const data = useLoaderData() as { posts: Array<Post> };\n\n  // returns errors from the action function when user submits the form\n  const errors = useActionData();\n//hook exposed by remix/react to track states of the form i.e. submitting/loading/idle\n  const transition = useTransition();\n\n  const text =\n    transition.state === "submitting"\n      ? "Saving..."\n      : transition.state === "loading"\n      ? "Saved!"\n      : "create post";\n\n  return (\n    <div className=" m-auto">\n      <div className="flex">\n        <div className="flex-basis-1-3">\n          <ul hidden={!data.posts.length}>\n            {data.posts.map((post, i) => (\n              <li style={{ marginBottom: "20px" }} key={i}>\n                <p className="bold my-1">{post.title}</p>\n                <p className="bold my-1">{post.desc}</p>\n              </li>\n            ))}\n          </ul>\n        </div>\n        <div className="mx-2 border-r-2 px-2"></div>\n\n        <div className="flex-basis-2-3">\n          <div className="border-color-brown border-b-2">\n            <h1>My Blog</h1>\n          </div>\n          <Form\n            method="post"\n            onSubmit={(event) => {\n              const form = event.currentTarget;\n              requestAnimationFrame(() => {\n                form.reset();\n              });\n            }}\n          >\n            <div className="flex flex-col">\n              <label htmlFor="input-1">\n                <h3>title</h3>\n              </label>\n              <input\n                type="text"\n                id="input-1"\n                className="w-100"\n                autoFocus\n                data-pending={\n                  transition.state === "submitting" ||\n                  transition.state === "loading"\n                }\n                name="title"\n              />\n              {errors?.title && <p className="error">{errors.title}</p>}\n              <label htmlFor="input-2">\n                <h3>desc</h3>\n              </label>\n              <input\n                type="text"\n                id="input-2"\n                className="w-100"\n                name="desc"\n                data-pending={\n                  transition.state === "submitting" ||\n                  transition.state === "loading"\n                }\n              />\n              {errors?.desc && <p className="error">{errors.desc}</p>}\n              <label htmlFor="input-3">\n                <h3>content</h3>\n              </label>\n              <textarea\n                id="input-3"\n                cols={30}\n                rows={10}\n                name="content"\n                data-pending={\n                  transition.state === "submitting" ||\n                  transition.state === "loading"\n                }\n              ></textarea>\n              {errors?.content && <p className="error">{errors.content}</p>}\n            </div>\n            <div className="flex justify-end">\n              <button\n                type="submit"\n                disabled={\n                  transition.state === "submitting" ||\n                  transition.state === "loading"\n                }\n              >\n                {text}\n              </button>\n            </div>\n          </Form>\n        </div>\n      </div>\n    </div>\n  );\n}\n```\n\nThis is how you would work with the form:\n\n- You get the data from the server when the page loads using the\xA0`useLoaderData`\xA0hook.\n- You write JSX for your form, and you can use the state from the\xA0`useTransition`\xA0hook for adding optimistic /pending UI.\n- Whenever the user fills out the form and clicks on submit, the request is sent to the `action` function, which runs on the server and can validate the data using native JavasScript APIs.\n- If the request is successful, you can return a redirect response from the server, which will trigger the `useLoaderData` hook instead of a full page refresh, and you will get the latest posts from the server, which will be displayed on the screen.\n\n### **Response Sequence**\n\nThis is the way you can expect the order of responses to be when you submit the form.\n\n- A successful post request triggers a `redirect` response from the server.\n- The redirect response triggers a `get` call on the client.\n\n![Screenshot 2023-06-14 at 12.05.23 PM.png](../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-9.webp)\n\nThis is how the form would work in the case of what Kent C. Dodds calls a PESPA (progressively enhanced single-page app).\n\n![image (20).png](../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-10.webp)\n\nYou can refer to the code [**here**](https://github.com/isVivek99/forms-framework-Debate/tree/master/03-pespa/blog-tutorial/app/routes)**.**\n\n### **Pros of this Approach**\n\n1. We have a SPA with a mental model of an MPA, i.e. old web and new web combined.\n2. We can add optimistic UI.\n3. We can add pending UI.\n4. We can add custom validations on the server as well as on the client by using `react-hook-form`.\n5. We can see the form is smaller compared to the old react form (100 lines).\n\n### **Cons of this Approach**\n\n1. I personally think that there is a drastic change in the mental model and it will be difficult to get accustomed to.\n\n## **Conclusion**\n\nI think that with RSC(React Server Components) coming in, we are already moving more toward the server. The React team feels that for new devs coming in, the server is the best place to start instead of the client. And I am up for it.', "src/content/blogs/my-first-blog.md", [214, 215, 216, 217, 218, 219, 220, 221, 222, 223], "../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-1.webp", "../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-2.webp", "../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-3.webp", "../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-4.webp", "../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-5.webp", "../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-7.webp", "../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-8.webp", "../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-9.webp", "../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-10.webp", "../../icons/cover-1.svg", "254e5f53c7fa4cf3", { html: 226, metadata: 227 }, `<h2 id="introduction"><strong>Introduction</strong></h2>
<p>Recently I gave a talk on how things are changing around the web ecosystem, especially with React. I also explored how we can adopt better practices with writing forms.</p>
<p>Personally, I have been using Remix in one of the open-source products I have been working on with some talented folks at RealDevSquad. I have been loving the Remix approach with forms and what they have brought in with the <a href="https://remix.run/docs/en/main/route/loader"><strong>loaders</strong></a> and <a href="https://remix.run/docs/en/1.15.0/components/form#action"><strong>actions</strong></a><strong>.</strong> It is very intuitive to the way that web was around the time of MPAs (Multi-page apps).</p>
<p>But why did I choose to explore this further?</p>
<p><img __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-1.webp&#x22;,&#x22;alt&#x22;:&#x22;image (1).jpeg&#x22;,&#x22;index&#x22;:0}"></p>
<p>I was browsing Twitter, and I saw this tweet by Dan Abramov. I was working on a Remix app that also recommends uncontrolled forms. It was a topic worth exploring. So I started my voyage to see what is the issue at hand, which approach is better, and why it is better.</p>
<h2 id="tldr"><strong>TLDR</strong></h2>
<h3 id="what-is-remix">What is Remix?</h3>
<p><a href="https://remix.run/">Remix</a>, which is also a React framework, was co-founded by ex-Twitter engineer <strong>Michael Jackson along with Ryan Florence</strong> in 2020. Before this, the two had been working together for years to create open-source tools based on the <a href="https://analyticsindiamag.com/the-javascript-framework-that-solves-the-annoying-feature-speed-paradox/">JavaScript</a> library React that is used to build app UIs.They are also core members of the react-router team.</p>
<h3 id="some-technical-terms">Some Technical Terms</h3>
<ol>
<li>
<p>MPA</p>
<p><strong>A Multi-Page Application (MPA)</strong> is a website consisting of multiple HTML pages, mostly rendered on a server. When you navigate to a new page, your browser requests a new page of HTML from the server.</p>
</li>
<li>
<p>SPA</p>
<p><strong>A Single-Page Application (SPA)</strong> is a website consisting of a single JavaScript application that loads in the user\u2019s browser and then renders HTML locally. SPAs may <em>also</em> generate HTML on the server, but SPAs are unique in their ability to run your website as a JavaScript application in the browser to render a new page of HTML when you navigate. <a href="https://geekyants.com/hire-next-js-developers/">Next.js</a>, Nuxt.js, SvelteKit, Remix, Gatsby, and Create React App are all examples of SPA frameworks.</p>
</li>
<li>
<p>PESPA</p>
<p>A <strong>PESPA (Progressively enhanced Single Page App)</strong> is a term coined by <strong><em>Kent C. Dodds</em></strong> in one of his blogs called <a href="https://www.epicweb.dev/the-webs-next-transition">the webs next transition</a>, where he describes a PESPA as a mix of both SPA and the MPA world which brings the best of both worlds to improve UX and DX.</p>
<h3 id="we-have-divided-this-blog-into-three-parts-in-the-same-way">We have divided this blog into three parts in the same way:</h3>
<ol>
<li><em>MPA</em></li>
<li><em>SPA</em></li>
<li><em>PESPA</em></li>
</ol>
</li>
</ol>
<h2 id="what-are-we-going-to-cover-in-this-blog"><strong>What are We Going to Cover in This Blog?</strong></h2>
<p>Forms have existed from the time the web has existed. Over this period, we have come to write forms in multiple ways. There were a lot of things about forms that evolved with time as well, in terms of both DX (developer experience) and <a href="https://geekyants.com/ui-ux-design-services/">UX (user experience)</a>. For users, it was validations of the fields, clicking on focus etc. For developers, it was how easy it is to write cumbersome validations and where they should be maintaining state etc. This blog covers how we evolved w.r.t to writing and viewing forms and how Remix might be changing the way we write forms going forward.</p>
<h2 id="what-are-forms"><strong>What are Forms?</strong></h2>
<blockquote>
<p><strong><em>Forms are a navigation event -</em></strong> <a href="https://reactresources.com/people/ryan-florence"><strong><em>Ryan Florence</em></strong></a></p>
</blockquote>
<p>If you take a closer look at forms, they are similar to anchor tags. The only difference between the form and the anchor tag is that with the form, we can send some data to the server, whereas an anchor tag just does redirection/navigation for us.</p>
<h2 id="how-did-forms-work-in-the-past"><strong>How Did Forms Work in the Past?</strong></h2>
<p>If you see at the inception of the web when everything just happened on the server and we used to get pre-rendered HTML from the server, a form would look something like this.</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="html"><code><span class="line"><span style="color:#E1E4E8">&#x3C;</span><span style="color:#85E89D">form</span><span style="color:#B392F0"> action</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"http://localhost:4130/posts"</span><span style="color:#B392F0"> method</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"POST"</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">  &#x3C;</span><span style="color:#85E89D">div</span><span style="color:#B392F0"> class</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"flex flex-col"</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">    &#x3C;</span><span style="color:#85E89D">input</span><span style="color:#B392F0"> type</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"hidden"</span><span style="color:#B392F0"> name</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"intent"</span><span style="color:#B392F0"> value</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"createPost"</span><span style="color:#E1E4E8"> /></span></span>
<span class="line"><span style="color:#E1E4E8">    &#x3C;</span><span style="color:#85E89D">label</span><span style="color:#B392F0"> for</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"input-1"</span><span style="color:#E1E4E8">>&#x3C;</span><span style="color:#85E89D">h3</span><span style="color:#E1E4E8">>title&#x3C;/</span><span style="color:#85E89D">h3</span><span style="color:#E1E4E8">>&#x3C;/</span><span style="color:#85E89D">label</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">    &#x3C;</span><span style="color:#85E89D">input</span></span>
<span class="line"><span style="color:#B392F0">      type</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"text"</span></span>
<span class="line"><span style="color:#B392F0">      id</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"input-1"</span></span>
<span class="line"><span style="color:#B392F0">      name</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"title"</span></span>
<span class="line"><span style="color:#B392F0">      placeholder</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"title"</span></span>
<span class="line"><span style="color:#B392F0">      class</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"w-100"</span></span>
<span class="line"><span style="color:#E1E4E8">    /></span></span>
<span class="line"><span style="color:#E1E4E8">    &#x3C;</span><span style="color:#85E89D">label</span><span style="color:#B392F0"> for</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"input-2"</span><span style="color:#E1E4E8">>&#x3C;</span><span style="color:#85E89D">h3</span><span style="color:#E1E4E8">>description&#x3C;/</span><span style="color:#85E89D">h3</span><span style="color:#E1E4E8">>&#x3C;/</span><span style="color:#85E89D">label</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">    &#x3C;</span><span style="color:#85E89D">input</span><span style="color:#B392F0"> type</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"text"</span><span style="color:#B392F0"> id</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"input-2"</span><span style="color:#B392F0"> name</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"description"</span><span style="color:#B392F0"> class</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"w-100"</span><span style="color:#E1E4E8"> /></span></span>
<span class="line"><span style="color:#E1E4E8">    &#x3C;</span><span style="color:#85E89D">label</span><span style="color:#B392F0"> for</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"input-3"</span><span style="color:#E1E4E8">>&#x3C;</span><span style="color:#85E89D">h3</span><span style="color:#E1E4E8">>content&#x3C;/</span><span style="color:#85E89D">h3</span><span style="color:#E1E4E8">>&#x3C;/</span><span style="color:#85E89D">label</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">    &#x3C;</span><span style="color:#85E89D">textarea</span></span>
<span class="line"><span style="color:#B392F0">      name</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"content"</span></span>
<span class="line"><span style="color:#B392F0">      id</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"input-3"</span></span>
<span class="line"><span style="color:#B392F0">      cols</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"30"</span></span>
<span class="line"><span style="color:#B392F0">      rows</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"10"</span></span>
<span class="line"><span style="color:#B392F0">      name</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"content"</span></span>
<span class="line"><span style="color:#E1E4E8">    >&#x3C;/</span><span style="color:#85E89D">textarea</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">  &#x3C;/</span><span style="color:#85E89D">div</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">  &#x3C;</span><span style="color:#85E89D">div</span><span style="color:#B392F0"> class</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"flex justify-end"</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">    &#x3C;</span><span style="color:#85E89D">input</span><span style="color:#B392F0"> type</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"submit"</span><span style="color:#B392F0"> value</span><span style="color:#E1E4E8">=</span><span style="color:#9ECBFF">"Submit"</span><span style="color:#E1E4E8"> /></span></span>
<span class="line"><span style="color:#E1E4E8">  &#x3C;/</span><span style="color:#85E89D">div</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">&#x3C;/</span><span style="color:#85E89D">form</span><span style="color:#E1E4E8">></span></span></code></pre>
<p>This is a very simple implementation of a form, no JavaScript. I could just link this HTML page with some CSS if I want to correspond to the class names, but that is it, I would not require much configuration. Once I make the <code>POST</code> request, I can expect the server to get the data from the database and return the data with a redirect response to the client. We can expect the responses to be in this order:</p>
<ul>
<li><code>POST</code> request triggers a redirect response from the server.</li>
<li><code>redirect</code> causes the client to refresh and get the data from the server.</li>
</ul>
<p><img __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-2.webp&#x22;,&#x22;alt&#x22;:&#x22;Screenshot 2023-06-14 at 12.04.18 PM.png&#x22;,&#x22;index&#x22;:0}"></p>
<p><img __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-3.webp&#x22;,&#x22;alt&#x22;:&#x22;image (18).png&#x22;,&#x22;index&#x22;:0}"></p>
<p><a href="https://www.epicweb.dev/the-webs-next-transition"><strong>Source (article by Kent C.Dodds)</strong></a>\uFEFF</p>
<p>You can refer to the code <a href="https://github.com/isVivek99/forms-framework-Debate/tree/master/01-mpa"><strong>here</strong></a>.</p>
<h3 id="pros-of-the-approach"><strong>Pros of the Approach</strong></h3>
<ol>
<li>We have a simple mental model.</li>
<li>We do not need to lot of code to write a simple form.</li>
<li>We can add built-in HTML validations.</li>
<li>We can expect the browser the create and send the payload over the wire to the server when we click on submit.</li>
</ol>
<h3 id="cons-of-the-approach"><strong>Cons of the Approach</strong></h3>
<ol>
<li>We cannot have custom error validations.</li>
<li>Full page refresh is triggered on every post request.</li>
<li>We cannot have an optimistic UI, although we can show pending UI with CSS, but we can face some limitations.</li>
</ol>
<h2 id="how-did-forms-look-during-the-spa-era"><strong>How Did Forms Look During the SPA Era?</strong></h2>
<p>We could have a debate based on the fact alone that we are past the SPA phase. I think that this would need context, and I think we are in a transition phase with different frameworks around. But I assume there is a common consensus that there was a period when we used SPAs heavily, so considering that, we are going to look at React and how we handle forms in React.</p>
<p>With React, we can get the state, which we can use for controlling input fields, we can easily show optimistic UI or a pending UI and we can also prevent whole page re-renders because we can use JavaScript to append data to the state.</p>
<p>A form in React would look like this.</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="typescript"><code><span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> React </span><span style="color:#F97583">from</span><span style="color:#9ECBFF"> "react"</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">import</span><span style="color:#E1E4E8"> { useForm, Resolver } </span><span style="color:#F97583">from</span><span style="color:#9ECBFF"> "react-hook-form"</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">import</span><span style="color:#9ECBFF"> "./blog.css"</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">type</span><span style="color:#B392F0"> Post</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> { </span><span style="color:#FFAB70">id</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> string</span><span style="color:#E1E4E8">; </span><span style="color:#FFAB70">title</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> string</span><span style="color:#E1E4E8">; </span><span style="color:#FFAB70">desc</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> string</span><span style="color:#E1E4E8">; </span><span style="color:#FFAB70">content</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> string</span><span style="color:#E1E4E8"> };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">type</span><span style="color:#B392F0"> FormValues</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#FFAB70">  title</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> string</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#FFAB70">  desc</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> string</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#FFAB70">  content</span><span style="color:#F97583">:</span><span style="color:#79B8FF"> string</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">};</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">const</span><span style="color:#B392F0"> resolver</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Resolver</span><span style="color:#E1E4E8">&#x3C;</span><span style="color:#B392F0">FormValues</span><span style="color:#E1E4E8">> </span><span style="color:#F97583">=</span><span style="color:#F97583"> async</span><span style="color:#E1E4E8"> (</span><span style="color:#FFAB70">values</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">=></span><span style="color:#E1E4E8"> {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">  return</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">    values: values.title </span><span style="color:#F97583">?</span><span style="color:#E1E4E8"> values </span><span style="color:#F97583">:</span><span style="color:#E1E4E8"> {},</span></span>
<span class="line"><span style="color:#E1E4E8">    errors: </span><span style="color:#F97583">!</span><span style="color:#E1E4E8">values.title</span></span>
<span class="line"><span style="color:#F97583">      ?</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">          title: {</span></span>
<span class="line"><span style="color:#E1E4E8">            type: </span><span style="color:#9ECBFF">"required"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">            message: </span><span style="color:#9ECBFF">"This is required."</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">          },</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#F97583">      :</span><span style="color:#F97583"> !</span><span style="color:#E1E4E8">values.desc</span></span>
<span class="line"><span style="color:#F97583">      ?</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">          desc: {</span></span>
<span class="line"><span style="color:#E1E4E8">            type: </span><span style="color:#9ECBFF">"required"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">            message: </span><span style="color:#9ECBFF">"This is required."</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">          },</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#F97583">      :</span><span style="color:#F97583"> !</span><span style="color:#E1E4E8">values.content</span></span>
<span class="line"><span style="color:#F97583">      ?</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">          content: {</span></span>
<span class="line"><span style="color:#E1E4E8">            type: </span><span style="color:#9ECBFF">"required"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">            message: </span><span style="color:#9ECBFF">"This is required."</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">          },</span></span>
<span class="line"><span style="color:#E1E4E8">        }</span></span>
<span class="line"><span style="color:#F97583">      :</span><span style="color:#E1E4E8"> {},</span></span>
<span class="line"><span style="color:#E1E4E8">  };</span></span>
<span class="line"><span style="color:#E1E4E8">};</span></span>
<span class="line"><span style="color:#F97583">let</span><span style="color:#E1E4E8"> renderCount </span><span style="color:#F97583">=</span><span style="color:#79B8FF"> 0</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#F97583">const</span><span style="color:#B392F0"> Posts</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> () </span><span style="color:#F97583">=></span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#F97583">  const</span><span style="color:#E1E4E8"> [</span><span style="color:#79B8FF">posts</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">setPosts</span><span style="color:#E1E4E8">] </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> React.</span><span style="color:#B392F0">useState</span><span style="color:#E1E4E8">&#x3C;</span><span style="color:#B392F0">Array</span><span style="color:#E1E4E8">&#x3C;</span><span style="color:#B392F0">Post</span><span style="color:#E1E4E8">>>([]);</span></span>
<span class="line"><span style="color:#F97583">  const</span><span style="color:#E1E4E8"> [</span><span style="color:#79B8FF">statuses</span><span style="color:#E1E4E8">, </span><span style="color:#79B8FF">setStatuses</span><span style="color:#E1E4E8">] </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> React.</span><span style="color:#B392F0">useState</span><span style="color:#E1E4E8">&#x3C;{</span></span>
<span class="line"><span style="color:#FFAB70">    loadingPosts</span><span style="color:#F97583">:</span><span style="color:#9ECBFF"> "idle"</span><span style="color:#F97583"> |</span><span style="color:#9ECBFF"> "loading"</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#FFAB70">    creatingPost</span><span style="color:#F97583">:</span><span style="color:#9ECBFF"> "idle"</span><span style="color:#F97583"> |</span><span style="color:#9ECBFF"> "loading"</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">  }>({</span></span>
<span class="line"><span style="color:#E1E4E8">    loadingPosts: </span><span style="color:#9ECBFF">"loading"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">    creatingPost: </span><span style="color:#9ECBFF">"idle"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">  });</span></span>
<span class="line"><span style="color:#F97583">  const</span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#79B8FF">    register</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#79B8FF">    handleSubmit</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#FFAB70">    formState</span><span style="color:#E1E4E8">: { </span><span style="color:#79B8FF">errors</span><span style="color:#E1E4E8"> },</span></span>
<span class="line"><span style="color:#E1E4E8">  } </span><span style="color:#F97583">=</span><span style="color:#B392F0"> useForm</span><span style="color:#E1E4E8">({ resolver });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8">  renderCount</span><span style="color:#F97583">++</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">  // initial load of posts</span></span>
<span class="line"><span style="color:#E1E4E8">  React.</span><span style="color:#B392F0">useEffect</span><span style="color:#E1E4E8">(() </span><span style="color:#F97583">=></span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">    fetch</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">"http://localhost:4131/api/posts"</span><span style="color:#E1E4E8">)</span></span>
<span class="line"><span style="color:#E1E4E8">      .</span><span style="color:#B392F0">then</span><span style="color:#E1E4E8">((</span><span style="color:#FFAB70">res</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">=></span><span style="color:#E1E4E8"> res.</span><span style="color:#B392F0">json</span><span style="color:#E1E4E8">())</span></span>
<span class="line"><span style="color:#E1E4E8">      .</span><span style="color:#B392F0">then</span><span style="color:#E1E4E8">(({ </span><span style="color:#FFAB70">posts</span><span style="color:#E1E4E8"> }) </span><span style="color:#F97583">=></span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">        setPosts</span><span style="color:#E1E4E8">(posts);</span></span>
<span class="line"><span style="color:#B392F0">        setStatuses</span><span style="color:#E1E4E8">((</span><span style="color:#FFAB70">old</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">=></span><span style="color:#E1E4E8"> ({ </span><span style="color:#F97583">...</span><span style="color:#E1E4E8">old, loadingTodos: </span><span style="color:#9ECBFF">"idle"</span><span style="color:#E1E4E8"> }));</span></span>
<span class="line"><span style="color:#E1E4E8">      });</span></span>
<span class="line"><span style="color:#E1E4E8">  }, []);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">  return</span><span style="color:#E1E4E8"> (</span></span>
<span class="line"><span style="color:#F97583">    &#x3C;</span><span style="color:#E1E4E8">div className</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">' m-auto'</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#FFAB70">      renderCount</span><span style="color:#F97583">:</span><span style="color:#E1E4E8">{</span><span style="color:#FFAB70">renderCount</span><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#F97583">      &#x3C;</span><span style="color:#E1E4E8">div className</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">'flex'</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">        &#x3C;</span><span style="color:#E1E4E8">div className</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">'flex-basis-1-3'</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">          &#x3C;</span><span style="color:#E1E4E8">ul hidden</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">{!posts.length}</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#E1E4E8">            {</span><span style="color:#FFAB70">posts</span><span style="color:#E1E4E8">.</span><span style="color:#FFAB70">map</span><span style="color:#E1E4E8">((</span><span style="color:#FFAB70">post</span><span style="color:#E1E4E8">, </span><span style="color:#FFAB70">i</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">=></span><span style="color:#E1E4E8"> (</span></span>
<span class="line"><span style="color:#F97583">              &#x3C;</span><span style="color:#E1E4E8">li key</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">{i}</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">                &#x3C;</span><span style="color:#E1E4E8">p className</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">'bold my-1'</span><span style="color:#F97583">></span><span style="color:#E1E4E8">{post.title}</span><span style="color:#F97583">&#x3C;/</span><span style="color:#E1E4E8">p</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">                &#x3C;</span><span style="color:#E1E4E8">p className</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">'bold my-1'</span><span style="color:#F97583">></span><span style="color:#E1E4E8">{post.desc}</span><span style="color:#F97583">&#x3C;/</span><span style="color:#E1E4E8">p</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">              &#x3C;/</span><span style="color:#E1E4E8">li</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#E1E4E8">            ))}</span></span>
<span class="line"><span style="color:#F97583">          &#x3C;/</span><span style="color:#E1E4E8">ul</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">        &#x3C;/</span><span style="color:#E1E4E8">div</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">        &#x3C;</span><span style="color:#E1E4E8">div className</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">'border-r-2 px-2 mx-2'</span><span style="color:#F97583">></span><span style="color:#E1E4E8">&#x3C;/</span><span style="color:#B392F0">div</span><span style="color:#E1E4E8">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">        &#x3C;</span><span style="color:#E1E4E8">div className</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">'flex-basis-2-3'</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">          &#x3C;</span><span style="color:#E1E4E8">div className</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">'border-b-2 border-color-brown'</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#E1E4E8">            &#x3C;</span><span style="color:#B392F0">h1</span><span style="color:#E1E4E8">>My Blog</span><span style="color:#F97583">&#x3C;/</span><span style="color:#E1E4E8">h1</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">          &#x3C;/</span><span style="color:#E1E4E8">div</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">          &#x3C;</span><span style="color:#FFAB70">form</span></span>
<span class="line"><span style="color:#E1E4E8">            onSubmit</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">{</span><span style="color:#B392F0">handleSubmit</span><span style="color:#E1E4E8">((</span><span style="color:#FFAB70">data</span><span style="color:#E1E4E8">, </span><span style="color:#FFAB70">e</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">=></span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">              const</span><span style="color:#E1E4E8"> { </span><span style="color:#FFAB70">title</span><span style="color:#E1E4E8">, </span><span style="color:#FFAB70">desc</span><span style="color:#E1E4E8">, </span><span style="color:#FFAB70">content</span><span style="color:#E1E4E8"> } = </span><span style="color:#FFAB70">data</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#B392F0">              e</span><span style="color:#E1E4E8">?.</span><span style="color:#B392F0">target</span><span style="color:#E1E4E8">.</span><span style="color:#B392F0">reset</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">              setPosts</span><span style="color:#E1E4E8">([</span></span>
<span class="line"><span style="color:#F97583">                ...</span><span style="color:#FFAB70">posts</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">                { </span><span style="color:#FFAB70">title</span><span style="color:#E1E4E8">, </span><span style="color:#FFAB70">desc</span><span style="color:#E1E4E8">, </span><span style="color:#FFAB70">content</span><span style="color:#E1E4E8">, </span><span style="color:#FFAB70">id</span><span style="color:#E1E4E8">: </span><span style="color:#FFAB70">Math</span><span style="color:#E1E4E8">.</span><span style="color:#FFAB70">random</span><span style="color:#E1E4E8">().</span><span style="color:#FFAB70">toFixed</span><span style="color:#E1E4E8">(</span><span style="color:#79B8FF">2</span><span style="color:#E1E4E8">) },</span></span>
<span class="line"><span style="color:#E1E4E8">              ]);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">              setStatuses</span><span style="color:#E1E4E8">((</span><span style="color:#FFAB70">old</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">=></span><span style="color:#E1E4E8"> ({ </span><span style="color:#F97583">...</span><span style="color:#B392F0">old</span><span style="color:#E1E4E8">, </span><span style="color:#FFAB70">creatingPost</span><span style="color:#F97583">:</span><span style="color:#9ECBFF"> "loading"</span><span style="color:#E1E4E8"> }));</span></span>
<span class="line"><span style="color:#B392F0">              fetch</span><span style="color:#E1E4E8">(</span><span style="color:#9ECBFF">\`http://localhost:4131/api/posts\`</span><span style="color:#E1E4E8">, {</span></span>
<span class="line"><span style="color:#FFAB70">                method</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"POST"</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#FFAB70">                headers</span><span style="color:#E1E4E8">: { </span><span style="color:#9ECBFF">"Content-Type"</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"application/json"</span><span style="color:#E1E4E8"> },</span></span>
<span class="line"><span style="color:#FFAB70">                body</span><span style="color:#E1E4E8">: </span><span style="color:#FFAB70">JSON</span><span style="color:#E1E4E8">.</span><span style="color:#FFAB70">stringify</span><span style="color:#E1E4E8">({ title, desc, content }),</span></span>
<span class="line"><span style="color:#E1E4E8">              })</span></span>
<span class="line"><span style="color:#E1E4E8">                .</span><span style="color:#B392F0">then</span><span style="color:#E1E4E8">((</span><span style="color:#FFAB70">res</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">=></span><span style="color:#B392F0"> res</span><span style="color:#E1E4E8">.</span><span style="color:#B392F0">json</span><span style="color:#E1E4E8">())</span></span>
<span class="line"><span style="color:#E1E4E8">                .</span><span style="color:#B392F0">then</span><span style="color:#E1E4E8">((</span><span style="color:#FFAB70">data</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">=></span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">                  setPosts</span><span style="color:#E1E4E8">((</span><span style="color:#FFAB70">prev</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">=></span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#B392F0">                    prev</span><span style="color:#E1E4E8">[prev.</span><span style="color:#79B8FF">length</span><span style="color:#F97583"> -</span><span style="color:#79B8FF"> 1</span><span style="color:#E1E4E8">] </span><span style="color:#F97583">=</span><span style="color:#E1E4E8"> data.post;</span></span>
<span class="line"><span style="color:#B392F0">                    console</span><span style="color:#E1E4E8">.</span><span style="color:#B392F0">log</span><span style="color:#E1E4E8">(</span><span style="color:#B392F0">posts</span><span style="color:#E1E4E8">);</span></span>
<span class="line"><span style="color:#B392F0">                    return</span><span style="color:#FFAB70"> prev</span><span style="color:#E1E4E8">;</span></span>
<span class="line"><span style="color:#E1E4E8">                  });</span></span>
<span class="line"></span>
<span class="line"><span style="color:#B392F0">                  setStatuses</span><span style="color:#E1E4E8">((</span><span style="color:#FFAB70">old</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">=></span><span style="color:#E1E4E8"> ({ </span><span style="color:#F97583">...</span><span style="color:#B392F0">old</span><span style="color:#E1E4E8">, </span><span style="color:#FFAB70">creatingPost</span><span style="color:#F97583">:</span><span style="color:#9ECBFF"> "idle"</span><span style="color:#E1E4E8"> }));</span></span>
<span class="line"><span style="color:#E1E4E8">                });</span></span>
<span class="line"><span style="color:#E1E4E8">            })}</span></span>
<span class="line"><span style="color:#F97583">          ></span></span>
<span class="line"><span style="color:#F97583">            &#x3C;</span><span style="color:#E1E4E8">div className</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">'flex flex-col'</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">              &#x3C;</span><span style="color:#E1E4E8">label htmlFor</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">'input-1'</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#E1E4E8">                &#x3C;</span><span style="color:#B392F0">h3</span><span style="color:#E1E4E8">>title</span><span style="color:#F97583">&#x3C;/</span><span style="color:#E1E4E8">h3</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">              &#x3C;/</span><span style="color:#E1E4E8">label</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">              &#x3C;</span><span style="color:#FFAB70">input</span></span>
<span class="line"><span style="color:#E1E4E8">                id</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">'input-1'</span></span>
<span class="line"><span style="color:#E1E4E8">                className</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">{</span><span style="color:#9ECBFF">\`w-100 \${</span></span>
<span class="line"><span style="color:#E1E4E8">                  errors</span><span style="color:#9ECBFF">.</span><span style="color:#E1E4E8">title</span><span style="color:#9ECBFF">?.</span><span style="color:#E1E4E8">message</span><span style="color:#F97583"> ?</span><span style="color:#9ECBFF"> "input-error"</span><span style="color:#F97583"> :</span><span style="color:#9ECBFF"> ""</span></span>
<span class="line"><span style="color:#9ECBFF">                }\`</span><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#E1E4E8">                data</span><span style="color:#F97583">-</span><span style="color:#E1E4E8">pending</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">{statuses.creatingPost </span><span style="color:#F97583">===</span><span style="color:#9ECBFF"> "loading"</span><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#E1E4E8">                {</span><span style="color:#F97583">...</span><span style="color:#FFAB70">register</span><span style="color:#E1E4E8">("</span><span style="color:#FFAB70">title</span><span style="color:#E1E4E8">", { </span><span style="color:#FFAB70">required</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"this field is required."</span><span style="color:#E1E4E8"> })}</span></span>
<span class="line"><span style="color:#F97583">              /></span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">              &#x3C;</span><span style="color:#E1E4E8">p className</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">'error'</span><span style="color:#F97583">></span><span style="color:#E1E4E8">{errors.title?.message}</span><span style="color:#F97583">&#x3C;/</span><span style="color:#E1E4E8">p</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">              &#x3C;</span><span style="color:#E1E4E8">label htmlFor</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">'input-2'</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#E1E4E8">                &#x3C;</span><span style="color:#B392F0">h3</span><span style="color:#E1E4E8">>desc</span><span style="color:#F97583">&#x3C;/</span><span style="color:#E1E4E8">h3</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">              &#x3C;/</span><span style="color:#E1E4E8">label</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">              &#x3C;</span><span style="color:#FFAB70">input</span></span>
<span class="line"><span style="color:#E1E4E8">                id</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">'input-2'</span></span>
<span class="line"><span style="color:#E1E4E8">                className</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">{</span><span style="color:#9ECBFF">\`w-100 \${</span><span style="color:#E1E4E8">errors</span><span style="color:#9ECBFF">.</span><span style="color:#E1E4E8">desc</span><span style="color:#9ECBFF">?.</span><span style="color:#E1E4E8">message</span><span style="color:#F97583"> ?</span><span style="color:#9ECBFF"> "input-error"</span><span style="color:#F97583"> :</span><span style="color:#9ECBFF"> ""}\`</span><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#E1E4E8">                data</span><span style="color:#F97583">-</span><span style="color:#E1E4E8">pending</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">{statuses.creatingPost </span><span style="color:#F97583">===</span><span style="color:#9ECBFF"> "loading"</span><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#E1E4E8">                {</span><span style="color:#F97583">...</span><span style="color:#FFAB70">register</span><span style="color:#E1E4E8">("</span><span style="color:#FFAB70">desc</span><span style="color:#E1E4E8">", {</span></span>
<span class="line"><span style="color:#FFAB70">                  required</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"this field is required."</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">                })}</span></span>
<span class="line"><span style="color:#F97583">              /></span></span>
<span class="line"><span style="color:#F97583">              &#x3C;</span><span style="color:#E1E4E8">p className</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">'error'</span><span style="color:#F97583">></span><span style="color:#E1E4E8">{errors.desc?.message}</span><span style="color:#F97583">&#x3C;/</span><span style="color:#E1E4E8">p</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">              &#x3C;</span><span style="color:#E1E4E8">label htmlFor</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">'input-3'</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#E1E4E8">                &#x3C;</span><span style="color:#B392F0">h3</span><span style="color:#E1E4E8">>content</span><span style="color:#F97583">&#x3C;/</span><span style="color:#E1E4E8">h3</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">              &#x3C;/</span><span style="color:#E1E4E8">label</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">              &#x3C;</span><span style="color:#FFAB70">textarea</span></span>
<span class="line"><span style="color:#E1E4E8">                id</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">'input-3'</span></span>
<span class="line"><span style="color:#E1E4E8">                cols</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">{</span><span style="color:#79B8FF">30</span><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#E1E4E8">                rows</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">{</span><span style="color:#79B8FF">10</span><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#E1E4E8">                className</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">{</span><span style="color:#9ECBFF">\`w-100 \${</span></span>
<span class="line"><span style="color:#E1E4E8">                  errors</span><span style="color:#9ECBFF">.</span><span style="color:#E1E4E8">content</span><span style="color:#9ECBFF">?.</span><span style="color:#E1E4E8">message</span><span style="color:#F97583"> ?</span><span style="color:#9ECBFF"> "input-error"</span><span style="color:#F97583"> :</span><span style="color:#9ECBFF"> ""</span></span>
<span class="line"><span style="color:#9ECBFF">                }\`</span><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#E1E4E8">                {</span><span style="color:#F97583">...</span><span style="color:#FFAB70">register</span><span style="color:#E1E4E8">("</span><span style="color:#FFAB70">content</span><span style="color:#E1E4E8">", {</span></span>
<span class="line"><span style="color:#FFAB70">                  required</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"this filed is also required."</span><span style="color:#E1E4E8">,</span></span>
<span class="line"><span style="color:#E1E4E8">                })}</span></span>
<span class="line"><span style="color:#E1E4E8">                data</span><span style="color:#F97583">-</span><span style="color:#E1E4E8">pending</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">{statuses.creatingPost </span><span style="color:#F97583">===</span><span style="color:#9ECBFF"> "loading"</span><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#F97583">              ></span><span style="color:#E1E4E8">&#x3C;/</span><span style="color:#B392F0">textarea</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#F97583">              &#x3C;</span><span style="color:#E1E4E8">p className</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">'error'</span><span style="color:#F97583">></span><span style="color:#E1E4E8">{errors.content?.message}</span><span style="color:#F97583">&#x3C;/</span><span style="color:#E1E4E8">p</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">            &#x3C;/</span><span style="color:#E1E4E8">div</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">            &#x3C;</span><span style="color:#E1E4E8">div className</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">'flex justify-end'</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">              &#x3C;</span><span style="color:#FFAB70">button</span></span>
<span class="line"><span style="color:#E1E4E8">                type</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">'submit'</span></span>
<span class="line"><span style="color:#E1E4E8">                disabled</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">{statuses.creatingPost </span><span style="color:#F97583">===</span><span style="color:#9ECBFF"> "loading"</span><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#F97583">              ></span></span>
<span class="line"><span style="color:#E1E4E8">                create </span><span style="color:#FFAB70">post</span></span>
<span class="line"><span style="color:#F97583">              &#x3C;/</span><span style="color:#E1E4E8">button</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">            &#x3C;/</span><span style="color:#E1E4E8">div</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">          &#x3C;/</span><span style="color:#E1E4E8">form</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">        &#x3C;/</span><span style="color:#E1E4E8">div</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">      &#x3C;/</span><span style="color:#E1E4E8">div</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">    &#x3C;/</span><span style="color:#E1E4E8">div</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#E1E4E8">  );</span></span>
<span class="line"><span style="color:#E1E4E8">};</span></span></code></pre>
<p>You can notice that I am not using any controlled input field. Instead, I am using a library called\xA0<code>react-hook-form</code><strong>,</strong>\xA0which uses refs instead of state, which means we are considerably reducing the re-renders that we would have gotten with using controlled forms.</p>
<p>We can expect the responses to be in this order:</p>
<ul>
<li><code>POST</code> request triggers a status <code>OK</code>, the response from the server.</li>
<li>the received response can be added to the posts list on success. Else we can show an error alert.</li>
</ul>
<p><img __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-4.webp&#x22;,&#x22;alt&#x22;:&#x22;Screenshot 2023-06-14 at 12.04.52 PM.png&#x22;,&#x22;index&#x22;:0}"></p>
<p>This is how the form would work in the case of our SPA.</p>
<p><img __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-5.webp&#x22;,&#x22;alt&#x22;:&#x22;image (19).png&#x22;,&#x22;index&#x22;:0}"></p>
<p>You can refer to the code <a href="../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-6.webp"><strong>here</strong></a><strong>.</strong></p>
<h3 id="pros-of-the-approach-1"><strong>Pros of the Approach</strong></h3>
<ol>
<li>We can add optimistic UI.</li>
<li>We can add pending UI.</li>
<li>We can add built-in HTML validations.</li>
</ol>
<h3 id="cons-of-the-approach-1"><strong>Cons of the Approach</strong></h3>
<ol>
<li>We don\u2019t have a simple mental model.</li>
<li>We have to create a request, prevent the default behavior of the browser and send data to a URL by creating the payload, which the browser can also do, but we hijack it and make it more difficult.</li>
<li>We have to write a lot of code for the form to work (130 lines here).</li>
</ol>
<h2 id="a-better-way-to-write-forms"><strong>A Better Way to Write Forms?</strong></h2>
<p>Till now, we have seen two different ways of writing forms, and both have their pros and cons. But what if I tell you that we can use the pros which we have seen at both places, plus add type safety and server-side validations in case your javascript has not loaded yet on the client? Would you believe me?</p>
<p>Well, that is where Remix mental modal for forms comes into the picture.</p>
<p>With Remix, you have a function that runs on the server for different HTTP calls.</p>
<p><img __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-7.webp&#x22;,&#x22;alt&#x22;:&#x22;image (3).jpeg&#x22;,&#x22;index&#x22;:0}"></p>
<p>This is a\xA0<code>loader</code> function, which runs on the server for every\xA0<code>GET</code>\xA0call.</p>
<p><img __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-8.webp&#x22;,&#x22;alt&#x22;:&#x22;image (4).jpeg&#x22;,&#x22;index&#x22;:0}"></p>
<p>This is an\xA0<code>action</code>\xA0function which runs on the server when we make a\xA0<code>POST/ PUT/ DELETE</code>\xA0call to the server.</p>
<p>This is how the form would look like.</p>
<pre class="astro-code github-dark" style="background-color:#24292e;color:#e1e4e8; overflow-x: auto;" tabindex="0" data-language="typescript"><code><span class="line"><span style="color:#F97583">export</span><span style="color:#F97583"> default</span><span style="color:#F97583"> function</span><span style="color:#B392F0"> Posts</span><span style="color:#E1E4E8">() {</span></span>
<span class="line"><span style="color:#6A737D">  // get data when the loader function runs on the mount of the                 component</span></span>
<span class="line"><span style="color:#F97583">  const</span><span style="color:#79B8FF"> data</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> useLoaderData</span><span style="color:#E1E4E8">() </span><span style="color:#F97583">as</span><span style="color:#E1E4E8"> { </span><span style="color:#FFAB70">posts</span><span style="color:#F97583">:</span><span style="color:#B392F0"> Array</span><span style="color:#E1E4E8">&#x3C;</span><span style="color:#B392F0">Post</span><span style="color:#E1E4E8">> };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D">  // returns errors from the action function when user submits the form</span></span>
<span class="line"><span style="color:#F97583">  const</span><span style="color:#79B8FF"> errors</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> useActionData</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#6A737D">//hook exposed by remix/react to track states of the form i.e. submitting/loading/idle</span></span>
<span class="line"><span style="color:#F97583">  const</span><span style="color:#79B8FF"> transition</span><span style="color:#F97583"> =</span><span style="color:#B392F0"> useTransition</span><span style="color:#E1E4E8">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">  const</span><span style="color:#79B8FF"> text</span><span style="color:#F97583"> =</span></span>
<span class="line"><span style="color:#E1E4E8">    transition.state </span><span style="color:#F97583">===</span><span style="color:#9ECBFF"> "submitting"</span></span>
<span class="line"><span style="color:#F97583">      ?</span><span style="color:#9ECBFF"> "Saving..."</span></span>
<span class="line"><span style="color:#F97583">      :</span><span style="color:#E1E4E8"> transition.state </span><span style="color:#F97583">===</span><span style="color:#9ECBFF"> "loading"</span></span>
<span class="line"><span style="color:#F97583">      ?</span><span style="color:#9ECBFF"> "Saved!"</span></span>
<span class="line"><span style="color:#F97583">      :</span><span style="color:#9ECBFF"> "create post"</span><span style="color:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">  return</span><span style="color:#E1E4E8"> (</span></span>
<span class="line"><span style="color:#F97583">    &#x3C;</span><span style="color:#E1E4E8">div className</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">" m-auto"</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">      &#x3C;</span><span style="color:#E1E4E8">div className</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"flex"</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">        &#x3C;</span><span style="color:#E1E4E8">div className</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"flex-basis-1-3"</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">          &#x3C;</span><span style="color:#E1E4E8">ul hidden</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">{!data.posts.length}</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#E1E4E8">            {</span><span style="color:#FFAB70">data</span><span style="color:#E1E4E8">.</span><span style="color:#FFAB70">posts</span><span style="color:#E1E4E8">.</span><span style="color:#FFAB70">map</span><span style="color:#E1E4E8">((</span><span style="color:#FFAB70">post</span><span style="color:#E1E4E8">, </span><span style="color:#FFAB70">i</span><span style="color:#E1E4E8">) </span><span style="color:#F97583">=></span><span style="color:#E1E4E8"> (</span></span>
<span class="line"><span style="color:#F97583">              &#x3C;</span><span style="color:#E1E4E8">li style</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">{{ </span><span style="color:#B392F0">marginBottom</span><span style="color:#E1E4E8">: </span><span style="color:#9ECBFF">"20px"</span><span style="color:#E1E4E8"> }} key</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">{i}</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">                &#x3C;</span><span style="color:#E1E4E8">p className</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"bold my-1"</span><span style="color:#F97583">></span><span style="color:#E1E4E8">{post.title}</span><span style="color:#F97583">&#x3C;/</span><span style="color:#E1E4E8">p</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">                &#x3C;</span><span style="color:#E1E4E8">p className</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"bold my-1"</span><span style="color:#F97583">></span><span style="color:#E1E4E8">{post.desc}</span><span style="color:#F97583">&#x3C;/</span><span style="color:#E1E4E8">p</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">              &#x3C;/</span><span style="color:#E1E4E8">li</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#E1E4E8">            ))}</span></span>
<span class="line"><span style="color:#F97583">          &#x3C;/</span><span style="color:#E1E4E8">ul</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">        &#x3C;/</span><span style="color:#E1E4E8">div</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">        &#x3C;</span><span style="color:#E1E4E8">div className</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"mx-2 border-r-2 px-2"</span><span style="color:#F97583">></span><span style="color:#E1E4E8">&#x3C;/</span><span style="color:#B392F0">div</span><span style="color:#E1E4E8">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583">        &#x3C;</span><span style="color:#E1E4E8">div className</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"flex-basis-2-3"</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">          &#x3C;</span><span style="color:#E1E4E8">div className</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"border-color-brown border-b-2"</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#E1E4E8">            &#x3C;</span><span style="color:#B392F0">h1</span><span style="color:#E1E4E8">>My Blog</span><span style="color:#F97583">&#x3C;/</span><span style="color:#E1E4E8">h1</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">          &#x3C;/</span><span style="color:#E1E4E8">div</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">          &#x3C;</span><span style="color:#FFAB70">Form</span></span>
<span class="line"><span style="color:#E1E4E8">            method</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"post"</span></span>
<span class="line"><span style="color:#E1E4E8">            onSubmit</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">{(event) => {</span></span>
<span class="line"><span style="color:#F97583">              const</span><span style="color:#79B8FF"> form</span><span style="color:#F97583"> =</span><span style="color:#E1E4E8"> event.currentTarget;</span></span>
<span class="line"><span style="color:#B392F0">              requestAnimationFrame</span><span style="color:#E1E4E8">(() </span><span style="color:#F97583">=></span><span style="color:#E1E4E8"> {</span></span>
<span class="line"><span style="color:#E1E4E8">                form.</span><span style="color:#B392F0">reset</span><span style="color:#E1E4E8">();</span></span>
<span class="line"><span style="color:#E1E4E8">              });</span></span>
<span class="line"><span style="color:#E1E4E8">            }}</span></span>
<span class="line"><span style="color:#F97583">          ></span></span>
<span class="line"><span style="color:#F97583">            &#x3C;</span><span style="color:#E1E4E8">div className</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"flex flex-col"</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">              &#x3C;</span><span style="color:#E1E4E8">label htmlFor</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"input-1"</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#E1E4E8">                &#x3C;</span><span style="color:#B392F0">h3</span><span style="color:#E1E4E8">>title</span><span style="color:#F97583">&#x3C;/</span><span style="color:#E1E4E8">h3</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">              &#x3C;/</span><span style="color:#E1E4E8">label</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">              &#x3C;</span><span style="color:#FFAB70">input</span></span>
<span class="line"><span style="color:#E1E4E8">                type</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"text"</span></span>
<span class="line"><span style="color:#E1E4E8">                id</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"input-1"</span></span>
<span class="line"><span style="color:#E1E4E8">                className</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"w-100"</span></span>
<span class="line"><span style="color:#FFAB70">                autoFocus</span></span>
<span class="line"><span style="color:#E1E4E8">                data</span><span style="color:#F97583">-</span><span style="color:#E1E4E8">pending</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">{</span></span>
<span class="line"><span style="color:#E1E4E8">                  transition.state </span><span style="color:#F97583">===</span><span style="color:#9ECBFF"> "submitting"</span><span style="color:#F97583"> ||</span></span>
<span class="line"><span style="color:#E1E4E8">                  transition.state </span><span style="color:#F97583">===</span><span style="color:#9ECBFF"> "loading"</span></span>
<span class="line"><span style="color:#E1E4E8">                }</span></span>
<span class="line"><span style="color:#E1E4E8">                name</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"title"</span></span>
<span class="line"><span style="color:#F97583">              /></span></span>
<span class="line"><span style="color:#E1E4E8">              {</span><span style="color:#FFAB70">errors</span><span style="color:#E1E4E8">?.</span><span style="color:#FFAB70">title</span><span style="color:#E1E4E8"> &#x26;&#x26; &#x3C;</span><span style="color:#FFAB70">p</span><span style="color:#FFAB70"> className</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"error"</span><span style="color:#F97583">></span><span style="color:#E1E4E8">{errors.title}</span><span style="color:#F97583">&#x3C;/</span><span style="color:#E1E4E8">p</span><span style="color:#F97583">></span><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#F97583">              &#x3C;</span><span style="color:#E1E4E8">label htmlFor</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"input-2"</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#E1E4E8">                &#x3C;</span><span style="color:#B392F0">h3</span><span style="color:#E1E4E8">>desc</span><span style="color:#F97583">&#x3C;/</span><span style="color:#E1E4E8">h3</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">              &#x3C;/</span><span style="color:#E1E4E8">label</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">              &#x3C;</span><span style="color:#FFAB70">input</span></span>
<span class="line"><span style="color:#E1E4E8">                type</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"text"</span></span>
<span class="line"><span style="color:#E1E4E8">                id</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"input-2"</span></span>
<span class="line"><span style="color:#E1E4E8">                className</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"w-100"</span></span>
<span class="line"><span style="color:#E1E4E8">                name</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"desc"</span></span>
<span class="line"><span style="color:#E1E4E8">                data</span><span style="color:#F97583">-</span><span style="color:#E1E4E8">pending</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">{</span></span>
<span class="line"><span style="color:#E1E4E8">                  transition.state </span><span style="color:#F97583">===</span><span style="color:#9ECBFF"> "submitting"</span><span style="color:#F97583"> ||</span></span>
<span class="line"><span style="color:#E1E4E8">                  transition.state </span><span style="color:#F97583">===</span><span style="color:#9ECBFF"> "loading"</span></span>
<span class="line"><span style="color:#E1E4E8">                }</span></span>
<span class="line"><span style="color:#F97583">              /></span></span>
<span class="line"><span style="color:#E1E4E8">              {</span><span style="color:#FFAB70">errors</span><span style="color:#E1E4E8">?.</span><span style="color:#FFAB70">desc</span><span style="color:#E1E4E8"> &#x26;&#x26; &#x3C;</span><span style="color:#FFAB70">p</span><span style="color:#FFAB70"> className</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"error"</span><span style="color:#F97583">></span><span style="color:#E1E4E8">{errors.desc}</span><span style="color:#F97583">&#x3C;/</span><span style="color:#E1E4E8">p</span><span style="color:#F97583">></span><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#F97583">              &#x3C;</span><span style="color:#E1E4E8">label htmlFor</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"input-3"</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#E1E4E8">                &#x3C;</span><span style="color:#B392F0">h3</span><span style="color:#E1E4E8">>content</span><span style="color:#F97583">&#x3C;/</span><span style="color:#E1E4E8">h3</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">              &#x3C;/</span><span style="color:#E1E4E8">label</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">              &#x3C;</span><span style="color:#FFAB70">textarea</span></span>
<span class="line"><span style="color:#E1E4E8">                id</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"input-3"</span></span>
<span class="line"><span style="color:#E1E4E8">                cols</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">{</span><span style="color:#79B8FF">30</span><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#E1E4E8">                rows</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">{</span><span style="color:#79B8FF">10</span><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#E1E4E8">                name</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"content"</span></span>
<span class="line"><span style="color:#E1E4E8">                data</span><span style="color:#F97583">-</span><span style="color:#E1E4E8">pending</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">{</span></span>
<span class="line"><span style="color:#E1E4E8">                  transition.state </span><span style="color:#F97583">===</span><span style="color:#9ECBFF"> "submitting"</span><span style="color:#F97583"> ||</span></span>
<span class="line"><span style="color:#E1E4E8">                  transition.state </span><span style="color:#F97583">===</span><span style="color:#9ECBFF"> "loading"</span></span>
<span class="line"><span style="color:#E1E4E8">                }</span></span>
<span class="line"><span style="color:#F97583">              ></span><span style="color:#E1E4E8">&#x3C;/</span><span style="color:#B392F0">textarea</span><span style="color:#E1E4E8">></span></span>
<span class="line"><span style="color:#E1E4E8">              {</span><span style="color:#FFAB70">errors</span><span style="color:#E1E4E8">?.</span><span style="color:#FFAB70">content</span><span style="color:#E1E4E8"> &#x26;&#x26; &#x3C;</span><span style="color:#FFAB70">p</span><span style="color:#FFAB70"> className</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"error"</span><span style="color:#F97583">></span><span style="color:#E1E4E8">{errors.content}</span><span style="color:#F97583">&#x3C;/</span><span style="color:#E1E4E8">p</span><span style="color:#F97583">></span><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#F97583">            &#x3C;/</span><span style="color:#E1E4E8">div</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">            &#x3C;</span><span style="color:#E1E4E8">div className</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"flex justify-end"</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">              &#x3C;</span><span style="color:#FFAB70">button</span></span>
<span class="line"><span style="color:#E1E4E8">                type</span><span style="color:#F97583">=</span><span style="color:#9ECBFF">"submit"</span></span>
<span class="line"><span style="color:#E1E4E8">                disabled</span><span style="color:#F97583">=</span><span style="color:#E1E4E8">{</span></span>
<span class="line"><span style="color:#E1E4E8">                  transition.state </span><span style="color:#F97583">===</span><span style="color:#9ECBFF"> "submitting"</span><span style="color:#F97583"> ||</span></span>
<span class="line"><span style="color:#E1E4E8">                  transition.state </span><span style="color:#F97583">===</span><span style="color:#9ECBFF"> "loading"</span></span>
<span class="line"><span style="color:#E1E4E8">                }</span></span>
<span class="line"><span style="color:#F97583">              ></span></span>
<span class="line"><span style="color:#E1E4E8">                {</span><span style="color:#FFAB70">text</span><span style="color:#E1E4E8">}</span></span>
<span class="line"><span style="color:#F97583">              &#x3C;/</span><span style="color:#E1E4E8">button</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">            &#x3C;/</span><span style="color:#E1E4E8">div</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">          &#x3C;/</span><span style="color:#E1E4E8">Form</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">        &#x3C;/</span><span style="color:#E1E4E8">div</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">      &#x3C;/</span><span style="color:#E1E4E8">div</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#F97583">    &#x3C;/</span><span style="color:#E1E4E8">div</span><span style="color:#F97583">></span></span>
<span class="line"><span style="color:#E1E4E8">  );</span></span>
<span class="line"><span style="color:#E1E4E8">}</span></span></code></pre>
<p>This is how you would work with the form:</p>
<ul>
<li>You get the data from the server when the page loads using the\xA0<code>useLoaderData</code>\xA0hook.</li>
<li>You write JSX for your form, and you can use the state from the\xA0<code>useTransition</code>\xA0hook for adding optimistic /pending UI.</li>
<li>Whenever the user fills out the form and clicks on submit, the request is sent to the <code>action</code> function, which runs on the server and can validate the data using native JavasScript APIs.</li>
<li>If the request is successful, you can return a redirect response from the server, which will trigger the <code>useLoaderData</code> hook instead of a full page refresh, and you will get the latest posts from the server, which will be displayed on the screen.</li>
</ul>
<h3 id="response-sequence"><strong>Response Sequence</strong></h3>
<p>This is the way you can expect the order of responses to be when you submit the form.</p>
<ul>
<li>A successful post request triggers a <code>redirect</code> response from the server.</li>
<li>The redirect response triggers a <code>get</code> call on the client.</li>
</ul>
<p><img __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-9.webp&#x22;,&#x22;alt&#x22;:&#x22;Screenshot 2023-06-14 at 12.05.23 PM.png&#x22;,&#x22;index&#x22;:0}"></p>
<p>This is how the form would work in the case of what Kent C. Dodds calls a PESPA (progressively enhanced single-page app).</p>
<p><img __ASTRO_IMAGE_="{&#x22;src&#x22;:&#x22;../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-10.webp&#x22;,&#x22;alt&#x22;:&#x22;image (20).png&#x22;,&#x22;index&#x22;:0}"></p>
<p>You can refer to the code <a href="https://github.com/isVivek99/forms-framework-Debate/tree/master/03-pespa/blog-tutorial/app/routes"><strong>here</strong></a><strong>.</strong></p>
<h3 id="pros-of-this-approach"><strong>Pros of this Approach</strong></h3>
<ol>
<li>We have a SPA with a mental model of an MPA, i.e. old web and new web combined.</li>
<li>We can add optimistic UI.</li>
<li>We can add pending UI.</li>
<li>We can add custom validations on the server as well as on the client by using <code>react-hook-form</code>.</li>
<li>We can see the form is smaller compared to the old react form (100 lines).</li>
</ol>
<h3 id="cons-of-this-approach"><strong>Cons of this Approach</strong></h3>
<ol>
<li>I personally think that there is a drastic change in the mental model and it will be difficult to get accustomed to.</li>
</ol>
<h2 id="conclusion"><strong>Conclusion</strong></h2>
<p>I think that with RSC(React Server Components) coming in, we are already moving more toward the server. The React team feels that for new devs coming in, the server is the best place to start instead of the client. And I am up for it.</p>`, { headings: 228, localImagePaths: 281, remoteImagePaths: 282, frontmatter: 283, imagePaths: 285 }, [229, 232, 235, 238, 241, 244, 247, 250, 253, 256, 259, 262, 264, 266, 269, 272, 275, 278], { depth: 33, slug: 230, text: 231 }, "introduction", "Introduction", { depth: 33, slug: 233, text: 234 }, "tldr", "TLDR", { depth: 37, slug: 236, text: 237 }, "what-is-remix", "What is Remix?", { depth: 37, slug: 239, text: 240 }, "some-technical-terms", "Some Technical Terms", { depth: 37, slug: 242, text: 243 }, "we-have-divided-this-blog-into-three-parts-in-the-same-way", "We have divided this blog into three parts in the same way:", { depth: 33, slug: 245, text: 246 }, "what-are-we-going-to-cover-in-this-blog", "What are We Going to Cover in This Blog?", { depth: 33, slug: 248, text: 249 }, "what-are-forms", "What are Forms?", { depth: 33, slug: 251, text: 252 }, "how-did-forms-work-in-the-past", "How Did Forms Work in the Past?", { depth: 37, slug: 254, text: 255 }, "pros-of-the-approach", "Pros of the Approach", { depth: 37, slug: 257, text: 258 }, "cons-of-the-approach", "Cons of the Approach", { depth: 33, slug: 260, text: 261 }, "how-did-forms-look-during-the-spa-era", "How Did Forms Look During the SPA Era?", { depth: 37, slug: 263, text: 255 }, "pros-of-the-approach-1", { depth: 37, slug: 265, text: 258 }, "cons-of-the-approach-1", { depth: 33, slug: 267, text: 268 }, "a-better-way-to-write-forms", "A Better Way to Write Forms?", { depth: 37, slug: 270, text: 271 }, "response-sequence", "Response Sequence", { depth: 37, slug: 273, text: 274 }, "pros-of-this-approach", "Pros of this Approach", { depth: 37, slug: 276, text: 277 }, "cons-of-this-approach", "Cons of this Approach", { depth: 33, slug: 279, text: 280 }, "conclusion", "Conclusion", [214, 215, 216, 217, 218, 219, 220, 221, 222], [], { title: 206, subheading: 207, slug: 203, publishedAt: 284, readingTimeInMins: 210, cover: 223 }, ["Date", "2023-06-15T00:00:00.000Z"], [214, 215, 216, 217, 218, 219, 220, 221, 222], "my-first-blog.md"];
  }
});

// .wrangler/tmp/pages-ErOWne/chunks/content-assets_kVZB-fS5.mjs
var content_assets_kVZB_fS5_exports = {};
__export(content_assets_kVZB_fS5_exports, {
  default: () => contentAssets
});
function createSvgComponent({ meta, attributes, children }) {
  const Component = createComponent((_, props) => {
    const normalizedProps = normalizeProps2(attributes, props);
    return renderTemplate`<svg${spreadAttributes(normalizedProps)}>${unescapeHTML(children)}</svg>`;
  });
  return Object.assign(Component, meta);
}
function dropAttributes(attributes) {
  for (const attr of ATTRS_TO_DROP) {
    delete attributes[attr];
  }
  return attributes;
}
function normalizeProps2(attributes, props) {
  return dropAttributes({ ...DEFAULT_ATTRS, ...attributes, ...props });
}
var __ASTRO_IMAGE_IMPORT_Z14Uq4B, __ASTRO_IMAGE_IMPORT_2czyfW, __ASTRO_IMAGE_IMPORT_Z2njkvS, __ASTRO_IMAGE_IMPORT_Z1S15tM, __ASTRO_IMAGE_IMPORT_Z1nHPrG, __ASTRO_IMAGE_IMPORT_1Xtos8, __ASTRO_IMAGE_IMPORT_Zo7lnu, __ASTRO_IMAGE_IMPORT_6aSDB, __ASTRO_IMAGE_IMPORT_Z2lPfq1, ATTRS_TO_DROP, DEFAULT_ATTRS, __ASTRO_IMAGE_IMPORT_2oljmB, __ASTRO_IMAGE_IMPORT_Z2q5IxC, __ASTRO_IMAGE_IMPORT_ddEss, __ASTRO_IMAGE_IMPORT_lSR4H, __ASTRO_IMAGE_IMPORT_Dfhic, __ASTRO_IMAGE_IMPORT_1l5ef3, __ASTRO_IMAGE_IMPORT_Z137H1Y, __ASTRO_IMAGE_IMPORT_1w6XWJ, __ASTRO_IMAGE_IMPORT_aqbXV, __ASTRO_IMAGE_IMPORT_Z1qG6HI, __ASTRO_IMAGE_IMPORT_Z1i0T6t, __ASTRO_IMAGE_IMPORT_Z19kGue, __ASTRO_IMAGE_IMPORT_Z10EtRY, __ASTRO_IMAGE_IMPORT_ZQYhgJ, __ASTRO_IMAGE_IMPORT_ZzCR3f, __ASTRO_IMAGE_IMPORT_ZqWEr0, __ASTRO_IMAGE_IMPORT_ZihrOK, __ASTRO_IMAGE_IMPORT_zlmGu, __ASTRO_IMAGE_IMPORT_1e3WdJ, __ASTRO_IMAGE_IMPORT_Z208eja, __ASTRO_IMAGE_IMPORT_11GqMf, __ASTRO_IMAGE_IMPORT_1vYFOl, __ASTRO_IMAGE_IMPORT_21hUQr, __ASTRO_IMAGE_IMPORT_Z1pHfd, contentAssets;
var init_content_assets_kVZB_fS5 = __esm({
  ".wrangler/tmp/pages-ErOWne/chunks/content-assets_kVZB-fS5.mjs"() {
    "use strict";
    init_modules_watch_stub();
    init_server_QlrBW5xk();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    __ASTRO_IMAGE_IMPORT_Z14Uq4B = new Proxy({ "src": "/_astro/img-1.BuHQZ9dy.jpeg", "width": 640, "height": 910, "format": "jpg" }, {
      get(target, name, receiver) {
        if (name === "clone") {
          return structuredClone(target);
        }
        if (name === "fsPath") {
          return "/Users/vivek/Desktop/self/myPortfolio/src/assets/blogs/prototypical-inheritance/img-1.jpeg";
        }
        return target[name];
      }
    });
    __ASTRO_IMAGE_IMPORT_2czyfW = new Proxy({ "src": "/_astro/img-2.BYW8UHPp.png", "width": 1291, "height": 665, "format": "png" }, {
      get(target, name, receiver) {
        if (name === "clone") {
          return structuredClone(target);
        }
        if (name === "fsPath") {
          return "/Users/vivek/Desktop/self/myPortfolio/src/assets/blogs/prototypical-inheritance/img-2.png";
        }
        return target[name];
      }
    });
    __ASTRO_IMAGE_IMPORT_Z2njkvS = new Proxy({ "src": "/_astro/img-3.CD_xLwhH.png", "width": 1297, "height": 651, "format": "png" }, {
      get(target, name, receiver) {
        if (name === "clone") {
          return structuredClone(target);
        }
        if (name === "fsPath") {
          return "/Users/vivek/Desktop/self/myPortfolio/src/assets/blogs/prototypical-inheritance/img-3.png";
        }
        return target[name];
      }
    });
    __ASTRO_IMAGE_IMPORT_Z1S15tM = new Proxy({ "src": "/_astro/img-4.CLFfm2wk.png", "width": 1297, "height": 668, "format": "png" }, {
      get(target, name, receiver) {
        if (name === "clone") {
          return structuredClone(target);
        }
        if (name === "fsPath") {
          return "/Users/vivek/Desktop/self/myPortfolio/src/assets/blogs/prototypical-inheritance/img-4.png";
        }
        return target[name];
      }
    });
    __ASTRO_IMAGE_IMPORT_Z1nHPrG = new Proxy({ "src": "/_astro/img-5.yQM2O3Xv.png", "width": 196, "height": 391, "format": "png" }, {
      get(target, name, receiver) {
        if (name === "clone") {
          return structuredClone(target);
        }
        if (name === "fsPath") {
          return "/Users/vivek/Desktop/self/myPortfolio/src/assets/blogs/prototypical-inheritance/img-5.png";
        }
        return target[name];
      }
    });
    __ASTRO_IMAGE_IMPORT_1Xtos8 = new Proxy({ "src": "/_astro/img-6.CEAa-Ied.gif", "width": 480, "height": 400, "format": "gif" }, {
      get(target, name, receiver) {
        if (name === "clone") {
          return structuredClone(target);
        }
        if (name === "fsPath") {
          return "/Users/vivek/Desktop/self/myPortfolio/src/assets/blogs/prototypical-inheritance/img-6.gif";
        }
        return target[name];
      }
    });
    __ASTRO_IMAGE_IMPORT_Zo7lnu = new Proxy({ "src": "/_astro/img-7.lGnH6BvX.png", "width": 231, "height": 731, "format": "png" }, {
      get(target, name, receiver) {
        if (name === "clone") {
          return structuredClone(target);
        }
        if (name === "fsPath") {
          return "/Users/vivek/Desktop/self/myPortfolio/src/assets/blogs/prototypical-inheritance/img-7.png";
        }
        return target[name];
      }
    });
    __ASTRO_IMAGE_IMPORT_6aSDB = new Proxy({ "src": "/_astro/img-8.CGDQjGyO.png", "width": 1297, "height": 669, "format": "png" }, {
      get(target, name, receiver) {
        if (name === "clone") {
          return structuredClone(target);
        }
        if (name === "fsPath") {
          return "/Users/vivek/Desktop/self/myPortfolio/src/assets/blogs/prototypical-inheritance/img-8.png";
        }
        return target[name];
      }
    });
    __ASTRO_IMAGE_IMPORT_Z2lPfq1 = new Proxy({ "src": "/_astro/img-9.DFrma0PD.webp", "width": 240, "height": 200, "format": "webp" }, {
      get(target, name, receiver) {
        if (name === "clone") {
          return structuredClone(target);
        }
        if (name === "fsPath") {
          return "/Users/vivek/Desktop/self/myPortfolio/src/assets/blogs/prototypical-inheritance/img-9.webp";
        }
        return target[name];
      }
    });
    __name(createSvgComponent, "createSvgComponent");
    ATTRS_TO_DROP = ["xmlns", "xmlns:xlink", "version"];
    DEFAULT_ATTRS = {};
    __name(dropAttributes, "dropAttributes");
    __name(normalizeProps2, "normalizeProps");
    __ASTRO_IMAGE_IMPORT_2oljmB = createSvgComponent({ "meta": { "src": "/_astro/cover-5.Dwz0KzzU.svg", "width": 1200, "height": 600, "format": "svg" }, "attributes": { "width": "1200", "height": "600", "viewBox": "0 0 1200 600" }, "children": '<defs><pattern id="satori_pattern_id_1" x="0" y="0" width="0.08333333333333333" height="0.16666666666666666" patternUnits="objectBoundingBox"><radialGradient id="satori_radial_id_1"><stop offset="0" stop-color="lightgray" /><stop offset="0.02" stop-color="lightgray" /><stop offset="0" stop-color="transparent" /><stop offset="1" stop-color="transparent" /></radialGradient><mask id="satori_mask_id_1"><rect x="0" y="0" width="100" height="100" fill="#fff" /></mask><rect x="0" y="0" width="100" height="100" fill="transparent" /><circle cx="75" cy="75" width="100" height="100" r="106.06601717798213" fill="url(#satori_radial_id_1)" mask="url(#satori_mask_id_1)" /></pattern><pattern id="satori_pattern_id_0" x="0" y="0" width="0.08333333333333333" height="0.16666666666666666" patternUnits="objectBoundingBox"><radialGradient id="satori_radial_id_0"><stop offset="0" stop-color="lightgray" /><stop offset="0.02" stop-color="lightgray" /><stop offset="0" stop-color="transparent" /><stop offset="1" stop-color="transparent" /></radialGradient><mask id="satori_mask_id_0"><rect x="0" y="0" width="100" height="100" fill="#fff" /></mask><rect x="0" y="0" width="100" height="100" fill="transparent" /><circle cx="25" cy="25" width="100" height="100" r="106.06601717798213" fill="url(#satori_radial_id_0)" mask="url(#satori_mask_id_0)" /></pattern></defs><mask id="satori_om-id"><rect x="0" y="0" width="1200" height="600" fill="#fff" /></mask><rect x="0" y="0" width="1200" height="600" fill="white" /><rect x="0" y="0" width="1200" height="600" fill="url(#satori_pattern_id_1)" /><rect x="0" y="0" width="1200" height="600" fill="url(#satori_pattern_id_0)" /><mask id="satori_om-id-0"><rect x="500" y="149" width="200" height="200" fill="#fff" /></mask><clipPath id="satori_cp-id-0-0"><rect x="500" y="149" width="200" height="200" /></clipPath><mask id="satori_om-id-0-0"><rect x="500" y="149" width="200" height="200" fill="#fff" /></mask><image x="500" y="149" width="200" height="200" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABBwAAAQcCAMAAAABRXg3AAAC1lBMVEXw208yMzDz43j8+eOhlUK+r0bv2k7u2U7s104zNDA6OjE0NTDt2E43NzDt2U41NjDn003ey0xMSjTo1E3q1k40NDB+djzVw0o2NjBDQjLk0E03ODDgzUzr107Uwkrq1U48PDHp1U1mYTjjz0zTwUo7OzGAeDxGRTPYxkvdyktdWTfEtEfPvkk9PDFSTzV7dDxeWjfm0k27rEbiz0xAQDKYjUBGRDNLSTRAPzLYxUvGtkjfzEw4ODE5OTFOTDTl0U3cyUujl0JBQDJNSzSJgD5KSDQ9PTF9dTzax0uMgz5PTDTKuUi5qkanm0N6cjs+PjKDej2xo0RgXDd5cjtXUzY/PjLLuknXxUrRv0pJSDOPhj+ypEXk0U1PTTTMu0lEQzO3qEWKgT5oYziGfj1VUTVYVDakl0KPhT9aVzbbyEuDez1YVTaVikBxazqpnUPQv0mEfD2+rkZiXTfKuki1pkWsn0PAsEdpYziWi0CekkFQTjRjXzirnkPOvUm6q0bSwEquoUThzkxbVzZ4cDtgWzdHRjNCQTKvoUSHfj2mmkNsZjnBsUefk0GzpUWpnEPFtUimmUKkmEJrZTmUiUBcWDa4qUW9rka8rUaaj0GilkKRhz+Qhj+Vi0CBeT1RTjVvaTqNhD7hzUyMgj6ek0F3cDtsZzlVUjXWxEqOhD9TUDXHtkjMvEluaDl8dDxzbDqXjEB1bjpUUTWGfT1aVjZWUzWTiT9qZTm0pkWwo0SglEHSwUqSiD+bkEGvokTZx0tZVTabj0GShz9lYDhwajq4qkZFRDPbyUt0bTpfWzeqnUOckUG1p0WFfD1JRzNkXziLgj6om0PJuEh/dzy/sEd1bjvDs0dIRjOsn0SypESIfz6toETNvEl4cTudkUFybDq2qEV7cztjXjhvaTnIuEhyazp2bzttZznCskelmUKCej3Ht0hpZDnBskdnYjhhXTeZjkD9+ur///8nV2MOAAAlAUlEQVR4XuzAgQAAAAACoP1tN1hghEoPgLFTxyYMQgEABQNJkVYIuoC4ioiQxtIldIY0SS3YpNEB3OGPYKm1lVukDjhAIHfdW+CdDgCcvwrAHABzAMwBMAfAHABzAMwBMAfAHABzAMwBMAcAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAcwAwB8AcAHMAzAEwB8AcAHMAzAEwB8AcAHMAzAHAHABzAMwBMAfAHABzAMwBMAfAHABzAMwBMAcAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAcwAwB8AcAHMAzAEwB8AcAHMAzAEwB8AcAHMAzAHAHABzAMwBMAfAHABzAMwBMAfAHABzAMwBMAcAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAzAEwB8AcAHMAzAEwB8AcAHMAzAEwB8AcAHMAzAHAHABzAMwBMAfAHABzAMwBMAfAHABzAMwBMAcAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAzAEwB8AcAHMAzAEwB8AcAHMAzAEwB8AcAHMAzAHAHABzAMwBMAfAHABzAMwBMAfAHABzAMwBMAcAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAzAEwB8AcAHMAzAEwB8AcAHMAzAEwB8AcAHMAMAfAHABzAMwBMAfAHABzAMwBMAfAHABzAMwBMAcAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAzAEwB8AcAHMAzAEwB8AcAHMAzAEwB8AcAHMAMAfAHABzAMwBMAfAHABzAMwBMAfAHABzAMwBMAcAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAzAEwB+CIOQC/OAfAHABzAMwBMAcAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAzAEwB8AcAHMAzAEwB8AcAHMAzAEwB8AcAHMAMAfAHABzAMwBMAfAHABzAMwBMAfAHABzAMwBMAcAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAzAEwB8AcAHMAzAEwB8AcAHMAzAEwB8AcAHMAMAfAHABzAMwBMAfAHABzAMwBMAfAHABzAMwBMAcAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAzAEwB8AcAHMAzAEwB8AcAHMAzAEwB8AcAHMAMAfAHABzAMwBMAfAHABzAMwBMAfAHABzAMwBwBwAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAzAEwB8AcAHMAzAEwB8AcAHMAzAEwB8AcAHMAMAfAHABzAMwBMAfAHABzAMwBMAfAHABzAMwBwBwAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAzAEw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" preserveAspectRatio="none" clip-path="url(#satori_cp-id-0-0)" mask="url(#satori_om-id-0-0)" /><mask id="satori_om-id-1"><rect x="217" y="379" width="767" height="72" fill="#fff" /></mask><mask id="satori_om-id-1-0"><rect x="217" y="379" width="767" height="72" fill="#fff" /></mask><path fill="black" d="M225.7 429.5L219.5 429.5L219.5 400.5L231.0 400.5Q234.3 400.5 236.6 401.7Q239.0 403.0 240.2 405.2Q241.4 407.4 241.4 410.3L241.4 410.3Q241.4 413.2 240.2 415.4Q238.9 417.6 236.6 418.9Q234.2 420.1 230.8 420.1L230.8 420.1L223.5 420.1L223.5 415.2L229.9 415.2Q231.6 415.2 232.8 414.6Q233.9 413.9 234.5 412.8Q235.1 411.7 235.1 410.3L235.1 410.3Q235.1 408.9 234.5 407.8Q233.9 406.7 232.8 406.1Q231.6 405.5 229.8 405.5L229.8 405.5L225.7 405.5L225.7 429.5ZM251.4 429.5L245.3 429.5L245.3 407.7L251.2 407.7L251.2 411.5L251.4 411.5Q252.0 409.5 253.4 408.5Q254.8 407.4 256.7 407.4L256.7 407.4Q257.1 407.4 257.6 407.5Q258.2 407.5 258.6 407.6L258.6 407.6L258.6 413.0Q258.1 412.9 257.4 412.8Q256.6 412.7 256.0 412.7L256.0 412.7Q254.7 412.7 253.6 413.2Q252.6 413.8 252.0 414.8Q251.4 415.9 251.4 417.2L251.4 417.2L251.4 429.5ZM270.5 430.0L270.5 430.0Q267.2 430.0 264.8 428.6Q262.4 427.1 261.1 424.6Q259.8 422.1 259.8 418.7L259.8 418.7Q259.8 415.3 261.1 412.8Q262.4 410.3 264.8 408.9Q267.2 407.4 270.5 407.4L270.5 407.4Q273.8 407.4 276.2 408.9Q278.6 410.3 279.9 412.8Q281.2 415.3 281.2 418.7L281.2 418.7Q281.2 422.1 279.9 424.6Q278.6 427.1 276.2 428.6Q273.8 430.0 270.5 430.0ZM270.5 425.3L270.5 425.3Q272.0 425.3 273.1 424.4Q274.1 423.6 274.6 422.1Q275.1 420.6 275.1 418.7L275.1 418.7Q275.1 416.8 274.6 415.3Q274.1 413.8 273.1 412.9Q272.0 412.1 270.5 412.1L270.5 412.1Q269.0 412.1 268.0 412.9Q267.0 413.8 266.4 415.3Q265.9 416.8 265.9 418.7L265.9 418.7Q265.9 420.6 266.4 422.1Q267.0 423.6 268.0 424.4Q269.0 425.3 270.5 425.3ZM283.7 407.7L296.8 407.7L296.8 412.3L283.7 412.3L283.7 407.7ZM286.6 423.6L286.6 402.5L292.7 402.5L292.7 422.8Q292.7 423.7 293.0 424.1Q293.2 424.6 293.7 424.8Q294.1 425.0 294.7 425.0L294.7 425.0Q295.2 425.0 295.6 424.9Q296.0 424.8 296.2 424.8L296.2 424.8L297.2 429.3Q296.7 429.4 295.9 429.6Q295.1 429.8 293.9 429.8L293.9 429.8Q291.7 429.9 290.1 429.3Q288.4 428.6 287.5 427.2Q286.6 425.8 286.6 423.6L286.6 423.6ZM310.4 430.0L310.4 430.0Q307.1 430.0 304.6 428.6Q302.2 427.1 300.9 424.6Q299.6 422.1 299.6 418.7L299.6 418.7Q299.6 415.3 300.9 412.8Q302.2 410.3 304.6 408.9Q307.1 407.4 310.4 407.4L310.4 407.4Q313.7 407.4 316.1 408.9Q318.5 410.3 319.8 412.8Q321.1 415.3 321.1 418.7L321.1 418.7Q321.1 422.1 319.8 424.6Q318.5 427.1 316.1 428.6Q313.7 430.0 310.4 430.0ZM310.4 425.3L310.4 425.3Q311.9 425.3 312.9 424.4Q313.9 423.6 314.4 422.1Q315.0 420.6 315.0 418.7L315.0 418.7Q315.0 416.8 314.4 415.3Q313.9 413.8 312.9 412.9Q311.9 412.1 310.4 412.1L310.4 412.1Q308.9 412.1 307.8 412.9Q306.8 413.8 306.3 415.3Q305.8 416.8 305.8 418.7L305.8 418.7Q305.8 420.6 306.3 422.1Q306.8 423.6 307.8 424.4Q308.9 425.3 310.4 425.3ZM323.5 407.7L336.7 407.7L336.7 412.3L323.5 412.3L323.5 407.7ZM326.5 423.6L326.5 402.5L332.6 402.5L332.6 422.8Q332.6 423.7 332.8 424.1Q333.1 424.6 333.5 424.8Q334.0 425.0 334.6 425.0L334.6 425.0Q335.0 425.0 335.5 424.9Q335.9 424.8 336.1 424.8L336.1 424.8L337.1 429.3Q336.6 429.4 335.8 429.6Q335.0 429.8 333.8 429.8L333.8 429.8Q331.6 429.9 329.9 429.3Q328.3 428.6 327.4 427.2Q326.5 425.8 326.5 423.6L326.5 423.6ZM344.3 437.7L344.3 437.7Q343.2 437.7 342.2 437.5Q341.2 437.4 340.5 437.1L340.5 437.1L341.9 432.6Q343.0 432.9 343.8 432.9Q344.7 433.0 345.3 432.5Q345.9 432.1 346.3 431.1L346.3 431.1L346.7 430.2L338.9 407.7L345.2 407.7L349.7 423.8L350.0 423.8L354.5 407.7L360.9 407.7L352.5 431.9Q351.8 433.7 350.8 435.0Q349.8 436.3 348.2 437.0Q346.6 437.7 344.3 437.7ZM370.1 437.7L364.0 437.7L364.0 407.7L370.0 407.7L370.0 411.4L370.3 411.4Q370.7 410.5 371.4 409.6Q372.2 408.7 373.4 408.1Q374.6 407.4 376.5 407.4L376.5 407.4Q378.9 407.4 380.9 408.7Q382.9 409.9 384.1 412.4Q385.3 414.9 385.3 418.7L385.3 418.7Q385.3 422.3 384.1 424.8Q383.0 427.3 381.0 428.6Q378.9 429.9 376.5 429.9L376.5 429.9Q374.7 429.9 373.5 429.3Q372.2 428.7 371.5 427.8Q370.7 427.0 370.3 426.1L370.3 426.1L370.1 426.1L370.1 437.7ZM370.0 418.6L370.0 418.6Q370.0 420.6 370.5 422.0Q371.0 423.5 372.1 424.3Q373.1 425.1 374.5 425.1L374.5 425.1Q376.0 425.1 377.0 424.3Q378.1 423.5 378.6 422.0Q379.1 420.5 379.1 418.6L379.1 418.6Q379.1 416.7 378.6 415.3Q378.1 413.9 377.1 413.1Q376.0 412.3 374.5 412.3L374.5 412.3Q373.1 412.3 372.0 413.0Q371.0 413.8 370.5 415.3Q370.0 416.7 370.0 418.6ZM399.3 430.0L399.3 430.0Q395.9 430.0 393.5 428.6Q391.1 427.2 389.8 424.7Q388.4 422.2 388.4 418.7L388.4 418.7Q388.4 415.4 389.8 412.8Q391.1 410.3 393.4 408.9Q395.8 407.4 399.0 407.4L399.0 407.4Q401.2 407.4 403.1 408.1Q404.9 408.8 406.3 410.2Q407.7 411.6 408.5 413.7Q409.3 415.7 409.3 418.5L409.3 418.5L409.3 420.2L390.9 420.2L390.9 416.4L403.6 416.4Q403.6 415.1 403.0 414.1Q402.5 413.1 401.5 412.5Q400.5 412.0 399.1 412.0L399.1 412.0Q397.8 412.0 396.7 412.6Q395.6 413.2 395.0 414.3Q394.4 415.3 394.4 416.6L394.4 416.6L394.4 420.2Q394.4 421.8 395.0 423.0Q395.6 424.2 396.7 424.8Q397.9 425.5 399.4 425.5L399.4 425.5Q400.4 425.5 401.2 425.2Q402.1 424.9 402.7 424.3Q403.3 423.8 403.6 422.9L403.6 422.9L409.2 423.3Q408.7 425.3 407.4 426.8Q406.1 428.3 404.0 429.1Q402.0 430.0 399.3 430.0ZM431.4 413.9L431.4 413.9L425.8 414.3Q425.7 413.6 425.2 413.0Q424.8 412.4 424.0 412.1Q423.3 411.7 422.2 411.7L422.2 411.7Q420.8 411.7 419.8 412.3Q418.9 412.9 418.9 413.9L418.9 413.9Q418.9 414.7 419.5 415.2Q420.1 415.8 421.6 416.1L421.6 416.1L425.6 416.9Q428.8 417.5 430.3 419.0Q431.9 420.4 431.9 422.8L431.9 422.8Q431.9 424.9 430.6 426.5Q429.4 428.2 427.2 429.1Q425.0 430.0 422.2 430.0L422.2 430.0Q417.8 430.0 415.3 428.2Q412.7 426.3 412.3 423.2L412.3 423.2L418.2 422.9Q418.5 424.2 419.5 424.9Q420.6 425.6 422.2 425.6L422.2 425.6Q423.8 425.6 424.7 425.0Q425.7 424.4 425.7 423.4L425.7 423.4Q425.7 422.6 425.0 422.0Q424.4 421.5 422.9 421.2L422.9 421.2L419.2 420.5Q416.0 419.8 414.4 418.3Q412.9 416.7 412.9 414.2L412.9 414.2Q412.9 412.1 414.0 410.6Q415.1 409.1 417.2 408.3Q419.3 407.4 422.1 407.4L422.1 407.4Q426.2 407.4 428.6 409.2Q431.0 410.9 431.4 413.9Z M452.5 430.0L452.5 430.0Q450.4 430.0 448.7 429.2Q447.1 428.5 446.2 427.1Q445.2 425.6 445.2 423.5L445.2 423.5Q445.2 421.6 445.9 420.4Q446.5 419.2 447.7 418.4Q448.8 417.7 450.3 417.3Q451.8 416.9 453.4 416.7L453.4 416.7Q455.3 416.5 456.5 416.4Q457.6 416.2 458.2 415.8Q458.7 415.5 458.7 414.8L458.7 414.8L458.7 414.7Q458.7 413.3 457.8 412.6Q457.0 411.9 455.5 411.9L455.5 411.9Q453.8 411.9 452.9 412.6Q451.9 413.3 451.6 414.4L451.6 414.4L446.0 413.9Q446.4 411.9 447.7 410.5Q448.9 409.0 450.9 408.2Q452.9 407.4 455.5 407.4L455.5 407.4Q457.3 407.4 459.0 407.9Q460.6 408.3 461.9 409.2Q463.2 410.1 464.0 411.5Q464.7 412.9 464.7 414.8L464.7 414.8L464.7 429.5L459.0 429.5L459.0 426.5L458.8 426.5Q458.3 427.5 457.4 428.3Q456.5 429.1 455.3 429.5Q454.1 430.0 452.5 430.0ZM454.2 425.8L454.2 425.8Q455.5 425.8 456.5 425.2Q457.6 424.7 458.2 423.8Q458.7 422.9 458.7 421.7L458.7 421.7L458.7 419.4Q458.4 419.6 458.0 419.8Q457.5 419.9 456.9 420.0Q456.2 420.2 455.6 420.2Q455.0 420.3 454.5 420.4L454.5 420.4Q453.5 420.6 452.7 420.9Q451.9 421.3 451.4 421.8Q451.0 422.4 451.0 423.3L451.0 423.3Q451.0 424.5 451.9 425.1Q452.8 425.8 454.2 425.8ZM475.5 416.9L475.5 416.9L475.5 429.5L469.4 429.5L469.4 407.7L475.2 407.7L475.2 411.6L475.5 411.6Q476.2 409.7 477.9 408.6Q479.6 407.4 482.0 407.4L482.0 407.4Q484.3 407.4 486.0 408.4Q487.7 409.4 488.6 411.3Q489.6 413.1 489.6 415.7L489.6 415.7L489.6 429.5L483.5 429.5L483.5 416.7Q483.5 414.7 482.5 413.6Q481.4 412.5 479.6 412.5L479.6 412.5Q478.4 412.5 477.5 413.0Q476.5 413.5 476.0 414.5Q475.5 415.5 475.5 416.9ZM502.4 429.9L502.4 429.9Q499.9 429.9 497.9 428.6Q495.8 427.3 494.7 424.8Q493.5 422.3 493.5 418.7L493.5 418.7Q493.5 414.9 494.7 412.4Q495.9 409.9 497.9 408.7Q499.9 407.4 502.3 407.4L502.3 407.4Q504.2 407.4 505.4 408.1Q506.6 408.7 507.4 409.6Q508.2 410.5 508.5 411.4L508.5 411.4L508.7 411.4L508.7 400.5L514.8 400.5L514.8 429.5L508.8 429.5L508.8 426.1L508.5 426.1Q508.1 427.0 507.3 427.8Q506.6 428.7 505.3 429.3Q504.1 429.9 502.4 429.9ZM504.3 425.1L504.3 425.1Q505.7 425.1 506.8 424.3Q507.8 423.5 508.3 422.0Q508.9 420.6 508.9 418.6L508.9 418.6Q508.9 416.7 508.3 415.3Q507.8 413.8 506.8 413.0Q505.7 412.3 504.3 412.3L504.3 412.3Q502.8 412.3 501.8 413.1Q500.7 413.9 500.2 415.3Q499.7 416.7 499.7 418.6L499.7 418.6Q499.7 420.5 500.2 422.0Q500.8 423.5 501.8 424.3Q502.8 425.1 504.3 425.1Z M535.3 429.5L529.1 429.5L529.1 400.5L540.6 400.5Q543.9 400.5 546.2 401.7Q548.6 403.0 549.8 405.2Q551.0 407.4 551.0 410.3L551.0 410.3Q551.0 413.2 549.8 415.4Q548.5 417.6 546.2 418.9Q543.8 420.1 540.4 420.1L540.4 420.1L533.1 420.1L533.1 415.2L539.4 415.2Q541.2 415.2 542.4 414.6Q543.5 413.9 544.1 412.8Q544.7 411.7 544.7 410.3L544.7 410.3Q544.7 408.9 544.1 407.8Q543.5 406.7 542.4 406.1Q541.2 405.5 539.4 405.5L539.4 405.5L535.3 405.5L535.3 429.5ZM561.0 429.5L554.9 429.5L554.9 407.7L560.8 407.7L560.8 411.5L561.0 411.5Q561.6 409.5 563.0 408.5Q564.4 407.4 566.2 407.4L566.2 407.4Q566.7 407.4 567.2 407.5Q567.8 407.5 568.2 407.6L568.2 407.6L568.2 413.0Q567.7 412.9 567.0 412.8Q566.2 412.7 565.6 412.7L565.6 412.7Q564.3 412.7 563.2 413.2Q562.2 413.8 561.6 414.8Q561.0 415.9 561.0 417.2L561.0 417.2L561.0 429.5ZM580.1 430.0L580.1 430.0Q576.8 430.0 574.4 428.6Q572.0 427.1 570.7 424.6Q569.4 422.1 569.4 418.7L569.4 418.7Q569.4 415.3 570.7 412.8Q572.0 410.3 574.4 408.9Q576.8 407.4 580.1 407.4L580.1 407.4Q583.4 407.4 585.8 408.9Q588.2 410.3 589.5 412.8Q590.8 415.3 590.8 418.7L590.8 418.7Q590.8 422.1 589.5 424.6Q588.2 427.1 585.8 428.6Q583.4 430.0 580.1 430.0ZM580.1 425.3L580.1 425.3Q581.6 425.3 582.6 424.4Q583.6 423.6 584.2 422.1Q584.7 420.6 584.7 418.7L584.7 418.7Q584.7 416.8 584.2 415.3Q583.6 413.8 582.6 412.9Q581.6 412.1 580.1 412.1L580.1 412.1Q578.6 412.1 577.6 412.9Q576.5 413.8 576.0 415.3Q575.5 416.8 575.5 418.7L575.5 418.7Q575.5 420.6 576.0 422.1Q576.5 423.6 577.6 424.4Q578.6 425.3 580.1 425.3ZM593.3 407.7L606.4 407.7L606.4 412.3L593.3 412.3L593.3 407.7ZM596.2 423.6L596.2 402.5L602.3 402.5L602.3 422.8Q602.3 423.7 602.5 424.1Q602.8 424.6 603.3 424.8Q603.7 425.0 604.3 425.0L604.3 425.0Q604.8 425.0 605.2 424.9Q605.6 424.8 605.8 424.8L605.8 424.8L606.8 429.3Q606.3 429.4 605.5 429.6Q604.7 429.8 603.5 429.8L603.5 429.8Q601.3 429.9 599.7 429.3Q598.0 428.6 597.1 427.2Q596.2 425.8 596.2 423.6L596.2 423.6ZM620.0 430.0L620.0 430.0Q616.6 430.0 614.2 428.6Q611.8 427.1 610.5 424.6Q609.2 422.1 609.2 418.7L609.2 418.7Q609.2 415.3 610.5 412.8Q611.8 410.3 614.2 408.9Q616.6 407.4 620.0 407.4L620.0 407.4Q623.3 407.4 625.7 408.9Q628.1 410.3 629.4 412.8Q630.7 415.3 630.7 418.7L630.7 418.7Q630.7 422.1 629.4 424.6Q628.1 427.1 625.7 428.6Q623.3 430.0 620.0 430.0ZM620.0 425.3L620.0 425.3Q621.5 425.3 622.5 424.4Q623.5 423.6 624.0 422.1Q624.5 420.6 624.5 418.7L624.5 418.7Q624.5 416.8 624.0 415.3Q623.5 413.8 622.5 412.9Q621.5 412.1 620.0 412.1L620.0 412.1Q618.5 412.1 617.4 412.9Q616.4 413.8 615.9 415.3Q615.4 416.8 615.4 418.7L615.4 418.7Q615.4 420.6 615.9 422.1Q616.4 423.6 617.4 424.4Q618.5 425.3 620.0 425.3ZM637.7 437.7L637.7 437.7Q636.5 437.7 635.5 437.5Q634.5 437.4 633.8 437.1L633.8 437.1L635.2 432.6Q636.3 432.9 637.1 432.9Q638.0 433.0 638.6 432.5Q639.3 432.1 639.7 431.1L639.7 431.1L640.0 430.2L632.2 407.7L638.5 407.7L643.1 423.8L643.3 423.8L647.9 407.7L654.3 407.7L645.8 431.9Q645.2 433.7 644.1 435.0Q643.1 436.3 641.5 437.0Q639.9 437.7 637.7 437.7ZM663.4 437.7L657.4 437.7L657.4 407.7L663.3 407.7L663.3 411.4L663.6 411.4Q664.0 410.5 664.7 409.6Q665.5 408.7 666.7 408.1Q668.0 407.4 669.8 407.4L669.8 407.4Q672.2 407.4 674.2 408.7Q676.2 409.9 677.4 412.4Q678.6 414.9 678.6 418.7L678.6 418.7Q678.6 422.3 677.5 424.8Q676.3 427.3 674.3 428.6Q672.3 429.9 669.8 429.9L669.8 429.9Q668.0 429.9 666.8 429.3Q665.6 428.7 664.8 427.8Q664.0 427.0 663.6 426.1L663.6 426.1L663.4 426.1L663.4 437.7ZM663.3 418.6L663.3 418.6Q663.3 420.6 663.8 422.0Q664.4 423.5 665.4 424.3Q666.4 425.1 667.9 425.1L667.9 425.1Q669.3 425.1 670.4 424.3Q671.4 423.5 671.9 422.0Q672.5 420.5 672.5 418.6L672.5 418.6Q672.5 416.7 671.9 415.3Q671.4 413.9 670.4 413.1Q669.4 412.3 667.9 412.3L667.9 412.3Q666.4 412.3 665.4 413.0Q664.4 413.8 663.8 415.3Q663.3 416.7 663.3 418.6ZM688.7 429.5L682.7 429.5L682.7 407.7L688.7 407.7L688.7 429.5ZM685.7 404.9L685.7 404.9Q684.3 404.9 683.4 404.0Q682.4 403.1 682.4 401.8L682.4 401.8Q682.4 400.6 683.4 399.7Q684.3 398.8 685.7 398.8L685.7 398.8Q687.0 398.8 688.0 399.7Q689.0 400.6 689.0 401.8L689.0 401.8Q689.0 403.1 688.0 404.0Q687.0 404.9 685.7 404.9ZM703.4 430.0L703.4 430.0Q700.0 430.0 697.6 428.5Q695.2 427.1 693.9 424.6Q692.7 422.0 692.7 418.7L692.7 418.7Q692.7 415.4 694.0 412.8Q695.3 410.3 697.7 408.9Q700.1 407.4 703.4 407.4L703.4 407.4Q706.2 407.4 708.4 408.5Q710.5 409.5 711.8 411.4Q713.0 413.3 713.1 415.8L713.1 415.8L707.4 415.8Q707.2 414.2 706.2 413.2Q705.1 412.2 703.5 412.2L703.5 412.2Q702.1 412.2 701.0 412.9Q700.0 413.7 699.4 415.1Q698.8 416.6 698.8 418.6L698.8 418.6Q698.8 420.7 699.4 422.2Q700.0 423.7 701.0 424.4Q702.1 425.2 703.5 425.2L703.5 425.2Q704.5 425.2 705.3 424.8Q706.2 424.3 706.7 423.5Q707.3 422.7 707.4 421.5L707.4 421.5L713.1 421.5Q713.0 424.0 711.8 425.9Q710.6 427.8 708.4 428.9Q706.3 430.0 703.4 430.0ZM723.3 430.0L723.3 430.0Q721.2 430.0 719.5 429.2Q717.9 428.5 717.0 427.1Q716.0 425.6 716.0 423.5L716.0 423.5Q716.0 421.6 716.7 420.4Q717.3 419.2 718.5 418.4Q719.6 417.7 721.1 417.3Q722.6 416.9 724.2 416.7L724.2 416.7Q726.1 416.5 727.3 416.4Q728.4 416.2 729.0 415.8Q729.5 415.5 729.5 414.8L729.5 414.8L729.5 414.7Q729.5 413.3 728.6 412.6Q727.8 411.9 726.2 411.9L726.2 411.9Q724.6 411.9 723.6 412.6Q722.7 413.3 722.4 414.4L722.4 414.4L716.8 413.9Q717.2 411.9 718.4 410.5Q719.7 409.0 721.7 408.2Q723.7 407.4 726.3 407.4L726.3 407.4Q728.1 407.4 729.8 407.9Q731.4 408.3 732.7 409.2Q734.0 410.1 734.8 411.5Q735.5 412.9 735.5 414.8L735.5 414.8L735.5 429.5L729.8 429.5L729.8 426.5L729.6 426.5Q729.1 427.5 728.2 428.3Q727.3 429.1 726.1 429.5Q724.9 430.0 723.3 430.0ZM725.0 425.8L725.0 425.8Q726.3 425.8 727.3 425.2Q728.4 424.7 728.9 423.8Q729.5 422.9 729.5 421.7L729.5 421.7L729.5 419.4Q729.2 419.6 728.8 419.8Q728.3 419.9 727.7 420.0Q727.0 420.2 726.4 420.2Q725.8 420.3 725.3 420.4L725.3 420.4Q724.3 420.6 723.5 420.9Q722.7 421.3 722.2 421.8Q721.8 422.4 721.8 423.3L721.8 423.3Q721.8 424.5 722.7 425.1Q723.6 425.8 725.0 425.8ZM740.2 400.5L746.3 400.5L746.3 429.5L740.2 429.5L740.2 400.5Z M762.5 400.5L768.6 400.5L768.6 429.5L762.5 429.5L762.5 400.5ZM779.6 416.9L779.6 416.9L779.6 429.5L773.6 429.5L773.6 407.7L779.4 407.7L779.4 411.6L779.6 411.6Q780.3 409.7 782.0 408.6Q783.7 407.4 786.2 407.4L786.2 407.4Q788.4 407.4 790.1 408.4Q791.8 409.4 792.8 411.3Q793.7 413.1 793.7 415.7L793.7 415.7L793.7 429.5L787.7 429.5L787.7 416.7Q787.7 414.7 786.6 413.6Q785.6 412.5 783.8 412.5L783.8 412.5Q782.6 412.5 781.6 413.0Q780.7 413.5 780.2 414.5Q779.7 415.5 779.6 416.9ZM804.5 416.9L804.5 416.9L804.5 429.5L798.5 429.5L798.5 400.5L804.3 400.5L804.3 411.6L804.6 411.6Q805.3 409.6 807.0 408.5Q808.6 407.4 811.1 407.4L811.1 407.4Q813.4 407.4 815.1 408.4Q816.8 409.4 817.7 411.3Q818.7 413.1 818.7 415.7L818.7 415.7L818.7 429.5L812.6 429.5L812.6 416.7Q812.6 414.7 811.6 413.6Q810.6 412.5 808.7 412.5L808.7 412.5Q807.5 412.5 806.5 413.0Q805.6 413.5 805.1 414.5Q804.5 415.5 804.5 416.9ZM833.4 430.0L833.4 430.0Q830.0 430.0 827.6 428.6Q825.2 427.2 823.9 424.7Q822.6 422.2 822.6 418.7L822.6 418.7Q822.6 415.4 823.9 412.8Q825.2 410.3 827.5 408.9Q829.9 407.4 833.1 407.4L833.1 407.4Q835.3 407.4 837.2 408.1Q839.0 408.8 840.4 410.2Q841.8 411.6 842.6 413.7Q843.4 415.7 843.4 418.5L843.4 418.5L843.4 420.2L825.0 420.2L825.0 416.4L837.7 416.4Q837.7 415.1 837.1 414.1Q836.6 413.1 835.6 412.5Q834.6 412.0 833.2 412.0L833.2 412.0Q831.9 412.0 830.8 412.6Q829.7 413.2 829.1 414.3Q828.5 415.3 828.5 416.6L828.5 416.6L828.5 420.2Q828.5 421.8 829.1 423.0Q829.7 424.2 830.8 424.8Q832.0 425.5 833.5 425.5L833.5 425.5Q834.5 425.5 835.3 425.2Q836.2 424.9 836.8 424.3Q837.4 423.8 837.7 422.9L837.7 422.9L843.3 423.3Q842.8 425.3 841.5 426.8Q840.2 428.3 838.1 429.1Q836.1 430.0 833.4 430.0ZM853.4 429.5L847.3 429.5L847.3 407.7L853.2 407.7L853.2 411.5L853.4 411.5Q854.0 409.5 855.4 408.5Q856.8 407.4 858.7 407.4L858.7 407.4Q859.1 407.4 859.7 407.5Q860.2 407.5 860.6 407.6L860.6 407.6L860.6 413.0Q860.2 412.9 859.4 412.8Q858.6 412.7 858.0 412.7L858.0 412.7Q856.7 412.7 855.6 413.2Q854.6 413.8 854.0 414.8Q853.4 415.9 853.4 417.2L853.4 417.2L853.4 429.5ZM869.7 429.5L863.7 429.5L863.7 407.7L869.7 407.7L869.7 429.5ZM866.7 404.9L866.7 404.9Q865.4 404.9 864.4 404.0Q863.5 403.1 863.5 401.8L863.5 401.8Q863.5 400.6 864.4 399.7Q865.4 398.8 866.7 398.8L866.7 398.8Q868.1 398.8 869.0 399.7Q870.0 400.6 870.0 401.8L870.0 401.8Q870.0 403.1 869.0 404.0Q868.1 404.9 866.7 404.9ZM873.0 407.7L886.2 407.7L886.2 412.3L873.0 412.3L873.0 407.7ZM876.0 423.6L876.0 402.5L882.1 402.5L882.1 422.8Q882.1 423.7 882.3 424.1Q882.6 424.6 883.0 424.8Q883.5 425.0 884.1 425.0L884.1 425.0Q884.5 425.0 885.0 424.9Q885.4 424.8 885.6 424.8L885.6 424.8L886.6 429.3Q886.1 429.4 885.3 429.6Q884.5 429.8 883.3 429.8L883.3 429.8Q881.1 429.9 879.5 429.3Q877.8 428.6 876.9 427.2Q876.0 425.8 876.0 423.6L876.0 423.6ZM896.3 430.0L896.3 430.0Q894.2 430.0 892.6 429.2Q891.0 428.5 890.0 427.1Q889.1 425.6 889.1 423.5L889.1 423.5Q889.1 421.6 889.8 420.4Q890.4 419.2 891.6 418.4Q892.7 417.7 894.2 417.3Q895.7 416.9 897.3 416.7L897.3 416.7Q899.2 416.5 900.4 416.4Q901.5 416.2 902.0 415.8Q902.6 415.5 902.6 414.8L902.6 414.8L902.6 414.7Q902.6 413.3 901.7 412.6Q900.9 411.9 899.3 411.9L899.3 411.9Q897.7 411.9 896.7 412.6Q895.8 413.3 895.5 414.4L895.5 414.4L889.9 413.9Q890.3 411.9 891.5 410.5Q892.8 409.0 894.8 408.2Q896.7 407.4 899.4 407.4L899.4 407.4Q901.2 407.4 902.8 407.9Q904.5 408.3 905.8 409.2Q907.1 410.1 907.9 411.5Q908.6 412.9 908.6 414.8L908.6 414.8L908.6 429.5L902.9 429.5L902.9 426.5L902.7 426.5Q902.2 427.5 901.3 428.3Q900.4 429.1 899.2 429.5Q898.0 430.0 896.3 430.0ZM898.1 425.8L898.1 425.8Q899.4 425.8 900.4 425.2Q901.4 424.7 902.0 423.8Q902.6 422.9 902.6 421.7L902.6 421.7L902.6 419.4Q902.3 419.6 901.8 419.8Q901.3 419.9 900.7 420.0Q900.1 420.2 899.5 420.2Q898.9 420.3 898.4 420.4L898.4 420.4Q897.3 420.6 896.5 420.9Q895.8 421.3 895.3 421.8Q894.9 422.4 894.9 423.3L894.9 423.3Q894.9 424.5 895.8 425.1Q896.7 425.8 898.1 425.8ZM919.4 416.9L919.4 416.9L919.4 429.5L913.3 429.5L913.3 407.7L919.1 407.7L919.1 411.6L919.3 411.6Q920.1 409.7 921.8 408.6Q923.5 407.4 925.9 407.4L925.9 407.4Q928.2 407.4 929.9 408.4Q931.6 409.4 932.5 411.3Q933.4 413.1 933.4 415.7L933.4 415.7L933.4 429.5L927.4 429.5L927.4 416.7Q927.4 414.7 926.4 413.6Q925.3 412.5 923.5 412.5L923.5 412.5Q922.3 412.5 921.4 413.0Q920.4 413.5 919.9 414.5Q919.4 415.5 919.4 416.9ZM948.1 430.0L948.1 430.0Q944.7 430.0 942.3 428.5Q939.9 427.1 938.6 424.6Q937.3 422.0 937.3 418.7L937.3 418.7Q937.3 415.4 938.6 412.8Q939.9 410.3 942.3 408.9Q944.7 407.4 948.0 407.4L948.0 407.4Q950.9 407.4 953.0 408.5Q955.2 409.5 956.4 411.4Q957.7 413.3 957.8 415.8L957.8 415.8L952.1 415.8Q951.8 414.2 950.8 413.2Q949.8 412.2 948.1 412.2L948.1 412.2Q946.7 412.2 945.7 412.9Q944.6 413.7 944.0 415.1Q943.5 416.6 943.5 418.6L943.5 418.6Q943.5 420.7 944.0 422.2Q944.6 423.7 945.7 424.4Q946.7 425.2 948.1 425.2L948.1 425.2Q949.2 425.2 950.0 424.8Q950.8 424.3 951.4 423.5Q951.9 422.7 952.1 421.5L952.1 421.5L957.8 421.5Q957.7 424.0 956.4 425.9Q955.2 427.8 953.1 428.9Q951.0 430.0 948.1 430.0ZM971.6 430.0L971.6 430.0Q968.3 430.0 965.8 428.6Q963.4 427.2 962.1 424.7Q960.8 422.2 960.8 418.7L960.8 418.7Q960.8 415.4 962.1 412.8Q963.4 410.3 965.8 408.9Q968.2 407.4 971.4 407.4L971.4 407.4Q973.5 407.4 975.4 408.1Q977.3 408.8 978.7 410.2Q980.1 411.6 980.9 413.7Q981.6 415.7 981.6 418.5L981.6 418.5L981.6 420.2L963.2 420.2L963.2 416.4L975.9 416.4Q975.9 415.1 975.4 414.1Q974.8 413.1 973.8 412.5Q972.8 412.0 971.5 412.0L971.5 412.0Q970.1 412.0 969.1 412.6Q968.0 413.2 967.4 414.3Q966.8 415.3 966.8 416.6L966.8 416.6L966.8 420.2Q966.8 421.8 967.4 423.0Q968.0 424.2 969.1 424.8Q970.2 425.5 971.7 425.5L971.7 425.5Q972.7 425.5 973.6 425.2Q974.4 424.9 975.0 424.3Q975.6 423.8 975.9 422.9L975.9 422.9L981.5 423.3Q981.1 425.3 979.8 426.8Q978.5 428.3 976.4 429.1Q974.3 430.0 971.6 430.0Z " />' });
    __ASTRO_IMAGE_IMPORT_Z2q5IxC = new Proxy({ "src": "/_astro/img-1.Dji-5EKx.jpeg", "width": 620, "height": 338, "format": "jpg" }, {
      get(target, name, receiver) {
        if (name === "clone") {
          return structuredClone(target);
        }
        if (name === "fsPath") {
          return "/Users/vivek/Desktop/self/myPortfolio/src/assets/blogs/classes-in-js/img-1.jpeg";
        }
        return target[name];
      }
    });
    __ASTRO_IMAGE_IMPORT_ddEss = new Proxy({ "src": "/_astro/img-2.Cb_neWDX.png", "width": 1299, "height": 676, "format": "png" }, {
      get(target, name, receiver) {
        if (name === "clone") {
          return structuredClone(target);
        }
        if (name === "fsPath") {
          return "/Users/vivek/Desktop/self/myPortfolio/src/assets/blogs/classes-in-js/img-2.png";
        }
        return target[name];
      }
    });
    __ASTRO_IMAGE_IMPORT_lSR4H = new Proxy({ "src": "/_astro/img-3.CBpCP0OL.png", "width": 1302, "height": 673, "format": "png" }, {
      get(target, name, receiver) {
        if (name === "clone") {
          return structuredClone(target);
        }
        if (name === "fsPath") {
          return "/Users/vivek/Desktop/self/myPortfolio/src/assets/blogs/classes-in-js/img-3.png";
        }
        return target[name];
      }
    });
    __ASTRO_IMAGE_IMPORT_Dfhic = new Proxy({ "src": "/_astro/img-5._pFz6TsE.png", "width": 1298, "height": 676, "format": "png" }, {
      get(target, name, receiver) {
        if (name === "clone") {
          return structuredClone(target);
        }
        if (name === "fsPath") {
          return "/Users/vivek/Desktop/self/myPortfolio/src/assets/blogs/classes-in-js/img-5.png";
        }
        return target[name];
      }
    });
    __ASTRO_IMAGE_IMPORT_1l5ef3 = createSvgComponent({ "meta": { "src": "/_astro/cover-4.Bvr2iquK.svg", "width": 1200, "height": 600, "format": "svg" }, "attributes": { "width": "1200", "height": "600", "viewBox": "0 0 1200 600" }, "children": '<defs><pattern id="satori_pattern_id_1" x="0" y="0" width="0.08333333333333333" height="0.16666666666666666" patternUnits="objectBoundingBox"><radialGradient id="satori_radial_id_1"><stop offset="0" stop-color="lightgray" /><stop offset="0.02" stop-color="lightgray" /><stop offset="0" stop-color="transparent" /><stop offset="1" stop-color="transparent" /></radialGradient><mask id="satori_mask_id_1"><rect x="0" y="0" width="100" height="100" fill="#fff" /></mask><rect x="0" y="0" width="100" height="100" fill="transparent" /><circle cx="75" cy="75" width="100" height="100" r="106.06601717798213" fill="url(#satori_radial_id_1)" mask="url(#satori_mask_id_1)" /></pattern><pattern id="satori_pattern_id_0" x="0" y="0" width="0.08333333333333333" height="0.16666666666666666" patternUnits="objectBoundingBox"><radialGradient id="satori_radial_id_0"><stop offset="0" stop-color="lightgray" /><stop offset="0.02" stop-color="lightgray" /><stop offset="0" stop-color="transparent" /><stop offset="1" stop-color="transparent" /></radialGradient><mask id="satori_mask_id_0"><rect x="0" y="0" width="100" height="100" fill="#fff" /></mask><rect x="0" y="0" width="100" height="100" fill="transparent" /><circle cx="25" cy="25" width="100" height="100" r="106.06601717798213" fill="url(#satori_radial_id_0)" mask="url(#satori_mask_id_0)" /></pattern></defs><mask id="satori_om-id"><rect x="0" y="0" width="1200" height="600" fill="#fff" /></mask><rect x="0" y="0" width="1200" height="600" fill="white" /><rect x="0" y="0" width="1200" height="600" fill="url(#satori_pattern_id_1)" /><rect x="0" y="0" width="1200" height="600" fill="url(#satori_pattern_id_0)" /><mask id="satori_om-id-0"><rect x="500" y="149" width="200" height="200" fill="#fff" /></mask><clipPath id="satori_cp-id-0-0"><rect x="500" y="149" width="200" height="200" /></clipPath><mask id="satori_om-id-0-0"><rect x="500" y="149" width="200" height="200" fill="#fff" /></mask><image x="500" y="149" width="200" height="200" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABBwAAAQcCAMAAAABRXg3AAAC1lBMVEXw208yMzDz43j8+eOhlUK+r0bv2k7u2U7s104zNDA6OjE0NTDt2E43NzDt2U41NjDn003ey0xMSjTo1E3q1k40NDB+djzVw0o2NjBDQjLk0E03ODDgzUzr107Uwkrq1U48PDHp1U1mYTjjz0zTwUo7OzGAeDxGRTPYxkvdyktdWTfEtEfPvkk9PDFSTzV7dDxeWjfm0k27rEbiz0xAQDKYjUBGRDNLSTRAPzLYxUvGtkjfzEw4ODE5OTFOTDTl0U3cyUujl0JBQDJNSzSJgD5KSDQ9PTF9dTzax0uMgz5PTDTKuUi5qkanm0N6cjs+PjKDej2xo0RgXDd5cjtXUzY/PjLLuknXxUrRv0pJSDOPhj+ypEXk0U1PTTTMu0lEQzO3qEWKgT5oYziGfj1VUTVYVDakl0KPhT9aVzbbyEuDez1YVTaVikBxazqpnUPQv0mEfD2+rkZiXTfKuki1pkWsn0PAsEdpYziWi0CekkFQTjRjXzirnkPOvUm6q0bSwEquoUThzkxbVzZ4cDtgWzdHRjNCQTKvoUSHfj2mmkNsZjnBsUefk0GzpUWpnEPFtUimmUKkmEJrZTmUiUBcWDa4qUW9rka8rUaaj0GilkKRhz+Qhj+Vi0CBeT1RTjVvaTqNhD7hzUyMgj6ek0F3cDtsZzlVUjXWxEqOhD9TUDXHtkjMvEluaDl8dDxzbDqXjEB1bjpUUTWGfT1aVjZWUzWTiT9qZTm0pkWwo0SglEHSwUqSiD+bkEGvokTZx0tZVTabj0GShz9lYDhwajq4qkZFRDPbyUt0bTpfWzeqnUOckUG1p0WFfD1JRzNkXziLgj6om0PJuEh/dzy/sEd1bjvDs0dIRjOsn0SypESIfz6toETNvEl4cTudkUFybDq2qEV7cztjXjhvaTnIuEhyazp2bzttZznCskelmUKCej3Ht0hpZDnBskdnYjhhXTeZjkD9+ur///8nV2MOAAAlAUlEQVR4XuzAgQAAAAACoP1tN1hghEoPgLFTxyYMQgEABQNJkVYIuoC4ioiQxtIldIY0SS3YpNEB3OGPYKm1lVukDjhAIHfdW+CdDgCcvwrAHABzAMwBMAfAHABzAMwBMAfAHABzAMwBMAcAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAcwAwB8AcAHMAzAEwB8AcAHMAzAEwB8AcAHMAzAHAHABzAMwBMAfAHABzAMwBMAfAHABzAMwBMAcAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAcwAwB8AcAHMAzAEwB8AcAHMAzAEwB8AcAHMAzAHAHABzAMwBMAfAHABzAMwBMAfAHABzAMwBMAcAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAzAEwB8AcAHMAzAEwB8AcAHMAzAEwB8AcAHMAzAHAHABzAMwBMAfAHABzAMwBMAfAHABzAMwBMAcAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAzAEwB8AcAHMAzAEwB8AcAHMAzAEwB8AcAHMAzAHAHABzAMwBMAfAHABzAMwBMAfAHABzAMwBMAcAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAzAEwB8AcAHMAzAEwB8AcAHMAzAEwB8AcAHMAMAfAHABzAMwBMAfAHABzAMwBMAfAHABzAMwBMAcAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAzAEwB8AcAHMAzAEwB8AcAHMAzAEwB8AcAHMAMAfAHABzAMwBMAfAHABzAMwBMAfAHABzAMwBMAcAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAzAEwB+CIOQC/OAfAHABzAMwBMAcAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAzAEwB8AcAHMAzAEwB8AcAHMAzAEwB8AcAHMAMAfAHABzAMwBMAfAHABzAMwBMAfAHABzAMwBMAcAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAzAEwB8AcAHMAzAEwB8AcAHMAzAEwB8AcAHMAMAfAHABzAMwBMAfAHABzAMwBMAfAHABzAMwBMAcAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAzAEwB8AcAHMAzAEwB8AcAHMAzAEwB8AcAHMAMAfAHABzAMwBMAfAHABzAMwBMAfAHABzAMwBwBwAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAzAEwB8AcAHMAzAEwB8AcAHMAzAEwB8AcAHMAMAfAHABzAMwBMAfAHABzAMwBMAfAHABzAMwBwBwAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAzAEw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" preserveAspectRatio="none" clip-path="url(#satori_cp-id-0-0)" mask="url(#satori_om-id-0-0)" /><mask id="satori_om-id-1"><rect x="282" y="379" width="636" height="72" fill="#fff" /></mask><mask id="satori_om-id-1-0"><rect x="282" y="379" width="636" height="72" fill="#fff" /></mask><path fill="black" d="M294.8 429.5L294.8 429.5L284.5 429.5L284.5 400.5L294.9 400.5Q299.3 400.5 302.5 402.2Q305.7 403.9 307.4 407.2Q309.1 410.4 309.1 415.0L309.1 415.0Q309.1 419.5 307.4 422.8Q305.7 426.1 302.5 427.8Q299.3 429.5 294.8 429.5ZM290.7 405.7L290.7 424.3L294.6 424.3Q297.3 424.3 299.2 423.3Q301.0 422.3 302.0 420.3Q302.9 418.2 302.9 415.0L302.9 415.0Q302.9 411.7 302.0 409.7Q301.0 407.7 299.2 406.7Q297.3 405.7 294.6 405.7L294.6 405.7L290.7 405.7ZM323.4 430.0L323.4 430.0Q320.1 430.0 317.7 428.6Q315.2 427.2 313.9 424.7Q312.6 422.2 312.6 418.7L312.6 418.7Q312.6 415.4 313.9 412.8Q315.2 410.3 317.6 408.9Q320.0 407.4 323.2 407.4L323.2 407.4Q325.4 407.4 327.2 408.1Q329.1 408.8 330.5 410.2Q331.9 411.6 332.7 413.7Q333.5 415.7 333.5 418.5L333.5 418.5L333.5 420.2L315.0 420.2L315.0 416.4L327.8 416.4Q327.8 415.1 327.2 414.1Q326.6 413.1 325.6 412.5Q324.6 412.0 323.3 412.0L323.3 412.0Q321.9 412.0 320.9 412.6Q319.8 413.2 319.2 414.3Q318.6 415.3 318.6 416.6L318.6 416.6L318.6 420.2Q318.6 421.8 319.2 423.0Q319.8 424.2 320.9 424.8Q322.0 425.5 323.5 425.5L323.5 425.5Q324.6 425.5 325.4 425.2Q326.2 424.9 326.8 424.3Q327.4 423.8 327.7 422.9L327.7 422.9L333.3 423.3Q332.9 425.3 331.6 426.8Q330.3 428.3 328.2 429.1Q326.1 430.0 323.4 430.0ZM343.5 429.5L337.5 429.5L337.5 400.5L343.6 400.5L343.6 411.4L343.8 411.4Q344.2 410.5 344.9 409.6Q345.7 408.7 346.9 408.1Q348.1 407.4 350.0 407.4L350.0 407.4Q352.4 407.4 354.4 408.7Q356.4 409.9 357.6 412.4Q358.8 414.9 358.8 418.7L358.8 418.7Q358.8 422.3 357.6 424.8Q356.5 427.3 354.5 428.6Q352.4 429.9 350.0 429.9L350.0 429.9Q348.2 429.9 347.0 429.3Q345.7 428.7 345.0 427.8Q344.2 427.0 343.8 426.1L343.8 426.1L343.5 426.1L343.5 429.5ZM343.4 418.6L343.4 418.6Q343.4 420.6 344.0 422.0Q344.5 423.5 345.6 424.3Q346.6 425.1 348.0 425.1L348.0 425.1Q349.5 425.1 350.5 424.3Q351.6 423.5 352.1 422.0Q352.6 420.5 352.6 418.6L352.6 418.6Q352.6 416.7 352.1 415.3Q351.6 413.9 350.6 413.1Q349.5 412.3 348.0 412.3L348.0 412.3Q346.6 412.3 345.5 413.0Q344.5 413.8 344.0 415.3Q343.4 416.7 343.4 418.6ZM376.8 420.3L376.8 420.3L376.8 407.7L382.9 407.7L382.9 429.5L377.1 429.5L377.1 425.6L376.8 425.6Q376.1 427.5 374.4 428.7Q372.7 429.8 370.2 429.8L370.2 429.8Q368.0 429.8 366.4 428.8Q364.7 427.8 363.8 426.0Q362.8 424.2 362.8 421.6L362.8 421.6L362.8 407.7L368.9 407.7L368.9 420.5Q368.9 422.5 369.9 423.6Q370.9 424.7 372.7 424.7L372.7 424.7Q373.7 424.7 374.7 424.2Q375.7 423.7 376.2 422.7Q376.8 421.7 376.8 420.3ZM393.7 416.9L393.7 416.9L393.7 429.5L387.7 429.5L387.7 407.7L393.5 407.7L393.5 411.6L393.7 411.6Q394.4 409.7 396.1 408.6Q397.9 407.4 400.3 407.4L400.3 407.4Q402.6 407.4 404.2 408.4Q405.9 409.4 406.9 411.3Q407.8 413.1 407.8 415.7L407.8 415.7L407.8 429.5L401.8 429.5L401.8 416.7Q401.8 414.7 400.7 413.6Q399.7 412.5 397.9 412.5L397.9 412.5Q396.7 412.5 395.7 413.0Q394.8 413.5 394.3 414.5Q393.8 415.5 393.7 416.9ZM422.1 418.7L418.1 423.3L418.1 416.0L418.9 416.0L425.9 407.7L432.9 407.7L423.5 418.7L422.1 418.7ZM418.6 429.5L412.6 429.5L412.6 400.5L418.6 400.5L418.6 429.5ZM433.3 429.5L426.2 429.5L419.8 420.0L423.8 415.8L433.3 429.5ZM441.9 429.5L435.8 429.5L435.8 407.7L441.9 407.7L441.9 429.5ZM438.9 404.9L438.9 404.9Q437.5 404.9 436.6 404.0Q435.6 403.1 435.6 401.8L435.6 401.8Q435.6 400.6 436.6 399.7Q437.5 398.8 438.9 398.8L438.9 398.8Q440.2 398.8 441.2 399.7Q442.1 400.6 442.1 401.8L442.1 401.8Q442.1 403.1 441.2 404.0Q440.2 404.9 438.9 404.9ZM452.8 416.9L452.8 416.9L452.8 429.5L446.7 429.5L446.7 407.7L452.5 407.7L452.5 411.6L452.7 411.6Q453.5 409.7 455.2 408.6Q456.9 407.4 459.3 407.4L459.3 407.4Q461.6 407.4 463.3 408.4Q465.0 409.4 465.9 411.3Q466.8 413.1 466.8 415.7L466.8 415.7L466.8 429.5L460.8 429.5L460.8 416.7Q460.8 414.7 459.8 413.6Q458.7 412.5 456.9 412.5L456.9 412.5Q455.7 412.5 454.7 413.0Q453.8 413.5 453.3 414.5Q452.8 415.5 452.8 416.9ZM481.4 438.2L481.4 438.2Q478.5 438.2 476.4 437.4Q474.3 436.6 473.1 435.2Q471.8 433.8 471.4 432.1L471.4 432.1L477.0 431.3Q477.3 432.0 477.9 432.6Q478.4 433.1 479.3 433.5Q480.2 433.8 481.6 433.8L481.6 433.8Q483.5 433.8 484.8 432.9Q486.1 431.9 486.1 429.7L486.1 429.7L486.1 425.7L485.8 425.7Q485.5 426.6 484.7 427.4Q483.9 428.2 482.6 428.7Q481.4 429.2 479.6 429.2L479.6 429.2Q477.2 429.2 475.2 428.1Q473.2 426.9 472.0 424.6Q470.8 422.2 470.8 418.6L470.8 418.6Q470.8 414.9 472.0 412.4Q473.2 409.9 475.2 408.7Q477.2 407.4 479.6 407.4L479.6 407.4Q481.4 407.4 482.7 408.1Q483.9 408.7 484.7 409.6Q485.4 410.5 485.8 411.4L485.8 411.4L486.1 411.4L486.1 407.7L492.1 407.7L492.1 429.8Q492.1 432.5 490.7 434.4Q489.4 436.3 487.0 437.2Q484.5 438.2 481.4 438.2ZM481.5 424.7L481.5 424.7Q483.0 424.7 484.0 424.0Q485.0 423.2 485.6 421.9Q486.1 420.5 486.1 418.6L486.1 418.6Q486.1 416.6 485.6 415.2Q485.1 413.8 484.0 413.0Q483.0 412.3 481.5 412.3L481.5 412.3Q480.1 412.3 479.0 413.1Q478.0 413.9 477.5 415.3Q477.0 416.7 477.0 418.6L477.0 418.6Q477.0 420.5 477.5 421.8Q478.0 423.2 479.0 423.9Q480.1 424.7 481.5 424.7Z M516.0 430.0L516.0 430.0Q512.7 430.0 510.3 428.5Q507.9 427.1 506.6 424.6Q505.3 422.0 505.3 418.7L505.3 418.7Q505.3 415.4 506.6 412.8Q507.9 410.3 510.3 408.9Q512.7 407.4 516.0 407.4L516.0 407.4Q518.9 407.4 521.0 408.5Q523.2 409.5 524.4 411.4Q525.7 413.3 525.8 415.8L525.8 415.8L520.1 415.8Q519.8 414.2 518.8 413.2Q517.8 412.2 516.1 412.2L516.1 412.2Q514.7 412.2 513.7 412.9Q512.6 413.7 512.0 415.1Q511.5 416.6 511.5 418.6L511.5 418.6Q511.5 420.7 512.0 422.2Q512.6 423.7 513.7 424.4Q514.7 425.2 516.1 425.2L516.1 425.2Q517.2 425.2 518.0 424.8Q518.8 424.3 519.4 423.5Q519.9 422.7 520.1 421.5L520.1 421.5L525.8 421.5Q525.7 424.0 524.4 425.9Q523.2 427.8 521.1 428.9Q519.0 430.0 516.0 430.0ZM529.7 400.5L535.7 400.5L535.7 429.5L529.7 429.5L529.7 400.5ZM546.8 430.0L546.8 430.0Q544.7 430.0 543.1 429.2Q541.4 428.5 540.5 427.1Q539.5 425.6 539.5 423.5L539.5 423.5Q539.5 421.6 540.2 420.4Q540.9 419.2 542.0 418.4Q543.2 417.7 544.6 417.3Q546.1 416.9 547.7 416.7L547.7 416.7Q549.6 416.5 550.8 416.4Q552.0 416.2 552.5 415.8Q553.0 415.5 553.0 414.8L553.0 414.8L553.0 414.7Q553.0 413.3 552.2 412.6Q551.3 411.9 549.8 411.9L549.8 411.9Q548.2 411.9 547.2 412.6Q546.2 413.3 545.9 414.4L545.9 414.4L540.3 413.9Q540.7 411.9 542.0 410.5Q543.2 409.0 545.2 408.2Q547.2 407.4 549.8 407.4L549.8 407.4Q551.6 407.4 553.3 407.9Q555.0 408.3 556.3 409.2Q557.6 410.1 558.3 411.5Q559.1 412.9 559.1 414.8L559.1 414.8L559.1 429.5L553.3 429.5L553.3 426.5L553.2 426.5Q552.6 427.5 551.8 428.3Q550.9 429.1 549.6 429.5Q548.4 430.0 546.8 430.0ZM548.5 425.8L548.5 425.8Q549.9 425.8 550.9 425.2Q551.9 424.7 552.5 423.8Q553.1 422.9 553.1 421.7L553.1 421.7L553.1 419.4Q552.8 419.6 552.3 419.8Q551.8 419.9 551.2 420.0Q550.6 420.2 550.0 420.2Q549.4 420.3 548.9 420.4L548.9 420.4Q547.8 420.6 547.0 420.9Q546.2 421.3 545.8 421.8Q545.3 422.4 545.3 423.3L545.3 423.3Q545.3 424.5 546.2 425.1Q547.1 425.8 548.5 425.8ZM581.9 413.9L581.9 413.9L576.4 414.3Q576.2 413.6 575.8 413.0Q575.3 412.4 574.5 412.1Q573.8 411.7 572.7 411.7L572.7 411.7Q571.3 411.7 570.4 412.3Q569.4 412.9 569.4 413.9L569.4 413.9Q569.4 414.7 570.0 415.2Q570.7 415.8 572.2 416.1L572.2 416.1L576.1 416.9Q579.3 417.5 580.9 419.0Q582.4 420.4 582.4 422.8L582.4 422.8Q582.4 424.9 581.2 426.5Q579.9 428.2 577.7 429.1Q575.6 430.0 572.7 430.0L572.7 430.0Q568.4 430.0 565.8 428.2Q563.3 426.3 562.8 423.2L562.8 423.2L568.8 422.9Q569.0 424.2 570.1 424.9Q571.1 425.6 572.7 425.6L572.7 425.6Q574.3 425.6 575.3 425.0Q576.3 424.4 576.3 423.4L576.3 423.4Q576.3 422.6 575.6 422.0Q574.9 421.5 573.5 421.2L573.5 421.2L569.7 420.5Q566.5 419.8 564.9 418.3Q563.4 416.7 563.4 414.2L563.4 414.2Q563.4 412.1 564.5 410.6Q565.7 409.1 567.8 408.3Q569.8 407.4 572.6 407.4L572.6 407.4Q576.8 407.4 579.2 409.2Q581.5 410.9 581.9 413.9ZM604.4 413.9L604.4 413.9L598.9 414.3Q598.7 413.6 598.3 413.0Q597.8 412.4 597.0 412.1Q596.3 411.7 595.2 411.7L595.2 411.7Q593.8 411.7 592.8 412.3Q591.9 412.9 591.9 413.9L591.9 413.9Q591.9 414.7 592.5 415.2Q593.1 415.8 594.6 416.1L594.6 416.1L598.6 416.9Q601.8 417.5 603.3 419.0Q604.9 420.4 604.9 422.8L604.9 422.8Q604.9 424.9 603.6 426.5Q602.4 428.2 600.2 429.1Q598.0 430.0 595.2 430.0L595.2 430.0Q590.8 430.0 588.3 428.2Q585.7 426.3 585.3 423.2L585.3 423.2L591.2 422.9Q591.5 424.2 592.5 424.9Q593.6 425.6 595.2 425.6L595.2 425.6Q596.8 425.6 597.8 425.0Q598.7 424.4 598.7 423.4L598.7 423.4Q598.7 422.6 598.1 422.0Q597.4 421.5 595.9 421.2L595.9 421.2L592.2 420.5Q589.0 419.8 587.4 418.3Q585.9 416.7 585.9 414.2L585.9 414.2Q585.9 412.1 587.0 410.6Q588.2 409.1 590.2 408.3Q592.3 407.4 595.1 407.4L595.1 407.4Q599.2 407.4 601.6 409.2Q604.0 410.9 604.4 413.9ZM618.7 430.0L618.7 430.0Q615.3 430.0 612.9 428.6Q610.5 427.2 609.1 424.7Q607.8 422.2 607.8 418.7L607.8 418.7Q607.8 415.4 609.1 412.8Q610.5 410.3 612.8 408.9Q615.2 407.4 618.4 407.4L618.4 407.4Q620.6 407.4 622.4 408.1Q624.3 408.8 625.7 410.2Q627.1 411.6 627.9 413.7Q628.7 415.7 628.7 418.5L628.7 418.5L628.7 420.2L610.3 420.2L610.3 416.4L623.0 416.4Q623.0 415.1 622.4 414.1Q621.8 413.1 620.8 412.5Q619.8 412.0 618.5 412.0L618.5 412.0Q617.1 412.0 616.1 412.6Q615.0 413.2 614.4 414.3Q613.8 415.3 613.8 416.6L613.8 416.6L613.8 420.2Q613.8 421.8 614.4 423.0Q615.0 424.2 616.1 424.8Q617.2 425.5 618.8 425.5L618.8 425.5Q619.8 425.5 620.6 425.2Q621.4 424.9 622.0 424.3Q622.6 423.8 623.0 422.9L623.0 422.9L628.5 423.3Q628.1 425.3 626.8 426.8Q625.5 428.3 623.4 429.1Q621.4 430.0 618.7 430.0ZM650.8 413.9L650.8 413.9L645.2 414.3Q645.1 413.6 644.6 413.0Q644.2 412.4 643.4 412.1Q642.6 411.7 641.6 411.7L641.6 411.7Q640.2 411.7 639.2 412.3Q638.3 412.9 638.3 413.9L638.3 413.9Q638.3 414.7 638.9 415.2Q639.5 415.8 641.0 416.1L641.0 416.1L645.0 416.9Q648.2 417.5 649.7 419.0Q651.3 420.4 651.3 422.8L651.3 422.8Q651.3 424.9 650.0 426.5Q648.8 428.2 646.6 429.1Q644.4 430.0 641.6 430.0L641.6 430.0Q637.2 430.0 634.7 428.2Q632.1 426.3 631.7 423.2L631.7 423.2L637.6 422.9Q637.9 424.2 638.9 424.9Q640.0 425.6 641.6 425.6L641.6 425.6Q643.2 425.6 644.1 425.0Q645.1 424.4 645.1 423.4L645.1 423.4Q645.1 422.6 644.4 422.0Q643.7 421.5 642.3 421.2L642.3 421.2L638.5 420.5Q635.4 419.8 633.8 418.3Q632.2 416.7 632.2 414.2L632.2 414.2Q632.2 412.1 633.4 410.6Q634.5 409.1 636.6 408.3Q638.7 407.4 641.5 407.4L641.5 407.4Q645.6 407.4 648.0 409.2Q650.4 410.9 650.8 413.9Z M670.4 429.5L664.4 429.5L664.4 407.7L670.4 407.7L670.4 429.5ZM667.4 404.9L667.4 404.9Q666.1 404.9 665.1 404.0Q664.1 403.1 664.1 401.8L664.1 401.8Q664.1 400.6 665.1 399.7Q666.1 398.8 667.4 398.8L667.4 398.8Q668.8 398.8 669.7 399.7Q670.7 400.6 670.7 401.8L670.7 401.8Q670.7 403.1 669.7 404.0Q668.8 404.9 667.4 404.9ZM681.3 416.9L681.3 416.9L681.3 429.5L675.3 429.5L675.3 407.7L681.0 407.7L681.0 411.6L681.3 411.6Q682.0 409.7 683.7 408.6Q685.4 407.4 687.8 407.4L687.8 407.4Q690.1 407.4 691.8 408.4Q693.5 409.4 694.4 411.3Q695.4 413.1 695.4 415.7L695.4 415.7L695.4 429.5L689.3 429.5L689.3 416.7Q689.3 414.7 688.3 413.6Q687.3 412.5 685.4 412.5L685.4 412.5Q684.2 412.5 683.3 413.0Q682.4 413.5 681.8 414.5Q681.3 415.5 681.3 416.9Z M721.2 420.7L721.2 400.5L727.2 400.5L727.2 420.7Q727.2 423.6 726.0 425.6Q724.7 427.7 722.5 428.8Q720.3 429.9 717.3 429.9L717.3 429.9Q714.7 429.9 712.5 429.0Q710.4 428.1 709.2 426.2Q707.9 424.3 707.9 421.4L707.9 421.4L714.0 421.4Q714.1 422.5 714.5 423.3Q715.0 424.1 715.8 424.6Q716.5 425.0 717.6 425.0L717.6 425.0Q718.8 425.0 719.5 424.5Q720.3 424.0 720.8 423.1Q721.2 422.1 721.2 420.7L721.2 420.7ZM738.4 430.0L738.4 430.0Q736.3 430.0 734.7 429.2Q733.1 428.5 732.1 427.1Q731.2 425.6 731.2 423.5L731.2 423.5Q731.2 421.6 731.8 420.4Q732.5 419.2 733.7 418.4Q734.8 417.7 736.3 417.3Q737.8 416.9 739.4 416.7L739.4 416.7Q741.3 416.5 742.4 416.4Q743.6 416.2 744.1 415.8Q744.7 415.5 744.7 414.8L744.7 414.8L744.7 414.7Q744.7 413.3 743.8 412.6Q743.0 411.9 741.4 411.9L741.4 411.9Q739.8 411.9 738.8 412.6Q737.9 413.3 737.5 414.4L737.5 414.4L731.9 413.9Q732.4 411.9 733.6 410.5Q734.9 409.0 736.9 408.2Q738.8 407.4 741.4 407.4L741.4 407.4Q743.3 407.4 744.9 407.9Q746.6 408.3 747.9 409.2Q749.2 410.1 750.0 411.5Q750.7 412.9 750.7 414.8L750.7 414.8L750.7 429.5L745.0 429.5L745.0 426.5L744.8 426.5Q744.3 427.5 743.4 428.3Q742.5 429.1 741.3 429.5Q740.0 430.0 738.4 430.0ZM740.2 425.8L740.2 425.8Q741.5 425.8 742.5 425.2Q743.5 424.7 744.1 423.8Q744.7 422.9 744.7 421.7L744.7 421.7L744.7 419.4Q744.4 419.6 743.9 419.8Q743.4 419.9 742.8 420.0Q742.2 420.2 741.6 420.2Q741.0 420.3 740.5 420.4L740.5 420.4Q739.4 420.6 738.6 420.9Q737.8 421.3 737.4 421.8Q737.0 422.4 737.0 423.3L737.0 423.3Q737.0 424.5 737.9 425.1Q738.8 425.8 740.2 425.8ZM768.5 407.7L775.0 407.7L767.3 429.5L760.5 429.5L752.9 407.7L759.3 407.7L763.8 423.3L764.0 423.3L768.5 407.7ZM783.7 430.0L783.7 430.0Q781.6 430.0 779.9 429.2Q778.3 428.5 777.4 427.1Q776.4 425.6 776.4 423.5L776.4 423.5Q776.4 421.6 777.1 420.4Q777.8 419.2 778.9 418.4Q780.1 417.7 781.5 417.3Q783.0 416.9 784.6 416.7L784.6 416.7Q786.5 416.5 787.7 416.4Q788.8 416.2 789.4 415.8Q789.9 415.5 789.9 414.8L789.9 414.8L789.9 414.7Q789.9 413.3 789.1 412.6Q788.2 411.9 786.7 411.9L786.7 411.9Q785.0 411.9 784.1 412.6Q783.1 413.3 782.8 414.4L782.8 414.4L777.2 413.9Q777.6 411.9 778.9 410.5Q780.1 409.0 782.1 408.2Q784.1 407.4 786.7 407.4L786.7 407.4Q788.5 407.4 790.2 407.9Q791.8 408.3 793.1 409.2Q794.4 410.1 795.2 411.5Q795.9 412.9 795.9 414.8L795.9 414.8L795.9 429.5L790.2 429.5L790.2 426.5L790.0 426.5Q789.5 427.5 788.6 428.3Q787.8 429.1 786.5 429.5Q785.3 430.0 783.7 430.0ZM785.4 425.8L785.4 425.8Q786.7 425.8 787.8 425.2Q788.8 424.7 789.4 423.8Q789.9 422.9 789.9 421.7L789.9 421.7L789.9 419.4Q789.7 419.6 789.2 419.8Q788.7 419.9 788.1 420.0Q787.5 420.2 786.8 420.2Q786.2 420.3 785.7 420.4L785.7 420.4Q784.7 420.6 783.9 420.9Q783.1 421.3 782.6 421.8Q782.2 422.4 782.2 423.3L782.2 423.3Q782.2 424.5 783.1 425.1Q784.0 425.8 785.4 425.8ZM822.4 408.8L816.5 408.8Q816.4 407.1 815.1 406.2Q813.8 405.2 811.6 405.2L811.6 405.2Q810.1 405.2 809.0 405.6Q808.0 406.0 807.4 406.8Q806.9 407.5 806.9 408.5L806.9 408.5Q806.9 409.2 807.2 409.8Q807.6 410.4 808.2 410.8Q808.9 411.2 809.7 411.5Q810.6 411.8 811.5 412.1L811.5 412.1L814.1 412.7Q816.0 413.1 817.6 413.8Q819.2 414.5 820.4 415.6Q821.5 416.6 822.2 418.0Q822.8 419.4 822.8 421.2L822.8 421.2Q822.8 423.9 821.5 425.9Q820.1 427.8 817.6 428.9Q815.1 430.0 811.5 430.0L811.5 430.0Q808.0 430.0 805.4 428.9Q802.8 427.8 801.4 425.7Q799.9 423.6 799.8 420.4L799.8 420.4L805.8 420.4Q805.9 421.9 806.6 422.8Q807.4 423.8 808.6 424.3Q809.9 424.8 811.5 424.8L811.5 424.8Q813.0 424.8 814.2 424.3Q815.4 423.9 816.0 423.1Q816.6 422.3 816.6 421.2L816.6 421.2Q816.6 420.2 816.1 419.6Q815.5 418.9 814.4 418.4Q813.3 418.0 811.7 417.6L811.7 417.6L808.5 416.8Q804.8 415.9 802.7 414.0Q800.6 412.1 800.6 408.9L800.6 408.9Q800.6 406.2 802.0 404.2Q803.4 402.3 805.9 401.2Q808.4 400.1 811.6 400.1L811.6 400.1Q814.9 400.1 817.3 401.2Q819.7 402.3 821.0 404.2Q822.4 406.2 822.4 408.8L822.4 408.8ZM836.7 430.0L836.7 430.0Q833.3 430.0 830.9 428.5Q828.5 427.1 827.2 424.6Q826.0 422.0 826.0 418.7L826.0 418.7Q826.0 415.4 827.3 412.8Q828.6 410.3 831.0 408.9Q833.4 407.4 836.7 407.4L836.7 407.4Q839.5 407.4 841.7 408.5Q843.8 409.5 845.1 411.4Q846.3 413.3 846.4 415.8L846.4 415.8L840.7 415.8Q840.5 414.2 839.5 413.2Q838.4 412.2 836.8 412.2L836.8 412.2Q835.4 412.2 834.3 412.9Q833.3 413.7 832.7 415.1Q832.1 416.6 832.1 418.6L832.1 418.6Q832.1 420.7 832.7 422.2Q833.3 423.7 834.3 424.4Q835.4 425.2 836.8 425.2L836.8 425.2Q837.8 425.2 838.6 424.8Q839.5 424.3 840.0 423.5Q840.6 422.7 840.7 421.5L840.7 421.5L846.4 421.5Q846.3 424.0 845.1 425.9Q843.9 427.8 841.7 428.9Q839.6 430.0 836.7 430.0ZM856.4 429.5L850.3 429.5L850.3 407.7L856.2 407.7L856.2 411.5L856.4 411.5Q857.0 409.5 858.4 408.5Q859.8 407.4 861.7 407.4L861.7 407.4Q862.1 407.4 862.7 407.5Q863.2 407.5 863.6 407.6L863.6 407.6L863.6 413.0Q863.2 412.9 862.4 412.8Q861.6 412.7 861.0 412.7L861.0 412.7Q859.7 412.7 858.6 413.2Q857.6 413.8 857.0 414.8Q856.4 415.9 856.4 417.2L856.4 417.2L856.4 429.5ZM872.7 429.5L866.7 429.5L866.7 407.7L872.7 407.7L872.7 429.5ZM869.7 404.9L869.7 404.9Q868.4 404.9 867.4 404.0Q866.5 403.1 866.5 401.8L866.5 401.8Q866.5 400.6 867.4 399.7Q868.4 398.8 869.7 398.8L869.7 398.8Q871.1 398.8 872.0 399.7Q873.0 400.6 873.0 401.8L873.0 401.8Q873.0 403.1 872.0 404.0Q871.1 404.9 869.7 404.9ZM883.6 437.7L877.6 437.7L877.6 407.7L883.5 407.7L883.5 411.4L883.8 411.4Q884.2 410.5 885.0 409.6Q885.7 408.7 887.0 408.1Q888.2 407.4 890.0 407.4L890.0 407.4Q892.4 407.4 894.4 408.7Q896.4 409.9 897.6 412.4Q898.8 414.9 898.8 418.7L898.8 418.7Q898.8 422.3 897.7 424.8Q896.5 427.3 894.5 428.6Q892.5 429.9 890.0 429.9L890.0 429.9Q888.2 429.9 887.0 429.3Q885.8 428.7 885.0 427.8Q884.2 427.0 883.8 426.1L883.8 426.1L883.6 426.1L883.6 437.7ZM883.5 418.6L883.5 418.6Q883.5 420.6 884.0 422.0Q884.6 423.5 885.6 424.3Q886.6 425.1 888.1 425.1L888.1 425.1Q889.6 425.1 890.6 424.3Q891.6 423.5 892.1 422.0Q892.7 420.5 892.7 418.6L892.7 418.6Q892.7 416.7 892.1 415.3Q891.6 413.9 890.6 413.1Q889.6 412.3 888.1 412.3L888.1 412.3Q886.6 412.3 885.6 413.0Q884.6 413.8 884.0 415.3Q883.5 416.7 883.5 418.6ZM901.3 407.7L914.5 407.7L914.5 412.3L901.3 412.3L901.3 407.7ZM904.3 423.6L904.3 402.5L910.4 402.5L910.4 422.8Q910.4 423.7 910.6 424.1Q910.9 424.6 911.3 424.8Q911.8 425.0 912.4 425.0L912.4 425.0Q912.8 425.0 913.3 424.9Q913.7 424.8 913.9 424.8L913.9 424.8L914.9 429.3Q914.4 429.4 913.6 429.6Q912.8 429.8 911.6 429.8L911.6 429.8Q909.4 429.9 907.8 429.3Q906.1 428.6 905.2 427.2Q904.3 425.8 904.3 423.6L904.3 423.6Z " />' });
    __ASTRO_IMAGE_IMPORT_Z137H1Y = new Proxy({ "src": "/_astro/img-3.dD46bTsN.png", "width": 857, "height": 227, "format": "png" }, {
      get(target, name, receiver) {
        if (name === "clone") {
          return structuredClone(target);
        }
        if (name === "fsPath") {
          return "/Users/vivek/Desktop/self/myPortfolio/src/assets/blogs/reducing-bundle-size-in-react/img-3.png";
        }
        return target[name];
      }
    });
    __ASTRO_IMAGE_IMPORT_1w6XWJ = new Proxy({ "src": "/_astro/img-4.B-K6LAT2.gif", "width": 1280, "height": 720, "format": "gif" }, {
      get(target, name, receiver) {
        if (name === "clone") {
          return structuredClone(target);
        }
        if (name === "fsPath") {
          return "/Users/vivek/Desktop/self/myPortfolio/src/assets/blogs/reducing-bundle-size-in-react/img-4.gif";
        }
        return target[name];
      }
    });
    __ASTRO_IMAGE_IMPORT_aqbXV = createSvgComponent({ "meta": { "src": "/_astro/cover-2.B6gX_Z1C.svg", "width": 128, "height": 128, "format": "svg" }, "attributes": { "viewBox": "0 0 128 128" }, "children": '<g fill="#61DAFB"><circle cx="64" cy="64" r="11.4" /><path d="M107.3 45.2c-2.2-.8-4.5-1.6-6.9-2.3.6-2.4 1.1-4.8 1.5-7.1 2.1-13.2-.2-22.5-6.6-26.1-1.9-1.1-4-1.6-6.4-1.6-7 0-15.9 5.2-24.9 13.9-9-8.7-17.9-13.9-24.9-13.9-2.4 0-4.5.5-6.4 1.6-6.4 3.7-8.7 13-6.6 26.1.4 2.3.9 4.7 1.5 7.1-2.4.7-4.7 1.4-6.9 2.3C8.2 50 1.4 56.6 1.4 64s6.9 14 19.3 18.8c2.2.8 4.5 1.6 6.9 2.3-.6 2.4-1.1 4.8-1.5 7.1-2.1 13.2.2 22.5 6.6 26.1 1.9 1.1 4 1.6 6.4 1.6 7.1 0 16-5.2 24.9-13.9 9 8.7 17.9 13.9 24.9 13.9 2.4 0 4.5-.5 6.4-1.6 6.4-3.7 8.7-13 6.6-26.1-.4-2.3-.9-4.7-1.5-7.1 2.4-.7 4.7-1.4 6.9-2.3 12.5-4.8 19.3-11.4 19.3-18.8s-6.8-14-19.3-18.8zM92.5 14.7c4.1 2.4 5.5 9.8 3.8 20.3-.3 2.1-.8 4.3-1.4 6.6-5.2-1.2-10.7-2-16.5-2.5-3.4-4.8-6.9-9.1-10.4-13 7.4-7.3 14.9-12.3 21-12.3 1.3 0 2.5.3 3.5.9zM81.3 74c-1.8 3.2-3.9 6.4-6.1 9.6-3.7.3-7.4.4-11.2.4-3.9 0-7.6-.1-11.2-.4-2.2-3.2-4.2-6.4-6-9.6-1.9-3.3-3.7-6.7-5.3-10 1.6-3.3 3.4-6.7 5.3-10 1.8-3.2 3.9-6.4 6.1-9.6 3.7-.3 7.4-.4 11.2-.4 3.9 0 7.6.1 11.2.4 2.2 3.2 4.2 6.4 6 9.6 1.9 3.3 3.7 6.7 5.3 10-1.7 3.3-3.4 6.6-5.3 10zm8.3-3.3c1.5 3.5 2.7 6.9 3.8 10.3-3.4.8-7 1.4-10.8 1.9 1.2-1.9 2.5-3.9 3.6-6 1.2-2.1 2.3-4.2 3.4-6.2zM64 97.8c-2.4-2.6-4.7-5.4-6.9-8.3 2.3.1 4.6.2 6.9.2 2.3 0 4.6-.1 6.9-.2-2.2 2.9-4.5 5.7-6.9 8.3zm-18.6-15c-3.8-.5-7.4-1.1-10.8-1.9 1.1-3.3 2.3-6.8 3.8-10.3 1.1 2 2.2 4.1 3.4 6.1 1.2 2.2 2.4 4.1 3.6 6.1zm-7-25.5c-1.5-3.5-2.7-6.9-3.8-10.3 3.4-.8 7-1.4 10.8-1.9-1.2 1.9-2.5 3.9-3.6 6-1.2 2.1-2.3 4.2-3.4 6.2zM64 30.2c2.4 2.6 4.7 5.4 6.9 8.3-2.3-.1-4.6-.2-6.9-.2-2.3 0-4.6.1-6.9.2 2.2-2.9 4.5-5.7 6.9-8.3zm22.2 21l-3.6-6c3.8.5 7.4 1.1 10.8 1.9-1.1 3.3-2.3 6.8-3.8 10.3-1.1-2.1-2.2-4.2-3.4-6.2zM31.7 35c-1.7-10.5-.3-17.9 3.8-20.3 1-.6 2.2-.9 3.5-.9 6 0 13.5 4.9 21 12.3-3.5 3.8-7 8.2-10.4 13-5.8.5-11.3 1.4-16.5 2.5-.6-2.3-1-4.5-1.4-6.6zM7 64c0-4.7 5.7-9.7 15.7-13.4 2-.8 4.2-1.5 6.4-2.1 1.6 5 3.6 10.3 6 15.6-2.4 5.3-4.5 10.5-6 15.5C15.3 75.6 7 69.6 7 64zm28.5 49.3c-4.1-2.4-5.5-9.8-3.8-20.3.3-2.1.8-4.3 1.4-6.6 5.2 1.2 10.7 2 16.5 2.5 3.4 4.8 6.9 9.1 10.4 13-7.4 7.3-14.9 12.3-21 12.3-1.3 0-2.5-.3-3.5-.9zM96.3 93c1.7 10.5.3 17.9-3.8 20.3-1 .6-2.2.9-3.5.9-6 0-13.5-4.9-21-12.3 3.5-3.8 7-8.2 10.4-13 5.8-.5 11.3-1.4 16.5-2.5.6 2.3 1 4.5 1.4 6.6zm9-15.6c-2 .8-4.2 1.5-6.4 2.1-1.6-5-3.6-10.3-6-15.6 2.4-5.3 4.5-10.5 6-15.5 13.8 4 22.1 10 22.1 15.6 0 4.7-5.8 9.7-15.7 13.4z" /></g>' });
    __ASTRO_IMAGE_IMPORT_Z1qG6HI = new Proxy({ "src": "/_astro/img-1.C8BBGdYj.webp", "width": 2e3, "height": 2183, "format": "webp" }, {
      get(target, name, receiver) {
        if (name === "clone") {
          return structuredClone(target);
        }
        if (name === "fsPath") {
          return "/Users/vivek/Desktop/self/myPortfolio/src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-1.webp";
        }
        return target[name];
      }
    });
    __ASTRO_IMAGE_IMPORT_Z1i0T6t = new Proxy({ "src": "/_astro/img-2.DsZnEnE8.webp", "width": 640, "height": 535, "format": "webp" }, {
      get(target, name, receiver) {
        if (name === "clone") {
          return structuredClone(target);
        }
        if (name === "fsPath") {
          return "/Users/vivek/Desktop/self/myPortfolio/src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-2.webp";
        }
        return target[name];
      }
    });
    __ASTRO_IMAGE_IMPORT_Z19kGue = new Proxy({ "src": "/_astro/img-3.BpraL8Ee.webp", "width": 2e3, "height": 2124, "format": "webp" }, {
      get(target, name, receiver) {
        if (name === "clone") {
          return structuredClone(target);
        }
        if (name === "fsPath") {
          return "/Users/vivek/Desktop/self/myPortfolio/src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-3.webp";
        }
        return target[name];
      }
    });
    __ASTRO_IMAGE_IMPORT_Z10EtRY = new Proxy({ "src": "/_astro/img-4.D6vkjjnC.webp", "width": 828, "height": 192, "format": "webp" }, {
      get(target, name, receiver) {
        if (name === "clone") {
          return structuredClone(target);
        }
        if (name === "fsPath") {
          return "/Users/vivek/Desktop/self/myPortfolio/src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-4.webp";
        }
        return target[name];
      }
    });
    __ASTRO_IMAGE_IMPORT_ZQYhgJ = new Proxy({ "src": "/_astro/img-5.CPTcMdp6.webp", "width": 2e3, "height": 1042, "format": "webp" }, {
      get(target, name, receiver) {
        if (name === "clone") {
          return structuredClone(target);
        }
        if (name === "fsPath") {
          return "/Users/vivek/Desktop/self/myPortfolio/src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-5.webp";
        }
        return target[name];
      }
    });
    __ASTRO_IMAGE_IMPORT_ZzCR3f = new Proxy({ "src": "/_astro/img-7.DM88jFxc.webp", "width": 2e3, "height": 2061, "format": "webp" }, {
      get(target, name, receiver) {
        if (name === "clone") {
          return structuredClone(target);
        }
        if (name === "fsPath") {
          return "/Users/vivek/Desktop/self/myPortfolio/src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-7.webp";
        }
        return target[name];
      }
    });
    __ASTRO_IMAGE_IMPORT_ZqWEr0 = new Proxy({ "src": "/_astro/img-8.BzygR3tF.webp", "width": 1034, "height": 543, "format": "webp" }, {
      get(target, name, receiver) {
        if (name === "clone") {
          return structuredClone(target);
        }
        if (name === "fsPath") {
          return "/Users/vivek/Desktop/self/myPortfolio/src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-8.webp";
        }
        return target[name];
      }
    });
    __ASTRO_IMAGE_IMPORT_ZihrOK = new Proxy({ "src": "/_astro/img-9.CAHRrZmY.webp", "width": 2e3, "height": 2104, "format": "webp" }, {
      get(target, name, receiver) {
        if (name === "clone") {
          return structuredClone(target);
        }
        if (name === "fsPath") {
          return "/Users/vivek/Desktop/self/myPortfolio/src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-9.webp";
        }
        return target[name];
      }
    });
    __ASTRO_IMAGE_IMPORT_zlmGu = new Proxy({ "src": "/_astro/img-8.BzygR3tF.webp", "width": 1034, "height": 543, "format": "webp" }, {
      get(target, name, receiver) {
        if (name === "clone") {
          return structuredClone(target);
        }
        if (name === "fsPath") {
          return "/Users/vivek/Desktop/self/myPortfolio/src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-10.webp";
        }
        return target[name];
      }
    });
    __ASTRO_IMAGE_IMPORT_1e3WdJ = createSvgComponent({ "meta": { "src": "/_astro/cover-1.BHmZGZRv.svg", "width": 819, "height": 269, "format": "svg" }, "attributes": { "width": "819", "height": "269", "viewBox": "0 0 819 269", "fill": "none" }, "children": '\n<g filter="url(#filter0_dd_3_93)">\n<path d="M583.592 97.7797V228H630.538V97.7797H583.592ZM583.302 85.5167H630.828V44.0565H583.302V85.5167Z" fill="#FFF7FF" />\n</g>\n<g filter="url(#filter1_dd_3_93)">\n<path fill-rule="evenodd" clip-rule="evenodd" d="M193.744 183.947C195.387 205.214 195.387 215.183 195.387 226.065H146.558C146.558 223.694 146.6 221.526 146.642 219.327C146.774 212.492 146.912 205.365 145.813 190.971C144.361 169.899 135.356 165.216 118.798 165.216H104.128H42V126.876H121.122C142.037 126.876 152.494 120.464 152.494 103.489C152.494 88.5626 142.037 79.5172 121.122 79.5172H42V42H129.836C177.186 42 200.716 64.5359 200.716 100.535C200.716 127.461 184.158 145.021 161.79 147.948C180.672 151.753 191.71 162.582 193.744 183.947Z" fill="#E8F2FF" />\n<path d="M42 226.064V197.483H93.6297C102.254 197.483 104.126 203.928 104.126 207.772V226.064H42Z" fill="#E8F2FF" />\n</g>\n<g filter="url(#filter2_dd_3_93)">\n<path d="M782.943 97.5244H734.548L712.523 128.474L691.079 97.5244H639.206L685.862 161.467L635.148 227.745H683.544L709.336 192.416L735.127 227.745H787L735.996 159.423L782.943 97.5244Z" fill="#FFF0F1" />\n</g>\n<g filter="url(#filter3_dd_3_93)">\n<path d="M478.111 119.105C472.605 103.922 460.723 93.4114 437.83 93.4114C418.414 93.4114 404.504 102.171 397.549 116.477V96.9151H350.602V227.135H397.549V163.193C397.549 143.631 403.055 130.784 418.414 130.784C432.614 130.784 436.091 140.127 436.091 157.938V227.135H483.038V163.193C483.038 143.631 488.254 130.784 503.903 130.784C518.102 130.784 521.29 140.127 521.29 157.938V227.135H568.237V145.383C568.237 118.229 557.804 93.4114 522.16 93.4114C500.425 93.4114 485.066 104.506 478.111 119.105Z" fill="#FFFAEA" />\n</g>\n<g filter="url(#filter4_dd_3_93)">\n<path d="M301.716 176.598C297.369 186.818 289.255 191.197 276.504 191.197C262.304 191.197 250.712 183.606 249.553 167.547H340.258V154.408C340.258 119.08 317.365 89.2982 274.185 89.2982C233.904 89.2982 203.766 118.788 203.766 159.956C203.766 201.416 233.325 226.526 274.765 226.526C308.961 226.526 332.724 209.883 339.389 180.102L301.716 176.598ZM250.133 144.773C251.871 132.51 258.537 123.167 273.606 123.167C287.516 123.167 295.05 133.094 295.63 144.773H250.133Z" fill="#F1FFF0" />\n</g>\n<defs>\n<filter id="filter0_dd_3_93" x="555.302" y="16.0565" width="103.526" height="239.944" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">\n<feFlood flood-opacity="0" result="BackgroundImageFix" />\n<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />\n<feOffset />\n<feGaussianBlur stdDeviation="14" />\n<feComposite in2="hardAlpha" operator="out" />\n<feColorMatrix type="matrix" values="0 0 0 0 0.847059 0 0 0 0 0.231373 0 0 0 0 0.823529 0 0 0 1 0" />\n<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3_93" />\n<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />\n<feOffset />\n<feGaussianBlur stdDeviation="14" />\n<feComposite in2="hardAlpha" operator="out" />\n<feColorMatrix type="matrix" values="0 0 0 0 0.847059 0 0 0 0 0.231373 0 0 0 0 0.823529 0 0 0 1 0" />\n<feBlend mode="normal" in2="effect1_dropShadow_3_93" result="effect2_dropShadow_3_93" />\n<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_3_93" result="shape" />\n</filter>\n<filter id="filter1_dd_3_93" x="0" y="0" width="242.715" height="268.065" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">\n<feFlood flood-opacity="0" result="BackgroundImageFix" />\n<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />\n<feOffset />\n<feGaussianBlur stdDeviation="21" />\n<feComposite in2="hardAlpha" operator="out" />\n<feColorMatrix type="matrix" values="0 0 0 0 0.223529 0 0 0 0 0.572549 0 0 0 0 1 0 0 0 1 0" />\n<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3_93" />\n<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />\n<feOffset />\n<feGaussianBlur stdDeviation="14" />\n<feComposite in2="hardAlpha" operator="out" />\n<feColorMatrix type="matrix" values="0 0 0 0 0.223529 0 0 0 0 0.572549 0 0 0 0 1 0 0 0 0.9 0" />\n<feBlend mode="normal" in2="effect1_dropShadow_3_93" result="effect2_dropShadow_3_93" />\n<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_3_93" result="shape" />\n</filter>\n<filter id="filter2_dd_3_93" x="603.148" y="65.5244" width="215.852" height="194.22" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">\n<feFlood flood-opacity="0" result="BackgroundImageFix" />\n<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />\n<feOffset />\n<feGaussianBlur stdDeviation="14" />\n<feComposite in2="hardAlpha" operator="out" />\n<feColorMatrix type="matrix" values="0 0 0 0 0.960784 0 0 0 0 0.2 0 0 0 0 0.258824 0 0 0 1 0" />\n<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3_93" />\n<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />\n<feOffset />\n<feGaussianBlur stdDeviation="16" />\n<feComposite in2="hardAlpha" operator="out" />\n<feColorMatrix type="matrix" values="0 0 0 0 0.960784 0 0 0 0 0.2 0 0 0 0 0.258824 0 0 0 1 0" />\n<feBlend mode="normal" in2="effect1_dropShadow_3_93" result="effect2_dropShadow_3_93" />\n<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_3_93" result="shape" />\n</filter>\n<filter id="filter3_dd_3_93" x="322.602" y="65.4114" width="273.635" height="189.724" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">\n<feFlood flood-opacity="0" result="BackgroundImageFix" />\n<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />\n<feOffset />\n<feGaussianBlur stdDeviation="14" />\n<feComposite in2="hardAlpha" operator="out" />\n<feColorMatrix type="matrix" values="0 0 0 0 0.996078 0 0 0 0 0.8 0 0 0 0 0.105882 0 0 0 1 0" />\n<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3_93" />\n<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />\n<feOffset />\n<feGaussianBlur stdDeviation="14" />\n<feComposite in2="hardAlpha" operator="out" />\n<feColorMatrix type="matrix" values="0 0 0 0 0.996078 0 0 0 0 0.8 0 0 0 0 0.105882 0 0 0 1 0" />\n<feBlend mode="normal" in2="effect1_dropShadow_3_93" result="effect2_dropShadow_3_93" />\n<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_3_93" result="shape" />\n</filter>\n<filter id="filter4_dd_3_93" x="175.766" y="61.2982" width="192.493" height="193.228" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">\n<feFlood flood-opacity="0" result="BackgroundImageFix" />\n<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />\n<feOffset />\n<feGaussianBlur stdDeviation="14" />\n<feComposite in2="hardAlpha" operator="out" />\n<feColorMatrix type="matrix" values="0 0 0 0 0.419608 0 0 0 0 0.85098 0 0 0 0 0.407843 0 0 0 1 0" />\n<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_3_93" />\n<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />\n<feOffset />\n<feGaussianBlur stdDeviation="14" />\n<feComposite in2="hardAlpha" operator="out" />\n<feColorMatrix type="matrix" values="0 0 0 0 0.419608 0 0 0 0 0.85098 0 0 0 0 0.407843 0 0 0 1 0" />\n<feBlend mode="normal" in2="effect1_dropShadow_3_93" result="effect2_dropShadow_3_93" />\n<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_3_93" result="shape" />\n</filter>\n</defs>\n' });
    __ASTRO_IMAGE_IMPORT_Z208eja = new Proxy({ "src": "/_astro/img-1.B9FylZgI.jpeg", "width": 1e3, "height": 420, "format": "jpg" }, {
      get(target, name, receiver) {
        if (name === "clone") {
          return structuredClone(target);
        }
        if (name === "fsPath") {
          return "/Users/vivek/Desktop/self/myPortfolio/src/assets/blogs/this-bind-arrow-fns-js/img-1.jpeg";
        }
        return target[name];
      }
    });
    __ASTRO_IMAGE_IMPORT_11GqMf = new Proxy({ "src": "/_astro/img-2.XZm3Ra8g.png", "width": 1293, "height": 667, "format": "png" }, {
      get(target, name, receiver) {
        if (name === "clone") {
          return structuredClone(target);
        }
        if (name === "fsPath") {
          return "/Users/vivek/Desktop/self/myPortfolio/src/assets/blogs/this-bind-arrow-fns-js/img-2.png";
        }
        return target[name];
      }
    });
    __ASTRO_IMAGE_IMPORT_1vYFOl = new Proxy({ "src": "/_astro/img-3.OyDLVPms.png", "width": 1293, "height": 673, "format": "png" }, {
      get(target, name, receiver) {
        if (name === "clone") {
          return structuredClone(target);
        }
        if (name === "fsPath") {
          return "/Users/vivek/Desktop/self/myPortfolio/src/assets/blogs/this-bind-arrow-fns-js/img-3.png";
        }
        return target[name];
      }
    });
    __ASTRO_IMAGE_IMPORT_21hUQr = new Proxy({ "src": "/_astro/img-4.cLFh3ago.png", "width": 1293, "height": 673, "format": "png" }, {
      get(target, name, receiver) {
        if (name === "clone") {
          return structuredClone(target);
        }
        if (name === "fsPath") {
          return "/Users/vivek/Desktop/self/myPortfolio/src/assets/blogs/this-bind-arrow-fns-js/img-4.png";
        }
        return target[name];
      }
    });
    __ASTRO_IMAGE_IMPORT_Z1pHfd = createSvgComponent({ "meta": { "src": "/_astro/cover-3.DUSvsGXI.svg", "width": 1200, "height": 600, "format": "svg" }, "attributes": { "width": "1200", "height": "600", "viewBox": "0 0 1200 600" }, "children": '<defs><pattern id="satori_pattern_id_1" x="0" y="0" width="0.08333333333333333" height="0.16666666666666666" patternUnits="objectBoundingBox"><radialGradient id="satori_radial_id_1"><stop offset="0" stop-color="lightgray" /><stop offset="0.02" stop-color="lightgray" /><stop offset="0" stop-color="transparent" /><stop offset="1" stop-color="transparent" /></radialGradient><mask id="satori_mask_id_1"><rect x="0" y="0" width="100" height="100" fill="#fff" /></mask><rect x="0" y="0" width="100" height="100" fill="transparent" /><circle cx="75" cy="75" width="100" height="100" r="106.06601717798213" fill="url(#satori_radial_id_1)" mask="url(#satori_mask_id_1)" /></pattern><pattern id="satori_pattern_id_0" x="0" y="0" width="0.08333333333333333" height="0.16666666666666666" patternUnits="objectBoundingBox"><radialGradient id="satori_radial_id_0"><stop offset="0" stop-color="lightgray" /><stop offset="0.02" stop-color="lightgray" /><stop offset="0" stop-color="transparent" /><stop offset="1" stop-color="transparent" /></radialGradient><mask id="satori_mask_id_0"><rect x="0" y="0" width="100" height="100" fill="#fff" /></mask><rect x="0" y="0" width="100" height="100" fill="transparent" /><circle cx="25" cy="25" width="100" height="100" r="106.06601717798213" fill="url(#satori_radial_id_0)" mask="url(#satori_mask_id_0)" /></pattern></defs><mask id="satori_om-id"><rect x="0" y="0" width="1200" height="600" fill="#fff" /></mask><rect x="0" y="0" width="1200" height="600" fill="white" /><rect x="0" y="0" width="1200" height="600" fill="url(#satori_pattern_id_1)" /><rect x="0" y="0" width="1200" height="600" fill="url(#satori_pattern_id_0)" /><mask id="satori_om-id-0"><rect x="500" y="113" width="200" height="200" fill="#fff" /></mask><clipPath id="satori_cp-id-0-0"><rect x="500" y="113" width="200" height="200" /></clipPath><mask id="satori_om-id-0-0"><rect x="500" y="113" width="200" height="200" fill="#fff" /></mask><image x="500" y="113" width="200" height="200" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABBwAAAQcCAMAAAABRXg3AAAC1lBMVEXw208yMzDz43j8+eOhlUK+r0bv2k7u2U7s104zNDA6OjE0NTDt2E43NzDt2U41NjDn003ey0xMSjTo1E3q1k40NDB+djzVw0o2NjBDQjLk0E03ODDgzUzr107Uwkrq1U48PDHp1U1mYTjjz0zTwUo7OzGAeDxGRTPYxkvdyktdWTfEtEfPvkk9PDFSTzV7dDxeWjfm0k27rEbiz0xAQDKYjUBGRDNLSTRAPzLYxUvGtkjfzEw4ODE5OTFOTDTl0U3cyUujl0JBQDJNSzSJgD5KSDQ9PTF9dTzax0uMgz5PTDTKuUi5qkanm0N6cjs+PjKDej2xo0RgXDd5cjtXUzY/PjLLuknXxUrRv0pJSDOPhj+ypEXk0U1PTTTMu0lEQzO3qEWKgT5oYziGfj1VUTVYVDakl0KPhT9aVzbbyEuDez1YVTaVikBxazqpnUPQv0mEfD2+rkZiXTfKuki1pkWsn0PAsEdpYziWi0CekkFQTjRjXzirnkPOvUm6q0bSwEquoUThzkxbVzZ4cDtgWzdHRjNCQTKvoUSHfj2mmkNsZjnBsUefk0GzpUWpnEPFtUimmUKkmEJrZTmUiUBcWDa4qUW9rka8rUaaj0GilkKRhz+Qhj+Vi0CBeT1RTjVvaTqNhD7hzUyMgj6ek0F3cDtsZzlVUjXWxEqOhD9TUDXHtkjMvEluaDl8dDxzbDqXjEB1bjpUUTWGfT1aVjZWUzWTiT9qZTm0pkWwo0SglEHSwUqSiD+bkEGvokTZx0tZVTabj0GShz9lYDhwajq4qkZFRDPbyUt0bTpfWzeqnUOckUG1p0WFfD1JRzNkXziLgj6om0PJuEh/dzy/sEd1bjvDs0dIRjOsn0SypESIfz6toETNvEl4cTudkUFybDq2qEV7cztjXjhvaTnIuEhyazp2bzttZznCskelmUKCej3Ht0hpZDnBskdnYjhhXTeZjkD9+ur///8nV2MOAAAlAUlEQVR4XuzAgQAAAAACoP1tN1hghEoPgLFTxyYMQgEABQNJkVYIuoC4ioiQxtIldIY0SS3YpNEB3OGPYKm1lVukDjhAIHfdW+CdDgCcvwrAHABzAMwBMAfAHABzAMwBMAfAHABzAMwBMAcAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAcwAwB8AcAHMAzAEwB8AcAHMAzAEwB8AcAHMAzAHAHABzAMwBMAfAHABzAMwBMAfAHABzAMwBMAcAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAcwAwB8AcAHMAzAEwB8AcAHMAzAEwB8AcAHMAzAHAHABzAMwBMAfAHABzAMwBMAfAHABzAMwBMAcAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAzAEwB8AcAHMAzAEwB8AcAHMAzAEwB8AcAHMAzAHAHABzAMwBMAfAHABzAMwBMAfAHABzAMwBMAcAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAzAEwB8AcAHMAzAEwB8AcAHMAzAEwB8AcAHMAzAHAHABzAMwBMAfAHABzAMwBMAfAHABzAMwBMAcAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAzAEwB8AcAHMAzAEwB8AcAHMAzAEwB8AcAHMAMAfAHABzAMwBMAfAHABzAMwBMAfAHABzAMwBMAcAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAzAEwB8AcAHMAzAEwB8AcAHMAzAEwB8AcAHMAMAfAHABzAMwBMAfAHABzAMwBMAfAHABzAMwBMAcAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAzAEwB+CIOQC/OAfAHABzAMwBMAcAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAzAEwB8AcAHMAzAEwB8AcAHMAzAEwB8AcAHMAMAfAHABzAMwBMAfAHABzAMwBMAfAHABzAMwBMAcAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAzAEwB8AcAHMAzAEwB8AcAHMAzAEwB8AcAHMAMAfAHABzAMwBMAfAHABzAMwBMAfAHABzAMwBMAcAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAzAEwB8AcAHMAzAEwB8AcAHMAzAEwB8AcAHMAMAfAHABzAMwBMAfAHABzAMwBMAfAHABzAMwBwBwAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAzAEwB8AcAHMAzAEwB8AcAHMAzAEwB8AcAHMAMAfAHABzAMwBMAfAHABzAMwBMAfAHABzAMwBwBwAcwDMATAHwBwAcwDMATAHwBwAcwDMATAHwBwAzAEw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" preserveAspectRatio="none" clip-path="url(#satori_cp-id-0-0)" mask="url(#satori_om-id-0-0)" /><mask id="satori_om-id-1"><rect x="0" y="343" width="1200" height="144" fill="#fff" /></mask><mask id="satori_om-id-1-0"><rect x="0" y="343" width="1200" height="144" fill="#fff" /></mask><path fill="black" d="M56.7 374.6L56.7 374.6L50.5 374.6Q50.3 373.4 49.8 372.5Q49.3 371.5 48.4 370.9Q47.6 370.2 46.5 369.9Q45.5 369.5 44.2 369.5L44.2 369.5Q42.0 369.5 40.3 370.6Q38.6 371.7 37.7 373.9Q36.8 376.0 36.8 379L36.8 379Q36.8 382.1 37.7 384.2Q38.6 386.3 40.3 387.4Q42.0 388.5 44.2 388.5L44.2 388.5Q45.4 388.5 46.5 388.2Q47.5 387.8 48.4 387.2Q49.2 386.6 49.7 385.7Q50.3 384.8 50.5 383.6L50.5 383.6L56.7 383.6Q56.5 385.6 55.5 387.5Q54.5 389.3 52.9 390.8Q51.3 392.3 49.1 393.1Q46.9 393.9 44.1 393.9L44.1 393.9Q40.2 393.9 37.1 392.2Q34.1 390.4 32.3 387.1Q30.5 383.7 30.5 379L30.5 379Q30.5 374.2 32.3 370.9Q34.1 367.6 37.2 365.8Q40.2 364.1 44.1 364.1L44.1 364.1Q46.6 364.1 48.8 364.8Q50.9 365.5 52.6 366.8Q54.3 368.2 55.3 370.2Q56.4 372.1 56.7 374.6ZM70.9 394.0L70.9 394.0Q67.6 394.0 65.1 392.6Q62.7 391.1 61.4 388.6Q60.1 386.1 60.1 382.7L60.1 382.7Q60.1 379.3 61.4 376.8Q62.7 374.3 65.1 372.9Q67.6 371.4 70.9 371.4L70.9 371.4Q74.2 371.4 76.6 372.9Q79.0 374.3 80.3 376.8Q81.6 379.3 81.6 382.7L81.6 382.7Q81.6 386.1 80.3 388.6Q79.0 391.1 76.6 392.6Q74.2 394.0 70.9 394.0ZM70.9 389.3L70.9 389.3Q72.4 389.3 73.4 388.4Q74.4 387.6 74.9 386.1Q75.5 384.6 75.5 382.7L75.5 382.7Q75.5 380.8 74.9 379.3Q74.4 377.8 73.4 376.9Q72.4 376.1 70.9 376.1L70.9 376.1Q69.4 376.1 68.3 376.9Q67.3 377.8 66.8 379.3Q66.3 380.8 66.3 382.7L66.3 382.7Q66.3 384.6 66.8 386.1Q67.3 387.6 68.3 388.4Q69.4 389.3 70.9 389.3ZM91.6 380.9L91.6 380.9L91.6 393.5L85.6 393.5L85.6 371.7L91.3 371.7L91.3 375.6L91.6 375.6Q92.3 373.7 94.0 372.6Q95.7 371.4 98.1 371.4L98.1 371.4Q100.4 371.4 102.1 372.4Q103.8 373.4 104.7 375.3Q105.7 377.1 105.7 379.7L105.7 379.7L105.7 393.5L99.6 393.5L99.6 380.7Q99.6 378.7 98.6 377.6Q97.6 376.5 95.7 376.5L95.7 376.5Q94.5 376.5 93.6 377.0Q92.7 377.5 92.1 378.5Q91.6 379.5 91.6 380.9ZM116.5 380.9L116.5 380.9L116.5 393.5L110.4 393.5L110.4 371.7L116.2 371.7L116.2 375.6L116.4 375.6Q117.2 373.7 118.9 372.6Q120.6 371.4 123.0 371.4L123.0 371.4Q125.3 371.4 127.0 372.4Q128.7 373.4 129.6 375.3Q130.5 377.1 130.5 379.7L130.5 379.7L130.5 393.5L124.5 393.5L124.5 380.7Q124.5 378.7 123.5 377.6Q122.4 376.5 120.6 376.5L120.6 376.5Q119.4 376.5 118.5 377.0Q117.5 377.5 117.0 378.5Q116.5 379.5 116.5 380.9ZM145.2 394.0L145.2 394.0Q141.9 394.0 139.5 392.6Q137.0 391.2 135.7 388.7Q134.4 386.2 134.4 382.7L134.4 382.7Q134.4 379.4 135.7 376.8Q137.0 374.3 139.4 372.9Q141.8 371.4 145.0 371.4L145.0 371.4Q147.2 371.4 149.0 372.1Q150.9 372.8 152.3 374.2Q153.7 375.6 154.5 377.7Q155.3 379.7 155.3 382.5L155.3 382.5L155.3 384.2L136.8 384.2L136.8 380.4L149.6 380.4Q149.6 379.1 149.0 378.1Q148.4 377.1 147.4 376.5Q146.4 376.0 145.1 376.0L145.1 376.0Q143.7 376.0 142.7 376.6Q141.6 377.2 141.0 378.3Q140.4 379.3 140.4 380.6L140.4 380.6L140.4 384.2Q140.4 385.8 141.0 387.0Q141.6 388.2 142.7 388.8Q143.8 389.5 145.3 389.5L145.3 389.5Q146.3 389.5 147.2 389.2Q148.0 388.9 148.6 388.3Q149.2 387.8 149.5 386.9L149.5 386.9L155.1 387.3Q154.7 389.3 153.4 390.8Q152.1 392.3 150.0 393.1Q147.9 394.0 145.2 394.0ZM169.1 394.0L169.1 394.0Q165.7 394.0 163.3 392.5Q160.9 391.1 159.6 388.6Q158.3 386.0 158.3 382.7L158.3 382.7Q158.3 379.4 159.6 376.8Q160.9 374.3 163.3 372.9Q165.7 371.4 169.0 371.4L169.0 371.4Q171.9 371.4 174.0 372.5Q176.2 373.5 177.4 375.4Q178.7 377.3 178.8 379.8L178.8 379.8L173.1 379.8Q172.9 378.2 171.8 377.2Q170.8 376.2 169.1 376.2L169.1 376.2Q167.7 376.2 166.7 376.9Q165.6 377.7 165.1 379.1Q164.5 380.6 164.5 382.6L164.5 382.6Q164.5 384.7 165.0 386.2Q165.6 387.7 166.7 388.4Q167.7 389.2 169.1 389.2L169.1 389.2Q170.2 389.2 171.0 388.8Q171.8 388.3 172.4 387.5Q172.9 386.7 173.1 385.5L173.1 385.5L178.8 385.5Q178.7 388.0 177.5 389.9Q176.2 391.8 174.1 392.9Q172.0 394.0 169.1 394.0ZM181.2 371.7L194.3 371.7L194.3 376.3L181.2 376.3L181.2 371.7ZM184.1 387.6L184.1 366.5L190.2 366.5L190.2 386.8Q190.2 387.7 190.5 388.1Q190.7 388.6 191.2 388.8Q191.6 389.0 192.2 389.0L192.2 389.0Q192.7 389.0 193.1 388.9Q193.5 388.8 193.7 388.8L193.7 388.8L194.7 393.3Q194.2 393.4 193.4 393.6Q192.6 393.8 191.4 393.8L191.4 393.8Q189.2 393.9 187.6 393.3Q186.0 392.6 185.0 391.2Q184.1 389.8 184.1 387.6L184.1 387.6ZM204.3 393.5L198.2 393.5L198.2 371.7L204.3 371.7L204.3 393.5ZM201.3 368.9L201.3 368.9Q199.9 368.9 199.0 368.0Q198.0 367.1 198.0 365.8L198.0 365.8Q198.0 364.6 199.0 363.7Q199.9 362.8 201.3 362.8L201.3 362.8Q202.6 362.8 203.6 363.7Q204.5 364.6 204.5 365.8L204.5 365.8Q204.5 367.1 203.6 368.0Q202.6 368.9 201.3 368.9ZM215.2 380.9L215.2 380.9L215.2 393.5L209.1 393.5L209.1 371.7L214.9 371.7L214.9 375.6L215.1 375.6Q215.9 373.7 217.6 372.6Q219.3 371.4 221.7 371.4L221.7 371.4Q224.0 371.4 225.7 372.4Q227.4 373.4 228.3 375.3Q229.2 377.1 229.2 379.7L229.2 379.7L229.2 393.5L223.2 393.5L223.2 380.7Q223.2 378.7 222.2 377.6Q221.1 376.5 219.3 376.5L219.3 376.5Q218.1 376.5 217.2 377.0Q216.2 377.5 215.7 378.5Q215.2 379.5 215.2 380.9ZM243.8 402.2L243.8 402.2Q240.9 402.2 238.8 401.4Q236.7 400.6 235.5 399.2Q234.2 397.8 233.8 396.1L233.8 396.1L239.4 395.3Q239.7 396.0 240.3 396.6Q240.8 397.1 241.7 397.5Q242.6 397.8 244.0 397.8L244.0 397.8Q245.9 397.8 247.2 396.9Q248.5 395.9 248.5 393.7L248.5 393.7L248.5 389.7L248.3 389.7Q247.9 390.6 247.1 391.4Q246.3 392.2 245.0 392.7Q243.8 393.2 242.0 393.2L242.0 393.2Q239.6 393.2 237.6 392.1Q235.6 390.9 234.4 388.6Q233.2 386.2 233.2 382.6L233.2 382.6Q233.2 378.9 234.4 376.4Q235.6 373.9 237.6 372.7Q239.6 371.4 242.0 371.4L242.0 371.4Q243.8 371.4 245.1 372.1Q246.3 372.7 247.1 373.6Q247.8 374.5 248.3 375.4L248.3 375.4L248.5 375.4L248.5 371.7L254.5 371.7L254.5 393.8Q254.5 396.5 253.1 398.4Q251.8 400.3 249.4 401.2Q246.9 402.2 243.8 402.2ZM243.9 388.7L243.9 388.7Q245.4 388.7 246.4 388.0Q247.4 387.2 248.0 385.9Q248.5 384.5 248.5 382.6L248.5 382.6Q248.5 380.6 248.0 379.2Q247.5 377.8 246.4 377.0Q245.4 376.3 243.9 376.3L243.9 376.3Q242.5 376.3 241.4 377.1Q240.4 377.9 239.9 379.3Q239.4 380.7 239.4 382.6L239.4 382.6Q239.4 384.5 239.9 385.8Q240.4 387.2 241.4 387.9Q242.5 388.7 243.9 388.7Z M276.6 393.9L276.6 393.9Q274.1 393.9 272.1 392.6Q270.1 391.3 269.0 388.8Q267.8 386.3 267.8 382.7L267.8 382.7Q267.8 378.9 269.0 376.4Q270.2 373.9 272.2 372.7Q274.2 371.4 276.6 371.4L276.6 371.4Q278.5 371.4 279.7 372.1Q280.9 372.7 281.7 373.6Q282.4 374.5 282.8 375.4L282.8 375.4L283.0 375.4L283.0 364.5L289.0 364.5L289.0 393.5L283.1 393.5L283.1 390.1L282.8 390.1Q282.4 391.0 281.6 391.8Q280.9 392.7 279.6 393.3Q278.4 393.9 276.6 393.9ZM278.6 389.1L278.6 389.1Q280.0 389.1 281.0 388.3Q282.0 387.5 282.6 386.0Q283.1 384.6 283.1 382.6L283.1 382.6Q283.1 380.7 282.6 379.3Q282.1 377.8 281.0 377.0Q280.0 376.3 278.6 376.3L278.6 376.3Q277.1 376.3 276.0 377.1Q275.0 377.9 274.5 379.3Q274.0 380.7 274.0 382.6L274.0 382.6Q274.0 384.5 274.5 386.0Q275.0 387.5 276.0 388.3Q277.1 389.1 278.6 389.1ZM303.9 394.0L303.9 394.0Q300.6 394.0 298.1 392.6Q295.7 391.1 294.4 388.6Q293.1 386.1 293.1 382.7L293.1 382.7Q293.1 379.3 294.4 376.8Q295.7 374.3 298.1 372.9Q300.6 371.4 303.9 371.4L303.9 371.4Q307.2 371.4 309.6 372.9Q312.0 374.3 313.3 376.8Q314.6 379.3 314.6 382.7L314.6 382.7Q314.6 386.1 313.3 388.6Q312.0 391.1 309.6 392.6Q307.2 394.0 303.9 394.0ZM303.9 389.3L303.9 389.3Q305.4 389.3 306.4 388.4Q307.4 387.6 307.9 386.1Q308.5 384.6 308.5 382.7L308.5 382.7Q308.5 380.8 307.9 379.3Q307.4 377.8 306.4 376.9Q305.4 376.1 303.9 376.1L303.9 376.1Q302.4 376.1 301.3 376.9Q300.3 377.8 299.8 379.3Q299.3 380.8 299.3 382.7L299.3 382.7Q299.3 384.6 299.8 386.1Q300.3 387.6 301.3 388.4Q302.4 389.3 303.9 389.3ZM317.0 371.7L330.2 371.7L330.2 376.3L317.0 376.3L317.0 371.7ZM320.0 387.6L320.0 366.5L326.1 366.5L326.1 386.8Q326.1 387.7 326.3 388.1Q326.6 388.6 327.0 388.8Q327.5 389.0 328.1 389.0L328.1 389.0Q328.5 389.0 328.9 388.9Q329.4 388.8 329.6 388.8L329.6 388.8L330.6 393.3Q330.1 393.4 329.3 393.6Q328.5 393.8 327.3 393.8L327.3 393.8Q325.1 393.9 323.4 393.3Q321.8 392.6 320.9 391.2Q320.0 389.8 320.0 387.6L320.0 387.6ZM351.9 377.9L351.9 377.9L346.4 378.3Q346.3 377.6 345.8 377.0Q345.3 376.4 344.6 376.1Q343.8 375.7 342.8 375.7L342.8 375.7Q341.3 375.7 340.4 376.3Q339.4 376.9 339.4 377.9L339.4 377.9Q339.4 378.7 340.0 379.2Q340.7 379.8 342.2 380.1L342.2 380.1L346.1 380.9Q349.3 381.5 350.9 383.0Q352.4 384.4 352.4 386.8L352.4 386.8Q352.4 388.9 351.2 390.5Q349.9 392.2 347.7 393.1Q345.6 394.0 342.7 394.0L342.7 394.0Q338.4 394.0 335.8 392.2Q333.3 390.3 332.8 387.2L332.8 387.2L338.8 386.9Q339.0 388.2 340.1 388.9Q341.1 389.6 342.7 389.6L342.7 389.6Q344.3 389.6 345.3 389.0Q346.3 388.4 346.3 387.4L346.3 387.4Q346.3 386.6 345.6 386.0Q344.9 385.5 343.5 385.2L343.5 385.2L339.7 384.5Q336.5 383.8 335.0 382.3Q333.4 380.7 333.4 378.2L333.4 378.2Q333.4 376.1 334.6 374.6Q335.7 373.1 337.8 372.3Q339.9 371.4 342.7 371.4L342.7 371.4Q346.8 371.4 349.2 373.2Q351.5 374.9 351.9 377.9Z M371.9 393.5L366.0 393.5L366.0 364.5L372.0 364.5L372.0 375.4L372.2 375.4Q372.6 374.5 373.3 373.6Q374.1 372.7 375.3 372.1Q376.6 371.4 378.4 371.4L378.4 371.4Q380.8 371.4 382.8 372.7Q384.8 373.9 386.0 376.4Q387.2 378.9 387.2 382.7L387.2 382.7Q387.2 386.3 386.1 388.8Q384.9 391.3 382.9 392.6Q380.9 393.9 378.4 393.9L378.4 393.9Q376.6 393.9 375.4 393.3Q374.2 392.7 373.4 391.8Q372.6 391.0 372.2 390.1L372.2 390.1L371.9 390.1L371.9 393.5ZM371.9 382.6L371.9 382.6Q371.9 384.6 372.4 386.0Q373.0 387.5 374.0 388.3Q375.0 389.1 376.5 389.1L376.5 389.1Q377.9 389.1 379.0 388.3Q380.0 387.5 380.5 386.0Q381.1 384.5 381.1 382.6L381.1 382.6Q381.1 380.7 380.5 379.3Q380.0 377.9 379.0 377.1Q378.0 376.3 376.5 376.3L376.5 376.3Q375.0 376.3 374.0 377.0Q373.0 377.8 372.4 379.3Q371.9 380.7 371.9 382.6ZM401.2 394.0L401.2 394.0Q397.8 394.0 395.4 392.6Q393.0 391.2 391.7 388.7Q390.4 386.2 390.4 382.7L390.4 382.7Q390.4 379.4 391.7 376.8Q393.0 374.3 395.4 372.9Q397.7 371.4 401.0 371.4L401.0 371.4Q403.1 371.4 405.0 372.1Q406.8 372.8 408.2 374.2Q409.6 375.6 410.4 377.7Q411.2 379.7 411.2 382.5L411.2 382.5L411.2 384.2L392.8 384.2L392.8 380.4L405.5 380.4Q405.5 379.1 404.9 378.1Q404.4 377.1 403.4 376.5Q402.4 376.0 401.1 376.0L401.1 376.0Q399.7 376.0 398.6 376.6Q397.6 377.2 397.0 378.3Q396.4 379.3 396.3 380.6L396.3 380.6L396.3 384.2Q396.3 385.8 397.0 387.0Q397.6 388.2 398.7 388.8Q399.8 389.5 401.3 389.5L401.3 389.5Q402.3 389.5 403.1 389.2Q404.0 388.9 404.6 388.3Q405.2 387.8 405.5 386.9L405.5 386.9L411.1 387.3Q410.7 389.3 409.3 390.8Q408.0 392.3 406.0 393.1Q403.9 394.0 401.2 394.0ZM413.6 371.7L426.8 371.7L426.8 376.3L413.6 376.3L413.6 371.7ZM416.6 387.6L416.6 366.5L422.7 366.5L422.7 386.8Q422.7 387.7 422.9 388.1Q423.2 388.6 423.6 388.8Q424.1 389.0 424.7 389.0L424.7 389.0Q425.1 389.0 425.6 388.9Q426.0 388.8 426.2 388.8L426.2 388.8L427.2 393.3Q426.7 393.4 425.9 393.6Q425.1 393.8 423.9 393.8L423.9 393.8Q421.7 393.9 420.0 393.3Q418.4 392.6 417.5 391.2Q416.6 389.8 416.6 387.6L416.6 387.6ZM441.4 393.5L435.0 393.5L429.1 371.7L435.2 371.7L438.6 386.4L438.8 386.4L442.3 371.7L448.3 371.7L451.9 386.3L452.1 386.3L455.4 371.7L461.5 371.7L455.6 393.5L449.2 393.5L445.4 379.8L445.1 379.8L441.4 393.5ZM474.1 394.0L474.1 394.0Q470.7 394.0 468.3 392.6Q465.9 391.2 464.6 388.7Q463.3 386.2 463.3 382.7L463.3 382.7Q463.3 379.4 464.6 376.8Q465.9 374.3 468.3 372.9Q470.7 371.4 473.9 371.4L473.9 371.4Q476.0 371.4 477.9 372.1Q479.8 372.8 481.2 374.2Q482.6 375.6 483.3 377.7Q484.1 379.7 484.1 382.5L484.1 382.5L484.1 384.2L465.7 384.2L465.7 380.4L478.4 380.4Q478.4 379.1 477.9 378.1Q477.3 377.1 476.3 376.5Q475.3 376.0 474.0 376.0L474.0 376.0Q472.6 376.0 471.5 376.6Q470.5 377.2 469.9 378.3Q469.3 379.3 469.3 380.6L469.3 380.6L469.3 384.2Q469.3 385.8 469.9 387.0Q470.5 388.2 471.6 388.8Q472.7 389.5 474.2 389.5L474.2 389.5Q475.2 389.5 476.1 389.2Q476.9 388.9 477.5 388.3Q478.1 387.8 478.4 386.9L478.4 386.9L484.0 387.3Q483.6 389.3 482.3 390.8Q480.9 392.3 478.9 393.1Q476.8 394.0 474.1 394.0ZM498.0 394.0L498.0 394.0Q494.6 394.0 492.2 392.6Q489.8 391.2 488.5 388.7Q487.2 386.2 487.2 382.7L487.2 382.7Q487.2 379.4 488.5 376.8Q489.8 374.3 492.2 372.9Q494.6 371.4 497.8 371.4L497.8 371.4Q499.9 371.4 501.8 372.1Q503.7 372.8 505.1 374.2Q506.5 375.6 507.2 377.7Q508.0 379.7 508.0 382.5L508.0 382.5L508.0 384.2L489.6 384.2L489.6 380.4L502.3 380.4Q502.3 379.1 501.8 378.1Q501.2 377.1 500.2 376.5Q499.2 376.0 497.9 376.0L497.9 376.0Q496.5 376.0 495.4 376.6Q494.4 377.2 493.8 378.3Q493.2 379.3 493.2 380.6L493.2 380.6L493.2 384.2Q493.2 385.8 493.8 387.0Q494.4 388.2 495.5 388.8Q496.6 389.5 498.1 389.5L498.1 389.5Q499.1 389.5 500.0 389.2Q500.8 388.9 501.4 388.3Q502.0 387.8 502.3 386.9L502.3 386.9L507.9 387.3Q507.5 389.3 506.2 390.8Q504.8 392.3 502.8 393.1Q500.7 394.0 498.0 394.0ZM518.0 380.9L518.0 380.9L518.0 393.5L512.0 393.5L512.0 371.7L517.7 371.7L517.7 375.6L518.0 375.6Q518.7 373.7 520.4 372.6Q522.1 371.4 524.6 371.4L524.6 371.4Q526.8 371.4 528.5 372.4Q530.2 373.4 531.2 375.3Q532.1 377.1 532.1 379.7L532.1 379.7L532.1 393.5L526.0 393.5L526.0 380.7Q526.1 378.7 525.0 377.6Q524.0 376.5 522.2 376.5L522.2 376.5Q520.9 376.5 520.0 377.0Q519.1 377.5 518.6 378.5Q518.0 379.5 518.0 380.9Z M546.2 364.5L550.6 364.5L550.6 375.5L546.2 375.5L546.2 364.5ZM553.5 371.7L566.6 371.7L566.6 376.3L553.5 376.3L553.5 371.7ZM556.5 387.6L556.5 366.5L562.5 366.5L562.5 386.8Q562.5 387.7 562.8 388.1Q563.0 388.6 563.5 388.8Q563.9 389.0 564.6 389.0L564.6 389.0Q565.0 389.0 565.4 388.9Q565.8 388.8 566.1 388.8L566.1 388.8L567.0 393.3Q566.6 393.4 565.7 393.6Q564.9 393.8 563.7 393.8L563.7 393.8Q561.5 393.9 559.9 393.3Q558.3 392.6 557.4 391.2Q556.4 389.8 556.5 387.6L556.5 387.6ZM577.1 380.9L577.1 380.9L577.1 393.5L571.0 393.5L571.0 364.5L576.9 364.5L576.9 375.6L577.1 375.6Q577.9 373.6 579.5 372.5Q581.2 371.4 583.7 371.4L583.7 371.4Q585.9 371.4 587.6 372.4Q589.3 373.4 590.3 375.3Q591.2 377.1 591.2 379.7L591.2 379.7L591.2 393.5L585.2 393.5L585.2 380.7Q585.2 378.7 584.1 377.6Q583.1 376.5 581.3 376.5L581.3 376.5Q580.0 376.5 579.1 377.0Q578.1 377.5 577.6 378.5Q577.1 379.5 577.1 380.9ZM602.0 393.5L596.0 393.5L596.0 371.7L602.0 371.7L602.0 393.5ZM599.0 368.9L599.0 368.9Q597.7 368.9 596.7 368.0Q595.8 367.1 595.8 365.8L595.8 365.8Q595.8 364.6 596.7 363.7Q597.7 362.8 599.0 362.8L599.0 362.8Q600.4 362.8 601.3 363.7Q602.3 364.6 602.3 365.8L602.3 365.8Q602.3 367.1 601.3 368.0Q600.4 368.9 599.0 368.9ZM625.0 377.9L625.0 377.9L619.5 378.3Q619.3 377.6 618.9 377.0Q618.4 376.4 617.6 376.1Q616.9 375.7 615.8 375.7L615.8 375.7Q614.4 375.7 613.5 376.3Q612.5 376.9 612.5 377.9L612.5 377.9Q612.5 378.7 613.1 379.2Q613.7 379.8 615.3 380.1L615.3 380.1L619.2 380.9Q622.4 381.5 623.9 383.0Q625.5 384.4 625.5 386.8L625.5 386.8Q625.5 388.9 624.3 390.5Q623.0 392.2 620.8 393.1Q618.6 394.0 615.8 394.0L615.8 394.0Q611.5 394.0 608.9 392.2Q606.3 390.3 605.9 387.2L605.9 387.2L611.8 386.9Q612.1 388.2 613.2 388.9Q614.2 389.6 615.8 389.6L615.8 389.6Q617.4 389.6 618.4 389.0Q619.3 388.4 619.4 387.4L619.4 387.4Q619.3 386.6 618.7 386.0Q618.0 385.5 616.6 385.2L616.6 385.2L612.8 384.5Q609.6 383.8 608.0 382.3Q606.5 380.7 606.5 378.2L606.5 378.2Q606.5 376.1 607.6 374.6Q608.8 373.1 610.8 372.3Q612.9 371.4 615.7 371.4L615.7 371.4Q619.9 371.4 622.2 373.2Q624.6 374.9 625.0 377.9ZM628.9 364.5L633.2 364.5L633.2 375.5L628.9 375.5L628.9 364.5Z M656.0 382.7L652.0 387.3L652.0 380.0L652.9 380.0L659.9 371.7L666.8 371.7L657.4 382.7L656.0 382.7ZM652.6 393.5L646.5 393.5L646.5 364.5L652.6 364.5L652.6 393.5ZM667.2 393.5L660.1 393.5L653.7 384.0L657.8 379.8L667.2 393.5ZM678.8 394.0L678.8 394.0Q675.4 394.0 673.0 392.6Q670.6 391.2 669.3 388.7Q668.0 386.2 668.0 382.7L668.0 382.7Q668.0 379.4 669.3 376.8Q670.6 374.3 673.0 372.9Q675.4 371.4 678.6 371.4L678.6 371.4Q680.7 371.4 682.6 372.1Q684.5 372.8 685.9 374.2Q687.3 375.6 688.0 377.7Q688.8 379.7 688.8 382.5L688.8 382.5L688.8 384.2L670.4 384.2L670.4 380.4L683.1 380.4Q683.1 379.1 682.6 378.1Q682.0 377.1 681.0 376.5Q680.0 376.0 678.7 376.0L678.7 376.0Q677.3 376.0 676.2 376.6Q675.2 377.2 674.6 378.3Q674.0 379.3 674.0 380.6L674.0 380.6L674.0 384.2Q674.0 385.8 674.6 387.0Q675.2 388.2 676.3 388.8Q677.4 389.5 678.9 389.5L678.9 389.5Q679.9 389.5 680.8 389.2Q681.6 388.9 682.2 388.3Q682.8 387.8 683.1 386.9L683.1 386.9L688.7 387.3Q688.3 389.3 687.0 390.8Q685.6 392.3 683.6 393.1Q681.5 394.0 678.8 394.0ZM695.9 401.7L695.9 401.7Q694.7 401.7 693.7 401.5Q692.7 401.4 692.1 401.1L692.1 401.1L693.5 396.6Q694.5 396.9 695.4 396.9Q696.2 397.0 696.9 396.5Q697.5 396.1 697.9 395.1L697.9 395.1L698.3 394.2L690.4 371.7L696.8 371.7L701.3 387.8L701.5 387.8L706.1 371.7L712.5 371.7L704.0 395.9Q703.4 397.7 702.4 399.0Q701.3 400.3 699.7 401.0Q698.1 401.7 695.9 401.7ZM726.3 393.5L719.9 393.5L714.0 371.7L720.1 371.7L723.5 386.4L723.7 386.4L727.2 371.7L733.2 371.7L736.8 386.3L737.0 386.3L740.3 371.7L746.4 371.7L740.5 393.5L734.1 393.5L730.3 379.8L730.0 379.8L726.3 393.5ZM758.9 394.0L758.9 394.0Q755.6 394.0 753.2 392.6Q750.8 391.1 749.5 388.6Q748.2 386.1 748.2 382.7L748.2 382.7Q748.2 379.3 749.5 376.8Q750.8 374.3 753.2 372.9Q755.6 371.4 758.9 371.4L758.9 371.4Q762.2 371.4 764.6 372.9Q767.0 374.3 768.4 376.8Q769.7 379.3 769.7 382.7L769.7 382.7Q769.7 386.1 768.4 388.6Q767.0 391.1 764.6 392.6Q762.2 394.0 758.9 394.0ZM758.9 389.3L758.9 389.3Q760.5 389.3 761.5 388.4Q762.5 387.6 763.0 386.1Q763.5 384.6 763.5 382.7L763.5 382.7Q763.5 380.8 763.0 379.3Q762.5 377.8 761.5 376.9Q760.5 376.1 758.9 376.1L758.9 376.1Q757.4 376.1 756.4 376.9Q755.4 377.8 754.9 379.3Q754.3 380.8 754.3 382.7L754.3 382.7Q754.3 384.6 754.9 386.1Q755.4 387.6 756.4 388.4Q757.4 389.3 758.9 389.3ZM779.7 393.5L773.6 393.5L773.6 371.7L779.5 371.7L779.5 375.5L779.7 375.5Q780.3 373.5 781.7 372.5Q783.1 371.4 784.9 371.4L784.9 371.4Q785.4 371.4 785.9 371.5Q786.4 371.5 786.8 371.6L786.8 371.6L786.8 377.0Q786.4 376.9 785.7 376.8Q784.9 376.7 784.3 376.7L784.3 376.7Q783.0 376.7 781.9 377.2Q780.9 377.8 780.3 378.8Q779.7 379.9 779.7 381.2L779.7 381.2L779.7 393.5ZM797.0 393.9L797.0 393.9Q794.5 393.9 792.5 392.6Q790.5 391.3 789.3 388.8Q788.1 386.3 788.1 382.7L788.1 382.7Q788.1 378.9 789.3 376.4Q790.5 373.9 792.5 372.7Q794.6 371.4 797.0 371.4L797.0 371.4Q798.8 371.4 800.0 372.1Q801.3 372.7 802.0 373.6Q802.8 374.5 803.2 375.4L803.2 375.4L803.4 375.4L803.4 364.5L809.4 364.5L809.4 393.5L803.4 393.5L803.4 390.1L803.2 390.1Q802.7 391.0 802.0 391.8Q801.2 392.7 800.0 393.3Q798.7 393.9 797.0 393.9ZM798.9 389.1L798.9 389.1Q800.4 389.1 801.4 388.3Q802.4 387.5 802.9 386.0Q803.5 384.6 803.5 382.6L803.5 382.6Q803.5 380.7 802.9 379.3Q802.4 377.8 801.4 377.0Q800.4 376.3 798.9 376.3L798.9 376.3Q797.4 376.3 796.4 377.1Q795.4 377.9 794.8 379.3Q794.3 380.7 794.3 382.6L794.3 382.6Q794.3 384.5 794.8 386.0Q795.4 387.5 796.4 388.3Q797.4 389.1 798.9 389.1Z M825.2 389.6L830.2 389.6L830.0 391.1Q829.9 393.0 829.3 394.9Q828.8 396.7 828.3 398.3Q827.7 399.8 827.4 400.6L827.4 400.6L823.4 400.6Q823.7 399.8 824.0 398.3Q824.4 396.8 824.7 395.0Q825.0 393.1 825.1 391.2L825.1 391.2L825.2 389.6Z M854.2 393.5L848.2 393.5L848.2 364.5L854.3 364.5L854.3 375.4L854.4 375.4Q854.8 374.5 855.6 373.6Q856.4 372.7 857.6 372.1Q858.8 371.4 860.7 371.4L860.7 371.4Q863.0 371.4 865.1 372.7Q867.1 373.9 868.3 376.4Q869.5 378.9 869.5 382.7L869.5 382.7Q869.5 386.3 868.3 388.8Q867.1 391.3 865.1 392.6Q863.1 393.9 860.6 393.9L860.6 393.9Q858.9 393.9 857.6 393.3Q856.4 392.7 855.6 391.8Q854.9 391.0 854.4 390.1L854.4 390.1L854.2 390.1L854.2 393.5ZM854.1 382.6L854.1 382.6Q854.1 384.6 854.7 386.0Q855.2 387.5 856.2 388.3Q857.3 389.1 858.7 389.1L858.7 389.1Q860.2 389.1 861.2 388.3Q862.2 387.5 862.8 386.0Q863.3 384.5 863.3 382.6L863.3 382.6Q863.3 380.7 862.8 379.3Q862.3 377.9 861.2 377.1Q860.2 376.3 858.7 376.3L858.7 376.3Q857.2 376.3 856.2 377.0Q855.2 377.8 854.7 379.3Q854.1 380.7 854.1 382.6ZM879.6 393.5L873.5 393.5L873.5 371.7L879.6 371.7L879.6 393.5ZM876.5 368.9L876.5 368.9Q875.2 368.9 874.2 368.0Q873.3 367.1 873.3 365.8L873.3 365.8Q873.3 364.6 874.2 363.7Q875.2 362.8 876.5 362.8L876.5 362.8Q877.9 362.8 878.9 363.7Q879.8 364.6 879.8 365.8L879.8 365.8Q879.8 367.1 878.9 368.0Q877.9 368.9 876.5 368.9ZM890.4 380.9L890.4 380.9L890.4 393.5L884.4 393.5L884.4 371.7L890.2 371.7L890.2 375.6L890.4 375.6Q891.1 373.7 892.8 372.6Q894.5 371.4 897.0 371.4L897.0 371.4Q899.2 371.4 900.9 372.4Q902.6 373.4 903.6 375.3Q904.5 377.1 904.5 379.7L904.5 379.7L904.5 393.5L898.5 393.5L898.5 380.7Q898.5 378.7 897.4 377.6Q896.4 376.5 894.6 376.5L894.6 376.5Q893.4 376.5 892.4 377.0Q891.5 377.5 891.0 378.5Q890.5 379.5 890.4 380.9ZM917.3 393.9L917.3 393.9Q914.8 393.9 912.8 392.6Q910.8 391.3 909.6 388.8Q908.5 386.3 908.5 382.7L908.5 382.7Q908.5 378.9 909.7 376.4Q910.9 373.9 912.9 372.7Q914.9 371.4 917.3 371.4L917.3 371.4Q919.1 371.4 920.3 372.1Q921.6 372.7 922.3 373.6Q923.1 374.5 923.5 375.4L923.5 375.4L923.7 375.4L923.7 364.5L929.7 364.5L929.7 393.5L923.8 393.5L923.8 390.1L923.5 390.1Q923.1 391.0 922.3 391.8Q921.5 392.7 920.3 393.3Q919.1 393.9 917.3 393.9ZM919.2 389.1L919.2 389.1Q920.7 389.1 921.7 388.3Q922.7 387.5 923.3 386.0Q923.8 384.6 923.8 382.6L923.8 382.6Q923.8 380.7 923.3 379.3Q922.7 377.8 921.7 377.0Q920.7 376.3 919.2 376.3L919.2 376.3Q917.7 376.3 916.7 377.1Q915.7 377.9 915.2 379.3Q914.6 380.7 914.6 382.6L914.6 382.6Q914.6 384.5 915.2 386.0Q915.7 387.5 916.7 388.3Q917.7 389.1 919.2 389.1ZM936.0 381.9L936.0 381.9Q936.0 376.6 937.4 372.2Q938.8 367.7 941.7 363.9L941.7 363.9L947.5 363.9Q946.4 365.3 945.5 367.3Q944.5 369.4 943.8 371.8Q943.1 374.2 942.7 376.8Q942.3 379.4 942.3 381.9L942.3 381.9Q942.3 385.3 943.0 388.7Q943.7 392.1 944.9 395.1Q946.1 398.0 947.5 399.9L947.5 399.9L941.7 399.9Q938.8 396.1 937.4 391.6Q936.0 387.2 936.0 381.9ZM961.2 381.9L961.2 381.9Q961.2 387.2 959.8 391.6Q958.4 396.1 955.5 399.9L955.5 399.9L949.7 399.9Q950.8 398.5 951.8 396.4Q952.7 394.4 953.4 392.0Q954.1 389.6 954.5 387.0Q954.9 384.4 954.9 381.9L954.9 381.9Q954.9 378.5 954.3 375.1Q953.6 371.7 952.4 368.7Q951.2 365.8 949.7 363.9L949.7 363.9L955.5 363.9Q958.4 367.7 959.8 372.2Q961.2 376.6 961.2 381.9Z M982.9 394.0L982.9 394.0Q980.8 394.0 979.2 393.2Q977.5 392.5 976.6 391.1Q975.7 389.6 975.7 387.5L975.7 387.5Q975.7 385.6 976.3 384.4Q977.0 383.2 978.1 382.4Q979.3 381.7 980.8 381.3Q982.2 380.9 983.8 380.7L983.8 380.7Q985.8 380.5 986.9 380.4Q988.1 380.2 988.6 379.8Q989.1 379.5 989.1 378.8L989.1 378.8L989.1 378.7Q989.1 377.3 988.3 376.6Q987.4 375.9 985.9 375.9L985.9 375.9Q984.3 375.9 983.3 376.6Q982.3 377.3 982.0 378.4L982.0 378.4L976.4 377.9Q976.8 375.9 978.1 374.5Q979.3 373.0 981.3 372.2Q983.3 371.4 985.9 371.4L985.9 371.4Q987.7 371.4 989.4 371.9Q991.1 372.3 992.4 373.2Q993.7 374.1 994.4 375.5Q995.2 376.9 995.2 378.8L995.2 378.8L995.2 393.5L989.4 393.5L989.4 390.5L989.3 390.5Q988.8 391.5 987.9 392.3Q987.0 393.1 985.8 393.5Q984.5 394.0 982.9 394.0ZM984.6 389.8L984.6 389.8Q986.0 389.8 987.0 389.2Q988.0 388.7 988.6 387.8Q989.2 386.9 989.2 385.7L989.2 385.7L989.2 383.4Q988.9 383.6 988.4 383.8Q987.9 383.9 987.3 384.0Q986.7 384.2 986.1 384.2Q985.5 384.3 985.0 384.4L985.0 384.4Q983.9 384.6 983.1 384.9Q982.3 385.3 981.9 385.8Q981.4 386.4 981.4 387.3L981.4 387.3Q981.4 388.5 982.3 389.1Q983.2 389.8 984.6 389.8ZM1005.9 380.9L1005.9 380.9L1005.9 393.5L999.9 393.5L999.9 371.7L1005.7 371.7L1005.7 375.6L1005.9 375.6Q1006.6 373.7 1008.3 372.6Q1010.0 371.4 1012.5 371.4L1012.5 371.4Q1014.7 371.4 1016.4 372.4Q1018.1 373.4 1019.1 375.3Q1020.0 377.1 1020.0 379.7L1020.0 379.7L1020.0 393.5L1013.9 393.5L1013.9 380.7Q1014.0 378.7 1012.9 377.6Q1011.9 376.5 1010.1 376.5L1010.1 376.5Q1008.8 376.5 1007.9 377.0Q1007.0 377.5 1006.5 378.5Q1006.0 379.5 1005.9 380.9ZM1032.8 393.9L1032.8 393.9Q1030.3 393.9 1028.3 392.6Q1026.3 391.3 1025.1 388.8Q1023.9 386.3 1023.9 382.7L1023.9 382.7Q1023.9 378.9 1025.2 376.4Q1026.4 373.9 1028.4 372.7Q1030.4 371.4 1032.8 371.4L1032.8 371.4Q1034.6 371.4 1035.8 372.1Q1037.1 372.7 1037.8 373.6Q1038.6 374.5 1039.0 375.4L1039.0 375.4L1039.2 375.4L1039.2 364.5L1045.2 364.5L1045.2 393.5L1039.2 393.5L1039.2 390.1L1039.0 390.1Q1038.6 391.0 1037.8 391.8Q1037.0 392.7 1035.8 393.3Q1034.6 393.9 1032.8 393.9ZM1034.7 389.1L1034.7 389.1Q1036.2 389.1 1037.2 388.3Q1038.2 387.5 1038.8 386.0Q1039.3 384.6 1039.3 382.6L1039.3 382.6Q1039.3 380.7 1038.8 379.3Q1038.2 377.8 1037.2 377.0Q1036.2 376.3 1034.7 376.3L1034.7 376.3Q1033.2 376.3 1032.2 377.1Q1031.2 377.9 1030.7 379.3Q1030.1 380.7 1030.1 382.6L1030.1 382.6Q1030.1 384.5 1030.7 386.0Q1031.2 387.5 1032.2 388.3Q1033.2 389.1 1034.7 389.1Z M1065.7 394.0L1065.7 394.0Q1063.6 394.0 1061.9 393.2Q1060.3 392.5 1059.4 391.1Q1058.4 389.6 1058.4 387.5L1058.4 387.5Q1058.4 385.6 1059.1 384.4Q1059.8 383.2 1060.9 382.4Q1062.1 381.7 1063.5 381.3Q1065 380.9 1066.6 380.7L1066.6 380.7Q1068.5 380.5 1069.7 380.4Q1070.9 380.2 1071.4 379.8Q1071.9 379.5 1071.9 378.8L1071.9 378.8L1071.9 378.7Q1071.9 377.3 1071.1 376.6Q1070.2 375.9 1068.7 375.9L1068.7 375.9Q1067.0 375.9 1066.1 376.6Q1065.1 377.3 1064.8 378.4L1064.8 378.4L1059.2 377.9Q1059.6 375.9 1060.9 374.5Q1062.1 373.0 1064.1 372.2Q1066.1 371.4 1068.7 371.4L1068.7 371.4Q1070.5 371.4 1072.2 371.9Q1073.8 372.3 1075.1 373.2Q1076.4 374.1 1077.2 375.5Q1078.0 376.9 1078.0 378.8L1078.0 378.8L1078.0 393.5L1072.2 393.5L1072.2 390.5L1072.0 390.5Q1071.5 391.5 1070.6 392.3Q1069.8 393.1 1068.5 393.5Q1067.3 394.0 1065.7 394.0ZM1067.4 389.8L1067.4 389.8Q1068.7 389.8 1069.8 389.2Q1070.8 388.7 1071.4 387.8Q1071.9 386.9 1071.9 385.7L1071.9 385.7L1071.9 383.4Q1071.7 383.6 1071.2 383.8Q1070.7 383.9 1070.1 384.0Q1069.5 384.2 1068.8 384.2Q1068.2 384.3 1067.7 384.4L1067.7 384.4Q1066.7 384.6 1065.9 384.9Q1065.1 385.3 1064.6 385.8Q1064.2 386.4 1064.2 387.3L1064.2 387.3Q1064.2 388.5 1065.1 389.1Q1066.0 389.8 1067.4 389.8ZM1088.7 393.5L1082.7 393.5L1082.7 371.7L1088.5 371.7L1088.5 375.5L1088.8 375.5Q1089.3 373.5 1090.8 372.5Q1092.2 371.4 1094.0 371.4L1094.0 371.4Q1094.4 371.4 1095.0 371.5Q1095.5 371.5 1095.9 371.6L1095.9 371.6L1095.9 377.0Q1095.5 376.9 1094.7 376.8Q1094.0 376.7 1093.3 376.7L1093.3 376.7Q1092.0 376.7 1091.0 377.2Q1089.9 377.8 1089.3 378.8Q1088.7 379.9 1088.7 381.2L1088.7 381.2L1088.7 393.5ZM1105.1 393.5L1099.0 393.5L1099.0 371.7L1104.9 371.7L1104.9 375.5L1105.1 375.5Q1105.7 373.5 1107.1 372.5Q1108.5 371.4 1110.3 371.4L1110.3 371.4Q1110.8 371.4 1111.3 371.5Q1111.8 371.5 1112.2 371.6L1112.2 371.6L1112.2 377.0Q1111.8 376.9 1111.1 376.8Q1110.3 376.7 1109.7 376.7L1109.7 376.7Q1108.4 376.7 1107.3 377.2Q1106.3 377.8 1105.7 378.8Q1105.1 379.9 1105.1 381.2L1105.1 381.2L1105.1 393.5ZM1124.2 394.0L1124.2 394.0Q1120.9 394.0 1118.5 392.6Q1116.1 391.1 1114.8 388.6Q1113.5 386.1 1113.5 382.7L1113.5 382.7Q1113.5 379.3 1114.8 376.8Q1116.1 374.3 1118.5 372.9Q1120.9 371.4 1124.2 371.4L1124.2 371.4Q1127.5 371.4 1129.9 372.9Q1132.3 374.3 1133.6 376.8Q1134.9 379.3 1134.9 382.7L1134.9 382.7Q1134.9 386.1 1133.6 388.6Q1132.3 391.1 1129.9 392.6Q1127.5 394.0 1124.2 394.0ZM1124.2 389.3L1124.2 389.3Q1125.7 389.3 1126.7 388.4Q1127.7 387.6 1128.3 386.1Q1128.8 384.6 1128.8 382.7L1128.8 382.7Q1128.8 380.8 1128.3 379.3Q1127.7 377.8 1126.7 376.9Q1125.7 376.1 1124.2 376.1L1124.2 376.1Q1122.7 376.1 1121.7 376.9Q1120.6 377.8 1120.1 379.3Q1119.6 380.8 1119.6 382.7L1119.6 382.7Q1119.6 384.6 1120.1 386.1Q1120.6 387.6 1121.7 388.4Q1122.7 389.3 1124.2 389.3ZM1149.0 393.5L1142.6 393.5L1136.7 371.7L1142.8 371.7L1146.2 386.4L1146.4 386.4L1149.9 371.7L1155.9 371.7L1159.5 386.3L1159.7 386.3L1163.0 371.7L1169.1 371.7L1163.2 393.5L1156.8 393.5L1153.1 379.8L1152.8 379.8L1149.0 393.5Z M324.2 443.7L337.7 443.7L337.7 448.3L324.2 448.3L324.2 443.7ZM333.3 465.5L327.3 465.5L327.3 442.2Q327.3 439.8 328.2 438.2Q329.2 436.7 330.8 435.9Q332.4 435.1 334.5 435.1L334.5 435.1Q335.9 435.1 337.0 435.3Q338.2 435.5 338.7 435.7L338.7 435.7L337.7 440.2Q337.3 440.1 336.8 440.0Q336.3 439.9 335.7 439.9L335.7 439.9Q334.4 439.9 333.9 440.5Q333.3 441.2 333.3 442.3L333.3 442.3L333.3 465.5ZM355.4 456.3L355.4 456.3L355.4 443.7L361.4 443.7L361.4 465.5L355.6 465.5L355.6 461.6L355.4 461.6Q354.6 463.5 352.9 464.7Q351.2 465.8 348.8 465.8L348.8 465.8Q346.6 465.8 344.9 464.8Q343.3 463.8 342.3 462.0Q341.4 460.2 341.4 457.6L341.4 457.6L341.4 443.7L347.4 443.7L347.4 456.5Q347.4 458.5 348.5 459.6Q349.5 460.7 351.2 460.7L351.2 460.7Q352.3 460.7 353.3 460.2Q354.2 459.7 354.8 458.7Q355.4 457.7 355.4 456.3ZM372.3 452.9L372.3 452.9L372.3 465.5L366.3 465.5L366.3 443.7L372.0 443.7L372.0 447.6L372.3 447.6Q373.0 445.7 374.7 444.6Q376.4 443.4 378.8 443.4L378.8 443.4Q381.1 443.4 382.8 444.4Q384.5 445.4 385.4 447.3Q386.4 449.1 386.4 451.7L386.4 451.7L386.4 465.5L380.3 465.5L380.3 452.7Q380.3 450.7 379.3 449.6Q378.3 448.5 376.4 448.5L376.4 448.5Q375.2 448.5 374.3 449.0Q373.4 449.5 372.8 450.5Q372.3 451.5 372.3 452.9ZM401.0 466.0L401.0 466.0Q397.6 466.0 395.2 464.5Q392.8 463.1 391.5 460.6Q390.2 458.0 390.2 454.7L390.2 454.7Q390.2 451.4 391.5 448.8Q392.8 446.3 395.2 444.9Q397.6 443.4 401.0 443.4L401.0 443.4Q403.8 443.4 406.0 444.5Q408.1 445.5 409.3 447.4Q410.6 449.3 410.7 451.8L410.7 451.8L405.0 451.8Q404.8 450.2 403.7 449.2Q402.7 448.2 401.1 448.2L401.1 448.2Q399.6 448.2 398.6 448.9Q397.6 449.7 397.0 451.1Q396.4 452.6 396.4 454.6L396.4 454.6Q396.4 456.7 397.0 458.2Q397.5 459.7 398.6 460.4Q399.6 461.2 401.1 461.2L401.1 461.2Q402.1 461.2 402.9 460.8Q403.8 460.3 404.3 459.5Q404.8 458.7 405.0 457.5L405.0 457.5L410.7 457.5Q410.6 460.0 409.4 461.9Q408.2 463.8 406.0 464.9Q403.9 466.0 401.0 466.0ZM413.1 443.7L426.2 443.7L426.2 448.3L413.1 448.3L413.1 443.7ZM416.1 459.6L416.1 438.5L422.1 438.5L422.1 458.8Q422.1 459.7 422.4 460.1Q422.6 460.6 423.1 460.8Q423.6 461.0 424.2 461.0L424.2 461.0Q424.6 461.0 425.0 460.9Q425.4 460.8 425.7 460.8L425.7 460.8L426.6 465.3Q426.2 465.4 425.3 465.6Q424.5 465.8 423.3 465.8L423.3 465.8Q421.2 465.9 419.5 465.3Q417.9 464.6 417.0 463.2Q416.1 461.8 416.1 459.6L416.1 459.6ZM436.2 465.5L430.2 465.5L430.2 443.7L436.2 443.7L436.2 465.5ZM433.2 440.9L433.2 440.9Q431.8 440.9 430.9 440.0Q429.9 439.1 429.9 437.8L429.9 437.8Q429.9 436.6 430.9 435.7Q431.8 434.8 433.2 434.8L433.2 434.8Q434.5 434.8 435.5 435.7Q436.5 436.6 436.5 437.8L436.5 437.8Q436.5 439.1 435.5 440.0Q434.5 440.9 433.2 440.9ZM450.9 466.0L450.9 466.0Q447.6 466.0 445.2 464.6Q442.8 463.1 441.5 460.6Q440.2 458.1 440.2 454.7L440.2 454.7Q440.2 451.3 441.5 448.8Q442.8 446.3 445.2 444.9Q447.6 443.4 450.9 443.4L450.9 443.4Q454.2 443.4 456.6 444.9Q459.0 446.3 460.3 448.8Q461.6 451.3 461.6 454.7L461.6 454.7Q461.6 458.1 460.3 460.6Q459.0 463.1 456.6 464.6Q454.2 466.0 450.9 466.0ZM450.9 461.3L450.9 461.3Q452.4 461.3 453.4 460.4Q454.4 459.6 455.0 458.1Q455.5 456.6 455.5 454.7L455.5 454.7Q455.5 452.8 455.0 451.3Q454.4 449.8 453.4 448.9Q452.4 448.1 450.9 448.1L450.9 448.1Q449.4 448.1 448.4 448.9Q447.3 449.8 446.8 451.3Q446.3 452.8 446.3 454.7L446.3 454.7Q446.3 456.6 446.8 458.1Q447.3 459.6 448.4 460.4Q449.4 461.3 450.9 461.3ZM471.6 452.9L471.6 452.9L471.6 465.5L465.6 465.5L465.6 443.7L471.3 443.7L471.3 447.6L471.6 447.6Q472.3 445.7 474.0 444.6Q475.7 443.4 478.2 443.4L478.2 443.4Q480.4 443.4 482.1 444.4Q483.8 445.4 484.8 447.3Q485.7 449.1 485.7 451.7L485.7 451.7L485.7 465.5L479.6 465.5L479.6 452.7Q479.7 450.7 478.6 449.6Q477.6 448.5 475.8 448.5L475.8 448.5Q474.5 448.5 473.6 449.0Q472.7 449.5 472.2 450.5Q471.6 451.5 471.6 452.9Z M505.8 465.5L499.7 465.5L499.7 443.7L505.8 443.7L505.8 465.5ZM502.8 440.9L502.8 440.9Q501.4 440.9 500.5 440.0Q499.5 439.1 499.5 437.8L499.5 437.8Q499.5 436.6 500.5 435.7Q501.4 434.8 502.8 434.8L502.8 434.8Q504.1 434.8 505.1 435.7Q506.0 436.6 506.0 437.8L506.0 437.8Q506.0 439.1 505.1 440.0Q504.1 440.9 502.8 440.9ZM516.7 452.9L516.7 452.9L516.7 465.5L510.6 465.5L510.6 443.7L516.4 443.7L516.4 447.6L516.6 447.6Q517.4 445.7 519.1 444.6Q520.8 443.4 523.2 443.4L523.2 443.4Q525.5 443.4 527.2 444.4Q528.8 445.4 529.8 447.3Q530.7 449.1 530.7 451.7L530.7 451.7L530.7 465.5L524.7 465.5L524.7 452.7Q524.7 450.7 523.7 449.6Q522.6 448.5 520.8 448.5L520.8 448.5Q519.6 448.5 518.6 449.0Q517.7 449.5 517.2 450.5Q516.7 451.5 516.7 452.9Z M556.5 456.7L556.5 436.5L562.6 436.5L562.6 456.7Q562.6 459.6 561.3 461.6Q560.1 463.7 557.9 464.8Q555.6 465.9 552.7 465.9L552.7 465.9Q550.0 465.9 547.9 465.0Q545.8 464.1 544.5 462.2Q543.3 460.3 543.3 457.4L543.3 457.4L549.4 457.4Q549.4 458.5 549.9 459.3Q550.3 460.1 551.1 460.6Q551.9 461.0 553.0 461.0L553.0 461.0Q554.1 461.0 554.9 460.5Q555.7 460.0 556.1 459.1Q556.5 458.1 556.5 456.7L556.5 456.7ZM573.8 466.0L573.8 466.0Q571.7 466.0 570.1 465.2Q568.4 464.5 567.5 463.1Q566.5 461.6 566.5 459.5L566.5 459.5Q566.5 457.6 567.2 456.4Q567.9 455.2 569.0 454.4Q570.2 453.7 571.6 453.3Q573.1 452.9 574.7 452.7L574.7 452.7Q576.6 452.5 577.8 452.4Q579.0 452.2 579.5 451.8Q580.0 451.5 580.0 450.8L580.0 450.8L580.0 450.7Q580.0 449.3 579.2 448.6Q578.3 447.9 576.8 447.9L576.8 447.9Q575.1 447.9 574.2 448.6Q573.2 449.3 572.9 450.4L572.9 450.4L567.3 449.9Q567.7 447.9 569.0 446.5Q570.2 445.0 572.2 444.2Q574.2 443.4 576.8 443.4L576.8 443.4Q578.6 443.4 580.3 443.9Q582.0 444.3 583.3 445.2Q584.6 446.1 585.3 447.5Q586.1 448.9 586.1 450.8L586.1 450.8L586.1 465.5L580.3 465.5L580.3 462.5L580.2 462.5Q579.6 463.5 578.8 464.3Q577.9 465.1 576.6 465.5Q575.4 466.0 573.8 466.0ZM575.5 461.8L575.5 461.8Q576.8 461.8 577.9 461.2Q578.9 460.7 579.5 459.8Q580.1 458.9 580.1 457.7L580.1 457.7L580.1 455.4Q579.8 455.6 579.3 455.8Q578.8 455.9 578.2 456.0Q577.6 456.2 577.0 456.2Q576.3 456.3 575.9 456.4L575.9 456.4Q574.8 456.6 574.0 456.9Q573.2 457.3 572.8 457.8Q572.3 458.4 572.3 459.3L572.3 459.3Q572.3 460.5 573.2 461.1Q574.1 461.8 575.5 461.8ZM603.9 443.7L610.3 443.7L602.7 465.5L595.9 465.5L588.2 443.7L594.6 443.7L599.2 459.3L599.4 459.3L603.9 443.7ZM619.0 466.0L619.0 466.0Q616.9 466.0 615.3 465.2Q613.7 464.5 612.7 463.1Q611.8 461.6 611.8 459.5L611.8 459.5Q611.8 457.6 612.4 456.4Q613.1 455.2 614.3 454.4Q615.4 453.7 616.9 453.3Q618.4 452.9 620.0 452.7L620.0 452.7Q621.9 452.5 623.0 452.4Q624.2 452.2 624.7 451.8Q625.3 451.5 625.3 450.8L625.3 450.8L625.3 450.7Q625.3 449.3 624.4 448.6Q623.6 447.9 622.0 447.9L622.0 447.9Q620.4 447.9 619.4 448.6Q618.5 449.3 618.1 450.4L618.1 450.4L612.5 449.9Q613.0 447.9 614.2 446.5Q615.5 445.0 617.5 444.2Q619.4 443.4 622.0 443.4L622.0 443.4Q623.9 443.4 625.5 443.9Q627.2 444.3 628.5 445.2Q629.8 446.1 630.6 447.5Q631.3 448.9 631.3 450.8L631.3 450.8L631.3 465.5L625.6 465.5L625.6 462.5L625.4 462.5Q624.9 463.5 624.0 464.3Q623.1 465.1 621.9 465.5Q620.6 466.0 619.0 466.0ZM620.8 461.8L620.8 461.8Q622.1 461.8 623.1 461.2Q624.1 460.7 624.7 459.8Q625.3 458.9 625.3 457.7L625.3 457.7L625.3 455.4Q625.0 455.6 624.5 455.8Q624.0 455.9 623.4 456.0Q622.8 456.2 622.2 456.2Q621.6 456.3 621.1 456.4L621.1 456.4Q620.0 456.6 619.2 456.9Q618.4 457.3 618.0 457.8Q617.6 458.4 617.6 459.3L617.6 459.3Q617.6 460.5 618.5 461.1Q619.4 461.8 620.8 461.8ZM657.8 444.8L651.9 444.8Q651.7 443.1 650.4 442.2Q649.1 441.2 646.9 441.2L646.9 441.2Q645.4 441.2 644.4 441.6Q643.4 442.0 642.8 442.8Q642.3 443.5 642.3 444.5L642.3 444.5Q642.2 445.2 642.6 445.8Q643.0 446.4 643.6 446.8Q644.2 447.2 645.1 447.5Q645.9 447.8 646.9 448.1L646.9 448.1L649.5 448.7Q651.4 449.1 653.0 449.8Q654.6 450.5 655.7 451.6Q656.9 452.6 657.5 454.0Q658.2 455.4 658.2 457.2L658.2 457.2Q658.2 459.9 656.8 461.9Q655.5 463.8 653.0 464.9Q650.5 466.0 646.9 466.0L646.9 466.0Q643.4 466.0 640.8 464.9Q638.2 463.8 636.7 461.7Q635.3 459.6 635.2 456.4L635.2 456.4L641.1 456.4Q641.2 457.9 642.0 458.8Q642.7 459.8 644.0 460.3Q645.2 460.8 646.8 460.8L646.8 460.8Q648.4 460.8 649.6 460.3Q650.7 459.9 651.3 459.1Q652.0 458.3 652.0 457.2L652.0 457.2Q652.0 456.2 651.4 455.6Q650.8 454.9 649.7 454.4Q648.6 454.0 647.0 453.6L647.0 453.6L643.9 452.8Q640.2 451.9 638.1 450.0Q635.9 448.1 636.0 444.9L636.0 444.9Q635.9 442.2 637.4 440.2Q638.8 438.3 641.3 437.2Q643.8 436.1 647.0 436.1L647.0 436.1Q650.2 436.1 652.6 437.2Q655.1 438.3 656.4 440.2Q657.8 442.2 657.8 444.8L657.8 444.8ZM672.1 466.0L672.1 466.0Q668.7 466.0 666.3 464.5Q663.9 463.1 662.6 460.6Q661.3 458.0 661.3 454.7L661.3 454.7Q661.3 451.4 662.6 448.8Q663.9 446.3 666.3 444.9Q668.7 443.4 672.0 443.4L672.0 443.4Q674.9 443.4 677.0 444.5Q679.2 445.5 680.4 447.4Q681.7 449.3 681.8 451.8L681.8 451.8L676.1 451.8Q675.9 450.2 674.8 449.2Q673.8 448.2 672.1 448.2L672.1 448.2Q670.7 448.2 669.7 448.9Q668.6 449.7 668.1 451.1Q667.5 452.6 667.5 454.6L667.5 454.6Q667.5 456.7 668.0 458.2Q668.6 459.7 669.7 460.4Q670.7 461.2 672.1 461.2L672.1 461.2Q673.2 461.2 674.0 460.8Q674.8 460.3 675.4 459.5Q675.9 458.7 676.1 457.5L676.1 457.5L681.8 457.5Q681.7 460.0 680.4 461.9Q679.2 463.8 677.1 464.9Q675.0 466.0 672.1 466.0ZM691.7 465.5L685.7 465.5L685.7 443.7L691.6 443.7L691.6 447.5L691.8 447.5Q692.4 445.5 693.8 444.5Q695.2 443.4 697.0 443.4L697.0 443.4Q697.5 443.4 698.0 443.5Q698.5 443.5 698.9 443.6L698.9 443.6L698.9 449.0Q698.5 448.9 697.8 448.8Q697.0 448.7 696.4 448.7L696.4 448.7Q695.0 448.7 694.0 449.2Q693.0 449.8 692.4 450.8Q691.7 451.9 691.7 453.2L691.7 453.2L691.7 465.5ZM708.1 465.5L702.0 465.5L702.0 443.7L708.1 443.7L708.1 465.5ZM705.1 440.9L705.1 440.9Q703.7 440.9 702.8 440.0Q701.8 439.1 701.8 437.8L701.8 437.8Q701.8 436.6 702.8 435.7Q703.7 434.8 705.1 434.8L705.1 434.8Q706.4 434.8 707.4 435.7Q708.4 436.6 708.4 437.8L708.4 437.8Q708.4 439.1 707.4 440.0Q706.4 440.9 705.1 440.9ZM719.0 473.7L712.9 473.7L712.9 443.7L718.9 443.7L718.9 447.4L719.2 447.4Q719.6 446.5 720.3 445.6Q721.1 444.7 722.3 444.1Q723.5 443.4 725.4 443.4L725.4 443.4Q727.8 443.4 729.8 444.7Q731.8 445.9 733.0 448.4Q734.2 450.9 734.2 454.7L734.2 454.7Q734.2 458.3 733.0 460.8Q731.9 463.3 729.9 464.6Q727.8 465.9 725.4 465.9L725.4 465.9Q723.6 465.9 722.4 465.3Q721.1 464.7 720.4 463.8Q719.6 463.0 719.2 462.1L719.2 462.1L719.0 462.1L719.0 473.7ZM718.8 454.6L718.8 454.6Q718.8 456.6 719.4 458.0Q719.9 459.5 721.0 460.3Q722.0 461.1 723.4 461.1L723.4 461.1Q724.9 461.1 725.9 460.3Q727.0 459.5 727.5 458.0Q728.0 456.5 728.0 454.6L728.0 454.6Q728.0 452.7 727.5 451.3Q727.0 449.9 726.0 449.1Q724.9 448.3 723.4 448.3L723.4 448.3Q722.0 448.3 720.9 449.0Q719.9 449.8 719.4 451.3Q718.8 452.7 718.8 454.6ZM736.7 443.7L749.8 443.7L749.8 448.3L736.7 448.3L736.7 443.7ZM739.7 459.6L739.7 438.5L745.7 438.5L745.7 458.8Q745.7 459.7 746.0 460.1Q746.2 460.6 746.7 460.8Q747.2 461.0 747.8 461.0L747.8 461.0Q748.2 461.0 748.6 460.9Q749.0 460.8 749.3 460.8L749.3 460.8L750.2 465.3Q749.8 465.4 748.9 465.6Q748.1 465.8 746.9 465.8L746.9 465.8Q744.8 465.9 743.1 465.3Q741.5 464.6 740.6 463.2Q739.7 461.8 739.7 459.6L739.7 459.6Z M774.3 466.0L774.3 466.0Q771.0 466.0 768.5 464.5Q766.1 463.1 764.9 460.6Q763.6 458.0 763.6 454.7L763.6 454.7Q763.6 451.4 764.9 448.8Q766.2 446.3 768.6 444.9Q771.0 443.4 774.3 443.4L774.3 443.4Q777.1 443.4 779.3 444.5Q781.4 445.5 782.7 447.4Q783.9 449.3 784.0 451.8L784.0 451.8L778.3 451.8Q778.1 450.2 777.1 449.2Q776.0 448.2 774.4 448.2L774.4 448.2Q773.0 448.2 771.9 448.9Q770.9 449.7 770.3 451.1Q769.7 452.6 769.7 454.6L769.7 454.6Q769.7 456.7 770.3 458.2Q770.9 459.7 771.9 460.4Q773.0 461.2 774.4 461.2L774.4 461.2Q775.4 461.2 776.2 460.8Q777.1 460.3 777.6 459.5Q778.2 458.7 778.3 457.5L778.3 457.5L784.0 457.5Q783.9 460.0 782.7 461.9Q781.5 463.8 779.3 464.9Q777.2 466.0 774.3 466.0ZM787.9 436.5L794.0 436.5L794.0 465.5L787.9 465.5L787.9 436.5ZM805.0 466.0L805.0 466.0Q803.0 466.0 801.3 465.2Q799.7 464.5 798.7 463.1Q797.8 461.6 797.8 459.5L797.8 459.5Q797.8 457.6 798.5 456.4Q799.1 455.2 800.3 454.4Q801.4 453.7 802.9 453.3Q804.4 452.9 806.0 452.7L806.0 452.7Q807.9 452.5 809.1 452.4Q810.2 452.2 810.8 451.8Q811.3 451.5 811.3 450.8L811.3 450.8L811.3 450.7Q811.3 449.3 810.4 448.6Q809.6 447.9 808.0 447.9L808.0 447.9Q806.4 447.9 805.4 448.6Q804.5 449.3 804.2 450.4L804.2 450.4L798.6 449.9Q799.0 447.9 800.2 446.5Q801.5 445.0 803.5 444.2Q805.5 443.4 808.1 443.4L808.1 443.4Q809.9 443.4 811.6 443.9Q813.2 444.3 814.5 445.2Q815.8 446.1 816.6 447.5Q817.3 448.9 817.3 450.8L817.3 450.8L817.3 465.5L811.6 465.5L811.6 462.5L811.4 462.5Q810.9 463.5 810.0 464.3Q809.1 465.1 807.9 465.5Q806.7 466.0 805.0 466.0ZM806.8 461.8L806.8 461.8Q808.1 461.8 809.1 461.2Q810.2 460.7 810.7 459.8Q811.3 458.9 811.3 457.7L811.3 457.7L811.3 455.4Q811.0 455.6 810.5 455.8Q810.1 455.9 809.4 456.0Q808.8 456.2 808.2 456.2Q807.6 456.3 807.1 456.4L807.1 456.4Q806.1 456.6 805.3 456.9Q804.5 457.3 804.0 457.8Q803.6 458.4 803.6 459.3L803.6 459.3Q803.6 460.5 804.5 461.1Q805.4 461.8 806.8 461.8ZM840.2 449.9L840.2 449.9L834.6 450.3Q834.5 449.6 834.0 449.0Q833.6 448.4 832.8 448.1Q832.0 447.7 831.0 447.7L831.0 447.7Q829.6 447.7 828.6 448.3Q827.7 448.9 827.7 449.9L827.7 449.9Q827.7 450.7 828.3 451.2Q828.9 451.8 830.4 452.1L830.4 452.1L834.4 452.9Q837.6 453.5 839.1 455.0Q840.7 456.4 840.7 458.8L840.7 458.8Q840.7 460.9 839.4 462.5Q838.2 464.2 836.0 465.1Q833.8 466.0 831.0 466.0L831.0 466.0Q826.6 466.0 824.1 464.2Q821.5 462.3 821.1 459.2L821.1 459.2L827.0 458.9Q827.3 460.2 828.3 460.9Q829.4 461.6 831.0 461.6L831.0 461.6Q832.6 461.6 833.5 461.0Q834.5 460.4 834.5 459.4L834.5 459.4Q834.5 458.6 833.8 458.0Q833.2 457.5 831.7 457.2L831.7 457.2L828.0 456.5Q824.8 455.8 823.2 454.3Q821.6 452.7 821.6 450.2L821.6 450.2Q821.6 448.1 822.8 446.6Q823.9 445.1 826.0 444.3Q828.1 443.4 830.9 443.4L830.9 443.4Q835.0 443.4 837.4 445.2Q839.8 446.9 840.2 449.9ZM862.7 449.9L862.7 449.9L857.1 450.3Q857.0 449.6 856.5 449.0Q856.0 448.4 855.3 448.1Q854.5 447.7 853.5 447.7L853.5 447.7Q852.1 447.7 851.1 448.3Q850.1 448.9 850.1 449.9L850.1 449.9Q850.1 450.7 850.8 451.2Q851.4 451.8 852.9 452.1L852.9 452.1L856.8 452.9Q860.0 453.5 861.6 455.0Q863.2 456.4 863.2 458.8L863.2 458.8Q863.2 460.9 861.9 462.5Q860.6 464.2 858.5 465.1Q856.3 466.0 853.4 466.0L853.4 466.0Q849.1 466.0 846.5 464.2Q844.0 462.3 843.5 459.2L843.5 459.2L849.5 458.9Q849.8 460.2 850.8 460.9Q851.8 461.6 853.5 461.6L853.5 461.6Q855.0 461.6 856.0 461.0Q857.0 460.4 857.0 459.4L857.0 459.4Q857.0 458.6 856.3 458.0Q855.6 457.5 854.2 457.2L854.2 457.2L850.4 456.5Q847.2 455.8 845.7 454.3Q844.1 452.7 844.1 450.2L844.1 450.2Q844.1 448.1 845.3 446.6Q846.4 445.1 848.5 444.3Q850.6 443.4 853.4 443.4L853.4 443.4Q857.5 443.4 859.9 445.2Q862.3 446.9 862.7 449.9ZM870.5 465.9L870.5 465.9Q869.1 465.9 868.1 464.9Q867.1 463.9 867.1 462.5L867.1 462.5Q867.1 461.1 868.1 460.1Q869.1 459.1 870.5 459.1L870.5 459.1Q871.9 459.1 872.9 460.1Q873.9 461.1 873.9 462.5L873.9 462.5Q873.9 463.4 873.4 464.2Q873.0 465.0 872.2 465.5Q871.4 465.9 870.5 465.9Z " />' });
    contentAssets = /* @__PURE__ */ new Map([["../../../src/assets/blogs/prototypical-inheritance/img-1.jpeg?astroContentImageFlag=&importer=src%2Fcontent%2Fblogs%2Fmy-fifth-blog.md", __ASTRO_IMAGE_IMPORT_Z14Uq4B], ["../../../src/assets/blogs/prototypical-inheritance/img-2.png?astroContentImageFlag=&importer=src%2Fcontent%2Fblogs%2Fmy-fifth-blog.md", __ASTRO_IMAGE_IMPORT_2czyfW], ["../../../src/assets/blogs/prototypical-inheritance/img-3.png?astroContentImageFlag=&importer=src%2Fcontent%2Fblogs%2Fmy-fifth-blog.md", __ASTRO_IMAGE_IMPORT_Z2njkvS], ["../../../src/assets/blogs/prototypical-inheritance/img-4.png?astroContentImageFlag=&importer=src%2Fcontent%2Fblogs%2Fmy-fifth-blog.md", __ASTRO_IMAGE_IMPORT_Z1S15tM], ["../../../src/assets/blogs/prototypical-inheritance/img-5.png?astroContentImageFlag=&importer=src%2Fcontent%2Fblogs%2Fmy-fifth-blog.md", __ASTRO_IMAGE_IMPORT_Z1nHPrG], ["../../../src/assets/blogs/prototypical-inheritance/img-6.gif?astroContentImageFlag=&importer=src%2Fcontent%2Fblogs%2Fmy-fifth-blog.md", __ASTRO_IMAGE_IMPORT_1Xtos8], ["../../../src/assets/blogs/prototypical-inheritance/img-7.png?astroContentImageFlag=&importer=src%2Fcontent%2Fblogs%2Fmy-fifth-blog.md", __ASTRO_IMAGE_IMPORT_Zo7lnu], ["../../../src/assets/blogs/prototypical-inheritance/img-8.png?astroContentImageFlag=&importer=src%2Fcontent%2Fblogs%2Fmy-fifth-blog.md", __ASTRO_IMAGE_IMPORT_6aSDB], ["../../../src/assets/blogs/prototypical-inheritance/img-9.webp?astroContentImageFlag=&importer=src%2Fcontent%2Fblogs%2Fmy-fifth-blog.md", __ASTRO_IMAGE_IMPORT_Z2lPfq1], ["./cover-5.svg?astroContentImageFlag=&importer=src%2Fcontent%2Fblogs%2Fmy-fifth-blog.md", __ASTRO_IMAGE_IMPORT_2oljmB], ["../../../src/assets/blogs/classes-in-js/img-1.jpeg?astroContentImageFlag=&importer=src%2Fcontent%2Fblogs%2Fmy-fourth-blog.md", __ASTRO_IMAGE_IMPORT_Z2q5IxC], ["../../../src/assets/blogs/classes-in-js/img-2.png?astroContentImageFlag=&importer=src%2Fcontent%2Fblogs%2Fmy-fourth-blog.md", __ASTRO_IMAGE_IMPORT_ddEss], ["../../../src/assets/blogs/classes-in-js/img-3.png?astroContentImageFlag=&importer=src%2Fcontent%2Fblogs%2Fmy-fourth-blog.md", __ASTRO_IMAGE_IMPORT_lSR4H], ["../../../src/assets/blogs/classes-in-js/img-5.png?astroContentImageFlag=&importer=src%2Fcontent%2Fblogs%2Fmy-fourth-blog.md", __ASTRO_IMAGE_IMPORT_Dfhic], ["../../icons/cover-4.svg?astroContentImageFlag=&importer=src%2Fcontent%2Fblogs%2Fmy-fourth-blog.md", __ASTRO_IMAGE_IMPORT_1l5ef3], ["../../../src/assets/blogs/reducing-bundle-size-in-react/img-3.png?astroContentImageFlag=&importer=src%2Fcontent%2Fblogs%2Fmy-second-blog.md", __ASTRO_IMAGE_IMPORT_Z137H1Y], ["../../../src/assets/blogs/reducing-bundle-size-in-react/img-4.gif?astroContentImageFlag=&importer=src%2Fcontent%2Fblogs%2Fmy-second-blog.md", __ASTRO_IMAGE_IMPORT_1w6XWJ], ["../../icons/cover-2.svg?astroContentImageFlag=&importer=src%2Fcontent%2Fblogs%2Fmy-second-blog.md", __ASTRO_IMAGE_IMPORT_aqbXV], ["../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-1.webp?astroContentImageFlag=&importer=src%2Fcontent%2Fblogs%2Fmy-first-blog.md", __ASTRO_IMAGE_IMPORT_Z1qG6HI], ["../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-2.webp?astroContentImageFlag=&importer=src%2Fcontent%2Fblogs%2Fmy-first-blog.md", __ASTRO_IMAGE_IMPORT_Z1i0T6t], ["../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-3.webp?astroContentImageFlag=&importer=src%2Fcontent%2Fblogs%2Fmy-first-blog.md", __ASTRO_IMAGE_IMPORT_Z19kGue], ["../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-4.webp?astroContentImageFlag=&importer=src%2Fcontent%2Fblogs%2Fmy-first-blog.md", __ASTRO_IMAGE_IMPORT_Z10EtRY], ["../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-5.webp?astroContentImageFlag=&importer=src%2Fcontent%2Fblogs%2Fmy-first-blog.md", __ASTRO_IMAGE_IMPORT_ZQYhgJ], ["../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-7.webp?astroContentImageFlag=&importer=src%2Fcontent%2Fblogs%2Fmy-first-blog.md", __ASTRO_IMAGE_IMPORT_ZzCR3f], ["../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-8.webp?astroContentImageFlag=&importer=src%2Fcontent%2Fblogs%2Fmy-first-blog.md", __ASTRO_IMAGE_IMPORT_ZqWEr0], ["../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-9.webp?astroContentImageFlag=&importer=src%2Fcontent%2Fblogs%2Fmy-first-blog.md", __ASTRO_IMAGE_IMPORT_ZihrOK], ["../../../src/assets/blogs/remix-better-forms-for-better-ux-and-dx/img-10.webp?astroContentImageFlag=&importer=src%2Fcontent%2Fblogs%2Fmy-first-blog.md", __ASTRO_IMAGE_IMPORT_zlmGu], ["../../icons/cover-1.svg?astroContentImageFlag=&importer=src%2Fcontent%2Fblogs%2Fmy-first-blog.md", __ASTRO_IMAGE_IMPORT_1e3WdJ], ["../../../src/assets/blogs/this-bind-arrow-fns-js/img-1.jpeg?astroContentImageFlag=&importer=src%2Fcontent%2Fblogs%2Fmy-third-blog.md", __ASTRO_IMAGE_IMPORT_Z208eja], ["../../../src/assets/blogs/this-bind-arrow-fns-js/img-2.png?astroContentImageFlag=&importer=src%2Fcontent%2Fblogs%2Fmy-third-blog.md", __ASTRO_IMAGE_IMPORT_11GqMf], ["../../../src/assets/blogs/this-bind-arrow-fns-js/img-3.png?astroContentImageFlag=&importer=src%2Fcontent%2Fblogs%2Fmy-third-blog.md", __ASTRO_IMAGE_IMPORT_1vYFOl], ["../../../src/assets/blogs/this-bind-arrow-fns-js/img-4.png?astroContentImageFlag=&importer=src%2Fcontent%2Fblogs%2Fmy-third-blog.md", __ASTRO_IMAGE_IMPORT_21hUQr], ["../../icons/cover-3.svg?astroContentImageFlag=&importer=src%2Fcontent%2Fblogs%2Fmy-third-blog.md", __ASTRO_IMAGE_IMPORT_Z1pHfd]]);
  }
});

// .wrangler/tmp/pages-ErOWne/chunks/content-modules_Bvq7llv8.mjs
var content_modules_Bvq7llv8_exports = {};
__export(content_modules_Bvq7llv8_exports, {
  default: () => contentModules
});
var contentModules;
var init_content_modules_Bvq7llv8 = __esm({
  ".wrangler/tmp/pages-ErOWne/chunks/content-modules_Bvq7llv8.mjs"() {
    "use strict";
    init_modules_watch_stub();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    contentModules = /* @__PURE__ */ new Map();
  }
});

// .wrangler/tmp/pages-ErOWne/chunks/UTCDateStringToReadable_DU2vtAkX.mjs
function d(e2) {
  const t2 = h(e2), o2 = f(e2);
  for (let n2 = 0; n2 < o2.length; n2++) a.call(e2, o2[n2]) && t2.push(o2[n2]);
  return t2;
}
function b(e2, t2) {
  return !u(e2, t2)?.writable;
}
function y(e2, u2) {
  if ("object" == typeof e2 && null !== e2) {
    let a2;
    if (c(e2)) a2 = [];
    else if (o(e2)) a2 = new Date(e2.getTime ? e2.getTime() : e2);
    else if (n(e2)) a2 = new RegExp(e2);
    else if (r2(e2)) a2 = { message: e2.message };
    else if (s(e2) || l(e2) || i(e2)) a2 = Object(e2);
    else {
      if (t(e2)) return e2.slice();
      a2 = Object.create(Object.getPrototypeOf(e2));
    }
    const f2 = u2.includeSymbols ? d : h;
    for (const t2 of f2(e2)) a2[t2] = e2[t2];
    return a2;
  }
  return e2;
}
function m(e2, t2, o2 = g) {
  const n2 = [], r3 = [];
  let s2 = true;
  const l2 = o2.includeSymbols ? d : h, i2 = !!o2.immutable;
  return (/* @__PURE__ */ __name(function e3(u2) {
    const a2 = i2 ? y(u2, o2) : u2, f2 = {};
    let h2 = true;
    const d2 = { node: a2, node_: u2, path: [].concat(n2), parent: r3[r3.length - 1], parents: r3, key: n2[n2.length - 1], isRoot: 0 === n2.length, level: n2.length, circular: void 0, isLeaf: false, notLeaf: true, notRoot: true, isFirst: false, isLast: false, update: /* @__PURE__ */ __name(function(e4, t3 = false) {
      d2.isRoot || (d2.parent.node[d2.key] = e4), d2.node = e4, t3 && (h2 = false);
    }, "update"), delete: /* @__PURE__ */ __name(function(e4) {
      delete d2.parent.node[d2.key], e4 && (h2 = false);
    }, "delete"), remove: /* @__PURE__ */ __name(function(e4) {
      c(d2.parent.node) ? d2.parent.node.splice(d2.key, 1) : delete d2.parent.node[d2.key], e4 && (h2 = false);
    }, "remove"), keys: null, before: /* @__PURE__ */ __name(function(e4) {
      f2.before = e4;
    }, "before"), after: /* @__PURE__ */ __name(function(e4) {
      f2.after = e4;
    }, "after"), pre: /* @__PURE__ */ __name(function(e4) {
      f2.pre = e4;
    }, "pre"), post: /* @__PURE__ */ __name(function(e4) {
      f2.post = e4;
    }, "post"), stop: /* @__PURE__ */ __name(function() {
      s2 = false;
    }, "stop"), block: /* @__PURE__ */ __name(function() {
      h2 = false;
    }, "block") };
    if (!s2) return d2;
    function g2() {
      if ("object" == typeof d2.node && null !== d2.node) {
        d2.keys && d2.node_ === d2.node || (d2.keys = l2(d2.node)), d2.isLeaf = 0 === d2.keys.length;
        for (let e4 = 0; e4 < r3.length; e4++) if (r3[e4].node_ === u2) {
          d2.circular = r3[e4];
          break;
        }
      } else d2.isLeaf = true, d2.keys = null;
      d2.notLeaf = !d2.isLeaf, d2.notRoot = !d2.isRoot;
    }
    __name(g2, "g");
    g2();
    const m2 = t2(d2, d2.node);
    if (void 0 !== m2 && d2.update && d2.update(m2), f2.before && f2.before(d2, d2.node), !h2) return d2;
    if ("object" == typeof d2.node && null !== d2.node && !d2.circular) {
      r3.push(d2), g2();
      for (const [t3, o3] of Object.entries(d2.keys ?? [])) {
        n2.push(o3), f2.pre && f2.pre(d2, d2.node[o3], o3);
        const r4 = e3(d2.node[o3]);
        i2 && p.call(d2.node, o3) && !b(d2.node, o3) && (d2.node[o3] = r4.node), r4.isLast = !!d2.keys?.length && +t3 == d2.keys.length - 1, r4.isFirst = 0 == +t3, f2.post && f2.post(d2, r4), n2.pop();
      }
      r3.pop();
    }
    return f2.after && f2.after(d2, d2.node), d2;
  }, "e"))(e2).node;
}
function pLimit(concurrency) {
  validateConcurrency(concurrency);
  const queue = new Queue();
  let activeCount = 0;
  const resumeNext = /* @__PURE__ */ __name(() => {
    if (activeCount < concurrency && queue.size > 0) {
      queue.dequeue()();
      activeCount++;
    }
  }, "resumeNext");
  const next = /* @__PURE__ */ __name(() => {
    activeCount--;
    resumeNext();
  }, "next");
  const run = /* @__PURE__ */ __name(async (function_, resolve, arguments_) => {
    const result = (async () => function_(...arguments_))();
    resolve(result);
    try {
      await result;
    } catch {
    }
    next();
  }, "run");
  const enqueue = /* @__PURE__ */ __name((function_, resolve, arguments_) => {
    new Promise((internalResolve) => {
      queue.enqueue(internalResolve);
    }).then(
      run.bind(void 0, function_, resolve, arguments_)
    );
    (async () => {
      await Promise.resolve();
      if (activeCount < concurrency) {
        resumeNext();
      }
    })();
  }, "enqueue");
  const generator = /* @__PURE__ */ __name((function_, ...arguments_) => new Promise((resolve) => {
    enqueue(function_, resolve, arguments_);
  }), "generator");
  Object.defineProperties(generator, {
    activeCount: {
      get: /* @__PURE__ */ __name(() => activeCount, "get")
    },
    pendingCount: {
      get: /* @__PURE__ */ __name(() => queue.size, "get")
    },
    clearQueue: {
      value() {
        queue.clear();
      }
    },
    concurrency: {
      get: /* @__PURE__ */ __name(() => concurrency, "get"),
      set(newConcurrency) {
        validateConcurrency(newConcurrency);
        concurrency = newConcurrency;
        queueMicrotask(() => {
          while (activeCount < concurrency && queue.size > 0) {
            resumeNext();
          }
        });
      }
    }
  });
  return generator;
}
function validateConcurrency(concurrency) {
  if (!((Number.isInteger(concurrency) || concurrency === Number.POSITIVE_INFINITY) && concurrency > 0)) {
    throw new TypeError("Expected `concurrency` to be a number from 1 and up");
  }
}
function imageSrcToImportId(imageSrc, filePath) {
  imageSrc = removeBase(imageSrc, IMAGE_IMPORT_PREFIX);
  if (isRemotePath(imageSrc)) {
    return;
  }
  const ext = imageSrc.split(".").at(-1)?.toLowerCase();
  if (!ext || !VALID_INPUT_FORMATS.includes(ext)) {
    return;
  }
  const params = new URLSearchParams(CONTENT_IMAGE_FLAG);
  if (filePath) {
    params.set("importer", filePath);
  }
  return `${imageSrc}?${params.toString()}`;
}
function dataStoreSingleton() {
  let instance = void 0;
  return {
    get: /* @__PURE__ */ __name(async () => {
      if (!instance) {
        instance = ImmutableDataStore.fromModule();
      }
      return instance;
    }, "get"),
    set: /* @__PURE__ */ __name((store) => {
      instance = store;
    }, "set")
  };
}
function createCollectionToGlobResultMap({
  globResult,
  contentDir: contentDir2
}) {
  const collectionToGlobResultMap = {};
  for (const key in globResult) {
    const keyRelativeToContentDir = key.replace(new RegExp(`^${contentDir2}`), "");
    const segments = keyRelativeToContentDir.split("/");
    if (segments.length <= 1) continue;
    const collection = segments[0];
    collectionToGlobResultMap[collection] ??= {};
    collectionToGlobResultMap[collection][key] = globResult[key];
  }
  return collectionToGlobResultMap;
}
function createGetCollection({
  contentCollectionToEntryMap: contentCollectionToEntryMap2,
  dataCollectionToEntryMap: dataCollectionToEntryMap2,
  getRenderEntryImport,
  cacheEntriesByCollection: cacheEntriesByCollection2
}) {
  return /* @__PURE__ */ __name(async function getCollection2(collection, filter) {
    const hasFilter = typeof filter === "function";
    const store = await globalDataStore.get();
    let type;
    if (collection in contentCollectionToEntryMap2) {
      type = "content";
    } else if (collection in dataCollectionToEntryMap2) {
      type = "data";
    } else if (store.hasCollection(collection)) {
      const { default: imageAssetMap } = await Promise.resolve().then(() => (init_content_assets_kVZB_fS5(), content_assets_kVZB_fS5_exports));
      const result = [];
      for (const rawEntry of store.values(collection)) {
        const data = updateImageReferencesInData(rawEntry.data, rawEntry.filePath, imageAssetMap);
        let entry = {
          ...rawEntry,
          data,
          collection
        };
        if (entry.legacyId) {
          entry = emulateLegacyEntry(entry);
        }
        if (hasFilter && !filter(entry)) {
          continue;
        }
        result.push(entry);
      }
      return result;
    } else {
      console.warn(
        `The collection ${JSON.stringify(
          collection
        )} does not exist or is empty. Please check your content config file for errors.`
      );
      return [];
    }
    const lazyImports = Object.values(
      type === "content" ? contentCollectionToEntryMap2[collection] : dataCollectionToEntryMap2[collection]
    );
    let entries = [];
    if (!Object.assign(__vite_import_meta_env__2, {})?.DEV && cacheEntriesByCollection2.has(collection)) {
      entries = cacheEntriesByCollection2.get(collection);
    } else {
      const limit = pLimit(10);
      entries = await Promise.all(
        lazyImports.map(
          (lazyImport) => limit(async () => {
            const entry = await lazyImport();
            return type === "content" ? {
              id: entry.id,
              slug: entry.slug,
              body: entry.body,
              collection: entry.collection,
              data: entry.data,
              async render() {
                return render({
                  collection: entry.collection,
                  id: entry.id,
                  renderEntryImport: await getRenderEntryImport(collection, entry.slug)
                });
              }
            } : {
              id: entry.id,
              collection: entry.collection,
              data: entry.data
            };
          })
        )
      );
      cacheEntriesByCollection2.set(collection, entries);
    }
    if (hasFilter) {
      return entries.filter(filter);
    } else {
      return entries.slice();
    }
  }, "getCollection");
}
function emulateLegacyEntry({ legacyId, ...entry }) {
  const legacyEntry = {
    ...entry,
    id: legacyId,
    slug: entry.id
  };
  return {
    ...legacyEntry,
    // Define separately so the render function isn't included in the object passed to `renderEntry()`
    render: /* @__PURE__ */ __name(() => renderEntry(legacyEntry), "render")
  };
}
async function updateImageReferencesInBody(html, fileName) {
  const { default: imageAssetMap } = await Promise.resolve().then(() => (init_content_assets_kVZB_fS5(), content_assets_kVZB_fS5_exports));
  const imageObjects = /* @__PURE__ */ new Map();
  const { getImage: getImage2 } = await Promise.resolve().then(() => (init_astro_assets_B0_JMAFI(), astro_assets_B0_JMAFI_exports)).then((n2) => n2._);
  for (const [_full, imagePath] of html.matchAll(CONTENT_LAYER_IMAGE_REGEX)) {
    try {
      const decodedImagePath = JSON.parse(imagePath.replaceAll("&#x22;", '"'));
      let image;
      if (URL.canParse(decodedImagePath.src)) {
        image = await getImage2(decodedImagePath);
      } else {
        const id = imageSrcToImportId(decodedImagePath.src, fileName);
        const imported = imageAssetMap.get(id);
        if (!id || imageObjects.has(id) || !imported) {
          continue;
        }
        image = await getImage2({ ...decodedImagePath, src: imported });
      }
      imageObjects.set(imagePath, image);
    } catch {
      throw new Error(`Failed to parse image reference: ${imagePath}`);
    }
  }
  return html.replaceAll(CONTENT_LAYER_IMAGE_REGEX, (full, imagePath) => {
    const image = imageObjects.get(imagePath);
    if (!image) {
      return full;
    }
    const { index, ...attributes } = image.attributes;
    return Object.entries({
      ...attributes,
      src: image.src,
      srcset: image.srcSet.attribute
    }).map(([key, value]) => value ? `${key}="${escape(value)}"` : "").join(" ");
  });
}
function updateImageReferencesInData(data, fileName, imageAssetMap) {
  return new j(data).map(function(ctx, val) {
    if (typeof val === "string" && val.startsWith(IMAGE_IMPORT_PREFIX)) {
      const src = val.replace(IMAGE_IMPORT_PREFIX, "");
      const id = imageSrcToImportId(src, fileName);
      if (!id) {
        ctx.update(src);
        return;
      }
      const imported = imageAssetMap?.get(id);
      if (imported) {
        ctx.update(imported);
      } else {
        ctx.update(src);
      }
    }
  });
}
async function renderEntry(entry) {
  if (!entry) {
    throw new AstroError(RenderUndefinedEntryError);
  }
  if ("render" in entry && !("legacyId" in entry)) {
    return entry.render();
  }
  if (entry.deferredRender) {
    try {
      const { default: contentModules2 } = await Promise.resolve().then(() => (init_content_modules_Bvq7llv8(), content_modules_Bvq7llv8_exports));
      const renderEntryImport = contentModules2.get(entry.filePath);
      return render({
        collection: "",
        id: entry.id,
        renderEntryImport
      });
    } catch (e2) {
      console.error(e2);
    }
  }
  const html = entry?.rendered?.metadata?.imagePaths?.length && entry.filePath ? await updateImageReferencesInBody(entry.rendered.html, entry.filePath) : entry?.rendered?.html;
  const Content = createComponent(() => renderTemplate`${unescapeHTML(html)}`);
  return {
    Content,
    headings: entry?.rendered?.metadata?.headings ?? [],
    remarkPluginFrontmatter: entry?.rendered?.metadata?.frontmatter ?? {}
  };
}
async function render({
  collection,
  id,
  renderEntryImport
}) {
  const UnexpectedRenderError = new AstroError({
    ...UnknownContentCollectionError,
    message: `Unexpected error while rendering ${String(collection)} \u2192 ${String(id)}.`
  });
  if (typeof renderEntryImport !== "function") throw UnexpectedRenderError;
  const baseMod = await renderEntryImport();
  if (baseMod == null || typeof baseMod !== "object") throw UnexpectedRenderError;
  const { default: defaultMod } = baseMod;
  if (isPropagatedAssetsModule(defaultMod)) {
    const { collectedStyles, collectedLinks, collectedScripts, getMod } = defaultMod;
    if (typeof getMod !== "function") throw UnexpectedRenderError;
    const propagationMod = await getMod();
    if (propagationMod == null || typeof propagationMod !== "object") throw UnexpectedRenderError;
    const Content = createComponent({
      factory(result, baseProps, slots) {
        let styles = "", links = "", scripts = "";
        if (Array.isArray(collectedStyles)) {
          styles = collectedStyles.map((style) => {
            return renderUniqueStylesheet(result, {
              type: "inline",
              content: style
            });
          }).join("");
        }
        if (Array.isArray(collectedLinks)) {
          links = collectedLinks.map((link) => {
            return renderUniqueStylesheet(result, {
              type: "external",
              src: prependForwardSlash(link)
            });
          }).join("");
        }
        if (Array.isArray(collectedScripts)) {
          scripts = collectedScripts.map((script) => renderScriptElement(script)).join("");
        }
        let props = baseProps;
        if (id.endsWith("mdx")) {
          props = {
            components: propagationMod.components ?? {},
            ...baseProps
          };
        }
        return createHeadAndContent(
          unescapeHTML(styles + links + scripts),
          renderTemplate`${renderComponent(
            result,
            "Content",
            propagationMod.Content,
            props,
            slots
          )}`
        );
      },
      propagation: "self"
    });
    return {
      Content,
      headings: propagationMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: propagationMod.frontmatter ?? {}
    };
  } else if (baseMod.Content && typeof baseMod.Content === "function") {
    return {
      Content: baseMod.Content,
      headings: baseMod.getHeadings?.() ?? [],
      remarkPluginFrontmatter: baseMod.frontmatter ?? {}
    };
  } else {
    throw UnexpectedRenderError;
  }
}
function isPropagatedAssetsModule(module) {
  return typeof module === "object" && module != null && "__astroPropagation" in module;
}
function createGlobLookup(glob) {
  return async (collection, lookupId) => {
    const filePath = lookupMap[collection]?.entries[lookupId];
    if (!filePath) return void 0;
    return glob[collection][filePath];
  };
}
function formatDate(utcDateString) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  const date = new Date(utcDateString);
  return date.toLocaleDateString(void 0, options);
}
var e, t, o, n, r2, s, l, i, c, u, a, f, p, h, g, j, Node, Queue, CONTENT_IMAGE_FLAG, IMAGE_IMPORT_PREFIX, ImmutableDataStore, globalDataStore, __vite_import_meta_env__2, CONTENT_LAYER_IMAGE_REGEX, contentDir, contentEntryGlob, contentCollectionToEntryMap, dataEntryGlob, dataCollectionToEntryMap, lookupMap, renderEntryGlob, collectionToRenderEntryMap, cacheEntriesByCollection, getCollection, myGradient;
var init_UTCDateStringToReadable_DU2vtAkX = __esm({
  ".wrangler/tmp/pages-ErOWne/chunks/UTCDateStringToReadable_DU2vtAkX.mjs"() {
    "use strict";
    init_modules_watch_stub();
    init_server_QlrBW5xk();
    init_path_C_ZOwaTP();
    init_astro_assets_B0_JMAFI();
    init_parse_EttCPxrw();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    e = /* @__PURE__ */ __name((e2) => Object.prototype.toString.call(e2), "e");
    t = /* @__PURE__ */ __name((e2) => ArrayBuffer.isView(e2) && !(e2 instanceof DataView), "t");
    o = /* @__PURE__ */ __name((t2) => "[object Date]" === e(t2), "o");
    n = /* @__PURE__ */ __name((t2) => "[object RegExp]" === e(t2), "n");
    r2 = /* @__PURE__ */ __name((t2) => "[object Error]" === e(t2), "r");
    s = /* @__PURE__ */ __name((t2) => "[object Boolean]" === e(t2), "s");
    l = /* @__PURE__ */ __name((t2) => "[object Number]" === e(t2), "l");
    i = /* @__PURE__ */ __name((t2) => "[object String]" === e(t2), "i");
    c = Array.isArray;
    u = Object.getOwnPropertyDescriptor;
    a = Object.prototype.propertyIsEnumerable;
    f = Object.getOwnPropertySymbols;
    p = Object.prototype.hasOwnProperty;
    h = Object.keys;
    __name(d, "d");
    __name(b, "b");
    __name(y, "y");
    g = { includeSymbols: false, immutable: false };
    __name(m, "m");
    j = class {
      static {
        __name(this, "j");
      }
      #e;
      #t;
      constructor(e2, t2 = g) {
        this.#e = e2, this.#t = t2;
      }
      get(e2) {
        let t2 = this.#e;
        for (let o2 = 0; t2 && o2 < e2.length; o2++) {
          const n2 = e2[o2];
          if (!p.call(t2, n2) || !this.#t.includeSymbols && "symbol" == typeof n2) return;
          t2 = t2[n2];
        }
        return t2;
      }
      has(e2) {
        let t2 = this.#e;
        for (let o2 = 0; t2 && o2 < e2.length; o2++) {
          const n2 = e2[o2];
          if (!p.call(t2, n2) || !this.#t.includeSymbols && "symbol" == typeof n2) return false;
          t2 = t2[n2];
        }
        return true;
      }
      set(e2, t2) {
        let o2 = this.#e, n2 = 0;
        for (n2 = 0; n2 < e2.length - 1; n2++) {
          const t3 = e2[n2];
          p.call(o2, t3) || (o2[t3] = {}), o2 = o2[t3];
        }
        return o2[e2[n2]] = t2, t2;
      }
      map(e2) {
        return m(this.#e, e2, { immutable: true, includeSymbols: !!this.#t.includeSymbols });
      }
      forEach(e2) {
        return this.#e = m(this.#e, e2, this.#t), this.#e;
      }
      reduce(e2, t2) {
        const o2 = 1 === arguments.length;
        let n2 = o2 ? this.#e : t2;
        return this.forEach((t3, r3) => {
          t3.isRoot && o2 || (n2 = e2(t3, n2, r3));
        }), n2;
      }
      paths() {
        const e2 = [];
        return this.forEach((t2) => {
          e2.push(t2.path);
        }), e2;
      }
      nodes() {
        const e2 = [];
        return this.forEach((t2) => {
          e2.push(t2.node);
        }), e2;
      }
      clone() {
        const e2 = [], o2 = [], n2 = this.#t;
        return t(this.#e) ? this.#e.slice() : (/* @__PURE__ */ __name(function t2(r3) {
          for (let t3 = 0; t3 < e2.length; t3++) if (e2[t3] === r3) return o2[t3];
          if ("object" == typeof r3 && null !== r3) {
            const s2 = y(r3, n2);
            e2.push(r3), o2.push(s2);
            const l2 = n2.includeSymbols ? d : h;
            for (const e3 of l2(r3)) s2[e3] = t2(r3[e3]);
            return e2.pop(), o2.pop(), s2;
          }
          return r3;
        }, "t"))(this.#e);
      }
    };
    Node = class {
      static {
        __name(this, "Node");
      }
      value;
      next;
      constructor(value) {
        this.value = value;
      }
    };
    Queue = class {
      static {
        __name(this, "Queue");
      }
      #head;
      #tail;
      #size;
      constructor() {
        this.clear();
      }
      enqueue(value) {
        const node = new Node(value);
        if (this.#head) {
          this.#tail.next = node;
          this.#tail = node;
        } else {
          this.#head = node;
          this.#tail = node;
        }
        this.#size++;
      }
      dequeue() {
        const current = this.#head;
        if (!current) {
          return;
        }
        this.#head = this.#head.next;
        this.#size--;
        return current.value;
      }
      peek() {
        if (!this.#head) {
          return;
        }
        return this.#head.value;
      }
      clear() {
        this.#head = void 0;
        this.#tail = void 0;
        this.#size = 0;
      }
      get size() {
        return this.#size;
      }
      *[Symbol.iterator]() {
        let current = this.#head;
        while (current) {
          yield current.value;
          current = current.next;
        }
      }
      *drain() {
        while (this.#head) {
          yield this.dequeue();
        }
      }
    };
    __name(pLimit, "pLimit");
    __name(validateConcurrency, "validateConcurrency");
    CONTENT_IMAGE_FLAG = "astroContentImageFlag";
    IMAGE_IMPORT_PREFIX = "__ASTRO_IMAGE_";
    __name(imageSrcToImportId, "imageSrcToImportId");
    ImmutableDataStore = class _ImmutableDataStore {
      static {
        __name(this, "ImmutableDataStore");
      }
      _collections = /* @__PURE__ */ new Map();
      constructor() {
        this._collections = /* @__PURE__ */ new Map();
      }
      get(collectionName, key) {
        return this._collections.get(collectionName)?.get(String(key));
      }
      entries(collectionName) {
        const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
        return [...collection.entries()];
      }
      values(collectionName) {
        const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
        return [...collection.values()];
      }
      keys(collectionName) {
        const collection = this._collections.get(collectionName) ?? /* @__PURE__ */ new Map();
        return [...collection.keys()];
      }
      has(collectionName, key) {
        const collection = this._collections.get(collectionName);
        if (collection) {
          return collection.has(String(key));
        }
        return false;
      }
      hasCollection(collectionName) {
        return this._collections.has(collectionName);
      }
      collections() {
        return this._collections;
      }
      /**
       * Attempts to load a DataStore from the virtual module.
       * This only works in Vite.
       */
      static async fromModule() {
        try {
          const data = await Promise.resolve().then(() => (init_astro_data_layer_content_zvctE0gs(), astro_data_layer_content_zvctE0gs_exports));
          if (data.default instanceof Map) {
            return _ImmutableDataStore.fromMap(data.default);
          }
          const map = unflatten(data.default);
          return _ImmutableDataStore.fromMap(map);
        } catch {
        }
        return new _ImmutableDataStore();
      }
      static async fromMap(data) {
        const store = new _ImmutableDataStore();
        store._collections = data;
        return store;
      }
    };
    __name(dataStoreSingleton, "dataStoreSingleton");
    globalDataStore = dataStoreSingleton();
    __vite_import_meta_env__2 = { "ASSETS_PREFIX": void 0, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": void 0, "SSR": true };
    __name(createCollectionToGlobResultMap, "createCollectionToGlobResultMap");
    __name(createGetCollection, "createGetCollection");
    __name(emulateLegacyEntry, "emulateLegacyEntry");
    CONTENT_LAYER_IMAGE_REGEX = /__ASTRO_IMAGE_="([^"]+)"/g;
    __name(updateImageReferencesInBody, "updateImageReferencesInBody");
    __name(updateImageReferencesInData, "updateImageReferencesInData");
    __name(renderEntry, "renderEntry");
    __name(render, "render");
    __name(isPropagatedAssetsModule, "isPropagatedAssetsModule");
    contentDir = "/src/content/";
    contentEntryGlob = "";
    contentCollectionToEntryMap = createCollectionToGlobResultMap({
      globResult: contentEntryGlob,
      contentDir
    });
    dataEntryGlob = "";
    dataCollectionToEntryMap = createCollectionToGlobResultMap({
      globResult: dataEntryGlob,
      contentDir
    });
    createCollectionToGlobResultMap({
      globResult: { ...contentEntryGlob, ...dataEntryGlob },
      contentDir
    });
    lookupMap = {};
    lookupMap = {};
    new Set(Object.keys(lookupMap));
    __name(createGlobLookup, "createGlobLookup");
    renderEntryGlob = "";
    collectionToRenderEntryMap = createCollectionToGlobResultMap({
      globResult: renderEntryGlob,
      contentDir
    });
    cacheEntriesByCollection = /* @__PURE__ */ new Map();
    getCollection = createGetCollection({
      contentCollectionToEntryMap,
      dataCollectionToEntryMap,
      getRenderEntryImport: createGlobLookup(collectionToRenderEntryMap),
      cacheEntriesByCollection
    });
    myGradient = new Proxy({ "src": "/_astro/myGradient.QSScO5Tz.jpeg", "width": 3840, "height": 2560, "format": "jpg" }, {
      get(target, name, receiver) {
        if (name === "clone") {
          return structuredClone(target);
        }
        if (name === "fsPath") {
          return "/Users/vivek/Desktop/self/myPortfolio/src/icons/myGradient.jpeg";
        }
        return target[name];
      }
    });
    __name(formatDate, "formatDate");
  }
});

// .wrangler/tmp/pages-ErOWne/pages/blogs.astro.mjs
var blogs_astro_exports = {};
__export(blogs_astro_exports, {
  page: () => page3,
  renderers: () => renderers
});
var $$Astro3, $$BlogCard, $$Blogs, $$file2, $$url2, _page3, page3;
var init_blogs_astro = __esm({
  ".wrangler/tmp/pages-ErOWne/pages/blogs.astro.mjs"() {
    "use strict";
    init_modules_watch_stub();
    init_server_QlrBW5xk();
    init_UTCDateStringToReadable_DU2vtAkX();
    init_astro_assets_B0_JMAFI();
    init_BaseLayout_A4ggbcpe();
    init_renderers();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    $$Astro3 = createAstro();
    $$BlogCard = createComponent(($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$Astro3, $$props, $$slots);
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
    $$Blogs = createComponent(async ($$result, $$props, $$slots) => {
      const blogPosts = await getCollection("blogs");
      return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "pageTitle": "viveks portfolio blog" }, { "default": /* @__PURE__ */ __name(async ($$result2) => renderTemplate` ${maybeRenderHead()}<section class="section-1 flex flex-col items-center justify-center px-8 pb-20 pt-40 text-center md:h-1/2 md:pb-0 md:pt-20 2xl:px-32"> <h1 class="text-5xl font-semibold leading-tight tracking-tight">My blog</h1> <p class="mt-7 max-w-2xl text-lg font-medium leading-relaxed">
I like to write about software development 🚀 & open source 🥑.
</p> </section> <section class="relative mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3"> ${blogPosts.map((blog) => renderTemplate`${renderComponent($$result2, "BlogCard", $$BlogCard, { "cardTitle": blog.data.title, "cardSubtitle": blog.data.subheading, "dateTime": blog.data.publishedAt, "imageUrl": blog.data.cover, "readTimeInMinutes": blog.data.readingTimeInMins, "postUrl": blog.slug })}`)} </section> <section class="h-32" aria-hidden="true"></section> `, "default") })}`;
    }, "/Users/vivek/Desktop/self/myPortfolio/src/pages/blogs.astro", void 0);
    $$file2 = "/Users/vivek/Desktop/self/myPortfolio/src/pages/blogs.astro";
    $$url2 = "/blogs";
    _page3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      default: $$Blogs,
      file: $$file2,
      url: $$url2
    }, Symbol.toStringTag, { value: "Module" }));
    page3 = /* @__PURE__ */ __name(() => _page3, "page");
  }
});

// .wrangler/tmp/pages-ErOWne/pages/index.astro.mjs
var index_astro_exports = {};
__export(index_astro_exports, {
  page: () => page4,
  renderers: () => renderers
});
var MyImage, $$Astro$3, $$ButtonPrimary, $$Astro$22, $$ButtonSecondary, $$Astro$13, $$Card, $$Astro4, $$ListItem, $$TechStackMain, $$Index, $$file3, $$url3, _page4, page4;
var init_index_astro = __esm({
  ".wrangler/tmp/pages-ErOWne/pages/index.astro.mjs"() {
    "use strict";
    init_modules_watch_stub();
    init_server_QlrBW5xk();
    init_astro_assets_B0_JMAFI();
    init_BaseLayout_A4ggbcpe();
    init_renderers();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    MyImage = new Proxy({ "src": "/_astro/myImage.CA8fuqj9.png", "width": 300, "height": 300, "format": "png" }, {
      get(target, name, receiver) {
        if (name === "clone") {
          return structuredClone(target);
        }
        if (name === "fsPath") {
          return "/Users/vivek/Desktop/self/myPortfolio/src/icons/myImage.png";
        }
        return target[name];
      }
    });
    $$Astro$3 = createAstro();
    $$ButtonPrimary = createComponent(($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
      Astro2.self = $$ButtonPrimary;
      const { value, href } = Astro2.props;
      return renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")} class="relative flex h-11 w-auto items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:border before:border-transparent before:bg-blue-purple-gradient before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"> <span class="relative text-white"> ${value} </span> </a>`;
    }, "/Users/vivek/Desktop/self/myPortfolio/src/components/ButtonPrimary.astro", void 0);
    $$Astro$22 = createAstro();
    $$ButtonSecondary = createComponent(($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$Astro$22, $$props, $$slots);
      Astro2.self = $$ButtonSecondary;
      const { value, href } = Astro2.props;
      return renderTemplate`${maybeRenderHead()}<a${addAttribute(href, "href")} class="relative gap-1 rounded-full border-2 border-solid border-neutral-border bg-black px-5 py-2.5 text-center before:absolute before:inset-0 before:rounded-full before:bg-black before:transition before:duration-300
  hover:before:scale-105 hover:before:border-2 hover:before:border-solid
  hover:before:border-white active:duration-75 active:before:scale-100 sm:w-max"> <span class="relative text-white"> ${value} </span> </a>`;
    }, "/Users/vivek/Desktop/self/myPortfolio/src/components/ButtonSecondary.astro", void 0);
    $$Astro$13 = createAstro();
    $$Card = createComponent(($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$Astro$13, $$props, $$slots);
      Astro2.self = $$Card;
      const { cardTitle, cardWidth, cardHeight, cardFooter } = Astro2.props;
      return renderTemplate`${maybeRenderHead()}<article${addAttribute(`${cardWidth} ${cardHeight}`, "class")}> <div${addAttribute(`h-full ${cardWidth} ${cardHeight} cursor-pointer ring-1 ring-neutral-border bg-neutral rounded-xl p-2 xl:p-4`, "class")}> ${!!cardTitle?.length && renderTemplate`<h1 class="mb-4 text-center text-2xl font-semibold tracking-tight"> ${cardTitle} </h1>`} ${renderSlot($$result, $$slots["default"])} </div> ${!!cardFooter?.length && renderTemplate`<h1 class="mt-4 truncate text-center text-lg font-semibold tracking-tight"> ${cardFooter} </h1>`} </article>`;
    }, "/Users/vivek/Desktop/self/myPortfolio/src/components/Card.astro", void 0);
    $$Astro4 = createAstro();
    $$ListItem = createComponent(($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$Astro4, $$props, $$slots);
      Astro2.self = $$ListItem;
      const { imageObject, orgName, position, tenure } = Astro2.props;
      return renderTemplate`${maybeRenderHead()}<li class="flex list-none justify-between py-3"> <div class="flex"> ${renderComponent($$result, "Icon", $$Icon, { "name": imageObject, "class": "mx-3 h-10 w-10 transform transition duration-300 hover:text-color-red focus:text-color-red" })} <div class="ml-4"> <p class="font-sm mb-1 uppercase leading-snug tracking-[2px] text-white"> ${orgName} </p> <p class="text-xs text-white">${position}</p> </div> </div> <div class="w-32"> <p class="text-xs text-white">${tenure}</p> </div> </li>`;
    }, "/Users/vivek/Desktop/self/myPortfolio/src/components/ListItem.astro", void 0);
    $$TechStackMain = createComponent(($$result, $$props, $$slots) => {
      return renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": /* @__PURE__ */ __name(($$result2) => renderTemplate`${maybeRenderHead()}<h1 class="text-center text-4xl font-bold leading-none tracking-tight">
My Tech Stack
</h1><div class="relative mt-8 flex items-center justify-center"><div class="mx-auto h-[480px] w-[1px] border border-neutral-border"></div><div class="absolute mx-auto h-[1px] w-full max-w-[1130px] border border-neutral-border"></div><div class="absolute mx-auto grid w-full max-w-[1130px] grid-cols-2"><div class="flex h-[200px] w-full items-center justify-center">${renderComponent($$result2, "Card", $$Card, { "cardFooter": "frontend", "cardWidth": "w-[150px] sm:w-[240px] xl:w-[480px]" }, { "default": /* @__PURE__ */ __name(($$result3) => renderTemplate`<div class="mx-auto grid grid-cols-2 justify-center sm:flex">${renderComponent($$result3, "Icon", $$Icon, { "name": "react", "class": "svgRotate mx-2 my-1 h-10 w-10 sm:mx-4 sm:my-0" })}${renderComponent($$result3, "Icon", $$Icon, { "name": "remix", "class": "svgRotate mx-2 my-1 h-10 w-10 sm:mx-4 sm:my-0" })}${renderComponent($$result3, "Icon", $$Icon, { "name": "astro_logo_figma", "class": "svgRotate mx-2 my-1 h-10 w-10 sm:mx-4 sm:my-0" })}${renderComponent($$result3, "Icon", $$Icon, { "name": "tailwind", "class": "svgRotate mx-2 my-1 h-10 w-10 sm:mx-4 sm:my-0" })}</div>`, "default") })}</div><div class="flex h-[200px] w-full items-center justify-center">${renderComponent($$result2, "Card", $$Card, { "cardFooter": "backend", "cardWidth": "w-[150px] sm:w-[240px] xl:w-[480px]" }, { "default": /* @__PURE__ */ __name(($$result3) => renderTemplate`<div class="mx-auto grid grid-cols-2 justify-center sm:flex">${renderComponent($$result3, "Icon", $$Icon, { "name": "nodejs", "class": "svgRotate mx-2 my-1 h-10 w-10 sm:mx-4 sm:my-0" })}${renderComponent($$result3, "Icon", $$Icon, { "name": "mongodb", "class": "svgRotate mx-2 my-1 h-10 w-10 sm:mx-4 sm:my-0" })}${renderComponent($$result3, "Icon", $$Icon, { "name": "mysql", "class": "svgRotate mx-2 my-1 h-10 w-10 sm:mx-4 sm:my-0" })}</div>`, "default") })}</div><div class="flex h-[200px] w-full items-center justify-center">${renderComponent($$result2, "Card", $$Card, { "cardFooter": "deployment & CI/CD", "cardWidth": "w-[150px] sm:w-[240px] xl:w-[480px]" }, { "default": /* @__PURE__ */ __name(($$result3) => renderTemplate`<div class="mx-auto grid grid-cols-2 justify-center sm:flex">${renderComponent($$result3, "Icon", $$Icon, { "name": "gitlab", "class": "svgRotate mx-2 my-1 h-10 w-10 sm:mx-4 sm:my-0" })}${renderComponent($$result3, "Icon", $$Icon, { "name": "railway", "class": "svgRotate mx-2 my-1 h-10 w-10 sm:mx-4 sm:my-0" })}${renderComponent($$result3, "Icon", $$Icon, { "name": "github-mark-white", "class": "svgRotate mx-2 my-1 h-10 w-10 sm:mx-4 sm:my-0" })}${renderComponent($$result3, "Icon", $$Icon, { "name": "vercel", "class": "svgRotate mx-2 my-1 h-10 w-10 sm:mx-4 sm:my-0" })}</div>`, "default") })}</div><div class="flex h-[200px] w-full items-center justify-center">${renderComponent($$result2, "Card", $$Card, { "cardFooter": "notes & ideation \u{1F4A1}", "cardWidth": "w-[150px] sm:w-[240px] xl:w-[480px]" }, { "default": /* @__PURE__ */ __name(($$result3) => renderTemplate`<div class="mx-auto grid grid-cols-2 justify-center sm:flex">${renderComponent($$result3, "Icon", $$Icon, { "name": "notion", "class": "svgRotate mx-2 my-1 h-10 w-10 sm:mx-4 sm:my-0" })}${renderComponent($$result3, "Icon", $$Icon, { "name": "excalidraw", "class": "svgRotate mx-2 my-1 h-10 w-10 sm:mx-4 sm:my-0" })}</div>`, "default") })}</div></div></div>`, "default") })}`;
    }, "/Users/vivek/Desktop/self/myPortfolio/src/components/TechStackMain.astro", void 0);
    $$Index = createComponent(($$result, $$props, $$slots) => {
      return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "pageTitle": "viveks portfolio homepage" }, { "default": /* @__PURE__ */ __name(($$result2) => renderTemplate` ${maybeRenderHead()}<section class="section-1 relative min-h-screen w-full snap-start pt-20 md:min-h-fit md:pt-32"> <div class="mb-24 flex flex-col lg:flex-row lg:justify-between"> <div class="order-2 max-w-2xl lg:order-1"> <div> <h1 class="letters mt-10 cursor-pointer text-header font-bold leading-none tracking-tight xl:mt-0">
Hi there,<br class="block sm:hidden"> I&apos;m <br class="hidden sm:block"> <div class="hidden md:block"> <span class="letters__one -mr-[12px] hidden md:inline-block">V</span> <span class="letters__two -mr-[12px] hidden md:inline-block">i</span> <span class="letters__three -mr-[12px] hidden md:inline-block">v</span> <span class="letters__four -mr-[12px] hidden md:inline-block">e</span> <span class="letters__five -mr-[12px] hidden md:inline-block">k</span> <span class="letters__five -mr-[12px] hidden md:inline-block">&nbsp;</span> <span class="letters__six -mr-[12px] hidden md:inline-block">L</span> <span class="letters__seven -mr-[12px] hidden md:inline-block">o</span> <span class="letters__eight -mr-[12px] hidden md:inline-block">k</span> <span class="letters__nine -mr-[12px] hidden md:inline-block">h</span> <span class="letters__ten -mr-[12px] hidden md:inline-block">a</span> <span class="letters__eleven -mr-[12px] hidden md:inline-block">n</span> <span class="letters__twelve -mr-[12px] hidden md:inline-block">d</span> <span class="letters__thirteen hidden md:inline-block">e</span> <span>.</span> </div> <span class="block md:hidden">Vivek Lokhande.</span> </h1> <p class="mt-10">
I like tinkering with open source. Experimenting with new
            frameworks.
<br class="hidden lg:block"> Lately getting interested in creating
            useful products which
<br class="hidden lg:block"> people can use.On my journey to become
            a fullstack dev.
</p> </div> <div class="mt-20 flex flex-col gap-4 px-4 sm:flex-row md:px-0"> ${renderComponent($$result2, "ButtonPrimary", $$ButtonPrimary, { "value": "Read my blogs", "href": "/blogs" })} ${renderComponent($$result2, "ButtonSecondary", $$ButtonSecondary, { "value": "Resume", "href": "https://flowcv.com/resume/sn0nv3i4u3" })} </div> </div> <div class="imageCard group relative order-1 w-fit lg:order-2"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "circle", "class": "h-[150px] w-[150px] animate-spin-slow group-hover:animate-spin lg:h-[340px] lg:w-[340px]" })} ${renderComponent($$result2, "Image", $$Image, { "loading": "eager", "src": MyImage, "alt": "my picture", "class": "imageCard__image absolute left-2 top-2.5 h-[132px] w-[132px] cursor-pointer opacity-0 ease-in-out lg:left-5 lg:top-5 lg:h-[300px] lg:w-[300px]" })} </div> </div> <div class="item mb-24 hidden flex-col gap-8 lg:flex-row xl:flex xl:justify-between"> ${renderComponent($$result2, "Card", $$Card, { "cardTitle": "About Me", "cardWidth": "xl:basis-2/3 basis-full", "cardHeight": "" }, { "default": /* @__PURE__ */ __name(($$result3) => renderTemplate` <p class="mt-4 tracking-tight">
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
</p> `, "default") })} ${renderComponent($$result2, "Card", $$Card, { "cardTitle": "Experience", "cardWidth": "basis-full w-full xl:basis-1/3", "cardHeight": "" }, { "default": /* @__PURE__ */ __name(($$result3) => renderTemplate` <ul> ${renderComponent($$result3, "ListItem", $$ListItem, { "imageObject": "browserstack", "orgName": "BrowserStack", "position": "software engineer", "tenure": "March 2024 \u2010 Present" })} ${renderComponent($$result3, "ListItem", $$ListItem, { "imageObject": "geekyants_logo", "orgName": "GEEKYANTS", "position": "software engineer-III", "tenure": "Dec 2023 \u2010 March 2024" })} ${renderComponent($$result3, "ListItem", $$ListItem, { "imageObject": "geekyants_logo", "orgName": "GEEKYANTS", "position": "software engineer-II", "tenure": "Aug 2022 \u2010 Dec 2023" })} ${renderComponent($$result3, "ListItem", $$ListItem, { "imageObject": "geekyants_logo", "orgName": "GEEKYANTS", "position": "software engineer-I", "tenure": "Aug 2021 \u2010 Aug 2022" })} ${renderComponent($$result3, "ListItem", $$ListItem, { "imageObject": "geekyants_logo", "orgName": "Biencaps", "position": "motion graphics designer", "tenure": "June 2020 - Aug 2020" })} </ul> `, "default") })} </div> </section> <section class="item mb-24 flex min-h-screen snap-start flex-col items-center justify-center gap-8 md:min-h-fit md:items-baseline lg:flex-row xl:hidden xl:justify-between"> ${renderComponent($$result2, "Card", $$Card, { "cardTitle": "About Me", "cardWidth": "xl:basis-2/3 basis-full", "cardHeight": "" }, { "default": /* @__PURE__ */ __name(($$result3) => renderTemplate` <p class="mt-4 tracking-tight">
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
</p> `, "default") })} ${renderComponent($$result2, "Card", $$Card, { "cardTitle": "Experience", "cardWidth": "basis-full w-full xl:basis-1/3", "cardHeight": "h-full" }, { "default": /* @__PURE__ */ __name(($$result3) => renderTemplate` <ul> ${renderComponent($$result3, "ListItem", $$ListItem, { "imageObject": "browserstack", "orgName": "BROWSERSTACK", "position": "software engineer", "tenure": "Mar 2024 \u2010 Present" })} ${renderComponent($$result3, "ListItem", $$ListItem, { "imageObject": "geekyants_logo", "orgName": "GEEKYANTS", "position": "software engineer-III", "tenure": "Dec 2023 \u2010 Mar 2024" })} ${renderComponent($$result3, "ListItem", $$ListItem, { "imageObject": "geekyants_logo", "orgName": "GEEKYANTS", "position": "software engineer-II", "tenure": "Aug 2022 \u2010 Dec 2023" })} ${renderComponent($$result3, "ListItem", $$ListItem, { "imageObject": "geekyants_logo", "orgName": "GEEKYANTS", "position": "software engineer-I", "tenure": "Aug 2021 \u2010 Aug 2022" })} ${renderComponent($$result3, "ListItem", $$ListItem, { "imageObject": "biencaps_logo", "orgName": "Biencaps", "position": "motion graphics designer", "tenure": "June 2020 - Aug 2020" })} </ul> `, "default") })} </section> <section class="section-2 relative mb-32 mt-20 w-full snap-start"> ${renderComponent($$result2, "TechStackMain", $$TechStackMain, {})} </section> `, "default") })} ${renderScript($$result, "/Users/vivek/Desktop/self/myPortfolio/src/pages/index.astro?astro&type=script&index=0&lang.ts")}`;
    }, "/Users/vivek/Desktop/self/myPortfolio/src/pages/index.astro", void 0);
    $$file3 = "/Users/vivek/Desktop/self/myPortfolio/src/pages/index.astro";
    $$url3 = "";
    _page4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      default: $$Index,
      file: $$file3,
      url: $$url3
    }, Symbol.toStringTag, { value: "Module" }));
    page4 = /* @__PURE__ */ __name(() => _page4, "page");
  }
});

// .wrangler/tmp/pages-ErOWne/_noop-actions.mjs
var noop_actions_exports = {};
__export(noop_actions_exports, {
  server: () => server
});
var server;
var init_noop_actions = __esm({
  ".wrangler/tmp/pages-ErOWne/_noop-actions.mjs"() {
    "use strict";
    init_modules_watch_stub();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    server = {};
  }
});

// .wrangler/tmp/pages-ErOWne/_astro-internal_middleware.mjs
var astro_internal_middleware_exports = {};
__export(astro_internal_middleware_exports, {
  onRequest: () => onRequest
});
var onRequest$1, onRequest;
var init_astro_internal_middleware = __esm({
  ".wrangler/tmp/pages-ErOWne/_astro-internal_middleware.mjs"() {
    "use strict";
    init_modules_watch_stub();
    init_astro_designed_error_pages_C4pJJTiQ();
    init_server_QlrBW5xk();
    init_index_CxGlcw8S();
    globalThis.process ??= {};
    globalThis.process.env ??= {};
    onRequest$1 = /* @__PURE__ */ __name((context, next) => {
      if (context.isPrerendered) {
        context.locals.runtime ??= {
          env: process.env
        };
      }
      return next();
    }, "onRequest$1");
    onRequest = sequence(
      onRequest$1
    );
  }
});

// .wrangler/tmp/bundle-5TSxL8/middleware-loader.entry.ts
init_modules_watch_stub();

// .wrangler/tmp/bundle-5TSxL8/middleware-insertion-facade.js
init_modules_watch_stub();

// .wrangler/tmp/pages-ErOWne/jkt567r40f.js
init_modules_watch_stub();

// .wrangler/tmp/pages-ErOWne/bundledWorker-0.47445462357112755.mjs
init_modules_watch_stub();
init_renderers();

// .wrangler/tmp/pages-ErOWne/chunks/_@astrojs-ssr-adapter_Du6eajJj.mjs
init_modules_watch_stub();
init_path_C_ZOwaTP();
init_index_CxGlcw8S();
init_server_QlrBW5xk();
init_astro_designed_error_pages_C4pJJTiQ();
import "cloudflare:workers";

// .wrangler/tmp/pages-ErOWne/chunks/noop-middleware_Cnd2MIX_.mjs
init_modules_watch_stub();
init_server_QlrBW5xk();
globalThis.process ??= {};
globalThis.process.env ??= {};
var NOOP_MIDDLEWARE_FN = /* @__PURE__ */ __name(async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
}, "NOOP_MIDDLEWARE_FN");

// .wrangler/tmp/pages-ErOWne/chunks/_@astrojs-ssr-adapter_Du6eajJj.mjs
globalThis.process ??= {};
globalThis.process.env ??= {};
function createI18nMiddleware(i18n, base, trailingSlash, format) {
  if (!i18n) return (_, next) => next();
  const payload = {
    ...i18n,
    trailingSlash,
    base,
    format
  };
  const _redirectToDefaultLocale = redirectToDefaultLocale(payload);
  const _noFoundForNonLocaleRoute = notFound(payload);
  const _requestHasLocale = requestHasLocale(payload.locales);
  const _redirectToFallback = redirectToFallback(payload);
  const prefixAlways = /* @__PURE__ */ __name((context, response) => {
    const url = context.url;
    if (url.pathname === base + "/" || url.pathname === base) {
      return _redirectToDefaultLocale(context);
    } else if (!_requestHasLocale(context)) {
      return _noFoundForNonLocaleRoute(context, response);
    }
    return void 0;
  }, "prefixAlways");
  const prefixOtherLocales = /* @__PURE__ */ __name((context, response) => {
    let pathnameContainsDefaultLocale = false;
    const url = context.url;
    for (const segment of url.pathname.split("/")) {
      if (normalizeTheLocale(segment) === normalizeTheLocale(i18n.defaultLocale)) {
        pathnameContainsDefaultLocale = true;
        break;
      }
    }
    if (pathnameContainsDefaultLocale) {
      const newLocation = url.pathname.replace(`/${i18n.defaultLocale}`, "");
      response.headers.set("Location", newLocation);
      return _noFoundForNonLocaleRoute(context);
    }
    return void 0;
  }, "prefixOtherLocales");
  return async (context, next) => {
    const response = await next();
    const type = response.headers.get(ROUTE_TYPE_HEADER);
    const isReroute = response.headers.get(REROUTE_DIRECTIVE_HEADER);
    if (isReroute === "no" && typeof i18n.fallback === "undefined") {
      return response;
    }
    if (type !== "page" && type !== "fallback") {
      return response;
    }
    if (requestIs404Or500(context.request, base)) {
      return response;
    }
    if (isRequestServerIsland(context.request, base)) {
      return response;
    }
    const { currentLocale } = context;
    switch (i18n.strategy) {
      // NOTE: theoretically, we should never hit this code path
      case "manual": {
        return response;
      }
      case "domains-prefix-other-locales": {
        if (localeHasntDomain(i18n, currentLocale)) {
          const result = prefixOtherLocales(context, response);
          if (result) {
            return result;
          }
        }
        break;
      }
      case "pathname-prefix-other-locales": {
        const result = prefixOtherLocales(context, response);
        if (result) {
          return result;
        }
        break;
      }
      case "domains-prefix-always-no-redirect": {
        if (localeHasntDomain(i18n, currentLocale)) {
          const result = _noFoundForNonLocaleRoute(context, response);
          if (result) {
            return result;
          }
        }
        break;
      }
      case "pathname-prefix-always-no-redirect": {
        const result = _noFoundForNonLocaleRoute(context, response);
        if (result) {
          return result;
        }
        break;
      }
      case "pathname-prefix-always": {
        const result = prefixAlways(context, response);
        if (result) {
          return result;
        }
        break;
      }
      case "domains-prefix-always": {
        if (localeHasntDomain(i18n, currentLocale)) {
          const result = prefixAlways(context, response);
          if (result) {
            return result;
          }
        }
        break;
      }
    }
    return _redirectToFallback(context, response);
  };
}
__name(createI18nMiddleware, "createI18nMiddleware");
function localeHasntDomain(i18n, currentLocale) {
  for (const domainLocale of Object.values(i18n.domainLookupTable)) {
    if (domainLocale === currentLocale) {
      return false;
    }
  }
  return true;
}
__name(localeHasntDomain, "localeHasntDomain");
var NOOP_ACTIONS_MOD = {
  server: {}
};
var FORM_CONTENT_TYPES = [
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
];
var SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];
function createOriginCheckMiddleware() {
  return defineMiddleware((context, next) => {
    const { request, url, isPrerendered } = context;
    if (isPrerendered) {
      return next();
    }
    if (SAFE_METHODS.includes(request.method)) {
      return next();
    }
    const isSameOrigin = request.headers.get("origin") === url.origin;
    const hasContentType2 = request.headers.has("content-type");
    if (hasContentType2) {
      const formLikeHeader = hasFormLikeHeader(request.headers.get("content-type"));
      if (formLikeHeader && !isSameOrigin) {
        return new Response(`Cross-site ${request.method} form submissions are forbidden`, {
          status: 403
        });
      }
    } else {
      if (!isSameOrigin) {
        return new Response(`Cross-site ${request.method} form submissions are forbidden`, {
          status: 403
        });
      }
    }
    return next();
  });
}
__name(createOriginCheckMiddleware, "createOriginCheckMiddleware");
function hasFormLikeHeader(contentType) {
  if (contentType) {
    for (const FORM_CONTENT_TYPE of FORM_CONTENT_TYPES) {
      if (contentType.toLowerCase().includes(FORM_CONTENT_TYPE)) {
        return true;
      }
    }
  }
  return false;
}
__name(hasFormLikeHeader, "hasFormLikeHeader");
function createDefaultRoutes(manifest2) {
  const root = new URL(manifest2.hrefRoot);
  return [
    {
      instance: default404Instance,
      matchesComponent: /* @__PURE__ */ __name((filePath) => filePath.href === new URL(DEFAULT_404_COMPONENT, root).href, "matchesComponent"),
      route: DEFAULT_404_ROUTE.route,
      component: DEFAULT_404_COMPONENT
    },
    {
      instance: createEndpoint(manifest2),
      matchesComponent: /* @__PURE__ */ __name((filePath) => filePath.href === new URL(SERVER_ISLAND_COMPONENT, root).href, "matchesComponent"),
      route: SERVER_ISLAND_ROUTE,
      component: SERVER_ISLAND_COMPONENT
    }
  ];
}
__name(createDefaultRoutes, "createDefaultRoutes");
var Pipeline = class {
  static {
    __name(this, "Pipeline");
  }
  constructor(logger, manifest2, runtimeMode, renderers2, resolve, serverLike, streaming, adapterName = manifest2.adapterName, clientDirectives = manifest2.clientDirectives, inlinedScripts = manifest2.inlinedScripts, compressHTML = manifest2.compressHTML, i18n = manifest2.i18n, middleware = manifest2.middleware, routeCache = new RouteCache(logger, runtimeMode), site = manifest2.site ? new URL(manifest2.site) : void 0, defaultRoutes = createDefaultRoutes(manifest2), actions = manifest2.actions) {
    this.logger = logger;
    this.manifest = manifest2;
    this.runtimeMode = runtimeMode;
    this.renderers = renderers2;
    this.resolve = resolve;
    this.serverLike = serverLike;
    this.streaming = streaming;
    this.adapterName = adapterName;
    this.clientDirectives = clientDirectives;
    this.inlinedScripts = inlinedScripts;
    this.compressHTML = compressHTML;
    this.i18n = i18n;
    this.middleware = middleware;
    this.routeCache = routeCache;
    this.site = site;
    this.defaultRoutes = defaultRoutes;
    this.actions = actions;
    this.internalMiddleware = [];
    if (i18n?.strategy !== "manual") {
      this.internalMiddleware.push(
        createI18nMiddleware(i18n, manifest2.base, manifest2.trailingSlash, manifest2.buildFormat)
      );
    }
  }
  internalMiddleware;
  resolvedMiddleware = void 0;
  resolvedActions = void 0;
  /**
   * Resolves the middleware from the manifest, and returns the `onRequest` function. If `onRequest` isn't there,
   * it returns a no-op function
   */
  async getMiddleware() {
    if (this.resolvedMiddleware) {
      return this.resolvedMiddleware;
    } else if (this.middleware) {
      const middlewareInstance = await this.middleware();
      const onRequest2 = middlewareInstance.onRequest ?? NOOP_MIDDLEWARE_FN;
      if (this.manifest.checkOrigin) {
        this.resolvedMiddleware = sequence(createOriginCheckMiddleware(), onRequest2);
      } else {
        this.resolvedMiddleware = onRequest2;
      }
      return this.resolvedMiddleware;
    } else {
      this.resolvedMiddleware = NOOP_MIDDLEWARE_FN;
      return this.resolvedMiddleware;
    }
  }
  setActions(actions) {
    this.resolvedActions = actions;
  }
  async getActions() {
    if (this.resolvedActions) {
      return this.resolvedActions;
    } else if (this.actions) {
      return await this.actions();
    }
    return NOOP_ACTIONS_MOD;
  }
  async getAction(path) {
    const pathKeys = path.split(".").map((key) => decodeURIComponent(key));
    let { server: server2 } = await this.getActions();
    if (!server2 || !(typeof server2 === "object")) {
      throw new TypeError(
        `Expected \`server\` export in actions file to be an object. Received ${typeof server2}.`
      );
    }
    for (const key of pathKeys) {
      if (!(key in server2)) {
        throw new AstroError({
          ...ActionNotFoundError,
          message: ActionNotFoundError.message(pathKeys.join("."))
        });
      }
      server2 = server2[key];
    }
    if (typeof server2 !== "function") {
      throw new TypeError(
        `Expected handler for action ${pathKeys.join(".")} to be a function. Received ${typeof server2}.`
      );
    }
    return server2;
  }
};
var RedirectComponentInstance = {
  default() {
    return new Response(null, {
      status: 301
    });
  }
};
var RedirectSinglePageBuiltModule = {
  page: /* @__PURE__ */ __name(() => Promise.resolve(RedirectComponentInstance), "page"),
  onRequest: /* @__PURE__ */ __name((_, next) => next(), "onRequest"),
  renderers: []
};
var dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});
var levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function log(opts, level, label, message, newLine = true) {
  const logLevel = opts.level;
  const dest = opts.dest;
  const event = {
    label,
    level,
    message,
    newLine
  };
  if (!isLogLevelEnabled(logLevel, level)) {
    return;
  }
  dest.write(event);
}
__name(log, "log");
function isLogLevelEnabled(configuredLogLevel, level) {
  return levels[configuredLogLevel] <= levels[level];
}
__name(isLogLevelEnabled, "isLogLevelEnabled");
function info(opts, label, message, newLine = true) {
  return log(opts, "info", label, message, newLine);
}
__name(info, "info");
function warn(opts, label, message, newLine = true) {
  return log(opts, "warn", label, message, newLine);
}
__name(warn, "warn");
function error(opts, label, message, newLine = true) {
  return log(opts, "error", label, message, newLine);
}
__name(error, "error");
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) {
    globalThis._astroGlobalDebug(...args);
  }
}
__name(debug, "debug");
function getEventPrefix({ level, label }) {
  const timestamp = `${dateTimeFormat.format(/* @__PURE__ */ new Date())}`;
  const prefix = [];
  if (level === "error" || level === "warn") {
    prefix.push(bold(timestamp));
    prefix.push(`[${level.toUpperCase()}]`);
  } else {
    prefix.push(timestamp);
  }
  if (label) {
    prefix.push(`[${label}]`);
  }
  if (level === "error") {
    return red(prefix.join(" "));
  }
  if (level === "warn") {
    return yellow(prefix.join(" "));
  }
  if (prefix.length === 1) {
    return dim(prefix[0]);
  }
  return dim(prefix[0]) + " " + blue(prefix.splice(1).join(" "));
}
__name(getEventPrefix, "getEventPrefix");
var Logger = class {
  static {
    __name(this, "Logger");
  }
  options;
  constructor(options) {
    this.options = options;
  }
  info(label, message, newLine = true) {
    info(this.options, label, message, newLine);
  }
  warn(label, message, newLine = true) {
    warn(this.options, label, message, newLine);
  }
  error(label, message, newLine = true) {
    error(this.options, label, message, newLine);
  }
  debug(label, ...messages) {
    debug(label, ...messages);
  }
  level() {
    return this.options.level;
  }
  forkIntegrationLogger(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
};
var AstroIntegrationLogger = class _AstroIntegrationLogger {
  static {
    __name(this, "AstroIntegrationLogger");
  }
  options;
  label;
  constructor(logging, label) {
    this.options = logging;
    this.label = label;
  }
  /**
   * Creates a new logger instance with a new label, but the same log options.
   */
  fork(label) {
    return new _AstroIntegrationLogger(this.options, label);
  }
  info(message) {
    info(this.options, this.label, message);
  }
  warn(message) {
    warn(this.options, this.label, message);
  }
  error(message) {
    error(this.options, this.label, message);
  }
  debug(message) {
    debug(this.label, message);
  }
};
var consoleLogDestination = {
  write(event) {
    let dest = console.error;
    if (levels[event.level] < levels["error"]) {
      dest = console.log;
    }
    if (event.label === "SKIP_FORMAT") {
      dest(event.message);
    } else {
      dest(getEventPrefix(event) + " " + event.message);
    }
    return true;
  }
};
function getAssetsPrefix(fileExtension2, assetsPrefix) {
  if (!assetsPrefix) return "";
  if (typeof assetsPrefix === "string") return assetsPrefix;
  const dotLessFileExtension = fileExtension2.slice(1);
  if (assetsPrefix[dotLessFileExtension]) {
    return assetsPrefix[dotLessFileExtension];
  }
  return assetsPrefix.fallback;
}
__name(getAssetsPrefix, "getAssetsPrefix");
function createAssetLink(href, base, assetsPrefix) {
  if (assetsPrefix) {
    const pf = getAssetsPrefix(fileExtension(href), assetsPrefix);
    return joinPaths(pf, slash(href));
  } else if (base) {
    return prependForwardSlash(joinPaths(base, slash(href)));
  } else {
    return href;
  }
}
__name(createAssetLink, "createAssetLink");
function createStylesheetElement(stylesheet, base, assetsPrefix) {
  if (stylesheet.type === "inline") {
    return {
      props: {},
      children: stylesheet.content
    };
  } else {
    return {
      props: {
        rel: "stylesheet",
        href: createAssetLink(stylesheet.src, base, assetsPrefix)
      },
      children: ""
    };
  }
}
__name(createStylesheetElement, "createStylesheetElement");
function createStylesheetElementSet(stylesheets, base, assetsPrefix) {
  return new Set(stylesheets.map((s2) => createStylesheetElement(s2, base, assetsPrefix)));
}
__name(createStylesheetElementSet, "createStylesheetElementSet");
function createModuleScriptElement(script, base, assetsPrefix) {
  if (script.type === "external") {
    return createModuleScriptElementWithSrc(script.value, base, assetsPrefix);
  } else {
    return {
      props: {
        type: "module"
      },
      children: script.value
    };
  }
}
__name(createModuleScriptElement, "createModuleScriptElement");
function createModuleScriptElementWithSrc(src, base, assetsPrefix) {
  return {
    props: {
      type: "module",
      src: createAssetLink(src, base, assetsPrefix)
    },
    children: ""
  };
}
__name(createModuleScriptElementWithSrc, "createModuleScriptElementWithSrc");
function redirectTemplate({
  status,
  absoluteLocation,
  relativeLocation,
  from
}) {
  const delay = status === 302 ? 2 : 0;
  return `<!doctype html>
<title>Redirecting to: ${relativeLocation}</title>
<meta http-equiv="refresh" content="${delay};url=${relativeLocation}">
<meta name="robots" content="noindex">
<link rel="canonical" href="${absoluteLocation}">
<body>
	<a href="${relativeLocation}">Redirecting ${from ? `from <code>${from}</code> ` : ""}to <code>${relativeLocation}</code></a>
</body>`;
}
__name(redirectTemplate, "redirectTemplate");
var AppPipeline = class _AppPipeline extends Pipeline {
  static {
    __name(this, "AppPipeline");
  }
  #manifestData;
  static create(manifestData, {
    logger,
    manifest: manifest2,
    runtimeMode,
    renderers: renderers2,
    resolve,
    serverLike,
    streaming,
    defaultRoutes
  }) {
    const pipeline = new _AppPipeline(
      logger,
      manifest2,
      runtimeMode,
      renderers2,
      resolve,
      serverLike,
      streaming,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0,
      defaultRoutes
    );
    pipeline.#manifestData = manifestData;
    return pipeline;
  }
  headElements(routeData) {
    const routeInfo = this.manifest.routes.find((route) => route.routeData === routeData);
    const links = /* @__PURE__ */ new Set();
    const scripts = /* @__PURE__ */ new Set();
    const styles = createStylesheetElementSet(routeInfo?.styles ?? []);
    for (const script of routeInfo?.scripts ?? []) {
      if ("stage" in script) {
        if (script.stage === "head-inline") {
          scripts.add({
            props: {},
            children: script.children
          });
        }
      } else {
        scripts.add(createModuleScriptElement(script));
      }
    }
    return { links, styles, scripts };
  }
  componentMetadata() {
  }
  async getComponentByRoute(routeData) {
    const module = await this.getModuleForRoute(routeData);
    return module.page();
  }
  async tryRewrite(payload, request) {
    const { newUrl, pathname, routeData } = findRouteToRewrite({
      payload,
      request,
      routes: this.manifest?.routes.map((r3) => r3.routeData),
      trailingSlash: this.manifest.trailingSlash,
      buildFormat: this.manifest.buildFormat,
      base: this.manifest.base
    });
    const componentInstance = await this.getComponentByRoute(routeData);
    return { newUrl, pathname, componentInstance, routeData };
  }
  async getModuleForRoute(route) {
    for (const defaultRoute of this.defaultRoutes) {
      if (route.component === defaultRoute.component) {
        return {
          page: /* @__PURE__ */ __name(() => Promise.resolve(defaultRoute.instance), "page"),
          renderers: []
        };
      }
    }
    if (route.type === "redirect") {
      return RedirectSinglePageBuiltModule;
    } else {
      if (this.manifest.pageMap) {
        const importComponentInstance = this.manifest.pageMap.get(route.component);
        if (!importComponentInstance) {
          throw new Error(
            `Unexpectedly unable to find a component instance for route ${route.route}`
          );
        }
        return await importComponentInstance();
      } else if (this.manifest.pageModule) {
        return this.manifest.pageModule;
      }
      throw new Error(
        "Astro couldn't find the correct page to render, probably because it wasn't correctly mapped for SSR usage. This is an internal error, please file an issue."
      );
    }
  }
};
var App = class _App {
  static {
    __name(this, "App");
  }
  #manifest;
  #manifestData;
  #logger = new Logger({
    dest: consoleLogDestination,
    level: "info"
  });
  #baseWithoutTrailingSlash;
  #pipeline;
  #adapterLogger;
  constructor(manifest2, streaming = true) {
    this.#manifest = manifest2;
    this.#manifestData = {
      routes: manifest2.routes.map((route) => route.routeData)
    };
    ensure404Route(this.#manifestData);
    this.#baseWithoutTrailingSlash = removeTrailingForwardSlash(this.#manifest.base);
    this.#pipeline = this.#createPipeline(this.#manifestData, streaming);
    this.#adapterLogger = new AstroIntegrationLogger(
      this.#logger.options,
      this.#manifest.adapterName
    );
  }
  getAdapterLogger() {
    return this.#adapterLogger;
  }
  /**
   * Creates a pipeline by reading the stored manifest
   *
   * @param manifestData
   * @param streaming
   * @private
   */
  #createPipeline(manifestData, streaming = false) {
    return AppPipeline.create(manifestData, {
      logger: this.#logger,
      manifest: this.#manifest,
      runtimeMode: "production",
      renderers: this.#manifest.renderers,
      defaultRoutes: createDefaultRoutes(this.#manifest),
      resolve: /* @__PURE__ */ __name(async (specifier) => {
        if (!(specifier in this.#manifest.entryModules)) {
          throw new Error(`Unable to resolve [${specifier}]`);
        }
        const bundlePath = this.#manifest.entryModules[specifier];
        if (bundlePath.startsWith("data:") || bundlePath.length === 0) {
          return bundlePath;
        } else {
          return createAssetLink(bundlePath, this.#manifest.base, this.#manifest.assetsPrefix);
        }
      }, "resolve"),
      serverLike: true,
      streaming
    });
  }
  set setManifestData(newManifestData) {
    this.#manifestData = newManifestData;
  }
  removeBase(pathname) {
    if (pathname.startsWith(this.#manifest.base)) {
      return pathname.slice(this.#baseWithoutTrailingSlash.length + 1);
    }
    return pathname;
  }
  /**
   * It removes the base from the request URL, prepends it with a forward slash and attempts to decoded it.
   *
   * If the decoding fails, it logs the error and return the pathname as is.
   * @param request
   * @private
   */
  #getPathnameFromRequest(request) {
    const url = new URL(request.url);
    const pathname = prependForwardSlash(this.removeBase(url.pathname));
    try {
      return decodeURI(pathname);
    } catch (e2) {
      this.getAdapterLogger().error(e2.toString());
      return pathname;
    }
  }
  match(request) {
    const url = new URL(request.url);
    if (this.#manifest.assets.has(url.pathname)) return void 0;
    let pathname = this.#computePathnameFromDomain(request);
    if (!pathname) {
      pathname = prependForwardSlash(this.removeBase(url.pathname));
    }
    let routeData = matchRoute(decodeURI(pathname), this.#manifestData);
    if (!routeData || routeData.prerender) return void 0;
    return routeData;
  }
  #computePathnameFromDomain(request) {
    let pathname = void 0;
    const url = new URL(request.url);
    if (this.#manifest.i18n && (this.#manifest.i18n.strategy === "domains-prefix-always" || this.#manifest.i18n.strategy === "domains-prefix-other-locales" || this.#manifest.i18n.strategy === "domains-prefix-always-no-redirect")) {
      let host = request.headers.get("X-Forwarded-Host");
      let protocol = request.headers.get("X-Forwarded-Proto");
      if (protocol) {
        protocol = protocol + ":";
      } else {
        protocol = url.protocol;
      }
      if (!host) {
        host = request.headers.get("Host");
      }
      if (host && protocol) {
        host = host.split(":")[0];
        try {
          let locale;
          const hostAsUrl = new URL(`${protocol}//${host}`);
          for (const [domainKey, localeValue] of Object.entries(
            this.#manifest.i18n.domainLookupTable
          )) {
            const domainKeyAsUrl = new URL(domainKey);
            if (hostAsUrl.host === domainKeyAsUrl.host && hostAsUrl.protocol === domainKeyAsUrl.protocol) {
              locale = localeValue;
              break;
            }
          }
          if (locale) {
            pathname = prependForwardSlash(
              joinPaths(normalizeTheLocale(locale), this.removeBase(url.pathname))
            );
            if (url.pathname.endsWith("/")) {
              pathname = appendForwardSlash(pathname);
            }
          }
        } catch (e2) {
          this.#logger.error(
            "router",
            `Astro tried to parse ${protocol}//${host} as an URL, but it threw a parsing error. Check the X-Forwarded-Host and X-Forwarded-Proto headers.`
          );
          this.#logger.error("router", `Error: ${e2}`);
        }
      }
    }
    return pathname;
  }
  #redirectTrailingSlash(pathname) {
    const { trailingSlash } = this.#manifest;
    if (pathname === "/" || pathname.startsWith("/_")) {
      return pathname;
    }
    const path = collapseDuplicateTrailingSlashes(pathname, trailingSlash !== "never");
    if (path !== pathname) {
      return path;
    }
    if (trailingSlash === "ignore") {
      return pathname;
    }
    if (trailingSlash === "always" && !hasFileExtension(pathname)) {
      return appendForwardSlash(pathname);
    }
    if (trailingSlash === "never") {
      return removeTrailingForwardSlash(pathname);
    }
    return pathname;
  }
  async render(request, renderOptions) {
    let routeData;
    let locals;
    let clientAddress;
    let addCookieHeader;
    const url = new URL(request.url);
    const redirect = this.#redirectTrailingSlash(url.pathname);
    const prerenderedErrorPageFetch = renderOptions?.prerenderedErrorPageFetch ?? fetch;
    if (redirect !== url.pathname) {
      const status = request.method === "GET" ? 301 : 308;
      return new Response(
        redirectTemplate({
          status,
          relativeLocation: url.pathname,
          absoluteLocation: redirect,
          from: request.url
        }),
        {
          status,
          headers: {
            location: redirect + url.search
          }
        }
      );
    }
    addCookieHeader = renderOptions?.addCookieHeader;
    clientAddress = renderOptions?.clientAddress ?? Reflect.get(request, clientAddressSymbol);
    routeData = renderOptions?.routeData;
    locals = renderOptions?.locals;
    if (routeData) {
      this.#logger.debug(
        "router",
        "The adapter " + this.#manifest.adapterName + " provided a custom RouteData for ",
        request.url
      );
      this.#logger.debug("router", "RouteData:\n" + routeData);
    }
    if (locals) {
      if (typeof locals !== "object") {
        const error2 = new AstroError(LocalsNotAnObject);
        this.#logger.error(null, error2.stack);
        return this.#renderError(request, {
          status: 500,
          error: error2,
          clientAddress,
          prerenderedErrorPageFetch
        });
      }
    }
    if (!routeData) {
      routeData = this.match(request);
      this.#logger.debug("router", "Astro matched the following route for " + request.url);
      this.#logger.debug("router", "RouteData:\n" + routeData);
    }
    if (!routeData) {
      routeData = this.#manifestData.routes.find(
        (route) => route.component === "404.astro" || route.component === DEFAULT_404_COMPONENT
      );
    }
    if (!routeData) {
      this.#logger.debug("router", "Astro hasn't found routes that match " + request.url);
      this.#logger.debug("router", "Here's the available routes:\n", this.#manifestData);
      return this.#renderError(request, {
        locals,
        status: 404,
        clientAddress,
        prerenderedErrorPageFetch
      });
    }
    const pathname = this.#getPathnameFromRequest(request);
    const defaultStatus = this.#getDefaultStatusCode(routeData, pathname);
    let response;
    let session;
    try {
      const mod = await this.#pipeline.getModuleForRoute(routeData);
      const renderContext = await RenderContext.create({
        pipeline: this.#pipeline,
        locals,
        pathname,
        request,
        routeData,
        status: defaultStatus,
        clientAddress
      });
      session = renderContext.session;
      response = await renderContext.render(await mod.page());
    } catch (err) {
      this.#logger.error(null, err.stack || err.message || String(err));
      return this.#renderError(request, {
        locals,
        status: 500,
        error: err,
        clientAddress,
        prerenderedErrorPageFetch
      });
    } finally {
      await session?.[PERSIST_SYMBOL]();
    }
    if (REROUTABLE_STATUS_CODES.includes(response.status) && response.headers.get(REROUTE_DIRECTIVE_HEADER) !== "no") {
      return this.#renderError(request, {
        locals,
        response,
        status: response.status,
        // We don't have an error to report here. Passing null means we pass nothing intentionally
        // while undefined means there's no error
        error: response.status === 500 ? null : void 0,
        clientAddress,
        prerenderedErrorPageFetch
      });
    }
    if (response.headers.has(REROUTE_DIRECTIVE_HEADER)) {
      response.headers.delete(REROUTE_DIRECTIVE_HEADER);
    }
    if (addCookieHeader) {
      for (const setCookieHeaderValue of _App.getSetCookieFromResponse(response)) {
        response.headers.append("set-cookie", setCookieHeaderValue);
      }
    }
    Reflect.set(response, responseSentSymbol, true);
    return response;
  }
  setCookieHeaders(response) {
    return getSetCookiesFromResponse(response);
  }
  /**
   * Reads all the cookies written by `Astro.cookie.set()` onto the passed response.
   * For example,
   * ```ts
   * for (const cookie_ of App.getSetCookieFromResponse(response)) {
   *     const cookie: string = cookie_
   * }
   * ```
   * @param response The response to read cookies from.
   * @returns An iterator that yields key-value pairs as equal-sign-separated strings.
   */
  static getSetCookieFromResponse = getSetCookiesFromResponse;
  /**
   * If it is a known error code, try sending the according page (e.g. 404.astro / 500.astro).
   * This also handles pre-rendered /404 or /500 routes
   */
  async #renderError(request, {
    locals,
    status,
    response: originalResponse,
    skipMiddleware = false,
    error: error2,
    clientAddress,
    prerenderedErrorPageFetch
  }) {
    const errorRoutePath = `/${status}${this.#manifest.trailingSlash === "always" ? "/" : ""}`;
    const errorRouteData = matchRoute(errorRoutePath, this.#manifestData);
    const url = new URL(request.url);
    if (errorRouteData) {
      if (errorRouteData.prerender) {
        const maybeDotHtml = errorRouteData.route.endsWith(`/${status}`) ? ".html" : "";
        const statusURL = new URL(
          `${this.#baseWithoutTrailingSlash}/${status}${maybeDotHtml}`,
          url
        );
        if (statusURL.toString() !== request.url) {
          const response2 = await prerenderedErrorPageFetch(statusURL.toString());
          const override = { status };
          return this.#mergeResponses(response2, originalResponse, override);
        }
      }
      const mod = await this.#pipeline.getModuleForRoute(errorRouteData);
      let session;
      try {
        const renderContext = await RenderContext.create({
          locals,
          pipeline: this.#pipeline,
          middleware: skipMiddleware ? NOOP_MIDDLEWARE_FN : void 0,
          pathname: this.#getPathnameFromRequest(request),
          request,
          routeData: errorRouteData,
          status,
          props: { error: error2 },
          clientAddress
        });
        session = renderContext.session;
        const response2 = await renderContext.render(await mod.page());
        return this.#mergeResponses(response2, originalResponse);
      } catch {
        if (skipMiddleware === false) {
          return this.#renderError(request, {
            locals,
            status,
            response: originalResponse,
            skipMiddleware: true,
            clientAddress,
            prerenderedErrorPageFetch
          });
        }
      } finally {
        await session?.[PERSIST_SYMBOL]();
      }
    }
    const response = this.#mergeResponses(new Response(null, { status }), originalResponse);
    Reflect.set(response, responseSentSymbol, true);
    return response;
  }
  #mergeResponses(newResponse, originalResponse, override) {
    if (!originalResponse) {
      if (override !== void 0) {
        return new Response(newResponse.body, {
          status: override.status,
          statusText: newResponse.statusText,
          headers: newResponse.headers
        });
      }
      return newResponse;
    }
    const status = override?.status ? override.status : originalResponse.status === 200 ? newResponse.status : originalResponse.status;
    try {
      originalResponse.headers.delete("Content-type");
    } catch {
    }
    const mergedHeaders = new Map([
      ...Array.from(newResponse.headers),
      ...Array.from(originalResponse.headers)
    ]);
    const newHeaders = new Headers();
    for (const [name, value] of mergedHeaders) {
      newHeaders.set(name, value);
    }
    return new Response(newResponse.body, {
      status,
      statusText: status === 200 ? newResponse.statusText : originalResponse.statusText,
      // If you're looking at here for possible bugs, it means that it's not a bug.
      // With the middleware, users can meddle with headers, and we should pass to the 404/500.
      // If users see something weird, it's because they are setting some headers they should not.
      //
      // Although, we don't want it to replace the content-type, because the error page must return `text/html`
      headers: newHeaders
    });
  }
  #getDefaultStatusCode(routeData, pathname) {
    if (!routeData.pattern.test(pathname)) {
      for (const fallbackRoute of routeData.fallbackRoutes) {
        if (fallbackRoute.pattern.test(pathname)) {
          return 302;
        }
      }
    }
    const route = removeTrailingForwardSlash(routeData.route);
    if (route.endsWith("/404")) return 404;
    if (route.endsWith("/500")) return 500;
    return 200;
  }
};
function createExports(manifest2) {
  const app = new App(manifest2);
  const fetch2 = /* @__PURE__ */ __name(async (request, env, context) => {
    const { pathname } = new URL(request.url);
    const bindingName = "SESSION";
    globalThis.__env__ ??= {};
    globalThis.__env__[bindingName] = env[bindingName];
    if (manifest2.assets.has(pathname)) {
      return env.ASSETS.fetch(request.url.replace(/\.html$/, ""));
    }
    const routeData = app.match(request);
    if (!routeData) {
      const asset = await env.ASSETS.fetch(
        request.url.replace(/index.html$/, "").replace(/\.html$/, "")
      );
      if (asset.status !== 404) {
        return asset;
      }
    }
    Reflect.set(
      request,
      Symbol.for("astro.clientAddress"),
      request.headers.get("cf-connecting-ip")
    );
    process.env.ASTRO_STUDIO_APP_TOKEN ??= (() => {
      if (typeof env.ASTRO_STUDIO_APP_TOKEN === "string") {
        return env.ASTRO_STUDIO_APP_TOKEN;
      }
    })();
    const locals = {
      runtime: {
        env,
        cf: request.cf,
        caches,
        ctx: {
          waitUntil: /* @__PURE__ */ __name((promise) => context.waitUntil(promise), "waitUntil"),
          // Currently not available: https://developers.cloudflare.com/pages/platform/known-issues/#pages-functions
          passThroughOnException: /* @__PURE__ */ __name(() => {
            throw new Error(
              "`passThroughOnException` is currently not available in Cloudflare Pages. See https://developers.cloudflare.com/pages/platform/known-issues/#pages-functions."
            );
          }, "passThroughOnException"),
          props: {}
        }
      }
    };
    const response = await app.render(request, { routeData, locals });
    if (app.setCookieHeaders) {
      for (const setCookieHeader of app.setCookieHeaders(response)) {
        response.headers.append("Set-Cookie", setCookieHeader);
      }
    }
    return response;
  }, "fetch");
  return { default: { fetch: fetch2 } };
}
__name(createExports, "createExports");
var serverEntrypointModule = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createExports
}, Symbol.toStringTag, { value: "Module" }));

// .wrangler/tmp/pages-ErOWne/manifest_BaSm6N2u.mjs
init_modules_watch_stub();
init_server_QlrBW5xk();
init_astro_designed_error_pages_C4pJJTiQ();
globalThis.process ??= {};
globalThis.process.env ??= {};
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
__name(sanitizeParams, "sanitizeParams");
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
__name(getParameter, "getParameter");
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
__name(getSegment, "getSegment");
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
__name(getRouteGenerator, "getRouteGenerator");
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
__name(deserializeRouteData, "deserializeRouteData");
function deserializeManifest(serializedManifest) {
  const routes2 = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes2.push({
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
    routes: routes2,
    serverIslandNameMap,
    key
  };
}
__name(deserializeManifest, "deserializeManifest");
var manifest = deserializeManifest({ "hrefRoot": "file:///Users/vivek/Desktop/self/myPortfolio/", "cacheDir": "file:///Users/vivek/Desktop/self/myPortfolio/node_modules/.astro/", "outDir": "file:///Users/vivek/Desktop/self/myPortfolio/dist/", "srcDir": "file:///Users/vivek/Desktop/self/myPortfolio/src/", "publicDir": "file:///Users/vivek/Desktop/self/myPortfolio/public/", "buildClientDir": "file:///Users/vivek/Desktop/self/myPortfolio/dist/", "buildServerDir": "file:///Users/vivek/Desktop/self/myPortfolio/dist/_worker.js/", "adapterName": "@astrojs/cloudflare", "routes": [{ "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "type": "page", "component": "_server-islands.astro", "params": ["name"], "segments": [[{ "content": "_server-islands", "dynamic": false, "spread": false }], [{ "content": "name", "dynamic": true, "spread": false }]], "pattern": "^\\/_server-islands\\/([^/]+?)\\/?$", "prerender": false, "isIndex": false, "fallbackRoutes": [], "route": "/_server-islands/[name]", "origin": "internal", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "type": "endpoint", "isIndex": false, "route": "/_image", "pattern": "^\\/_image\\/?$", "segments": [[{ "content": "_image", "dynamic": false, "spread": false }]], "params": [], "component": "node_modules/.pnpm/@astrojs+cloudflare@12.5.2_@types+node@22.15.3_astro@5.7.4_@netlify+blobs@8.2.0_@types+_e74d27dc494c79ee059327101ff7c4eb/node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js", "pathname": "/_image", "prerender": false, "fallbackRoutes": [], "origin": "internal", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [{ "type": "external", "src": "/_astro/blogs.ZVuX1xv6.css" }], "routeData": { "route": "/404", "isIndex": false, "type": "page", "pattern": "^\\/404\\/?$", "segments": [[{ "content": "404", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/404.astro", "pathname": "/404", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [{ "type": "external", "src": "/_astro/blogs.ZVuX1xv6.css" }], "routeData": { "route": "/blogs", "isIndex": false, "type": "page", "pattern": "^\\/blogs\\/?$", "segments": [[{ "content": "blogs", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/blogs.astro", "pathname": "/blogs", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [{ "type": "external", "src": "/_astro/blogs.ZVuX1xv6.css" }], "routeData": { "route": "/", "isIndex": true, "type": "page", "pattern": "^\\/$", "segments": [], "params": [], "component": "src/pages/index.astro", "pathname": "/", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }], "base": "/", "trailingSlash": "ignore", "compressHTML": true, "componentMetadata": [["\0astro:content", { "propagation": "in-tree", "containsHead": false }], ["/Users/vivek/Desktop/self/myPortfolio/src/pages/blogs.astro", { "propagation": "in-tree", "containsHead": true }], ["\0@astro-page:src/pages/blogs@_@astro", { "propagation": "in-tree", "containsHead": false }], ["\0@astrojs-ssr-virtual-entry", { "propagation": "in-tree", "containsHead": false }], ["/Users/vivek/Desktop/self/myPortfolio/src/pages/blogs/[slug].astro", { "propagation": "in-tree", "containsHead": true }], ["\0@astro-page:src/pages/blogs/[slug]@_@astro", { "propagation": "in-tree", "containsHead": false }], ["/Users/vivek/Desktop/self/myPortfolio/src/pages/404.astro", { "propagation": "none", "containsHead": true }], ["/Users/vivek/Desktop/self/myPortfolio/src/pages/index.astro", { "propagation": "none", "containsHead": true }]], "renderers": [], "clientDirectives": [["idle", '(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value=="object"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};"requestIdleCallback"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event("astro:idle"));})();'], ["load", '(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event("astro:load"));})();'], ["media", '(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener("change",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event("astro:media"));})();'], ["only", '(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event("astro:only"));})();'], ["visible", '(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value=="object"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event("astro:visible"));})();']], "entryModules": { "\0astro-internal:middleware": "_astro-internal_middleware.mjs", "\0noop-actions": "_noop-actions.mjs", "\0@astro-page:node_modules/.pnpm/@astrojs+cloudflare@12.5.2_@types+node@22.15.3_astro@5.7.4_@netlify+blobs@8.2.0_@types+_e74d27dc494c79ee059327101ff7c4eb/node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint@_@js": "pages/_image.astro.mjs", "\0@astro-page:src/pages/404@_@astro": "pages/404.astro.mjs", "\0@astro-page:src/pages/blogs/[slug]@_@astro": "pages/blogs/_slug_.astro.mjs", "\0@astro-page:src/pages/blogs@_@astro": "pages/blogs.astro.mjs", "\0@astro-page:src/pages/index@_@astro": "pages/index.astro.mjs", "\0@astrojs-ssr-virtual-entry": "index.js", "\0@astro-renderers": "renderers.mjs", "\0@astrojs-ssr-adapter": "_@astrojs-ssr-adapter.mjs", "\0@astrojs-manifest": "manifest_BaSm6N2u.mjs", "/Users/vivek/Desktop/self/myPortfolio/node_modules/.pnpm/unstorage@1.16.0_@netlify+blobs@8.2.0/node_modules/unstorage/drivers/cloudflare-kv-binding.mjs": "chunks/cloudflare-kv-binding_DMly_2Gl.mjs", "/Users/vivek/Desktop/self/myPortfolio/.astro/content-assets.mjs": "chunks/content-assets_kVZB-fS5.mjs", "/Users/vivek/Desktop/self/myPortfolio/.astro/content-modules.mjs": "chunks/content-modules_Bvq7llv8.mjs", "/Users/vivek/Desktop/self/myPortfolio/node_modules/.pnpm/astro@5.7.4_@netlify+blobs@8.2.0_@types+node@22.15.3_jiti@1.21.7_rollup@4.40.1_typescript@5.8.3_yaml@2.7.1/node_modules/astro/dist/assets/services/sharp.js": "chunks/sharp_CSSE_8-f.mjs", "\0astro:data-layer-content": "chunks/_astro_data-layer-content_zvctE0gs.mjs", "/Users/vivek/Desktop/self/myPortfolio/src/pages/404.astro?astro&type=script&index=0&lang.ts": "_astro/404.astro_astro_type_script_index_0_lang.l0sNRNKZ.js", "/Users/vivek/Desktop/self/myPortfolio/src/components/NavbarMobile.astro?astro&type=script&index=0&lang.ts": "_astro/NavbarMobile.astro_astro_type_script_index_0_lang.CYMelti3.js", "/Users/vivek/Desktop/self/myPortfolio/src/pages/index.astro?astro&type=script&index=0&lang.ts": "_astro/index.astro_astro_type_script_index_0_lang.Ci2KRMwk.js", "astro:scripts/before-hydration.js": "" }, "inlinedScripts": [["/Users/vivek/Desktop/self/myPortfolio/src/pages/404.astro?astro&type=script&index=0&lang.ts", ""], ["/Users/vivek/Desktop/self/myPortfolio/src/components/NavbarMobile.astro?astro&type=script&index=0&lang.ts", 'const e=document.querySelector(".overlay"),a=document.querySelector(".menu"),s=document.querySelector(".nav-links");a.addEventListener("click",t=>{s.classList.toggle("hidden"),t.stopPropagation(),s.classList.contains("hidden")?(e.classList.remove("bg-black/60"),e.classList.remove("pointer-events-auto"),e.classList.remove("md:pointer-events-none"),e.classList.add("pointer-events-none")):(e.classList.add("bg-black/60"),e.classList.add("pointer-events-auto"),e.classList.add("md:pointer-events-none"))});e.addEventListener("click",t=>{const n=t.relatedTarget;s.contains(n)||(s.classList.add("hidden"),e.classList.remove("bg-black/60"),e.classList.remove("pointer-events-auto"),e.classList.remove("md:pointer-events-none"),e.classList.add("pointer-events-none"))});']], "assets": ["/_astro/myImage-2.BmXx2IYx.jpg", "/_astro/myImage.CA8fuqj9.png", "/_astro/myGradient.QSScO5Tz.jpeg", "/_astro/img-2.BYW8UHPp.png", "/_astro/img-3.CD_xLwhH.png", "/_astro/img-5.yQM2O3Xv.png", "/_astro/img-7.lGnH6BvX.png", "/_astro/img-1.BuHQZ9dy.jpeg", "/_astro/img-8.CGDQjGyO.png", "/_astro/cover-5.Dwz0KzzU.svg", "/_astro/img-4.CLFfm2wk.png", "/_astro/cover-4.Bvr2iquK.svg", "/_astro/img-3.CBpCP0OL.png", "/_astro/img-1.Dji-5EKx.jpeg", "/_astro/img-2.Cb_neWDX.png", "/_astro/img-9.DFrma0PD.webp", "/_astro/img-5._pFz6TsE.png", "/_astro/img-3.dD46bTsN.png", "/_astro/img-4.B-K6LAT2.gif", "/_astro/cover-2.B6gX_Z1C.svg", "/_astro/img-1.C8BBGdYj.webp", "/_astro/img-6.CEAa-Ied.gif", "/_astro/img-2.DsZnEnE8.webp", "/_astro/img-3.BpraL8Ee.webp", "/_astro/img-4.D6vkjjnC.webp", "/_astro/img-5.CPTcMdp6.webp", "/_astro/img-7.DM88jFxc.webp", "/_astro/img-9.CAHRrZmY.webp", "/_astro/img-8.BzygR3tF.webp", "/_astro/cover-1.BHmZGZRv.svg", "/_astro/img-2.XZm3Ra8g.png", "/_astro/img-1.B9FylZgI.jpeg", "/_astro/img-3.OyDLVPms.png", "/_astro/img-4.cLFh3ago.png", "/_astro/cover-3.DUSvsGXI.svg", "/_astro/blogs.ZVuX1xv6.css", "/_astro/index.astro_astro_type_script_index_0_lang.Ci2KRMwk.js", "/_worker.js/_@astrojs-ssr-adapter.mjs", "/_worker.js/_astro-internal_middleware.mjs", "/_worker.js/_noop-actions.mjs", "/_worker.js/index.js", "/_worker.js/renderers.mjs", "/fonts/Inter-Black.ttf", "/fonts/Inter-Bold.ttf", "/fonts/Inter-ExtraBold.ttf", "/fonts/Inter-ExtraLight.ttf", "/fonts/Inter-Light.ttf", "/fonts/Inter-Medium.ttf", "/fonts/Inter-Regular.ttf", "/fonts/Inter-SemiBold.ttf", "/fonts/Inter-Thin.ttf", "/_worker.js/chunks/BaseLayout_A4ggbcpe.mjs", "/_worker.js/chunks/UTCDateStringToReadable_DU2vtAkX.mjs", "/_worker.js/chunks/_@astrojs-ssr-adapter_Du6eajJj.mjs", "/_worker.js/chunks/_astro_assets_B0-JMAFI.mjs", "/_worker.js/chunks/_astro_data-layer-content_zvctE0gs.mjs", "/_worker.js/chunks/astro-designed-error-pages_C4pJJTiQ.mjs", "/_worker.js/chunks/astro_JfxVdTwa.mjs", "/_worker.js/chunks/cloudflare-kv-binding_DMly_2Gl.mjs", "/_worker.js/chunks/content-assets_kVZB-fS5.mjs", "/_worker.js/chunks/content-modules_Bvq7llv8.mjs", "/_worker.js/chunks/index_CxGlcw8S.mjs", "/_worker.js/chunks/noop-middleware_Cnd2MIX_.mjs", "/_worker.js/chunks/parse_EttCPxrw.mjs", "/_worker.js/chunks/path_C-ZOwaTP.mjs", "/_worker.js/chunks/sharp_CSSE_8-f.mjs", "/_worker.js/_astro/blogs.ZVuX1xv6.css", "/_worker.js/_astro/cover-1.BHmZGZRv.svg", "/_worker.js/_astro/cover-2.B6gX_Z1C.svg", "/_worker.js/_astro/cover-3.DUSvsGXI.svg", "/_worker.js/_astro/cover-4.Bvr2iquK.svg", "/_worker.js/_astro/cover-5.Dwz0KzzU.svg", "/_worker.js/_astro/img-1.B9FylZgI.jpeg", "/_worker.js/_astro/img-1.BuHQZ9dy.jpeg", "/_worker.js/_astro/img-1.C8BBGdYj.webp", "/_worker.js/_astro/img-1.Dji-5EKx.jpeg", "/_worker.js/_astro/img-2.BYW8UHPp.png", "/_worker.js/_astro/img-2.Cb_neWDX.png", "/_worker.js/_astro/img-2.DsZnEnE8.webp", "/_worker.js/_astro/img-2.XZm3Ra8g.png", "/_worker.js/_astro/img-3.BpraL8Ee.webp", "/_worker.js/_astro/img-3.CBpCP0OL.png", "/_worker.js/_astro/img-3.CD_xLwhH.png", "/_worker.js/_astro/img-3.OyDLVPms.png", "/_worker.js/_astro/img-3.dD46bTsN.png", "/_worker.js/_astro/img-4.B-K6LAT2.gif", "/_worker.js/_astro/img-4.CLFfm2wk.png", "/_worker.js/_astro/img-4.D6vkjjnC.webp", "/_worker.js/_astro/img-4.cLFh3ago.png", "/_worker.js/_astro/img-5.CPTcMdp6.webp", "/_worker.js/_astro/img-5._pFz6TsE.png", "/_worker.js/_astro/img-5.yQM2O3Xv.png", "/_worker.js/_astro/img-6.CEAa-Ied.gif", "/_worker.js/_astro/img-7.DM88jFxc.webp", "/_worker.js/_astro/img-7.lGnH6BvX.png", "/_worker.js/_astro/img-8.BzygR3tF.webp", "/_worker.js/_astro/img-8.CGDQjGyO.png", "/_worker.js/_astro/img-9.CAHRrZmY.webp", "/_worker.js/_astro/img-9.DFrma0PD.webp", "/_worker.js/_astro/myGradient.QSScO5Tz.jpeg", "/_worker.js/_astro/myImage-2.BmXx2IYx.jpg", "/_worker.js/_astro/myImage.CA8fuqj9.png", "/_worker.js/pages/404.astro.mjs", "/_worker.js/pages/_image.astro.mjs", "/_worker.js/pages/blogs.astro.mjs", "/_worker.js/pages/index.astro.mjs", "/_worker.js/chunks/astro/server_QlrBW5xk.mjs", "/_worker.js/pages/blogs/_slug_.astro.mjs"], "buildFormat": "directory", "checkOrigin": true, "serverIslandNameMap": [], "key": "tHsqRlBCDVDueCRA96fQYsJKMke/GG6XTuB+HGFjLZE=", "sessionConfig": { "driver": "cloudflare-kv-binding", "options": { "binding": "SESSION" } } });
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => Promise.resolve().then(() => (init_cloudflare_kv_binding_DMly_2Gl(), cloudflare_kv_binding_DMly_2Gl_exports));

// .wrangler/tmp/pages-ErOWne/bundledWorker-0.47445462357112755.mjs
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
globalThis.process ??= {};
globalThis.process.env ??= {};
var serverIslandMap = /* @__PURE__ */ new Map();
var _page0 = /* @__PURE__ */ __name2(() => Promise.resolve().then(() => (init_image_astro(), image_astro_exports)), "_page0");
var _page1 = /* @__PURE__ */ __name2(() => Promise.resolve().then(() => (init_astro(), astro_exports)), "_page1");
var _page22 = /* @__PURE__ */ __name2(() => Promise.resolve().then(() => (init_slug_astro(), slug_astro_exports)), "_page2");
var _page32 = /* @__PURE__ */ __name2(() => Promise.resolve().then(() => (init_blogs_astro(), blogs_astro_exports)), "_page3");
var _page42 = /* @__PURE__ */ __name2(() => Promise.resolve().then(() => (init_index_astro(), index_astro_exports)), "_page4");
var pageMap = /* @__PURE__ */ new Map([
  ["node_modules/.pnpm/@astrojs+cloudflare@12.5.2_@types+node@22.15.3_astro@5.7.4_@netlify+blobs@8.2.0_@types+_e74d27dc494c79ee059327101ff7c4eb/node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js", _page0],
  ["src/pages/404.astro", _page1],
  ["src/pages/blogs/[slug].astro", _page22],
  ["src/pages/blogs.astro", _page32],
  ["src/pages/index.astro", _page42]
]);
var _manifest = Object.assign(manifest, {
  pageMap,
  serverIslandMap,
  renderers,
  actions: /* @__PURE__ */ __name2(() => Promise.resolve().then(() => (init_noop_actions(), noop_actions_exports)), "actions"),
  middleware: /* @__PURE__ */ __name2(() => Promise.resolve().then(() => (init_astro_internal_middleware(), astro_internal_middleware_exports)), "middleware")
});
var _args = void 0;
var _exports = createExports(_manifest);
var __astrojsSsrVirtualEntry = _exports.default;
var _start = "start";
if (_start in serverEntrypointModule) {
  serverEntrypointModule[_start](_manifest, _args);
}

// node_modules/.pnpm/wrangler@4.13.2_@cloudflare+workers-types@4.20250430.0/node_modules/wrangler/templates/pages-dev-util.ts
init_modules_watch_stub();
function isRoutingRuleMatch(pathname, routingRule) {
  if (!pathname) {
    throw new Error("Pathname is undefined.");
  }
  if (!routingRule) {
    throw new Error("Routing rule is undefined.");
  }
  const ruleRegExp = transformRoutingRuleToRegExp(routingRule);
  return pathname.match(ruleRegExp) !== null;
}
__name(isRoutingRuleMatch, "isRoutingRuleMatch");
function transformRoutingRuleToRegExp(rule) {
  let transformedRule;
  if (rule === "/" || rule === "/*") {
    transformedRule = rule;
  } else if (rule.endsWith("/*")) {
    transformedRule = `${rule.substring(0, rule.length - 2)}(/*)?`;
  } else if (rule.endsWith("/")) {
    transformedRule = `${rule.substring(0, rule.length - 1)}(/)?`;
  } else if (rule.endsWith("*")) {
    transformedRule = rule;
  } else {
    transformedRule = `${rule}(/)?`;
  }
  transformedRule = `^${transformedRule.replaceAll(/\./g, "\\.").replaceAll(/\*/g, ".*")}$`;
  return new RegExp(transformedRule);
}
__name(transformRoutingRuleToRegExp, "transformRoutingRuleToRegExp");

// .wrangler/tmp/pages-ErOWne/jkt567r40f.js
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
        const workerAsHandler = __astrojsSsrVirtualEntry;
        if (workerAsHandler.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return workerAsHandler.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};

// node_modules/.pnpm/wrangler@4.13.2_@cloudflare+workers-types@4.20250430.0/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
init_modules_watch_stub();
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e2) {
      console.error("Failed to drain the unused request body.", e2);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/.pnpm/wrangler@4.13.2_@cloudflare+workers-types@4.20250430.0/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
init_modules_watch_stub();
function reduceError(e2) {
  return {
    name: e2?.name,
    message: e2?.message ?? String(e2),
    stack: e2?.stack,
    cause: e2?.cause === void 0 ? void 0 : reduceError(e2.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e2) {
    const error2 = reduceError(e2);
    return Response.json(error2, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-5TSxL8/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_dev_pipeline_default;

// node_modules/.pnpm/wrangler@4.13.2_@cloudflare+workers-types@4.20250430.0/node_modules/wrangler/templates/middleware/common.ts
init_modules_watch_stub();
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-5TSxL8/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init2) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init2.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init2) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init2.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default,
  pageMap
};
/**
 * shortdash - https://github.com/bibig/node-shorthash
 *
 * @license
 *
 * (The MIT License)
 *
 * Copyright (c) 2013 Bibig <bibig@me.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
/*! https://mths.be/cssesc v3.0.0 by @mathias */
//# sourceMappingURL=jkt567r40f.js.map
