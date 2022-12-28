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
  return "/Users/davidcruwys/dev/sites/appydave-v2.com/src/pages/";
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
          <p class="inline bg-gradient-to-r from-indigo-200 via-sky-400 to-indigo-200 bg-clip-text font-display text-5xl tracking-tight text-transparent">
            Automate your influence
          </p>
          <p class="mt-3 text-2xl tracking-tight text-slate-400">
            Learn how to systemetise adn automate your video influence. Create more content, reach more people, and grow your business.
          </p>
          <div class="mt-8 flex gap-4 md:justify-center lg:justify-start">
            <button href="/">
              Get started
            </button>
            <button href="/" variant="secondary">
              View on GitHub
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
  return renderTemplate`${maybeRenderHead($$result)}<img src="/images/logo-fli-video-tagline.svg" alt="Logo"${spreadAttributes(props)}>`;
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
      ${renderComponent($$result, "LogoIcon", $$LogoIcon, { "class": "h-24 lg:hidden" })}
      ${renderComponent($$result, "Logo", $$Logo, { "class": "hidden h-24 w-auto fill-slate-700 dark:fill-sky-100 lg:block" })}
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
  const { section = "xmen are cool", title = "It's good to be the king" } = Astro2.props;
  return renderTemplate`${maybeRenderHead($$result)}<article>
  <header class="mb-9 space-y-1">
    ${section && renderTemplate`${renderComponent($$result, "ArticleSection", $$ArticleSection, { "section": "{section}" })}`}
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
</div> 


<!-- <div class="hidden lg:relative lg:block lg:flex-none" xmen='aaaaaaaaaaaaaaaaaaaaaaaaa'>
  <div class="absolute inset-y-0 right-0 w-[50vw] bg-slate-50 dark:hidden"></div>
  <div class="sticky top-[4.5rem] -ml-0.5 h-[calc(100vh-4.5rem)] overflow-y-auto py-16 pl-0.5">
    <div class="absolute top-16 bottom-0 right-0 hidden h-12 w-px bg-gradient-to-t from-slate-800 dark:block"></div>
    <div class="absolute top-28 bottom-0 right-0 hidden w-px bg-slate-800 dark:block"></div>
    <nav class="text-base lg:text-sm w-64 pr-8 xl:w-72 xl:pr-16">
      <ul role="list" class="space-y-9">
        <li>
          <h2 class="font-display font-medium text-slate-900 dark:text-white">Introduction</h2>
          <ul
            role="list"
            class="mt-2 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 lg:mt-4 lg:space-y-4 lg:border-slate-200">
            <li class="relative">
              <a
                class="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full font-semibold text-sky-500 before:bg-sky-500"
                href="/">Getting started</a>
            </li><li class="relative">
              <a
                class="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                href="/docs/installation">Installation</a>
            </li>
          </ul>
        </li><li>
          <h2 class="font-display font-medium text-slate-900 dark:text-white">Core concepts</h2><ul
            role="list"
            class="mt-2 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 lg:mt-4 lg:space-y-4 lg:border-slate-200"
          >
            <li class="relative">
              <a
                class="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                href="/docs/understanding-caching">Understanding caching</a>
            </li><li class="relative">
              <a
                class="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                href="/docs/predicting-user-behavior">Predicting user behavior</a>
            </li><li class="relative">
              <a
                class="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                href="/docs/basics-of-time-travel">Basics of time-travel</a>
            </li><li class="relative">
              <a
                class="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                href="/docs/introduction-to-string-theory">Introduction to string theory</a>
            </li><li class="relative">
              <a
                class="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                href="/docs/the-butterfly-effect">The butterfly effect</a>
            </li>
          </ul>
        </li><li>
          <h2 class="font-display font-medium text-slate-900 dark:text-white">Advanced guides</h2><ul
            role="list"
            class="mt-2 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 lg:mt-4 lg:space-y-4 lg:border-slate-200"
          >
            <li class="relative">
              <a
                class="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                href="/docs/writing-plugins">Writing plugins</a>
            </li><li class="relative">
              <a
                class="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                href="/docs/neuralink-integration">Neuralink integration</a>
            </li><li class="relative">
              <a
                class="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                href="/docs/temporal-paradoxes">Temporal paradoxes</a>
            </li><li class="relative">
              <a
                class="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                href="/docs/testing">Testing</a>
            </li><li class="relative">
              <a
                class="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                href="/docs/compile-time-caching">Compile-time caching</a>
            </li><li class="relative">
              <a
                class="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                href="/docs/predictive-data-generation">Predictive data generation</a>
            </li>
          </ul>
        </li><li>
          <h2 class="font-display font-medium text-slate-900 dark:text-white">API reference</h2><ul
            role="list"
            class="mt-2 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 lg:mt-4 lg:space-y-4 lg:border-slate-200"
          >
            <li class="relative">
              <a
                class="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                href="/docs/cacheadvance-predict">CacheAdvance.predict()</a>
            </li><li class="relative">
              <a
                class="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                href="/docs/cacheadvance-flush">CacheAdvance.flush()</a>
            </li><li class="relative">
              <a
                class="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                href="/docs/cacheadvance-revert">CacheAdvance.revert()</a>
            </li><li class="relative">
              <a
                class="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                href="/docs/cacheadvance-regret">CacheAdvance.regret()</a>
            </li>
          </ul>
        </li><li>
          <h2 class="font-display font-medium text-slate-900 dark:text-white">Contributing</h2><ul
            role="list"
            class="mt-2 space-y-2 border-l-2 border-slate-100 dark:border-slate-800 lg:mt-4 lg:space-y-4 lg:border-slate-200"
          >
            <li class="relative">
              <a
                class="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                href="/docs/how-to-contribute">How to contribute</a>
            </li><li class="relative">
              <a
                class="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                href="/docs/architecture-guide">Architecture guide</a>
            </li><li class="relative">
              <a
                class="block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300"
                href="/docs/design-principles">Design principles</a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
</div> -->`;
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
      <pre>{JSON.stringify(context, null, 2)}</pre>
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

