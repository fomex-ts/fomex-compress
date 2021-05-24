# qoq-compress

Compress for qoq based on [koa-compress](https://github.com/koajs/compress) that support gzip, deflate and brotli.

[![License](https://img.shields.io/github/license/qoq-ts/qoq-compress)](https://github.com/qoq-ts/qoq-compress/blob/master/LICENSE)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/qoq-ts/qoq-compress/CI/master)](https://github.com/qoq-ts/qoq-compress/actions)
[![Codecov](https://img.shields.io/codecov/c/github/qoq-ts/qoq-compress)](https://codecov.io/gh/qoq-ts/qoq-compress)
[![npm](https://img.shields.io/npm/v/qoq-compress)](https://www.npmjs.com/package/qoq-compress)

# Installation

```bash
yarn add qoq-compress
```

# Usage

```typescript
import { WebSlotManager } from 'qoq';
import { Compress } from 'qoq-compress';

export const webSlots = WebSlotManager.use(new Compress());
```

# Options

@see [koa-compress](https://github.com/koajs/compress/blob/master/README.md)
