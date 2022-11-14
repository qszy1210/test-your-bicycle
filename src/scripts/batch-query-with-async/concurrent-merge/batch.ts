import { BatchProcessorResult, IBatchProcessorOpts, IBatchProcessorParams, IProcessParams } from "./declare";

interface IProcessItem {
  params: IProcessParams;
  promise: Promise<any>;
  resolve(value: any): void;
  reject(error: any): void;
}

class ProcessItem implements IProcessItem {
  params: IProcessParams;
  promise: Promise<any>;
  private resolvefn: (res: any) => void = ()=>void 0;
  private rejectfn: (error: any) => void = ()=>void 0;

  constructor(p: IProcessParams) {
    this.params = p;
    this.promise = new Promise((resolve, reject) => {
      this.resolvefn = resolve;
      this.rejectfn = reject;
    });
  }

  public resolve(value: any) {
    if (this.resolvefn) {
      this.resolvefn(value);
      this.resolvefn = ()=>void 0;
    }
  }

  public reject(error: any) {
    if (this.rejectfn) {
      this.rejectfn(error);
      this.rejectfn = ()=>void 0;
    }
  }
}



class ProcessorQueue {

  private processing = false;
  private items: IProcessItem[] = [];

  constructor(private opts?: IBatchProcessorOpts) {}

  private async execute() {
    const items = this.items;
    this.items = [];
    this.batchExecute(items, this.opts);
  }

  async addItem(item: IProcessItem) {
    this.items.push(item);
    if (!this.processing) {
      this.processing = true;
      setTimeout(() => {
        this.execute();
        this.processing = false;
      }, 0);
    }
  }

  async batchExecute(items: IProcessItem[], opts?: IBatchProcessorOpts) {
    let batchParams: IBatchProcessorParams = {
      items: [],
    };

    batchParams = items.reduce((params, item) => {
      params.items.push(item.params);
      return params;
    }, batchParams);

    const batchResult = await this.batchExecuteProcessor(batchParams, opts);

    items.forEach((x, index) => {
      const error = batchResult.faileds[index];
      if (error) {
        x.reject(error);
        return;
      }
      const data = batchResult.success[index];
      x.resolve(data);
    });
  }

  async batchExecuteProcessor(params: IBatchProcessorParams, opts?: IBatchProcessorOpts): Promise<BatchProcessorResult> {
    const client = (opts && opts.client);
    const res = await client.request({...params, ...opts});
    return res;
  }
}

export class BatchProcessor {
  static instance: BatchProcessor;
  static getInstance(opts?:IBatchProcessorOpts) {
    if (!BatchProcessor.instance) {
      BatchProcessor.instance = new BatchProcessor(opts);
    }
    return BatchProcessor.instance;
  }

  constructor(private opts?:IBatchProcessorOpts) {}

  private queue = new ProcessorQueue(this.opts);

  async process(p: IProcessParams) {
    const item = this.createItem(p);
    this.queue.addItem(item);
    return item.promise;
  }

  private createItem(p: IProcessParams): IProcessItem {
    return new ProcessItem(p);
  }
}




