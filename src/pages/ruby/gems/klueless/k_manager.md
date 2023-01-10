---
layout: ~/layouts/BaseLayout.astro
title: K-Manager
---

## Overview

K-Manager provides a managed host for documents and resources for code generator execution via KlueLess

These are my personal notes: this project is not end-user developer friendly

## Command line examples

```bash
km2 -h
km2 version
```

### New builder

```bash
# Create a new folder called xmen and put a .builders directory under it
km2 new xmen
km2 new xmen --log-level debug        # logs project, build and template folders plus others
```

### Watch builder directory

```bash
km2 watch xmen                        # implicit watcher
km2 watch xmen/.builders              # explicit watcher
```

### Stats about builder directory

```bash
km2 i xmen

# [ Information ]-------------------------------------------------------
# Project Name                  : xmen
# Project Folder                : ~/dev/x/xmen
# Builder Folder                : ~/dev/x/xmen/.builders
# Project File Count            : 0
# Builder File Count            : 4
# [ Builder Files ]-----------------------------------------------------
```

## New project examples

### Setup ruby gem

```bash
# Create folder xmen and install a .builder folder with new ruby_gem DSL
km2 new xmen -t ruby_gem                  # This may be deprecated in place of other techniques via k_starter
km2 new xmen -t ruby_gem -f true          # force overwrite

# setup a .builder folder in an existing ruby gem
cd astro_concepts

# Setup description and user-story
km2 new -t ruby_gem \
  --description "astro_concepts is set of ruby functions testing code concepts that will be converted to TypeScript use in Astro Projects" \
  --user-story "As a Developer, I want to write first in Ruby and then convert to TypeScript, so that I can understand the process more completely"
```

### Setup project plan

```bash
# I tend to use this setup when I want to add a .builder into my GEMs with basic tooling

km2 new \
  --description "Add draw-io graph support for project plan and domain modeling"
```

### Setup a ruby gem

### Setup a svelte application

```bash
km2 new swordle-svelte -t svelte 
```

### Setup a nuxt3 application

```bash
km2 new tailwindcssbuilder -t nuxt3
```