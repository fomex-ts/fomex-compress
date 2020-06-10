import zlib from 'zlib';
import { Plugin } from 'fomex';
import compress from 'koa-compress';

export interface CompressOptions {
  /**
   * An optional function that checks the response content type to decide whether to compress. By default, it uses compressible.
   */
  filter?: (mimeType: string) => boolean;

  /**
   * Minimum response size in bytes to compress. Default 1024 bytes or 1kb.
   */
  threshold?: number | string;

  /**
   * Options for brotli compression.
   */
  br?: zlib.BrotliOptions | false;

  /**
   * Options for gzip compression.
   */
  gzip?: zlib.ZlibOptions | false;

  /**
   * Options for deflate compression.
   */
  deflate?: zlib.ZlibOptions | false;
}

interface Custom {
  // Ignore filter() configuration when set `true`
  compress?: boolean;
}

export class PluginCompress extends Plugin<Plugin.Web, Custom> {
  constructor(options: CompressOptions = {}) {
    super();
    this.use(compress(options) as any);
  }
}
