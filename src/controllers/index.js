/**
 * @Author Kaiwen Jia
 * @UCID 30050173
 * About the server and its code, launch on port 8000
 */

import Koa from 'koa';
import { createServer } from 'http';
import bodyParser from 'koa-bodyparser';
import format from '../utils/dateformat.js';
import loginController from './sub_controllers/userController.js';
import statusController from './sub_controllers/statusController.js';
import cors from 'koa2-cors';
import { createWebsocket } from './sub_controllers/webSkt3.js';

Date.prototype.format = format;

console.log(new Date().format('hh:mm:ss'));

const app = new Koa();
app.use(bodyParser());
app.use(cors());
const httpServer = createServer(app.callback());
createWebsocket(httpServer);

app.use(loginController.routes());
app.use(statusController.routes());

httpServer.listen(8000, () => {
    console.log('listening on *:8000');
});
