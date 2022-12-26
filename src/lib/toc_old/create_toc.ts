import type Heading from './heading';

export default class CreateToc {
  headings: Heading[];
  hierarchies: Heading[];
  hierarchy_root: Heading | null;
  current_heading: Heading | null;

  constructor(headings: Heading[]) {
    this.headings = headings;
    this.hierarchies = [];
    this.hierarchy_root = null;
    this.current_heading = null;
  }

  process() {
    this.headings.forEach((heading) => {
      this.process_heading(heading);
    });
  }

  data() {
    return this.hierarchies.map((h) => h.data());
  }

  debug() {
    this.hierarchies.forEach((hierarchy) => {
      console.log(JSON.stringify(hierarchy.data(), null, 2));
    });
  }

  private process_heading(heading: Heading) {
    if (this.hierarchy_root === null) {
      return this.new_hierarchy(heading);
    }
    if (heading.depth > this.current_heading!.depth) {
      return this.add_child_heading(heading);
    }
    if (heading.depth === this.current_heading!.depth) {
      return this.add_sibling_heading(heading);
    }

    // When an up-stream heading is encountered, you have to navigate up to the existing
    // hierarchy or create a new hierarchy out side of the current hierarchy
    if (heading.depth <= this.hierarchy_root.depth) {
      return this.new_hierarchy(heading);
    }
    if (heading.depth < this.current_heading!.depth) {
      return this.add_upstream_heading(heading);
    }
  }

  private new_hierarchy(heading: Heading) {
    this.hierarchies.push(heading);
    this.hierarchy_root = heading;
    this.current_heading = heading;
  }

  private add_child_heading(heading: Heading) {
    this.current_heading!.add_heading(heading);
    this.current_heading = heading;
  }

  private add_sibling_heading(heading: Heading) {
    if (this.current_heading!.parent === null) {
      return;
    }
    this.current_heading = this.current_heading!.parent;
    this.add_child_heading(heading);
  }

  private add_upstream_heading(heading: Heading) {
    while (this.current_heading !== null && heading.depth < this.current_heading.depth) {
      if (this.current_heading.parent === null) {
        throw new Error("current_heading.parent is null");
      }
      this.current_heading = this.current_heading.parent;
    }
    this.add_sibling_heading(heading);
  }
}
