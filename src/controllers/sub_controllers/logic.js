export const whenSomeoneforceExit = (competeUserInfo,sid,IDToUserInfo,query,io,broadcastQuery) => {


    // 复原Compete对象
    competeUserInfo.gameStart = false;
    competeUserInfo.redReady = false;
    competeUserInfo.blueReady = false;
    competeUserInfo.full = false;
    competeUserInfo.chessBoard = [];

    // 蓝旗强退
    if (competeUserInfo.blue.ID === sid) {
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

            // 新的对局开始：准备过程
            io.to([competeUserInfo.red.ID, competeUserInfo.blue.ID]).emit(
                'toBeReady',
                competeUserInfo
            );

        } else {
            // 如果队列长度为零 说明没人排队，那么让还在位置上的用户等待
            io.to(competeUserInfo.red.ID).emit('waitforjoin',competeUserInfo);

            // 重新插入队列,恢复开始时的状态
            query.unshift(competeUserInfo.red.ID);
            
            competeUserInfo.red = null;
        }

        query.shift();
        

    } else {
        // io.to(competeUserInfo.red.ID).emit('loseAndLeave');
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

            // 新的对局开始：准备过程
            io.to([competeUserInfo.red.ID, competeUserInfo.blue.ID]).emit(
                'toBeReady',
                competeUserInfo
            );

        } else {
            // 如果队列长度为零 说明没人排队，那么让还在位置上的用户等待
            io.to(competeUserInfo.blue.ID).emit('waitforjoin',competeUserInfo);

            // 重新插入队列,恢复开始时的状态
            competeUserInfo.blue = null;
        }
        query.shift();

    }
}