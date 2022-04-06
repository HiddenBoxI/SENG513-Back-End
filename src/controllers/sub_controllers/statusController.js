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
            data,
        };
    } catch ({message}) {
        // console.log(err);
        if (message === '403') {
            ctx.body = {
                code: 403,
                message: 'Status not found',
            };
        }else{
            console.error(err);
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
        if (message === '405') {
            ctx.body = {
                code: 405,
                message: 'Update status info Failed!',
            };
        }else{
            console.error(err);
            ctx.throw(500);
        }
    }
});

export default router;
