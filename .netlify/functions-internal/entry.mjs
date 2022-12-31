import * as adapter from '@astrojs/netlify/netlify-functions.js';
import { escape } from 'html-escaper';
/* empty css                                 */import path from 'node:path';
import fsp from 'node:fs/promises';
import fs from 'node:fs';
import 'mime';
import 'cookie';
import 'kleur/colors';
import 'string-width';
import 'path-browserify';
import { compile } from 'path-to-regexp';

function baseCreateComponent(cb, moduleId) {
  cb.isAstroComponentFactory = true;
  cb.moduleId = moduleId;
  return cb;
}
function createComponentWithOptions(opts) {
  const cb = baseCreateComponent(opts.factory, opts.moduleId);
  cb.propagation = opts.propagation;
  return cb;
}
function createComponent(arg1, moduleId) {
  if (typeof arg1 === "function") {
    return baseCreateComponent(arg1, moduleId);
  } else {
    return createComponentWithOptions(arg1);
  }
}

const ASTRO_VERSION = "1.7.2";

function createDeprecatedFetchContentFn() {
  return () => {
    throw new Error("Deprecated: Astro.fetchContent() has been replaced with Astro.glob().");
  };
}
function createAstroGlobFn() {
  const globHandler = (importMetaGlobResult, globValue) => {
    let allEntries = [...Object.values(importMetaGlobResult)];
    if (allEntries.length === 0) {
      throw new Error(`Astro.glob(${JSON.stringify(globValue())}) - no matches found.`);
    }
    return Promise.all(allEntries.map((fn) => fn()));
  };
  return globHandler;
}
function createAstro(filePathname, _site, projectRootStr) {
  const site = _site ? new URL(_site) : void 0;
  const referenceURL = new URL(filePathname, `http://localhost`);
  const projectRoot = new URL(projectRootStr);
  return {
    site,
    generator: `Astro v${ASTRO_VERSION}`,
    fetchContent: createDeprecatedFetchContentFn(),
    glob: createAstroGlobFn(),
    resolve(...segments) {
      let resolved = segments.reduce((u, segment) => new URL(segment, u), referenceURL).pathname;
      if (resolved.startsWith(projectRoot.pathname)) {
        resolved = "/" + resolved.slice(projectRoot.pathname.length);
      }
      return resolved;
    }
  };
}

const escapeHTML = escape;
class HTMLString extends String {
  get [Symbol.toStringTag]() {
    return "HTMLString";
  }
}
const markHTMLString = (value) => {
  if (value instanceof HTMLString) {
    return value;
  }
  if (typeof value === "string") {
    return new HTMLString(value);
  }
  return value;
};
function isHTMLString(value) {
  return Object.prototype.toString.call(value) === "[object HTMLString]";
}

var idle_prebuilt_default = `(self.Astro=self.Astro||{}).idle=t=>{const e=async()=>{await(await t())()};"requestIdleCallback"in window?window.requestIdleCallback(e):setTimeout(e,200)},window.dispatchEvent(new Event("astro:idle"));`;

var load_prebuilt_default = `(self.Astro=self.Astro||{}).load=a=>{(async()=>await(await a())())()},window.dispatchEvent(new Event("astro:load"));`;

var media_prebuilt_default = `(self.Astro=self.Astro||{}).media=(s,a)=>{const t=async()=>{await(await s())()};if(a.value){const e=matchMedia(a.value);e.matches?t():e.addEventListener("change",t,{once:!0})}},window.dispatchEvent(new Event("astro:media"));`;

var only_prebuilt_default = `(self.Astro=self.Astro||{}).only=t=>{(async()=>await(await t())())()},window.dispatchEvent(new Event("astro:only"));`;

var visible_prebuilt_default = `(self.Astro=self.Astro||{}).visible=(s,c,n)=>{const r=async()=>{await(await s())()};let i=new IntersectionObserver(e=>{for(const t of e)if(!!t.isIntersecting){i.disconnect(),r();break}});for(let e=0;e<n.children.length;e++){const t=n.children[e];i.observe(t)}},window.dispatchEvent(new Event("astro:visible"));`;

var astro_island_prebuilt_default = `var l;{const c={0:t=>t,1:t=>JSON.parse(t,o),2:t=>new RegExp(t),3:t=>new Date(t),4:t=>new Map(JSON.parse(t,o)),5:t=>new Set(JSON.parse(t,o)),6:t=>BigInt(t),7:t=>new URL(t),8:t=>new Uint8Array(JSON.parse(t)),9:t=>new Uint16Array(JSON.parse(t)),10:t=>new Uint32Array(JSON.parse(t))},o=(t,s)=>{if(t===""||!Array.isArray(s))return s;const[e,n]=s;return e in c?c[e](n):void 0};customElements.get("astro-island")||customElements.define("astro-island",(l=class extends HTMLElement{constructor(){super(...arguments);this.hydrate=()=>{if(!this.hydrator||this.parentElement&&this.parentElement.closest("astro-island[ssr]"))return;const s=this.querySelectorAll("astro-slot"),e={},n=this.querySelectorAll("template[data-astro-template]");for(const r of n){const i=r.closest(this.tagName);!i||!i.isSameNode(this)||(e[r.getAttribute("data-astro-template")||"default"]=r.innerHTML,r.remove())}for(const r of s){const i=r.closest(this.tagName);!i||!i.isSameNode(this)||(e[r.getAttribute("name")||"default"]=r.innerHTML)}const a=this.hasAttribute("props")?JSON.parse(this.getAttribute("props"),o):{};this.hydrator(this)(this.Component,a,e,{client:this.getAttribute("client")}),this.removeAttribute("ssr"),window.removeEventListener("astro:hydrate",this.hydrate),window.dispatchEvent(new CustomEvent("astro:hydrate"))}}connectedCallback(){!this.hasAttribute("await-children")||this.firstChild?this.childrenConnectedCallback():new MutationObserver((s,e)=>{e.disconnect(),this.childrenConnectedCallback()}).observe(this,{childList:!0})}async childrenConnectedCallback(){window.addEventListener("astro:hydrate",this.hydrate);let s=this.getAttribute("before-hydration-url");s&&await import(s),this.start()}start(){const s=JSON.parse(this.getAttribute("opts")),e=this.getAttribute("client");if(Astro[e]===void 0){window.addEventListener(\`astro:\${e}\`,()=>this.start(),{once:!0});return}Astro[e](async()=>{const n=this.getAttribute("renderer-url"),[a,{default:r}]=await Promise.all([import(this.getAttribute("component-url")),n?import(n):()=>()=>{}]),i=this.getAttribute("component-export")||"default";if(!i.includes("."))this.Component=a[i];else{this.Component=a;for(const d of i.split("."))this.Component=this.Component[d]}return this.hydrator=r,this.hydrate},s,this)}attributeChangedCallback(){this.hydrator&&this.hydrate()}},l.observedAttributes=["props"],l))}`;

function determineIfNeedsHydrationScript(result) {
  if (result._metadata.hasHydrationScript) {
    return false;
  }
  return result._metadata.hasHydrationScript = true;
}
const hydrationScripts = {
  idle: idle_prebuilt_default,
  load: load_prebuilt_default,
  only: only_prebuilt_default,
  media: media_prebuilt_default,
  visible: visible_prebuilt_default
};
function determinesIfNeedsDirectiveScript(result, directive) {
  if (result._metadata.hasDirectives.has(directive)) {
    return false;
  }
  result._metadata.hasDirectives.add(directive);
  return true;
}
function getDirectiveScriptText(directive) {
  if (!(directive in hydrationScripts)) {
    throw new Error(`Unknown directive: ${directive}`);
  }
  const directiveScriptText = hydrationScripts[directive];
  return directiveScriptText;
}
function getPrescripts(type, directive) {
  switch (type) {
    case "both":
      return `<style>astro-island,astro-slot{display:contents}</style><script>${getDirectiveScriptText(directive) + astro_island_prebuilt_default}<\/script>`;
    case "directive":
      return `<script>${getDirectiveScriptText(directive)}<\/script>`;
  }
  return "";
}

const headAndContentSym = Symbol.for("astro.headAndContent");
function isHeadAndContent(obj) {
  return typeof obj === "object" && !!obj[headAndContentSym];
}

function serializeListValue(value) {
  const hash = {};
  push(value);
  return Object.keys(hash).join(" ");
  function push(item) {
    if (item && typeof item.forEach === "function")
      item.forEach(push);
    else if (item === Object(item))
      Object.keys(item).forEach((name) => {
        if (item[name])
          push(name);
      });
    else {
      item = item === false || item == null ? "" : String(item).trim();
      if (item) {
        item.split(/\s+/).forEach((name) => {
          hash[name] = true;
        });
      }
    }
  }
}
function isPromise(value) {
  return !!value && typeof value === "object" && typeof value.then === "function";
}

var _a$1;
const renderTemplateResultSym = Symbol.for("astro.renderTemplateResult");
class RenderTemplateResult {
  constructor(htmlParts, expressions) {
    this[_a$1] = true;
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
  get [(_a$1 = renderTemplateResultSym, Symbol.toStringTag)]() {
    return "AstroComponent";
  }
  async *[Symbol.asyncIterator]() {
    const { htmlParts, expressions } = this;
    for (let i = 0; i < htmlParts.length; i++) {
      const html = htmlParts[i];
      const expression = expressions[i];
      yield markHTMLString(html);
      yield* renderChild(expression);
    }
  }
}
function isRenderTemplateResult(obj) {
  return typeof obj === "object" && !!obj[renderTemplateResultSym];
}
async function* renderAstroTemplateResult(component) {
  for await (const value of component) {
    if (value || value === 0) {
      for await (const chunk of renderChild(value)) {
        switch (chunk.type) {
          case "directive": {
            yield chunk;
            break;
          }
          default: {
            yield markHTMLString(chunk);
            break;
          }
        }
      }
    }
  }
}
function renderTemplate(htmlParts, ...expressions) {
  return new RenderTemplateResult(htmlParts, expressions);
}

function isAstroComponentFactory(obj) {
  return obj == null ? false : obj.isAstroComponentFactory === true;
}
async function renderToString(result, componentFactory, props, children) {
  const factoryResult = await componentFactory(result, props, children);
  if (factoryResult instanceof Response) {
    const response = factoryResult;
    throw response;
  }
  let parts = new HTMLParts();
  const templateResult = isHeadAndContent(factoryResult) ? factoryResult.content : factoryResult;
  for await (const chunk of renderAstroTemplateResult(templateResult)) {
    parts.append(chunk, result);
  }
  return parts.toString();
}
function isAPropagatingComponent(result, factory) {
  let hint = factory.propagation || "none";
  if (factory.moduleId && result.propagation.has(factory.moduleId) && hint === "none") {
    hint = result.propagation.get(factory.moduleId);
  }
  return hint === "in-tree" || hint === "self";
}

const defineErrors = (errs) => errs;
const AstroErrorData = defineErrors({
  UnknownCompilerError: {
    title: "Unknown compiler error.",
    code: 1e3
  },
  StaticRedirectNotAvailable: {
    title: "`Astro.redirect` is not available in static mode.",
    code: 3001,
    message: "Redirects are only available when using `output: 'server'`. Update your Astro config if you need SSR features.",
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project for more information on how to enable SSR."
  },
  ClientAddressNotAvailable: {
    title: "`Astro.clientAddress` is not available in current adapter.",
    code: 3002,
    message: (adapterName) => `\`Astro.clientAddress\` is not available in the \`${adapterName}\` adapter. File an issue with the adapter to add support.`
  },
  StaticClientAddressNotAvailable: {
    title: "`Astro.clientAddress` is not available in static mode.",
    code: 3003,
    message: "`Astro.clientAddress` is only available when using `output: 'server'`. Update your Astro config if you need SSR features.",
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project for more information on how to enable SSR."
  },
  NoMatchingStaticPathFound: {
    title: "No static path found for requested path.",
    code: 3004,
    message: (pathName) => `A \`getStaticPaths()\` route pattern was matched, but no matching static path was found for requested path \`${pathName}\`.`,
    hint: (possibleRoutes) => `Possible dynamic routes being matched: ${possibleRoutes.join(", ")}.`
  },
  OnlyResponseCanBeReturned: {
    title: "Invalid type returned by Astro page.",
    code: 3005,
    message: (route, returnedValue) => `Route \`${route ? route : ""}\` returned a \`${returnedValue}\`. Only a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) can be returned from Astro files.`,
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/#response for more information."
  },
  MissingMediaQueryDirective: {
    title: "Missing value for `client:media` directive.",
    code: 3006,
    message: 'Media query not provided for `client:media` directive. A media query similar to `client:media="(max-width: 600px)"` must be provided'
  },
  NoMatchingRenderer: {
    title: "No matching renderer found.",
    code: 3007,
    message: (componentName, componentExtension, plural, validRenderersCount) => `Unable to render \`${componentName}\`.

${validRenderersCount > 0 ? `There ${plural ? "are." : "is."} ${validRenderersCount} renderer${plural ? "s." : ""} configured in your \`astro.config.mjs\` file,
but ${plural ? "none were." : "it was not."} able to server-side render \`${componentName}\`.` : `No valid renderer was found ${componentExtension ? `for the \`.${componentExtension}\` file extension.` : `for this file extension.`}`}`,
    hint: (probableRenderers) => `Did you mean to enable the ${probableRenderers} integration?

See https://docs.astro.build/en/core-concepts/framework-components/ for more information on how to install and configure integrations.`
  },
  NoClientEntrypoint: {
    title: "No client entrypoint specified in renderer.",
    code: 3008,
    message: (componentName, clientDirective, rendererName) => `\`${componentName}\` component has a \`client:${clientDirective}\` directive, but no client entrypoint was provided by \`${rendererName}\`.`,
    hint: "See https://docs.astro.build/en/reference/integrations-reference/#addrenderer-option for more information on how to configure your renderer."
  },
  NoClientOnlyHint: {
    title: "Missing hint on client:only directive.",
    code: 3009,
    message: (componentName) => `Unable to render \`${componentName}\`. When using the \`client:only\` hydration strategy, Astro needs a hint to use the correct renderer.`,
    hint: (probableRenderers) => `Did you mean to pass \`client:only="${probableRenderers}"\`? See https://docs.astro.build/en/reference/directives-reference/#clientonly for more information on client:only`
  },
  InvalidGetStaticPathParam: {
    title: "Invalid value returned by a `getStaticPaths` path.",
    code: 3010,
    message: (paramType) => `Invalid params given to \`getStaticPaths\` path. Expected an \`object\`, got \`${paramType}\``,
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  InvalidGetStaticPathsReturn: {
    title: "Invalid value returned by getStaticPaths.",
    code: 3011,
    message: (returnType) => `Invalid type returned by \`getStaticPaths\`. Expected an \`array\`, got \`${returnType}\``,
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  GetStaticPathsRemovedRSSHelper: {
    title: "getStaticPaths RSS helper is not available anymore.",
    code: 3012,
    message: "The RSS helper has been removed from `getStaticPaths`. Try the new @astrojs/rss package instead.",
    hint: "See https://docs.astro.build/en/guides/rss/ for more information."
  },
  GetStaticPathsExpectedParams: {
    title: "Missing params property on `getStaticPaths` route.",
    code: 3013,
    message: "Missing or empty required `params` property on `getStaticPaths` route.",
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  GetStaticPathsInvalidRouteParam: {
    title: "Invalid value for `getStaticPaths` route parameter.",
    code: 3014,
    message: (key, value, valueType) => `Invalid getStaticPaths route parameter for \`${key}\`. Expected undefined, a string or a number, received \`${valueType}\` (\`${value}\`)`,
    hint: "See https://docs.astro.build/en/reference/api-reference/#getstaticpaths for more information on getStaticPaths."
  },
  GetStaticPathsRequired: {
    title: "`getStaticPaths()` function required for dynamic routes.",
    code: 3015,
    message: "`getStaticPaths()` function is required for dynamic routes. Make sure that you `export` a `getStaticPaths` function from your dynamic route.",
    hint: `See https://docs.astro.build/en/core-concepts/routing/#dynamic-routes for more information on dynamic routes.

Alternatively, set \`output: "server"\` in your Astro config file to switch to a non-static server build.
See https://docs.astro.build/en/guides/server-side-rendering/ for more information on non-static rendering.`
  },
  ReservedSlotName: {
    title: "Invalid slot name.",
    code: 3016,
    message: (slotName) => `Unable to create a slot named \`${slotName}\`. \`${slotName}\` is a reserved slot name. Please update the name of this slot.`
  },
  NoAdapterInstalled: {
    title: "Cannot use Server-side Rendering without an adapter.",
    code: 3017,
    message: `Cannot use \`output: 'server'\` without an adapter. Please install and configure the appropriate server adapter for your final deployment.`,
    hint: "See https://docs.astro.build/en/guides/server-side-rendering/ for more information."
  },
  NoMatchingImport: {
    title: "No import found for component.",
    code: 3018,
    message: (componentName) => `Could not render \`${componentName}\`. No matching import has been found for \`${componentName}\`.`,
    hint: "Please make sure the component is properly imported."
  },
  InvalidPrerenderExport: {
    title: "Invalid prerender export.",
    code: 3019,
    message: (prefix, suffix) => {
      let msg = `A \`prerender\` export has been detected, but its value cannot be statically analyzed.`;
      if (prefix !== "const")
        msg += `
Expected \`const\` declaration but got \`${prefix}\`.`;
      if (suffix !== "true")
        msg += `
Expected \`true\` value but got \`${suffix}\`.`;
      return msg;
    },
    hint: "Mutable values declared at runtime are not supported. Please make sure to use exactly `export const prerender = true`."
  },
  UnknownViteError: {
    title: "Unknown Vite Error.",
    code: 4e3
  },
  FailedToLoadModuleSSR: {
    title: "Could not import file.",
    code: 4001,
    message: (importName) => `Could not import \`${importName}\`.`,
    hint: "This is often caused by a typo in the import path. Please make sure the file exists."
  },
  InvalidGlob: {
    title: "Invalid glob pattern.",
    code: 4002,
    message: (globPattern) => `Invalid glob pattern: \`${globPattern}\`. Glob patterns must start with './', '../' or '/'.`,
    hint: "See https://docs.astro.build/en/guides/imports/#glob-patterns for more information on supported glob patterns."
  },
  UnknownCSSError: {
    title: "Unknown CSS Error.",
    code: 5e3
  },
  CSSSyntaxError: {
    title: "CSS Syntax Error.",
    code: 5001
  },
  UnknownMarkdownError: {
    title: "Unknown Markdown Error.",
    code: 6e3
  },
  MarkdownFrontmatterParseError: {
    title: "Failed to parse Markdown frontmatter.",
    code: 6001
  },
  MarkdownContentSchemaValidationError: {
    title: "Content collection frontmatter invalid.",
    code: 6002,
    message: (collection, entryId, error) => {
      return [
        `${String(collection)} \u2192 ${String(entryId)} frontmatter does not match collection schema.`,
        ...error.errors.map((zodError) => zodError.message)
      ].join("\n");
    },
    hint: "See https://docs.astro.build/en/guides/content-collections/ for more information on content schemas."
  },
  UnknownConfigError: {
    title: "Unknown configuration error.",
    code: 7e3
  },
  ConfigNotFound: {
    title: "Specified configuration file not found.",
    code: 7001,
    message: (configFile) => `Unable to resolve \`--config "${configFile}"\`. Does the file exist?`
  },
  ConfigLegacyKey: {
    title: "Legacy configuration detected.",
    code: 7002,
    message: (legacyConfigKey) => `Legacy configuration detected: \`${legacyConfigKey}\`.`,
    hint: "Please update your configuration to the new format.\nSee https://astro.build/config for more information."
  },
  UnknownError: {
    title: "Unknown Error.",
    code: 99999
  }
});

function normalizeLF(code) {
  return code.replace(/\r\n|\r(?!\n)|\n/g, "\n");
}
function getErrorDataByCode(code) {
  const entry = Object.entries(AstroErrorData).find((data) => data[1].code === code);
  if (entry) {
    return {
      name: entry[0],
      data: entry[1]
    };
  }
}

function codeFrame(src, loc) {
  if (!loc || loc.line === void 0 || loc.column === void 0) {
    return "";
  }
  const lines = normalizeLF(src).split("\n").map((ln) => ln.replace(/\t/g, "  "));
  const visibleLines = [];
  for (let n = -2; n <= 2; n++) {
    if (lines[loc.line + n])
      visibleLines.push(loc.line + n);
  }
  let gutterWidth = 0;
  for (const lineNo of visibleLines) {
    let w = `> ${lineNo}`;
    if (w.length > gutterWidth)
      gutterWidth = w.length;
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

class AstroError extends Error {
  constructor(props, ...params) {
    var _a;
    super(...params);
    this.type = "AstroError";
    const { code, name, title, message, stack, location, hint, frame } = props;
    this.errorCode = code;
    if (name && name !== "Error") {
      this.name = name;
    } else {
      this.name = ((_a = getErrorDataByCode(this.errorCode)) == null ? void 0 : _a.name) ?? "UnknownError";
    }
    this.title = title;
    if (message)
      this.message = message;
    this.stack = stack ? stack : this.stack;
    this.loc = location;
    this.hint = hint;
    this.frame = frame;
  }
  setErrorCode(errorCode) {
    this.errorCode = errorCode;
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
}

const PROP_TYPE = {
  Value: 0,
  JSON: 1,
  RegExp: 2,
  Date: 3,
  Map: 4,
  Set: 5,
  BigInt: 6,
  URL: 7,
  Uint8Array: 8,
  Uint16Array: 9,
  Uint32Array: 10
};
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
      return [
        PROP_TYPE.Map,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object Set]": {
      return [
        PROP_TYPE.Set,
        JSON.stringify(serializeArray(Array.from(value), metadata, parents))
      ];
    }
    case "[object BigInt]": {
      return [PROP_TYPE.BigInt, value.toString()];
    }
    case "[object URL]": {
      return [PROP_TYPE.URL, value.toString()];
    }
    case "[object Array]": {
      return [PROP_TYPE.JSON, JSON.stringify(serializeArray(value, metadata, parents))];
    }
    case "[object Uint8Array]": {
      return [PROP_TYPE.Uint8Array, JSON.stringify(Array.from(value))];
    }
    case "[object Uint16Array]": {
      return [PROP_TYPE.Uint16Array, JSON.stringify(Array.from(value))];
    }
    case "[object Uint32Array]": {
      return [PROP_TYPE.Uint32Array, JSON.stringify(Array.from(value))];
    }
    default: {
      if (value !== null && typeof value === "object") {
        return [PROP_TYPE.Value, serializeObject(value, metadata, parents)];
      } else {
        return [PROP_TYPE.Value, value];
      }
    }
  }
}
function serializeProps(props, metadata) {
  const serialized = JSON.stringify(serializeObject(props, metadata));
  return serialized;
}

const HydrationDirectivesRaw = ["load", "idle", "media", "visible", "only"];
const HydrationDirectives = new Set(HydrationDirectivesRaw);
const HydrationDirectiveProps = new Set(HydrationDirectivesRaw.map((n) => `client:${n}`));
function extractDirectives(displayName, inputProps) {
  let extracted = {
    isPage: false,
    hydration: null,
    props: {}
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
        case "client:component-hydration": {
          break;
        }
        case "client:display-name": {
          break;
        }
        default: {
          extracted.hydration.directive = key.split(":")[1];
          extracted.hydration.value = value;
          if (!HydrationDirectives.has(extracted.hydration.directive)) {
            throw new Error(
              `Error: invalid hydration directive "${key}". Supported hydration methods: ${Array.from(
                HydrationDirectiveProps
              ).join(", ")}`
            );
          }
          if (extracted.hydration.directive === "media" && typeof extracted.hydration.value !== "string") {
            throw new AstroError(AstroErrorData.MissingMediaQueryDirective);
          }
          break;
        }
      }
    } else if (key === "class:list") {
      if (value) {
        extracted.props[key.slice(0, -5)] = serializeListValue(value);
      }
    } else {
      extracted.props[key] = value;
    }
  }
  for (const sym of Object.getOwnPropertySymbols(inputProps)) {
    extracted.props[sym] = inputProps[sym];
  }
  return extracted;
}
async function generateHydrateScript(scriptOptions, metadata) {
  const { renderer, result, astroId, props, attrs } = scriptOptions;
  const { hydrate, componentUrl, componentExport } = metadata;
  if (!componentExport.value) {
    throw new Error(
      `Unable to resolve a valid export for "${metadata.displayName}"! Please open an issue at https://astro.build/issues!`
    );
  }
  const island = {
    children: "",
    props: {
      uid: astroId
    }
  };
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      island.props[key] = escapeHTML(value);
    }
  }
  island.props["component-url"] = await result.resolve(decodeURI(componentUrl));
  if (renderer.clientEntrypoint) {
    island.props["component-export"] = componentExport.value;
    island.props["renderer-url"] = await result.resolve(decodeURI(renderer.clientEntrypoint));
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
  return island;
}

