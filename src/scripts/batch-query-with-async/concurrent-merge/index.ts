import { BatchProcessor } from "./batch";
import { IProcessParams, IBatchProcessorOpts } from "./declare";


// 经过与平台 欧兴杨 沟通, 公共的异步携带会在未来迁移重构, 由于平台方案与业务不能完全匹配,
// 比如 url 和参数等都有适配问题,
// 为了避免尽量少的侵入, 此处进行了重写, 并且后端的 url 也单独进行处理
export async function batchProcessor(params: IProcessParams, opts?: IBatchProcessorOpts) {
  return BatchProcessor.getInstance(opts).process(params)
}
