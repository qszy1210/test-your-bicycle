//请求



const url = "urlStr";

function restrictRequest(totalCount: number, maxConcurrentCount: number) {
    var count = 0;
    function request(url: string) {
        var c = ++count;
        if (count > totalCount) return;
        return new Promise(rel=>{
            setTimeout(()=>rel("done"+c),300)
        }).then(d => {
            request(url);
            console.log("count is ", d);
            return d;
        })
    }
    for (var i = 0; i < maxConcurrentCount; i++) {
        request(url);
    }
}

restrictRequest(20, 4);