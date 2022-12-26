import { defineConfig } from 'astro/config';

// https://astro.build/config
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  server: { port: 3003 },
  integrations: [tailwind({
    config: {
      applyBaseStyles: false
    }
  }), mdx()]
});