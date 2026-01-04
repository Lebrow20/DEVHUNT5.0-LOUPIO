import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import userRoute from "./routes/userRoute.js";
import db from "./config/Database.js";

const connexion = db;

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.use(userRoute);


const PORT = 3002;

app.listen(PORT, () => {
  console.log("Port d'écoute: ", PORT);
});

connexion
  .sync({ alter: true })
  .then(() => { console.log("Base de donnée et table créés") })
  .catch(error => console.log("Il y a une erreur lors de la création de la base de données et de la table: ", error))