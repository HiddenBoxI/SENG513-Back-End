import { Server } from 'socket.io';

export const createWebsocket = httpServer => {
    const io = new Server(httpServer, {
        cors: {
            origin: '*',
        },
    });

    const userInfoMap = new Map();
    const query = [];

    let competeUserInfo = {
        redReady: false,
        blueReady: false,
    //     // redSock:{},
    //     // blueSock:{},
        start: false,
        red: {
            // id: null,
            // userObj:{}
        },
        blue: {
            // id: null,
            // userObj: {},
        },
    };

    const returnQueryInfo = () => {
        io.emit('queryInfo', query);
    };


    io.on('connection', socket => {

        console.log('a user connected');



        socket.on('disconnect', () => {
            console.log(`user ${socket.id} disconnected`);

            // 删map中用户数据
            userInfoMap.delete(socket.id);
            // 所有用户得到当前的用户信息
            returnQueryInfo();
        });

       

        socket.on('addUser', data => {
            // 添加玩家信息到map
            userInfoMap.set(socket.id, data);

            if(userInfoMap.size === 1){
                socket.emit("waitForJoin");
                socket.join("game-room");
            }else if(userInfoMap.size === 2){
                // 直接开始游戏
                socket.join("game-room");
                io.to("game-room").emit("toBeReady");
            }else{
                //进入队列

            }

            returnInfo();
        });

        socket.on('i-am-ready',data => {
            if(competeUserInfo.redReady && competeUserInfo.blueReady){
                competeUserInfo.start === true;
                io.to("game-room").emit("gameStart")
            }else{
                if(competeUserInfo.red.myname === data.myname){
                    competeUserInfo.redReady === true;
                }else{
                    competeUserInfo.blueReady === true;
                }
            }
        })

        //{oriCoord,newCoord,killedChess}
        socket.on('moveChess',(data) => {
            io.to("game-room").emit("moveAndEat",data);
        })

        socket.on('win',({winnerName}) => {
            if(competeUserInfo.red.myname === winnerName){
                competeUserInfo.red = {};
            }else{
                competeUserInfo.blue = {};
            }

            // 离开房间
            socket.leave('game-room');

            if(query.length > 0){
                const nextPlayer = query.shift();
                if(competeUserInfo.red === {}){
                    competeUserInfo.red = nextPlayer;
                }else{
                    competeUserInfo.blue = nextPlayer;
                }
                // 此socket非彼socket
                socket.join("game-room");
            }else{
                io.to("game-room").emit("waitForJoin");
            }
            io.sockets.connected
        })

        
        
        
        
        // socket.on('getAvatarInfo', () => {
        //     returnInfo();
        // });
        
        // socket.on('getMoveHistory',() => {
            
        // })

         // socket.on('boardmessage', data => {
        //     console.log(data);
        //     socket.broadcast.emit('data', data.toString());
        // });
    });
};
