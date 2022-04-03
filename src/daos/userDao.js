import { connection } from '#src/utils/mysql2connection.js';
import dateformat from '#src/utils/dateformat.js';

Date.prototype.format = dateformat;
// connection.query('SELECT * from t_user', function (err, results, fields) {
//     console.log(results); // results contains rows returned by server
//     // console.log(fields); // fields contains extra meta data about results, if available
// });

// console.log("connection",connection);

const tableName = 't_user';

export const getUserByNickname = async nickname => {
    console.log('nickname',nickname);
    const [rows] = await connection
        .promise()
        .execute(`select * from ${tableName} where nickname = ?`, [nickname]);
    console.log('rows',rows);
    return rows;
};

const now = new Date().format('yyyy-MM-dd hh-mm-ss');
export const insertUser = async (nickname, password) => {
    // const res = await connection.promise().query(
    //     'insert into t_user SET ?',
    //     { nickname: 'lalala3', password: '6666667', create_at: now, update_at: now }
    //     // function (err, results, fields) {
    //     //     console.log(results); // results contains rows returned by server
    //     //     // console.log(fields); // fields contains extra meta data about results, if available
    //     // }
    // );

    try {
        const res = await connection
            .promise()
            .execute(
                `insert into ${tableName} (nickname, password, create_at, update_at) values (?,?,?,?)`,
                [nickname, password, now, now]
            );
        return res[0].affectedRows;
    } catch ({code,errno}) {
        console.log(code,errno);
        throw Error(errno);
    }
};

// insertUser();
