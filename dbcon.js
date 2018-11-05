var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_harrisrv',
    password        : '0524',
    database        : 'cs340_harrisrv'
});

module.exports.pool = pool;