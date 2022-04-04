import {connection} from "#src/utils/mysql2connection.js";

export async function getStatusInfoByID(id) {
    console.log(id);

    const [rows] = await connection
        .promise()
        .execute('select totalWins,GamesPlayed,WinRate,CurrentStreak,HighestStreak,LastPlayed from t_user where id = ?',[id]);
    return rows;
}
// getStatusInfoByID(1).then((res => {
//     console.log(res);
// })).catch((err) => {
//     console.log(err);
// })

