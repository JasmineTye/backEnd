/*
     Name: Jasmine Tye Jia Wen
     Class: DIT/FT/1B/05
     Admin No: p2036137
*/

console.log("----------------------------------------");
console.log("CA1_games  > model > review.js");
console.log("---------------------------------------");

//----------------------------------------------
// imports
//----------------------------------------------
var db = require('../controller/databaseConfig');


//----------------------------------------------
// objects/ functions
//----------------------------------------------
var Review = {
     addReview: function (content, rating, fk_gameID, fk_userID, callback) {  
          var conn= db.getConnection();

          conn.connect(function (err) {
               if (err) {
                    console.log(err);
                    return callback(err, null);
               }
               else {
                    console.log("Connected!");
                    var sql = `
                    INSERT INTO 
                         reviews
                         (content, rating, fk_gameID, fk_userID)
                                                                 
                    VALUES
                         (?, ?, ?, ?)
                    
                    `;

                    conn.query(sql, [content, rating, fk_gameID, fk_userID],
                         function (err, result) {
                              conn.end();

                              if (err) {
                                   console.log(err);
                        
                                   return callback(err, null);
                              } else {
                                   return callback(null, result);
                              }
                         });
               }
          });
     },

     getByID: function (gameid, callback) {
          var conn = db.getConnection();
          conn.connect(function (err) {
               if (err) {
                    console.log(err);
                    return callback(err, null);
               }
               else {
                    console.log("Connected !");
                    var sql = `
                    SELECT 
                         r.fk_gameID, r.content, r.rating, u.username, r.created_at
                    FROM 
                         reviews AS r, 
                         user AS u
                    WHERE 
                         u.userid = r.fk_userID
                         AND r.fk_gameID = ?
                    `;

                    conn.query(sql, [gameid], function (err, result) {
                         conn.end();

                         if (err) {
                              console.log(err);
                              return callback(err, null);
                         }
                         else {
                              if (result.length == 0) {
                                   return callback(null, null);
                              }
                              else {
                                   return callback(null, result);
                              }
                         }
                    });
               }
          });
     },

     getAverage: function (gameid, callback) {
          var conn = db.getConnection();
          conn.connect(function (err) {
               if (err) {
                    console.log(err);
                    return callback(err, null);
               }
               else {
                    console.log("Connected !");
                    var sql = `
                    SELECT 
                         AVG(rating) 'Average_Rating'
                    FROM 
                         reviews
                    WHERE 
                         fk_gameID = ?
                    `;

                    conn.query(sql, [gameid], function (err, result) {
                         conn.end();

                         if (err) {
                              console.log(err);
                              return callback(err, null);
                         }
                         else {
                              if (result.length == 0) {
                                   return callback(null, null);
                              }
                              else {
                                   return callback(null, result);
                              }
                         }
                    });
               }
          });
     },



};


//----------------------------------------------
// exports
//----------------------------------------------
module.exports = Review;
