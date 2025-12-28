const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const server = express();
server.use(bodyParser.json());
const cors = require("cors"); // mampifandray domaine samy hafa 
server.use(cors());

// CONNEXION

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "gest_affectation",
});

db.connect(function (error) {
  if (error) {
    console.log("Non-connecté");
  } else {
    console.log("Connecté");
  }
});

// PORT
server.listen(8085, function (error) {
  if (error) {
    console.log("Port pas ok");
  } else {
    console.log("Port ok");
  }
});

server.get("/user", (req, res) => {
  //req
  let sql = "SELECT * FROM user";
  db.query(sql, (error, result) => {
    if (error) {
      console.log("erreur", error.message);
      res.status(500).json("Erreur:", error.message);
    } else {
      console.log("result", result);
      res.status(200).json(result);
    }
  });
});

server.post("/user/ajouter", (req, res) => {
  let sql = "INSERT INTO user SET ?";

  const users = {
    pseudo: req.body.pseudo,
    email: req.body.email,
    password: req.body.password,
    lieu_service: req.body.lieu_service,
  };

  db.query(sql, users, (error) => {
    if (error) {
      console.log("erreur dans l'ajout :", error.message);
      res.status(500).send("Erreur dans l'ajout de user");
    } else {
      res.status(200).send("Ajout de user avec succès")
    }
  });
});

server.put('/user/modifier/:id_user', (req, res) => {
  const id_user = req.params.id_user;
  const sql = "UPDATE user SET ? WHERE id_user = ?";

  const users = {
    pseudo: req.body.pseudo,
    email: req.body.email,
    password: req.body.password,
    lieu_service: req.body.lieu_service,
  };
  db.query(sql, [users, id_user], (error) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Une erreur s'est produite lors de la modification du user.");
    } else {
      return res.status(200).send("User modifié avec succès !");
    }
  });
});

server.delete('/user/supprimer/:id_user', (req, res) => {
  const id_user = req.params.id_user;
  const sql = "DELETE FROM user WHERE id_user = ?";

  db.query(sql, [id_user], (error) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Une erreur s'est produite lors de la suppression du user:", error.message);
    } else {
      return res.status(200).send("User supprimé avec succès !");
    }
  });
});

//Affectation
server.get("/affectation", (req, res) => {
  //req
  let sql = "SELECT * FROM affectation";
  db.query(sql, (error, result) => {
    if (error) {
      console.log("erreur", error.message);
      res.status(500).json("Erreur:", error.message);
    } else {
      console.log("result", result);
      res.status(200).json(result);
    }
  });
});

server.post("/affectation/ajouter", (req, res) => {
  let sql = "INSERT INTO affectation SET ?";

  const affectations = {
    nom_aff: req.body.nom_aff,
    lieux_aff: req.body.lieux_aff,
  };

  db.query(sql, affectations, (error) => {
    if (error) {
      console.log("erreur dans l'ajout :", error.message);
      res.status(500).send("Erreur dans l'ajout de l'affectation");
    } else {
      res.status(200).send("Ajout d'affectation avec succès")
    }
  });
});

server.put('/affectation/modifier/:id_aff', (req, res) => {
  const id_aff = req.params.id_aff;
  const sql = "UPDATE affectation SET ? WHERE id_aff = ?";

  const affectations = {
    nom_aff: req.body.nom_aff,
    lieux_aff: req.body.lieux_aff,
  };
  db.query(sql, [affectations, id_aff], (error) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Une erreur s'est produite lors de la modification de l'affectation.");
    } else {
      return res.status(200).send("Affectation modifiée avec succès !");
    }
  });
});

server.delete('/affectation/supprimer/:id_aff', (req, res) => {
  const id_aff = req.params.id_aff;
  const sql = "DELETE FROM affectation WHERE id_aff = ?";

  db.query(sql, [id_aff], (error) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Une erreur s'est produite lors de la suppression de l'affectation:", error.message);
    } else {
      return res.status(200).send("Affectation supprimée avec succès !");
    }
  });
});

//Demande d'affectation
server.get("/demander", (req, res) => {
  //req
  let sql = `SELECT demander.*,user.pseudo, affectation.nom_aff,affectation.lieux_aff 
              FROM demander,user,affectation
              WHERE demander.id_user = user.id_user
              AND demander.id_aff = affectation.id_aff
              ORDER BY num_dmd` ;
  db.query(sql, (error, result) => {
    if (error) {
      console.log("erreur", error.message);
      res.status(500).json("Erreur:", error.message);
    } else {
      console.log("result", result);
      res.status(200).json(result);
    }
  });
});

server.post("/demander/ajouter", (req, res) => {
  let sql = "INSERT INTO demander SET ?";

  const demander = {
    id_user: req.body.id_user,
    id_aff: req.body.id_aff,
    motif: req.body.motif,
    date_dmd: req.body.date_dmd,
  };

  db.query(sql, demander, (error) => {
    if (error) {
      console.log("erreur dans l'ajout :", error.message);
      res.status(500).send("Erreur dans l'ajout de la demande d'affectation");
    } else {
      res.status(200).send("Ajout de la demande d'affectation avec succès")
    }
  });
});

server.put('/demander/modifier/:num_dmd', (req, res) => {
  const num_dmd = req.params.num_dmd;
  const sql = "UPDATE demander SET ? WHERE num_dmd = ?";

  const demander = {
    id_user: req.body.id_user,
    id_aff: req.body.id_aff,
    motif: req.body.motif,
    date_dmd: req.body.date_dmd,
  };
  db.query(sql, [demander, num_dmd], (error) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Une erreur s'est produite lors de la modification de la demande d'affectation.");
    } else {
      return res.status(200).send("Demande d'affectation modifiée avec succès !");
    }
  });
});

server.delete('/demander/supprimer/:num_dmd', (req, res) => {
  const num_dmd = req.params.num_dmd;
  const sql = "DELETE FROM demander WHERE num_dmd = ?";

  db.query(sql, [num_dmd], (error) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Une erreur s'est produite lors de la suppression de la demande d'affectation:", error.message);
    } else {
      return res.status(200).send("Demande d'affectation supprimée avec succès !");
    }
  });
});
