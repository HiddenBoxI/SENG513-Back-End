import { connection } from '#src/utils/mysql2connection.js';

export async function getStatusInfoByID(id) {
    console.log(id);

    const [rows] = await connection
        .promise()
        .execute(
            'select totalWins,GamesPlayed,WinRate,CurrentStreak,HighestStreak,LastPlayed from t_user where id = ?',
            [id]
        );
    return rows;
}

export async function insertStatusInfoById({
    id,
    totalWins,
    GamesPlayed,
    WinRate,
    CurrentStreak,
    HighestStreak,
    LastPlayed,
}) {
    // console.log(id);
    const [rows1] = await connection
        .promise()
        .execute('select * from t_user where id = ?', [id]);

    const newTotalWins = !!totalWins ? totalWins : rows1.totalWins;
    const newGamesPlayed = !!GamesPlayed ? GamesPlayed : rows1.GamesPlayed;
    const newWinRate = !!WinRate ? WinRate : rows1.WinRate;
    const newCurrentStreak = !!CurrentStreak ? CurrentStreak : rows1.CurrentStreak;
    const newHighestStreak = !!HighestStreak ? HighestStreak : rows1.HighestStreak;
    const newLastPlayed = !!LastPlayed ? LastPlayed : rows1.LastPlayed;

    const [res] = await connection
        .promise()
        .execute(
            'update t_user set totalWins = ?,GamesPlayed = ?,WinRate = ?,CurrentStreak = ?,HighestStreak = ?,LastPlayed = ? where id = ?',
            [
                newTotalWins,
                newGamesPlayed,
                newWinRate,
                newCurrentStreak,
                newHighestStreak,
                newLastPlayed,
                id,
            ]
        );
    return res;
}
// getStatusInfoByID(1).then((res => {
//     console.log(res);
// })).catch((err) => {
//     console.log(err);
// })
