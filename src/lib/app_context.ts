import type { Sitemap } from './sitemap/types';

export default class AppContext {
  sitemap: Sitemap;

  constructor(sitemap: Sitemap) {
    this.sitemap = sitemap;
  }
}