var _a;
const astroComponentInstanceSym = Symbol.for("astro.componentInstance");
class AstroComponentInstance {
  constructor(result, props, slots, factory) {
    this[_a] = true;
    this.result = result;
    this.props = props;
    this.factory = factory;
    this.slotValues = {};
    for (const name in slots) {
      this.slotValues[name] = slots[name]();
    }
  }
  async init() {
    this.returnValue = this.factory(this.result, this.props, this.slotValues);
    return this.returnValue;
  }
  async *render() {
    if (this.returnValue === void 0) {
      await this.init();
    }
    let value = this.returnValue;
    if (isPromise(value)) {
      value = await value;
    }
    if (isHeadAndContent(value)) {
      yield* value.content;
    } else {
      yield* renderChild(value);
    }
  }
}
_a = astroComponentInstanceSym;
function validateComponentProps(props, displayName) {
  if (props != null) {
    for (const prop of Object.keys(props)) {
      if (HydrationDirectiveProps.has(prop)) {
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
  if (isAPropagatingComponent(result, factory) && !result.propagators.has(factory)) {
    result.propagators.set(factory, instance);
  }
  return instance;
}
function isAstroComponentInstance(obj) {
  return typeof obj === "object" && !!obj[astroComponentInstanceSym];
}

async function* renderChild(child) {
  child = await child;
  if (child instanceof SlotString) {
    if (child.instructions) {
      yield* child.instructions;
    }
    yield child;
  } else if (isHTMLString(child)) {
    yield child;
  } else if (Array.isArray(child)) {
    for (const value of child) {
      yield markHTMLString(await renderChild(value));
    }
  } else if (typeof child === "function") {
    yield* renderChild(child());
  } else if (typeof child === "string") {
    yield markHTMLString(escapeHTML(child));
  } else if (!child && child !== 0) ; else if (isRenderTemplateResult(child)) {
    yield* renderAstroTemplateResult(child);
  } else if (isAstroComponentInstance(child)) {
    yield* child.render();
  } else if (ArrayBuffer.isView(child)) {
    yield child;
  } else if (typeof child === "object" && (Symbol.asyncIterator in child || Symbol.iterator in child)) {
    yield* child;
  } else {
    yield child;
  }
}

const slotString = Symbol.for("astro:slot-string");
class SlotString extends HTMLString {
  constructor(content, instructions) {
    super(content);
    this.instructions = instructions;
    this[slotString] = true;
  }
}
function isSlotString(str) {
  return !!str[slotString];
}
async function renderSlot(_result, slotted, fallback) {
  if (slotted) {
    let iterator = renderChild(slotted);
    let content = "";
    let instructions = null;
    for await (const chunk of iterator) {
      if (chunk.type === "directive") {
        if (instructions === null) {
          instructions = [];
        }
        instructions.push(chunk);
      } else {
        content += chunk;
      }
    }
    return markHTMLString(new SlotString(content, instructions));
  }
  return fallback;
}
async function renderSlots(result, slots = {}) {
  let slotInstructions = null;
  let children = {};
  if (slots) {
    await Promise.all(
      Object.entries(slots).map(
        ([key, value]) => renderSlot(result, value).then((output) => {
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

const Fragment = Symbol.for("astro:fragment");
const Renderer = Symbol.for("astro:renderer");
const encoder = new TextEncoder();
const decoder = new TextDecoder();
function stringifyChunk(result, chunk) {
  switch (chunk.type) {
    case "directive": {
      const { hydration } = chunk;
      let needsHydrationScript = hydration && determineIfNeedsHydrationScript(result);
      let needsDirectiveScript = hydration && determinesIfNeedsDirectiveScript(result, hydration.directive);
      let prescriptType = needsHydrationScript ? "both" : needsDirectiveScript ? "directive" : null;
      if (prescriptType) {
        let prescripts = getPrescripts(prescriptType, hydration.directive);
        return markHTMLString(prescripts);
      } else {
        return "";
      }
    }
    default: {
      if (isSlotString(chunk)) {
        let out = "";
        const c = chunk;
        if (c.instructions) {
          for (const instr of c.instructions) {
            out += stringifyChunk(result, instr);
          }
        }
        out += chunk.toString();
        return out;
      }
      return chunk.toString();
    }
  }
}
class HTMLParts {
  constructor() {
    this.parts = "";
  }
  append(part, result) {
    if (ArrayBuffer.isView(part)) {
      this.parts += decoder.decode(part);
    } else {
      this.parts += stringifyChunk(result, part);
    }
  }
  toString() {
    return this.parts;
  }
  toArrayBuffer() {
    return encoder.encode(this.parts);
  }
}

const ClientOnlyPlaceholder = "astro-client-only";
class Skip {
  constructor(vnode) {
    this.vnode = vnode;
    this.count = 0;
  }
  increment() {
    this.count++;
  }
  haveNoTried() {
    return this.count === 0;
  }
  isCompleted() {
    return this.count > 2;
  }
}
Skip.symbol = Symbol("astro:jsx:skip");
let originalConsoleError;
let consoleFilterRefs = 0;
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
  let skip;
  if (vnode.props) {
    if (vnode.props[Skip.symbol]) {
      skip = vnode.props[Skip.symbol];
    } else {
      skip = new Skip(vnode);
    }
  } else {
    skip = new Skip(vnode);
  }
  return renderJSXVNode(result, vnode, skip);
}
async function renderJSXVNode(result, vnode, skip) {
  if (isVNode(vnode)) {
    switch (true) {
      case !vnode.type: {
        throw new Error(`Unable to render ${result._metadata.pathname} because it contains an undefined Component!
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
        return markHTMLString(await renderToString(result, vnode.type, props, slots));
      }
      case (!vnode.type && vnode.type !== 0):
        return "";
      case (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder):
        return markHTMLString(await renderElement$1(result, vnode.type, vnode.props ?? {}));
    }
    if (vnode.type) {
      let extractSlots2 = function(child) {
        if (Array.isArray(child)) {
          return child.map((c) => extractSlots2(c));
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
      };
      if (typeof vnode.type === "function" && vnode.type["astro:renderer"]) {
        skip.increment();
      }
      if (typeof vnode.type === "function" && vnode.props["server:root"]) {
        const output2 = await vnode.type(vnode.props ?? {});
        return await renderJSX(result, output2);
      }
      if (typeof vnode.type === "function") {
        if (skip.haveNoTried() || skip.isCompleted()) {
          useConsoleFilter();
          try {
            const output2 = await vnode.type(vnode.props ?? {});
            let renderResult;
            if (output2 && output2[AstroJSX]) {
              renderResult = await renderJSXVNode(result, output2, skip);
              return renderResult;
            } else if (!output2) {
              renderResult = await renderJSXVNode(result, output2, skip);
              return renderResult;
            }
          } catch (e) {
            if (skip.isCompleted()) {
              throw e;
            }
            skip.increment();
          } finally {
            finishUsingConsoleFilter();
          }
        } else {
          skip.increment();
        }
      }
      const { children = null, ...props } = vnode.props ?? {};
      const _slots = {
        default: []
      };
      extractSlots2(children);
      for (const [key, value] of Object.entries(props)) {
        if (value["$$slot"]) {
          _slots[key] = value;
          delete props[key];
        }
      }
      const slotPromises = [];
      const slots = {};
      for (const [key, value] of Object.entries(_slots)) {
        slotPromises.push(
          renderJSX(result, value).then((output2) => {
            if (output2.toString().trim().length === 0)
              return;
            slots[key] = () => output2;
          })
        );
      }
      await Promise.all(slotPromises);
      props[Skip.symbol] = skip;
      let output;
      if (vnode.type === ClientOnlyPlaceholder && vnode.props["client:only"]) {
        output = await renderComponentToIterable(
          result,
          vnode.props["client:display-name"] ?? "",
          null,
          props,
          slots
        );
      } else {
        output = await renderComponentToIterable(
          result,
          typeof vnode.type === "function" ? vnode.type.name : vnode.type,
          vnode.type,
          props,
          slots
        );
      }
      if (typeof output !== "string" && Symbol.asyncIterator in output) {
        let parts = new HTMLParts();
        for await (const chunk of output) {
          parts.append(chunk, result);
        }
        return markHTMLString(parts.toString());
      } else {
        return markHTMLString(output);
      }
    }
  }
  return markHTMLString(`${vnode}`);
}
async function renderElement$1(result, tag, { children, ...props }) {
  return markHTMLString(
    `<${tag}${spreadAttributes(props)}${markHTMLString(
      (children == null || children == "") && voidElementNames.test(tag) ? `/>` : `>${children == null ? "" : await renderJSX(result, children)}</${tag}>`
    )}`
  );
}
function useConsoleFilter() {
  consoleFilterRefs++;
  if (!originalConsoleError) {
    originalConsoleError = console.error;
    try {
      console.error = filteredConsoleError;
    } catch (error) {
    }
  }
}
function finishUsingConsoleFilter() {
  consoleFilterRefs--;
}
function filteredConsoleError(msg, ...rest) {
  if (consoleFilterRefs > 0 && typeof msg === "string") {
    const isKnownReactHookError = msg.includes("Warning: Invalid hook call.") && msg.includes("https://reactjs.org/link/invalid-hook-call");
    if (isKnownReactHookError)
      return;
  }
  originalConsoleError(msg, ...rest);
}

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
const dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
const binary = dictionary.length;
function bitwise(str) {
  let hash = 0;
  if (str.length === 0)
    return hash;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
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

const voidElementNames = /^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;
const htmlBooleanAttributes = /^(allowfullscreen|async|autofocus|autoplay|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|hidden|loop|nomodule|novalidate|open|playsinline|readonly|required|reversed|scoped|seamless|itemscope)$/i;
const htmlEnumAttributes = /^(contenteditable|draggable|spellcheck|value)$/i;
const svgEnumAttributes = /^(autoReverse|externalResourcesRequired|focusable|preserveAlpha)$/i;
const STATIC_DIRECTIVES = /* @__PURE__ */ new Set(["set:html", "set:text"]);
const toIdent = (k) => k.trim().replace(/(?:(?!^)\b\w|\s+|[^\w]+)/g, (match, index) => {
  if (/[^\w]|\s/.test(match))
    return "";
  return index === 0 ? match : match.toUpperCase();
});
const toAttributeString = (value, shouldEscape = true) => shouldEscape ? String(value).replace(/&/g, "&#38;").replace(/"/g, "&#34;") : value;
const kebab = (k) => k.toLowerCase() === k ? k : k.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
const toStyleString = (obj) => Object.entries(obj).map(([k, v]) => `${kebab(k)}:${v}`).join(";");
function defineScriptVars(vars) {
  let output = "";
  for (const [key, value] of Object.entries(vars)) {
    output += `const ${toIdent(key)} = ${JSON.stringify(value)};
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
  if (value === false) {
    if (htmlEnumAttributes.test(key) || svgEnumAttributes.test(key)) {
      return markHTMLString(` ${key}="false"`);
    }
    return "";
  }
  if (STATIC_DIRECTIVES.has(key)) {
    console.warn(`[astro] The "${key}" directive cannot be applied dynamically at runtime. It will not be rendered as an attribute.

Make sure to use the static attribute syntax (\`${key}={value}\`) instead of the dynamic spread syntax (\`{...{ "${key}": value }}\`).`);
    return "";
  }
  if (key === "class:list") {
    const listValue = toAttributeString(serializeListValue(value), shouldEscape);
    if (listValue === "") {
      return "";
    }
    return markHTMLString(` ${key.slice(0, -5)}="${listValue}"`);
  }
  if (key === "style" && !(value instanceof HTMLString) && typeof value === "object") {
    return markHTMLString(` ${key}="${toAttributeString(toStyleString(value), shouldEscape)}"`);
  }
  if (key === "className") {
    return markHTMLString(` class="${toAttributeString(value, shouldEscape)}"`);
  }
  if (value === true && (key.startsWith("data-") || htmlBooleanAttributes.test(key))) {
    return markHTMLString(` ${key}`);
  } else {
    return markHTMLString(` ${key}="${toAttributeString(value, shouldEscape)}"`);
  }
}
function internalSpreadAttributes(values, shouldEscape = true) {
  let output = "";
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, shouldEscape);
  }
  return markHTMLString(output);
}
function renderElement(name, { props: _props, children = "" }, shouldEscape = true) {
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
    return `<${name}${internalSpreadAttributes(props, shouldEscape)} />`;
  }
  return `<${name}${internalSpreadAttributes(props, shouldEscape)}>${children}</${name}>`;
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
    `<${name}${attrHTML}>${await renderSlot(result, slots == null ? void 0 : slots.default)}</${name}>`
  );
}
function getHTMLElementName(constructor) {
  const definedName = customElements.getName(constructor);
  if (definedName)
    return definedName;
  const assignedName = constructor.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
  return assignedName;
}

const rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
function guessRenderers(componentUrl) {
  const extname = componentUrl == null ? void 0 : componentUrl.split(".").pop();
  switch (extname) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/solid", "@astrojs/vue (jsx)"];
    default:
      return [
        "@astrojs/react",
        "@astrojs/preact",
        "@astrojs/solid",
        "@astrojs/vue",
        "@astrojs/svelte"
      ];
  }
}
function isFragmentComponent(Component) {
  return Component === Fragment;
}
function isHTMLComponent(Component) {
  return Component && typeof Component === "object" && Component["astro:html"];
}
async function renderFrameworkComponent(result, displayName, Component, _props, slots = {}) {
  var _a, _b;
  if (!Component && !_props["client:only"]) {
    throw new Error(
      `Unable to render ${displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  const { renderers } = result._metadata;
  const metadata = { displayName };
  const { hydration, isPage, props } = extractDirectives(displayName, _props);
  let html = "";
  let attrs = void 0;
  if (hydration) {
    metadata.hydrate = hydration.directive;
    metadata.hydrateArgs = hydration.value;
    metadata.componentExport = hydration.componentExport;
    metadata.componentUrl = hydration.componentUrl;
  }
  const probableRendererNames = guessRenderers(metadata.componentUrl);
  const validRenderers = renderers.filter((r) => r.name !== "astro:jsx");
  const { children, slotInstructions } = await renderSlots(result, slots);
  let renderer;
  if (metadata.hydrate !== "only") {
    let isTagged = false;
    try {
      isTagged = Component && Component[Renderer];
    } catch {
    }
    if (isTagged) {
      const rendererName = Component[Renderer];
      renderer = renderers.find(({ name }) => name === rendererName);
    }
    if (!renderer) {
      let error;
      for (const r of renderers) {
        try {
          if (await r.ssr.check.call({ result }, Component, props, children)) {
            renderer = r;
            break;
          }
        } catch (e) {
          error ?? (error = e);
        }
      }
      if (!renderer && error) {
        throw error;
      }
    }
    if (!renderer && typeof HTMLElement === "function" && componentIsHTMLElement(Component)) {
      const output = renderHTMLElement(result, Component, _props, slots);
      return output;
    }
  } else {
    if (metadata.hydrateArgs) {
      const passedName = metadata.hydrateArgs;
      const rendererName = rendererAliases.has(passedName) ? rendererAliases.get(passedName) : passedName;
      renderer = renderers.find(
        ({ name }) => name === `@astrojs/${rendererName}` || name === rendererName
      );
    }
    if (!renderer && validRenderers.length === 1) {
      renderer = validRenderers[0];
    }
    if (!renderer) {
      const extname = (_a = metadata.componentUrl) == null ? void 0 : _a.split(".").pop();
      renderer = renderers.filter(
        ({ name }) => name === `@astrojs/${extname}` || name === extname
      )[0];
    }
  }
  if (!renderer) {
    if (metadata.hydrate === "only") {
      throw new AstroError({
        ...AstroErrorData.NoClientOnlyHint,
        message: AstroErrorData.NoClientOnlyHint.message(metadata.displayName),
        hint: AstroErrorData.NoClientOnlyHint.hint(
          probableRendererNames.map((r) => r.replace("@astrojs/", "")).join("|")
        )
      });
    } else if (typeof Component !== "string") {
      const matchingRenderers = validRenderers.filter(
        (r) => probableRendererNames.includes(r.name)
      );
      const plural = validRenderers.length > 1;
      if (matchingRenderers.length === 0) {
        throw new AstroError({
          ...AstroErrorData.NoMatchingRenderer,
          message: AstroErrorData.NoMatchingRenderer.message(
            metadata.displayName,
            (_b = metadata == null ? void 0 : metadata.componentUrl) == null ? void 0 : _b.split(".").pop(),
            plural,
            validRenderers.length
          ),
          hint: AstroErrorData.NoMatchingRenderer.hint(
            formatList(probableRendererNames.map((r) => "`" + r + "`"))
          )
        });
      } else if (matchingRenderers.length === 1) {
        renderer = matchingRenderers[0];
        ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
          { result },
          Component,
          props,
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
      html = await renderSlot(result, slots == null ? void 0 : slots.fallback);
    } else {
      ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
        { result },
        Component,
        props,
        children,
        metadata
      ));
    }
  }
  if (renderer && !renderer.clientEntrypoint && renderer.name !== "@astrojs/lit" && metadata.hydrate) {
    throw new AstroError({
      ...AstroErrorData.NoClientEntrypoint,
      message: AstroErrorData.NoClientEntrypoint.message(
        displayName,
        metadata.hydrate,
        renderer.name
      )
    });
  }
  if (!html && typeof Component === "string") {
    const Tag = sanitizeElementName(Component);
    const childSlots = Object.values(children).join("");
    const iterable = renderAstroTemplateResult(
      await renderTemplate`<${Tag}${internalSpreadAttributes(props)}${markHTMLString(
        childSlots === "" && voidElementNames.test(Tag) ? `/>` : `>${childSlots}</${Tag}>`
      )}`
    );
    html = "";
    for await (const chunk of iterable) {
      html += chunk;
    }
  }
  if (!hydration) {
    return async function* () {
      if (slotInstructions) {
        yield* slotInstructions;
      }
      if (isPage || (renderer == null ? void 0 : renderer.name) === "astro:jsx") {
        yield html;
      } else {
        yield markHTMLString(html.replace(/\<\/?astro-slot\>/g, ""));
      }
    }();
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
    { renderer, result, astroId, props, attrs },
    metadata
  );
  let unrenderedSlots = [];
  if (html) {
    if (Object.keys(children).length > 0) {
      for (const key of Object.keys(children)) {
        if (!html.includes(key === "default" ? `<astro-slot>` : `<astro-slot name="${key}">`)) {
          unrenderedSlots.push(key);
        }
      }
    }
  } else {
    unrenderedSlots = Object.keys(children);
  }
  const template = unrenderedSlots.length > 0 ? unrenderedSlots.map(
    (key) => `<template data-astro-template${key !== "default" ? `="${key}"` : ""}>${children[key]}</template>`
  ).join("") : "";
  island.children = `${html ?? ""}${template}`;
  if (island.children) {
    island.props["await-children"] = "";
  }
  async function* renderAll() {
    if (slotInstructions) {
      yield* slotInstructions;
    }
    yield { type: "directive", hydration, result };
    yield markHTMLString(renderElement("astro-island", island, false));
  }
  return renderAll();
}
function sanitizeElementName(tag) {
  const unsafe = /[&<>'"\s]+/g;
  if (!unsafe.test(tag))
    return tag;
  return tag.trim().split(unsafe)[0].trim();
}
async function renderFragmentComponent(result, slots = {}) {
  const children = await renderSlot(result, slots == null ? void 0 : slots.default);
  if (children == null) {
    return children;
  }
  return markHTMLString(children);
}
async function renderHTMLComponent(result, Component, _props, slots = {}) {
  const { slotInstructions, children } = await renderSlots(result, slots);
  const html = Component.render({ slots: children });
  const hydrationHtml = slotInstructions ? slotInstructions.map((instr) => stringifyChunk(result, instr)).join("") : "";
  return markHTMLString(hydrationHtml + html);
}
function renderComponent(result, displayName, Component, props, slots = {}) {
  if (isPromise(Component)) {
    return Promise.resolve(Component).then((Unwrapped) => {
      return renderComponent(result, displayName, Unwrapped, props, slots);
    });
  }
  if (isFragmentComponent(Component)) {
    return renderFragmentComponent(result, slots);
  }
  if (isHTMLComponent(Component)) {
    return renderHTMLComponent(result, Component, props, slots);
  }
  if (isAstroComponentFactory(Component)) {
    return createAstroComponentInstance(result, displayName, Component, props, slots);
  }
  return renderFrameworkComponent(result, displayName, Component, props, slots);
}
function renderComponentToIterable(result, displayName, Component, props, slots = {}) {
  const renderResult = renderComponent(result, displayName, Component, props, slots);
  if (isAstroComponentInstance(renderResult)) {
    return renderResult.render();
  }
  return renderResult;
}

const uniqueElements = (item, index, all) => {
  const props = JSON.stringify(item.props);
  const children = item.children;
  return index === all.findIndex((i) => JSON.stringify(i.props) === props && i.children == children);
};
async function* renderExtraHead(result, base) {
  yield base;
  for (const part of result.extraHead) {
    yield* renderChild(part);
  }
}
function renderAllHeadContent(result) {
  const styles = Array.from(result.styles).filter(uniqueElements).map((style) => renderElement("style", style));
  result.styles.clear();
  const scripts = Array.from(result.scripts).filter(uniqueElements).map((script, i) => {
    return renderElement("script", script, false);
  });
  const links = Array.from(result.links).filter(uniqueElements).map((link) => renderElement("link", link, false));
  const baseHeadContent = markHTMLString(links.join("\n") + styles.join("\n") + scripts.join("\n"));
  if (result.extraHead.length > 0) {
    return renderExtraHead(result, baseHeadContent);
  } else {
    return baseHeadContent;
  }
}
function createRenderHead(result) {
  result._metadata.hasRenderedHead = true;
  return renderAllHeadContent.bind(null, result);
}
const renderHead = createRenderHead;
async function* maybeRenderHead(result) {
  if (result._metadata.hasRenderedHead) {
    return;
  }
  yield createRenderHead(result)();
}

typeof process === "object" && Object.prototype.toString.call(process) === "[object process]";

function __astro_tag_component__(Component, rendererName) {
  if (!Component)
    return;
  if (typeof Component !== "function")
    return;
  Object.defineProperty(Component, Renderer, {
    value: rendererName,
    enumerable: false,
    writable: false
  });
}
function spreadAttributes(values, _name, { class: scopedClassName } = {}) {
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

const AstroJSX = "astro:jsx";
const Empty = Symbol("empty");
const toSlotName = (slotAttr) => slotAttr;
function isVNode(vnode) {
  return vnode && typeof vnode === "object" && vnode[AstroJSX];
}
function transformSlots(vnode) {
  if (typeof vnode.type === "string")
    return vnode;
  const slots = {};
  if (isVNode(vnode.props.children)) {
    const child = vnode.props.children;
    if (!isVNode(child))
      return;
    if (!("slot" in child.props))
      return;
    const name = toSlotName(child.props.slot);
    slots[name] = [child];
    slots[name]["$$slot"] = true;
    delete child.props.slot;
    delete vnode.props.children;
  }
  if (Array.isArray(vnode.props.children)) {
    vnode.props.children = vnode.props.children.map((child) => {
      if (!isVNode(child))
        return child;
      if (!("slot" in child.props))
        return child;
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
  if (typeof child === "string")
    return markHTMLString(child);
  if (Array.isArray(child))
    return child.map((c) => markRawChildren(c));
  return child;
}
function transformSetDirectives(vnode) {
  if (!("set:html" in vnode.props || "set:text" in vnode.props))
    return;
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

const slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
async function check(Component, props, { default: children = null, ...slotted } = {}) {
  if (typeof Component !== "function")
    return false;
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = value;
  }
  try {
    const result = await Component({ ...props, ...slots, children });
    return result[AstroJSX];
  } catch (e) {
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
  const html = await renderJSX(result, createVNode(Component, { ...props, ...slots, children }));
  return { html };
}
var server_default = {
  check,
  renderToStaticMarkup
};

const MDXLayout$A = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$D;
  content.file = file$D;
  content.url = url$D;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$D,
    url: url$D,
    content,
    frontmatter: content,
    headings: getHeadings$D(),
    "server:root": true,
    children
  });
};
const frontmatter$D = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "FliVideo",
  "pageTitle": "Home | FliVideo",
  "description": "Automate your video influence",
  "hero": true
};
const _internal$D = {
  injectedFrontmatter: {}
};
function getHeadings$D() {
  return [{
    "depth": 2,
    "slug": "automate-your-youtube-influence",
    "text": "Automate your Youtube influence"
  }, {
    "depth": 2,
    "slug": "why-have-i-created-flivideo",
    "text": "Why have I created FliVideo?"
  }, {
    "depth": 2,
    "slug": "what-is-flivideo",
    "text": "What is FliVideo?"
  }, {
    "depth": 3,
    "slug": "learn-to-automate-your-video-influence",
    "text": "Learn to automate your video influence"
  }, {
    "depth": 3,
    "slug": "systems",
    "text": "Systems"
  }, {
    "depth": 3,
    "slug": "techniques",
    "text": "Techniques"
  }, {
    "depth": 3,
    "slug": "software-automation-using-code-macros-and-apis",
    "text": "Software automation using code, macros and API\u2019s"
  }, {
    "depth": 2,
    "slug": "a-little-about-me",
    "text": "A little about me"
  }];
}
function _createMdxContent$B(props) {
  const _components = Object.assign({
    h2: "h2",
    p: "p",
    a: "a",
    h3: "h3",
    ul: "ul",
    li: "li"
  }, props.components);
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "automate-your-youtube-influence",
      children: "Automate your Youtube influence"
    }), "\n", createVNode(_components.p, {
      children: ["Hi, I\u2019m David from ", createVNode(_components.a, {
        href: "https://flivideo.com",
        children: "FliVideo"
      }), " and I\u2019m here to help you automate your video influence."]
    }), "\n", createVNode("img", {
      class: "p-1 w-32 h-32 rounded-full ring-2 ring-fli-200 dark:ring-fli-100",
      src: "images/david.png",
      alt: "David Cruwys"
    }), "\n", createVNode(_components.h2, {
      id: "why-have-i-created-flivideo",
      children: "Why have I created FliVideo?"
    }), "\n", createVNode(_components.p, {
      children: "I have a need to be efficient, productive and professional my own video and content production as a Youtube influencer."
    }), "\n", createVNode(_components.p, {
      children: "In meeting that need I have had to find ways to automate my processes for creating content, recording professional videos and reaching my target audience."
    }), "\n", createVNode(_components.p, {
      children: [createVNode(_components.a, {
        href: "https://flivideo.com",
        children: "FliVideo"
      }), " was created to help me systematize and automate my own video influence."]
    }), "\n", createVNode(_components.h2, {
      id: "what-is-flivideo",
      children: "What is FliVideo?"
    }), "\n", createVNode(_components.p, {
      children: "FliVideo is where I gather knowledge on the tools, systems and automation\u2019s that you could implement to create your own Youtube content and influence."
    }), "\n", createVNode(_components.h3, {
      id: "learn-to-automate-your-video-influence",
      children: "Learn to automate your video influence"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Create videos quickly"
      }), "\n", createVNode(_components.li, {
        children: "Develop graphics and thumbnails"
      }), "\n", createVNode(_components.li, {
        children: "Using AI to write headlines, scripts and descriptions"
      }), "\n", createVNode(_components.li, {
        children: "Using AI to create thumbnails"
      }), "\n"]
    }), "\n", createVNode(_components.h3, {
      id: "systems",
      children: "Systems"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "The workflows I use to create multiple shorts per day"
      }), "\n"]
    }), "\n", createVNode(_components.h3, {
      id: "techniques",
      children: "Techniques"
    }), "\n", createVNode(_components.h3, {
      id: "software-automation-using-code-macros-and-apis",
      children: "Software automation using code, macros and API\u2019s"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Tools for creating videos"
      }), "\n"]
    }), "\n", createVNode(_components.h2, {
      id: "a-little-about-me",
      children: "A little about me"
    }), "\n", createVNode(_components.p, {
      children: "I love software development and I love video based learning, content and marketing."
    }), "\n", createVNode(_components.p, {
      children: "I got my first computer in 1982 (Texas Instruments TI99/4A) and I wrote my first program by copying code out of a subscription magazine when I was 10."
    }), "\n", createVNode(_components.p, {
      children: "I have been a professional software developer for 30+ years and dabbled in SEO, content and video marketing for the last 15 years."
    }), "\n", createVNode("img", {
      class: "p-1 w-64 h-64 rounded-full ring-2 ring-fli-200",
      src: "images/david.png",
      alt: "David Cruwys"
    })]
  });
}
function MDXContent$B(props = {}) {
  return createVNode(MDXLayout$A, {
    ...props,
    children: createVNode(_createMdxContent$B, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$D, "astro:jsx");
__astro_tag_component__(MDXContent$B, "astro:jsx");
const url$D = "";
const file$D = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/index.mdx";
function rawContent$D() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$D() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$D = (props = {}) => MDXContent$B({
											...props,
											components: { Fragment, ...props.components },
										});
Content$D[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$D.layout);

const _page0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$D,
  _internal: _internal$D,
  getHeadings: getHeadings$D,
  url: url$D,
  file: file$D,
  rawContent: rawContent$D,
  compiledContent: compiledContent$D,
  Content: Content$D,
  default: Content$D
}, Symbol.toStringTag, { value: 'Module' }));

const SITE = {
  title: "FliVideo",
  description: "Automate your video influence",
  defaultLanguage: "en_US",
  font_awesome: false,
  site_map: false,
  rss_feed: false
};

const DEFAULT_NAVIGATION = {
  sections: [
    {
      title: "Introduction",
      links: []
    }
  ]
};
const QUICK_NAVIGATION = {
  sections: [
    {
      title: "Quick Links",
      links: [
        {
          title: "Canva (Tips, Tricks, Tutorials)",
          href: "/canva"
        }
      ]
    }
  ]
};
async function topicNavigation(props) {
  const file = props.content.file;
  const configFile = topicNavigationPath(file);
  let data = structuredClone(DEFAULT_NAVIGATION);
  if (fs.existsSync(configFile)) {
    const json = await fsp.readFile(configFile, "utf-8");
    data = JSON.parse(json);
  }
  data.sections.push(...QUICK_NAVIGATION.sections);
  return data;
}
function slugify(text) {
  return text.toString().normalize("NFKD").toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-");
}
function topicNavigationPath(file) {
  const result = path.join(basePagePath(), pageSubpath(file), "navigation.json");
  return result;
}
function pageSubpath(file) {
  return path.dirname(file).substring(basePagePath().length);
}
function basePagePath() {
  return new URL("../pages/", import.meta.url).pathname;
}

class Link {
  title;
  slug;
  full_slug;
  constructor(title, slug) {
    this.title = title || "";
    this.slug = slug || slugify(this.title);
  }
}
class Topic extends Link {
  tags;
  topics;
  sections;
  constructor(title, slug, tags) {
    super(title, slug);
    this.tags = tags;
    this.topics = [];
    this.sections = [];
  }
  add_topic(title, slug, tags) {
    const topic = new Topic(title, slug, tags);
    this.topics.push(topic);
    return topic;
  }
}
class Sitemap extends Topic {
  constructor() {
    super("Home", "/", []);
  }
}

function sitemap() {
  const sitemap2 = new Sitemap();
  sitemap2.add_topic("AstroJSxxx", "astrojs", ["astrojs"]);
  const ruby = sitemap2.add_topic("Ruby", "ruby", ["ruby", "ruby/gems"]);
  ruby.add_topic("Ruby", "ruby", ["ruby", "ruby/gems"]);
  return sitemap2;
}

class AppContext {
  sitemap;
  constructor(sitemap) {
    this.sitemap = sitemap;
  }
}

const $$Astro$l = createAstro("/Users/davidcruwys/dev/sites/flivideo.com/src/layouts/Head.astro", "", "file:///Users/davidcruwys/dev/sites/flivideo.com/");
const $$Head = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$l, $$props, $$slots);
  Astro2.self = $$Head;
  const {
    title,
    description,
    image = "/placeholder-social.jpg",
    next,
    prev,
    canonicalURL,
    font_awesome,
    site_map,
    rss_feed
  } = Astro2.props;
  return renderTemplate`<head>
<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title"${addAttribute(title, "content")}>
<meta name="description"${addAttribute(description, "content")}>
<link rel="icon" type="image/svg+xml" href="/favicon.svg">

<!-- Global Metadata -->
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="generator"${addAttribute(Astro2.generator, "content")}>

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url"${addAttribute(Astro2.url, "content")}>
<meta property="og:title"${addAttribute(title, "content")}>
<meta property="og:description"${addAttribute(description, "content")}>
${image && renderTemplate`<meta property="og:image"${addAttribute(new URL(image, canonicalURL), "content")}>`}

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url"${addAttribute(Astro2.url, "content")}>
<meta property="twitter:title"${addAttribute(title, "content")}>
<meta property="twitter:description"${addAttribute(description, "content")}>
${image && renderTemplate`<meta property="twitter:image"${addAttribute(new URL(image, Astro2.url), "content")}>`}

<!-- Extras -->
${font_awesome && renderTemplate`<link rel="preconnect" href="//cdnjs.cloudflare.com">`}
${font_awesome && renderTemplate`<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" integrity="sha512-xh6O/CkQoPOWDdYTDqeRdPCVd1SpvCA9XXcUnZS2FmJNp1coAFzvtCN9BmamE+4aHK8yyUHUSCcJHgXloTyT2A==" crossorigin="anonymous" referrerpolicy="no-referrer">`}
${site_map && renderTemplate`<link rel="site_map" href="/site_map.xml">`}
${rss_feed && renderTemplate`<link rel="alternate" type="application/rss+xml" href="/feed/posts.xml">`}

<!-- SEO -->
<link rel="canonical"${addAttribute(canonicalURL, "href")}>
${next && renderTemplate`<link rel="next" aria-label="Previous Page"${addAttribute(new URL(next, canonicalURL).href, "href")}>`}
${prev && renderTemplate`<link rel="prev" aria-label="Next Page"${addAttribute(new URL(prev, canonicalURL).href, "href")}>`}
${renderHead($$result)}</head>`;
}, "/Users/davidcruwys/dev/sites/flivideo.com/src/layouts/Head.astro");

const $$Astro$k = createAstro("/Users/davidcruwys/dev/sites/flivideo.com/src/components/Hero.astro", "", "file:///Users/davidcruwys/dev/sites/flivideo.com/");
const $$Hero = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$k, $$props, $$slots);
  Astro2.self = $$Hero;
  return renderTemplate`${maybeRenderHead($$result)}<div class="overflow-hidden bg-slate-900 dark:-mb-32 dark:mt-[-4.5rem] dark:pb-32 dark:pt-[4.5rem] dark:lg:mt-[-4.75rem] dark:lg:pt-[4.75rem]">
  <div class="py-16 sm:px-2 lg:relative lg:py-20 lg:px-0">
    <div class="mx-auto grid max-w-2xl grid-cols-1 items-center gap-y-16 gap-x-8 px-4 lg:max-w-8xl lg:grid-cols-2 lg:px-8 xl:gap-x-16 xl:px-12">
      <div class="relative z-10 md:text-center lg:text-left">
        <div class="relative">
          <p class="inline bg-gradient-to-r from-fli-100 via-fli-200 to-fli-100 bg-clip-text font-display text-5xl tracking-tight text-transparent">
            Automate your influence
          </p>
          <p class="mt-3 text-2xl tracking-tight text-gray-300">
            Learn how to systemetise and automate your video influence.
          </p>
          <p class="mt-3 text-2xl tracking-tight text-gray-300">
            Create more content, reach more people, and grow your business.
          </p>
          <div class="mt-8 flex gap-4 md:justify-center lg:justify-start text-fli-100">
            <button href="/">
              Get started
            </button>
            <button href="/" variant="secondary">
              View on Youtube
            </button>
          </div>
        </div>
      </div>
      <div class="relative lg:static xl:pl-10">
        <div class="absolute inset-x-[-50vw] -top-32 -bottom-48 [mask-image:linear-gradient(transparent,white,white)] dark:[mask-image:linear-gradient(transparent,white,transparent)] lg:left-[calc(50%+14rem)] lg:right-0 lg:-top-32 lg:-bottom-32 lg:[mask-image:none] lg:dark:[mask-image:linear-gradient(white,white,transparent)]">
          <!-- <HeroBackground class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 lg:translate-y-[-60%]" /> -->
        </div>
        <div class="relative">
          <div class="absolute inset-0 rounded-2xl bg-gradient-to-tr from-sky-300 via-sky-300/70 to-blue-300 opacity-10 blur-lg"></div>
          <div class="absolute inset-0 rounded-2xl bg-gradient-to-tr from-sky-300 via-sky-300/70 to-blue-300 opacity-10"></div>
          <div class="relative rounded-2xl bg-[#0A101F]/80 ring-1 ring-white/10 backdrop-blur">
            <div class="absolute -top-px left-20 right-11 h-px bg-gradient-to-r from-sky-300/0 via-sky-300/70 to-sky-300/0"></div>
            <div class="absolute -bottom-px left-11 right-20 h-px bg-gradient-to-r from-blue-400/0 via-blue-400 to-blue-400/0"></div>
            <div class="pl-4 pt-4">
              <div class="mt-4 flex space-x-2 text-xs">
              </div>
              <div class="mt-6 flex items-start px-1 text-sm">
                <div aria-hidden="true" class="select-none border-r border-slate-300/5 pr-4 font-mono text-slate-600">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;
}, "/Users/davidcruwys/dev/sites/flivideo.com/src/components/Hero.astro");

const $$Astro$j = createAstro("/Users/davidcruwys/dev/sites/flivideo.com/src/components/header/GitHubIcon.astro", "", "file:///Users/davidcruwys/dev/sites/flivideo.com/");
const $$GitHubIcon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$j, $$props, $$slots);
  Astro2.self = $$GitHubIcon;
  const { ...props } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<svg aria-hidden="true" viewBox="0 0 16 16"${spreadAttributes(props)}>
  <path d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"></path>
</svg>`;
}, "/Users/davidcruwys/dev/sites/flivideo.com/src/components/header/GitHubIcon.astro");

const $$Astro$i = createAstro("/Users/davidcruwys/dev/sites/flivideo.com/src/components/header/Logo.astro", "", "file:///Users/davidcruwys/dev/sites/flivideo.com/");
const $$Logo = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$i, $$props, $$slots);
  Astro2.self = $$Logo;
  const { ...props } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<img src="/images/logo-fli-video.svg" alt="Logo"${spreadAttributes(props)}>`;
}, "/Users/davidcruwys/dev/sites/flivideo.com/src/components/header/Logo.astro");

const $$Astro$h = createAstro("/Users/davidcruwys/dev/sites/flivideo.com/src/components/header/LogoIcon.astro", "", "file:///Users/davidcruwys/dev/sites/flivideo.com/");
const $$LogoIcon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$h, $$props, $$slots);
  Astro2.self = $$LogoIcon;
  const { ...props } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<img src="/images/logo-fli-video-icon.svg" alt="Logo"${spreadAttributes(props)}>`;
}, "/Users/davidcruwys/dev/sites/flivideo.com/src/components/header/LogoIcon.astro");

const $$Astro$g = createAstro("/Users/davidcruwys/dev/sites/flivideo.com/src/components/header/MobileNavigation.astro", "", "file:///Users/davidcruwys/dev/sites/flivideo.com/");
const $$MobileNavigation = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$g, $$props, $$slots);
  Astro2.self = $$MobileNavigation;
  return renderTemplate``;
}, "/Users/davidcruwys/dev/sites/flivideo.com/src/components/header/MobileNavigation.astro");

const $$Astro$f = createAstro("/Users/davidcruwys/dev/sites/flivideo.com/src/components/header/SearchIcon.astro", "", "file:///Users/davidcruwys/dev/sites/flivideo.com/");
const $$SearchIcon = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$f, $$props, $$slots);
  Astro2.self = $$SearchIcon;
  const { ...props } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<svg aria-hidden="true" viewBox="0 0 20 20"${spreadAttributes(props)}>
  <path d="M16.293 17.707a1 1 0 0 0 1.414-1.414l-1.414 1.414ZM9 14a5 5 0 0 1-5-5H2a7 7 0 0 0 7 7v-2ZM4 9a5 5 0 0 1 5-5V2a7 7 0 0 0-7 7h2Zm5-5a5 5 0 0 1 5 5h2a7 7 0 0 0-7-7v2Zm8.707 12.293-3.757-3.757-1.414 1.414 3.757 3.757 1.414-1.414ZM14 9a4.98 4.98 0 0 1-1.464 3.536l1.414 1.414A6.98 6.98 0 0 0 16 9h-2Zm-1.464 3.536A4.98 4.98 0 0 1 9 14v2a6.98 6.98 0 0 0 4.95-2.05l-1.414-1.414Z"></path>
</svg>`;
}, "/Users/davidcruwys/dev/sites/flivideo.com/src/components/header/SearchIcon.astro");

const $$Astro$e = createAstro("/Users/davidcruwys/dev/sites/flivideo.com/src/components/header/SearchKbd.astro", "", "file:///Users/davidcruwys/dev/sites/flivideo.com/");
const $$SearchKbd = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$e, $$props, $$slots);
  Astro2.self = $$SearchKbd;
  let modifierKey = "\u2318";
  return renderTemplate`${renderTemplate`${maybeRenderHead($$result)}<kbd class="ml-auto hidden font-medium text-slate-400 dark:text-slate-500 md:block">
    <kbd class="font-sans">${modifierKey}</kbd>
    <kbd class="font-sans">K</kbd>
  </kbd>`}`;
}, "/Users/davidcruwys/dev/sites/flivideo.com/src/components/header/SearchKbd.astro");

