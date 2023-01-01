import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
// import netlify from "@astrojs/netlify/functions";

// https://astro.build/config
export default defineConfig({
  server: {
    port: 3003
  },
  integrations: [tailwind({
    config: {
      applyBaseStyles: false
    }
  }), mdx()]
});

// output: "server",
// adapter: netlify()
