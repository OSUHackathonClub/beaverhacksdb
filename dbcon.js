var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_harrisrv',
    password        : '0524',
    database        : 'cs340_harrisrv'
});

pool.getConnection(function(err) {
    if (err) {
        throw err;
    }
    console.log("Connected!");
});

module.exports = pool;

