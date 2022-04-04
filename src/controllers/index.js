/**
 * @Author Kaiwen Jia
 * @UCID 30050173
 * About the server and its code, launch on port 8000
 */

import Koa from 'koa';
import { createServer } from 'http';
import { Server } from 'socket.io';
import bodyParser from 'koa-bodyparser';
import format from '../utils/dateformat.js';
import loginController from './sub_controllers/userController.js';
import statusController from './sub_controllers/statusController.js'
import router from "./sub_controllers/userController.js";

Date.prototype.format = format;
console.log(new Date().format('hh:mm:ss'));

const app = new Koa();
app.use(bodyParser());
const httpServer = createServer(app.callback());

// CORS
const io = new Server(httpServer, {
    cors: {
        origin: '*',
    },
});

io.on('connection', socket => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
        // ...
    });

    socket.on('boardmessage', data => {
        console.log(data);
        // io.emit('echoreturn',data);





        socket.broadcast.emit('data', data.toString());
        // io.emit('boardmessage',data.toString());
    });


});

app.use(loginController.routes());
app.use(statusController.routes());

httpServer.listen(8000, () => {
    console.log('listening on *:8000');
});
