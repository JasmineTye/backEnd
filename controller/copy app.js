console.log("----------------------------------------");
console.log("P08_friendbookFrontBack > backEnd > controller > app.js");
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

var user = require('../model/user');
var game = require('../model/game');
var category = require('../model/category');
var review = require('../model/review');

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
// end points - user table
//----------------------------------------------
// generate a user -> get user id -> get user token based on user id
app.post("/login/", printDebugInfo, (req, res) => {
     var username = req.body.username;
     var password = req.body.password;

     console.log("-------------------------------");
     console.log("Username: " + username);
     console.log("Password: " + password);
     console.log("-------------------------------");

     /*
          While it is possible to pass values in the function itself
          e.g: User.verify (req.body.username, req.body.password, (error, user) => ) 
          it is not very ideal as you will not be able to do any verification on the data 
          being passed down. 

          By doing extraction of data separately, you will be able to do a sanitary check by 
          doing a data validation.
     */

     if (username == null || username == "" ||
          password == null || password == "") {
          res.status(400).send("Invalid login details.")
     }

     user.verify(
          username, password,
          (error, user) => {
               if (error) {
                    res.status(500).send("Internal Server Error");
                    return;
               }
               if (user === null) {
                    res.status(401).send("Incorect username and/or password.");
                    return;
               }

               // able to add more -> e.g: roles
               const payload = { 
                    user_id: user.userid,
                    role: user.role
               };

               /*
                    Better to generate a token outside user.js (outside 
                    model layer) as model layers only handles raw data
                    Token generation should be handled in the controller layer
                    - In this case, it is better to do the token generation in app.js
                    instead of user.js
               */

               /*
                    If token expiry time is not stated, a default expiry time is used 
               */

               jwt.sign(
                    // (1): Payload
                    payload, 
                    // (2): Secret Key
                    JWT_SECRET, 
                    // (3) Signing Algorithm
                    { algorithm: "HS256" },
                    // (4) response handler (callback function)
                    (error, token) => {
                         if (error) {
                              console.log(error);
                              res.status(401).send("Token Error!");
                              return;
                         }
                         res.status(200).send({
                              token: token,
                              user_id: user.userid,
                              role: user.role
                         });
                    })
          });
});



