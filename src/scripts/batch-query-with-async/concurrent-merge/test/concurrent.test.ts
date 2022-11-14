import {batchProcessor} from '../index';
import {IProcessParams} from '../declare';

import {axios} from '../../../util/axios';

jest.mock('../../../util/axios', ()=>({
    axios: {

    create: (url: string)=>({
        request: async (params: any)=>{
            const ret = {} as any;

            ret["success"] = [params];
            ret["faileds"] = [];

            return ret;
        }
    })

    }
}))


describe('测试concurrent', ()=>{
    test('应该可以执行...', (done)=>{



        const param: IProcessParams = {
            "processorName": "test",
            "params": {"project": "i'm a project, take easy"}
        }

        console.log("axios is", axios);

        const client: {request: (params: any)=>any} = axios.create("your url here, i mock, try everything~");

        const mockFn = jest.fn(()=> async (params: any)=>{
            const ret = {} as any;

            ret["success"] = [params];
            ret["faileds"] = [];

            return ret;
        })
        client.request = mockFn()

        const ret = batchProcessor(param, {
            client
        })
        const ret2 = batchProcessor(param, {
            client
        })
        const ret3 = batchProcessor(param, {
            client
        })

        // promise 数组
        const promises = []
        promises.push(ret)
        promises.push(ret2)
        promises.push(ret3)

        expect.hasAssertions();
        Promise.all(promises)
        .then(d=>{
            expect(d).toBeTruthy();
            done()
        })

        expect(mockFn).toBeCalledTimes(1);

    })
})
