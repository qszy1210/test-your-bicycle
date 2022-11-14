
import {IParams} from './declare';

class ProcessorItem {
    constructor(opts: IParams) {
        const {id, name} = opts.param;
        this.id  = id;
        this.name  = name;
    }
    id:string
    name: string
    toString() {
        return this.id + ":"+this.name;
    }
}

class ProcessorQueue{

    private items: ProcessorItem[] = []

    isDoing: boolean = false;

    add(item: ProcessorItem){
        this.items.push(item);
        console.log("this.items:")
        console.log(this.items && this.items.length);
        return this.execute();
    }

    // 执行
    execute(){

        // 不存在, 不处理;
        if (!this.items ||  !this.items.length) {
            console.log("this.items 不存在")
            console.log(this.items);
            // to show todo
            return Promise.reject("items not exists");
        }

        // 如果在处理, 那么只保留队列第一个和最后一个(第一个为doing数据)
        // 复杂化的话, 可以将两个队列进行细分为 todoItems  doingItems

        //默认我们认为只有1个数组在这里边
        if (this.isDoing && this.items.length>=2) {
            while (this.items.length>=2) {
                this.items.shift(); // 只保留最后一个
                console.log("after shift1", this.items);
            }
        }
        //空闲
        if (!this.isDoing) {
            while (this.items.length>=2) {
                this.items.shift(); // 只保留最后一个
                console.log("after shift2", this.items);
            }
            const item = this.items.shift();
            console.log("todo item is ", item);
            return this.doExecute(item);
        }
        return Promise.resolve();

    }

    doExecute(item: ProcessorItem|undefined) {
        // console.log("doExecute")
        const ret = item || {};
        this.isDoing = true;
        console.log("doExecute  in setTimeout")
        return new Promise(rel=>{
            // 延迟一秒返回结果
            // 或者增加你的请求here~
            setTimeout(()=>{
                this.isDoing = false;
                rel(ret);
            }, 1000)
        })
    }
}

class BatchProcessor {
    constructor(batchParam: any) {
        this.queue = new ProcessorQueue();
    }

    static instance: BatchProcessor;

    queue: ProcessorQueue;

    static getInstance(batchParam: any) {
        if (!BatchProcessor.instance) {
            BatchProcessor.instance = new BatchProcessor(batchParam);
        }
        return BatchProcessor.instance;
    }

    process(params: IParams) {
        console.log("process");
        const item = new ProcessorItem(params);
        return this.queue.add(item);
    }
}


// 处理函数
export async function  process(params: IParams): Promise<any> {
    const prRet = await BatchProcessor.getInstance(params).process(params);
    return prRet;
}