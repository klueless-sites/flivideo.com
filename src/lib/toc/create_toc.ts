import Heading from './heading';

export default class CreateToc {
  toc: Heading;
  current_heading: Heading;

  constructor() {
    this.toc = new Heading("*", '-', 0, -1);
    this.current_heading = this.toc;
  }

  process(astro_headings: any[]) {
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

  private data() {
    return (this.toc.headings || []).map((h) => h.data());
  }

  private process_heading(heading: Heading) {
    if (heading.depth > this.current_heading.depth) {
      this.add_child_heading(heading);
    } else if (heading.depth === this.current_heading.depth) {
      this.add_sibling_heading(heading);
    } else if (heading.depth < this.current_heading.depth) {
      this.add_upstream_heading(heading);
    }
  }

  private add_child_heading(heading: Heading) {
    this.current_heading.add_heading(heading);
    this.current_heading = heading;
  }

  private add_sibling_heading(heading: Heading) {
    if (this.current_heading!.parent === null) {
      return;
    }
    this.current_heading = this.current_heading.parent;
    this.add_child_heading(heading);
  }

  private add_upstream_heading(heading: Heading) {
    while (this.current_heading.valid() && heading.depth < this.current_heading.depth) {
      if (this.current_heading.parent === null) {
        throw new Error("current_heading.parent is null");
      }

      this.current_heading = this.current_heading.parent;
    }

    // There is no upstream heading to attach to, so just add a new root node
    if (this.current_heading.root()) {
      return this.add_child_heading(heading);
    }

    this.add_sibling_heading(heading);
  }
}
