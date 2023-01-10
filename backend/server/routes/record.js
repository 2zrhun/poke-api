const bcrypt = require("bcrypt");
const { application } = require("express");
const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET_CODE = "secret_code";

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");
const dbo2 = require("../db/conn2");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
/////////////
/*recordRoutes.route("/firstsave").get(function (req, res) {
  const first_saved = new dbo({ id: id, name: name, types: types });
});*/

const { FifoMatchmaker } = require("matchmaking");
const matchmaker = require("simple-matchmaker");

recordRoutes.route("/getFight/:id").get(function (req, res) {
  let db_connect = dbo.getDb("my_poke");
  let myId = req.params.id;

  let myquery = { isbool: true };
  db_connect
    .collection("user")
    .findOne(
      { isbool: true, _id: { $ne: ObjectId(myId) } },
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
            console.log("ss", result2[1].hp);
            for (i == 0; i < result2.length; i++) {
              hpPlayer2.push(result2[i].hp);
              AttackPlayer2.push(result2[i].attack);
            }
            console.log("PUSHING EVERY HP ", hpPlayer2);
            console.log("PUSHING EVERY Attack", AttackPlayer2);
            // console.log("ADVERSAIRE", result2);
            // console.log("HP ADVERSAIRE", result2[0].hp);
            ///////////////////////////////////////////////////////////////////
            db_connect
              .collection("records")
              .find({ UserId: ObjectId(myId) })
              .toArray(function (err, result2) {
                if (err) throw err;
                // res.json(result);
                let i = 0;
                let hpPlayer1 = [];
                let AttackPlayer1 = [];
                console.log("ss", result2[1].hp);
                for (i == 0; i < result2.length; i++) {
                  hpPlayer1.push(result2[i].hp);
                  AttackPlayer1.push(result2[i].attack);
                }
                console.log("HP 2", hpPlayer1);
                console.log("ATTACK", AttackPlayer1);
                let player2 = { id: JSON.stringify(result._id) };

                let players = [];
                players.push(player1);
                players.push(player2);

                function runGame(players) {
                  console.log(
                    "Game started with:",
                    players,
                    "and",
                    hpPlayer1,
                    hpPlayer2
                  );
                  console.log(player1, player2);
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
                console.log("MM:", mm);
              });

            /*return response.status(200).send({
            message: "vous etes BIEN connecte !",
            username: result.username,
            token: token,
            userId: result._id,
          });*/
            //console.log("mm.push:", mm.getKey);
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
  };
  console.log("the new", myobj.UserId);
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
  };
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
    };

    db_connect.collection("user").insertOne(new_obj, function (err, res) {
      if (err) throw err;
      response.send({ message: "User successfully created and saved !" });
      // response.json(res);
      console.log("il ya une erreur... ", err);
    });
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
        console.log("GETING the Id", result._id);
        if (err) throw err;

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
            response.send({ message: "wrong username/password combination !" });
            console.log("nom d'utilisateur ou mot de passe incorrect");
          }
          console.log(res); //true or false
        });
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
      //console.log("_id of userID:", result);
      //console.log("_id :", result[0]._id);
      //response.json(result);
      //console.log("this is the results!!", result);
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
          response.json(res);
        });
    });
  //console.log("updating is bool");
  /*db_connect
    .collection("records")
    .find({ UserId: ObjectId(UserId) })
    .toArray(function (err, result) {
      if (err) throw err;
      console.log("_id of userID:", result);
      console.log("_id :", result[0]._id);
      response.json(result);
      //console.log("this is the results!!", result);
      let myquery = { _id: ObjectId(result[0]._id) };
      let newvalues = {
        $set: {
          isbool: Boolean(true),
        },
      };
      db_connect
        .collection("records")
        .updateOne(myquery, newvalues, function (err, res) {
          if (err) throw err;
          console.log("1 document updated , !!");
          response.json(res);
        });
    });*/
});

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
