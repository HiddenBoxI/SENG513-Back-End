/**
 * @Author Kaiwen Jia
 * @UCID 30050173
 * About the server and its code, launch on port 8000
 */

import Koa from 'koa';
import {createServer} from 'http';
import {Server} from 'socket.io';
import bodyParser from 'koa-bodyparser';
import format from '../utils/dateformat.js';
import loginController from './sub_controllers/userController.js';
import statusController from './sub_controllers/statusController.js'
import router from "./sub_controllers/userController.js";
import {get} from "koa/lib/request";

Date.prototype.format = format;

console.log(new Date().format('hh:mm:ss'));

const app = new Koa();
app.use(bodyParser());
const httpServer = createServer(app.callback());
let allMemberData = [];
let rani = 0;
let map1 = new Map();

// CORS
const io = new Server(httpServer, {
    cors: {
        origin: '*',
    },
});

io.on('connection', socket => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        // let obToR = allMemberData.indexOf(map1.get(socket.id));
        //allMemberData.splice(obToR,1);

        console.log(`user ${socket.id} disconnected`);

        map1.delete(socket.id);
        console.log("nowMap", map1)
    });

    socket.on('boardmessage', data => {
        console.log(data);
        // io.emit('echoreturn',data);

        socket.broadcast.emit('data', data.toString());
        // io.emit('boardmessage',data.toString());


    });



    socket.on("avatarInfor", data => {


        // console.log(data);
        // if(!map1.has(socket.id)){
        // console.log({allMemberData});


        // allMemberData.push(data);

        map1.set(socket.id, data);
        console.log("oriMap", map1)


        // }
        io.emit('returnInf', [...map1.values()]);

        // allMemberData.push(data);
        // console.log({allMemberData});
        // for(let i=0;i<allMemberData.length;i++){
        // for(let j=i+1;j<allMemberData.length;){
        //     if(allMemberData[i].id===allMemberData[j].id){
        //         allMemberData.splice(j,1);
        //
        //     }
        //     else {
        //         j++;=122
        //     }
        // }
        //
        // }
        // io.emit('returnInf',{allMemberData});
    });


});


app.use(loginController.routes());
app.use(statusController.routes());

httpServer.listen(8000, () => {
    console.log('listening on *:8000');
});
