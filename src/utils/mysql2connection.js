// import mysql from 'mysql2';
import mysql from 'mysql2';
// import dateformat from './dateformat.js';

// Date.prototype.format = dateformat;
// create the connection to database
export const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123',
    database: 'CheckerBar',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// connection.connect(function (err) {
//     if (err) {
//         console.error('error connecting: ' + err.stack);
//         return;
//     }
//     console.log('connected as id ' + connection.threadId);
// });
// const now = new Date().format('yyyy-MM-dd hh-mm-ss');
// connection.query(
//     'insert into t_user SET ?',
//     { nickname: 'lalala1', password: '6666667', create_at: now, update_at: now },
//     function (err, results, fields) {
//         console.log(results); // results contains rows returned by server
//         // console.log(fields); // fields contains extra meta data about results, if available
//     }
// );
