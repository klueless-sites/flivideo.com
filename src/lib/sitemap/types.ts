//   "topic": {
//     "title": "Using Faker with FactoryBot",
//     "xxx": "I think in this area I want to put the SEO keywords, description and other useful data that is needed across the topic",
//     "tags": ["ruby", "ruby/gems", "factory-bot", "faker", "rails"]
//   },
import { slugify } from '../util';

interface ILink {
  title: string;
  slug: string;
  full_slug? : string;
}

export class Link implements ILink {
  title: string;
  slug: string;
  full_slug?: string;

  constructor(title?: string, slug?: string) {
    this.title = title || '';
    this.slug = slug || slugify(this.title);
  }

  // get data() {
  //   const
    
  //   return {
  //     title: this.title,
  //     slug: this.slug,
  //     full_slug: this.full_slug,
  //     topics: this.topics.map((topic) => topic.data),
  //     sections: this.sections.map((section) => section.data),
  //   };
  // }
}

// export class Topics {
//   topics: Topic[];

//   constructor() {
//     this.topics = [];
//   }

//   add_topic(title: string, slug: string, tags: string[]): Topic {
//     const topic = new Topic(title, slug, tags);
//     this.topics.push(topic);
//     return topic;
//   }
// }

export class Topic extends Link {
  tags: string[];
  topics: Topic[];
  sections: Section[];

  constructor(title: string, slug: string, tags: string[]) {
    super(title, slug);

    this.tags = tags;

    this.topics = [];
    this.sections = [];
  }

  add_topic(title: string, slug: string, tags: string[]): Topic {
    const topic = new Topic(title, slug, tags);
    this.topics.push(topic);
    return topic;
  }
}

export class Sitemap extends Topic {
  constructor() {
    super('Home', '/', []);
  }

  // public home(title: string, slug?: string, key?: string): void {
  //   this.home_link = new Link(title, slug);
  // }
}

export class Section {
  title: string;
  links: ILink[];

  constructor(title: string, links: ILink[]) {
    this.title = title;
    this.links = links;
  }
}

