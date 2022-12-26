export default class Heading {
  text: string;
  slug: string;
  depth: number;
  sequence: number;

  parent: Heading | null;
  headings: Heading[] | null;

  constructor(text: string, slug: string, depth: number, sequence: number) {
    this.text = text;
    this.slug = slug;
    this.depth = depth;
    this.sequence = sequence;

    this.parent = null;
    this.headings = null;
  }

  add_heading(heading: Heading) {
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
    let result: any = {
      text: this.text,
      slug: this.slug,
      depth: this.depth,
      sequence: this.sequence,
      headings: this.headings?.map((h) => h.data()),
    };
    return result;
  }
}
