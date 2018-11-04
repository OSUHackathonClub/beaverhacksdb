var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_harrisrv',
    password        : 'pw',
    database        : 'cs340'
});

module.exports.pool = pool;