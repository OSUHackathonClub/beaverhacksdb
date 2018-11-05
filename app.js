var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var mysql = require('/dbcon.js');


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true }));
app.use(express.static('public'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('mysql', mysql);
app.set('port', 62333);


app.get('/',function(req,res){
    let context = {};
    res.render('home', context);
});

app.get('/reset-table',function(req,res,next){
    var context = {};
    mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
        var createString = "CREATE TABLE workouts("+
            "id INT PRIMARY KEY AUTO_INCREMENT,"+
            "name VARCHAR(255) NOT NULL,"+
            "reps INT,"+
            "weight INT,"+
            "date DATE,"+
            "lbs BOOLEAN)";
        mysql.pool.query(createString, function(err){
            context.results = "Table reset";
            res.render('home',context);
        })
    });
});

/*
var express = require('express');
var router = express.Router();
//var currentHackathon;
*/

function getParticipants(res, mysql, context, complete){
    mysql.pool.query("SELECT id, name FROM bsg_planets", function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.planets  = results;
        complete();
    });
}


function getCurrentHackathon(res, mysql, context, complete) {
    mysql.pool.query("SELECT id, term, year FROM hackathon WHERE currentHackathon = 1", function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        currentHackathon = results;
        context.hackathon  = results;
        complete();
    });
}


/*Display all people. Requires web based javascript to delete users with AJAX*/

    app.get('/registration', function(req, res){
        console.log("hello your are calling me");
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getParticipants(res,context,complete());
        getCurrentHackathon(res, context, complete());

        function complete(){
            callbackCount++;
            if(callbackCount >= 0){
                res.render('registration', context);
            }
        }
    });


/* Adds a participant, redirects to the people page after adding */

    app.post('/participant', function addParticipant(req, res) {
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO participant(firstName, lastName, email) VALUES (?,?,?)";
        var inserts = [req.body.firstName, req.body.lastName, req.body.email];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                //res.redirect('/people');
                console.log(results);
                res.send(true);
            }
        });
    });

app.post('/participantHackathon', function(req, res){
    console.log("We get the multi-select certificate dropdown as ", req.body.hid);
    var mysql = req.app.get('mysql');
    // let's get out the certificates from the array that was submitted by the form
    var hackathon = req.body.hid;
    var participant = req.body.pid;
    console.log("Processing hackathon id " + hackathon);
    var sql = "INSERT INTO bsg_cert_people (pid, cid) VALUES (?,?)";
    var sql = "INSERT INTO participantHackathon(participantId, hackathonId) VALUES (?, ?)";
    var inserts = [participant, hackathon];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields){
        if(error){
            //TODO: send error messages to frontend as the following doesn't work
            /*
            res.write(JSON.stringify(error));
            res.end();
            */

            console.log(error)
        }
    });
    res.redirect('/people_certs');
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
