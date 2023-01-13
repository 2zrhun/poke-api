const bcrypt = require("bcrypt");
const { application } = require("express");
const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET_CODE = "secret_code";
const axios = require("axios");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");
const dbo2 = require("../db/conn2");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

const { FifoMatchmaker } = require("matchmaking");
const matchmaker = require("simple-matchmaker");

recordRoutes.route("/getFight/:id").get(async function (req, res) {
  let db_connect = dbo.getDb("my_poke");
  let myId = req.params.id;

  let myquery = { isbool: true };
  ////////////////////////////////

  ///////////////////////////////
  const Us = db_connect.collection("user");

  const user2 = await db_connect
    .collection("user")
    .aggregate([{ $match: { isbool: true, _id: { $ne: ObjectId(myId) } } }])
    .toArray();
  //console.log("AGGREGATE", resg);
  //
  //{ $sample: { size: 2 } },
  //console.log("AGGREGATE 2", user2.length);
  let min = Math.ceil(0);
  let max = Math.floor(user2.length);
  let random_pokeid = [Math.floor(Math.random() * (max - min) + min)];
  let i = 0;
  //for (i == 0; i < user2.length; i++) {
  console.log("random user", user2[random_pokeid]);
  console.log("random username", user2[random_pokeid].username);
  // }
  //console.log("wwqq", user2);
  Us.findOne(
    {
      isbool: true,
      _id: { $ne: ObjectId(myId) },
      username: user2[random_pokeid].username,
    },
    function (err, result) {
      let player1 = { id: req.params.id };
      if (err) throw err;
      console.log("BOOL for matchmaking", result);
      console.log("BOOL for matchmaking ID :", JSON.stringify(result._id));
      console.log("BOOL for matchmaking NAME : ", result.username);

      let mquery2 = { UserId: ObjectId(result._id) };

      db_connect
        .collection("records")
        .find({ UserId: ObjectId(result._id) })
        .toArray(function (err, result2) {
          if (err) throw err;
          // res.json(result);
          let i = 0;
          let hpPlayer2 = [];
          let AttackPlayer2 = [];
          let orderPlayer2 = [];
          let defensePlayer2 = [];
          console.log("ss", result2);
          for (i == 0; i < result2.length; i++) {
            hpPlayer2.push(result2[i].hp);
            AttackPlayer2.push(result2[i].attack);
            orderPlayer2.push(result2[i].order);
            defensePlayer2.push(result2[i].defense);
          }
          console.log("PUSHING EVERY HP ", hpPlayer2);
          console.log("PUSHING EVERY Attack", AttackPlayer2);
          console.log("PUSHING EVERY order", orderPlayer2);
          console.log("PUSHING EVERY defense", defensePlayer2);
          // console.log("ADVERSAIRE", result2);
          // console.log("HP ADVERSAIRE", result2[0].hp);
          ///////////////////////////////////////////////////////////////////
          db_connect
            .collection("records")
            .find({ UserId: ObjectId(myId) })
            .toArray(function (err, res3) {
              if (err) throw err;
              // res.json(result);
              let i = 0;
              let hpPlayer1 = [];
              let AttackPlayer1 = [];
              let orderPlayer1 = [];
              let defensePlayer1 = [];
              console.log("ss", res3);
              for (i == 0; i < res3.length; i++) {
                hpPlayer1.push(res3[i].hp);
                AttackPlayer1.push(res3[i].attack);
                orderPlayer1.push(res3[i].order);
                defensePlayer1.push(res3[i].defense);
              }
              //let ind = 0;

              console.log("HP 2", hpPlayer1);

              console.log("ATTACK", AttackPlayer1);
              console.log("PUSHING EVERY order", orderPlayer1);
              console.log("PUSHING EVERY defense", defensePlayer1);
              let player2 = { id: result._id };

              let players = [];
              players.push(player1);
              players.push(player2);

              function runGame(players) {
                //console.log("Game started with:", players);
                //let min = Math.ceil(1);
                //let max = Math.floor(players.length);
                //let random_pokeid = [
                //  Math.floor(Math.random() * (max - min) + min),
                //];
                let i = 0;
                //for (i == 0; i < user2.length; i++) {
                //console.log("starttab", players[random_pokeid]);
                //console.log("starting players", players[random_pokeid]);

                let startingPlayer =
                  players[Math.floor(Math.random() * players.length)];
                console.log("players", players);
                console.log("startingPlayer", startingPlayer);

                if (startingPlayer == player1) {
                  console.log("player1 starts", player1);
                  let sumhpPlayer1 = 0;

                  for (let x = 0; x < hpPlayer1.length; x++) {
                    sumhpPlayer1 += hpPlayer1[x];
                  }
                  console.log("the sumhpPlayer1m", sumhpPlayer1);

                  let y = 0;
                  let FinalHpPlayer1 = sumhpPlayer1;
                  let resultatHP1 = 0;
                  let sumPvperdus = 0;
                  // do {
                  for (
                    y == 0;
                    y in hpPlayer1 &&
                    y in defensePlayer2 &&
                    y in orderPlayer1 &&
                    y in AttackPlayer1;
                    y++
                  ) {
                    let Pvperdux =
                      (((orderPlayer2[y] * 0.4 + 2) * AttackPlayer2[y]) /
                        defensePlayer1[y]) *
                        0.85 +
                      1.7;
                    sumPvperdus += Pvperdux;

                    console.log("tes for i1 ", Pvperdux);
                    resultatHP1 = FinalHpPlayer1 - Pvperdux;
                  }
                  console.log("sum PVperdus", sumPvperdus);
                  console.log("final res pl1", resultatHP1);

                  let Pvperdu1 =
                    (((orderPlayer2[i] * 0.4 + 2) * AttackPlayer2[i]) /
                      defensePlayer1[i]) *
                      0.85 +
                    1.7;

                  console.log("end match", resultatHP1);
                  console.log("HPPLAYER", hpPlayer1[i]);
                  console.log("defense", defensePlayer2[i]);
                  console.log("attack", AttackPlayer2[i]);
                  console.log("order", orderPlayer2[i]);
                  console.log("Pvperdu1", Pvperdu1);
                  if (Pvperdu1 >= hpPlayer1[i]) {
                    hpPlayer1.splice(i, 1);
                    AttackPlayer1.splice(i, 1);
                    orderPlayer1.splice(i, 1);
                    defensePlayer1.splice(i, 1);
                  }
                  console.log("spliced hp1", hpPlayer1);
                  //} while (hpPlayer1.length > 0 && hpPlayer2.length > 0);
                }
                if (startingPlayer == player2) {
                  console.log("player2 starts", player2);
                  let i = 0;

                  //let FinalHpPlayer2 = sumhpPlayer2;

                  //do {
                  ////////////////////////
                  let sumhpPlayer2 = 0;

                  for (let x = 0; x < hpPlayer2.length; x++) {
                    sumhpPlayer2 += hpPlayer1[x];
                  }
                  let FinalHpPlayer2 = sumhpPlayer2;
                  let z = 0;
                  let resultatHP2 = 0;
                  let sumPvperdus = 0;

                  for (
                    z == 0;
                    z in hpPlayer2 &&
                    z in defensePlayer1 &&
                    z in orderPlayer2 &&
                    z in AttackPlayer2;
                    z++
                  ) {
                    let Pvperduz =
                      (((orderPlayer1[z] * 0.4 + 2) * AttackPlayer1[z]) /
                        defensePlayer2[z]) *
                        0.85 +
                      1.7;
                    sumPvperdus += Pvperduz;

                    console.log("tes for i2 ", Pvperduz);
                    resultatHP2 = FinalHpPlayer2 - Pvperduz;
                  }
                  console.log("sum PVperdus", sumPvperdus);
                  console.log("final res pl2", resultatHP2);
                  ///////////////////////

                  let Pvperdu2 =
                    (((orderPlayer2[i] * 0.4 + 2) * AttackPlayer2[i]) /
                      defensePlayer1[i]) *
                      0.85 +
                    1.7;

                  resultatHP2 = FinalHpPlayer2 - Pvperdu2;

                  if (Pvperdu2 >= hpPlayer2[i]) {
                    hpPlayer2.splice(i, 1);
                    AttackPlayer2.splice(i, 1);
                    orderPlayer2.splice(i, 1);
                    defensePlayer2.splice(i, 1);
                  }
                  console.log("end match", resultatHP2);
                  console.log("splicedHP2", hpPlayer2);
                  //} while (hpPlayer2.length > 0 && hpPlayer1.length > 0);
                }
                resultatHP2 = hpPlayer2;
                resultatHP1 = hpPlayer1;

                if (hpPlayer1 > hpPlayer2) {
                  console.log("The winner is player1", player1);
                  console.log("The loser is player2", player2);
                  db_connect
                    .collection("user")
                    .findOne(
                      { _id: ObjectId(player1.id) },
                      function (err, resname) {
                        if (err) throw err;
                        console.log("rrr", resname);
                        if (resname.piece >= 0) {
                          let myquery = { _id: ObjectId(resname._id) };
                          let newvalues = {
                            $set: {
                              piece: resname.piece + 1,
                            },
                          };
                          db_connect
                            .collection("user")
                            .updateOne(myquery, newvalues, function (err, res) {
                              console.log("1 document updated , !!");
                              if (err) throw err;
                              response.json(res);
                            });
                        } else {
                          console.log("plus d argent ");
                        }

                        //console.log("this is the results!!", result);
                        return res.status(200).send({
                          message: "GAME STARTED",
                          adversaire: result.username,
                          allEnPokes: result2,
                          Winner: resname.username,
                          loser: player1,
                          piece: 1,
                        });
                      }
                    );
                } else {
                  console.log("The winner is player2", player2.id);
                  console.log("The loser is player1", player1);
                  console.log("getting player name", player2.username);
                  db_connect
                    .collection("user")
                    .findOne(
                      { _id: ObjectId(player2.id) },
                      function (err, resname) {
                        if (err) throw err;
                        console.log("rrr", resname);
                        //console.log("this is the results!!", result);
                        let myquery = { _id: ObjectId(resname._id) };
                        if (resname.piece >= 0) {
                          let newvalues = {
                            $set: {
                              piece: resname.piece + 1,
                            },
                          };
                          db_connect
                            .collection("user")
                            .updateOne(myquery, newvalues, function (err, res) {
                              console.log("1 document updated , !!");
                              if (err) throw err;
                              console.log("doc has been changed", res);
                            });
                        } else {
                          console.log("plus d argent ");
                        }
                        return res.status(200).send({
                          message: "GAME STARTED",
                          adversaire: result.username,
                          allEnPokes: result2,
                          Winner: resname.username,
                          loser: player1,
                          piece: 1,
                        });
                      }
                    );
                }
              }

              function getPlayerKey(player1, player2) {
                //console.log("the ids of players", player1.id, player2.id);
                return player1.id, player2.id;
              }
              let cnt = constructor(
                runGame(players),
                getPlayerKey(player1, player2)
              );

              //console.log("the constructor is working");

              let mm = new FifoMatchmaker(cnt, { checkInterval: 2000 });
              //mm.push(player1);
              // mm.push(player2);
              //console.log("MM:", mm);
              /* {
                return res.status(200).send({
                  message: "GAME STARTED",
                  adversaire: result.username,
                  allEnPokes: result2,
                });
                console.log("The game is over ");
              }*/
            });
        });
    }
  );
});

