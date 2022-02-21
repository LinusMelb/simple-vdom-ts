# Simple Virtual DOM Implemented in Typescript

[![forthebadge made-with-typescript](https://badgen.net/badge/Made%20with/Typescript/blue)](https://www.typescriptlang.org/)

**Note**: Code implementation is insipred by https://github.com/livoras/simple-virtual-dom

Simple virtual dom implementation in typescript, which consists of 3 parts: `render`, `diff` and `patch`.

- `Render` is to manipulate the actual DOM based on virtual Element.
- `Diff` is to compare between two different virtual DOMs and return the applicable patches.
- `Patch` is to apply applicable patches to actual DOM based on changes found between old and new vitual DOMs.

### To test it locally

```bash
npm install

# Open browser at localhost:3000 to preview your changes in index.ts
npm run serve
```

### TODO

- [x] vDOM full implemented
- [ ] Write comprehensive documentation
- [ ] Add unit tests
- [ ] Add examples
- [ ] Publish to npm registry
