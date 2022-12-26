import { Sitemap } from "./types";

export default function sitemap(): Sitemap {
  const sitemap = new Sitemap();

  sitemap.add_topic('AstroJSxxx', 'astrojs', ['astrojs']);

  const ruby = sitemap.add_topic('Ruby', 'ruby', ['ruby', 'ruby/gems']);

  const factory_bot = ruby.add_topic('Ruby', 'ruby', ['ruby', 'ruby/gems']);

  // ruby.add_topic('Introduction', 'factory-bot', ['factory-bot', 'faker', 'rails']);

  return sitemap;
  // const builder = new SitemapBuilder();

  // builder.
  // // return new Sitemap([
  // //   new Topic('Ruby', ['ruby'], [
  // //     new Section('Ruby Gems', [
  // //       new Link('factory-bot', 'Factory Bot', 'ruby/gems/factory-bot'),
  // //       new Link('faker', 'Faker', 'ruby/gems/faker'),
  // //     ]),
  // //     new Section('Ruby on Rails', [
  // //       new Link('rails', 'Rails', 'ruby/rails'),
  // //     ]),
  // //   ]),
  // // ]);
  // return builder.build();
}

