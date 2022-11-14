
import {process} from '../batch';
describe("顺序处理逻辑", ()=>{
    it("默认不设置间隔, 多次请求, 第一次会立即发出, 应该用第一次和最后一次", ()=>{

    })

    it("冒一下烟", (done)=>{
        process({param: {id: "1", name: "test1"}} ).then(d=>{
            expect(JSON.stringify(d)).toEqual(JSON.stringify({id: "1", name: "test1"}))
            done();
        }).finally(()=>{
            console.log('finally');
            //done();
        })
    })

    it("多次请求, 应该只有第一次", (done)=>{

        jest.setTimeout(1500);

        const p1 = process({param: {id: "1", name: "test1"}} );
        const p2 = process({param: {id: "2", name: "test1"}} );
        const p3 = process({param: {id: "3", name: "test1"}} );

        Promise.all([p1,p2,p3]).then(d=>{
            console.log("d is ", d);
            const ret = d.find(i=>i);
            expect(JSON.stringify(ret)).toEqual(JSON.stringify({id: "1", name: "test1"}))
            console.log(JSON.stringify(d));
            done();
        }).finally(()=>{
            console.log('finally');
            //done();
        })
    })
    it("设置间隔的话, 多次请求, 应该有第一次和最后一次", (done)=>{

        const p1 = process({param: {id: "1", name: "test1"}} );
        const p2 = process({param: {id: "2", name: "test1"}} );

        setTimeout(()=>{
            const p3 = process({param: {id: "3", name: "test1"}} );
            const p4 = process({param: {id: "4", name: "test1"}} );
            const p5 = process({param: {id: "5", name: "test1"}} );
            Promise.all([p1,p2,p3,p4,p5]).then(d=>{
                // expect(JSON.stringify(d)).toEqual(JSON.stringify({id: "1", name: "test1"}))
                expect(JSON.stringify(d.filter(i=>i).map(i=>i.id))).toEqual(JSON.stringify(["1","3"]))
                // console.log(JSON.stringify(d));
                done();
            }).finally(()=>{
                console.log('finally');
                //done();
            })
        }, 1500)


    })
})