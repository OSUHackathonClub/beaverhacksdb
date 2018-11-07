var express = require('express');
var mysql = require('./dbcon.js');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');



app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true }));
app.use(express.static('public'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

//app.set('mysql', mysql);
app.set('port', 62233);


app.get('/',function(req,res){
    let context = {};
    res.render('home', context);
});

app.get('/reset-participant',function(req,res,next){
    var context = {};
    mysql.pool.query("DROP TABLE IF EXISTS participant", function(err){ //replace your connection pool with the your variable containing the connection pool
        var createString = " CREATE TABLE participant (\n" +
            "    id INT(11) NOT NULL AUTO_INCREMENT,\n" +
            "    firstName VARCHAR(100) NOT NULL,\n" +
            "    lastName VARCHAR(100) NOT NULL,\n" +
            "    email VARCHAR(100) NOT NULL,\n" +
            "    PRIMARY KEY (id)\n" +
            ") ENGINE=InnoDB;";
        mysql.pool.query(createString, function(err){
            context.results = "Table reset";
            res.render('registration',context);
        })
    });
});



function getParticipants(res, mysql, context, complete){
    mysql.pool.query("SELECT id, firstName, lastName, email FROM participants", function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        console.log(results);
        context.participants  = results;
        complete();
    });
}


function getCurrentHackathon(res, mysql, context, complete) {

    mysql.pool.query("SELECT id, term, year FROM hackathon WHERE currentHackathon = 1", function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        console.log(results);
        currentHackathon = results;
        context.hackathonTerm  = results.term;
        context.hackathonId = results.id;
        context.year = results.year;

        complete();
    });
}


/*Display all people. Requires web based javascript to delete users with AJAX*/

app.get('/registration', function(req, res){
    console.log("hello your are calling me");
    var context = {};
    mysql.pool.query("SELECT id, firstName, lastName, email FROM participant", function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        //here call hackathon for id when you have the table setup

        context.tableTitle = "Participants Winter 2018";
        console.log(results);
        context.participants  = results;
        res.render('registration', context);
    });
});



/* Adds a participant, redirects to the people page after adding */

app.post('/participant', function (req, res) {

    console.log("receiving participant data" + req.body);
    var mysql = req.app.get('mysql');
    console.log(req.body);
    var sql = "INSERT INTO participant(firstName, lastName, email) VALUES (?,?,?)";
    var inserts = [req.body.firstName, req.body.lastName, req.body.email];
    sql = mysql.query(sql,inserts,function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }else{
            //res.redirect('/people');
            console.log(results);
            res.send();
        }
    });
});



app.post('/participantHackathon', function(req, res){
    var context = {};
    console.log("We get the multi-select certificate dropdown as ", req.body.hid);
    var mysql = req.app.get('mysql');
    // let's get out the certificates from the array that was submitted by the form
    var hackathon = req.body.hid;
    var participant = req.body.pid;
    console.log("Processing hackathon id " + hackathon);
    var sql = "INSERT INTO participantHackathon(participantId, hackathonId) VALUES (?, ?)";
    var inserts = [participant, hackathon];
    sql = mysql.query(sql, inserts, function(error, results, fields){
        if(error){
            context.insertMessage = results;
            console.log(error)
        }
    });
});



app.get('/reset-participant',function(req,res,next){
    var context = {};
    mysql.pool.query("DROP TABLE IF EXISTS participant", function(err){ //replace your connection pool with the your variable containing the connection pool
        var createString = "CREATE TABLE participant (\n" +
            "        id INT(11) NOT NULL AUTO_INCREMENT,\n" +
            "        firstName VARCHAR(100) NOT NULL,\n" +
            "        lastName VARCHAR(100) NOT NULL,\n" +
            "        email VARCHAR(100) NOT NULL,\n" +
            "        PRIMARY KEY (id)\n" +
            ") ENGINE=InnoDB;";
        mysql.pool.query(createString, function(err){
            context.results = "Table reset";
            console.log("new particpant table, fresh and clean");
            res.render('registration',context);
        })
    });
});


app.use(function(req,res){
res.status(404);
res.render('404');
});

app.use(function(err, req, res, next){
console.error(err.stack);
res.type('plain/text');
res.status(500);
res.render('500');
});


app.listen(app.get('port'), function(){
console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});






module.exports = app;