const html$3 = "";

				const _internal$3 = {
					injectedFrontmatter: {},
				};
				const frontmatter$3 = {"layout":"~/layouts/BaseLayout.astro","title":"FliVideo","pageTitle":"Home | FliVideo","description":"Automate your video influence","hero":true};
				const file$3 = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/index.md";
				const url$3 = "";
				function rawContent$3() {
					return "\n\n";
				}
				function compiledContent$3() {
					return html$3;
				}
				function getHeadings$3() {
					return [];
				}
				function getHeaders$3() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$3();
				}				async function Content$3() {
					const { layout, ...content } = frontmatter$3;
					content.file = file$3;
					content.url = url$3;
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
					const contentFragment = createVNode(Fragment, { 'set:html': html$3 });
					return createVNode($$BaseLayout, {
									file: file$3,
									url: url$3,
									content,
									frontmatter: content,
									headings: getHeadings$3(),
									rawContent: rawContent$3,
									compiledContent: compiledContent$3,
									'server:root': true,
									children: contentFragment
								});
				}
				Content$3[Symbol.for('astro.needsHeadRendering')] = false;

const _page0 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  _internal: _internal$3,
  frontmatter: frontmatter$3,
  file: file$3,
  url: url$3,
  rawContent: rawContent$3,
  compiledContent: compiledContent$3,
  getHeadings: getHeadings$3,
  getHeaders: getHeaders$3,
  Content: Content$3,
  default: Content$3
}, Symbol.toStringTag, { value: 'Module' }));

