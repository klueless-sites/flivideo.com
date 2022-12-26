export default class Heading {
  depth: number;
  sequence: number;
  text: string;
  opts: any;

  parent: Heading | null;
  headings: Heading[] | null;

  constructor(depth: number, sequence: number, text: string, opts: any = {}) {
    this.depth = depth;
    this.sequence = sequence;
    this.text = text;
    this.opts = opts;
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

  data() {
    let result: any = {
      depth: this.depth,
      sequence: this.sequence,
      text: this.text,
      ...this.opts,
      headings: this.headings?.map((h) => h.data()),
    };
    return result;
  }

  debug(label: string | null = null) {
    if (label) {
      console.log(`- ${label} ------------------------------------------------------------`);
    }
    console.log(`depth       : ${this.depth}`);
    console.log(`sequence    : ${this.sequence}`);
    console.log(`text        : ${this.text}`);
    console.log(`opts        : ${this.opts}`);
    if (this.headings) {
      console.log(`headings    : ${this.headings.map((h) => h.text).join(", ")}`);
    }
  }
}