// This section will help you get a list of all the records.
recordRoutes.route("/record/:id").get(function (req, res) {
  let UserId = req.params.id;
  let db_connect = dbo.getDb("my_poke");
  console.log("poke parrr id", UserId);
  db_connect
    .collection("records")
    .find({ UserId: ObjectId(UserId) })
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
      //console.log("this is the results!!", result);
    });
  /*db_connect.collection("records").findOne(UserId, function (err, result) {
    if (err) throw err;
    res.json(result);
  });*/
});

// This section will help you get a single record by id
recordRoutes.route("/recordd/:id").get(function (req, res) {
  //<App />;
  let db_connect = dbo.getDb("my_poke");
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("records").findOne(myquery, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

// This section will help you create a new record.
recordRoutes.route("/record/add/:id").post(function (req, response) {
  // <App />;
  //const name=props.name
  let db_connect = dbo.getDb();
  //let myquery = { _id: ObjectId(req.params.id) };

  let myobj = {
    UserId: ObjectId(req.params.id),
    new_id: req.body.new_id,
    name: req.body.name,
    new_types: req.body.new_types,
    new_image: req.body.new_image,
    isbool: Boolean(false),
    hp: req.body.hp,
    attack: req.body.attack,
    order: req.body.order,
    defense: req.body.defense,
  };
  console.log("the new", myobj.UserId);
  //let db_connect = dbo.getDb("my_poke");

  db_connect.collection("records").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
    console.log("voici l erreurrr", err);
  });
});

// This section will help you create a new record.
recordRoutes.route("/connexion").post(function (req, response) {
  const rounds = 2;
  let db_connect = dbo.getDb();
  let myobj = {
    username: req.body.username,
    password: req.body.password,
    isbool: Boolean(false),
    piece: 4,
  };
  let username = { username: myobj.username };
  db_connect.collection("user").findOne(username, function (err, result) {
    if (err) throw err;
    console.log("jai tr", result);
    if (result) {
      response.send({
        code: 401,
        message: "Username already chosen",
      });
      return;
    } else {
      bcrypt.hash(myobj.password, rounds, (err, hash) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("myBoolean", myobj.isbool);
        console.log("voici le hashage ! ", hash);
        let new_obj = {
          username: req.body.username,
          password: hash,
          isbool: Boolean(false),
          piece: 4,
        };

        db_connect.collection("user").insertOne(new_obj, function (err, res) {
          if (err) throw err;
          response.send({ message: "User successfully created and saved !" });
          // response.json(res);
          console.log("il ya une erreur... ", err);
        });
      });
    }
  });
});
recordRoutes.route("/connexion/verification").post(function (req, response) {
  const username = req.headers.username;

  const rounds = 1;

  let db_connect = dbo.getDb();
  let myobj = {
    username: req.body.username,
    password: req.body.password,
  };
  console.log(myobj.username);
  bcrypt.hash(myobj.password, rounds, (err, hash) => {
    if (err) {
      console.error(err);
      return;
    }
    //console.log("hashage lors de la connexion ! ", hash);
    let new_obj = {
      username: req.body.username,
      password: hash,
    };
    //console.log("recuperer ce qu il ya dans bdd", myobj);
    const user = db_connect
      .collection("user")
      .findOne({ username: myobj.username }, function (err, result) {
        console.log("GETING the Id", result);
        if (err) throw err;
        if (result == null) {
          response.send({
            code: 401,
            message: "Dont found this user in the database",
          });
          return;
        } else {
          if (myobj.username != result.username) {
            response.send({ message: "wrong username/password combination !" });
          }

          bcrypt.compare(myobj.password, result.password, (err, res) => {
            if (result.length > 0) {
              response.send({ message: "You are successfully connected  !" });
              console.log("l'utilisateur existe ");
            }

            if (err) {
              console.error(err);
              return;
            }
            const token = jwt.sign(
              {
                username: result.username,
                password: result.password,
              },
              JWT_SECRET_CODE,
              { expiresIn: "24h" }
            );
            if (res == true) {
              console.log("Vous etes connecte !", token);
              return response.status(200).send({
                message: "vous etes BIEN connecte !",
                username: result.username,
                token: token,
                userId: result._id,
              });
            }
            if (res == false) {
              response.send({
                message: "wrong username/password combination !",
              });
              console.log("nom d'utilisateur ou mot de passe incorrect");
            }
            console.log(res); //true or false
            return;
          });
        }
      });

    //console.log("searched user", user);
  });
});