const html$2 = "<h2 id=\"interesting\">Interesting</h2>\n<h3 id=\"general\">General</h3>\n<p><a href=\"https://medium.com/rubycademy/the-super-keyword-a75b67f46f05\">https://medium.com/rubycademy/the-super-keyword-a75b67f46f05</a>\n<a href=\"https://blog.appsignal.com/2019/09/03/inherited-hook-method-and-parenting.html\">https://blog.appsignal.com/2019/09/03/inherited-hook-method-and-parenting.html</a>\n<a href=\"https://medium.com/@jeffm.adler/inheriting-class-variables-in-ruby-971f8f977884\">https://medium.com/@jeffm.adler/inheriting-class-variables-in-ruby-971f8f977884</a>\n<a href=\"https://mixandgo.com/learn/ruby/class-variables\">https://mixandgo.com/learn/ruby/class-variables</a>\n<a href=\"https://medium.com/@amliving/diving-into-rubys-attr-accessor-d34e2ccc5477\">https://medium.com/@amliving/diving-into-rubys-attr-accessor-d34e2ccc5477</a>\n<a href=\"https://simonecarletti.com/blog/2009/09/inside-ruby-on-rails-extract_options-from-arrays/\">https://simonecarletti.com/blog/2009/09/inside-ruby-on-rails-extract_options-from-arrays/</a></p>\n<h3 id=\"inheritable-attributes\">Inheritable Attributes</h3>\n<p><a href=\"https://github.com/rails/rails/blob/45d6cd94b3ef2ec77166def41f29188445b35608/activesupport/lib/active_support/core_ext/class/attribute.rb\">https://github.com/rails/rails/blob/45d6cd94b3ef2ec77166def41f29188445b35608/activesupport/lib/active_support/core_ext/class/attribute.rb</a>\n<a href=\"https://stackoverflow.com/questions/6617769/how-do-i-replicate-class-inheritable-accessors-behavior-in-rails-3-1/6618620#6618620\">https://stackoverflow.com/questions/6617769/how-do-i-replicate-class-inheritable-accessors-behavior-in-rails-3-1/6618620#6618620</a></p>\n<p>tube RoeCM8gD20A\ntube MGNq1dm2wUM\ntube jbc05dHW7Oc\ntube 5c9SapE_YNU\ntube qgpmYZpsY0A\ntube j1-6uHTQLzo\ntube q2PmmBuNfTk\ntube 56QrXA0Ey0E\ntube mJHGcYtay6s\ntube mJHGcYtay6s\ntube tmXbM0INj50\ntube 7o8hAhtEMhc</p>";

				const _internal$2 = {
					injectedFrontmatter: {},
				};
				const frontmatter$2 = {"layout":"~/layouts/BaseLayout.astro","title":"Ruby"};
				const file$2 = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/index.md";
				const url$2 = "/canva";
				function rawContent$2() {
					return "\n## Interesting\n\n### General\n\nhttps://medium.com/rubycademy/the-super-keyword-a75b67f46f05\nhttps://blog.appsignal.com/2019/09/03/inherited-hook-method-and-parenting.html\nhttps://medium.com/@jeffm.adler/inheriting-class-variables-in-ruby-971f8f977884\nhttps://mixandgo.com/learn/ruby/class-variables\nhttps://medium.com/@amliving/diving-into-rubys-attr-accessor-d34e2ccc5477\nhttps://simonecarletti.com/blog/2009/09/inside-ruby-on-rails-extract_options-from-arrays/\n\n\n### Inheritable Attributes\nhttps://github.com/rails/rails/blob/45d6cd94b3ef2ec77166def41f29188445b35608/activesupport/lib/active_support/core_ext/class/attribute.rb\nhttps://stackoverflow.com/questions/6617769/how-do-i-replicate-class-inheritable-accessors-behavior-in-rails-3-1/6618620#6618620\n\n\ntube RoeCM8gD20A\ntube MGNq1dm2wUM\ntube jbc05dHW7Oc\ntube 5c9SapE_YNU\ntube qgpmYZpsY0A\ntube j1-6uHTQLzo\ntube q2PmmBuNfTk\ntube 56QrXA0Ey0E\ntube mJHGcYtay6s\ntube mJHGcYtay6s\ntube tmXbM0INj50\ntube 7o8hAhtEMhc";
				}
				function compiledContent$2() {
					return html$2;
				}
				function getHeadings$2() {
					return [{"depth":2,"slug":"interesting","text":"Interesting"},{"depth":3,"slug":"general","text":"General"},{"depth":3,"slug":"inheritable-attributes","text":"Inheritable Attributes"}];
				}
				function getHeaders$2() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$2();
				}				async function Content$2() {
					const { layout, ...content } = frontmatter$2;
					content.file = file$2;
					content.url = url$2;
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
					const contentFragment = createVNode(Fragment, { 'set:html': html$2 });
					return createVNode($$BaseLayout, {
									file: file$2,
									url: url$2,
									content,
									frontmatter: content,
									headings: getHeadings$2(),
									rawContent: rawContent$2,
									compiledContent: compiledContent$2,
									'server:root': true,
									children: contentFragment
								});
				}
				Content$2[Symbol.for('astro.needsHeadRendering')] = false;

