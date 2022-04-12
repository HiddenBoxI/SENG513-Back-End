export const whenSomeoneforceExit = (
    competeUserInfo,
    sid,
    IDToUserInfo,
    query,
    io,
    broadcastQuery
) => {
    // 复原Compete对象

    // 蓝旗强退
    if (!!competeUserInfo.blue && competeUserInfo.blue.ID === sid) {
        competeUserInfo.gameStart = false;
        competeUserInfo.redReady = false;
        competeUserInfo.blueReady = false;
        competeUserInfo.full = false;
        competeUserInfo.chessBoard = [];
        // 当前蓝棋退出
        // io.to(competeUserInfo.blue.ID).emit('loseAndLeave');
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
            io.to(competeUserInfo.red.ID).emit('waitforjoin', competeUserInfo);

            // 重新插入队列,恢复开始时的状态
            query.unshift(competeUserInfo.red.ID);

            competeUserInfo.red = null;
        }
    }

    if(!!competeUserInfo.red && competeUserInfo.red.ID === sid) {
        // io.to(competeUserInfo.red.ID).emit('loseAndLeave');
        competeUserInfo.gameStart = false;
        competeUserInfo.redReady = false;
        competeUserInfo.blueReady = false;
        competeUserInfo.full = false;
        competeUserInfo.chessBoard = [];

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
            io.to(competeUserInfo.blue.ID).emit('waitforjoin', competeUserInfo);

            // 重新插入队列,恢复开始时的状态
            query.unshift(competeUserInfo.blue.ID);

            competeUserInfo.blue = null;
        }
    }
};
