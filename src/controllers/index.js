/**
 * @Author Kaiwen Jia
 * @UCID 30050173
 * About the server and its code, launch on port 8000
 */

import Koa from "koa";
import { createServer } from "http";
import { Server } from "socket.io";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import format from "./utils/dateformat.jsmat.js.js";

Date.prototype.format = format;
console.log(new Date().format("hh:mm:ss"));

const app = new Koa();
app.use(bodyParser());
const httpServer = createServer(app.callback());


// CORS

const io = new Server(httpServer, {
    cors: {
        origin: "*",
    },
});

io.on("connection", socket => {
    console.log('a user connected');
    socket.on('disconnect',()=> {
        console.log('user disconnected');
        // ...
    });

    socket.on('boardmessage',data => {
        console.log(data);
        // io.emit('echoreturn',data);
        socket.broadcast.emit('data',data.toString());
        // io.emit('boardmessage',data.toString());
    })
});





httpServer.listen(8000, () => {
    console.log("listening on *:8000");
});