const $$Astro$d = createAstro("/Users/davidcruwys/dev/sites/flivideo.com/src/components/header/Search.astro", "", "file:///Users/davidcruwys/dev/sites/flivideo.com/");
const $$Search = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$d, $$props, $$slots);
  Astro2.self = $$Search;
  return renderTemplate`${maybeRenderHead($$result)}<button type="button" class="group flex h-6 w-6 items-center justify-center sm:justify-start md:h-auto md:w-80 md:flex-none md:rounded-lg md:py-2.5 md:pl-4 md:pr-3.5 md:text-sm md:ring-1 md:ring-slate-200 md:hover:ring-slate-300 dark:md:bg-slate-800/75 dark:md:ring-inset dark:md:ring-white/5 dark:md:hover:bg-slate-700/40 dark:md:hover:ring-slate-500 lg:w-96">
  <!-- onClick={onOpen} -->
  ${renderComponent($$result, "SearchIcon", $$SearchIcon, { "className": "h-5 w-5 flex-none fill-slate-400 group-hover:fill-slate-500 dark:fill-slate-500 md:group-hover:fill-slate-400" })}
  <span class="sr-only md:not-sr-only md:ml-2 md:text-slate-500 md:dark:text-slate-400">
    Search docs
  </span>
  ${renderComponent($$result, "SearchKbd", $$SearchKbd, {})}
</button>`;
}, "/Users/davidcruwys/dev/sites/flivideo.com/src/components/header/Search.astro");

const $$Astro$c = createAstro("/Users/davidcruwys/dev/sites/flivideo.com/src/components/header/ThemeSelector.astro", "", "file:///Users/davidcruwys/dev/sites/flivideo.com/");
const $$ThemeSelector = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$c, $$props, $$slots);
  Astro2.self = $$ThemeSelector;
  Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<button class="flex h-6 w-6 items-center justify-center rounded-lg shadow-md shadow-black/5 ring-1 ring-black/5 dark:bg-slate-700 dark:ring-inset dark:ring-white/5" id="headlessui-listbox-button-:Raccm:" type="button" aria-haspopup="true" aria-expanded="false" data-headlessui-state="" aria-labelledby="headlessui-listbox-label-:R6ccm: headlessui-listbox-button-:Raccm:" aria-label="System">
</button>`;
}, "/Users/davidcruwys/dev/sites/flivideo.com/src/components/header/ThemeSelector.astro");

const $$Astro$b = createAstro("/Users/davidcruwys/dev/sites/flivideo.com/src/components/header/Header.astro", "", "file:///Users/davidcruwys/dev/sites/flivideo.com/");
const $$Header = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$b, $$props, $$slots);
  Astro2.self = $$Header;
  return renderTemplate`${maybeRenderHead($$result)}<header class="sticky top-0 z-50 flex flex-wrap items-center justify-between bg-white px-4 py-5 shadow-md shadow-slate-900/5 transition duration-500 dark:shadow-none sm:px-6 lg:px-8">
  <!-- 
    TODO:
  isScrolled
    ? 'dark:bg-slate-900/95 dark:backdrop-blur dark:[@supports(backdrop-filter:blur(0))]:bg-slate-900/75'
    : 'dark:bg-transparent'
  -->
  <div class="mr-6 flex lg:hidden">
    ${renderComponent($$result, "MobileNavigation", $$MobileNavigation, {})} <!-- navigation={navigation} /> -->
  </div>
  <div class="relative flex flex-grow basis-0 items-center">
    <a href="/" aria-label="Home page">
      ${renderComponent($$result, "Logo", $$Logo, { "class": "hidden h-24 w-auto fill-slate-700 dark:fill-sky-100 lg:block" })}
      ${renderComponent($$result, "LogoIcon", $$LogoIcon, { "class": "h-20 lg:hidden" })}
    </a>
  </div>
  <div class="-my-5 mr-6 sm:mr-8 md:mr-0">
    ${renderComponent($$result, "Search", $$Search, {})}
  </div>
  <div class="relative flex basis-0 justify-end gap-6 sm:gap-8 md:flex-grow">
    ${renderComponent($$result, "ThemeSelector", $$ThemeSelector, { "class": "relative z-10" })}
    <a href="https://github.com/klueless-io" target="_blank" class="group" aria-label="GitHub">
      ${renderComponent($$result, "GitHubIcon", $$GitHubIcon, { "class": "h-6 w-6 fill-slate-400 group-hover:fill-slate-500 dark:group-hover:fill-slate-300" })}
    </a>
  </div>
