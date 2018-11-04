var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');
var mysql = require('./dbcon.js');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true }));
app.use(express.static('public'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 62333);


app.get('/',function(req,res){

    var title = "Workout Tracker";

    var formTitle = "Exercise Form";
    var tableTitle = "Exercise Records";

    var context = {};
    context.title = title;
    context.formTitle = formTitle;
    context.tableTitle = tableTitle;

    // send table


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


app.get('/load', function (req, res) {
    console.log("server side load");
    mysql.pool.query('SELECT * FROM workouts ORDER BY id', function(err, rows, fields) {
        if (err) {

            next(err);
            return;
        }
        //console.log(rows);
        res.send(rows);
    });
});

app.get('/insert', function(req,res){
    var context = {};

    console.log("server side post, ready to process mysql");

    mysql.pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)", [req.headers.name, req.headers.reps, req.headers.weight, req.headers.day,  req.headers.lbs], function(err, result) {
        if (err) {
            next(err);
            return;
        }

        context.id = result.insertId;
        context.status = 201;
    });

    //get row
    mysql.pool.query('SELECT * FROM workouts ORDER BY id DESC LIMIT 1', function(err, rows, fields){
        if(err){

            next(err);
            return;
        }

        //send the information back to client
        context.response = rows[rows.length-1];

        res.send(context);

    });

});


app.get('/delete', function(req,res) {
    var context = {};

    console.log("server side delete, ready to delete from mysql");

    mysql.pool.query("DELETE FROM workouts WHERE id=?", [req.headers.id], function(err, result){
        if(err){
            next(err);
            return;
        }
        res.send(result);
    });
});

app.post('/edit', function(req,res,next){
    console.log("server side preparing edit page");
    console.log(req.body);
    var context = {};

    mysql.pool.query('SELECT * FROM workouts WHERE id =?',[req.body.id],function(err, rows, fields){
        if(err){
            next(err);
            return;
        }

        context.response = rows[rows.length-1];

        var date = JSON.stringify(context.response.date);

        context.date = date;
        res.render('edit', context);
    });
});

/* for testing only */
app.post('/edit-form', function (req, res) {
    var context = {};
    context.title = "Edit Form";
    context.name = "";
    context.id = req.body.id;
    context.reps = "";
    context.weight = "";
    context.date = "2018-07-07";
    context.lbs = 0;

    res.render('edit', context);
});

/* process update of table and sql after edit form */
app.post('/update', function (req, res) {
    console.log("server side update data ready for mysql");
    var lbs = 1;
    if (req.body.unit !== "lbs") {
        lbs = 0;
    }

    mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?",
        [req.body.name, req.body.reps, req.body.weight, req.body.date, lbs, req.body.id],
        function(err, result){
            if(err){
                next(err);
                return;
            }
            console.log("Row updated. redirecting to home");
            res.redirect('/');
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
