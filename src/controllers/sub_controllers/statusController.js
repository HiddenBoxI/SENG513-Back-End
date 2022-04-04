import Router from '@koa/router';
import {getStatusInfo} from '#src/services/statusService.js'

const router = new Router();

router.get('/statusInfo', async(ctx) => {
    const {id} = ctx.request.query;

    try {
        const data = await getStatusInfo(id);
        ctx.body={
            code:200,
            message: "get status successful!",
            data
        }


    }catch (err){
        if(err===403){
            ctx.body={
                code:403,
                message: "Status not found"
            }
        }
        console.log(err);
    }
})

export default router;