const _page1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  _internal: _internal$2,
  frontmatter: frontmatter$2,
  file: file$2,
  url: url$2,
  rawContent: rawContent$2,
  compiledContent: compiledContent$2,
  getHeadings: getHeadings$2,
  getHeaders: getHeaders$2,
  Content: Content$2,
  default: Content$2
}, Symbol.toStringTag, { value: 'Module' }));

const html$1 = "<h2 id=\"website-templatesexamples\">Website Templates/Examples</h2>\n<h3 id=\"framesworks\">Framesworks</h3>\n<p><a href=\"\">AVO</a>\n<a href=\"https://github.com/bullet-train-co/bullet_train\">Bullet Train</a>\n<a href=\"https://bullettrain.co/docs\">Bullet Train Docs</a></p>\n<h3 id=\"e-commerce\">E-Commerce</h3>\n<p><a href=\"https://www.youtube.com/watch?v=Bd4y64Dk5QU\">E-Commerce Ruby on Rails</a></p>\n<h2 id=\"impersonation\">Impersonation</h2>\n<h3 id=\"pretender\">Pretender</h3>\n<p><a href=\"https://github.com/ankane/pretender\">GEM Repo</a></p>\n<h2 id=\"stimulas--turbo--hotwire\">Stimulas / Turbo / HotWire</h2>\n<p><a href=\"https://stimulus.hotwired.dev/handbook/introduction\">handbook introduction</a>\n<a href=\"https://turbo.hotwired.dev/reference/frames#frame-that-promotes-navigations-to-visits\">Frames</a>\n<a href=\"https://www.youtube.com/watch?v=0CSGsHnci2I\">Turbo and Rails 7</a>\n<a href=\"https://github.com/hotwired/turbo-rails\">Turbo-Rails Repo</a>\n<a href=\"https://www.hotrails.dev/turbo-rails/nested-turbo-frames\">Nested Rails Frames</a>\n<a href=\"https://evilmartians.com/chronicles/hotwire-reactive-rails-with-no-javascript\">Reactive Javascript</a></p>\n<h2 id=\"security\">Security</h2>\n<h3 id=\"devise\">Devise</h3>\n<p><a href=\"https://www.youtube.com/watch?v=XJ27X06GVrI\">Devise and Turbo - Rails 7</a></p>\n<h3 id=\"authorization--roles\">Authorization / Roles</h3>\n<p><a href=\"https://www.youtube.com/watch?v=PmkBBRq6jQ0\">Creating Roles</a></p>\n<p><a href=\"https://www.youtube.com/watch?v=Yrsgk9l3e3U\">Authorization with Pundit</a>\n<a href=\"https://www.youtube.com/watch?v=xxkx57-vbQI\">Ruby on Rails #49 gem Pundit for Authorization - Complete Guide</a>\n<a href=\"https://www.youtube.com/results?search_query=rails+7+pundit\">More on Pundit</a>\n<a href=\"https://github.com/palkan/action_policy\">Action Policy</a>\n<a href=\"https://entrision.com/blog/comparing-cancan-vs-pundit/\">CanCanCan vs Pundit</a>\n[CanCanCan vs Pundit a comparative study]*<a href=\"https://blog.francium.tech/pundit-vs-cancancan-a-comparative-study-a8f7ab8f9ae8?gi=3260f1fd186b\">https://blog.francium.tech/pundit-vs-cancancan-a-comparative-study-a8f7ab8f9ae8?gi=3260f1fd186b</a>)</p>\n<h3 id=\"image-processing\">Image Processing</h3>\n<p><a href=\"https://github.com/janko/image_processing\">GEM Repo</a></p>\n<h3 id=\"randsack\">Randsack</h3>\n<p><a href=\"https://github.com/activerecord-hackery/ransack\">GEM Reop</a></p>\n<h3 id=\"profiling\">Profiling</h3>\n<p><a href=\"https://world.hey.com/jdmo/profiling-your-ruby-on-rails-application-like-a-boss-8ee936a8\">StackProf</a>\n<a href=\"https://github.com/tmm1/stackprof\">StackProf GEM</a></p>\n<h2 id=\"admin-systems\">Admin Systems</h2>\n<p><a href=\"https://www.youtube.com/results?search_query=rails+avo\">AVO</a></p>\n<h2 id=\"bundler\">Bundler</h2>\n<p>List of useful bundler commands</p>\n<pre is:raw=\"\" class=\"astro-code\" style=\"background-color: #0d1117; overflow-x: auto;\"><code><span class=\"line\"><span style=\"color: #C9D1D9\">rm -rf Gemfile.lock </span><span style=\"color: #FF7B72\">&#x26;&#x26;</span><span style=\"color: #C9D1D9\"> bi </span><span style=\"color: #FF7B72\">&#x26;&#x26;</span><span style=\"color: #C9D1D9\"> bundler-audit</span></span>\n<span class=\"line\"><span style=\"color: #C9D1D9\">rm Gemfile.lock </span><span style=\"color: #FF7B72\">&#x26;&#x26;</span><span style=\"color: #C9D1D9\"> bi </span><span style=\"color: #FF7B72\">&#x26;&#x26;</span><span style=\"color: #C9D1D9\"> bundle outdated </span><span style=\"color: #FF7B72\">&#x26;&#x26;</span><span style=\"color: #C9D1D9\"> gs</span></span></code></pre>";

				const _internal$1 = {
					injectedFrontmatter: {},
				};
				const frontmatter$1 = {"layout":"~/layouts/BaseLayout.astro","title":"Ruby GEMs"};
				const file$1 = "/Users/davidcruwys/dev/sites/flivideo.com/src/pages/canva/gems/index.md";
				const url$1 = "/canva/gems";
				function rawContent$1() {
					return "\n## Website Templates/Examples\n\n### Framesworks\n\n[AVO]()\n[Bullet Train](https://github.com/bullet-train-co/bullet_train)\n[Bullet Train Docs](https://bullettrain.co/docs)\n\n### E-Commerce\n\n[E-Commerce Ruby on Rails](https://www.youtube.com/watch?v=Bd4y64Dk5QU)\n\n## Impersonation\n\n### Pretender\n\n[GEM Repo](https://github.com/ankane/pretender)\n\n## Stimulas / Turbo / HotWire\n\n[handbook introduction](https://stimulus.hotwired.dev/handbook/introduction)\n[Frames](https://turbo.hotwired.dev/reference/frames#frame-that-promotes-navigations-to-visits)\n[Turbo and Rails 7](https://www.youtube.com/watch?v=0CSGsHnci2I)\n[Turbo-Rails Repo](https://github.com/hotwired/turbo-rails)\n[Nested Rails Frames](https://www.hotrails.dev/turbo-rails/nested-turbo-frames)\n[Reactive Javascript](https://evilmartians.com/chronicles/hotwire-reactive-rails-with-no-javascript)\n\n## Security\n\n### Devise\n\n[Devise and Turbo - Rails 7](https://www.youtube.com/watch?v=XJ27X06GVrI)\n\n### Authorization / Roles\n\n[Creating Roles](https://www.youtube.com/watch?v=PmkBBRq6jQ0)\n\n[Authorization with Pundit](https://www.youtube.com/watch?v=Yrsgk9l3e3U)\n[Ruby on Rails #49 gem Pundit for Authorization - Complete Guide](https://www.youtube.com/watch?v=xxkx57-vbQI)\n[More on Pundit](https://www.youtube.com/results?search_query=rails+7+pundit)\n[Action Policy](https://github.com/palkan/action_policy)\n[CanCanCan vs Pundit](https://entrision.com/blog/comparing-cancan-vs-pundit/)\n[CanCanCan vs Pundit a comparative study]*https://blog.francium.tech/pundit-vs-cancancan-a-comparative-study-a8f7ab8f9ae8?gi=3260f1fd186b)\n\n\n### Image Processing\n\n[GEM Repo](https://github.com/janko/image_processing)\n\n### Randsack\n\n[GEM Reop](https://github.com/activerecord-hackery/ransack)\n\n### Profiling\n\n[StackProf](https://world.hey.com/jdmo/profiling-your-ruby-on-rails-application-like-a-boss-8ee936a8)\n[StackProf GEM](https://github.com/tmm1/stackprof)\n\n## Admin Systems\n\n[AVO](https://www.youtube.com/results?search_query=rails+avo)\n\n## Bundler\n\nList of useful bundler commands\n\n```bash\nrm -rf Gemfile.lock && bi && bundler-audit\nrm Gemfile.lock && bi && bundle outdated && gs\n```";
				}
				function compiledContent$1() {
					return html$1;
				}
				function getHeadings$1() {
					return [{"depth":2,"slug":"website-templatesexamples","text":"Website Templates/Examples"},{"depth":3,"slug":"framesworks","text":"Framesworks"},{"depth":3,"slug":"e-commerce","text":"E-Commerce"},{"depth":2,"slug":"impersonation","text":"Impersonation"},{"depth":3,"slug":"pretender","text":"Pretender"},{"depth":2,"slug":"stimulas--turbo--hotwire","text":"Stimulas / Turbo / HotWire"},{"depth":2,"slug":"security","text":"Security"},{"depth":3,"slug":"devise","text":"Devise"},{"depth":3,"slug":"authorization--roles","text":"Authorization / Roles"},{"depth":3,"slug":"image-processing","text":"Image Processing"},{"depth":3,"slug":"randsack","text":"Randsack"},{"depth":3,"slug":"profiling","text":"Profiling"},{"depth":2,"slug":"admin-systems","text":"Admin Systems"},{"depth":2,"slug":"bundler","text":"Bundler"}];
				}
				function getHeaders$1() {
					console.warn('getHeaders() have been deprecated. Use getHeadings() function instead.');
					return getHeadings$1();
				}				async function Content$1() {
					const { layout, ...content } = frontmatter$1;
					content.file = file$1;
					content.url = url$1;
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
									file: file$1,
									url: url$1,
									content,
									frontmatter: content,
									headings: getHeadings$1(),
									rawContent: rawContent$1,
									compiledContent: compiledContent$1,
									'server:root': true,
									children: contentFragment
								});
				}
				Content$1[Symbol.for('astro.needsHeadRendering')] = false;

