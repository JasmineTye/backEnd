console.log("----------------------------------------");
console.log("Planner App > backEnd > controller > app.js");
console.log("---------------------------------------");

/*
     1. Data Extraction 
     2. Data Validation (check if data matches)
     3. Check Authorization (check if user is authorized to access the data)
     4. Response
*/


//----------------------------------------------
// imports
//----------------------------------------------
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config.js");
const isLoggedInMiddleware = require("../auth/isLoggedInMiddleware");

var task = require('../model/task');


//----------------------------------------------
// Middleware functions
//----------------------------------------------
/**
 * prints useful debugging information about an endpoint
 * we are going to service
 * 
 * @param {object} req 
 *  request object
 * @param {object} res 
 *  response object
 * @param {function} next 
 *  reference to the next function to call
 */

var printDebugInfo = function (req, res, next) {
     console.log();
     console.log("--------------------[ Debug Info ]----------------------");

     console.log("Servicing " + req.url + " ...");

     console.log("> req.params: " + JSON.stringify(req.params) + " ...");  // JSON.stringify -> converts a JavaScript object into a string
     console.log("> req.body: " + JSON.stringify(req.body) + " ...");      // JSON.stringify is commonly used to exchange data to/from a web server

     console.log("------------------[ Debug Info Ends]--------------------");
     console.log();
     next();
}

var urlEncodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

//----------------------------------------------
// MF Configurations
//----------------------------------------------
app.use(urlEncodedParser);
app.use(jsonParser);

app.options('*', cors());
app.use(cors());


//----------------------------------------------
// end points - task table
//----------------------------------------------
app.post('/add/task', printDebugInfo, function (req, res) {
     var title = req.body.title;
     var date = req.body.date;
     var timeFrom = req.body.timeFrom;
     var timeTo = req.body.timeTo;
     var colorTag = req.body.colorTag;
     var notes = req.body.notes;


     task.addTask(title, date, timeFrom, timeTo, colorTag, notes, function (err, result) {
          if (!err) {
               console.log(result);
               res.status(204).send(result);
          }
          else {
               console.log(result);
               // if category name already exists
               if (err.errno == 1062) {
                    var output = {
                         "result": "Duplicate entry"
                    };
                    res.status(422).send(output);
               }
               else {
                    var output = {
                         "result": "Internal Server Error"
                    };
                    res.status(500).send(output);
               }
          }
     });
}
);

app.put('/task/:id/', printDebugInfo, function (req, res) {
     var title = req.body.title;
     var date = req.body.date;
     var timeFrom = req.body.timeFrom;
     var timeTo = req.body.timeTo;
     var colorTag = req.body.colorTag;
     var notes = req.body.notes;
     var taskID = req.params.id;

     task.updateTask(title, date, timeFrom, timeTo, colorTag, notes, taskID, function (err, result) {
          if (!err) {
               console.log(result);
               res.status(204).send(result);
          }

          else {
               console.log(result);

               // if category name already exists
               if (err.errno == 1062) {

                    var output = {
                         "result": "Duplicate entry"
                    };

                    res.status(422).send(output);
               }
               else {
                    var output = {
                         "result": "Internal Server Error"
                    };
                    res.status(500).send(output);
               }
          }
     });
});


app.get('/task/:date',  function (req, res) {
     var date = req.params.date;
     task.getTaskByDate(date, function (err, result) {
          if (!err) {
               res.status(200).send(result);
               
          } else {
               res.status(500).send("Internal Server Error");
          }
     });
});

app.get('/task/time/:date',  function (req, res) {
     var date = req.params.date;

     task.getTaskByTime(date, function (err, result) {
          if (!err) {
               res.status(200).send(result);
          } else {
               res.status(500).send("Internal Server Error");
          }
     });
});

app.get('/task', printDebugInfo, function (req, res) {
     task.getAllTask(function (err, result) {
          if (!err) {
               res.send(result);
          } else {
               res.status(500).send("Internal Server Error");
          }
     });
});

app.get('/task/get/:taskID/', printDebugInfo, function (req, res) {
     var taskID = req.params.taskID;

     task.getTaskByID(taskID, function (err, result) {
          if (!err) {
               console.log(result[0]);

               if (result == null) {
                    res.status(404).send("No such ID.");
               }
               else {
                    res.status(200).send(result[0]);
               }

          } else {
               res.status(500).send("Internal Server Error");
          }
     });
});


app.delete('/task/delete/:taskID', printDebugInfo, function (req, res) {
     var taskID = req.params.taskID;

     task.deleteTask(taskID, function (err, result) {
          if (!err) {
               if (result.affectedRows == 0) {
                    var output = {
                         "Result": "Invalid task ID"
                    };
                    res.status(404).send(output);
               }

               else {
                    res.status(204).send(result);
               }

          } else {
               res.status(500).send("Internal Server Error");
          }
     });
});


//----------------------------------------------
// exports
//----------------------------------------------
module.exports = app;