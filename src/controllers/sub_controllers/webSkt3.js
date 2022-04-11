import { Server } from 'socket.io';
import { whenSomeoneforceExit } from './logic.js';
import lodash from 'lodash';

export const createWebsocket = httpServer => {
    const io = new Server(httpServer, {
        cors: {
            origin: '*',
        },
    });

    const IDToUserInfo = new Map();
    // const nameToID = new Map();
    const query = [];

    let competeUserInfo = {
        // 是否凑够两人
        full: false,

        // 红方准备
        redReady: false,
        // 蓝方准备
        blueReady: false,

        // 游戏已开始
        gameStart: false,

        // 红方信息: ID name
        red: null,
        // 蓝方信息
        blue: null,
        // 备份棋盘
        chessBoard: [],
    };

    const broadcastQuery = () => {
        // console.log('\nxixixixix');
        // console.log(query);
        if (query.length === 0) {
            io.emit('queryInfo', []);
        } else {
            const newQuery = [];
            query.forEach((item, index) => {
                // console.log('item',item);
                // console.log('index',index);
                const eachUserInfo = lodash.cloneDeep(IDToUserInfo.get(item));
                delete eachUserInfo['sockID'];
                newQuery.push(eachUserInfo);
            });

            console.log('newQuery', newQuery);

            io.emit('queryInfo', newQuery);
        }
    };

    io.on('connection', socket => {
        console.log('a user connected');
        socket.emit('sid', socket.id);

        socket.on('disconnect', () => {
            console.log(`user ${socket.id} disconnected`);

            // 删map和Query中用户数据
            IDToUserInfo.delete(socket.id);
            for (let i = 0; i < query.length; i++) {
                query[i] === socket.id && query.splice(i, 1);
                break;
            }

            // 如果red和blue其中一方掉线，才能进入其中一方的等待或下一场开始
            // 如果两方都断，则不做处理
            if (competeUserInfo.red || competeUserInfo.blue) {
                whenSomeoneforceExit(
                    competeUserInfo,
                    socket.id,
                    IDToUserInfo,
                    query,
                    io,
                    broadcastQuery
                );
            }

            broadcastQuery();
        });

        socket.on('addUser', userInfo => {
            // 1. 添加玩家信息到map
            const dataWithID = userInfo;
            dataWithID.sockID = socket.id;
            IDToUserInfo.set(socket.id, dataWithID);

            // if(IDToUserInfo.size === 1){
            //     // 等待一名玩家加入
            //     competeUserInfo.redID = socket.id;
            //     competeUserInfo.redName = userInfo.myname;
            //     console.log(competeUserInfo);
            //     socket.emit("waitforjoin","lalala");

            // }else if(IDToUserInfo.size === 2){
            //     // 两人直接开始游戏
            //     competeUserInfo.blueID = socket.id;
            //     competeUserInfo.blueName = userInfo.myname;

            //     console.log("nowcompeteInfo",competeUserInfo);

            //     io.to(socket.id).emit("toBeReady",competeUserInfo);
            //     // 第一位开始游戏

            //     io.to(competeUserInfo.redID).emit("toBeReady",competeUserInfo);
            // }else{
            //     //进入观战室内等待
            //     socket.emit("waitCurrGameEnd");
            // }

            query.push(socket.id);

            if (query.length === 1) {
                // 等待一名玩家加入
                // 由于游戏结束后剩余那一名玩家会被移回到队列，所以addUser时间触发之后，
                // 只有游戏没开始的时候，队列长度为可能为1
                // 另一种情况是游戏开始的时候，加进来的为队列第一个的用户，这种情况需要让他等待
                !competeUserInfo.full
                    ? socket.emit('waitforjoin')
                    : socket.emit('inQueryOrGoToSpectate');
            } else if (query.length > 1) {
                // full flag 为false 代表数组不满
                if (!competeUserInfo.full) {
                    // 红方空则填入红方位置
                    if (!competeUserInfo.red) {
                        competeUserInfo.red = {
                            ID: query[0],
                            name: IDToUserInfo.get(query[0]).myname,
                        };

                        query.shift();
                        console.log('redAdd');
                    }
                    // 蓝方空则填入蓝方位置
                    if (!competeUserInfo.blue) {
                        competeUserInfo.blue = {
                            ID: query[0],
                            name: IDToUserInfo.get(query[0]).myname,
                        };

                        query.shift();
                        console.log('blueAdd');
                    }
                    // competeUserInfo已填满,可以开始准备
                    competeUserInfo.full = true;
                    io.to([competeUserInfo.red.ID, competeUserInfo.blue.ID]).emit(
                        'toBeReady',
                        competeUserInfo
                    );

                    console.log('blueAdd', competeUserInfo);
                } else {
                    socket.emit('inQueryOrGoToSpectate');
                }
            }
            broadcastQuery();
        });

        socket.on('i-am-ready', readyFlag => {
            console.log(readyFlag);
            competeUserInfo.red.ID === socket.id && (competeUserInfo.redReady = true);
            competeUserInfo.blue.ID === socket.id && (competeUserInfo.blueReady = true);

            if (competeUserInfo.redReady && competeUserInfo.blueReady) {
                competeUserInfo.gameStart = true;
                io.to([competeUserInfo.red.ID, competeUserInfo.blue.ID]).emit(
                    'getStart',
                    {
                        Turn: 'red',
                    }
                );
                console.log(competeUserInfo);
            }
        });

        socket.on('chessMESend', MEInfo => {
            // 原坐标，现坐标，吃掉子的坐标
            // competeUserInfo.chessBoard = MEInfo.chessBoard;
            competeUserInfo.red.ID === socket.id
                ? io.to(competeUserInfo.blue.ID).emit('moveChessInfo', MEInfo)
                : io.to(competeUserInfo.red.ID).emit('moveChessInfo', MEInfo);
        });

        socket.on('turnSwitch', ({ Turn }) => {
            Turn === 'red'
                ? io.to(competeUserInfo.blue.ID).emit('oriTurn', { Turn: 'blue' })
                : io.to(competeUserInfo.blue.ID).emit('oriTurn', { Turn: 'red' });
        });

        socket.on('winner', () => {
            // 复原Compete对象
            competeUserInfo.gameStart = false;
            competeUserInfo.redReady = false;
            competeUserInfo.blueReady = false;
            competeUserInfo.full = false;
            competeUserInfo.chessBoard = [];

            // 1. 如果是红色赢
            if (competeUserInfo.red.ID === socket.id) {
                // 当前蓝棋退出
                io.to(competeUserInfo.blue.ID).emit('loseAndLeave');
                competeUserInfo.blue = null;

                if (query.length !== 0) {
                    // 如果队列长度不为零 说明有人排队，那么提拔队列尾部的用户到空闲的棋子端，并准备
                    console.log(query);
                    competeUserInfo.blue = {
                        ID: IDToUserInfo.get(query[0]).sockID,
                        name: IDToUserInfo.get(query[0]).myname,
                    };

                    // 队列为满
                    competeUserInfo.full = true;
                    query.shift();

                    // 新的对局开始：准备过程
                    io.to([competeUserInfo.red.ID, competeUserInfo.blue.ID]).emit(
                        'toBeReady',
                        competeUserInfo
                    );
                } else {
                    // 如果队列长度为零 说明没人排队，那么让还在位置上的用户等待
                    io.to(competeUserInfo.red.ID).emit('waitforjoin');

                    // 重新插入队列,恢复开始时的状态
                    query.unshift(competeUserInfo.red.ID);

                    competeUserInfo.red = null;
                }
            } else {
                io.to(competeUserInfo.red.ID).emit('loseAndLeave');
                competeUserInfo.red = null;

                if (query.length !== 0) {
                    // 如果队列长度不为零 说明有人排队，那么提拔队列尾部的用户到空闲的棋子端，并准备
                    console.log(query);
                    competeUserInfo.red = {
                        ID: IDToUserInfo.get(query[0]).sockID,
                        name: IDToUserInfo.get(query[0]).myname,
                    };

                    // 队列为满
                    competeUserInfo.full = true;
                    query.shift();

                    // 新的对局开始：准备过程
                    io.to([competeUserInfo.red.ID, competeUserInfo.blue.ID]).emit(
                        'toBeReady',
                        competeUserInfo
                    );
                } else {
                    // 如果队列长度为零 说明没人排队，那么让还在位置上的用户等待
                    io.to(competeUserInfo.blue.ID).emit('waitforjoin');

                    // 重新插入队列,恢复开始时的状态
                    query.unshift(competeUserInfo.blue.ID);
                    

                    competeUserInfo.blue = null;
                }
            }
            broadcastQuery();
        });

        socket.on('boardmessage', data => {
            console.log(data);
            socket.broadcast.emit('data', data.toString());
        });

        socket.on('getAvatarInfo', () => {
            if (query.length !== 0) {
                socket.emit('queryInfo', []);
            } else {
                const newQuery = [];

                query.map((item, index) => {
                    const eachUserInfo = lodash.cloneDeep(IDToUserInfo.get(item));
                    delete eachUserInfo.sockID;
                    newQuery.push(eachUserInfo);
                });

                socket.emit('queryInfo', newQuery);
            }
        });

        // socket.on('getMoveHistory', data => {
        //     competeUserInfo.red.ID === socket.id
        //         ? io.to(competeUserInfo.red.ID).emit('moveHistory', data)
        //         : io.to(competeUserInfo.blue.ID).emit('moveHistory', data);
        // });
    });
};
