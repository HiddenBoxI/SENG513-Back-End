import Router from '@koa/router';
import { login, signin, updateInfo } from '#src/services/userService.js';

const router = new Router();

router.post('/loginApi', async ctx => {
    const { nickname, password } = ctx.request.body;

    try {
        const { id } = await login(nickname, password);
        ctx.body = {
            code: 200,
            message: 'Logged in',
            data: {
                id,
            },
        };
    } catch ({ message }) {
        if (message === '400') {
            // ctx.status = 400;
            ctx.body = {
                code: 400,
                message: 'cannot find the user',
            };
        } else if (message === '401') {
            // ctx.status = 400;
            ctx.body = {
                code: 401,
                message: 'password incorrect',
            };
        } else {
            console.error(message);
            ctx.throw(500);
        }
    }
});

router.post('/signInApi', async ctx => {
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
            };
        } else {
            console.error(message);
            ctx.throw(500);
        }
    }
});

router.post('/modifyUserInfoApi', async ctx => {
    const { id, nickname, password } = ctx.request.body;

    try {
        const modifiedInfo = await updateInfo(id, nickname, password);
        ctx.body = {
            code: 200,
            message: 'Update successful!',
            data: modifiedInfo,
        };
    } catch ({ message }) {
        if (message === '407') {
            // ctx.status = 400;
            ctx.body = {
                code: 407,
                message: 'User is not exist',
            };
        } else if (message === '408') {
            ctx.body = {
                code: 408,
                message: 'Duplicate username!!',
            };
        } else if (message === '409') {
            ctx.body = {
                code: 409,
                message: 'Field should not be empty!!',
            };
        } else {
            console.error(message);
            ctx.throw(500);
        }
    }
});

export default router;
