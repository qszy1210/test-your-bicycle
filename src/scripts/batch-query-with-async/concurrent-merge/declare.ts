
/**
 * 表单处理的params
 */
export interface IFormProcessParams {
  params?: { [key: string]: any };
}

/**
 * 单个processor的参数
 */
export interface IProcessParams {
  processorName: string;
  params?: any;
}

export type AsyncClientProcessor = (params: IFormProcessParams, client: any) => Promise<Result<any, any>>;
export type AsyncProcessor = (params: IFormProcessParams) => Promise<Result<any, any>>;

/**
 * 批量处理的参数
 */
export interface IBatchProcessorParams {
  items: IProcessParams[];
}

export interface Result<T, E> {
  data?: T;
  error?: E;
}

export interface BatchProcessorResult {
  success: { [key:number]: any }
  faileds: { [key:number]: any }
}

export interface IBatchProcessorOpts{
  // url: string, //批量接口自定义的 url, 需要 go 端对应尽心实现, 一般适用于 go 端也有批量接口的情况
  client: any; //请求的句柄
  // isBatch: boolean // go访问java端的接口是否批量处理
}