//----------------------------------------------
// end points - category table
//----------------------------------------------
app.post('add/category', printDebugInfo, function (req, res) {
     var catname = req.body.catname;
     var description = req.body.description;

     
      // Protection 1: present a token
     // Protection 2: after getting a token -> authorisation check 
     if (req.decodedToken.role != "admin") {
          console.log("NOT ADMIN");
          res.status(403).send("Unauthorised User Type to add games");
     }
     
     category.addCat(catname, description, function (err, result) {
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

app.put('/category/:id/', printDebugInfo, function (req, res) {
     var catname = req.body.catname;
     var description = req.body.description;
     var catid = req.params.id;

     category.updateCat(catname, description, catid, function (err, result) {
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

app.get('/category', printDebugInfo, function (req, res) {
     category.getAllCat(function (err, result) {
          if (!err) {
               res.send(result);
          } else {
               res.status(500).send("Internal Server Error");
          }
     });
});

//----------------------------------------------
// end points - user table
//----------------------------------------------
app.get('/users', printDebugInfo, function (req, res) {
     user.findAll(function (err, result) {
          if (!err) {
               res.send(result);
          } else {
               res.status(500).send("Internal Server Error");
          }
     });
});

app.post('/users/', printDebugInfo, function (req, res) {
     var username = req.body.username;
     var email = req.body.email;
     var type = req.body.type;
     var profile_pic_url = req.body.profile_pic_url;


     user.addUser(username, email, type, profile_pic_url, function (err, result) {
          if (!err) {
               console.log(result);

               var output = {
                    "userid": result.insertId
               };

               res.status(201).send(output);
          }

          else {
               var output = {
                    "result": "Internal Server Error"
               };

               res.status(500).send(output);
          }
     });
});

app.get('/users/:id/', printDebugInfo, function (req, res) {
     var userid = req.params.id;

     user.findByID(userid, function (err, result) {
          if (!err) {
               console.log(result);

               if (result == null) {
                    res.status(404).send("No such ID.");
               }
               else {
                    var output = {
                         "userid": result.userid,
                         "username": result.username,
                         "email": result.email,
                         "profile_pic_url": result.profile_pic_url,
                         "role": result.type,
                         "created_at": result.created_at
                    };

                    res.status(200).send(output);
               }

          } else {
               res.status(500).send("Internal Server Error");
          }
     });
});



//----------------------------------------------
// end points - game table
//----------------------------------------------
app.post('/add/game', printDebugInfo, isLoggedInMiddleware, function (req, res) {
     var title = req.body.title;
     var description = req.body.description;
     var price = req.body.price;
     var platform = req.body.platform;
     var categoryid = req.body.categoryid;
     var year = req.body.year;

      // Protection 1: present a token
     // Protection 2: after getting a token -> authorisation check 
     if (req.decodedToken.role != "admin") {
          console.log("NOT ADMIN");
          res.status(403).send("Unauthorised User Type to add games");
     }

     game.addGame(title, description, price, platform, categoryid, year, function (err, result) {
          if (!err) {
               console.log(result);

               var output = {
                    "gameid": result.insertId
               };

               res.status(201).send(output);
          }

          else {
               var output = {
                    "result": "Internal Server Error"
               };

               res.status(500).send(output);
          }
     });
});

app.get('/game/:platform', printDebugInfo, function (req, res) {
     var platform = req.params.platform;

     game.getByPlatform(platform, function (err, result) {
          if (!err) {
               console.log(result);

               if (result == null) {
                    res.status(404).send("The platform \"" + platform + "\" is unavailable. Please try again...");
               }

               else {
                    res.status(200).send(result);
               }

          } else {
               res.status(500).send("Internal Server Error");
          }
     });
});


app.get('/games/:id/', printDebugInfo, function (req, res) {
     var gameid = req.params.id;

     game.getByID(gameid, function (err, result) {
          if (!err) {
               console.log(result);

               if (result == null) {
                    res.status(404).send("No such ID.");
               }
               else {
                    res.status(200).send(result);
               }

          } else {
               res.status(500).send("Internal Server Error");
          }
     });
});


app.get('/games', printDebugInfo, function (req, res) {
     game.getAll(function (err, result) {
          if (!err) {
               console.log(result);

               if (result == null) {
                    res.status(404).send("The platform \"" + platform + "\" is unavailable. Please try again...");
               }

               else {
                    res.status(200).send(result);
               }

          } else {
               res.status(500).send("Internal Server Error");
          }
     });
});


app.delete('/game/:id', printDebugInfo, function (req, res) {
     var gameid = req.params.id;

     game.deleteGame(gameid, function (err, result) {
          if (!err) {
               console.log(result);
               //res.send(result);

               if (result.affectedRows == 0) {
                    var output = {
                         "Result": "Invalid game ID"
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

app.put('/game/:id', printDebugInfo, function (req, res) {
     var title = req.body.title;
     var description = req.body.description;
     var price = req.body.price;
     var platform = req.body.platform;
     var categoryid = req.body.categoryid;
     var year = req.body.year;
     var gameid = req.params.id;

     game.updateGame(title, description, price, platform, categoryid, year, gameid, function (err, result) {
          if (!err) {
               //res.send(result);
               console.log(result);

               if (result.affectedRows == 1 && result.changedRows == 1) {
                    res.status(204).send(result);
               }

               else if (result.affectedRows == 1 && result.changedRows == 0) {
                    res.status(200).send("No updates performed. Data is same.");
               }

               else if (result.affectedRows == 0) {
                    res.status(404).send("No such game ID is found");
               }

               else {
                    res.status(400).send("Unknown");
               }
          }
          else {

               res.status(500).send("Internal Server Error");
          }
     });
});

//----------------------------------------------
// end points - review table
//----------------------------------------------
app.post('/user/:uid/game/:gid/review/', printDebugInfo, isLoggedInMiddleware, function (req, res) {
     var content = req.body.content;
     var rating = req.body.rating;
     var fk_userID = req.params.uid;
     var fk_gameID = req.params.gid;

      // data validation
      if (isNaN(fk_userID) || isNaN(fk_gameID)) {
          res.status(400).send("Invalid User ID");
          return;
     }

     // Protection 1: present a token
     // Protection 2: after getting a token -> authorisation check 

     // add protection 2
     // who are you? - req.decodedToken.user_id
     // whose posts - req.params.userID
     // CA2: check for admin/ user/ general public
     if (req.decodedToken.user_id != fk_userID) {
          res.status(403).send("Unauthorised request to fetch posts");
     }



     review.addReview(content, rating, fk_gameID, fk_userID, function (err, result) {
          if (!err) {

               var output = {
                    "reviewid": result.insertId
               };

               res.status(201).send(output);
          }

          else {
               // if one user tries to post multiple reviews on the same game
               if (err.errno == 1062) {
                    res.status(422).send("Sorry, you can only post your game review once.");

               }

               else {
                    res.status(500).send("Internal Server Error");
               }
          }
     });
});

app.get('/game/:id/review', printDebugInfo, function (req, res) {
     var gameid = req.params.id;

     review.getByID(gameid, function (err, result) {
          if (!err) {
               console.log(result);

               if (result == null) {
                    res.status(404).send("No such ID.");
               }
               else {
                    res.status(200).send(result);
               }

          } else {
               res.status(500).send("Internal Server Error");
          }
     });
});


app.get('/game/:id/review/average', printDebugInfo, function (req, res) {
     var gameid = req.params.id;

     review.getAverage(gameid, function (err, result) {
          if (!err) {
               console.log(result);

               if (result == null) {
                    res.status(404).send("No such ID.");
               }
               else {
                    res.status(200).send(result);
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