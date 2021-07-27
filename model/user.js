console.log("----------------------------------------");
console.log("P08_friendbookFrontBack > backend > model > user.js");
console.log("---------------------------------------");

//----------------------------------------------
// imports
//----------------------------------------------
var db = require('../controller/databaseConfig');


//----------------------------------------------
// objects/ functions
//----------------------------------------------
var User = {
     verify: function (username, password, callback) {
          var dbConn = db.getConnection();
          dbConn.connect(function (err) {
          
            //database connection gt issue!
            if (err) {
              console.log(err);
              return callback(err, null);
            } 
            
            else {
              const query = `
               SELECT 
                    * 
               FROM
                    user 
               WHERE 
                    username=? 
                    AND password=?;
               `
      
              dbConn.query(query, [username, password], (error, results) => {
                if (error) {
                  callback(error, null);
                  return;
                }
                // any query that involves a select statement, select statement always returns an array(even if there nothing is in the array -> null)
                if (results.length === 0) {
                  return callback(null, null);
      
                } 
               // -> In this example, results[0] is the only element in the result sarray
                else {
                  const user = results[0];
                  return callback(null, user);
                }
              });
            }
          });
     },
      
      


     findByID: function (id, callback) {
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
                              id, full_name, username, bio, date_of_birth, created_at 
                         FROM 
                              user 
                         WHERE 
                              id = ?
                         `;

                    conn.query(sql, [id], function (err, result) {
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
                                   return callback(null, result[0]);    // <- returns index 0 because of the presence of primary key (id)
                              }
                         }
                    });
               }
          });
     },

     findAll: function (callback) {
          var conn = db.getConnection();
          conn.connect(function (err) {
               if (err) {
                    console.log(err);
                    return callback(err, null);
               }
               else {
                    console.log("Connected!");
                    var sql = `
                    SELECT
                         id, full_name, username, bio, date_of_birth, created_at
                    FROM 
                         user
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

     insert: function (user , callback) {              // user is a JSON object
          var full_name       = user.full_name;
          var username        = user.username;
          var bio             = user.bio;
          var date_of_birth   = user.date_of_birth;

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
                         user 
                         (full_name, username, bio, date_of_birth)
                    
                    VALUES
                    (?, ?, ?, ? ); 
                    `;

                    conn.query(sql, [full_name, username, bio, date_of_birth],
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

     edit: function (userID, user, callback) {
          var full_name       = user.full_name;
          var username        = user.username;
          var bio             = user.bio;
          var date_of_birth   = user.date_of_birth;

          var conn = db.getConnection();

          conn.connect(function (err) {
               if (err) {
                    console.log(err);
                    return callback(err, null);
               }
               else {
                    console.log("Connected!");
                    var sql = `
                    UPDATE
                         user
                    SET
                         full_name = ?,
                         username = ?,
                         bio = ?,
                         date_of_birth = ?
                    WHERE 
                         id = ?;
                    `;

                    conn.query(sql, [full_name, username, bio, date_of_birth, userID],
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

     delete: function (userID, callback) {
          var conn = db.getConnection();
          conn.connect(function (err) {
               if (err) {
                    console.log(err);
                    return callback(err, null);
               }
               else {
                    console.log("Connected!");

                    var sql = `
                    DELETE FROM 
                         user 
                    WHERE 
                         id = ?
                    `;

                    conn.query(sql, [userID], function (err, result) {
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

     addFriend: function (userIDOne, userIDTwo, callback) {  
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
                         friendship
                         (fk_friend_one_id, fk_friend_two_id)
                    
                    VALUES
                         (?, ?);
                    
                    INSERT INTO 
                         friendship
                         (fk_friend_two_id, fk_friend_one_id)
                    
                    VALUES
                         (?, ?);
                    `;

                    conn.query(sql, [userIDOne, userIDTwo],
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

};


//----------------------------------------------
// exports
//----------------------------------------------
module.exports = User;