</header>`;
}, "/Users/davidcruwys/dev/sites/flivideo.com/src/components/header/Header.astro");

const $$Astro$a = createAstro("/Users/davidcruwys/dev/sites/flivideo.com/src/components/Prose.astro", "", "file:///Users/davidcruwys/dev/sites/flivideo.com/");
const $$Prose = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$a, $$props, $$slots);
  Astro2.self = $$Prose;
  const { ...props } = Astro2.props;
  const classes = [
    "prose prose-slate max-w-none dark:prose-invert dark:text-slate-400",
    "prose-headings:scroll-mt-28 prose-headings:font-display prose-headings:font-normal lg:prose-headings:scroll-mt-[8.5rem]",
    "prose-lead:text-slate-500 dark:prose-lead:text-slate-400",
    "prose-a:font-semibold dark:prose-a:text-sky-400",
    "prose-a:no-underline prose-a:shadow-[inset_0_-2px_0_0_var(--tw-prose-background,#fff),inset_0_calc(-1*(var(--tw-prose-underline-size,4px)+2px))_0_0_var(--tw-prose-underline,theme(colors.sky.300))] hover:prose-a:[--tw-prose-underline-size:6px] dark:[--tw-prose-background:theme(colors.slate.900)] dark:prose-a:shadow-[inset_0_calc(-1*var(--tw-prose-underline-size,2px))_0_0_var(--tw-prose-underline,theme(colors.sky.800))] dark:hover:prose-a:[--tw-prose-underline-size:6px]",
    "prose-pre:rounded-xl prose-pre:bg-slate-900 prose-pre:shadow-lg dark:prose-pre:bg-slate-800/60 dark:prose-pre:shadow-none dark:prose-pre:ring-1 dark:prose-pre:ring-slate-300/10",
    "dark:prose-hr:border-slate-800"
  ].join(" ");
  return renderTemplate`${maybeRenderHead($$result)}<div${addAttribute(classes, "class")}${spreadAttributes(props)}>
  ${renderSlot($$result, $$slots["default"])}
</div>`;
}, "/Users/davidcruwys/dev/sites/flivideo.com/src/components/Prose.astro");

const $$Astro$9 = createAstro("/Users/davidcruwys/dev/sites/flivideo.com/src/components/main/ArticleSection.astro", "", "file:///Users/davidcruwys/dev/sites/flivideo.com/");
const $$ArticleSection = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$9, $$props, $$slots);
  Astro2.self = $$ArticleSection;
  const { section } = Astro2.props;
  return renderTemplate`${section && renderTemplate`${maybeRenderHead($$result)}<p class="font-display text-sm font-medium text-sky-500">
    ${section}
  </p>`}`;
}, "/Users/davidcruwys/dev/sites/flivideo.com/src/components/main/ArticleSection.astro");

const $$Astro$8 = createAstro("/Users/davidcruwys/dev/sites/flivideo.com/src/components/main/ArticleTitle.astro", "", "file:///Users/davidcruwys/dev/sites/flivideo.com/");
const $$ArticleTitle = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$8, $$props, $$slots);
  Astro2.self = $$ArticleTitle;
  const { title } = Astro2.props;
  return renderTemplate`${title && renderTemplate`${maybeRenderHead($$result)}<h1 class="font-display text-3xl tracking-tight text-slate-900 dark:text-white">
    ${title}
  </h1>`}`;
}, "/Users/davidcruwys/dev/sites/flivideo.com/src/components/main/ArticleTitle.astro");

const $$Astro$7 = createAstro("/Users/davidcruwys/dev/sites/flivideo.com/src/components/main/Article.astro", "", "file:///Users/davidcruwys/dev/sites/flivideo.com/");
const $$Article = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$7, $$props, $$slots);
  Astro2.self = $$Article;
  const { section = "Canva tips and tricks", title = "It's good to be the king" } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<article>
  <header class="mb-9 space-y-1">
    ${section && renderTemplate`${renderComponent($$result, "ArticleSection", $$ArticleSection, { "section": section })}`}
    ${title && renderTemplate`${renderComponent($$result, "ArticleTitle", $$ArticleTitle, { "title": title })}`}
  </header>
  ${renderComponent($$result, "Prose", $$Prose, {}, { "default": () => renderTemplate`${renderSlot($$result, $$slots["default"])}` })}
</article>`;
}, "/Users/davidcruwys/dev/sites/flivideo.com/src/components/main/Article.astro");

const $$Astro$6 = createAstro("/Users/davidcruwys/dev/sites/flivideo.com/src/components/main/NextPage.astro", "", "file:///Users/davidcruwys/dev/sites/flivideo.com/");
const $$NextPage = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$6, $$props, $$slots);
  Astro2.self = $$NextPage;
  return renderTemplate`${maybeRenderHead($$result)}<div class="ml-auto text-right">
  <dt class="font-display text-sm font-medium text-slate-900 dark:text-white">
    Next
  </dt>
  <dd class="mt-1">
    <a href="nextPage.href" class="text-base font-semibold text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300">
      nextPage.title <span aria-hidden="true">&rarr;</span>
    </a>
  </dd>
</div>`;
}, "/Users/davidcruwys/dev/sites/flivideo.com/src/components/main/NextPage.astro");

const $$Astro$5 = createAstro("/Users/davidcruwys/dev/sites/flivideo.com/src/components/main/PreviousPage.astro", "", "file:///Users/davidcruwys/dev/sites/flivideo.com/");
const $$PreviousPage = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$5, $$props, $$slots);
  Astro2.self = $$PreviousPage;
  return renderTemplate`${maybeRenderHead($$result)}<div>
  <dt class="font-display text-sm font-medium text-slate-900 dark:text-white">
    Previous
  </dt>
  <dd class="mt-1">
    <a href="previousPage.href" class="text-base font-semibold text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300">
      <span aria-hidden="true">&larr;</span>previousPage.title
    </a>
  </dd>
</div>`;
}, "/Users/davidcruwys/dev/sites/flivideo.com/src/components/main/PreviousPage.astro");

class Heading {
  text;
  slug;
  depth;
  sequence;
  parent;
  headings;
  constructor(text, slug, depth, sequence) {
    this.text = text;
    this.slug = slug;
    this.depth = depth;
    this.sequence = sequence;
    this.parent = null;
    this.headings = null;
  }
  add_heading(heading) {
    heading.parent = this;
    if (this.headings === null) {
      this.headings = [];
    }
    this.headings.push(heading);
  }
  root() {
    return this.depth === 0;
  }
  valid() {
    return this.depth > 0;
  }
  data() {
    let result = {
      text: this.text,
      slug: this.slug,
      depth: this.depth,
      sequence: this.sequence,
      headings: this.headings?.map((h) => h.data())
    };
    return result;
  }
}

class CreateToc {
  toc;
  current_heading;
  constructor() {
    this.toc = new Heading("*", "-", 0, -1);
    this.current_heading = this.toc;
  }
  process(astro_headings) {
    astro_headings.forEach((astro_heading, index) => {
      let heading = new Heading(
        astro_heading.text,
        astro_heading.slug,
        astro_heading.depth,
        index
      );
      this.process_heading(heading);
    });
    return this.data();
  }
  debug() {
    console.log(JSON.stringify(this.data(), null, 2));
  }
  data() {
    return (this.toc.headings || []).map((h) => h.data());
  }
  process_heading(heading) {
    if (heading.depth > this.current_heading.depth) {
      this.add_child_heading(heading);
    } else if (heading.depth === this.current_heading.depth) {
      this.add_sibling_heading(heading);
    } else if (heading.depth < this.current_heading.depth) {
      this.add_upstream_heading(heading);
    }
  }
  add_child_heading(heading) {
    this.current_heading.add_heading(heading);
    this.current_heading = heading;
  }
  add_sibling_heading(heading) {
    if (this.current_heading.parent === null) {
      return;
    }
    this.current_heading = this.current_heading.parent;
    this.add_child_heading(heading);
  }
  add_upstream_heading(heading) {
    while (this.current_heading.valid() && heading.depth < this.current_heading.depth) {
      if (this.current_heading.parent === null) {
        throw new Error("current_heading.parent is null");
      }
      this.current_heading = this.current_heading.parent;
    }
    if (this.current_heading.root()) {
      return this.add_child_heading(heading);
    }
    this.add_sibling_heading(heading);
  }
}

const $$Astro$4 = createAstro("/Users/davidcruwys/dev/sites/flivideo.com/src/components/main/TableOfContents.astro", "", "file:///Users/davidcruwys/dev/sites/flivideo.com/");
const $$TableOfContents = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$4, $$props, $$slots);
  Astro2.self = $$TableOfContents;
  const { title, headings } = Astro2.props;
  console.log(headings);
  let filterHeadings = headings.filter((heading) => heading.depth === 2 || heading.depth === 3);
  let tocHeadings = new CreateToc().process(filterHeadings);
  console.log(JSON.stringify(tocHeadings, null, 2));
  return renderTemplate`${maybeRenderHead($$result)}<nav aria-labelledby="on-this-page-title" class="w-56">
${tocHeadings.length > 0 && renderTemplate`<h2 id="on-this-page-title" class="font-display text-sm font-medium text-slate-900 dark:text-white">
    ${title}
  </h2><ol role="list" class="mt-4 space-y-3 text-sm">
    ${tocHeadings.map((heading) => renderTemplate`<li>
        <h3>
          <a${addAttribute(`#${heading.slug}`, "href")} class="font-normal text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
            ${heading.text}
          </a>
        </h3>

        ${heading.headings?.length > 0 && renderTemplate`<ol role="list" class="mt-2 space-y-3 pl-5 text-slate-500 dark:text-slate-400">
            ${heading.headings.map((subHeading) => renderTemplate`<li>
                <a${addAttribute(`#${subHeading.slug}`, "href")} class="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                  ${subHeading.text}
                </a>
              </li>`)}
          </ol>`}
      </li>`)}
  </ol>`}
</nav>`;
}, "/Users/davidcruwys/dev/sites/flivideo.com/src/components/main/TableOfContents.astro");

const $$Astro$3 = createAstro("/Users/davidcruwys/dev/sites/flivideo.com/src/components/main/Navigation.astro", "", "file:///Users/davidcruwys/dev/sites/flivideo.com/");
const $$Navigation = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Navigation;
  const { navigation } = Astro2.props;
  let sections = navigation.sections;
  return renderTemplate`${maybeRenderHead($$result)}<div class="hidden lg:relative lg:block lg:flex-none">
  <div class="absolute inset-y-0 right-0 w-[50vw] bg-slate-50 dark:hidden"></div>
  <div class="sticky top-[4.5rem] -ml-0.5 h-[calc(100vh-4.5rem)] overflow-y-auto py-16 pl-0.5">
    <div class="absolute top-16 bottom-0 right-0 hidden h-12 w-px bg-gradient-to-t from-slate-800 dark:block"></div>
  <div class="absolute top-28 bottom-0 right-0 hidden w-px bg-slate-800 dark:block"></div>
    <nav class="text-base lg:text-sm w-64 pr-8 xl:w-72 xl:pr-16">
      <ul role="list" class="space-y-9">
        ${sections.map((section) => renderTemplate`<li>
            <h2 class="font-display font-medium text-slate-900 dark:text-white">${section.title}</h2>
            <ul role="list" class="mt-2 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 lg:mt-4 lg:space-y-4 lg:border-slate-200">
              ${section.links.map((link) => renderTemplate`<li class="relative">
                  <a${addAttribute(link.href, "href")} class="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300">
                    ${link.title}
                  </a>
                </li>`)}
            </ul>
          </li>`)}
      </ul>
    </nav>
  </div>
</div>`;
}, "/Users/davidcruwys/dev/sites/flivideo.com/src/components/main/Navigation.astro");

const $$Astro$2 = createAstro("/Users/davidcruwys/dev/sites/flivideo.com/src/components/main/Main.astro", "", "file:///Users/davidcruwys/dev/sites/flivideo.com/");
const $$Main = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$Main;
  const { title, headings, navigation, context } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<div class="relative mx-auto flex max-w-8xl justify-center sm:px-2 lg:px-8 xl:px-12">
  <div class="hidden lg:relative lg:block lg:flex-none">
    ${renderComponent($$result, "Navigation", $$Navigation, { "navigation": navigation })}
  </div>
  <div class="min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16">
    <!-- <code>
      <pre>{JSON.stringify(navigation, null, 2)}</pre>
    </code> -->
    ${renderComponent($$result, "Article", $$Article, { "title": title }, { "default": () => renderTemplate`${renderSlot($$result, $$slots["default"])}` })}
    <dl class="mt-12 flex border-t border-slate-200 pt-6 dark:border-slate-800">
      ${renderComponent($$result, "PreviousPage", $$PreviousPage, {})}
      ${renderComponent($$result, "NextPage", $$NextPage, {})}
    </dl>
  </div>
  <div class="hidden xl:sticky xl:top-[4.5rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.5rem)] xl:flex-none xl:overflow-y-auto xl:py-16 xl:pr-6">
    ${renderComponent($$result, "TableOfContents", $$TableOfContents, { "title": "On this page", "headings": headings })}
  </div>
</div>`;
}, "/Users/davidcruwys/dev/sites/flivideo.com/src/components/main/Main.astro");

const $$Astro$1 = createAstro("/Users/davidcruwys/dev/sites/flivideo.com/src/layouts/BaseLayout.astro", "", "file:///Users/davidcruwys/dev/sites/flivideo.com/");
const $$BaseLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$BaseLayout;
  const context = new AppContext(sitemap());
  const {
    title = Astro2.props.content.title || SITE.title,
    pageTitle = Astro2.props.content.pageTitle || Astro2.props.content.title || SITE.title,
    description = Astro2.props.content.description || SITE.description,
    image,
    next,
    prev,
    canonicalURL = Astro2.url,
    font_awesome = SITE.font_awesome,
    site_map = SITE.site_map,
    rss_feed = SITE.rss_feed,
    hero = Astro2.props.content.hero || false
  } = Astro2.props;
  const navigation = await topicNavigation(Astro2.props);
  return renderTemplate`<html lang="en" class="scroll-smooth">
${renderComponent($$result, "Head", $$Head, { "title": pageTitle, "description": description, "canonicalURL": canonicalURL, "font_awesome": font_awesome, "site_map": site_map, "rss_feed": rss_feed })}

${maybeRenderHead($$result)}<body class="bg-white dark:bg-slate-900">
  ${renderComponent($$result, "Header", $$Header, {})}
  ${hero && renderTemplate`${renderComponent($$result, "Hero", $$Hero, {})}`}
  ${renderComponent($$result, "Main", $$Main, { "title": title, "headings": Astro2.props.headings, "navigation": navigation, "context": context }, { "default": () => renderTemplate`${renderSlot($$result, $$slots["default"])}` })}  
</body></html>`;
}, "/Users/davidcruwys/dev/sites/flivideo.com/src/layouts/BaseLayout.astro");

const $$file = "/Users/davidcruwys/dev/sites/flivideo.com/src/layouts/BaseLayout.astro";
const $$url = undefined;

const BaseLayout = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$BaseLayout,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const html$1 = "<h2 id=\"interesting\">Interesting</h2>";

				const _internal$C = {
					injectedFrontmatter: {},
				};
				const frontmatter$C = {"layout":"~/layouts/BaseLayout.astro","title":"Ruby"};
				const file$C = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/index.md";
				const url$C = "/canva";
				function rawContent$C() {
					return "\n## Interesting\n";
				}
				function compiledContent$C() {
					return html$1;
				}
				function getHeadings$C() {
					return [{"depth":2,"slug":"interesting","text":"Interesting"}];
				}
				function getHeaders$1() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$C();
				}				async function Content$C() {
					const { layout, ...content } = frontmatter$C;
					content.file = file$C;
					content.url = url$C;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html$1 });
					return createVNode($$BaseLayout, {
									file: file$C,
									url: url$C,
									content,
									frontmatter: content,
									headings: getHeadings$C(),
									rawContent: rawContent$C,
									compiledContent: compiledContent$C,
									'server:root': true,
									children: contentFragment
								});
				}
				Content$C[Symbol.for('astro.needsHeadRendering')] = false;

