# fomex-compress
Compress for fomex based on koa-compress that support gzip, deflate and brotli. You are required to use `node@10.16+` before you can use `brotli` encoding.

# Installation
```bash
yarn add fomex-compress
```

# Usage
```typescript
import { baseWebRouter } from 'fomex';
import { PluginCompress } from 'fomex-compress';

export const webRouter = baseWebRouter.global(new PluginCompress());
```

# Options
TODO:
