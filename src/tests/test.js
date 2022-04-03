import Koa from "koa";
import fs from "fs";
const app = new Koa();

app.use(async (ctx) => {
    ctx.type = "html";
    await new Promise((res,rej) => {
        fs.readFile("./index.html","utf8",(err,data)=>{
            if (err) {
                console.error(err);
                rej(err)
            }
    
            res(data);
            // console.log(lalala);
            // lalala = data;
            // console.log("dododo\n", lalala);
    
            // console.log(data);
            // console.log(ctx);
            // ctx.body = data;
        })
    }).then(data => {
        ctx.body = data;
    })
})

app.listen(3000);
console.log(`Demo start at port 3000`);
