import Router from '@koa/router';
import { getStatusInfo,insertStatusInfo } from '#src/services/statusService.js';

const router = new Router();

router.get('/statusInfo', async ctx => {
    const { id } = ctx.request.query;

    try {
        const data = await getStatusInfo(id);
        ctx.body = {
            code: 200,
            message: 'get status successful!',
            data:data[0],
        };
    } catch ({message}) {
        // console.log(err);
        if (message === '403') {
            ctx.body = {
                code: 403,
                message: 'Status not found',
            };
        }else if(message === '405'){
            ctx.body = {
                code: 405,
                message: 'Id should not be empty',
            };
        }else{
            console.error(message);
            ctx.throw(500);
        }
    }
});

router.post('/updateStatusInfo', async ctx => {
    const reqBody = ctx.request.body;
    try {
        await insertStatusInfo(reqBody);
        ctx.body = {
            code: 200,
            message: 'Update statistic info successful!',
        };
    } catch ({message}) {
        if (message === '406') {
            ctx.body = {
                code: 406,
                message: 'Update status info Failed!',
            };
        }else if(message === '405'){
            ctx.body = {
                code: 405,
                message: 'Id should not be empty',
            };
        }else{
            console.error(message);
            ctx.throw(500);
        }
    }
});

export default router;