const _page1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  _internal: _internal$C,
  frontmatter: frontmatter$C,
  file: file$C,
  url: url$C,
  rawContent: rawContent$C,
  compiledContent: compiledContent$C,
  getHeadings: getHeadings$C,
  getHeaders: getHeaders$1,
  Content: Content$C,
  default: Content$C
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$z = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$B;
  content.file = file$B;
  content.url = url$B;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$B,
    url: url$B,
    content,
    frontmatter: content,
    headings: getHeadings$B(),
    "server:root": true,
    children
  });
};
const frontmatter$B = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "Use ChatGpt to quickly build Canva presentation",
  "source": "ME",
  "canva-design": "https://www.canva.com/design/DAFVc9GY1s0/0vXNVZNyzP4snsYTs_aRjw/edit"
};
const _internal$B = {
  injectedFrontmatter: {}
};
function getHeadings$B() {
  return [];
}
function _createMdxContent$A(props) {
  return createVNode(Fragment, {});
}
function MDXContent$A(props = {}) {
  return createVNode(MDXLayout$z, {
    ...props,
    children: createVNode(_createMdxContent$A, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$B, "astro:jsx");
__astro_tag_component__(MDXContent$A, "astro:jsx");
const url$B = "/canva/chat-gpt-to-quickly-build-presentation";
const file$B = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/chat-gpt-to-quickly-build-presentation.mdx";
function rawContent$B() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$B() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$B = (props = {}) => MDXContent$A({
											...props,
											components: { Fragment, ...props.components },
										});
Content$B[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$B.layout);

const _page2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$B,
  _internal: _internal$B,
  getHeadings: getHeadings$B,
  url: url$B,
  file: file$B,
  rawContent: rawContent$B,
  compiledContent: compiledContent$B,
  Content: Content$B,
  default: Content$B
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$y = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$A;
  content.file = file$A;
  content.url = url$A;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$A,
    url: url$A,
    content,
    frontmatter: content,
    headings: getHeadings$A(),
    "server:root": true,
    children
  });
};
const frontmatter$A = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "Faster Zooming",
  "source": "https://youtu.be/_XOWhA1dK7Y?t=361",
  "canva-design": "https://www.canva.com/design/DAEZd0LSZNE/8b3VQzYZKcmnnLLQb9WGiw/edit"
};
const _internal$A = {
  injectedFrontmatter: {}
};
function getHeadings$A() {
  return [{
    "depth": 2,
    "slug": "use-the-zoom-controls",
    "text": "Use the zoom controls"
  }, {
    "depth": 2,
    "slug": "use-keyboard-shortcuts",
    "text": "Use keyboard shortcuts"
  }, {
    "depth": 2,
    "slug": "use-mouse-shortcuts",
    "text": "Use mouse shortcuts"
  }];
}
function _createMdxContent$z(props) {
  const _components = Object.assign({
    h2: "h2",
    ul: "ul",
    li: "li"
  }, props.components);
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "use-the-zoom-controls",
      children: "Use the zoom controls"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Use the zoom controls in the bottom right corner"
      }), "\n"]
    }), "\n", createVNode(_components.h2, {
      id: "use-keyboard-shortcuts",
      children: "Use keyboard shortcuts"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Use the \u2018Command + +\u2019 key to zoom in"
      }), "\n", createVNode(_components.li, {
        children: "Use the \u2018Command + -\u2019 key to zoom out"
      }), "\n"]
    }), "\n", createVNode(_components.h2, {
      id: "use-mouse-shortcuts",
      children: "Use mouse shortcuts"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Use the \u2018Ctrl + Zoom\u2019 key to zoom in/out"
      }), "\n"]
    })]
  });
}
function MDXContent$z(props = {}) {
  return createVNode(MDXLayout$y, {
    ...props,
    children: createVNode(_createMdxContent$z, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$A, "astro:jsx");
__astro_tag_component__(MDXContent$z, "astro:jsx");
const url$A = "/canva/create-a-reusable-template-in-canva";
const file$A = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/create-a-reusable-template-in-canva.mdx";
function rawContent$A() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$A() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$A = (props = {}) => MDXContent$z({
											...props,
											components: { Fragment, ...props.components },
										});
Content$A[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$A.layout);

const _page3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$A,
  _internal: _internal$A,
  getHeadings: getHeadings$A,
  url: url$A,
  file: file$A,
  rawContent: rawContent$A,
  compiledContent: compiledContent$A,
  Content: Content$A,
  default: Content$A
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$x = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$z;
  content.file = file$z;
  content.url = url$z;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$z,
    url: url$z,
    content,
    frontmatter: content,
    headings: getHeadings$z(),
    "server:root": true,
    children
  });
};
const frontmatter$z = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "Apply Style and Text to Shapes",
  "source": "ME",
  "canva-design": "https://www.canva.com/design/DAFVdu38aF8/meV4ipWqT9jp-H10nKCZEA/edit"
};
const _internal$z = {
  injectedFrontmatter: {}
};
function getHeadings$z() {
  return [];
}
function _createMdxContent$y(props) {
  return createVNode(Fragment, {});
}
function MDXContent$y(props = {}) {
  return createVNode(MDXLayout$x, {
    ...props,
    children: createVNode(_createMdxContent$y, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$z, "astro:jsx");
__astro_tag_component__(MDXContent$y, "astro:jsx");
const url$z = "/canva/apply-style-and-text-to-shapes";
const file$z = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/apply-style-and-text-to-shapes.mdx";
function rawContent$z() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$z() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$z = (props = {}) => MDXContent$y({
											...props,
											components: { Fragment, ...props.components },
										});
Content$z[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$z.layout);

const _page4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$z,
  _internal: _internal$z,
  getHeadings: getHeadings$z,
  url: url$z,
  file: file$z,
  rawContent: rawContent$z,
  compiledContent: compiledContent$z,
  Content: Content$z,
  default: Content$z
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$w = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$y;
  content.file = file$y;
  content.url = url$y;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$y,
    url: url$y,
    content,
    frontmatter: content,
    headings: getHeadings$y(),
    "server:root": true,
    children
  });
};
const frontmatter$y = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "Trendy Profile Picture Outline",
  "source": "https://youtu.be/_XOWhA1dK7Y?t=675",
  "canva-design": "https://www.canva.com/design/DAFVQl07ctY/h1HeHqJQ449OZfnk4LHNzw/edit"
};
const _internal$y = {
  injectedFrontmatter: {}
};
function getHeadings$y() {
  return [{
    "depth": 2,
    "slug": "steps",
    "text": "Steps"
  }];
}
function _createMdxContent$x(props) {
  const _components = Object.assign({
    h2: "h2",
    ul: "ul",
    li: "li",
    code: "code"
  }, props.components);
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "steps",
      children: "Steps"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Select image"
      }), "\n", createVNode(_components.li, {
        children: ["Press ", createVNode(_components.code, {
          children: "Command + D"
        }), " key to duplicate the image"]
      }), "\n", createVNode(_components.li, {
        children: "Select one of the images"
      }), "\n", createVNode(_components.li, {
        children: ["Click ", createVNode(_components.code, {
          children: "Edit Image"
        })]
      }), "\n", createVNode(_components.li, {
        children: ["Select ", createVNode(_components.code, {
          children: "Duotone"
        })]
      }), "\n", createVNode(_components.li, {
        children: ["Select ", createVNode(_components.code, {
          children: "Duotone"
        }), " a second time to go into settings"]
      }), "\n", createVNode(_components.li, {
        children: "Set the foreground and background color to white (or any other color you like)"
      }), "\n"]
    })]
  });
}
function MDXContent$x(props = {}) {
  return createVNode(MDXLayout$w, {
    ...props,
    children: createVNode(_createMdxContent$x, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$y, "astro:jsx");
__astro_tag_component__(MDXContent$x, "astro:jsx");
const url$y = "/canva/trendy-profile-picture-outline";
const file$y = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/trendy-profile-picture-outline.mdx";
function rawContent$y() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$y() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$y = (props = {}) => MDXContent$x({
											...props,
											components: { Fragment, ...props.components },
										});
Content$y[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$y.layout);

const _page5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$y,
  _internal: _internal$y,
  getHeadings: getHeadings$y,
  url: url$y,
  file: file$y,
  rawContent: rawContent$y,
  compiledContent: compiledContent$y,
  Content: Content$y,
  default: Content$y
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$v = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$x;
  content.file = file$x;
  content.url = url$x;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$x,
    url: url$x,
    content,
    frontmatter: content,
    headings: getHeadings$x(),
    "server:root": true,
    children
  });
};
const frontmatter$x = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "Design a Beautiful EBook Cover or Product Mockup",
  "source": "https://youtu.be/_XOWhA1dK7Y?t=64",
  "canva-design": "https://www.canva.com/design/DAFU-LXFv7M/3iQ59ojzbVC0J7_E8GiAYA/edit"
};
const _internal$x = {
  injectedFrontmatter: {}
};
function getHeadings$x() {
  return [{
    "depth": 2,
    "slug": "steps",
    "text": "Steps"
  }];
}
function _createMdxContent$w(props) {
  const _components = Object.assign({
    h2: "h2",
    ul: "ul",
    li: "li",
    p: "p",
    a: "a"
  }, props.components);
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "steps",
      children: "Steps"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Create a Design"
      }), "\n", createVNode(_components.li, {
        children: "Click on \u2018eBook Cover\u2019"
      }), "\n", createVNode(_components.li, {
        children: "Select a design"
      }), "\n", createVNode(_components.li, {
        children: "Customize the design"
      }), "\n", createVNode(_components.li, {
        children: "Click on Share"
      }), "\n"]
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.a, {
        href: "https://www.canva.com/design/DAFU-LXFv7M/3iQ59ojzbVC0J7_E8GiAYA/edit",
        children: "reference"
      })
    })]
  });
}
function MDXContent$w(props = {}) {
  return createVNode(MDXLayout$v, {
    ...props,
    children: createVNode(_createMdxContent$w, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$x, "astro:jsx");
__astro_tag_component__(MDXContent$w, "astro:jsx");
const url$x = "/canva/ebook-cover-or-product-mockup";
const file$x = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/ebook-cover-or-product-mockup.mdx";
function rawContent$x() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$x() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$x = (props = {}) => MDXContent$w({
											...props,
											components: { Fragment, ...props.components },
										});
Content$x[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$x.layout);

const _page6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$x,
  _internal: _internal$x,
  getHeadings: getHeadings$x,
  url: url$x,
  file: file$x,
  rawContent: rawContent$x,
  compiledContent: compiledContent$x,
  Content: Content$x,
  default: Content$x
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$u = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$w;
  content.file = file$w;
  content.url = url$w;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$w,
    url: url$w,
    content,
    frontmatter: content,
    headings: getHeadings$w(),
    "server:root": true,
    children
  });
};
const frontmatter$w = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "Quickly Find Brand Colors (alternative)",
  "source": null,
  "canva-design": "https://www.canva.com/design/DAFVcbw_Kcc/ScPuBqSqf0GkDqRCNSgJag/edit"
};
const _internal$w = {
  injectedFrontmatter: {}
};
function getHeadings$w() {
  return [];
}
function _createMdxContent$v(props) {
  return createVNode(Fragment, {});
}
function MDXContent$v(props = {}) {
  return createVNode(MDXLayout$u, {
    ...props,
    children: createVNode(_createMdxContent$v, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$w, "astro:jsx");
__astro_tag_component__(MDXContent$v, "astro:jsx");
const url$w = "/canva/find-brand-colors-alternative";
const file$w = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/find-brand-colors-alternative.mdx";
function rawContent$w() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$w() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$w = (props = {}) => MDXContent$v({
											...props,
											components: { Fragment, ...props.components },
										});
Content$w[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$w.layout);

const _page7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$w,
  _internal: _internal$w,
  getHeadings: getHeadings$w,
  url: url$w,
  file: file$w,
  rawContent: rawContent$w,
  compiledContent: compiledContent$w,
  Content: Content$w,
  default: Content$w
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$t = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$v;
  content.file = file$v;
  content.url = url$v;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$v,
    url: url$v,
    content,
    frontmatter: content,
    headings: getHeadings$v(),
    "server:root": true,
    children
  });
};
const frontmatter$v = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "Replace shape and keep style",
  "source": "ME",
  "canva-design": "https://www.canva.com/design/DAFVdquE_K8/tnzsrqWAQ9ND9i3vXYMSsA/edit"
};
const _internal$v = {
  injectedFrontmatter: {}
};
function getHeadings$v() {
  return [];
}
function _createMdxContent$u(props) {
  return createVNode(Fragment, {});
}
function MDXContent$u(props = {}) {
  return createVNode(MDXLayout$t, {
    ...props,
    children: createVNode(_createMdxContent$u, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$v, "astro:jsx");
__astro_tag_component__(MDXContent$u, "astro:jsx");
const url$v = "/canva/replace-shape-and-keep-style";
const file$v = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/replace-shape-and-keep-style.mdx";
function rawContent$v() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$v() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$v = (props = {}) => MDXContent$u({
											...props,
											components: { Fragment, ...props.components },
										});
Content$v[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$v.layout);

const _page8 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$v,
  _internal: _internal$v,
  getHeadings: getHeadings$v,
  url: url$v,
  file: file$v,
  rawContent: rawContent$v,
  compiledContent: compiledContent$v,
  Content: Content$v,
  default: Content$v
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$s = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$u;
  content.file = file$u;
  content.url = url$u;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$u,
    url: url$u,
    content,
    frontmatter: content,
    headings: getHeadings$u(),
    "server:root": true,
    children
  });
};
const frontmatter$u = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "Selecting Concealed Layers",
  "source": "https://youtu.be/_XOWhA1dK7Y?t=31",
  "canva-design": "https://www.canva.com/design/DAFU9yn2Y2I/SlykqkmP1ewJCtaD8wfmcA/edit"
};
const _internal$u = {
  injectedFrontmatter: {}
};
function getHeadings$u() {
  return [{
    "depth": 2,
    "slug": "to-cycle-through-layered-elements",
    "text": "To cycle through layered elements"
  }, {
    "depth": 2,
    "slug": "to-move-the-layer-forward-or-backward",
    "text": "To move the layer forward or backward"
  }];
}
function _createMdxContent$t(props) {
  const _components = Object.assign({
    h2: "h2",
    ul: "ul",
    li: "li",
    code: "code",
    p: "p",
    a: "a"
  }, props.components);
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "to-cycle-through-layered-elements",
      children: "To cycle through layered elements"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Click on the foremost layer, then"
      }), "\n", createVNode(_components.li, {
        children: ["Hold down the ", createVNode(_components.code, {
          children: "Command"
        }), " key and click on left mouse button"]
      }), "\n"]
    }), "\n", createVNode(_components.h2, {
      id: "to-move-the-layer-forward-or-backward",
      children: "To move the layer forward or backward"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: ["Click ", createVNode(_components.code, {
          children: "command+]"
        }), " to move the layer forward"]
      }), "\n", createVNode(_components.li, {
        children: ["Click ", createVNode(_components.code, {
          children: "command+["
        }), " to move the layer backward"]
      }), "\n"]
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.a, {
        href: "https://www.canva.com/design/DAFU9yn2Y2I/SlykqkmP1ewJCtaD8wfmcA/edit",
        children: "reference"
      })
    })]
  });
}
function MDXContent$t(props = {}) {
  return createVNode(MDXLayout$s, {
    ...props,
    children: createVNode(_createMdxContent$t, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$u, "astro:jsx");
__astro_tag_component__(MDXContent$t, "astro:jsx");
const url$u = "/canva/selecting-concealed-layers";
const file$u = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/selecting-concealed-layers.mdx";
function rawContent$u() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$u() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$u = (props = {}) => MDXContent$t({
											...props,
											components: { Fragment, ...props.components },
										});
Content$u[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$u.layout);

const _page9 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$u,
  _internal: _internal$u,
  getHeadings: getHeadings$u,
  url: url$u,
  file: file$u,
  rawContent: rawContent$u,
  compiledContent: compiledContent$u,
  Content: Content$u,
  default: Content$u
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$r = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$t;
  content.file = file$t;
  content.url = url$t;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$t,
    url: url$t,
    content,
    frontmatter: content,
    headings: getHeadings$t(),
    "server:root": true,
    children
  });
};
const frontmatter$t = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "Global Search and Replace",
  "source": "https://youtu.be/F9to0ptG3aY?t=121",
  "canva-design": "https://www.canva.com/design/DAFVdCAPS2Q/U5M0M0ZcNxNON8k-vHMghQ/edit"
};
const _internal$t = {
  injectedFrontmatter: {}
};
function getHeadings$t() {
  return [];
}
function _createMdxContent$s(props) {
  return createVNode(Fragment, {});
}
function MDXContent$s(props = {}) {
  return createVNode(MDXLayout$r, {
    ...props,
    children: createVNode(_createMdxContent$s, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$t, "astro:jsx");
__astro_tag_component__(MDXContent$s, "astro:jsx");
const url$t = "/canva/global-search-and-replace";
const file$t = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/global-search-and-replace.mdx";
function rawContent$t() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$t() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$t = (props = {}) => MDXContent$s({
											...props,
											components: { Fragment, ...props.components },
										});
Content$t[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$t.layout);

const _page10 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$t,
  _internal: _internal$t,
  getHeadings: getHeadings$t,
  url: url$t,
  file: file$t,
  rawContent: rawContent$t,
  compiledContent: compiledContent$t,
  Content: Content$t,
  default: Content$t
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$q = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$s;
  content.file = file$s;
  content.url = url$s;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$s,
    url: url$s,
    content,
    frontmatter: content,
    headings: getHeadings$s(),
    "server:root": true,
    children
  });
};
const frontmatter$s = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "Background Image Remover",
  "source": "https://www.youtube.com/watch?v=_XOWhA1dK7Y",
  "canva-design": "https://www.canva.com/design/DAFVQhUlY24/vUov8brSIYba-PLyM9SMzw/edit"
};
const _internal$s = {
  injectedFrontmatter: {}
};
function getHeadings$s() {
  return [{
    "depth": 2,
    "slug": "steps",
    "text": "Steps"
  }];
}
function _createMdxContent$r(props) {
  const _components = Object.assign({
    h2: "h2",
    ul: "ul",
    li: "li",
    code: "code"
  }, props.components);
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "steps",
      children: "Steps"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Drag image onto the design"
      }), "\n", createVNode(_components.li, {
        children: ["Click on ", createVNode(_components.code, {
          children: "Edit Image"
        })]
      }), "\n", createVNode(_components.li, {
        children: ["Click on the ", createVNode(_components.code, {
          children: "Background Image Remover"
        }), " icon"]
      }), "\n"]
    })]
  });
}
function MDXContent$r(props = {}) {
  return createVNode(MDXLayout$q, {
    ...props,
    children: createVNode(_createMdxContent$r, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$s, "astro:jsx");
__astro_tag_component__(MDXContent$r, "astro:jsx");
const url$s = "/canva/background-image-remover";
const file$s = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/background-image-remover.mdx";
function rawContent$s() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$s() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$s = (props = {}) => MDXContent$r({
											...props,
											components: { Fragment, ...props.components },
										});
Content$s[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$s.layout);

const _page11 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$s,
  _internal: _internal$s,
  getHeadings: getHeadings$s,
  url: url$s,
  file: file$s,
  rawContent: rawContent$s,
  compiledContent: compiledContent$s,
  Content: Content$s,
  default: Content$s
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$p = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$r;
  content.file = file$r;
  content.url = url$r;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$r,
    url: url$r,
    content,
    frontmatter: content,
    headings: getHeadings$r(),
    "server:root": true,
    children
  });
};
const frontmatter$r = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "Quick Flow for Mind Maps",
  "source": "https://www.youtube.com/watch?v=LHnmRoGi8pQ&t=35s",
  "canva-design": "https://www.canva.com/design/DAFV0YB48pk/Osu9gGtF5l5PuiHg0CjqQw/edit"
};
const _internal$r = {
  injectedFrontmatter: {}
};
function getHeadings$r() {
  return [];
}
function _createMdxContent$q(props) {
  return createVNode(Fragment, {});
}
function MDXContent$q(props = {}) {
  return createVNode(MDXLayout$p, {
    ...props,
    children: createVNode(_createMdxContent$q, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$r, "astro:jsx");
__astro_tag_component__(MDXContent$q, "astro:jsx");
const url$r = "/canva/quick-flow-for-mind-maps";
const file$r = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/quick-flow-for-mind-maps.mdx";
function rawContent$r() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$r() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$r = (props = {}) => MDXContent$q({
											...props,
											components: { Fragment, ...props.components },
										});
Content$r[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$r.layout);

const _page12 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$r,
  _internal: _internal$r,
  getHeadings: getHeadings$r,
  url: url$r,
  file: file$r,
  rawContent: rawContent$r,
  compiledContent: compiledContent$r,
  Content: Content$r,
  default: Content$r
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$o = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$q;
  content.file = file$q;
  content.url = url$q;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$q,
    url: url$q,
    content,
    frontmatter: content,
    headings: getHeadings$q(),
    "server:root": true,
    children
  });
};
const frontmatter$q = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "Shape Border / Rounding",
  "source": "https://youtu.be/F9to0ptG3aY?t=261",
  "canva-design": "https://www.canva.com/design/DAFVdi6sEdE/NiTE62oMnj6KbIL94XkI1g/edit"
};
const _internal$q = {
  injectedFrontmatter: {}
};
function getHeadings$q() {
  return [];
}
function _createMdxContent$p(props) {
  return createVNode(Fragment, {});
}
function MDXContent$p(props = {}) {
  return createVNode(MDXLayout$o, {
    ...props,
    children: createVNode(_createMdxContent$p, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$q, "astro:jsx");
__astro_tag_component__(MDXContent$p, "astro:jsx");
const url$q = "/canva/shape-border-rounding";
const file$q = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/shape-border-rounding.mdx";
function rawContent$q() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$q() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$q = (props = {}) => MDXContent$p({
											...props,
											components: { Fragment, ...props.components },
										});
Content$q[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$q.layout);

const _page13 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$q,
  _internal: _internal$q,
  getHeadings: getHeadings$q,
  url: url$q,
  file: file$q,
  rawContent: rawContent$q,
  compiledContent: compiledContent$q,
  Content: Content$q,
  default: Content$q
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$n = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$p;
  content.file = file$p;
  content.url = url$p;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$p,
    url: url$p,
    content,
    frontmatter: content,
    headings: getHeadings$p(),
    "server:root": true,
    children
  });
};
const frontmatter$p = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "Add curves to shapes",
  "source": "ME",
  "canva-design": "https://www.canva.com/design/DAFVdhggkfg/uVVGDD9wtb2kFhxod5xQ8g/edit"
};
const _internal$p = {
  injectedFrontmatter: {}
};
function getHeadings$p() {
  return [];
}
function _createMdxContent$o(props) {
  return createVNode(Fragment, {});
}
function MDXContent$o(props = {}) {
  return createVNode(MDXLayout$n, {
    ...props,
    children: createVNode(_createMdxContent$o, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$p, "astro:jsx");
__astro_tag_component__(MDXContent$o, "astro:jsx");
const url$p = "/canva/add-curves-to-shapes";
const file$p = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/add-curves-to-shapes.mdx";
function rawContent$p() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$p() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$p = (props = {}) => MDXContent$o({
											...props,
											components: { Fragment, ...props.components },
										});
Content$p[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$p.layout);

const _page14 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$p,
  _internal: _internal$p,
  getHeadings: getHeadings$p,
  url: url$p,
  file: file$p,
  rawContent: rawContent$p,
  compiledContent: compiledContent$p,
  Content: Content$p,
  default: Content$p
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$m = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$o;
  content.file = file$o;
  content.url = url$o;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$o,
    url: url$o,
    content,
    frontmatter: content,
    headings: getHeadings$o(),
    "server:root": true,
    children
  });
};
const frontmatter$o = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "Adding a Gradient Background",
  "source": "https://www.youtube.com/watch?v=_XOWhA1dK7Y",
  "canva-design": "https://www.canva.com/design/DAFU-aSwYnY/xh5b1FUNaYI43i0LHwvmzQ/edit"
};
const _internal$o = {
  injectedFrontmatter: {}
};
function getHeadings$o() {
  return [{
    "depth": 2,
    "slug": "steps",
    "text": "Steps"
  }];
}
function _createMdxContent$n(props) {
  const _components = Object.assign({
    h2: "h2",
    ul: "ul",
    li: "li",
    code: "code"
  }, props.components);
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "steps",
      children: "Steps"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Select elements"
      }), "\n", createVNode(_components.li, {
        children: ["Search for ", createVNode(_components.code, {
          children: "gradient"
        })]
      }), "\n", createVNode(_components.li, {
        children: "Select horizontal gradient"
      }), "\n", createVNode(_components.li, {
        children: "Select start and end colors"
      }), "\n", createVNode(_components.li, {
        children: "Drag the gradient to cover the entire background"
      }), "\n"]
    })]
  });
}
function MDXContent$n(props = {}) {
  return createVNode(MDXLayout$m, {
    ...props,
    children: createVNode(_createMdxContent$n, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$o, "astro:jsx");
__astro_tag_component__(MDXContent$n, "astro:jsx");
const url$o = "/canva/gradient-backgrounds";
const file$o = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/gradient-backgrounds.mdx";
function rawContent$o() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$o() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$o = (props = {}) => MDXContent$n({
											...props,
											components: { Fragment, ...props.components },
										});
Content$o[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$o.layout);

const _page15 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$o,
  _internal: _internal$o,
  getHeadings: getHeadings$o,
  url: url$o,
  file: file$o,
  rawContent: rawContent$o,
  compiledContent: compiledContent$o,
  Content: Content$o,
  default: Content$o
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$l = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$n;
  content.file = file$n;
  content.url = url$n;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$n,
    url: url$n,
    content,
    frontmatter: content,
    headings: getHeadings$n(),
    "server:root": true,
    children
  });
};
const frontmatter$n = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "Send Design To Phone",
  "source": "https://youtu.be/F9to0ptG3aY?t=22",
  "canva-design": "https://www.canva.com/design/DAFVcXrF898/vt4p3IqETL58nEXAqJ9MkA/edit"
};
const _internal$n = {
  injectedFrontmatter: {}
};
function getHeadings$n() {
  return [];
}
function _createMdxContent$m(props) {
  return createVNode(Fragment, {});
}
function MDXContent$m(props = {}) {
  return createVNode(MDXLayout$l, {
    ...props,
    children: createVNode(_createMdxContent$m, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$n, "astro:jsx");
__astro_tag_component__(MDXContent$m, "astro:jsx");
const url$n = "/canva/send-design-to-phone";
const file$n = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/send-design-to-phone.mdx";
function rawContent$n() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$n() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$n = (props = {}) => MDXContent$m({
											...props,
											components: { Fragment, ...props.components },
										});
Content$n[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$n.layout);

const _page16 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$n,
  _internal: _internal$n,
  getHeadings: getHeadings$n,
  url: url$n,
  file: file$n,
  rawContent: rawContent$n,
  compiledContent: compiledContent$n,
  Content: Content$n,
  default: Content$n
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$k = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$m;
  content.file = file$m;
  content.url = url$m;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$m,
    url: url$m,
    content,
    frontmatter: content,
    headings: getHeadings$m(),
    "server:root": true,
    children
  });
};
const frontmatter$m = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "Faster Image Upload",
  "source": "https://youtu.be/_XOWhA1dK7Y?t=264",
  "canva-design": "https://www.canva.com/design/DAFVD_b2FNA/4xz8uzJqB9pG6GJZ2DtEwA/edit"
};
const _internal$m = {
  injectedFrontmatter: {}
};
function getHeadings$m() {
  return [{
    "depth": 2,
    "slug": "using-the-upload-icon",
    "text": "Using the upload icon"
  }, {
    "depth": 2,
    "slug": "drag-and-drop-method",
    "text": "Drag and drop method"
  }];
}
function _createMdxContent$l(props) {
  const _components = Object.assign({
    h2: "h2",
    ul: "ul",
    li: "li",
    code: "code"
  }, props.components);
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "using-the-upload-icon",
      children: "Using the upload icon"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Click Uploads"
      }), "\n", createVNode(_components.li, {
        children: ["Click on the ", createVNode(_components.code, {
          children: "Upload files"
        }), " icon"]
      }), "\n", createVNode(_components.li, {
        children: "Select images"
      }), "\n"]
    }), "\n", createVNode(_components.h2, {
      id: "drag-and-drop-method",
      children: "Drag and drop method"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Open finder"
      }), "\n", createVNode(_components.li, {
        children: "Select images"
      }), "\n", createVNode(_components.li, {
        children: "Drag and drop images into the browser"
      }), "\n"]
    })]
  });
}
function MDXContent$l(props = {}) {
  return createVNode(MDXLayout$k, {
    ...props,
    children: createVNode(_createMdxContent$l, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$m, "astro:jsx");
__astro_tag_component__(MDXContent$l, "astro:jsx");
const url$m = "/canva/faster-image-upload";
const file$m = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/faster-image-upload.mdx";
function rawContent$m() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$m() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$m = (props = {}) => MDXContent$l({
											...props,
											components: { Fragment, ...props.components },
										});
Content$m[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$m.layout);

const _page17 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$m,
  _internal: _internal$m,
  getHeadings: getHeadings$m,
  url: url$m,
  file: file$m,
  rawContent: rawContent$m,
  compiledContent: compiledContent$m,
  Content: Content$m,
  default: Content$m
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$j = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$l;
  content.file = file$l;
  content.url = url$l;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$l,
    url: url$l,
    content,
    frontmatter: content,
    headings: getHeadings$l(),
    "server:root": true,
    children
  });
};
const frontmatter$l = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "Changing the design name",
  "source": "Me",
  "canva-design": "https://www.canva.com/design/DAFU-NRWu_I/Q5AWcxR3Zp-XbB0GJBLICg/edit"
};
const _internal$l = {
  injectedFrontmatter: {}
};
function getHeadings$l() {
  return [{
    "depth": 2,
    "slug": "three-techniques",
    "text": "Three techniques"
  }];
}
function _createMdxContent$k(props) {
  const _components = Object.assign({
    h2: "h2",
    p: "p",
    ol: "ol",
    li: "li"
  }, props.components);
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "three-techniques",
      children: "Three techniques"
    }), "\n", createVNode(_components.p, {
      children: "There are different ways to change the design name."
    }), "\n", createVNode(_components.ol, {
      children: ["\n", createVNode(_components.li, {
        children: "Click the \u2018Edit\u2019 icon below the design thumbnail"
      }), "\n"]
    }), "\n", createVNode(_components.p, {
      children: "Edit the design name"
    }), "\n", createVNode(_components.ol, {
      start: "2",
      children: ["\n", createVNode(_components.li, {
        children: "Click the \u2019\u2026\u2019 icon at top of the design thumbnail"
      }), "\n"]
    }), "\n", createVNode(_components.p, {
      children: "Edit the design name"
    }), "\n", createVNode(_components.ol, {
      start: "3",
      children: ["\n", createVNode(_components.li, {
        children: "Click on the thumbnail to open design"
      }), "\n"]
    }), "\n", createVNode(_components.p, {
      children: "Click on the design name in the top right area just to the left of your profile picture"
    }), "\n", createVNode(_components.p, {
      children: "Edit the design name"
    })]
  });
}
function MDXContent$k(props = {}) {
  return createVNode(MDXLayout$j, {
    ...props,
    children: createVNode(_createMdxContent$k, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$l, "astro:jsx");
__astro_tag_component__(MDXContent$k, "astro:jsx");
const url$l = "/canva/change-design-name";
const file$l = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/change-design-name.mdx";
function rawContent$l() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$l() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$l = (props = {}) => MDXContent$k({
											...props,
											components: { Fragment, ...props.components },
										});
Content$l[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$l.layout);

const _page18 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$l,
  _internal: _internal$l,
  getHeadings: getHeadings$l,
  url: url$l,
  file: file$l,
  rawContent: rawContent$l,
  compiledContent: compiledContent$l,
  Content: Content$l,
  default: Content$l
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$i = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$k;
  content.file = file$k;
  content.url = url$k;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$k,
    url: url$k,
    content,
    frontmatter: content,
    headings: getHeadings$k(),
    "server:root": true,
    children
  });
};
const frontmatter$k = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "Easily Duplicate Elements",
  "source": "https://youtu.be/_XOWhA1dK7Y?t=328",
  "canva-design": "https://www.canva.com/design/DAFVECCOgUs/en7mVLvKCnhIPJmYtl53yg/edit"
};
const _internal$k = {
  injectedFrontmatter: {}
};
function getHeadings$k() {
  return [{
    "depth": 2,
    "slug": "use-the-duplicate-icon",
    "text": "Use the Duplicate icon"
  }, {
    "depth": 2,
    "slug": "use-keyboard-shortcut",
    "text": "Use keyboard shortcut"
  }, {
    "depth": 2,
    "slug": "use-mouse-shortcut",
    "text": "Use mouse shortcut"
  }];
}
function _createMdxContent$j(props) {
  const _components = Object.assign({
    h2: "h2",
    code: "code",
    ul: "ul",
    li: "li"
  }, props.components);
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "use-the-duplicate-icon",
      children: ["Use the ", createVNode(_components.code, {
        children: "Duplicate"
      }), " icon"]
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Select image"
      }), "\n", createVNode(_components.li, {
        children: ["Click on the ", createVNode(_components.code, {
          children: "Duplicate"
        }), " icon"]
      }), "\n"]
    }), "\n", createVNode(_components.h2, {
      id: "use-keyboard-shortcut",
      children: "Use keyboard shortcut"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Select image"
      }), "\n", createVNode(_components.li, {
        children: ["Press the ", createVNode(_components.code, {
          children: "Command+D"
        }), " key (my favorite)"]
      }), "\n"]
    }), "\n", createVNode(_components.h2, {
      id: "use-mouse-shortcut",
      children: "Use mouse shortcut"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Select image"
      }), "\n", createVNode(_components.li, {
        children: ["Click ", createVNode(_components.code, {
          children: "Option + Drag"
        }), " to duplicate the image"]
      }), "\n"]
    })]
  });
}
function MDXContent$j(props = {}) {
  return createVNode(MDXLayout$i, {
    ...props,
    children: createVNode(_createMdxContent$j, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$k, "astro:jsx");
__astro_tag_component__(MDXContent$j, "astro:jsx");
const url$k = "/canva/duplicate-elements";
const file$k = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/duplicate-elements.mdx";
function rawContent$k() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$k() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$k = (props = {}) => MDXContent$j({
											...props,
											components: { Fragment, ...props.components },
										});
Content$k[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$k.layout);

const _page19 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$k,
  _internal: _internal$k,
  getHeadings: getHeadings$k,
  url: url$k,
  file: file$k,
  rawContent: rawContent$k,
  compiledContent: compiledContent$k,
  Content: Content$k,
  default: Content$k
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$h = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$j;
  content.file = file$j;
  content.url = url$j;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$j,
    url: url$j,
    content,
    frontmatter: content,
    headings: getHeadings$j(),
    "server:root": true,
    children
  });
};
const frontmatter$j = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "Hyperlink Text in PDFs",
  "source": "https://youtu.be/_XOWhA1dK7Y?t=503",
  "canva-design": "https://www.canva.com/design/DAFVKk2qjR8/qct0JbhFwCw4H-qBvn7CBw/edit"
};
const _internal$j = {
  injectedFrontmatter: {}
};
function getHeadings$j() {
  return [{
    "depth": 2,
    "slug": "using-keyboard-shortcuts",
    "text": "Using keyboard shortcuts"
  }, {
    "depth": 2,
    "slug": "using-the-ui-controls",
    "text": "Using the UI controls"
  }, {
    "depth": 2,
    "slug": "save-the-document-as-a-pdf",
    "text": "Save the document as a PDF"
  }];
}
function _createMdxContent$i(props) {
  const _components = Object.assign({
    h2: "h2",
    ul: "ul",
    li: "li",
    code: "code"
  }, props.components);
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "using-keyboard-shortcuts",
      children: "Using keyboard shortcuts"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Select text for hyperlink"
      }), "\n", createVNode(_components.li, {
        children: ["Press the ", createVNode(_components.code, {
          children: "Command + K"
        }), " key"]
      }), "\n"]
    }), "\n", createVNode(_components.h2, {
      id: "using-the-ui-controls",
      children: "Using the UI controls"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: ["Right click on the text and select ", createVNode(_components.code, {
          children: "Link"
        })]
      }), "\n", createVNode(_components.li, {
        children: "Enter the URL"
      }), "\n", createVNode(_components.li, {
        children: ["Click ", createVNode(_components.code, {
          children: "Apply"
        })]
      }), "\n"]
    }), "\n", createVNode(_components.h2, {
      id: "save-the-document-as-a-pdf",
      children: "Save the document as a PDF"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Save the document as a PDF"
      }), "\n", createVNode(_components.li, {
        children: "Open the PDF"
      }), "\n", createVNode(_components.li, {
        children: "Click on the hyperlink"
      }), "\n"]
    })]
  });
}
function MDXContent$i(props = {}) {
  return createVNode(MDXLayout$h, {
    ...props,
    children: createVNode(_createMdxContent$i, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$j, "astro:jsx");
__astro_tag_component__(MDXContent$i, "astro:jsx");
const url$j = "/canva/pdf-hyperlink-text";
const file$j = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/pdf-hyperlink-text.mdx";
function rawContent$j() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$j() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$j = (props = {}) => MDXContent$i({
											...props,
											components: { Fragment, ...props.components },
										});
Content$j[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$j.layout);

const _page20 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$j,
  _internal: _internal$j,
  getHeadings: getHeadings$j,
  url: url$j,
  file: file$j,
  rawContent: rawContent$j,
  compiledContent: compiledContent$j,
  Content: Content$j,
  default: Content$j
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$g = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$i;
  content.file = file$i;
  content.url = url$i;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$i,
    url: url$i,
    content,
    frontmatter: content,
    headings: getHeadings$i(),
    "server:root": true,
    children
  });
};
const frontmatter$i = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "Bulk Image Delete",
  "source": null,
  "canva-design": "https://www.canva.com/design/DAFVEBrnBL0/-zdAQOFzSBQJO1jBhhGcmg/edit"
};
const _internal$i = {
  injectedFrontmatter: {}
};
function getHeadings$i() {
  return [{
    "depth": 2,
    "slug": "steps",
    "text": "Steps"
  }];
}
function _createMdxContent$h(props) {
  const _components = Object.assign({
    h2: "h2",
    ul: "ul",
    li: "li",
    code: "code"
  }, props.components);
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "steps",
      children: "Steps"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Click Uploads"
      }), "\n", createVNode(_components.li, {
        children: ["Click on a ", createVNode(_components.code, {
          children: "Check box"
        }), " icon to get started"]
      }), "\n", createVNode(_components.li, {
        children: "Click on any additional images"
      }), "\n", createVNode(_components.li, {
        children: ["Click on the ", createVNode(_components.code, {
          children: "Trash"
        }), " icon"]
      }), "\n"]
    })]
  });
}
function MDXContent$h(props = {}) {
  return createVNode(MDXLayout$g, {
    ...props,
    children: createVNode(_createMdxContent$h, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$i, "astro:jsx");
__astro_tag_component__(MDXContent$h, "astro:jsx");
const url$i = "/canva/bulk-image-delete";
const file$i = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/bulk-image-delete.mdx";
function rawContent$i() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$i() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$i = (props = {}) => MDXContent$h({
											...props,
											components: { Fragment, ...props.components },
										});
Content$i[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$i.layout);

const _page21 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$i,
  _internal: _internal$i,
  getHeadings: getHeadings$i,
  url: url$i,
  file: file$i,
  rawContent: rawContent$i,
  compiledContent: compiledContent$i,
  Content: Content$i,
  default: Content$i
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$f = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$h;
  content.file = file$h;
  content.url = url$h;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$h,
    url: url$h,
    content,
    frontmatter: content,
    headings: getHeadings$h(),
    "server:root": true,
    children
  });
};
const frontmatter$h = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "DIY Logo Creation with Canva",
  "source": null,
  "canva-design": "https://www.canva.com/design/DAFV2NU0d5U/Ssj-1xAYqQz1oVOCJkKNlg/edit"
};
const _internal$h = {
  injectedFrontmatter: {}
};
function getHeadings$h() {
  return [{
    "depth": 2,
    "slug": "steps",
    "text": "Steps"
  }, {
    "depth": 2,
    "slug": "canva-design-canva-is-a-popular-graphic-design-platform-that-offers-a-range-of-logo-templates-and-design-tools-you-can-use-canva-for-free-but-some-features-and-elements-require-a-subscription",
    "text": "canva-design: Canva is a popular graphic design platform that offers a range of logo templates and design tools. You can use Canva for free, but some features and elements require a subscription."
  }, {
    "depth": 2,
    "slug": "steps-1",
    "text": "Steps"
  }];
}
function _createMdxContent$g(props) {
  const _components = Object.assign({
    h2: "h2",
    p: "p"
  }, props.components);
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "steps",
      children: "Steps"
    }), "\n", createVNode(_components.p, {
      children: "Format: Long Form"
    }), "\n", createVNode(_components.p, {
      children: "ChatGPT: What are 5 websites I can use for creating a logo"
    }), "\n", createVNode(_components.p, {
      children: "There are many websites that allow you to create a logo. Here are five options:"
    }), "\n", createVNode(_components.h2, {
      id: "canva-design-canva-is-a-popular-graphic-design-platform-that-offers-a-range-of-logo-templates-and-design-tools-you-can-use-canva-for-free-but-some-features-and-elements-require-a-subscription",
      children: "canva-design: Canva is a popular graphic design platform that offers a range of logo templates and design tools. You can use Canva for free, but some features and elements require a subscription."
    }), "\n", createVNode(_components.h2, {
      id: "steps-1",
      children: "Steps"
    }), "\n", createVNode(_components.p, {
      children: "Adobe Creative Cloud: Adobe Creative Cloud offers a range of professional design tools, including Illustrator, which is often used for creating logos. A subscription is required to use Adobe Creative Cloud."
    }), "\n", createVNode(_components.p, {
      children: "Logaster: Logaster is a logo design tool that allows you to create a logo using templates and customization options. There is a free version available, as well as paid options with additional features."
    }), "\n", createVNode(_components.p, {
      children: "Tailor Brands: Tailor Brands is a logo design service that uses artificial intelligence to create custom logos for businesses. The service includes a range of design options and a logo maker tool."
    }), "\n", createVNode(_components.p, {
      children: "LogoMaker: LogoMaker is a logo design tool that offers a range of templates and customization options. You can use the tool for free, but some features and elements require a paid subscription."
    }), "\n", createVNode(_components.p, {
      children: "It\u2019s important to note that while these websites can be helpful in creating a logo, it\u2019s always a good idea to work with a professional designer if you want a high-quality, professional logo. A professional designer will be able to take your vision and goals into account and create a logo that meets your specific needs."
    })]
  });
}
function MDXContent$g(props = {}) {
  return createVNode(MDXLayout$f, {
    ...props,
    children: createVNode(_createMdxContent$g, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$h, "astro:jsx");
__astro_tag_component__(MDXContent$g, "astro:jsx");
const url$h = "/canva/diy-logo-creation";
const file$h = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/diy-logo-creation.mdx";
function rawContent$h() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$h() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$h = (props = {}) => MDXContent$g({
											...props,
											components: { Fragment, ...props.components },
										});
Content$h[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$h.layout);

const _page22 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$h,
  _internal: _internal$h,
  getHeadings: getHeadings$h,
  url: url$h,
  file: file$h,
  rawContent: rawContent$h,
  compiledContent: compiledContent$h,
  Content: Content$h,
  default: Content$h
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$e = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$g;
  content.file = file$g;
  content.url = url$g;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$g,
    url: url$g,
    content,
    frontmatter: content,
    headings: getHeadings$g(),
    "server:root": true,
    children
  });
};
const frontmatter$g = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "Quickly Find Brand Colors",
  "source": "https://youtu.be/mJHGcYtay6s?t=280",
  "canva-design": "https://www.canva.com/design/DAFVcP_noj0/k29heGItEIooweAjCtV0XQ/edit"
};
const _internal$g = {
  injectedFrontmatter: {}
};
function getHeadings$g() {
  return [];
}
function _createMdxContent$f(props) {
  return createVNode(Fragment, {});
}
function MDXContent$f(props = {}) {
  return createVNode(MDXLayout$e, {
    ...props,
    children: createVNode(_createMdxContent$f, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$g, "astro:jsx");
__astro_tag_component__(MDXContent$f, "astro:jsx");
const url$g = "/canva/find-brand-colors";
const file$g = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/find-brand-colors.mdx";
function rawContent$g() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$g() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$g = (props = {}) => MDXContent$f({
											...props,
											components: { Fragment, ...props.components },
										});
Content$g[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$g.layout);

const _page23 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$g,
  _internal: _internal$g,
  getHeadings: getHeadings$g,
  url: url$g,
  file: file$g,
  rawContent: rawContent$g,
  compiledContent: compiledContent$g,
  Content: Content$g,
  default: Content$g
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$d = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$f;
  content.file = file$f;
  content.url = url$f;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$f,
    url: url$f,
    content,
    frontmatter: content,
    headings: getHeadings$f(),
    "server:root": true,
    children
  });
};
const frontmatter$f = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "Perfect Alignment",
  "source": "https://youtu.be/_XOWhA1dK7Y?t=596",
  "canva-design": "https://www.canva.com/design/DAFVQZ9liJA/o4GdNIJCQaBVxRNDdgIAow/edit"
};
const _internal$f = {
  injectedFrontmatter: {}
};
function getHeadings$f() {
  return [{
    "depth": 2,
    "slug": "using-the-alignment-controls",
    "text": "Using the alignment controls"
  }, {
    "depth": 2,
    "slug": "using-rulers",
    "text": "Using rulers"
  }];
}
function _createMdxContent$e(props) {
  const _components = Object.assign({
    h2: "h2",
    ul: "ul",
    li: "li",
    code: "code"
  }, props.components);
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "using-the-alignment-controls",
      children: "Using the alignment controls"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Click on element"
      }), "\n", createVNode(_components.li, {
        children: ["Click on the ", createVNode(_components.code, {
          children: "Position"
        }), " menu"]
      }), "\n", createVNode(_components.li, {
        children: "Click on the type of alignment you want"
      }), "\n"]
    }), "\n", createVNode(_components.h2, {
      id: "using-rulers",
      children: "Using rulers"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: ["Click on ", createVNode(_components.code, {
          children: "File"
        }), " > ", createVNode(_components.code, {
          children: "View Settings"
        }), " > ", createVNode(_components.code, {
          children: "Show rulers and guides"
        })]
      }), "\n", createVNode(_components.li, {
        children: "Drag rulers horizontally or vertically to create guides"
      }), "\n", createVNode(_components.li, {
        children: "Drag elements to align them with guides"
      }), "\n"]
    })]
  });
}
function MDXContent$e(props = {}) {
  return createVNode(MDXLayout$d, {
    ...props,
    children: createVNode(_createMdxContent$e, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$f, "astro:jsx");
__astro_tag_component__(MDXContent$e, "astro:jsx");
const url$f = "/canva/perfect-alignment";
const file$f = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/perfect-alignment.mdx";
function rawContent$f() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$f() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$f = (props = {}) => MDXContent$e({
											...props,
											components: { Fragment, ...props.components },
										});
Content$f[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$f.layout);

const _page24 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$f,
  _internal: _internal$f,
  getHeadings: getHeadings$f,
  url: url$f,
  file: file$f,
  rawContent: rawContent$f,
  compiledContent: compiledContent$f,
  Content: Content$f,
  default: Content$f
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$c = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$e;
  content.file = file$e;
  content.url = url$e;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$e,
    url: url$e,
    content,
    frontmatter: content,
    headings: getHeadings$e(),
    "server:root": true,
    children
  });
};
const frontmatter$e = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "Element Cropping",
  "source": "https://www.youtube.com/watch?v=_XOWhA1dK7Y",
  "canva-design": "https://www.canva.com/design/DAFVKNOwIOY/BMGFE72DQgOFC0S7QJBuTg/edit"
};
const _internal$e = {
  injectedFrontmatter: {}
};
function getHeadings$e() {
  return [{
    "depth": 2,
    "slug": "steps",
    "text": "Steps"
  }];
}
function _createMdxContent$d(props) {
  const _components = Object.assign({
    h2: "h2",
    ul: "ul",
    li: "li",
    code: "code"
  }, props.components);
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "steps",
      children: "Steps"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Select an element"
      }), "\n", createVNode(_components.li, {
        children: ["Click on the ", createVNode(_components.code, {
          children: "Crop"
        }), " icon"]
      }), "\n", createVNode(_components.li, {
        children: "Drag the crop handles to crop the element"
      }), "\n"]
    })]
  });
}
function MDXContent$d(props = {}) {
  return createVNode(MDXLayout$c, {
    ...props,
    children: createVNode(_createMdxContent$d, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$e, "astro:jsx");
__astro_tag_component__(MDXContent$d, "astro:jsx");
const url$e = "/canva/element-cropping";
const file$e = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/element-cropping.mdx";
function rawContent$e() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$e() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$e = (props = {}) => MDXContent$d({
											...props,
											components: { Fragment, ...props.components },
										});
Content$e[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$e.layout);

const _page25 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$e,
  _internal: _internal$e,
  getHeadings: getHeadings$e,
  url: url$e,
  file: file$e,
  rawContent: rawContent$e,
  compiledContent: compiledContent$e,
  Content: Content$e,
  default: Content$e
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$b = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$d;
  content.file = file$d;
  content.url = url$d;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$d,
    url: url$d,
    content,
    frontmatter: content,
    headings: getHeadings$d(),
    "server:root": true,
    children
  });
};
const frontmatter$d = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "Element Grouping",
  "source": "https://youtu.be/_XOWhA1dK7Y?t=390",
  "canva-design": "https://www.canva.com/design/DAEZd0LSZNE/8b3VQzYZKcmnnLLQb9WGiw/edit"
};
const _internal$d = {
  injectedFrontmatter: {}
};
function getHeadings$d() {
  return [{
    "depth": 2,
    "slug": "steps",
    "text": "Steps"
  }];
}
function _createMdxContent$c(props) {
  const _components = Object.assign({
    h2: "h2",
    ul: "ul",
    li: "li",
    code: "code"
  }, props.components);
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "steps",
      children: "Steps"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Click on an element"
      }), "\n", createVNode(_components.li, {
        children: "Shift + Click on additional elements"
      }), "\n", createVNode(_components.li, {
        children: ["Click on the ", createVNode(_components.code, {
          children: "Group"
        }), " icon to group them together"]
      }), "\n", createVNode(_components.li, {
        children: ["Click on the ", createVNode(_components.code, {
          children: "Ungroup"
        }), " icon to ungroup them"]
      }), "\n"]
    })]
  });
}
function MDXContent$c(props = {}) {
  return createVNode(MDXLayout$b, {
    ...props,
    children: createVNode(_createMdxContent$c, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$d, "astro:jsx");
__astro_tag_component__(MDXContent$c, "astro:jsx");
const url$d = "/canva/element-grouping";
const file$d = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/element-grouping.mdx";
function rawContent$d() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$d() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$d = (props = {}) => MDXContent$c({
											...props,
											components: { Fragment, ...props.components },
										});
Content$d[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$d.layout);

const _page26 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$d,
  _internal: _internal$d,
  getHeadings: getHeadings$d,
  url: url$d,
  file: file$d,
  rawContent: rawContent$d,
  compiledContent: compiledContent$d,
  Content: Content$d,
  default: Content$d
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$a = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$c;
  content.file = file$c;
  content.url = url$c;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$c,
    url: url$c,
    content,
    frontmatter: content,
    headings: getHeadings$c(),
    "server:root": true,
    children
  });
};
const frontmatter$c = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "10 Text Effects",
  "source": "https://www.youtube.com/watch?v=udhA3ILoNCs",
  "canva-design": "https://www.canva.com/design/DAFVXw9kGIY/YLDxTjT50v9afwm84GSPEQ/edit#"
};
const _internal$c = {
  injectedFrontmatter: {}
};
function getHeadings$c() {
  return [{
    "depth": 2,
    "slug": "todo-12-text-effects",
    "text": "TODO (12 text effects)"
  }];
}
function _createMdxContent$b(props) {
  const _components = Object.assign({
    h2: "h2"
  }, props.components);
  return createVNode(_components.h2, {
    id: "todo-12-text-effects",
    children: "TODO (12 text effects)"
  });
}
function MDXContent$b(props = {}) {
  return createVNode(MDXLayout$a, {
    ...props,
    children: createVNode(_createMdxContent$b, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$c, "astro:jsx");
__astro_tag_component__(MDXContent$b, "astro:jsx");
const url$c = "/canva/10-text-effects";
const file$c = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/10-text-effects.mdx";
function rawContent$c() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$c() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$c = (props = {}) => MDXContent$b({
											...props,
											components: { Fragment, ...props.components },
										});
Content$c[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$c.layout);

const _page27 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$c,
  _internal: _internal$c,
  getHeadings: getHeadings$c,
  url: url$c,
  file: file$c,
  rawContent: rawContent$c,
  compiledContent: compiledContent$c,
  Content: Content$c,
  default: Content$c
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$9 = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$b;
  content.file = file$b;
  content.url = url$b;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$b,
    url: url$b,
    content,
    frontmatter: content,
    headings: getHeadings$b(),
    "server:root": true,
    children
  });
};
const frontmatter$b = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "Filter elements",
  "source": "https://youtu.be/_XOWhA1dK7Y?t=479",
  "canva-design": "https://www.canva.com/design/DAFVKiv7nsc/-LLBvSc-55e9-rNJ_CEmbw/edit#"
};
const _internal$b = {
  injectedFrontmatter: {}
};
function getHeadings$b() {
  return [{
    "depth": 2,
    "slug": "steps",
    "text": "Steps"
  }];
}
function _createMdxContent$a(props) {
  const _components = Object.assign({
    h2: "h2",
    ul: "ul",
    li: "li"
  }, props.components);
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "steps",
      children: "Steps"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Select elements"
      }), "\n", createVNode(_components.li, {
        children: "Search: simple background"
      }), "\n", createVNode(_components.li, {
        children: "Click on the \u2018Filter\u2019 icon"
      }), "\n", createVNode(_components.li, {
        children: "Select a color filter"
      }), "\n", createVNode(_components.li, {
        children: "Select any additional filters"
      }), "\n", createVNode(_components.li, {
        children: "Select elements"
      }), "\n", createVNode(_components.li, {
        children: "Search: people"
      }), "\n", createVNode(_components.li, {
        children: "Select a complimentary color"
      }), "\n"]
    })]
  });
}
function MDXContent$a(props = {}) {
  return createVNode(MDXLayout$9, {
    ...props,
    children: createVNode(_createMdxContent$a, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$b, "astro:jsx");
__astro_tag_component__(MDXContent$a, "astro:jsx");
const url$b = "/canva/filter-elements";
const file$b = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/filter-elements.mdx";
function rawContent$b() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$b() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$b = (props = {}) => MDXContent$a({
											...props,
											components: { Fragment, ...props.components },
										});
Content$b[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$b.layout);

const _page28 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$b,
  _internal: _internal$b,
  getHeadings: getHeadings$b,
  url: url$b,
  file: file$b,
  rawContent: rawContent$b,
  compiledContent: compiledContent$b,
  Content: Content$b,
  default: Content$b
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$8 = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$a;
  content.file = file$a;
  content.url = url$a;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$a,
    url: url$a,
    content,
    frontmatter: content,
    headings: getHeadings$a(),
    "server:root": true,
    children
  });
};
const frontmatter$a = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "Moving elements",
  "source": "https://youtu.be/_XOWhA1dK7Y?t=174",
  "canva-design": "https://www.canva.com/design/DAFU-Spve7s/Hyq5GQonnOa7Mi60fz1mEQ/edit"
};
const _internal$a = {
  injectedFrontmatter: {}
};
function getHeadings$a() {
  return [{
    "depth": 2,
    "slug": "move-elements-one-pixel-at-a-time",
    "text": "Move elements one pixel at a time"
  }, {
    "depth": 2,
    "slug": "move-elements-10-pixels-at-a-time",
    "text": "Move elements 10 pixels at a time"
  }];
}
function _createMdxContent$9(props) {
  const _components = Object.assign({
    h2: "h2",
    ul: "ul",
    li: "li",
    code: "code"
  }, props.components);
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "move-elements-one-pixel-at-a-time",
      children: "Move elements one pixel at a time"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Click on the element you want to move"
      }), "\n", createVNode(_components.li, {
        children: ["Press ", createVNode(_components.code, {
          children: "up"
        }), ", ", createVNode(_components.code, {
          children: "down"
        }), ", ", createVNode(_components.code, {
          children: "left"
        }), ", ", createVNode(_components.code, {
          children: "right"
        }), " arrow keys to move"]
      }), "\n"]
    }), "\n", createVNode(_components.h2, {
      id: "move-elements-10-pixels-at-a-time",
      children: "Move elements 10 pixels at a time"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Click on the element you want to move"
      }), "\n", createVNode(_components.li, {
        children: ["Press ", createVNode(_components.code, {
          children: "shift"
        }), " + ", createVNode(_components.code, {
          children: "up"
        }), ", ", createVNode(_components.code, {
          children: "down"
        }), ", ", createVNode(_components.code, {
          children: "left"
        }), ", ", createVNode(_components.code, {
          children: "right"
        }), " arrow keys to move"]
      }), "\n"]
    })]
  });
}
function MDXContent$9(props = {}) {
  return createVNode(MDXLayout$8, {
    ...props,
    children: createVNode(_createMdxContent$9, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$a, "astro:jsx");
__astro_tag_component__(MDXContent$9, "astro:jsx");
const url$a = "/canva/moving-elements";
const file$a = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/moving-elements.mdx";
function rawContent$a() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$a() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$a = (props = {}) => MDXContent$9({
											...props,
											components: { Fragment, ...props.components },
										});
Content$a[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$a.layout);

const _page29 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$a,
  _internal: _internal$a,
  getHeadings: getHeadings$a,
  url: url$a,
  file: file$a,
  rawContent: rawContent$a,
  compiledContent: compiledContent$a,
  Content: Content$a,
  default: Content$a
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$7 = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$9;
  content.file = file$9;
  content.url = url$9;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$9,
    url: url$9,
    content,
    frontmatter: content,
    headings: getHeadings$9(),
    "server:root": true,
    children
  });
};
const frontmatter$9 = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "How to create a reusable template in Canva",
  "source": "https://youtu.be/mJHGcYtay6s",
  "canva-design": "https://www.canva.com/design/DAFVX_jY-pc/COlGQFLMYddRk7eLQadZGQ/edit"
};
const _internal$9 = {
  injectedFrontmatter: {}
};
function getHeadings$9() {
  return [];
}
function _createMdxContent$8(props) {
  return createVNode(Fragment, {});
}
function MDXContent$8(props = {}) {
  return createVNode(MDXLayout$7, {
    ...props,
    children: createVNode(_createMdxContent$8, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$9, "astro:jsx");
__astro_tag_component__(MDXContent$8, "astro:jsx");
const url$9 = "/canva/using-templates";
const file$9 = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/using-templates.mdx";
function rawContent$9() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$9() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$9 = (props = {}) => MDXContent$8({
											...props,
											components: { Fragment, ...props.components },
										});
Content$9[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$9.layout);

const _page30 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$9,
  _internal: _internal$9,
  getHeadings: getHeadings$9,
  url: url$9,
  file: file$9,
  rawContent: rawContent$9,
  compiledContent: compiledContent$9,
  Content: Content$9,
  default: Content$9
}, Symbol.toStringTag, { value: 'Module' }));

