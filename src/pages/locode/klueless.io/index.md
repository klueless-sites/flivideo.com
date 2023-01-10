---
layout: ~/layouts/BaseLayout.astro
title: Klueless.IO LoCode generator
---

## Overview

[KlueLess.io](https://klueless.io/) - Static Application Factory

The **Klue** is to do **Less**

> How does a startup build a $million app on a tiny budget in a weekend.

> How can an enterprise harness agile / startup methodologies while maintaining quality.

## Usage Instructions

These are [my own](https://AppyDave.com) personal usage instructions until such time as I have a chance to document this.

```bash
# Create a new .builder in the current folder using the Rails template
km2 new . -t rails \
  --description "Swelte Wordle is a daily word game written in Swelte and TailwindCSS" \
  --user-story "As a Developer, I want practice my JS/HTML skills, so that I keep up to date"
```

```bash
# Create a new .builder in the astro_concepts folder using the ruby GEM template
km2 new astro_concepts -t ruby_gem \
  --description "astro_concepts is set of ruby functions testing code concepts that will be converted to TypeScript use in Astro Projects" \
  --user-story "As a Developer, I want to write first in Ruby and then convert to TypeScript, so that I can understand the process more completley"
```