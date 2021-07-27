/*
     Name: Jasmine Tye Jia Wen
     Class: DIT/FT/2B/22
     Admin No: p2036137
*/

console.log("----------------------------------------");
console.log("Planner App > model > task.js");
console.log("---------------------------------------");

//----------------------------------------------
// imports
//----------------------------------------------
var db = require('../controller/databaseConfig');

//----------------------------------------------
// objects/ functions
//----------------------------------------------
var taskDB = {
     addTask: function (title, date, timeFrom, timeTo, colorTag, notes, callback) {
          var conn = db.getConnection();

          conn.connect(function (err) {
               if (err) {

                    console.log(err);
                    return callback(err, null);
               }
               else {
                    var sql = `
                    INSERT INTO
                         task
                         (title, date, timeFrom, timeTo, colorTag, notes)
                    
                    VALUES
                         (?, ?, ?, ?, ?, ?); 
                    `;


                    conn.query(sql, [title, date, timeFrom, timeTo, colorTag, notes],
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

     updateTask: function (title, date, timeFrom, timeTo, colorTag, notes, taskID, callback) {
          var conn = db.getConnection();

          conn.connect(function (err) {
               if (err) {
                    console.log(err);
                    return callback(err, null);
               }
               else {
                    var sql = `
                    UPDATE
                         task
                    SET
                         title = ?,
                         date = ?,
                         timeFrom = ?,
                         timeTo = ?, 
                         colorTag = ?, 
                         notes = ?
                    WHERE 
                         taskID = ?
                    `;

                    conn.query(sql, [title, date, timeFrom, timeTo, colorTag, notes, taskID],
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

     getAllTask: function (callback) {
          var conn = db.getConnection();
          conn.connect(function (err) {
               if (err) {
                    console.log(err);
                    return callback(err, null);
               }
               else {
                    var sql = `
                    SELECT
                         title, date, timeFrom, timeTo, colorTag, notes
                    FROM 
                         task
                    `
                    conn.query(sql, [], function (err, result) {
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

     getTaskByDate: function (date, callback) {
          var conn = db.getConnection();
          var date = date;
          conn.connect(function (err) {
               if (err) {
                    console.log(err);
                    return callback(err, null);
               }
               else {
                    var sql = `
                    SELECT
                         *
                    FROM 
                         task
                    WHERE
                         date = ?
                    ORDER BY
                         timeFrom
                    `
                    conn.query(sql, [date], function (err, result) {
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

     getTaskByID: function (taskID, callback) {
          var conn = db.getConnection();
          conn.connect(function (err) {
               if (err) {
                    console.log(err);
                    return callback(err, null);
               }
               else {
                    var sql = `
                    SELECT
                         *
                    FROM 
                         task
                    WHERE
                         taskID = ?
                    `
                    conn.query(sql, [taskID], function (err, result) {
                         conn.end();
                         if (err) {
                              console.log(err);
                              return callback(err, null);
                         } else {
                              //console.log(result);
                              return callback(null, result);
                         }
                    });
               }
          });
     },

     getTaskByTime: function (date, callback) {
          var conn = db.getConnection();
          var date = date;
          conn.connect(function (err) {
               if (err) {
                    console.log(err);
                    return callback(err, null);
               }
               else {
                    var sql = `
                    SELECT
                         *
                    FROM 
                         task
                    WHERE
                         date = ? and
                         current_time() >= time_format(time(timeFrom), "%H:%i") and 
                         current_time() <= time_format(time(timeTo), "%H:%i")
                    `
                    conn.query(sql, [date], function (err, result) {
                         conn.end();
                         if (err) {
                              console.log(err);
                              return callback(err, null);
                         } else {
                              //console.log(result);
                              return callback(null, result);
                         }
                    });
               }
          });
     },

     deleteTask: function (taskID, callback) {
          var conn = db.getConnection();
          conn.connect(function (err) {
               if (err) {
                    console.log(err);
                    return callback(err, null);
               }
               else {
                    var sql = `
                    DELETE FROM 
                         task 
                    WHERE 
                         taskID = ?
                    `;

                    conn.query(sql, [taskID], function (err, result) {
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

}


//----------------------------------------------
// exports
//----------------------------------------------
module.exports = taskDB;
