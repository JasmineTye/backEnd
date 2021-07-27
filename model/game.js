/*
     Name: Jasmine Tye Jia Wen
     Class: DIT/FT/1B/05
     Admin No: p2036137
*/

console.log("----------------------------------------");
console.log("CA1_games  > model > game.js");
console.log("---------------------------------------");




//----------------------------------------------
// imports
//----------------------------------------------
var db = require('../controller/databaseConfig');

//----------------------------------------------
// objects/ functions
//----------------------------------------------
const Game = {
  getAll: function (callback) {
    var conn = db.getConnection();

    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      else {
        console.log("Connected !");
        var sql =
        ` 
        SELECT 
          *
        FROM 
          game
    
        `;

        conn.query(sql, [], function (err, result) {
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
                      g.gameid, g.title, g.description, g.price, g.platform, g.year, g.pic,
                      c.catname     
                   FROM 
                      game AS g,
                      category AS c
                   WHERE 
                      g.categoryid = c.catid
                      AND gameid = ?
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
                             return callback(null, result[0]);    // <- returns index 0 because of the presence of primary key (id)
                        }
                   }
              });
         }
    });
},


  addGame: function (title, description, price, platform, categoryid, year, pic, callback) {
    var conn = db.getConnection();

    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      else {
        console.log("Connected!");
        var sql = `
                INSERT INTO
                    game
                    (title, description, price, platform, categoryid, year, pic)

                VALUES
                    (?, ?, ?, ?, ?, ?, ?); 
                `;

        conn.query(sql, [title, description, price, platform, categoryid, year, pic],
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

  getByPlatform: function (platform, callback) {
    var conn = db.getConnection();

    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      else {
        console.log("Connected !");
        var sql =
        ` 
        SELECT 
          g.gameid, g.title, g.description, g.price, g.platform,
          c.catid, c.catname,
          g.year, g.created_at

        FROM 
          game as g,
          category as c
        
        WHERE 
          g.categoryid = c.catid
          AND platform = ?;
        `;

        conn.query(sql, [platform], function (err, result) {
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

  deleteGame: function (gameid, callback) {
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
                game
                  
              WHERE 
                gameid = ?;
                              
              `;

        conn.query(sql, [gameid], function (err, result) {
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

  updateGame: function (title, description, price, platform, categoryid, year, gameid, callback) {
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
              game
            
            SET
              title = ?,
              description = ?, 
              price = ?,
              platform = ?,
              categoryid = ?,
              year = ?
            
            WHERE 
              gameid = ?;
            `;
 
        conn.query(sql, [title, description, price, platform, categoryid, year, gameid],
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

  getByTitlePricePlat: function (title, price, platform, callback) {
    var conn = db.getConnection();

    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      else {
        console.log("Connected !");
        var searchTitle = `"%${title}%"`;
        var searchPrice = `${price}`;
        var searchPlatform = `"${platform}"`;

        var sql =
        ` 
          SELECT 
          g.*, c.catname 
        
        FROM 
          game as g,
          category as c
        
        WHERE 
          g.categoryid = c.catid
          AND title LIKE ${searchTitle}
          AND price < ${searchPrice}
          AND platform = ${searchPlatform}
        `;

        conn.query(sql, [title, price, platform], function (err, result) {
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

}


//----------------------------------------------
// exports
//----------------------------------------------
module.exports = Game;