const frontmatter$8 = {};
const _internal$8 = {
  injectedFrontmatter: {}
};
function getHeadings$8() {
  return [{
    "depth": 2,
    "slug": "add-brand-kit",
    "text": "Add Brand Kit"
  }, {
    "depth": 2,
    "slug": "layout-layoutsbaselayoutastrotitle-add-brand-kitsource-httpsyoutube_xowha1dk7yt264canva-design",
    "text": "layout: ~/layouts/BaseLayout.astro\ntitle: Add Brand Kit\nsource: https://youtu.be/_XOWhA1dK7Y?t=264\ncanva-design:"
  }];
}
function _createMdxContent$7(props) {
  const _components = Object.assign({
    h2: "h2",
    hr: "hr",
    a: "a",
    ul: "ul",
    li: "li"
  }, props.components);
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "add-brand-kit",
      children: "Add Brand Kit"
    }), "\n", createVNode(_components.hr, {}), "\n", createVNode(_components.h2, {
      id: "layout-layoutsbaselayoutastrotitle-add-brand-kitsource-httpsyoutube_xowha1dk7yt264canva-design",
      children: ["layout: ~/layouts/BaseLayout.astro\ntitle: Add Brand Kit\nsource: ", createVNode(_components.a, {
        href: "https://youtu.be/_XOWhA1dK7Y?t=264",
        children: "https://youtu.be/_XOWhA1dK7Y?t=264"
      }), "\ncanva-design:"]
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Need the Pro account to add Brand Kit"
      }), "\n"]
    })]
  });
}
function MDXContent$7(props = {}) {
  const {
    wrapper: MDXLayout
  } = props.components || {};
  return MDXLayout ? createVNode(MDXLayout, {
    ...props,
    children: createVNode(_createMdxContent$7, {
      ...props
    })
  }) : _createMdxContent$7(props);
}

