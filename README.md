# qoq-compress
Compress for qoq based on koa-compress that support gzip, deflate and brotli. You are required to use `node@10.16+` before you can use `brotli` encoding.

# Installation
```bash
yarn add qoq-compress
```

# Usage
```typescript
import { WebSlotManager } from 'qoq';
import { Compress } from 'qoq-compress';

export const webSlots = WebSlotManager.global(new Compress());
```

# Options
TODO:
