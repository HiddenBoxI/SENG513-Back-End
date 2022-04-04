// import mysql from 'mysql2';
import mysql from 'mysql2';
// import dateformat from './dateformat.js';

// Date.prototype.format = dateformat;
// create the connection to database
export const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
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
//     'select * from t_user',
//     function (err, results, fields) {
//         console.log(results);
//         console.log(err);
//         // results contains rows returned by server
//         // console.log(fields); // fields contains extra meta data about results, if available
//     }
// );
