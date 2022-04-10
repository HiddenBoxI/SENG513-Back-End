import { Server } from 'socket.io';

export const createWebsocket = httpServer => {
    const io = new Server(httpServer, {
        cors: {
            origin: '*',
        },
    });

    const IDToUserInfo = new Map();
    const nameToID = new Map();
    const query = [];

    let competeUserInfo = {
        redReady: false,
        blueReady: false,
    //     // redSock:{},
    //     // blueSock:{},
        gameStart: false,
        redID: "",
        blueID: "",
        chessBoard:[]
    };

    const returnQueryInfo = () => {
        io.emit('queryInfo', query);
    };


    io.on('connection', socket => {

        console.log('a user connected');



        socket.on('disconnect', () => {
            console.log(`user ${socket.id} disconnected`);

            // 删map中用户数据
            for (const [index,item] of query.entries()) {
                if(item.myname === IDToUserInfo.get(socket.id).myname){
                    query.splice(index,1);
                    nameToID.delete(item.myname);
                } 
            }
            IDToUserInfo.delete(socket.id);
            // 所有用户得到当前的用户信息
            returnQueryInfo();
        });

       

        socket.on('addUser', data => {
            const dataWithID = data;
            dataWithID.sockID = socket.id;
            // 添加玩家信息到map
            IDToUserInfo.set(socket.id, dataWithID);

            if(IDToUserInfo.size === 1){
                socket.emit("waitForJoin");
            }else if(IDToUserInfo.size === 2){
                // 此socket直接开始游戏
                io.to(socket.id).emit("toBeReady");
                // 第一位开始游戏
                
                io.to(socket.id).emit("toBeReady");
            }else{
                //进入队列

            }

            returnInfo();
        });
        
    });
};