// This section will help you update a record by id...
recordRoutes.route("/update/:id").post(function (req, response) {
  //let db_connect = dbo.getDb();
  let UserId = req.params.id;
  let db_connect = dbo.getDb("my_poke");
  db_connect
    .collection("user")
    .find({ _id: ObjectId(UserId) })
    .toArray(function (err, result) {
      if (err) throw err;
      console.log("result.is", result);

      let myquery = { _id: ObjectId(result[0]._id) };

      let newvalues = {
        $set: {
          isbool: Boolean(true),
        },
      };
      db_connect
        .collection("user")
        .updateOne(myquery, newvalues, function (err, res) {
          console.log("1 document updated , !!");
          if (err) throw err;
          //response.json(res);
        });
    });
});
/////////////////////////////////////////////////////
recordRoutes.route("/updatefalse/:id").post(function (req, response) {
  //let db_connect = dbo.getDb();
  let UserId = req.params.id;
  let db_connect = dbo.getDb("my_poke");
  db_connect
    .collection("user")
    .find({ _id: ObjectId(UserId) })
    .toArray(function (err, result) {
      if (err) throw err;

      let myquery = { _id: ObjectId(result[0]._id) };
      let newvalues = {
        $set: {
          isbool: Boolean(false),
        },
      };
      db_connect
        .collection("user")
        .updateOne(myquery, newvalues, function (err, res) {
          console.log("1 document updated , !!");
          if (err) throw err;
          response.json(res);
        });
    });
});
////////////////////////////////////////////////////////////////
recordRoutes.route("/updatepiece/:id").post(function (req, response) {
  //let db_connect = dbo.getDb();
  let UserId = req.params.id;
  let db_connect = dbo.getDb("my_poke");
  db_connect
    .collection("user")
    .find({ _id: ObjectId(UserId) })
    .toArray(function (err, result) {
      if (err) throw err;

      let myquery = { _id: ObjectId(result[0]._id) };
      console.log("piece", result[0].piece);
      if (result[0].piece > 0) {
        let newvalues = {
          $set: {
            piece: result[0].piece - 1,
          },
        };
        db_connect
          .collection("user")
          .updateOne(myquery, newvalues, function (err, res) {
            console.log("1 document updated , !!");
            if (err) throw err;
            response.json(res);
          });
      } else {
        console.log("plus d argent ");
      }
    });
});
////////////////////////////////////////////////////
recordRoutes.route("/updatemorpiece").post(function (req, response) {
  //let db_connect = dbo.getDb();
  let username = req.body.username;
  let db_connect = dbo.getDb("my_poke");
  db_connect
    .collection("user")
    .find({ username: username })
    .toArray(function (err, result) {
      if (err) throw err;

      let myquery = { _id: ObjectId(result[0]._id) };
      console.log("piece", result[0].piece);
      if (result[0].piece >= 0) {
        let newvalues = {
          $set: {
            piece: result[0].piece + 1,
          },
        };
        db_connect
          .collection("user")
          .updateOne(myquery, newvalues, function (err, res) {
            console.log("1 document updated , !!");
            if (err) throw err;
            response.json(res);
          });
      } else {
        console.log("apres gain UNE PIECE A ETE ajoute  ");
      }
    });
});
///////////////////////////////////////////////////
// This section will help you delete a record
recordRoutes.route("/record/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("records").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.json(obj);
  });
});

module.exports = recordRoutes;
