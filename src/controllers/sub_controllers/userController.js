import Router from '@koa/router';
import { login,signin } from '#src/services/userService.js';

const router = new Router();

router.post('/loginApi', async (ctx) => {
    const { nickname, password } = ctx.request.body;

    try {
        await login(nickname, password);
        // console.log('res', res);
        ctx.body = {
            code: 200,
            message: 'Logged in',

        };
    } catch ({ message }) {
        if (message === '400') {
            // ctx.status = 400;
            ctx.body = {
                code: 400,
                message: 'cannot find the user',
            }
            
        }
        if (message === '401') {
            // ctx.status = 400;
            ctx.body = {
                code: 401,
                message: 'password incorrect',
            }
        }
    }
});

router.post('/signInApi',async (ctx) => {
    const { nickname, password } = ctx.request.body;

    try {
        const res = await signin(nickname, password);
        ctx.body = {
            code: 200,
            message: 'SignIn successful!',
        };
    } catch ({ message }) {
        if (message === '402') {
            // ctx.status = 400;
            ctx.body = {
                code: 402,
                message: 'User already exists',
            }
        }
    }
})

export default router;
