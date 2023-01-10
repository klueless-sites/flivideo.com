---
layout: ~/layouts/BaseLayout.astro
title: Git
---

## Useful git commands


### git checkout

Recover deleted folder in local branch using git

```bash
git checkout /path/to/deleted/folder
```

### Committed to Master (not pushed)

I accidentally wrote and committed code on my local master branch, but I had not pushed it.

#### Revert the change
```bash
# This will revert the commit, but put the committed changes back into your index.
git reset --soft HEAD^
```

I did not have a branch created yet for the code changes and so I followed this followed

```bash
git stash
git pull
git checkout -b desired_branch_name
git stash pop
```


If you do have a branch then you can follow this flow. [Stack overflow](https://stackoverflow.com/questions/2941517/how-to-fix-committing-to-the-wrong-git-branch)

Assuming the branches are relatively up-to-date with regard to each other, git will let you do a checkout into the other branch:
```
git checkout branch
git commit -c ORIG_HEAD
```

The `-c ORIG_HEAD` part is useful to not type commit message again.