__astro_tag_component__(getHeadings$8, "astro:jsx");
__astro_tag_component__(MDXContent$7, "astro:jsx");
const url$8 = "/canva/add-brand-kit";
const file$8 = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/add-brand-kit.mdx";
function rawContent$8() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$8() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$8 = (props = {}) => MDXContent$7({
											...props,
											components: { Fragment, ...props.components },
										});
Content$8[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$8.layout);

const _page31 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$8,
  _internal: _internal$8,
  getHeadings: getHeadings$8,
  url: url$8,
  file: file$8,
  rawContent: rawContent$8,
  compiledContent: compiledContent$8,
  Content: Content$8,
  default: Content$8
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$6 = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$7;
  content.file = file$7;
  content.url = url$7;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$7,
    url: url$7,
    content,
    frontmatter: content,
    headings: getHeadings$7(),
    "server:root": true,
    children
  });
};
const frontmatter$7 = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "Shadow Effect",
  "source": "https://youtu.be/_XOWhA1dK7Y?t=151",
  "canva-design": "https://www.canva.com/design/DAFU-NRWu_I/Q5AWcxR3Zp-XbB0GJBLICg/edit"
};
const _internal$7 = {
  injectedFrontmatter: {}
};
function getHeadings$7() {
  return [{
    "depth": 2,
    "slug": "steps",
    "text": "Steps"
  }];
}
function _createMdxContent$6(props) {
  const _components = Object.assign({
    h2: "h2",
    ul: "ul",
    li: "li",
    p: "p",
    a: "a"
  }, props.components);
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "steps",
      children: "Steps"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Select text"
      }), "\n", createVNode(_components.li, {
        children: "Click on \u2018Effects\u2019"
      }), "\n", createVNode(_components.li, {
        children: "Click on \u2018Shadow\u2019"
      }), "\n", createVNode(_components.li, {
        children: "Alter the settings to your liking"
      }), "\n", createVNode(_components.li, {
        children: "You may also want to try \u2018Lift\u2019 or one of the other effects"
      }), "\n"]
    }), "\n", createVNode(_components.p, {
      children: createVNode(_components.a, {
        href: "https://www.canva.com/design/DAFU-NRWu_I/Q5AWcxR3Zp-XbB0GJBLICg/edit",
        children: "reference"
      })
    })]
  });
}
function MDXContent$6(props = {}) {
  return createVNode(MDXLayout$6, {
    ...props,
    children: createVNode(_createMdxContent$6, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$7, "astro:jsx");
__astro_tag_component__(MDXContent$6, "astro:jsx");
const url$7 = "/canva/shadow-effect";
const file$7 = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/shadow-effect.mdx";
function rawContent$7() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$7() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$7 = (props = {}) => MDXContent$6({
											...props,
											components: { Fragment, ...props.components },
										});
Content$7[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$7.layout);

const _page32 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$7,
  _internal: _internal$7,
  getHeadings: getHeadings$7,
  url: url$7,
  file: file$7,
  rawContent: rawContent$7,
  compiledContent: compiledContent$7,
  Content: Content$7,
  default: Content$7
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$5 = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$6;
  content.file = file$6;
  content.url = url$6;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$6,
    url: url$6,
    content,
    frontmatter: content,
    headings: getHeadings$6(),
    "server:root": true,
    children
  });
};
const frontmatter$6 = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "Video Credits",
  "source": null,
  "canva-design": null
};
const _internal$6 = {
  injectedFrontmatter: {}
};
function getHeadings$6() {
  return [{
    "depth": 2,
    "slug": "steps",
    "text": "Steps"
  }];
}
function _createMdxContent$5(props) {
  const _components = Object.assign({
    h2: "h2",
    p: "p",
    ul: "ul",
    li: "li"
  }, props.components);
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "steps",
      children: "Steps"
    }), "\n", createVNode(_components.p, {
      children: "ChatGPT:"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: ["Presenter\n", createVNode(_components.ul, {
          children: ["\n", createVNode(_components.li, {
            children: "Captain Courageous"
          }), "\n"]
        }), "\n"]
      }), "\n", createVNode(_components.li, {
        children: ["Director\n", createVNode(_components.ul, {
          children: ["\n", createVNode(_components.li, {
            children: "Professor Picklejuice"
          }), "\n"]
        }), "\n"]
      }), "\n", createVNode(_components.li, {
        children: ["Camera Operator\n", createVNode(_components.ul, {
          children: ["\n", createVNode(_components.li, {
            children: "Gadget Genius"
          }), "\n"]
        }), "\n"]
      }), "\n", createVNode(_components.li, {
        children: ["Editor\n", createVNode(_components.ul, {
          children: ["\n", createVNode(_components.li, {
            children: "The Great Gatsby"
          }), "\n"]
        }), "\n"]
      }), "\n"]
    })]
  });
}
function MDXContent$5(props = {}) {
  return createVNode(MDXLayout$5, {
    ...props,
    children: createVNode(_createMdxContent$5, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$6, "astro:jsx");
__astro_tag_component__(MDXContent$5, "astro:jsx");
const url$6 = "/canva/video-credits";
const file$6 = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/video-credits.mdx";
function rawContent$6() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$6() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$6 = (props = {}) => MDXContent$5({
											...props,
											components: { Fragment, ...props.components },
										});
Content$6[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$6.layout);

const _page33 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$6,
  _internal: _internal$6,
  getHeadings: getHeadings$6,
  url: url$6,
  file: file$6,
  rawContent: rawContent$6,
  compiledContent: compiledContent$6,
  Content: Content$6,
  default: Content$6
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$4 = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$5;
  content.file = file$5;
  content.url = url$5;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$5,
    url: url$5,
    content,
    frontmatter: content,
    headings: getHeadings$5(),
    "server:root": true,
    children
  });
};
const frontmatter$5 = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "Easily Add New Text",
  "source": "https://youtu.be/_XOWhA1dK7Y?t=250",
  "canva-design": "https://www.canva.com/design/DAFU-vaW3IY/56gjtlwIEfouFQHLDFFLVg/edit"
};
const _internal$5 = {
  injectedFrontmatter: {}
};
function getHeadings$5() {
  return [{
    "depth": 2,
    "slug": "steps",
    "text": "Steps"
  }];
}
function _createMdxContent$4(props) {
  const _components = Object.assign({
    h2: "h2",
    ul: "ul",
    li: "li",
    code: "code"
  }, props.components);
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "steps",
      children: "Steps"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: ["Press the ", createVNode(_components.code, {
          children: "T"
        }), " key to add new text"]
      }), "\n", createVNode(_components.li, {
        children: "It remembers the first font size and style that you used on the page"
      }), "\n", createVNode(_components.li, {
        children: "This can be a quick alternative to the \u2018Text Selection\u2019 tool, but with less control"
      }), "\n"]
    })]
  });
}
function MDXContent$4(props = {}) {
  return createVNode(MDXLayout$4, {
    ...props,
    children: createVNode(_createMdxContent$4, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$5, "astro:jsx");
__astro_tag_component__(MDXContent$4, "astro:jsx");
const url$5 = "/canva/add-new-text";
const file$5 = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/add-new-text.mdx";
function rawContent$5() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$5() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$5 = (props = {}) => MDXContent$4({
											...props,
											components: { Fragment, ...props.components },
										});
Content$5[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$5.layout);

const _page34 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$5,
  _internal: _internal$5,
  getHeadings: getHeadings$5,
  url: url$5,
  file: file$5,
  rawContent: rawContent$5,
  compiledContent: compiledContent$5,
  Content: Content$5,
  default: Content$5
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$3 = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$4;
  content.file = file$4;
  content.url = url$4;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$4,
    url: url$4,
    content,
    frontmatter: content,
    headings: getHeadings$4(),
    "server:root": true,
    children
  });
};
const frontmatter$4 = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "Using Video",
  "source": "https://youtu.be/mJHGcYtay6s?t=76",
  "canva-design": "https://www.canva.com/design/DAFVXw9kGIY/YLDxTjT50v9afwm84GSPEQ/edit#"
};
const _internal$4 = {
  injectedFrontmatter: {}
};
function getHeadings$4() {
  return [];
}
function _createMdxContent$3(props) {
  return createVNode(Fragment, {});
}
function MDXContent$3(props = {}) {
  return createVNode(MDXLayout$3, {
    ...props,
    children: createVNode(_createMdxContent$3, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$4, "astro:jsx");
__astro_tag_component__(MDXContent$3, "astro:jsx");
const url$4 = "/canva/using-video";
const file$4 = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/using-video.mdx";
function rawContent$4() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$4() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$4 = (props = {}) => MDXContent$3({
											...props,
											components: { Fragment, ...props.components },
										});
Content$4[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$4.layout);

const _page35 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$4,
  _internal: _internal$4,
  getHeadings: getHeadings$4,
  url: url$4,
  file: file$4,
  rawContent: rawContent$4,
  compiledContent: compiledContent$4,
  Content: Content$4,
  default: Content$4
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$2 = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$3;
  content.file = file$3;
  content.url = url$3;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$3,
    url: url$3,
    content,
    frontmatter: content,
    headings: getHeadings$3(),
    "server:root": true,
    children
  });
};
const frontmatter$3 = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "Draw in Canva",
  "source": "https://youtu.be/F9to0ptG3aY?t=168",
  "canva-design": "https://www.canva.com/design/DAFVdsqjLA8/71I2ZEIqJYIxUqA89kxnDQ/edit#"
};
const _internal$3 = {
  injectedFrontmatter: {}
};
function getHeadings$3() {
  return [];
}
function _createMdxContent$2(props) {
  return createVNode(Fragment, {});
}
function MDXContent$2(props = {}) {
  return createVNode(MDXLayout$2, {
    ...props,
    children: createVNode(_createMdxContent$2, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$3, "astro:jsx");
__astro_tag_component__(MDXContent$2, "astro:jsx");
const url$3 = "/canva/drawing";
const file$3 = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/drawing.mdx";
function rawContent$3() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$3() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$3 = (props = {}) => MDXContent$2({
											...props,
											components: { Fragment, ...props.components },
										});
Content$3[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$3.layout);

const _page36 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$3,
  _internal: _internal$3,
  getHeadings: getHeadings$3,
  url: url$3,
  file: file$3,
  rawContent: rawContent$3,
  compiledContent: compiledContent$3,
  Content: Content$3,
  default: Content$3
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout$1 = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$2;
  content.file = file$2;
  content.url = url$2;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$2,
    url: url$2,
    content,
    frontmatter: content,
    headings: getHeadings$2(),
    "server:root": true,
    children
  });
};
const frontmatter$2 = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "Faster Zooming",
  "source": "https://youtu.be/_XOWhA1dK7Y?t=361",
  "canva-design": "https://www.canva.com/design/DAEZd0LSZNE/8b3VQzYZKcmnnLLQb9WGiw/edit"
};
const _internal$2 = {
  injectedFrontmatter: {}
};
function getHeadings$2() {
  return [{
    "depth": 2,
    "slug": "use-the-zoom-controls",
    "text": "Use the zoom controls"
  }, {
    "depth": 2,
    "slug": "use-keyboard-shortcuts",
    "text": "Use keyboard shortcuts"
  }, {
    "depth": 2,
    "slug": "use-mouse-shortcuts",
    "text": "Use mouse shortcuts"
  }];
}
function _createMdxContent$1(props) {
  const _components = Object.assign({
    h2: "h2",
    ul: "ul",
    li: "li"
  }, props.components);
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "use-the-zoom-controls",
      children: "Use the zoom controls"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Use the zoom controls in the bottom right corner"
      }), "\n"]
    }), "\n", createVNode(_components.h2, {
      id: "use-keyboard-shortcuts",
      children: "Use keyboard shortcuts"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Use the \u2018Command + +\u2019 key to zoom in"
      }), "\n", createVNode(_components.li, {
        children: "Use the \u2018Command + -\u2019 key to zoom out"
      }), "\n"]
    }), "\n", createVNode(_components.h2, {
      id: "use-mouse-shortcuts",
      children: "Use mouse shortcuts"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Use the \u2018Ctrl + Zoom\u2019 key to zoom in/out"
      }), "\n"]
    })]
  });
}
function MDXContent$1(props = {}) {
  return createVNode(MDXLayout$1, {
    ...props,
    children: createVNode(_createMdxContent$1, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$2, "astro:jsx");
__astro_tag_component__(MDXContent$1, "astro:jsx");
const url$2 = "/canva/zooming";
const file$2 = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/zooming.mdx";
function rawContent$2() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$2() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$2 = (props = {}) => MDXContent$1({
											...props,
											components: { Fragment, ...props.components },
										});
Content$2[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$2.layout);

const _page37 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$2,
  _internal: _internal$2,
  getHeadings: getHeadings$2,
  url: url$2,
  file: file$2,
  rawContent: rawContent$2,
  compiledContent: compiledContent$2,
  Content: Content$2,
  default: Content$2
}, Symbol.toStringTag, { value: 'Module' }));

const MDXLayout = async function ({
  children
}) {
  const Layout = (await Promise.resolve().then(() => BaseLayout)).default;
  const {
    layout,
    ...content
  } = frontmatter$1;
  content.file = file$1;
  content.url = url$1;
  content.astro = {};
  Object.defineProperty(content.astro, "headings", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."');
    }
  });
  Object.defineProperty(content.astro, "html", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."');
    }
  });
  Object.defineProperty(content.astro, "source", {
    get() {
      throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."');
    }
  });
  return createVNode(Layout, {
    file: file$1,
    url: url$1,
    content,
    frontmatter: content,
    headings: getHeadings$1(),
    "server:root": true,
    children
  });
};
const frontmatter$1 = {
  "layout": "~/layouts/BaseLayout.astro",
  "title": "Frames",
  "source": "https://youtu.be/_XOWhA1dK7Y?t=732",
  "canva-design": "https://www.canva.com/design/DAFVXkPGkK4/TWhc1sx1wozN9y0KvCwVkw/edit"
};
const _internal$1 = {
  injectedFrontmatter: {}
};
function getHeadings$1() {
  return [{
    "depth": 2,
    "slug": "technique-1",
    "text": "Technique 1"
  }, {
    "depth": 2,
    "slug": "technique-2",
    "text": "Technique 2"
  }, {
    "depth": 2,
    "slug": "technique-3",
    "text": "Technique 3"
  }];
}
function _createMdxContent(props) {
  const _components = Object.assign({
    h2: "h2",
    ul: "ul",
    li: "li"
  }, props.components);
  return createVNode(Fragment, {
    children: [createVNode(_components.h2, {
      id: "technique-1",
      children: "Technique 1"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Click elements"
      }), "\n", createVNode(_components.li, {
        children: "Click on the \u2018Frames\u2019 icon"
      }), "\n", createVNode(_components.li, {
        children: "Select a frame"
      }), "\n"]
    }), "\n", createVNode(_components.h2, {
      id: "technique-2",
      children: "Technique 2"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Type \u2018frame + keyword\u2019 in the search bar"
      }), "\n", createVNode(_components.li, {
        children: "Select a frame"
      }), "\n"]
    }), "\n", createVNode(_components.h2, {
      id: "technique-3",
      children: "Technique 3"
    }), "\n", createVNode(_components.ul, {
      children: ["\n", createVNode(_components.li, {
        children: "Click on the \u2019\u2026\u2019 icon for a specific frame"
      }), "\n", createVNode(_components.li, {
        children: "Click on the keyword"
      }), "\n", createVNode(_components.li, {
        children: "Select a frame"
      }), "\n"]
    })]
  });
}
function MDXContent(props = {}) {
  return createVNode(MDXLayout, {
    ...props,
    children: createVNode(_createMdxContent, {
      ...props
    })
  });
}