const _page2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  _internal: _internal$1,
  frontmatter: frontmatter$1,
  file: file$1,
  url: url$1,
  rawContent: rawContent$1,
  compiledContent: compiledContent$1,
  getHeadings: getHeadings$1,
  getHeaders: getHeaders$1,
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

const _page3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
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

const pageMap = new Map([['src/pages/index.md', _page0],['src/pages/canva/index.md', _page1],['src/pages/canva/gems/index.md', _page2],['src/pages/home.md', _page3],]);
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

const _manifest = Object.assign(deserializeManifest({"adapterName":"@astrojs/netlify/functions","routes":[{"file":"","links":["assets/index.e86e27f9.css"],"scripts":[],"routeData":{"route":"/","type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.md","pathname":"/","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.e86e27f9.css"],"scripts":[],"routeData":{"route":"/canva","type":"page","pattern":"^\\/canva\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/index.md","pathname":"/canva","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.e86e27f9.css"],"scripts":[],"routeData":{"route":"/canva/gems","type":"page","pattern":"^\\/canva\\/gems\\/?$","segments":[[{"content":"canva","dynamic":false,"spread":false}],[{"content":"gems","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/canva/gems/index.md","pathname":"/canva/gems","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":["assets/index.e86e27f9.css"],"scripts":[],"routeData":{"route":"/home","type":"page","pattern":"^\\/home\\/?$","segments":[[{"content":"home","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/home.md","pathname":"/home","_meta":{"trailingSlash":"ignore"}}}],"base":"/","markdown":{"drafts":false,"syntaxHighlight":"shiki","shikiConfig":{"langs":[],"theme":"github-dark","wrap":false},"remarkPlugins":[],"rehypePlugins":[],"remarkRehype":{},"extendDefaultPlugins":false,"isAstroFlavoredMd":false},"pageMap":null,"renderers":[],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","astro:scripts/before-hydration.js":""},"assets":["/assets/index.e86e27f9.css","/favicon.svg","/fonts/Inter-italic.var.woff2","/fonts/Inter-roman.var.woff2","/fonts/lexend.txt","/fonts/lexend.woff2","/images/logo-fli-video-icon.png","/images/logo-fli-video-icon.svg","/images/logo-fli-video-tagline.png","/images/logo-fli-video-tagline.svg","/images/logo-fli-video.png","/images/logo-fli-video.svg"]}), {
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
