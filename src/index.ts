import { Slot } from 'qoq';
import compress, { CompressOptions } from 'koa-compress';

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