__astro_tag_component__(getHeadings$1, "astro:jsx");
__astro_tag_component__(MDXContent, "astro:jsx");
const url$1 = "/canva/frames";
const file$1 = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/frames.mdx";
function rawContent$1() { throw new Error("MDX does not support rawContent()! If you need to read the Markdown contents to calculate values (ex. reading time), we suggest injecting frontmatter via remark plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }function compiledContent$1() { throw new Error("MDX does not support compiledContent()! If you need to read the HTML contents to calculate values (ex. reading time), we suggest injecting frontmatter via rehype plugins. Learn more on our docs: https://docs.astro.build/en/guides/integrations-guide/mdx/#inject-frontmatter-via-remark-or-rehype-plugins") }const Content$1 = (props = {}) => MDXContent({
											...props,
											components: { Fragment, ...props.components },
										});
Content$1[Symbol.for('astro.needsHeadRendering')] = !Boolean(frontmatter$1.layout);

const _page38 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  frontmatter: frontmatter$1,
  _internal: _internal$1,
  getHeadings: getHeadings$1,
  url: url$1,
  file: file$1,
  rawContent: rawContent$1,
  compiledContent: compiledContent$1,
  Content: Content$1,
  default: Content$1
}, Symbol.toStringTag, { value: 'Module' }));

const $$Astro = createAstro("/Users/davidcruwys/dev/sites/flivideo.com/src/layouts/HomeLayout.astro", "", "file:///Users/davidcruwys/dev/sites/flivideo.com/");
const $$HomeLayout = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$HomeLayout;
  const {
    title = Astro2.props.content.title || SITE.title,
    pageTitle = Astro2.props.content.pageTitle || Astro2.props.content.title || SITE.title,
    description = Astro2.props.content.description || SITE.description,
    canonicalURL = Astro2.url,
    font_awesome = SITE.font_awesome,
    site_map = SITE.site_map,
    rss_feed = SITE.rss_feed
  } = Astro2.props;
  return renderTemplate`<html lang="en" class="scroll-smooth">
${renderComponent($$result, "Head", $$Head, { "title": pageTitle, "description": description, "canonicalURL": canonicalURL, "font_awesome": font_awesome, "site_map": site_map, "rss_feed": rss_feed })}

${maybeRenderHead($$result)}<body>
  <div>
    <div class="relative h-96">
      <div class="absolute inset-0">
        <img class="h-full w-full object-cover" src="images/bg_head.jpeg" alt="">
      </div>
      <div class="relative mx-auto max-w-7xl py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 class="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">${title}</h1>
        <p class="mt-6 max-w-3xl text-xl text-gray-200">Software Architect, Fullstack / Micro App Developer and Dancer</p>
      </div>
    </div>
  </div>

  <!-- 
  Create a Tailwind CSS component of a navigation bar three menu items. The menu should be centered horizontally, there should not be any graphics, the text should be dark grey and very large, the text should be capitablized and there should be padding above and below the text.

  [insert]
  </section>
  -->

  <section class="text-center p-4">
    <div class="container mx-auto">
        <div class="flex justify-center">
            <div class="w-1/3 text-gray-800 text-2xl">
                <a href="#">Home</a>
            </div>
            <div class="w-1/3 text-gray-800 text-2xl">
                <a href="#">About</a>
            </div>
            <div class="w-1/3 text-gray-800 text-2xl">
                <a href="#">Contact</a>
            </div>
        </div>
    </div>
  </section>

  <section class="text-center">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <ul class="list-reset">
            <li class="inline-block px-4 py-2 text-2xl">Home</li>
            <li class="inline-block px-4 py-2 text-2xl">About</li>
            <li class="inline-block px-4 py-2 text-2xl">Contact</li>
          </ul>
        </div>
      </div>
    </div>
  </section> 

  <section class="text-center">
    <div class="container">
      <div class="flex justify-center">
        <div class="p-4">
          <a href="#" class="text-gray-800 text-3xl uppercase">Home</a>
        </div>
        <div class="p-4">
          <a href="#" class="text-gray-800 text-3xl uppercase">About</a>
        </div>
        <div class="p-4">
          <a href="#" class="text-gray-800 text-3xl uppercase">Contact</a>
        </div>
      </div>
    </div>
  </section>

  <!-- 
  Create a Tailwind CSS component of a pricing chart with three cards representing three plans.

  The first plan is a hobby plan worth $69 per month with 3 features.

  The 2nd plan is the small business plan worth $99 per month with 7 features.

  The third plan is for enterprises worth $169 per month with 12 features.

  The small business plan should be highlighted
  -->

  <section class="container mx-auto px-4">
    <div class="flex flex-col md:flex-row justify-between">
        <div class="w-full md:w-1/3 px-4">
            <div class="bg-white rounded-lg shadow-lg p-6">
                <h3 class="text-2xl font-bold text-gray-800 text-center">Hobby</h3>
                <div class="my-4">
                    <p class="text-gray-600 text-center">$69</p>
                    <p class="text-gray-600 text-center">per month</p>
                </div>
                <ul>
                    <li class="py-2">
                        <p class="text-gray-600 text-sm">Feature 1</p>
                    </li>
                    <li class="py-2">
                        <p class="text-gray-600 text-sm">Feature 2</p>
                    </li>
                    <li class="py-2">
                        <p class="text-gray-600 text-sm">Feature 3</p>
                    </li>
                </ul>
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-6">
                    Choose Plan
                </button>
            </div>
        </div>
        <div class="w-full md:w-1/3 px-4">
            <div class="bg-white rounded-lg shadow-lg p-6">
                <h3 class="text-2xl font-bold text-gray-800 text-center">Small Business</h3>
                <div class="my-4">
                    <p class="text-gray-600 text-center">$99</p>
                    <p class="text-gray-600 text-center">per month</p>
                </div>
                <ul>
                    <li class="py-2">
                        <p class="text-gray-600 text-sm">Feature 1</p>
                    </li>
                    <li class="py-2">
                        <p class="text-gray-600 text-sm">Feature 2</p>
                    </li>
                    <li class="py-2">
                        <p class="text-gray-600 text-sm">Feature 3</p>
                    </li>
                    <li class="py-2">
                        <p class="text-gray-600 text-sm">Feature 4</p>
                    </li>
                </ul>
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-6">
                    Choose Plan
                </button>
            </div>
        </div>
        <div class="w-full md:w-1/3 px-4">
            <div class="bg-white rounded-lg shadow-lg p-6">
                <h3 class="text-2xl font-bold text-gray-800 text-center">Enterprise</h3>
                <div class="my-4">
                    <p class="text-gray-600 text-center">$169</p>
                    <p class="text-gray-600 text-center">per month</p>
                </div>
                <ul>
                    <li class="py-2">
                        <p class="text-gray-600 text-sm">Feature 1</p>
                    </li>
                    <li class="py-2">
                        <p class="text-gray-600 text-sm">Feature 2</p>
                    </li>
                    <li class="py-2">
                        <p class="text-gray-600 text-sm">Feature 3</p>
                    </li>
                    <li class="py-2">
                        <p class="text-gray-600 text-sm">Feature 4</p>
                    </li>
                    <li class="py-2">
                        <p class="text-gray-600 text-sm">Feature 5</p>
                    </li>
                    <li class="py-2">
                        <p class="text-gray-600 text-sm">Feature 6</p>
                    </li>
                    <li class="py-2">
                        <p class="text-gray-600 text-sm">Feature 7</p>
                    </li>
                </ul>
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-6">
                    Choose Plan
                </button>
            </div>
        </div>
    </div>
  </section>
</body></html>`;
}, "/Users/davidcruwys/dev/sites/flivideo.com/src/layouts/HomeLayout.astro");

const html = "<div class=\"relative bg-indigo-800\">\n  <div class=\"absolute inset-0\">\n    <img class=\"h-full w-full object-cover\" src=\"https://images.unsplash.com/photo-1525130413817-d45c1d127c42?ixlib=rb-1.2.1&#x26;ixid=eyJhcHBfaWQiOjEyMDd9&#x26;auto=format&#x26;fit=crop&#x26;w=1920&#x26;q=60&#x26;&#x26;sat=-100\" alt=\"\">\n    <div class=\"absolute inset-0 bg-indigo-800 mix-blend-multiply\" aria-hidden=\"true\"></div>\n  </div>\n  <div class=\"relative mx-auto max-w-7xl py-24 px-4 sm:py-32 sm:px-6 lg:px-8\">\n    <h1 class=\"text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl\">Get in touch</h1>\n    <p class=\"mt-6 max-w-3xl text-xl text-indigo-100\">Mattis amet hendrerit dolor, quisque lorem pharetra. Pellentesque lacus nisi urna, arcu sociis eu. Orci vel lectus nisl eget eget ut consectetur. Sit justo viverra non adipisicing elit distinctio.</p>\n  </div>\n</div>";

				const _internal = {
					injectedFrontmatter: {},
				};
				const frontmatter = {"layout":"~/layouts/HomeLayout.astro","title":"AppyDave","pageTitle":"Home | AppyDave","description":"Software Architect, Fullstack / Micro App Developer and Dancer"};
				const file = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/home.md";
				const url = "/home";
				function rawContent() {
					return "\n<div class=\"relative bg-indigo-800\">\n  <div class=\"absolute inset-0\">\n    <img class=\"h-full w-full object-cover\" src=\"https://images.unsplash.com/photo-1525130413817-d45c1d127c42?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1920&q=60&&sat=-100\" alt=\"\">\n    <div class=\"absolute inset-0 bg-indigo-800 mix-blend-multiply\" aria-hidden=\"true\"></div>\n  </div>\n  <div class=\"relative mx-auto max-w-7xl py-24 px-4 sm:py-32 sm:px-6 lg:px-8\">\n    <h1 class=\"text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl\">Get in touch</h1>\n    <p class=\"mt-6 max-w-3xl text-xl text-indigo-100\">Mattis amet hendrerit dolor, quisque lorem pharetra. Pellentesque lacus nisi urna, arcu sociis eu. Orci vel lectus nisl eget eget ut consectetur. Sit justo viverra non adipisicing elit distinctio.</p>\n  </div>\n</div>\n";
				}
				function compiledContent() {
					return html;
				}
				function getHeadings() {
					return [];
				}
				function getHeaders() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings();
				}				async function Content() {
					const { layout, ...content } = frontmatter;
					content.file = file;
					content.url = url;
					content.astro = {};
					Object.defineProperty(content.astro, 'headings', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "headings" from your layout, try using "Astro.props.headings."')
						}
					});
					Object.defineProperty(content.astro, 'html', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "html" from your layout, try using "Astro.props.compiledContent()."')
						}
					});
					Object.defineProperty(content.astro, 'source', {
						get() {
							throw new Error('The "astro" property is no longer supported! To access "source" from your layout, try using "Astro.props.rawContent()."')
						}
					});
					const contentFragment = createVNode(Fragment, { 'set:html': html });
					return createVNode($$HomeLayout, {
									file,
									url,
									content,
									frontmatter: content,
									headings: getHeadings(),
									rawContent,
									compiledContent,
									'server:root': true,
									children: contentFragment
								});
				}
				Content[Symbol.for('astro.needsHeadRendering')] = false;

const _page39 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  _internal,
  frontmatter,
  file,
  url,
  rawContent,
  compiledContent,
  getHeadings,
  getHeaders,
  Content,
  default: Content
}, Symbol.toStringTag, { value: 'Module' }));

const pageMap = new Map([['src/pages/index.mdx', _page0],['src/pages/canva/index.md', _page1],['src/pages/canva/chat-gpt-to-quickly-build-presentation.mdx', _page2],['src/pages/canva/create-a-reusable-template-in-canva.mdx', _page3],['src/pages/canva/apply-style-and-text-to-shapes.mdx', _page4],['src/pages/canva/trendy-profile-picture-outline.mdx', _page5],['src/pages/canva/ebook-cover-or-product-mockup.mdx', _page6],['src/pages/canva/find-brand-colors-alternative.mdx', _page7],['src/pages/canva/replace-shape-and-keep-style.mdx', _page8],['src/pages/canva/selecting-concealed-layers.mdx', _page9],['src/pages/canva/global-search-and-replace.mdx', _page10],['src/pages/canva/background-image-remover.mdx', _page11],['src/pages/canva/quick-flow-for-mind-maps.mdx', _page12],['src/pages/canva/shape-border-rounding.mdx', _page13],['src/pages/canva/add-curves-to-shapes.mdx', _page14],['src/pages/canva/gradient-backgrounds.mdx', _page15],['src/pages/canva/send-design-to-phone.mdx', _page16],['src/pages/canva/faster-image-upload.mdx', _page17],['src/pages/canva/change-design-name.mdx', _page18],['src/pages/canva/duplicate-elements.mdx', _page19],['src/pages/canva/pdf-hyperlink-text.mdx', _page20],['src/pages/canva/bulk-image-delete.mdx', _page21],['src/pages/canva/diy-logo-creation.mdx', _page22],['src/pages/canva/find-brand-colors.mdx', _page23],['src/pages/canva/perfect-alignment.mdx', _page24],['src/pages/canva/element-cropping.mdx', _page25],['src/pages/canva/element-grouping.mdx', _page26],['src/pages/canva/10-text-effects.mdx', _page27],['src/pages/canva/filter-elements.mdx', _page28],['src/pages/canva/moving-elements.mdx', _page29],['src/pages/canva/using-templates.mdx', _page30],['src/pages/canva/add-brand-kit.mdx', _page31],['src/pages/canva/shadow-effect.mdx', _page32],['src/pages/canva/video-credits.mdx', _page33],['src/pages/canva/add-new-text.mdx', _page34],['src/pages/canva/using-video.mdx', _page35],['src/pages/canva/drawing.mdx', _page36],['src/pages/canva/zooming.mdx', _page37],['src/pages/canva/frames.mdx', _page38],['src/pages/home.md', _page39],]);
const renderers = [Object.assign({"name":"astro:jsx","serverEntrypoint":"astro/jsx/server.js","jsxImportSource":"astro"}, { ssr: server_default }),];

if (typeof process !== "undefined") {
  if (process.argv.includes("--verbose")) ; else if (process.argv.includes("--silent")) ; else ;
}

const SCRIPT_EXTENSIONS = /* @__PURE__ */ new Set([".js", ".ts"]);
new RegExp(
  `\\.(${Array.from(SCRIPT_EXTENSIONS).map((s) => s.slice(1)).join("|")})($|\\?)`
);

const STYLE_EXTENSIONS = /* @__PURE__ */ new Set([
  ".css",
  ".pcss",
  ".postcss",
  ".scss",
  ".sass",
  ".styl",
  ".stylus",
  ".less"
]);
new RegExp(
  `\\.(${Array.from(STYLE_EXTENSIONS).map((s) => s.slice(1)).join("|")})($|\\?)`
);

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return toPath;
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
    segments: rawRouteData.segments
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
  return {
    ...serializedManifest,
    assets,
    routes
  };
}

const _manifest = Object.assign(deserializeManifest({"adapterName":"@astrojs/netlify/functions","routes":[{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/","type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.mdx","pathname":"/","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva","type":"page","pattern":"^\\/canva\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/index.md","pathname":"/canva","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/chat-gpt-to-quickly-build-presentation","type":"page","pattern":"^\\/canva\\/chat-gpt-to-quickly-build-presentation\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"chat-gpt-to-quickly-build-presentation","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/chat-gpt-to-quickly-build-presentation.mdx","pathname":"/canva/chat-gpt-to-quickly-build-presentation","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/create-a-reusable-template-in-canva","type":"page","pattern":"^\\/canva\\/create-a-reusable-template-in-canva\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"create-a-reusable-template-in-canva","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/create-a-reusable-template-in-canva.mdx","pathname":"/canva/create-a-reusable-template-in-canva","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/apply-style-and-text-to-shapes","type":"page","pattern":"^\\/canva\\/apply-style-and-text-to-shapes\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"apply-style-and-text-to-shapes","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/apply-style-and-text-to-shapes.mdx","pathname":"/canva/apply-style-and-text-to-shapes","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/trendy-profile-picture-outline","type":"page","pattern":"^\\/canva\\/trendy-profile-picture-outline\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"trendy-profile-picture-outline","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/trendy-profile-picture-outline.mdx","pathname":"/canva/trendy-profile-picture-outline","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/ebook-cover-or-product-mockup","type":"page","pattern":"^\\/canva\\/ebook-cover-or-product-mockup\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"ebook-cover-or-product-mockup","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/ebook-cover-or-product-mockup.mdx","pathname":"/canva/ebook-cover-or-product-mockup","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/find-brand-colors-alternative","type":"page","pattern":"^\\/canva\\/find-brand-colors-alternative\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"find-brand-colors-alternative","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/find-brand-colors-alternative.mdx","pathname":"/canva/find-brand-colors-alternative","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/replace-shape-and-keep-style","type":"page","pattern":"^\\/canva\\/replace-shape-and-keep-style\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"replace-shape-and-keep-style","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/replace-shape-and-keep-style.mdx","pathname":"/canva/replace-shape-and-keep-style","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/selecting-concealed-layers","type":"page","pattern":"^\\/canva\\/selecting-concealed-layers\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"selecting-concealed-layers","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/selecting-concealed-layers.mdx","pathname":"/canva/selecting-concealed-layers","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/global-search-and-replace","type":"page","pattern":"^\\/canva\\/global-search-and-replace\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"global-search-and-replace","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/global-search-and-replace.mdx","pathname":"/canva/global-search-and-replace","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/background-image-remover","type":"page","pattern":"^\\/canva\\/background-image-remover\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"background-image-remover","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/background-image-remover.mdx","pathname":"/canva/background-image-remover","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/quick-flow-for-mind-maps","type":"page","pattern":"^\\/canva\\/quick-flow-for-mind-maps\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"quick-flow-for-mind-maps","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/quick-flow-for-mind-maps.mdx","pathname":"/canva/quick-flow-for-mind-maps","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/shape-border-rounding","type":"page","pattern":"^\\/canva\\/shape-border-rounding\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"shape-border-rounding","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/shape-border-rounding.mdx","pathname":"/canva/shape-border-rounding","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/add-curves-to-shapes","type":"page","pattern":"^\\/canva\\/add-curves-to-shapes\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"add-curves-to-shapes","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/add-curves-to-shapes.mdx","pathname":"/canva/add-curves-to-shapes","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/gradient-backgrounds","type":"page","pattern":"^\\/canva\\/gradient-backgrounds\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"gradient-backgrounds","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/gradient-backgrounds.mdx","pathname":"/canva/gradient-backgrounds","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/send-design-to-phone","type":"page","pattern":"^\\/canva\\/send-design-to-phone\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"send-design-to-phone","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/send-design-to-phone.mdx","pathname":"/canva/send-design-to-phone","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/faster-image-upload","type":"page","pattern":"^\\/canva\\/faster-image-upload\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"faster-image-upload","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/faster-image-upload.mdx","pathname":"/canva/faster-image-upload","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/change-design-name","type":"page","pattern":"^\\/canva\\/change-design-name\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"change-design-name","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/change-design-name.mdx","pathname":"/canva/change-design-name","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/duplicate-elements","type":"page","pattern":"^\\/canva\\/duplicate-elements\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"duplicate-elements","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/duplicate-elements.mdx","pathname":"/canva/duplicate-elements","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/pdf-hyperlink-text","type":"page","pattern":"^\\/canva\\/pdf-hyperlink-text\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"pdf-hyperlink-text","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/pdf-hyperlink-text.mdx","pathname":"/canva/pdf-hyperlink-text","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/bulk-image-delete","type":"page","pattern":"^\\/canva\\/bulk-image-delete\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"bulk-image-delete","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/bulk-image-delete.mdx","pathname":"/canva/bulk-image-delete","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/diy-logo-creation","type":"page","pattern":"^\\/canva\\/diy-logo-creation\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"diy-logo-creation","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/diy-logo-creation.mdx","pathname":"/canva/diy-logo-creation","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/find-brand-colors","type":"page","pattern":"^\\/canva\\/find-brand-colors\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"find-brand-colors","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/find-brand-colors.mdx","pathname":"/canva/find-brand-colors","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/perfect-alignment","type":"page","pattern":"^\\/canva\\/perfect-alignment\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"perfect-alignment","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/perfect-alignment.mdx","pathname":"/canva/perfect-alignment","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/element-cropping","type":"page","pattern":"^\\/canva\\/element-cropping\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"element-cropping","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/element-cropping.mdx","pathname":"/canva/element-cropping","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/element-grouping","type":"page","pattern":"^\\/canva\\/element-grouping\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"element-grouping","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/element-grouping.mdx","pathname":"/canva/element-grouping","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/10-text-effects","type":"page","pattern":"^\\/canva\\/10-text-effects\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"10-text-effects","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/10-text-effects.mdx","pathname":"/canva/10-text-effects","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/filter-elements","type":"page","pattern":"^\\/canva\\/filter-elements\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"filter-elements","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/filter-elements.mdx","pathname":"/canva/filter-elements","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/moving-elements","type":"page","pattern":"^\\/canva\\/moving-elements\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"moving-elements","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/moving-elements.mdx","pathname":"/canva/moving-elements","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/using-templates","type":"page","pattern":"^\\/canva\\/using-templates\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"using-templates","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/using-templates.mdx","pathname":"/canva/using-templates","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"routeData":{"route":"/canva/add-brand-kit","type":"page","pattern":"^\\/canva\\/add-brand-kit\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"add-brand-kit","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/add-brand-kit.mdx","pathname":"/canva/add-brand-kit","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/shadow-effect","type":"page","pattern":"^\\/canva\\/shadow-effect\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"shadow-effect","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/shadow-effect.mdx","pathname":"/canva/shadow-effect","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/video-credits","type":"page","pattern":"^\\/canva\\/video-credits\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"video-credits","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/video-credits.mdx","pathname":"/canva/video-credits","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/add-new-text","type":"page","pattern":"^\\/canva\\/add-new-text\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"add-new-text","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/add-new-text.mdx","pathname":"/canva/add-new-text","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/using-video","type":"page","pattern":"^\\/canva\\/using-video\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"using-video","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/using-video.mdx","pathname":"/canva/using-video","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/drawing","type":"page","pattern":"^\\/canva\\/drawing\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"drawing","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/drawing.mdx","pathname":"/canva/drawing","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/zooming","type":"page","pattern":"^\\/canva\\/zooming\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"zooming","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/zooming.mdx","pathname":"/canva/zooming","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/canva/frames","type":"page","pattern":"^\\/canva\\/frames\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"frames","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/frames.mdx","pathname":"/canva/frames","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.f983fcfa.css"],"scripts":[],"routeData":{"route":"/home","type":"page","pattern":"^\\/home\\/?$","segments":[[{"content":"home","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/home.md","pathname":"/home","_meta":{"trailingSlash":"ignore"}}}],"base":"/","markdown":{"drafts":false,"syntaxHighlight":"shiki","shikiConfig":{"langs":[],"theme":"github-dark","wrap":false},"remarkPlugins":[],"rehypePlugins":[],"remarkRehype":{},"extendDefaultPlugins":false,"isAstroFlavoredMd":false},"pageMap":null,"renderers":[],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","astro:scripts/before-hydration.js":""},"assets":["/assets/index.f983fcfa.css","/favicon.svg","/fonts/Inter-italic.var.woff2","/fonts/Inter-roman.var.woff2","/fonts/lexend.txt","/fonts/lexend.woff2","/images/david.png","/images/logo-fli-video-icon.png","/images/logo-fli-video-icon.svg","/images/logo-fli-video-tagline.png","/images/logo-fli-video-tagline.svg","/images/logo-fli-video.png","/images/logo-fli-video.svg"]}), {
	pageMap: pageMap,
	renderers: renderers
});
const _args = {};

const _exports = adapter.createExports(_manifest, _args);
const handler = _exports['handler'];

const _start = 'start';
if(_start in adapter) {
	adapter[_start](_manifest, _args);
}

export { handler, pageMap, renderers };
