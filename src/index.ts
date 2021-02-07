import zlib from 'zlib';
import { Slot } from 'qoq';
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
   * An optional string, which specifies what encoders to use for requests
   * without Accept-Encoding. Default: 'idenity'.
   */
  defaultEncoding?: string

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

export interface CompressContextProps {
  /**
   * Ignore filter() configuration when set `true`
   */
  compress?: boolean;
}

export class Compress extends Slot<Slot.Web, CompressContextProps> {
  constructor(options: CompressOptions = {}) {
    super();
    this.use(compress(options));
  }
}
