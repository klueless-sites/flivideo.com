import path from 'node:path';
import fsp from 'node:fs/promises';
import fs from 'node:fs';

const DEFAULT_NAVIGATION = {
  sections: [
    {
      title: 'Introduction',
      links: []
    }
  ]
};

const QUICK_NAVIGATION = {
  sections: [
    {
      title: 'Quick Links',
      links: [
        {
          title: 'Canva (Tips, Tricks, Tutorials)',
          href: '/canva'
        },
        {
          title: 'Camtasia (Tips, Tricks, Tutorials)',
          href: '/camtasia'
        },
        {
          title: 'Davinci Resolve (Tips, Tricks, Tutorials)',
          href: '/davinci-resolve'
        }
        // {
        //   title: 'New Home',
        //   href: '/home'
        // }
      ]
    }
  ]
}

// console.log(Astro.props).content.file
export async function topicNavigation(props: Record<string, number | string | any>): Promise<any> {
  const file: string = props.content.file;
// export async function topicNavigation(file: string): Promise<any> {
  // const fetchedArticle = await import.meta.glob("../pages/posts/*.md");

  const configFile = topicNavigationPath(file);
  // console.log(file);
  // console.log(configFile);

  let data = structuredClone(DEFAULT_NAVIGATION);

  if (fs.existsSync(configFile)) {
    const json = await fsp.readFile(configFile, 'utf-8');
    data = JSON.parse(json);
  }

  data.sections.push(...QUICK_NAVIGATION.sections);
  // console.log(data.sections.length);
  // console.log(JSON.stringify(data, null, 2));
  
  return data;
}

export function slugify(text: string): string {
  return text
    .toString()                           // Cast to string (optional)
    .normalize('NFKD')                    // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .toLowerCase()                        // Convert the string to lowercase letters
    .trim()                               // Remove whitespace from both sides of a string (optional)
    .replace(/\s+/g, '-')                 // Replace spaces with -
    .replace(/[^\w\-]+/g, '')             // Remove all non-word chars
    .replace(/\-\-+/g, '-');              // Replace multiple - with single -
}

export function topicNavigationPath(file: string): string {
  const result = path.join(basePagePath(), pageSubpath(file), 'navigation.json');

  return result;
}

// File should be the page file with .md
export function pageSubpath(file: string): string {
  // console.log('----------------------------------------------------------------------');
  // console.log('pageSubpath.file        :', file);
  // console.log('basePagePath            :', basePagePath());
  
  // console.log('basename                 :', path.basename(file));
  // console.log('basename (-ext)          :', path.basename(file, '.md'));
  // console.log('dirname                  :', path.dirname(file));
  // console.log('extname                  :', path.extname(file));
  // console.log('isAbsolute               :', path.isAbsolute(file));
  // const pages = new URL('../pages/', import.meta.url);
  // console.log('relative                 :', path.relative(file, pages.pathname));
  // console.log('relative_dir             :', path.dirname(file).substring(pages.pathname.length));
  return path.dirname(file).substring(basePagePath().length);
}

export function basePagePath(): string {
  const result = new URL('../pages/', import.meta.url).pathname

  console.log('import.meta.url         :', import.meta.url);
  console.log('basePagePath            :', result);

  return new URL('../pages/', import.meta.url).pathname
  // return '/Users/davidcruwys/dev/sites/appydave-v2.com/src/pages/';
  // const result = new URL('../pages/', import.meta.url).pathname;
  // const result = '/Users/davidcruwys/dev/sites/appydave-v2.com/src/pages/';

  // console.log('basePagePath            :', result);
  // console.log(result === '/Users/davidcruwys/dev/sites/appydave-v2.com/src/pages/' ? "GOOD" : "******* BAD *******");
  // if (result !== '/Users/davidcruwys/dev/sites/appydave-v2.com/src/pages/') {
  //   console.log("******* BAD *******1");
  //   console.log(result);
  //   console.log('/Users/davidcruwys/dev/sites/appydave-v2.com/src/pages/');
  //   console.log("******* BAD *******2");
  // }
  // return result;
}
