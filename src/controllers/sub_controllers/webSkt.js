import { Server } from 'socket.io';

export const createWebsocket = httpServer => {
    const io = new Server(httpServer, {
        cors: {
            origin: '*',
        },
    });

    const userInfoMap = new Map();
    const competeUserInfo = {
        redReady: false,
        blueReady: false,
        start: false,
        red: {
            id: null,
            userObj: {},
        },
        blue: {
            id: null,
            userObj: {},
        },
    };

    io.on('connection', socket => {
        const returnInfo = () => {
            io.emit('returnInf', [...userInfoMap.values()]);
        };
        console.log('a user connected');
        socket.on('disconnect', () => {
            console.log(`user ${socket.id} disconnected`);

            userInfoMap.delete(socket.id);
            io.emit('returnInf', [...userInfoMap.values()]);

            console.log('nowMap', userInfoMap);
        });

        socket.on('boardmessage', data => {
            console.log(data);
            socket.broadcast.emit('data', data.toString());
        });

        socket.on('setAvatarInfo', data => {
            userInfoMap.set(socket.id, data);
            console.log('oriMap', userInfoMap);

            returnInfo();
        });

        socket.on('getAvatarInfo', () => {
            returnInfo();
        });

        socket.on('getMoveHistory',() => {
            
        })
    });
};
