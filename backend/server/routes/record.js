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

// This section will help you get a list of all the records.
recordRoutes.route("/record").get(function (req, res) {
  let db_connect = dbo.getDb("my_poke");
  db_connect
    .collection("records")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you get a single record by id
recordRoutes.route("/record/:id").get(function (req, res) {
  //<App />;
  let db_connect = dbo.getDb("my_poke");
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("records").findOne(myquery, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

// This section will help you create a new record.
recordRoutes.route("/record/add").post(function (req, response) {
  // <App />;
  //const name=props.name
  let db_connect = dbo.getDb();
  let myobj = {
    new_id: req.body.new_id,
    name: req.body.name,
    new_types: req.body.new_types,
    new_image: req.body.new_image,
  };
  db_connect.collection("records").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
    console.log("voici l erreur", err);
  });
});

// This section will help you create a new record.
recordRoutes.route("/connexion").post(function (req, response) {
  const rounds = 2;

  let db_connect = dbo.getDb();
  let myobj = {
    username: req.body.username,
    password: req.body.password,
  };
  bcrypt.hash(myobj.password, rounds, (err, hash) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("voici le hashage ! ", hash);
    let new_obj = {
      username: req.body.username,
      password: hash,
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
    console.log("hashage lors de la connexion ! ", hash);
    let new_obj = {
      username: req.body.username,
      password: hash,
    };
    console.log("recuperer ce qu il ya dans bdd", myobj);
    const user = db_connect
      .collection("user")
      .findOne({ username: myobj.username }, function (err, result) {
        if (err) throw err;
        //console.log("testt", result.password);
        //response.json(result);
        if (myobj.username != result.username) {
          response.send({ message: "wrong username/password combination !" });
        }

        bcrypt.compare(myobj.password, result.password, (err, res) => {
          if (result.length > 0) {
            //response.send(result);
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
            });
          } else {
            response.send({ message: "wrong username/password combination !" });
            console.log("nom d'utilisateur ou mot de passe incorrect");
          }
          console.log(res); //true or false
        });
      });

    //console.log("searched user", user);
  });
});

// This section will help you update a record by id.
recordRoutes.route("/update/:id").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  let newvalues = {
    $set: {
      new_id: req.body.new_id,
      name: req.body.name,
      new_types: req.body.new_types,
      new_image: req.body.new_image,
    },
  };
  db_connect
    .collection("records")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.json(res);
    });
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
